#! /bin/bash
# 将 mp4 文件封装为 ts 格式
ffmpeg -i a1.mp4 -vcodec copy -acodec copy -vbsf h264_mp4toannexb 1.ts
ffmpeg -i a2.mp4 -vcodec copy -acodec copy -vbsf h264_mp4toannexb 2.ts
ffmpeg -i a3.mp4 -vcodec copy -acodec copy -vbsf h264_mp4toannexb 3.ts
ffmpeg -i a4.mp4 -vcodec copy -acodec copy -vbsf h264_mp4toannexb 4.ts
# 拼接 ts 并导出最终 mp4 文件
ffmpeg -i "concat:1.ts|2.ts|3.ts|4.ts" -acodec copy -vcodec copy -absf aac_adtstoasc output.mp4
# 删除过程中生成的 ts 文件
rm *.ts