import { renameSync, readdirSync, statSync } from 'fs';
import { basename, join, dirname } from 'path';

// Путь к папке, в которой нужно переименовать файлы
const directoryPath = './src';

// Функция для переименования файла
function renameFile(filePath) {
  const fileName = basename(filePath);
  const newFileName = fileName.replace('Screen', 'Page');
  const newFilePath = join(dirname(filePath), newFileName);

  // Переименовываем файл
  renameSync(filePath, newFilePath);
}

// Функция для обхода всех файлов в папке
function walkDirectory(directoryPath) {
  readdirSync(directoryPath).forEach((file) => {
    const filePath = join(directoryPath, file);
    console.log(filePath);
    // Если это файл, то переименовываем его
    if (statSync(filePath).isFile() && file.includes('Screen')) {
      renameFile(filePath);
    }

    // Если это папка, то рекурсивно обходим ее
    if (statSync(filePath).isDirectory()) {
      walkDirectory(filePath);
    }
  });
}

// Вызываем функцию для обхода всех файлов в папке
walkDirectory(directoryPath);
