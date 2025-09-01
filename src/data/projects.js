const generateSlug = (name) => {
  if (!name) return "";
  return name
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu tiếng Việt
    .replace(/\s+/g, "-") // Thay thế khoảng trắng bằng gạch ngang
    .replace(/[^\w-]+/g, "") // Loại bỏ ký tự không phải chữ, số, gạch ngang
    .replace(/--+/g, "-") // Thay thế nhiều gạch ngang bằng một gạch ngang
    .replace(/^-+/, "") // Cắt gạch ngang ở đầu
    .replace(/-+$/, ""); // Cắt gạch ngang ở cuối
};
const projects = [
  {
    name: "Up Dental",
    category: "Web Design",
    date: "August 30, 2025",
    liveUrl: "https://up-dental.com",
    description:
      "Whether you need design or tweak some code, I have the skills and creativity needed to take your project to the next level.",
    bodyItems: [
      { image: "/Screenshot 2025-08-30 224405.png" },
      // Thêm các ảnh khác nếu cần
    ],
  },
  {
    name: "Donut SaiGon",
    category: "Graphic Design",
    date: "August 26, 2025",
    liveUrl: "https://donutsaigon.vn",
    description:
      "Creative and detail-oriented branding project focusing on a modern, fun aesthetic for a local food brand.",
    bodyItems: [
      { image: "/Screenshot 2025-08-26 222751.png" },
      { image: "/Screenshot 2025-08-26 222751.png" },
    ],
  },
  {
    name: "Happy Care",
    category: "Graphic Design",
    date: "August 20, 2025",
    liveUrl: "https://happycare.co",
    description:
      "Developing a friendly and trustworthy visual identity system for a healthcare startup.",
    bodyItems: [
      { image: "/image.png" },
      { image: "/image.png" },
      { image: "/image.png" },
    ],
  },
  {
    name: "Shoppe Food",
    category: "Shipper",
    date: "July 10, 2025",
    liveUrl: "https://shoppefood.vn",
    description:
      "Optimization of the rider experience on the Shoppe Food delivery app.",
    bodyItems: [{ image: "/81347517cc94993b7e30db16f9b7cb02.jpg" }],
  },
];

// Gán slug cho từng dự án
projects.forEach((project) => {
  project.slug = generateSlug(project.name);
});

export { generateSlug, projects };
