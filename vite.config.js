import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import handlebars from "vite-plugin-handlebars";
import { resolve } from "path";
import glob from "fast-glob";
import fs from "fs";
import path from "path";
import Handlebars from "handlebars";

import { projects } from "./src/data/projects.js";
import { homeData } from "./src/data/home.js";

const base = "/minh-portfolio/";
const projectSlugs = new Set(projects.map((p) => p.slug));
// --- Logic tạo Entry Points cho Build ---

const Helpers = {
  split: (text) => {
    if (typeof text !== "string") return [];
    return text.split("");
  },
  plusOne: (value) => {
    return value + 1;
  },
  isSpace: (value) => value === " ",
  default: (value, fallback) => {
    return value != null && value !== "" ? value : fallback;
  },
};

const getEntryPoints = () => {
  const pages = glob.sync("src/pages/**/*.html", {
    // Loại trừ template gốc để nó không được build thành một trang riêng
    ignore: ["src/pages/project/index.html"],
  });

  const entryPoints = {};

  pages.forEach((pagePath) => {
    let name = pagePath
      .replace(/^src\/pages\//, "") // bỏ luôn "pages/"
      .replace(/index\.html$/, "") // xóa index.html
      .replace(/\.html$/, "") // xóa .html
      .replace(/\/$/, "");

    // Xử lý trang chủ
    if (name === "index") {
      name = "index";
    } else if (name.endsWith("/index")) {
      name = name.slice(0, -6);
    }

    entryPoints[name] = resolve(__dirname, pagePath);
  });

  return entryPoints;
};
const createDynamicPagesPlugin = (options) => {
  return {
    name: options.name,
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const match = req.url.match(options.regex);
        if (match) {
          const contextData = options.getData(match);
          if (contextData) {
            try {
              // TẠO INSTANCE HANDLEBARS RIÊNG BIỆT
              const hbs = Handlebars.create();
              Object.entries(Helpers).forEach(([name, fn]) => {
                hbs.registerHelper(name, fn);
              });
              // ĐĂNG KÝ TẤT CẢ PARTIALS TỪ THƯ MỤC `partials`
              const partialsDir = resolve(__dirname, "src/partials");
              const partialFiles = fs.readdirSync(partialsDir, {
                recursive: true,
              });
              partialFiles.forEach((file) => {
                if (file.endsWith(".hbs") || file.endsWith(".html")) {
                  const name = file
                    .replace(/\\/g, "/")
                    .replace(/\.(hbs|html)$/, "");
                  const content = fs.readFileSync(
                    path.join(partialsDir, file),
                    "utf8"
                  );
                  hbs.registerPartial(name, content);
                }
              });

              // ĐĂNG KÝ LAYOUT `main`
              const layoutContent = fs.readFileSync(
                resolve(__dirname, "src/layouts/main.hbs"),
                "utf8"
              );
              hbs.registerPartial("main", layoutContent);

              // Đọc và biên dịch template bằng instance đã được cấu hình
              const templateContent = fs.readFileSync(
                options.templatePath,
                "utf-8"
              );
              const template = hbs.compile(templateContent);

              const finalHtml = template(contextData);
              const renderedHtml = await server.transformIndexHtml(
                req.url,
                finalHtml
              );

              res.statusCode = 200;
              res.setHeader("Content-Type", "text/html");
              res.end(renderedHtml);
              return;
            } catch (e) {
              console.error(`[${options.name}] Error rendering page:`, e);
              next(e);
            }
          }
        }
        next();
      });
    },
  };
};
const dynamicProjectPages = createDynamicPagesPlugin({
  name: "dynamic-projects-pages",
  regex: /^\/projects\/([a-z0-9-]+)\.html$|^\/minh-portfolio\/projects\/([a-z0-9-]+)\/?$/,
  templatePath: resolve(__dirname, "src/pages/project/index.html"),
  getData: (match) => {
    const slug = match[1] || match[2]; // Lấy slug từ một trong hai group bắt được
    const project = projects.find((d) => d.slug === slug);
    if (!project) return null;
    return {
      project: project,
      dataPage: "68b1b87bc65c6c6d1cecfb9a",
      baseUrl: base, // Thêm baseUrl vào context
    };
  },
});

export default defineConfig({
  // Thư mục gốc của dự án
  base: base,
  root: "./src",
  publicDir: "../public",
  plugins: [
    {
      name: "custom-dev-server-middleware",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          let url = req.url;

          // Xử lý trang chủ
          if (url === "/") {
            req.url = "/minh-portfolio/pages/";
          }
          // Xử lý các URL project động (không có .html)
          if (url.startsWith("/projects/")) {
            const slug = url
              .substring("/projects/".length)
              .replace(/\.html$/, "");
            if (projectSlugs.has(slug)) {
              // Rewrite URL để plugin dynamicProjectPages có thể bắt được
              req.url = `/projects/${slug}.html`;
            }
            return next();
          }
          if (
            !url.endsWith(".html") &&
            url.lastIndexOf(".") < url.lastIndexOf("/")
          ) {
            // Bỏ tiền tố "/minh-portfolio/"
            const relativePath = url.replace(/^\/minh-portfolio\//, "");
            console.log("URL gốc:", url);
            console.log("Relative path:", relativePath);

            const potentialPath = resolve(
              __dirname,
              "src",
              "pages",
              relativePath
            );
            if (fs.existsSync(potentialPath)) {
              req.url = `/minh-portfolio/pages/${relativePath}/`;
            }
          }

          next();
        });
      },
    },
    dynamicProjectPages,
    handlebars({
      partialDirectory: [
        resolve(__dirname, "src/partials"),
        resolve(__dirname, "src/layouts"), // Thêm cả layouts vào đây để dễ quản lý
      ],
      context(pageData) {
        return {
          baseUrl: base,
          homeData,
          ...pageData,
        };
      },
      helpers: Helpers,
    }),
    tailwindcss(),
  ],
  // Thư mục build output

  build: {
    rollupOptions: {
      input: getEntryPoints(),
      output: {
        // Cấu hình để output ra thư mục gốc của project/dist
        dir: resolve(__dirname, "dist"),
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`,
      },
    },
    // Đảm bảo thư mục build nằm ở gốc project
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    outDir: resolve(__dirname, "dist"),
  },
});
