const Discord = require('discord.js');

const client = new Discord.Client();
//const member = new Discord.GuildMember(client,);

client.on('ready', () => {

    console.log('I am ready! as ${client.user.tag}!');

});

client.on('message', message => {

    if (message.content === 'มาเล่นเกมกัน') {

       message.reply('อย่าเหลี่ยมล่ะกันน้าาาา');

       //member.kick("สวัสดีครับ");

    }else if (message.content === 'ทำอะไรกันอยู่') {

        message.reply('มีตาดูไหม ฮัลโหล');
 
        //member.kick("สวัสดีครับ");
 
    }else if (message.content === 'แลค') {

        message.reply('แพ็กเกจอินเทอร์เน็ตบ้าน #3BB #GIGATainment #1Gbps พร้อมความบันเทิงระดับ World Class จาก #HBOGO \n สมัครได้แล้ววันนี้ที่ 3BB Shop ทั่วประเทศ โทร.1530 หรือเปลี่ยนแพ็กเกจ ผ่านแอปฯ 3BB Member');
 
        //member.kick("สวัสดีครับ");
 
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
        .catch("Error ว่ะ");

    }

    channel.fetchMessage("702411616423247934").then(msg => {
        if (msg) msg.edit("Your new message.");
    });


});

// THIS  MUST  BE  THIS  WAY

client.login(process.env.BOT_TOKEN);//BOT_TOKEN is the Client Secret