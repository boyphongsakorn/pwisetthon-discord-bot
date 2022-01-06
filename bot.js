const {MessageAttachment,MessageEmbed, Client, Intents } = require('discord.js');
//const DS = require("discord-slash-commands-client");
const cron = require("cron");
const fetch = require('node-fetch');
const request = require('request');
var fs = require('fs');
//const urlExistSync = require("url-exist-sync");
var http = require('http');

require('dotenv').config();

//const client = new Discord.Client({fetchAllMembers: true}); only for get all server and member
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

/*const DSclient = new DS.Client(
    process.env.BOT_TOKEN,
    "691610557156950030"
);*/

//create a server object:
http.createServer(function (req, res) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Max-Age': 2592000, // 30 days
        /** add other headers as per requirement */
    };

    if (req.url === '/count') {
        res.writeHead(200, headers);
        res.write(client.guilds.cache.size.toString()); //write a response to the client
        res.end(); //end the response
    } else {
        res.writeHead(200, headers);
        res.write('ok'); //write a response to the client
        res.end(); //end the response
    }
}).listen(8080); //the server object listens on port 8080

// functions

function padLeadingZeros(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

function convertmonthtotext(month) {
    switch (month) {
        case '01': return "มกราคม"; break;
        case '02': return "กุมภาพันธ์"; break;
        case '03': return "มีนาคม"; break;
        case '04': return "เมษายน"; break;
        case '05': return "พฤษภาคม"; break;
        case '06': return "มิถุนายน"; break;
        case '07': return "กรกฎาคม"; break;
        case '08': return "สิงหาคม"; break;
        case '09': return "กันยายน"; break;
        case '10': return "ตุลาคม"; break;
        case '11': return "พฤศจิกายน"; break;
        case '12': return "ธันวาคม"; break;
    }
}

// end functions

client.once('ready', () => {
    client.user.setPresence({ activities: [{ name: 'discordbot.pwisetthon.com' }], status: 'online' });

    console.log('I am ready!');

    client.users.fetch('133439202556641280').then(dm => {
        dm.send('Bot เริ่มต้นการทำงานแล้ว')
    });

    try {
        //console.log(fs.statSync("out.log").size)
        if (fs.statSync("out.log").size > 1000000000) {
            fs.unlink("out.log", function (err) {
                if (err) throw err;
                // if no error, file has been deleted successfully
                console.log('File deleted!');
            });
        }
    } catch (error) {

    }

    /*client.guilds.cache.forEach(guild => {
        console.log(`${guild.name} | ${guild.id}`);
        const list = client.guilds.cache.get(guild.id);
        list.members.cache.forEach(member => console.log(member.user.username));
    })*/

    /*let testarray = ['844177331190497280','443362659522445314']

    testarray.forEach(element => {
        try {
            client.channels.cache.get(element).send("test")
            .then((log) => {
                console.log(log);
            })
            .catch((error) => {
                //console.log(error);
                client.users.fetch('133439202556641280').then(dm => {
                    dm.send('Bot ไม่สามารถส่งข้อความไปยังแชทแนว ' + json[i] + ' ได้เนี่องจาก ' + error)
                })
            });
        } catch (error) {
            client.users.fetch('133439202556641280').then(dm => {
                dm.send('Bot ไม่สามารถส่งข้อความไปยังแชทแนว ' + json[i] + ' ได้เนี่องจาก ' + error)
            })
        }
    });*/

});

client.on("guildCreate", guild => {

    console.log("Joined a new guild: " + guild.id);

    client.users.fetch('133439202556641280').then(dm => {
        dm.send('ดิส ' + guild.name + '(' + guild.id + ') ได้เชิญ บอท PWisetthon.com เข้าเรียบร้อยแล้ว')
    });

    if (guild.systemChannelID != null && guild.systemChannelID != undefined) {
        console.log("System Channel: " + guild.systemChannelID);

        var options = {
            'method': 'GET',
            'url': process.env.URL + '/discordbot/addchannels.php?chid=' + guild.systemChannelID,
            'headers': {
            }
        };

        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
            if (response.body == "debug") {
                client.channels.cache.get(guild.systemChannelID).send('ขอบคุณ! ที่เชิญเราเข้าส่วนหนึ่งในดิสของคุณ')
                    .catch(console.error);
            } else {
                client.channels.cache.get(guild.systemChannelID).send('ขอบคุณ! ที่เชิญเราเข้าเป็นส่วนร่วมของดิสคุณ เราได้ทำการติดตามสลากฯให้สำหรับดิสนี้เรียบร้อยแล้ว! \nใช้คำสั่ง /cthlotto เพื่อยกเลิก')
                    .catch(console.error);
            }
        });
    }

    const thatguild = client.guilds.cache.get(guild.id);
    let commands

    if (thatguild){
        commands = thatguild.commands
    }else{
        commands = client.applications?.commands
    }

    commands?.create({
        name: 'fthlotto',
        description: "แจ้งเตือนสลากกินแบ่งรัฐบาลเวลาสี่โมงเย็นของวันทึ่ออก"
    },guild.id)

    commands?.create({
        name: 'cthlotto',
        description: "ยกเลิกแจ้งเตือนสลากกินแบ่งรัฐบาลของแชนแนลนี้"
    },guild.id)

    commands?.create({
        name: 'lastlotto',
        description: "ดูสลากกินแบ่งรัฐบาลล่าสุด"
    },guild.id)

    commands?.create({
        name: 'srchlot',
        description: "ตรวจสลากฯ ล่าสุดด้วยเลข",
        options: [{
            type: 3,
            name: 'number',
            description: 'ตัวเลขที่ต้องการตรวจสลากฯ',
            required: true
        }]
    },guild.id)

    /*DSclient
        .createCommand({
            name: "fthlotto",
            description: "แจ้งเตือนสลากกินแบ่งรัฐบาลเวลาสี่โมงเย็นของวันทึ่ออก",
        }, guild.id)
        .then(console.log)
        .catch(console.error);

    DSclient
        .createCommand({
            name: "cthlotto",
            description: "ยกเลิกแจ้งเตือนสลากกินแบ่งรัฐบาลของแชนแนลนี้",
        }, guild.id)
        .then(console.log)
        .catch(console.error);

    DSclient
        .createCommand({
            name: "lastlotto",
            description: "ดูสลากกินแบ่งรัฐบาลล่าสุด",
        }, guild.id)
        .then(console.log)
        .catch(console.error);

    DSclient
        .createCommand({
            name: "srchlot",
            description: "ตรวจสลากฯ ล่าสุดด้วยเลข",
            options?: [
                {
                name: "ตัวเลข",
                description: "เลขที่ต้องการจะตรวจในงวดล่าสุด",
                type: 3,// Type for this option. for a list of types see https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoptiontype
                required?: true,
                }
            ]
        }, guild.id)
        .then(console.log)
        .catch(console.error);*/
})

let scheduledMessage = new cron.CronJob('*/5 * 15-17 * * *', () => {

    // datedata

    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear() + 543;

    date = padLeadingZeros(date, 2);
    month = padLeadingZeros(month, 2);
    year = padLeadingZeros(year, 4);

    // end datedata

    let url = "https://thai-lottery1.p.rapidapi.com/?date=" + date + "" + month + "" + year + "&fresh";

    //let url = "https://lottsanook.vercel.app/api/?date="+date+""+month+""+year+"&fresh";

    let settings = { "method": "GET", "headers": { "x-rapidapi-key": "c34ed3c573mshbdf38eb6814e7a7p1e0eedjsnab10f5aef137", "x-rapidapi-host": "thai-lottery1.p.rapidapi.com" } };

    //let settings = { method: "Get" };

    fetch(url, settings)
        .then(res => res.json())
        .then((json) => {
            console.log(json.length)
            if (json.length == 7 || json.length == 8 || json.length == 9) {
                if (json[0][1] == "0" || json[0][1] == 0 || json[0][1] == "xxxxxx" || json[0][1] == "XXXXXX") {

                    /*client.users.fetch('133439202556641280').then(dm => {
                        dm.send('Bot ทำงานปกติและเช็คได้ว่าวันนี้หวยไม่ได้ออกหรือหวยยังออกไม่หมด')
                    })*/

                    if (json[0][1] == "xxxxxx" || json[0][1] == "XXXXXX") {
                        console.log('Bot ทำงานปกติและเช็คได้ว่าวันนี้หวยออกแต่ยังออกไม่หมด');

                        console.log('--------------------------------');
                    } else {
                        console.log('Bot ทำงานปกติและเช็คได้ว่าวันนี้หวยไม่ได้ออก');

                        console.log('--------------------------------');
                        
                        var lasttime = null

                        try {
                            const stats = fs.statSync('lastout.txt');
                            //const expiry = new Date().getTime()

                            lasttime = stats.mtime

                            // print file last modified date
                            //console.log(`File Data Last Modified: ${stats.mtime}`);
                            //console.log(`File Status Last Modified: ${stats.ctime}`);
                            //console.log(Date.getTime() <stats.mtime.getTime())
                            //if(stats.mtime.getTime() < expiry){
                            //    console.log('yes')
                            //}
                        } catch (error) {
                            //console.log(error);
                            fs.writeFile('lastout.txt', '0', function (err) {
                                if (err) {
                                    throw err
                                };
                                console.log('Saved!');
                            });
                        }
                    }

                    var fileContents = null;
                    try {
                        fileContents = fs.readFileSync('check.txt');
                    } catch (err) {

                    }

                    if (fileContents) {
                        if (fileContents != '0') {
                            fs.writeFile('check.txt', '0', function (err) {
                                if (err) {
                                    throw err
                                };
                                console.log('Saved!');
                            });
                        }
                    } else {
                        fs.writeFile('check.txt', '0', function (err) {
                            if (err) {
                                throw err
                            };
                            console.log('Saved!');
                        });
                    }
                    /*fs.readFile('check.txt', function(err, data) {
                        if(data != "0"){
                            fs.writeFile('check.txt', '0', function (err) {
                                if (err){
                                    throw err
                                };
                                console.log('Saved!');
                            });
                        }
                    });*/

                } else {

                    let imgurl = 'https://boy-discord-bot.herokuapp.com/?date=';

                    console.log("หวยออกครบแล้ว")

                    var fileContents = null;
                    try {
                        fileContents = fs.readFileSync('check.txt');
                    } catch (err) {

                    }

                    var lasttime = null

                    try {
                        const stats = fs.statSync('lastout.txt');
                        //const expiry = new Date().getTime()

                        lasttime = stats.mtime

                        // print file last modified date
                        //console.log(`File Data Last Modified: ${stats.mtime}`);
                        //console.log(`File Status Last Modified: ${stats.ctime}`);
                        //console.log(Date.getTime() <stats.mtime.getTime())
                        //if(stats.mtime.getTime() < expiry){
                        //    console.log('yes')
                        //}
                    } catch (error) {
                        //console.log(error);
                        fs.writeFile('lastout.txt', '0', function (err) {
                            if (err) {
                                throw err
                            };
                            console.log('Saved!');
                        });
                    }

                    if (fileContents) {
                        if (fileContents != "1" && lasttime.toDateString() != new Date().toDateString()) {
                            fs.writeFile('check.txt', '1', function (err) {
                                if (err) {
                                    throw err
                                };
                                console.log('Saved!');
                            });
                            fs.writeFile('lastout.txt', '1', function (err) {
                                if (err) {
                                    throw err
                                };
                                console.log('Saved!');
                            });

                            //use nodefetch to check url exist
                            fetch('https://lotimg.pwisetthon.com/?date=' + date + '' + month + '' + year, { method: "Get" })
                                .then(res => res.json())
                                .then((json) => {
                                    imgurl = 'https://lotimg.pwisetthon.com/?date=';
                                })
                                .catch(err => {
                                    console.log(err)
                                });

                            //if (urlExistSync('https://lotimg.pwisetthon.com/?date=' + date + '' + month + '' + year)) {
                                //imgurl = 'https://lotimg.pwisetthon.com/?date=';
                            //}

                            // use node-fetch to download image from imgurl variable
                            /*fetch(imgurl + date + '' + month + '' + year)
                                .then(res => res.buffer())
                                .then(buf => {
                                    // use sharp to convert image to png
                                    sharp(buf)
                                        .png()
                                        .toFile('lottery.png', (err, info) => {
                                            if (err) {
                                                console.log(err);
                                            }
                                            console.log('Image converted to png');
                                        });
                                });*/

                            fs.access('lottery_' + date + '' + month + '' + year+'.png', fs.F_OK, (err) => {
                                if (err) {
                                    //console.error(err)
                                    //return
                                    fetch('http://192.168.31.210:4000/?date=' + date + '' + month + '' + year)
                                    .then(res =>
                                        res.body.pipe(fs.createWriteStream('./lottery_' + date + '' + month + '' + year+'.png'))
                                    )
                                }
                                  
                                //file exists
                            })
            

                            fetch(process.env.URL + "/discordbot/chlist.txt", settings)
                                .then(res => res.json())
                                .then((json) => {
                                    for (i in json) {

                                        const file = new MessageAttachment('./lottery_' + date + '' + month + '' + year+'.png');

                                        const msg = new MessageEmbed()
                                            .setColor('#0099ff')
                                            .setTitle('ผลสลากกินแบ่งรัฐบาล')
                                            .setURL('https://www.glo.or.th/')
                                            .setDescription('งวดวันที่ ' + new Date().getDate() + ' ' + convertmonthtotext(month) + ' ' + year)
                                            .setThumbnail('https://www.glo.or.th/_nuxt/img/img_sbout_lottery_logo.2eff707.png')
                                            .addFields(
                                                { name: 'รางวัลที่หนึ่ง', value: json[0][1] },
                                                //{ name: '\u200B', value: '\u200B' },
                                                { name: 'เลขหน้าสามตัว', value: json[1][1] + ' | ' + json[1][2], inline: true },
                                                { name: 'เลขท้ายสามตัว', value: json[2][1] + ' | ' + json[2][2], inline: true },
                                                { name: 'เลขท้ายสองตัว', value: json[3][1] },
                                            )
                                            //.setImage('https://img.gs/fhcphvsghs/full,quality=low/' + imgurl + date + month + year)
                                            .setImage('attachment://lottery_' + date + '' + month + '' + year+'.png')
                                            .setTimestamp()
                                            .setFooter('ข้อมูลจาก github.com/Quad-B/lottsanook \nบอทจัดทำโดย Phongsakorn Wisetthon \nซื้อกาแฟให้ผม ko-fi.com/boyphongsakorn');

                                        console.log(imgurl + date + month + year)
                                        console.log(imgurl + '' + date + '' + month + '' + year)
                                        console.log('https://img.gs/fhcphvsghs/full,quality=low/' + imgurl + date + month + year)

                                        /*let wow = client.channels.cache.get(json[i])
                                        if(wow){
                                            try {
                                                client.channels.cache.get(json[i]).send(msg)
                                                .then((log) => {
                                                    console.log(log);
                                                })
                                                .catch((error) => {
                                                    //console.log(error);
                                                    client.users.fetch('133439202556641280').then(dm => {
                                                        dm.send('Bot ไม่สามารถส่งข้อความไปยังแชทแนว ' + json[i] + ' ได้เนี่องจาก ' + error)
                                                    })
                                                });
                                            } catch (error) {
                                                console.log('ok')
                                            }
                                            
                                        }*/
                                        try {
                                            client.channels.cache.get(json[i]).send({ embeds: [msg], files: [file] })
                                                .then((log) => {
                                                    console.log(log);
                                                })
                                                .catch((error) => {
                                                    //console.log(error);
                                                    /*client.users.fetch('133439202556641280').then(dm => {
                                                        dm.send('Bot ไม่สามารถส่งข้อความไปยังแชทแนว ' + json[i] + ' ได้เนี่องจาก ' + error)
                                                    })*/
                                                });
                                        } catch (error) {
                                            console.log('ok')
                                            client.users.fetch('133439202556641280').then(dm => {
                                                dm.send('Bot ไม่สามารถส่งข้อความไปยังแชทแนว ' + json[i] + ' ได้เนี่องจาก ' + error)
                                            })
                                        }
                                    }

                                });
                        }
                    }

                }
            }

        });

});

// When you want to start it, use:
scheduledMessage.start()
// You could also make a command to pause and resume the job

client.on('messageCreate', message => {
});

/*client.ws.on('INTERACTION_CREATE', async (interaction) => {
    const command = interaction.data.name.toLowerCase();

    if (command === 'fthlotto') {
        var options = {
            'method': 'GET',
            'url': process.env.URL + '/discordbot/addchannels.php?chid=' + interaction.channelId,
            'headers': {
            }
        };

        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
            if (response.body == "debug") {
                reply(interaction, 'ห้องนี้ติดตามสลากฯอยู่แล้ว')
            } else {
                reply(interaction, 'ติดตามสลากฯในห้องนี้เสร็จเรียบร้อย')
            }
        });
    }

    if (command === 'cthlotto') {
        var options = {
            'method': 'GET',
            'url': process.env.URL + '/discordbot/delchannels.php?chid=' + interaction.channelId,
            'headers': {
            }
        };

        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
            reply(interaction, 'ยกเลิกการติดตามสลากฯในห้องนี้เสร็จเรียบร้อย')
        });
    }

    if (command === 'lastlotto') {
        var options = {
            'method': 'GET',
            'url': 'http://192.168.31.210:5000/lastlot?info=true',
            'json': true,
            'headers': {
            }
        };

        /*var options = {
            method: 'GET',
            url: 'https://thai-lottery1.p.rapidapi.com/lastlot',
            qs: { info: 'true' },
            json: true,
            headers: {
                'x-rapidapi-key': 'c34ed3c573mshbdf38eb6814e7a7p1e0eedjsnab10f5aef137',
                'x-rapidapi-host': 'thai-lottery1.p.rapidapi.com',
                useQueryString: true
            }
        };*/

        /*await request(options, function (error, response, body) {
            if (error) throw new Error(error);

            try {
                const msg = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('ผลสลากกินแบ่งรัฐบาล')
                    .setURL('https://www.glo.or.th/')
                    .setDescription('งวดวันที่ ' + parseInt(body.info.date.substring(0, 2)) + ' ' + convertmonthtotext(body.info.date.substring(2, 4)) + ' ' + body.info.date.substring(4, 8))
                    .setThumbnail('https://www.glo.or.th/_nuxt/img/img_sbout_lottery_logo.2eff707.png')
                    .addFields(
                        { name: 'รางวัลที่หนึ่ง', value: body.win },
                        { name: 'เลขหน้าสามตัว', value: body.threefirst.replace(",", " | "), inline: true },
                        { name: 'เลขท้ายสามตัว', value: body.threeend.replace(",", " | "), inline: true },
                        { name: 'เลขท้ายสองตัว', value: body.twoend },
                    )
                    .setImage('https://lotimg.pwisetthon.com/?date=' + body.info.date)
                    .setTimestamp()
                    .setFooter('ข้อมูลจาก github.com/Quad-B/lottsanook \nบอทจัดทำโดย Phongsakorn Wisetthon \nซื้อกาแฟให้ผม ko-fi.com/boyphongsakorn');

                replyembedtype(interaction, msg)
            } catch (error) {

            }

        });
    }

    if (command === 'srchlot') {
        console.log(interaction.options.getString('number'));
        //get this year in buddhist year
        const year = new Date().getFullYear() + 543;

        var options = {
            'method': 'GET',
            'url': 'http://192.168.31.210:5000/gdpy?year='+year,
            'json': true,
            'headers': {
            }
        };

        await request(options, async function (error, response, body) {
            if (error) throw new Error(error);

            var optionss = {
                'method': 'GET',
                'url': 'http://192.168.31.210:5000/checklottery?by='+body[body.length-1]+'&search='+interaction.options.getString('number'),
                'json': false,
                'headers': {
                }
            };

            await request(optionss, async function (errors, responses, bodys) {
                if (errors) throw new Error(errors);

                if(bodys.search("111111") != -1){
                    reply(interaction, 'คุณถูกรางวัลที่หนึ่ง')
                }else if(bodys.search("222222") != -1){
                    reply(interaction, 'คุณถูกรางวัลที่สอง')
                }else if(bodys.search("333333") != -1){
                    reply(interaction, 'คุณถูกรางวัลที่สาม')
                }else if(bodys.search("444444") != -1){
                    reply(interaction, 'คุณถูกรางวัลที่สี่')
                }else if(bodys.search("555555") != -1){
                    reply(interaction, 'คุณถูกรางวัลที่ห้า')
                }else if(bodys.search("333000") != -1){
                    reply(interaction, 'คุณถูกรางวัลเลขหน้าสามตัว')
                }else if(bodys.search("000333") != -1){
                    reply(interaction, 'คุณถูกรางวัลเลขท้ายสามตัว')
                }else if(bodys.search("000022") != -1){
                    reply(interaction, 'คุณถูกรางวัลเลขท้ายสองตัว')
                }else if(bodys.search("111112") != -1){
                    reply(interaction, 'คุณถูกรางวัลใกล้เคียงรางวัลที่หนึ่ง')
                }else{
                    reply(interaction, 'คุณไม่ถูกรางวัล')
                }
            });

        });
    }
})*/

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
    
    if (interaction.commandName === 'fthlotto') {
        var options = {
            'method': 'GET',
            'url': process.env.URL + '/discordbot/addchannels.php?chid=' + interaction.channelId,
            'headers': {
            }
        };

        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
            if (response.body == "debug") {
                reply(interaction, 'ห้องนี้ติดตามสลากฯอยู่แล้ว')
            } else if(response.body == "error"){
                reply(interaction, 'ไม่สามารถติดตามสลากฯได้')
                console.log(interaction.channelId)
            }else{
                reply(interaction, 'ติดตามสลากฯในห้องนี้เสร็จเรียบร้อย')
            }
        });
    }

    if(interaction.commandName === 'cthlotto'){
        var options = {
            'method': 'GET',
            'url': process.env.URL + '/discordbot/delchannels.php?chid=' + interaction.channelId,
            'headers': {
            }
        };

        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
            reply(interaction, 'ยกเลิกการติดตามสลากฯในห้องนี้เสร็จเรียบร้อย')
        });
    }

    if(interaction.commandName === 'lastlotto'){
        var options = {
            'method': 'GET',
            'url': 'http://192.168.31.210:5000/lastlot?info=true',
            'json': true,
            'headers': {
            }
        };

        await request(options, function (error, response, body) {
            if (error) throw new Error(error);

            try {
                // use node-fetch to download image from imgurl variable
                /*fetch('https://lotimg.pwisetthon.com/?date=' + body.info.date)
                .then(res => res.buffer())
                .then(buf => {
                    // use sharp to convert image to png
                    sharp(buf)
                        .png()
                        .toFile('lottery.png', (err, info) => {
                            if (err) {
                                console.log(err);
                            }
                            console.log('Image converted to png');
                        });
                });*/

                /*if (!fs.existsSync('./lottery_'+body.info.date+'.png')) {
                    fetch('https://lotimg.pwisetthon.com/?date=' + body.info.date)
                        .then(res =>
                            res.body.pipe(fs.createWriteStream('./lottery_'+body.info.date+'.png'))
                        )
                }

                while (!fs.exists('./lottery_'+body.info.date+'.png')) {
                    console.log('Waiting for image to be downloaded');
                }

                if(fs.existsSync('./lottery_'+body.info.date+'.png')){
                    console.log('Image downloaded');
                }*/

                /*fs.access('./lottery_'+body.info.date+'.png', fs.constants.R_OK, (err) => {
                    if (err) {
                        console.log('error when checking lottery image');
                        fetch('http://192.168.31.210:4000/?date=' + body.info.date)
                        .then(res =>
                            res.body.pipe(fs.createWriteStream('./lottery_'+body.info.date+'.png'))
                        )
                    }
                });*/

                //check if lottery image not exist
                /*if (!fs.existsSync('./lottery_'+body.info.date+'.png')) {
                    //download lottery image
                    fetch('http://192.168.31.210:4000/?date=' + body.info.date)
                        .then(res =>
                            res.body.pipe(fs.createWriteStream('./lottery_'+body.info.date+'.png'))
                        )
                }

                //wait for image to be downloaded
                while (!fs.existsSync('./lottery_'+body.info.date+'.png')) {
                    console.log('Waiting for image to be downloaded');
                }*/
                
                try {
                    fs.access('./lottery_'+body.info.date+'.png', fs.F_OK, async (err) => {
                        if (err) {
                            //console.error(err)
                            await fetch('http://192.168.31.210:4000/?date=' + body.info.date)
                            .then(res =>
                                res.body.pipe(fs.createWriteStream('./lottery_'+body.info.date+'.png'))
                            )
                            return
                        }
                      
                        //file exists
                    })
                } catch (error) {
                    console.log('start download lottery image');
                    fetch('http://192.168.31.210:4000/?date=' + body.info.date)
                        .then(res =>
                            res.body.pipe(fs.createWriteStream('./lottery_'+body.info.date+'.png'))
                        )
                }

                //wait for image to be downloaded
                while (!fs.existsSync('./lottery_'+body.info.date+'.png')) {
                    console.log('Waiting for image to be downloaded');
                    console.log(fs.existsSync('./lottery_'+body.info.date+'.png'))
                    console.log('./lottery_'+body.info.date+'.png')
                }

                const file = new MessageAttachment('./lottery_'+body.info.date+'.png');

                const msg = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('ผลสลากกินแบ่งรัฐบาล')
                    .setURL('https://www.glo.or.th/')
                    .setDescription('งวดวันที่ ' + parseInt(body.info.date.substring(0, 2)) + ' ' + convertmonthtotext(body.info.date.substring(2, 4)) + ' ' + body.info.date.substring(4, 8))
                    .setThumbnail('https://raw.githubusercontent.com/boyphongsakorn/pwisetthon-discord-bot/master/docs/glologo.png')
                    .addFields(
                        { name: 'รางวัลที่หนึ่ง', value: body.win },
                        { name: 'เลขหน้าสามตัว', value: body.threefirst.replace(",", " | "), inline: true },
                        { name: 'เลขท้ายสามตัว', value: body.threeend.replace(",", " | "), inline: true },
                        { name: 'เลขท้ายสองตัว', value: body.twoend },
                    )
                    //.setImage('https://lotimg.pwisetthon.com/?date=' + body.info.date)
                    .setImage('attachment://lottery_'+body.info.date+'.png')
                    .setTimestamp()
                    .setFooter({text: 'ข้อมูลจาก rapidapi.com/boyphongsakorn/api/thai-lottery1 \nบอทจัดทำโดย Phongsakorn Wisetthon \nซื้อกาแฟให้ผม ko-fi.com/boyphongsakorn'});

                //replyembedtype(interaction, msg)
                interaction.reply({ embeds: [msg],files: [file] })
            } catch (error) {
                console.log('error')
                console.log(error)
            }

        });
    }

	if (interaction.commandName === 'srchlot') {
		console.log(interaction.options.getString('number'));
        //get this year in buddhist year
        const year = new Date().getFullYear() + 543;

        var options = {
            'method': 'GET',
            'url': 'http://192.168.31.210:5000/gdpy?year='+year,
            'json': true,
            'headers': {
            }
        };

        await request(options, async function (error, response, body) {
            if (error) throw new Error(error);

            var optionss = {
                'method': 'GET',
                'url': 'http://192.168.31.210:5000/checklottery?by='+body[body.length-1]+'&search='+interaction.options.getString('number'),
                'json': false,
                'headers': {
                }
            };

            await request(optionss, async function (errors, responses, bodys) {
                if (errors) throw new Error(errors);

                if(bodys.search("111111") != -1){
                    reply(interaction, 'คุณถูกรางวัลที่หนึ่ง')
                }else if(bodys.search("222222") != -1){
                    reply(interaction, 'คุณถูกรางวัลที่สอง')
                }else if(bodys.search("333333") != -1){
                    reply(interaction, 'คุณถูกรางวัลที่สาม')
                }else if(bodys.search("444444") != -1){
                    reply(interaction, 'คุณถูกรางวัลที่สี่')
                }else if(bodys.search("555555") != -1){
                    reply(interaction, 'คุณถูกรางวัลที่ห้า')
                }else if(bodys.search("333000") != -1){
                    reply(interaction, 'คุณถูกรางวัลเลขหน้าสามตัว')
                }else if(bodys.search("000333") != -1){
                    reply(interaction, 'คุณถูกรางวัลเลขท้ายสามตัว')
                }else if(bodys.search("000022") != -1){
                    reply(interaction, 'คุณถูกรางวัลเลขท้ายสองตัว')
                }else if(bodys.search("111112") != -1){
                    reply(interaction, 'คุณถูกรางวัลใกล้เคียงรางวัลที่หนึ่ง')
                }else{
                    reply(interaction, 'คุณไม่ถูกรางวัล')
                }
            });

        });
	}
});

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

const replyembedtype = (interaction, response) => {
    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4,
            data: {
                embeds: [
                    response
                ]
            }
        }
    })
}

client.login(process.env.BOT_TOKEN);