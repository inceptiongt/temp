// node rename.js /path/to/files.csv /path/to/folder

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const csvPath = '/Users/gt/Desktop/temp/temp.csv';
const folderPath = '/Users/gt/Documents';
let counter = 1;

const results = [];

fs.createReadStream(csvPath)
  .pipe(csv())
  .on('data', (row) => {
    const oldFileName = row['old_name']||'';
    const newFileName = row['new_name']||'';
    if(oldFileName === '' || newFileName === '') {
      console.error('文件名不能为空');
      return;
    }
    const parsedPath = path.parse(oldFileName);

    // 生成序号
    // const newFilePath = path.join(`${counter}.` + newFileName + parsedPath.ext);

    // 合并序号
    const newFilePath = path.join( parsedPath.name + newFileName + parsedPath.ext);
    counter++;

    fs.rename(path.join(folderPath, oldFileName), path.join(folderPath, `${newFilePath}`), (err) => {
      if (err) {
        console.error(`重命名文件 ${oldFileName} 失败：`, err);
        results.push({ oldFileName, newFilePath, status: '失败' });
      } else {
        console.log(`文件 ${oldFileName} 重命名为 ${newFilePath} 成功！`);
        results.push({ oldFileName, newFilePath, status: '成功' });
      }
    });
  })

setTimeout(() => {
  console.table(results);
}, 3000);