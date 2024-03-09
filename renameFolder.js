import { renameSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

// Путь к директории, в которой нужно переименовать папки
const directoryPath = './src';

// Функция для переименования папки
function renameDirectory(directoryPath, newName) {
  const oldPath = join(directoryPath, 'screens');
  const newPath = join(directoryPath, newName);

  // Переименовываем папку
  renameSync(oldPath, newPath);
}

// Функция для обхода всех папок в директории
function walkDirectories(directoryPath) {
  readdirSync(directoryPath).forEach((file) => {
    const filePath = join(directoryPath, file);



    // Если это папка, то рекурсивно обходим ее
    if (statSync(filePath).isDirectory()) {
      walkDirectories(filePath);
    }
    // Если это папка, то переименовываем ее, если она называется "screens"
    if (statSync(filePath).isDirectory() && file === 'screens') {
      renameDirectory(directoryPath, 'pages');
    }
  });
}

// Вызываем функцию для обхода всех папок в директории
walkDirectories(directoryPath);
