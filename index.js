//----------------------------------------
// 載入必要的模組
//----------------------------------------
var linebot = require('linebot');
var express = require('express');

//增加引用函式
const student = require('./utility/student');

//----------------------------------------
// 填入自己在Line Developers的channel值
//----------------------------------------
var bot = linebot({
    channelId: '1602654254',
    channelSecret: '443a5ef41317934e811ed25f76381b0a',
    channelAccessToken: 'Mp2LG3p0MigpcH5I/l1UUHsCd0n8+xdpuZtDcnlFKuTielvvtgHDeZkY/SSdiPykG0K1UcDjw0S+NKtn9jElqixWA8QXwhHMpRWfPFIvzOAt3GzKbr/vk1aULZ6LIrWsqfKvoi6Oc0wIPCsE3QeU1AdB04t89/1O/w1cDnyilFU='
});

//--------------------------------
// 機器人接受訊息的處理
//--------------------------------
bot.on('message', function(event) {    
    event.source.profile().then(
        function (profile) {
            //取得使用者資料
            const userName = profile.displayName;
            const userId = profile.userId;
        
            //使用者傳來的學號
            const no = event.message.text;

            //呼叫API取得學生資料
            student.fetchStudent(no).then(data => {  
                if (data == -1){
                    event.reply('找不到資料');
                }else if(data == -9){                    
                    event.reply('執行錯誤');
                }else{
                    event.reply([
                        {'type':'text', 'text':data.stuno},
                        {'type':'text', 'text':data.stuname},
                        {'type':'text', 'text':data.gender}]
                    );  
                }  
            })

            //呼叫API取得成績資料
            student.fetchScores(no).then(data => {  
                if (data == -1){
                    event.reply('找不到資料');
                }else if(data == -9){                    
                    event.reply('執行錯誤');
                }else{
                    let msg='';
                    let firstLine = true;

                    data.forEach(item => {
                        if(firstLine){                            
                            firstLine=false;
                        }else{
                            msg = msg + '\n';
                        }
                        msg = msg + item.course + ':' + item.score;
                    });

                    event.reply({'type':'text', 'text': msg});
                }  
            }) 
            //呼叫API取得各科目平均成績
            student.avgScoreByCourse().then(data => {  
                if (data == -1){
                    event.reply('找不到資料');
                }else if(data == -9){                    
                    event.reply('執行錯誤');
                }else{
                    let msg='';
                    let firstLine = true;

                    data.forEach(item => {  
                        if(firstLine){                            
                            firstLine=false;
                        }else{
                            msg = msg + '\n';
                        }
                        msg = msg + item.course + ':' + Math.round(item.avg*100)/100;                                                
                    });

                    event.reply({type:'text', text: msg});
                }  
            })  


        }
    );
});

//----------------------------------------
// 建立一個網站應用程式app
// 如果連接根目錄, 交給機器人處理
//----------------------------------------
const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

//----------------------------------------
// 可直接取用檔案的資料夾
//----------------------------------------
app.use(express.static('public'));

//----------------------------------------
// 監聽3000埠號, 
// 或是監聽Heroku設定的埠號
//----------------------------------------
var server = app.listen(process.env.PORT || 3000, function() {
    const port = server.address().port;
    console.log("正在監聽埠號:", port);
});