const Discord = require('discord.js');

const client = new Discord.Client();
const member = new Discord.GuildMember(client,);

client.on('ready', () => {

    console.log('I am ready! as ${client.user.tag}!');

});

client.on('message', message => {

    if (message.content === 'มาเล่นเกมกัน') {

       message.reply('อย่าเหลี่ยมล่ะกันน้าาาา');

       //member.kick("สวัสดีครับ");

       }

    //if (message.content === 'มาเล่นเกมกัน') {

        //message.reply('อย่าเหลี่ยมล่ะกันน้าาาา');
 
        //member.kick("สวัสดีครับ");
 
    //}

});

// THIS  MUST  BE  THIS  WAY

client.login(process.env.BOT_TOKEN);//BOT_TOKEN is the Client Secret