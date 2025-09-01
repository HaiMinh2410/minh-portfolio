// build-projects.js
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { projects } from './src/data/projects.js'; // Đảm bảo đường dẫn chính xác

const __dirname = path.resolve();
const base = '/minh-portfolio/'; // Định nghĩa base URL ở đây

// --- Đăng ký Partials cho Handlebars ---
const registerPartials = () => {
  const partialsDir = path.resolve(__dirname, 'src/partials');
  const layoutsDir = path.resolve(__dirname, 'src/layouts');
  
  const registerDirectory = (dir) => {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    files.forEach(file => {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        registerDirectory(fullPath);
      } else if (file.name.endsWith('.hbs')) {
        const name = path.relative(partialsDir, fullPath)
          .replace(/\\/g, '/')
          .replace(/\.hbs$/, '');
        const content = fs.readFileSync(fullPath, 'utf8');
        Handlebars.registerPartial(name, content);
      }
    });
  };
  
  registerDirectory(partialsDir);
  // Đăng ký layout main một cách riêng biệt để dễ dùng
  const mainLayoutContent = fs.readFileSync(path.join(layoutsDir, 'main.hbs'), 'utf8');
  Handlebars.registerPartial('main', mainLayoutContent);
};

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

const registerHelpers = () => {
  Object.entries(Helpers).forEach(([name, fn]) => {
    Handlebars.registerHelper(name, fn);
  });
}
// --- Hàm chính để tạo trang ---
const generateProjectPages = () => {
  console.log('Generating dynamic project pages...');

  registerPartials();
  registerHelpers();

  const templatePath = path.resolve(__dirname, 'src/pages/project/index.html');
  const templateContent = fs.readFileSync(templatePath, 'utf8');
  const template = Handlebars.compile(templateContent);

  const outputBaseDir = path.resolve(__dirname, 'src/pages/projects');

  // Xóa thư mục cũ nếu có để đảm bảo sạch sẽ
  if (fs.existsSync(outputBaseDir)) {
    fs.rmSync(outputBaseDir, { recursive: true, force: true });
  }

  projects.forEach(project => {
    const outputDir = path.join(outputBaseDir, project.slug);
    fs.mkdirSync(outputDir, { recursive: true });

    const context = {
      project: project,
      dataPage: "68b1b87bc65c6c6d1cecfb9a", // ID trang project của Webflow
      baseUrl: base,
    };

    const renderedHtml = template(context);
    fs.writeFileSync(path.join(outputDir, 'index.html'), renderedHtml);
    console.log(`✓ Created: src/pages/projects/${project.slug}/index.html`);
  });

  console.log('Project pages generated successfully!');
};

// Chạy hàm
generateProjectPages();