const Discord = require('discord.js');
const cron = require("cron");

const client = new Discord.Client();

client.on('ready', () => {

    client.user.setPresence({ activity: { name: 'ยา' }, status: 'online' });

    console.log('I am ready!');

    /*client.users.cache.get("133439202556641280").send("Bot ทำการ Restart เสร็จแล้วนะคุณบอย")
    .then(msg => {
        msg.delete({ timeout: 10000, reason: 'It had to be done.' });
    })
    .catch("Error ว่ะ");*/

    //client.channels.cache.get('443362659522445314').send('Super Test');

});

let scheduledMessage = new cron.CronJob('00 00 16 * * *', () => {
    
    let channel = client.channels.cache.get('443362659522445314');
    channel.send('Test');

});
  
// When you want to start it, use:
scheduledMessage.start()
// You could also make a command to pause and resume the job

/*client.on('message', message => {

    if (message.content === 'มาเล่นเกมกัน') {

       message.reply('อย่าเหลี่ยมล่ะกันน้าาาา');

    }else if (message.content === 'ทำอะไรกันอยู่' || message.content === 'ทำอะไรกัน') {

        message.reply('มีตาดูไหม ฮัลโหล')
        .then(msg => {
            msg.delete({ timeout: 10000, reason: 'It had to be done.' });
            //message.delete(20000);
        })
        .catch("Error ว่ะ");
 
    }else if (message.content === 'แลค') {

        message.reply('แพ็กเกจอินเทอร์เน็ตบ้าน #3BB #GIGATainment #1Gbps พร้อมความบันเทิงระดับ World Class จาก #HBOGO \n สมัครได้แล้ววันนี้ที่ 3BB Shop ทั่วประเทศ โทร.1530 หรือเปลี่ยนแพ็กเกจ ผ่านแอปฯ 3BB Member');
 
    }else if (message.content === 'ส้นตีน') {

        message.reply(':foot:')
        .then(msg => {
            msg.delete({ timeout: 10000, reason: 'It had to be done.' });
            //message.delete(20000);
        })
        .catch("Error ว่ะ");

    }else if (message.content === 'หี'){

        message.reply('(|)')
        .then(msg => {
            msg.delete({ timeout: 10000, reason: 'It had to be done.' });
            //message.delete(20000);
        })
        .catch('Error ว่ะ');

    }else if (message.content.indexOf('วาป') > -1){

        message.author.send("ถ้า คุณต้องการที่ จะแชร์การบ้าน หรือ งานอื่นๆ ช่วย แชร์งาน ใน ช่องของ https://discordapp.com/channels/443362659522445312/455728466566971393 ด้วยนะครับ เพื่อจะได้ไม่เป็นการรก แชทในหมวดทั่วไปอ่าครับ ขอบคุณครับ")
        //message.author.send(dmembed)
        .then(msg => {
            msg.delete({ timeout: 10000, reason: 'It had to be done.' });
        })
        .catch('Error ว่ะ');

    }

    if (message.channel.type === 'dm') {
        if (message.content.indexOf('router') > -1){
            message.author.send('พูดถึงเรื่อง Router หรอ ? \nปกติ ก็ใช้แต่ Tenda กับ Ubiquiti นะ \nTenda จะถูกหน่อย ของดีเหมือนกัน ส่วน Ubiquiti จะแพงมากๆ แต่มีอุปกรณ์ ให้เลือก หลากหลาย');
        }

        if (message.content.indexOf('Lan') > -1){
            message.author.send('สาย Lan ทุกวันนี้ ควรไปที่ Cat 5e หรือ 6 ได้แล้วนะ \nตัวระดับที่วิ่ง 1000Mbps อ่า \nทุกวันนี้ โปรเน็ตบ้านส่วนมาก ไประดับ 1Gbps แล้วอ่า');
        }

        if (message.content.indexOf('ดูด Wifi') > -1 || message.content.indexOf('ดูด ไวไฟ') > -1){
            message.author.send('จะ ดูด ไวไฟ งั้นหรอก | ก็ไม่ได้ดูเป็นเรื่องยากอะไรนะ \nถ้าดูดแบบข้างบ้าน ใช้แบบ Router มา Repeater ต่อก็ได้นะ (ไม่แนะนำ ถ้าแถวนั้น มีไวไฟหลาย SSID หรือ Channel ที่อัดกันเยอะๆ) \nส่วน ดูดจาก ตรงข้ามบ้าน หรือ ระยะไกลๆ ให้ชื่ออุปกรณ์แบบ Outdoor ที่เอาไว้รับ ไวไฟ อย่างเดียว \nเช่น UBIQUITI Nanostation Loco M5 , Tenda O1 , Tenda O3 , Tenda O6');
        }

        //if (message.content.indexOf('ดูด ไวไฟ') > -1){
        //    message.author.send('จะ ดูด ไวไฟ งั้นหรอก | ก็ไม่ได้ดูเป็นเรื่องยากอะไรนะ \nถ้าดูดแบบข้างบ้าน ใช้แบบ Router มา Repeater ต่อก็ได้นะ (ไม่แนะนำ ถ้าแถวนั้น มีไวไฟหลาย SSID หรือ Channel ที่อัดกันเยอะๆ) \nส่วน ดูดจาก ตรงข้ามบ้าน หรือ ระยะไกลๆ ให้ชื่ออุปกรณ์แบบ Outdoor ที่เอาไว้รับ ไวไฟ อย่างเดียว \nเช่น UBIQUITI Nanostation Loco M5 , Tenda O1 , Tenda O3 , Tenda O6');
        //}

    }

});*/

client.login(process.env.BOT_TOKEN);
