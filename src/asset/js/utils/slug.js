export const generateSlug = (name) => {
  if (!name) return "";
  return name.toLowerCase()
    .trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu tiếng Việt
    .replace(/\s+/g, '-')       // Thay thế khoảng trắng bằng gạch ngang
    .replace(/[^\w-]+/g, '')    // Loại bỏ ký tự không phải chữ, số, gạch ngang
    .replace(/--+/g, '-')       // Thay thế nhiều gạch ngang bằng một gạch ngang
    .replace(/^-+/, '')         // Cắt gạch ngang ở đầu
    .replace(/-+$/, '');        // Cắt gạch ngang ở cuối
};