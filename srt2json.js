/**
 * 把 SRT 格式的字幕文件解析为字幕的对象数组，格式为:
 * [
 *      {sn: "0", startTime: 0.89, endTime: 7.89, content: "这里是一系列与Hadoop↵有关的其他开源项目："},
 *      {sn: "1", startTime: 8.38, endTime: 14.85, content: "Eclipse是一个IBM贡献到开源社区里的集成开发环境（IDE）。"}
 * ]
 *
 * @param  string srt 字幕文件的内容
 * 可以将字幕双字幕保存到一个时间轴内
 * @return 字幕的对象数组
 */
function parseSrtSubtitles(srt,srt2=''){
    let subtitles = [];
    let textSubtitles = srt.split('\n\n'); // 每条字幕的信息，包含了序号，时间，字幕内容
    let textSubtitles2 = srt2 ? srt2.split('\n\n') : ''; // second
    for (var i = 0; i < textSubtitles.length; ++i) {
 
        var textSubtitle = textSubtitles[i].split('\n');
        var textSubtitle2 = srt2 ? textSubtitles2[i].split('\n') : '';
 
        if (textSubtitle.length >= 2) {
            var sn = textSubtitle[0]; // 字幕的序号
            var startTime = toSeconds($.trim(textSubtitle[1].split(' --> ')[0])); // 字幕的开始时间
            var endTime   = toSeconds($.trim(textSubtitle[1].split(' --> ')[1])); // 字幕的结束时间
            var content   = textSubtitle[2]; // 字幕的内容
            var content2 = srt2 ? textSubtitle2[2] : '';
 
            // 字幕可能有多行
            if (textSubtitle.length > 2) {
                for (var j = 3; j < textSubtitle.length; j++) {
                    console.log(textSubtitle[j]);
 
                    content += '\n' + textSubtitle[j];
                }
            }
 
            // 字幕对象
            var subtitle = {
                sn: sn,
                an:2,
                size:'12px',
                family:'serif',
                color:'#fff',
                start: startTime,
                end: endTime,
                text: content,
                text_yw:content2,
            };
            subtitles.push(subtitle);
        }
    }
 
    return subtitles;
}
function srtTimestamp(seconds) {
    seconds = seconds.toFixed(2);
    seconds = seconds - 0;
    let milliseconds = seconds*1000;
 
    seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    milliseconds = milliseconds % 1000;
    seconds = seconds % 60;
    minutes = minutes % 60;
    return (hours < 10 ? '0' : '') + hours + ':'
         + (minutes < 10 ? '0' : '') + minutes + ':'
         + (seconds < 10 ? '0' : '') + seconds + '.'
         + (milliseconds < 100 ? '0' : '') + (milliseconds < 10 ? '0' : '') +      parseInt(milliseconds);
}

