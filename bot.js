const Discord = require('discord.js');

const client = new Discord.Client();

client.on('ready', () => {

    client.user.setPresence({ activity: { name: 'with discord.js' }, status: 'online' });

    console.log('I am ready!');

    client.users.get("133439202556641280").send("Bot ทำการ Restart เสร็จแล้วนะคุณบอย")
    .then(msg => {
        msg.delete(100000);
    })
    .catch("Error ว่ะ");

});

client.on('message', message => {

    if (message.content === 'มาเล่นเกมกัน') {

       message.reply('อย่าเหลี่ยมล่ะกันน้าาาา');

    }else if (message.content === 'ทำอะไรกันอยู่' || message.content === 'ทำอะไรกัน') {

        message.reply('มีตาดูไหม ฮัลโหล')
        .then(msg => {
            msg.delete(10000);
            message.delete(20000);
        })
        .catch("Error ว่ะ");
 
    }else if (message.content === 'แลค') {

        message.reply('แพ็กเกจอินเทอร์เน็ตบ้าน #3BB #GIGATainment #1Gbps พร้อมความบันเทิงระดับ World Class จาก #HBOGO \n สมัครได้แล้ววันนี้ที่ 3BB Shop ทั่วประเทศ โทร.1530 หรือเปลี่ยนแพ็กเกจ ผ่านแอปฯ 3BB Member');
 
    }else if (message.content === 'ส้นตีน') {

        message.reply(':foot:')
        .then(msg => {
            msg.delete(10000);
            message.delete(20000);
        })
        .catch("Error ว่ะ");

    }else if (message.content === 'หี'){

        message.reply('(|)')
        .then(msg => {
            msg.delete(10000);
            message.delete(20000);
        })
        .catch('Error ว่ะ');

    }else if (message.content.search('วาป') !== ''){

        message.author.send("ถ้า คุณต้องการที่ จะแชร์การบ้าน หรือ งานอื่นๆ ช่วย แชร์งาน ใน ช่องของ https://discordapp.com/channels/443362659522445312/455728466566971393 ด้วยนะครับ เพื่อจะได้ไม่เป็นการรก แชทในหมวดทั่วไปอ่าครับ ขอบคุณครับ")
        //message.author.send(dmembed)
        .then(msg => {
            msg.delete(10000);
        })
        .catch('Error ว่ะ');

    }

    message.channel.fetchMessage('702696892949069886').then(msg => msg.delete());
    message.channel.fetchMessage('702696893951770705').then(msg => msg.delete());
    message.channel.fetchMessage('702696894823923722').then(msg => msg.delete());
    message.channel.fetchMessage('702696895360925786').then(msg => msg.delete());
    message.channel.fetchMessage('702696918933045318').then(msg => msg.delete());
    message.channel.fetchMessage('702696892626239580').then(msg => msg.delete());
    message.channel.fetchMessage('702696919167664149').then(msg => msg.delete());
    message.channel.fetchMessage('702696919453138975').then(msg => msg.delete());
    message.channel.fetchMessage('702696919604002837').then(msg => msg.delete());
    message.channel.fetchMessage('702696945214423070').then(msg => msg.delete());
    message.channel.fetchMessage('702696994136915979').then(msg => msg.delete());

    if (message.content.search('router') !== ''){
        if (message.channel.type === 'dm') {
            message.reply('พูดถึงเรื่อง Router หรอ ? \n ปกติ ก็ใช้แต่ Tenda กับ Ubiquiti นะ \n Tenda จะถูกหน่อย ของดีเหมือนกัน ส่วน Ubiquiti จะแพงมากๆ แต่มีอุปกรณ์ ให้เลือก หลากหลาย');
        }
    }

});

client.login(process.env.BOT_TOKEN);
