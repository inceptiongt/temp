const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const folderPath = '/Volumes/second';
// const folderPath = '/Users/gt/Documents';
const hoursBefore = 48;
const fileType = '.mp4';


// 获取n小时前日期
const beforeDate = new Date();
beforeDate.setUTCHours(hoursBefore * -1);

// 读取文件夹内的所有文件
fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.log('无法读取文件夹：', err);
        return;
    }
    
    // 定义一个数组用于存储视频文件的信息
    const videoFiles = [];

    files.forEach(file => {
        const filePath = path.join(folderPath, file);
        fs.stat(filePath, (err, stats) => {
            if (err) {
                console.log('无法读取文件状态：', err);
                return;
            }
            console.log(stats, beforeDate, stats.birthtime >= beforeDate, file)
            // stats = {
            //     atimeMs: 1684218819000,
            //     mtimeMs: 1684152438000,
            //     ctimeMs: 1684165011000,
            //     birthtimeMs: 1684152165000,
            //     atime: 2023 - 05 - 16T06: 33: 39.000Z,
            //     mtime: 2023 - 05 - 15T12: 07: 18.000Z, 修改时间
            //     ctime: 2023 - 05 - 15T15: 36: 51.000Z,
            //     birthtime: 2023 - 05 - 15T12: 02: 45.000Z
            // }
            if (stats.isFile() && stats.mtime >= beforeDate && path.extname(file) === fileType) {
                // 是今天新增的视频文件
                exec(`ffprobe -v quiet -print_format json -show_format -show_streams "${filePath}"`, (err, stdout, stderr) => {
                    if (err) {
                        console.error(`无法获取 ${file} 的视频信息：`, err);
                        return;
                    }

                    const data = JSON.parse(stdout);

                    // 提取视频流信息
                    const videoStream = data.streams.find(stream => stream.codec_type === 'video');
                    if (!videoStream) {
                        console.error(`${file} 中没有视频流`);
                        return;
                    }

                    // 计算视频总像素数和分辨率级别
                    const totalPixels = videoStream.width * videoStream.height;
                    let resolutionLevel = '';
                    if (totalPixels >= 2073600) {
                        resolutionLevel = '1080P';
                    } else if (totalPixels >= 921600) {
                        resolutionLevel = '720P';
                    } else if (totalPixels >= 409920) {
                        resolutionLevel = '480P';
                    } else {
                        resolutionLevel = '360P';
                    }

                    // 计算视频时长
                    const durationSeconds = parseFloat(videoStream.duration);
                    const durationMinutes = Math.floor(durationSeconds / 60);
                    const durationSecondsRemainder = Math.floor(durationSeconds % 60);
                    const durationFormatted = `${durationMinutes.toString().padStart(2, '0')}:${durationSecondsRemainder.toString().padStart(2, '0')}`;

                    // 计算视频文件大小
                    const sizeFormatted = (stats.size / 1024 / 1024).toFixed(2) + ' MB';

                    // 将视频信息存储到数组中
                    videoFiles.push({
                        fileName: file,
                        resolution: resolutionLevel,
                        codec: videoStream.codec_name,
                        bitrate: (videoStream.bit_rate / 1024 / 1024).toFixed(2) + ' Mbps',
                        size: sizeFormatted,
                        during: durationFormatted,
                        mtime: stats.mtime
                    });
                });
            }
        });
    });

    // 在循环结束后输出视频文件的信息列表,并排序
    setTimeout(() => {
        // console.log('今天新增的视频文件：');
        console.table(videoFiles.sort((a,b)=>b.mtime - a.mtime), ['fileName', 'resolution', 'codec', 'bitrate', 'size', 'during']);

        // 只输出文件名
        console.table(videoFiles.sort((a,b)=>b.mtime - a.mtime), ['fileName']);
    }, 3000);
});
