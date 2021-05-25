const Discord = require('discord.js');
const DS = require("discord-slash-commands-client");
const cron = require("cron");
const fetch = require('node-fetch');
const request = require('request');
var fs = require('fs');
const https = require('https');

require('dotenv').config();

const client = new Discord.Client();

const DSclient = new DS.Client(
    process.env.BOT_TOKEN,
    "691610557156950030"
);

// functions

function padLeadingZeros(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

// end functions

client.once('ready', () => {
	client.user.setPresence({ activity: { name: '/fthlotto to follow thai lottery' }, status: 'online' });

	console.log('I am ready!');

    client.users.fetch('133439202556641280').then(dm => {
        dm.send('Bot เริ่มต้นการทำงานแล้ว')
    });

    //DSclient.getCommands({commandID: "fthlotto",guildID: "443362659522445312"}).then(console.log).catch(console.error);
});

client.on("guildCreate", guild => {

    console.log("Joined a new guild: " + guild.id);
	
	client.users.fetch('133439202556641280').then(dm => {
        dm.send('ดิส '+guild.id+' ได้เชิญ บอท PWisetthon.com เข้าเรียบร้อยแล้ว')
    });

    console.log("System Channel: "+ guild.systemChannelID);

    var options = {
        'method': 'GET',
        'url': process.env.URL+'/discordbot/addchannels.php?chid='+guild.systemChannelID,
        'headers': {
        }
    };

    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
        if(response.body == "debug"){
            client.channels.cache.get(guild.systemChannelID).send("ขอบคุณ! ที่เชิญเราเข้าเป็นส่วนร่วมของดิสคุณ เราได้ทำการติดตามสลากฯให้สำหรับดิสนี้เรียบร้อยแล้ว!")
            .cache(console.error)
        }else{
            client.channels.cache.get(guild.systemChannelID).send("ขอบคุณ! ที่เชิญเราเข้าเป็นส่วนร่วมของดิสคุณ")
            .cache(console.error)
        }
    });

    DSclient
    .createCommand({
        name: "fthlotto",
        description: "แจ้งเตือนสลากกินแบ่งรัฐบาลเวลาสี่โมงเย็นของวันทึ่ออก",
    },guild.id)
    .then(console.log)
    .catch(console.error);

    DSclient
    .createCommand({
        name: "cthlotto",
        description: "ยกเลิกแจ้งเตือนสลากกินแบ่งรัฐบาลของแชนแนลนี้",
    },guild.id)
    .then(console.log)
    .catch(console.error);
})

// datedata

let date = new Date().getDate();
let month = new Date().getMonth()+1;
let year = new Date().getFullYear()+543;

let monthtext

date = padLeadingZeros(date, 2);
month = padLeadingZeros(month, 2);
year = padLeadingZeros(year, 4);

switch(month){
    case '01' : monthtext="มกราคม"; break;
    case '02' : monthtext="กุมภาพันธ์"; break;
    case '03' : monthtext="มีนาคม"; break;
    case '04' : monthtext="เมษายน"; break;
    case '05' : monthtext="พฤษภาคม"; break;
    case '06' : monthtext="มิถุนายน"; break;
    case '07' : monthtext="กรกฎาคม"; break;
    case '08' : monthtext="สิงหาคม"; break;
    case '09' : monthtext="กันยายน"; break;
    case '10' : monthtext="ตุลาคม"; break;
    case '11' : monthtext="พฤศจิกายน"; break;
    case '12' : monthtext="ธันวาคม"; break;
}

// end datedata

let scheduledMessage = new cron.CronJob('* * 15-17 * * *', () => {

    let url = "https://thai-lottery1.p.rapidapi.com/?date="+date+""+month+""+year+"&fresh";

    //let url = "https://lottsanook.vercel.app/api/?date="+date+""+month+""+year+"&fresh";

    let settings = {"method": "GET", "headers": { "x-rapidapi-key": "c34ed3c573mshbdf38eb6814e7a7p1e0eedjsnab10f5aef137", "x-rapidapi-host": "thai-lottery1.p.rapidapi.com"}};

    //let settings = { method: "Get" };

    fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        if(json[0][1] == "0" || json[0][1] == 0 || json[0][1].toLowerCase() == "xxxxxx"){

            /*client.users.fetch('133439202556641280').then(dm => {
                dm.send('Bot ทำงานปกติและเช็คได้ว่าวันนี้หวยไม่ได้ออกหรือหวยยังออกไม่หมด')
            })*/

            console.log('Bot ทำงานปกติและเช็คได้ว่าวันนี้หวยไม่ได้ออกหรือหวยยังออกไม่หมด');

            fs.readFile('check.txt', function(err, data) {
                if(data != "0"){
                    fs.writeFile('check.txt', '0', function (err) {
                        if (err){
                            throw err
                        };
                        console.log('Saved!');
                    });
                }
            });

        }else{

            fs.readFile('check.txt', function(err, data) {
                if(data != "1"){
                    fs.writeFile('check.txt', '1', function (err) {
                        if (err){
                            throw err
                        };
                        console.log('Saved!');
                    });
                    
                    const file = fs.createWriteStream("today.png");
                    const rqimage = https.get("https://boy-discord-bot.herokuapp.com/", function(response) {
                        response.pipe(file);
                    });

                    const msg = new Discord.MessageEmbed()
	                .setColor('#0099ff')
	                .setTitle('ผลสลากกินแบ่งรัฐบาล')
	                .setURL('https://www.glo.or.th/')
	                //.setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
	                .setDescription('งวดวันที่ '+new Date().getDate()+' '+monthtext+' '+year)
	                .setThumbnail('https://www.glo.or.th/_nuxt/img/img_sbout_lottery_logo.2eff707.png')
	                .addFields(
		                { name: 'รางวัลที่หนึ่ง', value: json[0][1] },
		                //{ name: '\u200B', value: '\u200B' },
		                { name: 'เลขหน้าสามตัว', value: json[1][1]+' | '+json[1][2], inline: true },
		                { name: 'เลขท้ายสามตัว', value: json[2][1]+' | '+json[2][2], inline: true },
                        { name: 'เลขท้ายสองตัว', value: json[3][1] },
	                )
	                //.addField('เลขท้ายสองตัว', json[3][1], true)
                    .attachFiles(['today.png'])
	                .setImage('attachment://today.png')
	                //.setImage(process.env.URL+'/tmpimage/'+date+''+month+''+year+'.png')
	                .setTimestamp()
	                .setFooter('ข้อมูลจาก github.com/Quad-B/lottsanook \nบอทจัดทำโดย Phongsakorn Wisetthon \nซื้อกาแฟให้ผม ko-fi.com/boyphongsakorn');

                    fetch(process.env.URL+"/discordbot/chlist.txt", settings)
                    .then(res => res.json())
                    .then((json) => {

                        for (i in json) {
                            client.channels.cache.get(json[i]).send(msg)
                            .then((log) => {
                                console.log(log);
                            })
                            .catch((error) => {
                                console.error(error);
                                client.users.fetch('133439202556641280').then(dm => {
                                    dm.send('Bot ไม่สามารถส่งข้อความได้เนี่องจาก '+error)
                                })
                            });
                        }

                    });
                }
            });

        }

    });

});
  
// When you want to start it, use:
scheduledMessage.start()
// You could also make a command to pause and resume the job

client.on('message', message => {
});

client.ws.on('INTERACTION_CREATE', async (interaction) => {
    const command = interaction.data.name.toLowerCase();

    if (command === 'fthlotto') {
        var options = {
            'method': 'GET',
            'url': process.env.URL+'/discordbot/addchannels.php?chid='+interaction.channel_id,
            'headers': {
            }
        };

        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
            if(response.body == "debug"){
                reply(interaction, 'ห้องนี้ติดตามสลากฯอยู่แล้ว')
            }else{
                reply(interaction, 'ติดตามสลากฯในห้องนี้เสร็จเรียบร้อย')
            }
        });
    }

    if (command === 'cthlotto') {
        var options = {
            'method': 'GET',
            'url': process.env.URL+'/discordbot/delchannels.php?chid='+interaction.channel_id,
            'headers': {
            }
        };

        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
            reply(interaction, 'ยกเลิกการติดตามสลากฯในห้องนี้เสร็จเรียบร้อย')
        });
    }
})

const reply = (interaction, response) => {
    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4, 
            data: {
                content: response,
            }
        }
    })
}

client.login(process.env.BOT_TOKEN);