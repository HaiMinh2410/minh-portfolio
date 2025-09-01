// postbuild.js
import fs from 'fs-extra';
import path from 'path';

const __dirname = path.resolve();
const distPath = path.join(__dirname, 'dist');
const pagesPath = path.join(distPath, 'pages');

async function flattenDist() {
  if (!fs.existsSync(pagesPath)) {
    console.log('Thư mục "pages" không tồn tại trong "dist". Không có gì để làm.');
    return;
  }

  try {
    // Di chuyển tất cả nội dung từ dist/pages ra dist
    const files = await fs.readdir(pagesPath);
    for (const file of files) {
      const sourcePath = path.join(pagesPath, file);
      const destPath = path.join(distPath, file);
      await fs.move(sourcePath, destPath, { overwrite: true });
    }

    // Xóa thư mục pages rỗng
    await fs.remove(pagesPath);
    
    console.log('✓ Đã làm phẳng cấu trúc thư mục build thành công!');
  } catch (error) {
    console.error('Lỗi trong quá trình làm phẳng thư mục build:', error);
  }
}

flattenDist();