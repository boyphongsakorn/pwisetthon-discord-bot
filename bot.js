const { MessageAttachment, MessageEmbed, Client, Intents, MessageActionRow, MessageSelectMenu } = require('discord.js');
const cron = require("cron");
const fetch = require('node-fetch');
const request = require('request');
const download = require('image-downloader')
var fs = require('fs');
var http = require('http');
const pngToJpeg = require('png-to-jpeg');
var mysql = require('mysql');
var moment = require('moment');

require('dotenv').config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

//create mysql connection
var con = mysql.createConnection({
    host: "192.168.31.210",
    user: "boyphongsakorn",
    password: "team1556th",
    database: "discordbot"
});

//create a server object:
http.createServer(async function (req, res) {
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
    } else if (req.url === '/botimage') {
        console.log(client.user.avatarURL({ format: 'jpg', dynamic: true, size: 512 }));
        //if botimage.jpg is exist don't download
        if (!fs.existsSync('./botimage.jpg')) {
            //download image from url and response to client
            download.image({
                url: client.user.avatarURL({ format: 'jpg', dynamic: true, size: 512 }),
                dest: './botimage.jpg'
            }).then(({ filename, image }) => {
                console.log('File saved to', filename)
                fs.readFile('./botimage.jpg', function (err, data) {
                    if (err) {
                        throw err;
                    }
                    res.writeHead(200, { 'Content-Type': 'image/jpg' });
                    res.write(data);
                    res.end();
                });
            })
        } else {
            fs.readFile('./botimage.jpg', function (err, data) {
                if (err) {
                    throw err;
                }
                res.writeHead(200, { 'Content-Type': 'image/jpg' });
                res.write(data);
                res.end();
            });
        }
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

async function guildCommandCreate(guildid) {
    //if guildid is array
    if (Array.isArray(guildid)) {
        for (let i = 0; i < guildid.length; i++) {
            await guildCommandCreate(guildid[i]);
        }
    } else {
        const thatguild = client.guilds.cache.get(guildid);
        let commands

        if (thatguild) {
            commands = thatguild.commands
        } else {
            commands = client.applications?.commands
        }

        commands?.create({
            name: 'fthlotto',
            description: "แจ้งเตือนสลากกินแบ่งรัฐบาลเวลาสี่โมงเย็นของวันทึ่ออก"
        }, guildid)


        commands?.create({
            name: 'flottomode',
            description: "ปรับโหมดการแจ้งเตือนสลากกินแบ่งฯ"
        }, guildid)

        commands?.create({
            name: 'cthlotto',
            description: "ยกเลิกแจ้งเตือนสลากกินแบ่งรัฐบาลของแชนแนลนี้"
        }, guildid)

        commands?.create({
            name: 'lastlotto',
            description: "ดูสลากกินแบ่งรัฐบาลล่าสุด"
        }, guildid)

        commands?.create({
            name: 'aithing',
            description: "ดูเลขเด็ด 10 อันดับจากการใช้ Ai"
        }, guildid)

        commands?.create({
            name: 'lotsheet',
            description: "ใบตรวจสลากกินแบ่งรัฐบาล"
        }, guildid)

        commands?.create({
            name: 'synumber',
            description: "บันทึกเลขสลากฯที่คุณซื้อ เพื่อรับแจ้งเตือน",
            options: [{
                type: 3,
                name: 'number',
                description: 'ตัวเลขที่คุณซื้อหรือเลขที่คุณต้องการแจ้งเตือน',
                required: true
            }]
        }, guildid)

        commands?.create({
            name: 'srchlot',
            description: "ตรวจสลากฯ ล่าสุดด้วยเลข",
            options: [{
                type: 3,
                name: 'number',
                description: 'ตัวเลขที่ต้องการตรวจสลากฯ',
                required: true
            }]
        }, guildid)

        commands?.create({
            name: 'ตรวจสลากฯ',
            type: 3
        }, guildid)

        commands?.create({
            name: 'checkconnection',
            description: 'เช็คการเชื่อมต่อ'
        }, guildid)

        commands?.create({
            name: 'syhistory',
            description: 'ประวัติการบันทึกสลากฯ'
        }, guildid)

        //return good
        return true;
    }
}

async function guildCommandDelete(guild) {
    await guild.commands.fetch()
        .then(async function (commands) {
            await commands.forEach(command => {
                command.delete()
                    .then(console.log)
                    .catch(console.error);
            });
            return true;
        });
}

async function guildCommandDeleteandCreate(guild) {
    await guild.commands.fetch()
        .then(async function (commands) {
            await commands.forEach(command => {
                command.delete()
                    .then(/*console.log*/)
                    .catch(console.error);
            });
        });

    // wait 5 sec

    await new Promise(resolve => setTimeout(resolve, 3000));

    let guildid = guild.id;
    const thatguild = client.guilds.cache.get(guildid);
    let commands

    if (thatguild) {
        commands = thatguild.commands
    } else {
        commands = client.applications?.commands
    }

    commands?.create({
        name: 'fthlotto',
        description: "แจ้งเตือนสลากกินแบ่งรัฐบาลเวลาสี่โมงเย็นของวันทึ่ออก"
    }, guildid)


    commands?.create({
        name: 'flottomode',
        description: "ปรับโหมดการแจ้งเตือนสลากกินแบ่งฯ"
    }, guildid)

    commands?.create({
        name: 'cthlotto',
        description: "ยกเลิกแจ้งเตือนสลากกินแบ่งรัฐบาลของแชนแนลนี้"
    }, guildid)

    commands?.create({
        name: 'lastlotto',
        description: "ดูสลากกินแบ่งรัฐบาลล่าสุด"
    }, guildid)

    commands?.create({
        name: 'aithing',
        description: "ดูเลขเด็ด 10 อันดับจากการใช้ Ai"
    }, guildid)

    commands?.create({
        name: 'lotsheet',
        description: "ใบตรวจสลากกินแบ่งรัฐบาล"
    }, guildid)

    commands?.create({
        name: 'synumber',
        description: "บันทึกเลขสลากฯที่คุณซื้อ เพื่อรับแจ้งเตือน",
        options: [{
            type: 3,
            name: 'number',
            description: 'ตัวเลขที่คุณซื้อหรือเลขที่คุณต้องการแจ้งเตือน',
            required: true
        }]
    }, guildid)

    commands?.create({
        name: 'srchlot',
        description: "ตรวจสลากฯ ล่าสุดด้วยเลข",
        options: [{
            type: 3,
            name: 'number',
            description: 'ตัวเลขที่ต้องการตรวจสลากฯ',
            required: true
        }]
    }, guildid)

    commands?.create({
        name: 'ตรวจสลากฯ',
        type: 3
    }, guildid)

    commands?.create({
        name: 'checkconnection',
        description: 'เช็คการเชื่อมต่อ'
    }, guildid)

    commands?.create({
        name: 'syhistory',
        description: 'ประวัติการบันทึกสลากฯ'
    }, guildid)

    //return good
    return true;
}

// end functions

client.once('ready', () => {
    con.connect(function (err) {
        if (err) throw err;
        console.log("Database Connected!");
        //get all guilds
        client.guilds.cache.forEach(async function (guild) {
            //delete all commands in guild
            //if guild.id == '309312041632661504'
            /*guild.commands.fetch.then(commands => {
                commands.forEach(command => {
                    command.delete();
                });
            });*/
            //if (guild.id == '309312041632661504') {
            /*guild.commands.forEach(command => {
                command.delete()
            })*/
            /*await guildCommandDelete(guild);
            await guildCommandCreate(guild.id);*/
            //}
            await guildCommandDeleteandCreate(guild);
        });
        client.user.setPresence({ activities: [{ name: 'discordbot.pwisetthon.com' }], status: 'online' });
        client.users.fetch('133439202556641280').then(dm => {
            dm.send('Bot เริ่มต้นการทำงานแล้ว')
        });
        //console.log(client.channels.cache.get('908787448446844928'))
        //console.log(client.channels.cache.get('908787448446844928').guildId)
        console.log('I am ready!');
    });
});

client.on("guildCreate", guild => {

    console.log("Joined a new guild: " + guild.id);

    client.users.fetch('133439202556641280').then(dm => {
        dm.send('ดิส ' + guild.name + '(' + guild.id + ') ได้เชิญ บอท PWisetthon.com เข้าเรียบร้อยแล้ว')
    });

    if (guild.systemChannelId != null && guild.systemChannelId != undefined) {
        console.log("System Channel: " + guild.systemChannelId);

        var options = {
            'method': 'GET',
            'url': process.env.URL + '/discordbot/addchannels.php?chid=' + guild.systemChannelId,
            'headers': {
            }
        };

        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
            if (response.body == "debug") {
                client.channels.cache.get(guild.systemChannelId).send('ขอบคุณ! ที่เชิญเราเข้าส่วนหนึ่งในดิสของคุณ')
                    .catch(console.error);
            } else {
                client.channels.cache.get(guild.systemChannelId).send('ขอบคุณ! ที่เชิญเราเข้าเป็นส่วนร่วมของดิสคุณ เราได้ทำการติดตามสลากฯให้สำหรับดิสนี้เรียบร้อยแล้ว! \nใช้คำสั่ง /cthlotto เพื่อยกเลิก')
                    .catch(console.error);
            }
        });
    }

    //use guildCommandCreate
    guildCommandCreate(guild.id);

    /*const thatguild = client.guilds.cache.get(guild.id);
    let commands

    if (thatguild) {
        commands = thatguild.commands
    } else {
        commands = client.applications?.commands
    }

    commands?.create({
        name: 'fthlotto',
        description: "แจ้งเตือนสลากกินแบ่งรัฐบาลเวลาสี่โมงเย็นของวันทึ่ออก"
    }, guild.id)

    commands?.create({
        name: 'cthlotto',
        description: "ยกเลิกแจ้งเตือนสลากกินแบ่งรัฐบาลของแชนแนลนี้"
    }, guild.id)

    commands?.create({
        name: 'lastlotto',
        description: "ดูสลากกินแบ่งรัฐบาลล่าสุด"
    }, guild.id)

    commands?.create({
        name: 'aithing',
        description: "ดูเลขเด็ด 10 อันดับจากการใช้ Ai"
    }, guild.id)

    commands?.create({
        name: 'lotsheet',
        description: "ใบตรวจสลากกินแบ่งรัฐบาล"
    }, guild.id)

    commands?.create({
        name: 'synumber',
        description: "บันทึกเลขสลากฯที่คุณซื้อ เพื่อรับแจ้งเตือน",
        options: [{
            type: 3,
            name: 'number',
            description: 'ตัวเลขที่คุณซื้อหรือเลขที่คุณต้องการแจ้งเตือน',
            required: true
        }]
    }, guild.id)

    commands?.create({
        name: 'srchlot',
        description: "ตรวจสลากฯ ล่าสุดด้วยเลข",
        options: [{
            type: 3,
            name: 'number',
            description: 'ตัวเลขที่ต้องการตรวจสลากฯ',
            required: true
        }]
    }, guild.id)

    commands?.create({
        name: 'ตรวจสลากฯ',
        type: 3
    }, guild.id)

    commands?.create({
        name: 'checkconnection',
        description: 'เช็คการเชื่อมต่อ'
    }, guild.id)

    commands?.create({
        name: 'syhistory',
        description: 'ประวัติการบันทึกสลากฯ'
    }, guild.id)*/
})

let scheduledMessage = new cron.CronJob('* 15-17 * * *', () => {

    // datedata

    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear() + 543;

    date = padLeadingZeros(date, 2);
    month = padLeadingZeros(month, 2);
    year = padLeadingZeros(year, 4);

    // end datedata

    //let url = "https://thai-lottery1.p.rapidapi.com/?date=" + date + "" + month + "" + year + "&fresh";

    //let url = "https://lottsanook.vercel.app/api/?date="+date+""+month+""+year+"&fresh";

    //let settings = { "method": "GET", "headers": { "x-rapidapi-key": "c34ed3c573mshbdf38eb6814e7a7p1e0eedjsnab10f5aef137", "x-rapidapi-host": "thai-lottery1.p.rapidapi.com" } };

    //let settings = { method: "Get" };

    let url = "http://192.168.31.210:5000/?date=" + date + "" + month + "" + year + "&fresh";
    let settings = { "method": "GET" };

    fetch(url, settings)
        .then(res => res.json())
        .then(async (json) => {
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
                        fs.writeFileSync('check.txt', '0', function (err) {
                            if (err) {
                                throw err
                            };
                            console.log('Saved!');
                            /*var d = new Date();
                            d.setDate(d.getDate() - 2);
                            fs.utimesSync(path.join(__dirname, 'check.txt'), new Date(), d)
                            fileContents = fs.readFileSync('check.txt');*/
                        });
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
                        fs.writeFileSync('lastout.txt', '0', function (err) {
                            if (err) {
                                throw err
                            };
                            console.log('Saved!');
                            var d = new Date();
                            d.setDate(d.getDate() - 2);
                            fs.utimesSync(path.join(__dirname, 'lastout.txt'), new Date(), d)
                            const stats = fs.statSync('lastout.txt');
                            lasttime = stats.mtime
                        });
                    }

                    if (fileContents) {
                        let lastdatefromsql
                        con.query("SELECT * FROM lott_round ORDER BY round DESC LIMIT 1", function (err, result, fields) {
                            if (err) throw err;
                            //console.log(result);
                            lastdatefromsql = result[0].round; //YYYY-MM-DD
                        });
                        let today = new Date();
                        // convert today to yyyy-mm-dd
                        let dd = today.getDate();
                        let mm = today.getMonth() + 1; //January is 0!
                        let yyyy = today.getFullYear();
                        dd = padLeadingZeros(dd, 2);
                        mm = padLeadingZeros(mm, 2);
                        todayformat = yyyy + '-' + mm + '-' + dd;
                        if (fileContents != "1" && (lasttime.toDateString() != today.toDateString() || todayformat != lastdatefromsql)) {
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
                            //insert to sql
                            con.query("INSERT INTO lott_round (id, round) VALUES ('" + date + "" + month + "" + year + "', '" + todayformat + "')", function (err, result, fields) {
                                if (err) throw err;
                                //console.log(result);
                                console.log('Insert complete');
                            });

                            //use nodefetch to check url exist
                            fetch('https://lotimg.pwisetthon.com/fbbg', { method: "Get" })
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

                            /*fs.access('lottery_' + date + '' + month + '' + year + '.png', fs.F_OK, (err) => {
                                if (err) {
                                    //console.error(err)
                                    //return
                                    fetch('http://192.168.31.210:4000/?date=' + date + '' + month + '' + year)
                                        .then(res =>
                                            res.body.pipe(fs.createWriteStream('./lottery_' + date + '' + month + '' + year + '.png'))
                                        )
                                }

                                //file exists
                            })*/

                            if (fs.existsSync('./lottery_' + date + '' + month + '' + year + '.png') == false) {
                                const options = {
                                    url: 'http://192.168.31.210:4000/?date=' + date + '' + month + '' + year,
                                    dest: './lottery_' + date + '' + month + '' + year + '.png'
                                }

                                await download.image(options)
                                    .then(({ filename }) => {
                                        console.log('Saved to', filename)  // saved to /path/to/dest/image.jpg
                                    })
                                    .catch((err) => console.error(err))

                                const optionsgold = {
                                    url: 'http://192.168.31.210:4000/?date=' + date + '' + month + '' + year + '&mode=gold',
                                    dest: './lottery_' + date + '' + month + '' + year + '_gold.png'
                                }

                                await download.image(optionsgold)
                                    .then(({ filename }) => {
                                        console.log('Saved to', filename)  // saved to /path/to/dest/image.jpg
                                    })
                                    .catch((err) => console.error(err))
                            }

                            fetch(process.env.URL + "/discordbot/chlist.txt", settings)
                                .then(res => res.json())
                                .then((wow) => {
                                    for (i in wow) {

                                        //select lott_resultmode from lott_main where lott_guildid = client.channels.cache.get(json[i]).guildId
                                        con.query("SELECT * FROM lott_main WHERE lott_guildid = '" + client.channels.cache.get(wow[i]).guildId + "'", function (err, result, fields) {
                                            //if (err) throw err;
                                            if (result.length == 0 || result[0].lott_resultmode == 'normal' || err) {
                                                const file = new MessageAttachment('./lottery_' + date + '' + month + '' + year + '.png');

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
                                                    .setImage('attachment://lottery_' + date + '' + month + '' + year + '.png')
                                                    .setTimestamp()
                                                    .setFooter('ข้อมูลจาก rapidapi.com/boyphongsakorn/api/thai-lottery1 \nบอทจัดทำโดย Phongsakorn Wisetthon \nซื้อกาแฟให้ผม ko-fi.com/boyphongsakorn');

                                                try {
                                                    client.channels.cache.get(wow[i]).send({ embeds: [msg], files: [file] })
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
                                                        dm.send('Bot ไม่สามารถส่งข้อความไปยังแชทแนว ' + wow[i] + ' ได้เนี่องจาก ' + error)
                                                    })
                                                }
                                            } else {
                                                const file = new MessageAttachment('./lottery_' + date + '' + month + '' + year + '_gold.png');

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
                                                    .setImage('attachment://lottery_' + date + '' + month + '' + year + '_gold.png')
                                                    .setTimestamp()
                                                    .setFooter('ข้อมูลจาก rapidapi.com/boyphongsakorn/api/thai-lottery1 \nบอทจัดทำโดย Phongsakorn Wisetthon \nซื้อกาแฟให้ผม ko-fi.com/boyphongsakorn');

                                                try {
                                                    client.channels.cache.get(wow[i]).send({ embeds: [msg], files: [file] })
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
                                                        dm.send('Bot ไม่สามารถส่งข้อความไปยังแชทแนว ' + wow[i] + ' ได้เนี่องจาก ' + error)
                                                    })
                                                }
                                            }
                                        });

                                        /*console.log(imgurl + date + month + year)
                                        console.log(imgurl + '' + date + '' + month + '' + year)
                                        console.log('https://img.gs/fhcphvsghs/full,quality=low/' + imgurl + date + month + year)*/

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
                                    }

                                });

                            //check number user save
                            con.query("SELECT * FROM lott_table", function (err, result, fields) {
                                if (err) throw err;
                                console.log(result);
                                //loop result
                                for (i in result) {
                                    console.log(result[i].numberbuy)
                                    let optitot = { "method": "GET", "headers": { "x-rapidapi-host": "thai-lottery1.p.rapidapi.com", "x-rapidapi-key": "c34ed3c573mshbdf38eb6814e7a7p1e0eedjsnab10f5aef137" } };
                                    fetch("https://thai-lottery1.p.rapidapi.com/checklottery?by=" + date + "" + month + "" + year + "&search=" + result[i].numberbuy, optitot)
                                        .then(res => res.text())
                                        .then((json) => {
                                            //if json is null or empty send message to result[i].discord_id
                                            if (json == '' || json == null) {
                                                var sql = "UPDATE lott_table SET status = 'ไม่ถูก',lotround = '" + (year - 543) + "-" + month + "-" + date + "' WHERE lott_id = '" + result[i].lott_id + "'";
                                                con.query(sql, function (err, result) {
                                                    if (err) throw err;
                                                    client.users.fetch(result[i].discord_id).then(dm => {
                                                        dm.send('ขออภัยค่ะ! เลข ' + result[i].numberbuy + ' ยังไม่ถูกรางวัลนี้ค่ะ')
                                                    })
                                                });
                                            } else {
                                                var sql = "UPDATE lott_table SET status = 'win',lotround = '" + (year - 543) + "-" + month + "-" + date + "' WHERE lott_id = '" + result[i].lott_id + "'";
                                                con.query(sql, function (err, result) {
                                                    if (err) throw err;
                                                    client.users.fetch(result[i].discord_id).then(dm => {
                                                        dm.send('ยินดีด้วย! เลข ' + result[i].numberbuy + ' ถูกรางวัลนี้ค่ะ')
                                                    })
                                                });
                                            }
                                        });
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

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand() && !interaction.isContextMenu() && !interaction.isSelectMenu()) return;

    if (interaction.commandName === 'fthlotto') {
        await interaction.deferReply();
        var options = {
            'method': 'GET',
            'url': process.env.URL + '/discordbot/addchannels.php?chid=' + interaction.channelId,
            'headers': {
            }
        };

        request(options, async function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
            if (response.body == "debug") {
                //reply(interaction, 'ห้องนี้ติดตามสลากฯอยู่แล้ว')
                await interaction.editReply('ห้องนี้ติดตามสลากฯอยู่แล้ว')
            } else if (response.body == "error") {
                //reply(interaction, 'ไม่สามารถติดตามสลากฯได้')
                await interaction.editReply('ไม่สามารถติดตามสลากฯได้')
                console.log(interaction.channelId)
            } else {
                //reply(interaction, 'ติดตามสลากฯในห้องนี้เสร็จเรียบร้อย')
                await interaction.editReply('ติดตามสลากฯในห้องนี้เสร็จเรียบร้อย')
            }
        });
    }

    if (interaction.commandName === 'cthlotto') {
        await interaction.deferReply();
        var options = {
            'method': 'GET',
            'url': process.env.URL + '/discordbot/delchannels.php?chid=' + interaction.channelId,
            'headers': {
            }
        };

        request(options, async function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
            if (response.body == "debug") {
                //reply(interaction, 'เอ้! ห้องนี้ไม่ได้ติดตามสลากฯ')
                await interaction.editReply('เอ้! ห้องนี้ไม่ได้ติดตามสลากฯ')
            } else {
                //reply(interaction, 'ยกเลิกการติดตามสลากฯในห้องนี้เสร็จเรียบร้อย')
                await interaction.editReply('ยกเลิกการติดตามสลากฯในห้องนี้เสร็จเรียบร้อย')
            }
        });
    }

    if (interaction.commandName === 'lastlotto') {
        //await interaction.reply('Loading!');
        await interaction.deferReply();

        var options = {
            'method': 'GET',
            'url': 'http://192.168.31.210:5000/lastlot?info=true',
            'json': true,
            'headers': {
            }
        };

        await request(options, async function (error, response, body) {
            if (error) throw new Error(error);

            try {

                if (fs.existsSync('./lottery_' + body.info.date + '.png') == false && fs.existsSync('./lottery_' + body.info.date + '_gold.png') == false) {
                    const options = {
                        url: 'http://192.168.31.210:4000/?date=' + body.info.date,
                        dest: './lottery_' + body.info.date + '.png'
                    }

                    await download.image(options)
                        .then(({ filename }) => {
                            console.log('Saved to', filename)  // saved to /path/to/dest/image.jpg
                        })
                        .catch((err) => console.error(err))

                    const optionsgold = {
                        url: 'http://192.168.31.210:4000/?date=' + body.info.date + '&mode=gold',
                        dest: './lottery_' + body.info.date + '_gold.png'
                    }

                    await download.image(optionsgold)
                        .then(({ filename }) => {
                            console.log('Saved to', filename)  // saved to /path/to/dest/image.jpg
                        })
                        .catch((err) => console.error(err))
                }

                /*con.query("SELECT * FROM lott_main WHERE lott_guildid = '" + interaction.guildId + "'", async function (err, result, fields) {
                    if (err) throw err;
                    if (result.length == 0 || result[0].lott_resultmode == 'normal') {*/
                        const file = new MessageAttachment('./lottery_' + body.info.date + '.png');

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
                            .setImage('attachment://lottery_' + body.info.date + '.png')
                            .setTimestamp()
                            .setFooter({ text: 'ข้อมูลจาก rapidapi.com/boyphongsakorn/api/thai-lottery1 \nบอทจัดทำโดย Phongsakorn Wisetthon \nซื้อกาแฟให้ผม ko-fi.com/boyphongsakorn' });

                        //replyembedtype(interaction, msg)
                        await interaction.editReply({ embeds: [msg], files: [file] })
                    /*}else{
                        const file = new MessageAttachment('./lottery_' + body.info.date + '_gold.png');

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
                            .setImage('attachment://lottery_' + body.info.date + '_gold.png')
                            .setTimestamp()
                            .setFooter({ text: 'ข้อมูลจาก rapidapi.com/boyphongsakorn/api/thai-lottery1 \nบอทจัดทำโดย Phongsakorn Wisetthon \nซื้อกาแฟให้ผม ko-fi.com/boyphongsakorn' });

                        //replyembedtype(interaction, msg)
                        await interaction.editReply({ embeds: [msg], files: [file] })
                    }
                });*/
            } catch (error) {
                console.log('error')
                console.log(error)
            }

        });
    }

    if (interaction.commandName === 'srchlot' || interaction.commandName === 'ตรวจสลากฯ') {
        //console.log(interaction.options.getString('number'));
        let numbertofind = interaction.options.getString('number');
        if (interaction.options.getString('number') == null && interaction.commandName === 'ตรวจสลากฯ') {
            //let ohmygod = interaction.channel.message.fetch(interaction.targetId);
            //numbertofind = ohmygod.content;
            console.log(interaction.options.get('message'));
            numbertofind = interaction.options.get('message').message.content;
        }
        console.log(numbertofind);
        await interaction.deferReply();
        //get this year in buddhist year
        const year = new Date().getFullYear() + 543;

        var options = {
            'method': 'GET',
            'url': 'http://192.168.31.210:5000/lastlot?info=true',
            'json': true,
            'headers': {
            }
        };

        await request(options, async function (error, response, body) {
            if (error) throw new Error(error);

            var optionss = {
                'method': 'GET',
                'url': 'http://192.168.31.210:5000/checklottery?by=' + body.info.date + '&search=' + numbertofind,
                'json': false,
                'headers': {
                }
            };

            await request(optionss, async function (errors, responses, bodys) {
                if (errors) throw new Error(errors);

                if (bodys.search("111111") != -1) {
                    //reply(interaction, 'คุณถูกรางวัลที่หนึ่ง')
                    //await interaction.editReply('คุณถูกรางวัลที่หนึ่ง')
                    const msg = new MessageEmbed()
                        .setColor('#FFD700')
                        .setTitle('เลขที่คุณตรวจคือ ' + numbertofind + ' ถูกรางวัลที่หนึ่ง')

                    await interaction.editReply({ embeds: [msg] })
                } else if (bodys.search("222222") != -1) {
                    //reply(interaction, 'คุณถูกรางวัลที่สอง')
                    //await interaction.editReply('คุณถูกรางวัลที่สอง')
                    const msg = new MessageEmbed()
                        .setColor('#DAA520')
                        .setTitle('เลขที่คุณตรวจคือ ' + numbertofind + ' คุณถูกรางวัลที่สอง')

                    await interaction.editReply({ embeds: [msg] })
                } else if (bodys.search("333333") != -1) {
                    //reply(interaction, 'คุณถูกรางวัลที่สาม')
                    //await interaction.editReply('คุณถูกรางวัลที่สาม')
                    const msg = new MessageEmbed()
                        .setColor('#F0E68C')
                        .setTitle('เลขที่คุณตรวจคือ ' + numbertofind + ' คุณถูกรางวัลที่สาม')

                    await interaction.editReply({ embeds: [msg] })
                } else if (bodys.search("444444") != -1) {
                    //reply(interaction, 'คุณถูกรางวัลที่สี่')
                    //await interaction.editReply('คุณถูกรางวัลที่สี่')
                    const msg = new MessageEmbed()
                        .setColor('#EEE8AA')
                        .setTitle('เลขที่คุณตรวจคือ ' + numbertofind + ' คุณถูกรางวัลที่สี่')

                    await interaction.editReply({ embeds: [msg] })
                } else if (bodys.search("555555") != -1) {
                    //reply(interaction, 'คุณถูกรางวัลที่ห้า')
                    //await interaction.editReply('คุณถูกรางวัลที่ห้า')
                    const msg = new MessageEmbed()
                        .setColor('#FAFAD2')
                        .setTitle('เลขที่คุณตรวจคือ ' + numbertofind + ' คุณถูกรางวัลที่ห้า')

                    await interaction.editReply({ embeds: [msg] })
                } else if (bodys.search("333000") != -1) {
                    //reply(interaction, 'คุณถูกรางวัลเลขหน้าสามตัว')
                    //await interaction.editReply('คุณถูกรางวัลเลขหน้าสามตัว')
                    const msg = new MessageEmbed()
                        .setColor('#D4AF37')
                        .setTitle('เลขที่คุณตรวจคือ ' + numbertofind + ' คุณถูกรางวัลเลขหน้าสามตัว')

                    await interaction.editReply({ embeds: [msg] })
                } else if (bodys.search("000333") != -1) {
                    //reply(interaction, 'คุณถูกรางวัลเลขท้ายสามตัว')
                    //await interaction.editReply('คุณถูกรางวัลเลขท้ายสามตัว')
                    const msg = new MessageEmbed()
                        .setColor('#CFB53B')
                        .setTitle('เลขที่คุณตรวจคือ ' + numbertofind + ' คุณถูกรางวัลเลขท้ายสามตัว')

                    await interaction.editReply({ embeds: [msg] })
                } else if (bodys.search("000022") != -1) {
                    //reply(interaction, 'คุณถูกรางวัลเลขท้ายสองตัว')
                    //await interaction.editReply('คุณถูกรางวัลเลขท้ายสองตัว')
                    const msg = new MessageEmbed()
                        .setColor('#C5B358')
                        .setTitle('เลขที่คุณตรวจคือ ' + numbertofind + ' คุณถูกรางวัลเลขท้ายสองตัว')

                    await interaction.editReply({ embeds: [msg] })
                } else if (bodys.search("111112") != -1) {
                    //reply(interaction, 'คุณถูกรางวัลใกล้เคียงรางวัลที่หนึ่ง')
                    //await interaction.editReply('คุณถูกรางวัลใกล้เคียงรางวัลที่หนึ่ง')
                    const msg = new MessageEmbed()
                        .setColor('#FFDF00')
                        .setTitle('เลขที่คุณตรวจคือ ' + numbertofind + ' คุณถูกรางวัลใกล้เคียงรางวัลที่หนึ่ง')

                    await interaction.editReply({ embeds: [msg] })
                } else {
                    //reply(interaction, 'คุณไม่ถูกรางวัล')
                    //await interaction.editReply('คุณไม่ถูกรางวัล')
                    const msg = new MessageEmbed()
                        .setColor('#ff0000')
                        .setTitle('เลขที่คุณตรวจคือ ' + numbertofind + ' คุณไม่ถูกรางวัล')

                    await interaction.editReply({ embeds: [msg] })
                }
            });

        });
    }

    if (interaction.commandName === 'aithing') {
        //deferReply
        await interaction.deferReply();

        // download image from url
        const options = {
            url: 'https://api.apiflash.com/v1/urltoimage?access_key=fda71090a5d94be7b45fe09cb2db840c&delay=10&fresh=true&height=720&url=https%3A%2F%2Flottsanook-chitai-production.up.railway.app%2F%3Fwant%3Dtrue&width=1280',
            dest: './aithing.png'
        }

        await download.image(options)
            .then(({ filename }) => {
                console.log('Saved to', filename)  // saved to /path/to/dest/image.jpg
            })
            .catch((err) => console.error(err))

        const file = new MessageAttachment('./aithing.png');

        //create MessageEmbed
        const msg = new MessageEmbed()
            .setColor('#5454c5')
            .setTitle('เลขเด็ด')
            .setDescription('คำนวณเลขเด็ดจากข่าว โดยใช้ AI')
            //.setImage('https://api.apiflash.com/v1/urltoimage?access_key=fda71090a5d94be7b45fe09cb2db840c&delay=10&fresh=true&height=720&url=https%3A%2F%2Flottsanook-chitai-production.up.railway.app%2F%3Fwant%3Dtrue&width=1280')
            .setImage('attachment://aithing.png')
            .setTimestamp()
            .setFooter({ text: 'ข้อมูลจาก https://lottsanook-chitai-production.up.railway.app/ai \nบอทจัดทำโดย Phongsakorn Wisetthon \nซื้อกาแฟให้ผม ko-fi.com/boyphongsakorn' });

        //edit message
        //await interaction.editReply({ embeds: [msg] })
        await interaction.editReply({ files: [file], embeds: [msg] })
    }

    if (interaction.commandName === 'lotsheet') {
        //deferReply
        await interaction.deferReply({ ephemeral: true });

        /*let datearray = []

        //loop from 2012 to this year
        for (let i = 2012; i <= new Date().getFullYear(); i++) {
            var options = {
                'method': 'GET',
                'url': 'https://thai-lottery1.p.rapidapi.com/gdpy?year='+(i+543),
                'json': true,
                'headers': {
                    'x-rapidapi-host': 'thai-lottery1.p.rapidapi.com',
                    'x-rapidapi-key': 'c34ed3c573mshbdf38eb6814e7a7p1e0eedjsnab10f5aef137'
                }
            };
            
            await request(options, function (error, response) {
                if (error) throw new Error(error);
                console.log(response.body);
                //loop body for push to array
                for (let i = 0; i < response.body.length; i++) {
                    let datetofulldate = ""
                    //thai month array
                    //let thaimonth = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"]
                    //convert date to full date
                    datetofulldate = response.body[i].substring(0, 2) + " " + convertmonthtotext(response.body[i].substring(2, 4)) + " " + response.body[i].substring(4, 8)
                    datearray.push({
                        label: datetofulldate,
                        description: response.body[i],
                        value: response.body[i]
                    })
                }
            });
        }*/

        //request from https://raw.githubusercontent.com/boyphongsakorn/testrepo/main/godcombothtext to json
        let datearray = []
        await request('https://raw.githubusercontent.com/boyphongsakorn/testrepo/main/godcombothtext', async function (error, response, body) {
            if (error) throw new Error(error);
            //console.log(body);
            //loop body for push to array
            //start body array from index 528
            /*for (let i = 528; i < body.length; i++) {
                let datetofulldate = ""
                //thai month array
                //let thaimonth = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"]
                //convert date to full date
                //datetofulldate = body[i][0].substring(0, 2) + " " + convertmonthtotext(body[i].substring(2, 4)) + " " + body[i][0].substring(4, 8)
                datearray.push({
                    label: body[i][1],
                    description: body[i][0],
                    value: body[i][0]
                })
            }*/
            //use for .. of
            //start body array from index 528
            //convert from text json to json
            let json = JSON.parse(body)
            //slice array only last 25 array
            json = json.slice(json.length - 25, json.length)
            for (let i of json) {
                datearray.push({
                    label: String(i[1]),
                    description: String(i[0]),
                    value: String(i[0])
                })
            }

            console.log(datearray)

            const row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('lottsheet')
                        .setPlaceholder('เลือกวันที่ต้องการ (25 งวดล่าสุด)')
                        .addOptions(datearray)
                )

            await interaction.editReply({ content: 'ใบตรวจสลาก!', components: [row] })
        });

        //console.log(datearray)

        /*const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                .setCustomId('lottsheet')
                .setPlaceholder('เลือกวันที่ต้องการ')
                .addOptions(datearray)
            )

        await interaction.editReply({ content: 'ใบตรวจสลาก!', components: [row] })*/
    }

    if (interaction.customId === 'lottsheet') {
        console.log(interaction)

        //deferReply
        await interaction.deferReply();

        if (fs.existsSync('./lotsheet_' + interaction.values[0] + '.pdf') == false && fs.existsSync('./lotsheet_' + interaction.values[0] + '.png') == false) {
            //use node-fetch to download pdf from https://api.glo.or.th/utility/file/download/d416c36a-dffe-4b06-96ba-6fc970f3269c
            //let url = 'https://api.glo.or.th/utility/file/download/d416c36a-dffe-4b06-96ba-6fc970f3269c'
            //const https = require('https');
            //let url = 'https://api.glo.or.th/utility/file/download/d416c36a-dffe-4b06-96ba-6fc970f3269c'
            /*let file = fs.createWriteStream('./lotsheet_' + interaction.values[0] + '.pdf')
            let request = await https.get(url, function (response) {
                response.pipe(file)
            })
            console.log('downloading')*/
            //const testwow = await fetch(url);
            //const testdata = await testwow.body.pipe(fs.createWriteStream('./lotsheet_' + interaction.values[0] + '.pdf'));
            var testdownload = async function (uri, filename, callback) {
                request.head(uri, function (err, res, body) {
                    console.log('content-type:', res.headers['content-type']);
                    console.log('content-length:', res.headers['content-length']);

                    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                });
            };

            let pdfurl

            var options = {
                'method': 'POST',
                'url': 'https://www.glo.or.th/api/checking/getLotteryResult',
                'headers': {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                'json': true,
                form: {
                    'date': interaction.values[0].substring(0, 2),
                    'month': interaction.values[0].substring(2, 4),
                    'year': parseInt(interaction.values[0].substring(4, 8)) - 543
                }
            };

            await request(options, async function (error, response) {
                if (error) throw new Error(error);
                console.log(response.body);
                pdfurl = response.body.response.result.pdf_url
                console.log(pdfurl)

                await testdownload(pdfurl, './lotsheet_' + interaction.values[0] + '.pdf', async function () {
                    console.log('done');

                    //const { Poppler } = require('pdf-images');
                    //const result = Poppler.convert('./lotsheet_' + interaction.values[0] + '.pdf', './', './lotsheet_' + interaction.values[0]);

                    const { ImageMagick } = require('pdf-images');
                    const result = ImageMagick.convert('./lotsheet_' + interaction.values[0] + '.pdf', '/app/docs', './lotsheet_' + interaction.values[0]);
                    console.log(result)

                    //add white background to image
                    /*await Jimp.read('./docs/lotsheet_' + interaction.values[0]+'/lotsheet_'+interaction.values[0]+'.png')
                    .then(lenna => {
                        console.log('ok');
                        return lenna
                            .background(0xFFFFFFFF)
                            .write('./docs/lotsheet_' + interaction.values[0]+'/lotsheet_'+interaction.values[0]+'.png'); // save
                    })
                    .catch(err => {
                        console.error(err);
                    });*/

                    //add white background to image
                    /*gm('./docs/lotsheet_' + interaction.values[0]+'/lotsheet_'+interaction.values[0]+'.png')
                        .background("#FFFFFF")
                        .write('./docs/lotsheet_' + interaction.values[0]+'/lotsheet_'+interaction.values[0]+'_edit.png', function (err) {
                            if (!err) console.log('done');
                        });*/

                    let buffer = fs.readFileSync("./docs/lotsheet_" + interaction.values[0] + "/lotsheet_" + interaction.values[0] + ".png");
                    pngToJpeg({ quality: 90 })(buffer)
                        .then(output => fs.writeFileSync("./lotsheet_" + interaction.values[0] + "_edit.jpeg", output));

                    //wait 10 seconds
                    await new Promise(resolve => setTimeout(resolve, 10000));

                    const file = new MessageAttachment('./lotsheet_' + interaction.values[0] + '_edit.jpeg');

                    //create MessageEmbed
                    const msg = new MessageEmbed()
                        .setColor('#5454c5')
                        .setTitle('ใบตรวจสลาก')
                        .setDescription('ของวันที่ ' + parseInt(interaction.values[0].substring(0, 2)) + ' ' + convertmonthtotext(interaction.values[0].substring(2, 4)) + ' ' + parseInt(interaction.values[0].substring(4, 8)))
                        //.setImage('https://thai-lottery1.p.rapidapi.com/gdpy?year='+interaction.values[0])
                        .setImage('attachment://lotsheet_' + interaction.values[0] + '_edit.jpeg')
                        .setTimestamp()
                        .setFooter({ text: 'ข้อมูลจาก glo.or.th \nบอทจัดทำโดย Phongsakorn Wisetthon \nซื้อกาแฟให้ผม ko-fi.com/boyphongsakorn' });

                    //edit message
                    await interaction.editReply({ embeds: [msg], files: [file] })
                    console.log('ok')
                });
            });
            /*const file = fs.createWriteStream("lotsheet_" + interaction.values[0] + ".pdf");
            const testwow = await http.get("https://api.glo.or.th/utility/file/download/d416c36a-dffe-4b06-96ba-6fc970f3269c", function(response) {
                response.pipe(file);
            });
            testwow.on('error', function(err) {
                console.log(err);
            });*/
            /*var PDFImage = require("pdf-image").PDFImage;
            var pdfImage = new PDFImage("./lotsheet_" + interaction.values[0] + ".pdf",{
                combinedImage: true
              });
            pdfImage.convertFile().then(function (imagePath) {
                // 0-th page (first page) of the slide.pdf is available as slide-0.png
                fs.existsSync("./lotsheet_" + interaction.values[0] + ".png") // => true
            });*/
        } else {
            const file = new MessageAttachment('./docs/lotsheet_' + interaction.values[0] + '.png');

            //create MessageEmbed
            const msg = new MessageEmbed()
                .setColor('#5454c5')
                .setTitle('ใบตรวจสลาก')
                .setDescription('ของวันที่ ' + parseInt(interaction.values[0].substring(0, 2)) + ' ' + convertmonthtotext(interaction.values[0].substring(2, 4)) + ' ' + parseInt(interaction.values[0].substring(4, 8)))
                //.setImage('https://thai-lottery1.p.rapidapi.com/gdpy?year='+interaction.values[0])
                .setImage('attachment://lotsheet_' + interaction.values[0] + '.png')
                .setTimestamp()
                .setFooter({ text: 'ข้อมูลจาก ทดสอบ \nบอทจัดทำโดย Phongsakorn Wisetthon \nซื้อกาแฟให้ผม ko-fi.com/boyphongsakorn' });

            //edit message
            await interaction.editReply({ embeds: [msg], files: [file] })
        }
    }

    if (interaction.commandName === 'synumber') {
        await interaction.deferReply({ ephemeral: true });
        let numbertosave = interaction.options.getString('number');
        //discord user id
        let userid = interaction.user.id;
        //date now
        let date = new Date();
        //convert date to YYYY-MM-DD h:m:s
        let dateformat = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        //time now
        //let time = date.getTime();
        //convert time to hms
        let timeformat = padLeadingZeros(date.getHours(), 2) + '' + padLeadingZeros(date.getMinutes(), 2) + '' + padLeadingZeros(date.getSeconds(), 2);
        //get last 4 userid
        let last4userid = userid.substring(userid.length - 4);
        //create lott id = date/time/last4userid
        let lottid = padLeadingZeros(date.getDate(), 2) + '' + padLeadingZeros(date.getMonth() + 1, 2) + '' + date.getFullYear() + '/' + timeformat + '/' + last4userid;
        var sql = "INSERT INTO lott_table VALUES ('" + lottid + "', '" + userid + "', 'notyet', '" + numbertosave + "', 'waiting', '" + dateformat + "', '0000-00-00')";
        con.query(sql, async function (err, result) {
            if (err) {
                await interaction.editReply('ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
                console.log(err);
            } else {
                console.log("1 record inserted");
                await interaction.editReply('บันทึกข้อมูลเรียบร้อยแล้ว (เลข ' + numbertosave + ')');
            }
        });
    }

    if (interaction.commandName === 'checkconnection') {
        await interaction.deferReply();
        let lotapistatus, lotimgstatus, gloapistatus, sqlstatus, sqlinserttest, sqldeletetest, sqlselecttest;
        con.ping(function (err) {
            if (err) {
                console.log(err);
                sqlstatus = 0;
            } else {
                console.log('Database is connected!');
                sqlstatus = 1;
            }
        })
        let today = new Date();
        // convert today to yyyy-mm-dd
        let dd = today.getDate();
        let mm = today.getMonth() + 1; //January is 0!
        let yyyy = today.getFullYear();
        dd = padLeadingZeros(dd, 2);
        mm = padLeadingZeros(mm, 2);
        todayformat = yyyy + '-' + mm + '-' + dd;
        let waitwhat;
        let lastlottdate;
        //node fetch http://192.168.31.210:5000/reto
        await fetch('http://192.168.31.210:5000/reto')
            .then(res => res.text())
            .then(body => {
                if(body == 'yes'){
                    //add 1 day to todayformat
                    dd = parseInt(dd) + 1;
                    dd = padLeadingZeros(dd, 2);
                    todayformat = yyyy + '-' + mm + '-' + dd;
                    console.log(todayformat);
                }
            })
            .catch(err => {
                console.log(err);
            });
        //select to sql
        con.query("SELECT * FROM lott_round ORDER BY round DESC LIMIT 1", async function (err, result, fields) {
            if (err) {
                sqlselecttest = 0;
            } else {
                //if result[0].round == todayformat
                if (result[0].round == todayformat) {
                    waitwhat = 1;
                } else {
                    waitwhat = 0;
                }
                lastlottdate = result[0].round;
                sqlselecttest = 1;
                if (waitwhat == 1) {
                    dd = parseInt(dd) + 1;
                    dd = padLeadingZeros(dd, 2);
                    todayformat = yyyy + '-' + mm + '-' + dd;
                }
                /*if(result.length != 0){
                    sqlselecttest = 1;
                    lastlottdate = result[0].round;
                    waitwhat = 0;
                    console.log(result);
                }else{
                    waitwhat = 1;
                }*/
            }
        });
        //if waitwhat = 1 then plus 1 day to dd
        /*if(waitwhat == 1){
            dd = parseInt(dd) + 1;
            dd = padLeadingZeros(dd, 2);
            todayformat = yyyy + '-' + mm + '-' + dd;
        }*/
        //insert to sql
        con.query("INSERT INTO lott_round (id, round) VALUES ('" + dd + "" + mm + "" + (yyyy + 543) + "', '" + todayformat + "')", async function (err, result, fields) {
            if (err) {
                console.log(err);
                sqlinserttest = 0;
            } else {
                sqlinserttest = 1;
                console.log('Insert complete');
            }
            //console.log(result);
        });
        //delete old data
        con.query("DELETE FROM lott_round WHERE id = '" + dd + "" + mm + "" + (yyyy + 543) + "'", async function (err, result, fields) {
            if (err) {
                console.log(err);
                sqldeletetest = 0;
            } else {
                sqldeletetest = 1;
                console.log('Delete complete');
            }
        });
        var myHeaders = {
            'content-type': 'application/json'
        };
        var smackdown = JSON.stringify({
            'date': '01',
            'month': '11',
            'year': '2021'
        })
        var reop = {
            method: 'POST',
            headers: myHeaders,
            body: smackdown,
            redirect: 'follow'
        }
        await fetch('https://anywhere.pwisetthon.com/https://www.glo.or.th/api/lottery/getLotteryAward', reop)
            .then(response => response.json())
            .then(result => {
                if (result['status']) {
                    gloapistatus = 1;
                } else {
                    gloapistatus = 0;
                }
            })
            .catch(error => {
                console.log('error', error)
                gloapistatus = 0;
            });
        await fetch('https://anywhere.pwisetthon.com/https://status.teamquadb.in.th/api/services/9', { method: 'GET', headers: { 'Content-Type': 'application/json' } })
            .then(response => response.json())
            .then(result => {
                if (result['online']) {
                    lotapistatus = 1;
                } else {
                    lotapistatus = 0;
                }
            })
            .catch(error => {
                console.log('error', error)
                lotapistatus = 0;
            });
        await fetch('https://anywhere.pwisetthon.com/https://status.teamquadb.in.th/api/services/12', { method: 'GET', headers: { 'Content-Type': 'application/json' } })
            .then(response => response.json())
            .then(result => {
                if (result['online']) {
                    lotimgstatus = 1;
                } else {
                    lotimgstatus = 0;
                }
            })
            .catch(error => {
                console.log('error', error)
                lotimgstatus = 0;
            });

        //if lotapistatus true then create text of status = '✅ เชื่อมต่อได้' else create text of status = '❌ เชื่อมต่อไม่ได้'
        let lotapistatustext = lotapistatus ? '✅ เชื่อมต่อได้' : '❌ เชื่อมต่อไม่ได้';
        //if lotimgstatus true then create text of status = '✅ เชื่อมต่อได้' else create text of status = '❌ เชื่อมต่อไม่ได้'
        let lotimgstatustext = lotimgstatus ? '✅ เชื่อมต่อได้' : '❌ เชื่อมต่อไม่ได้';
        //if gloapistatus true then create text of status = '✅ เชื่อมต่อได้' else create text of status = '❌ เชื่อมต่อไม่ได้'
        let gloapistatustext = gloapistatus ? '✅ เชื่อมต่อได้' : '❌ เชื่อมต่อไม่ได้';
        //if sqlstatus true then create text of status = '✅ เชื่อมต่อได้' else create text of status = '❌ เชื่อมต่อไม่ได้'
        let sqlstatustext = sqlstatus ? '✅ เชื่อมต่อได้' : '❌ เชื่อมต่อไม่ได้';
        //if sqlinserttest true then create text of status = '✅ เพิ่มข้อมูลสำเร็จ' else create text of status = '❌ เพิ่มข้อมูลไม่สำเร็จ'
        let sqlinserttesttext = sqlinserttest ? '✅ เพิ่มข้อมูลสำเร็จ' : '❌ เพิ่มข้อมูลไม่สำเร็จ';
        //if sqldeletetest true then create text of status = '✅ ลบข้อมูลสำเร็จ' else create text of status = '❌ ลบข้อมูลไม่สำเร็จ'
        let sqldeletetesttext = sqldeletetest ? '✅ ลบข้อมูลสำเร็จ' : '❌ ลบข้อมูลไม่สำเร็จ';
        //if sqlselecttest true then create text of status = '✅ ดึงข้อมูลสำเร็จ' else create text of status = '❌ ดึงข้อมูลไม่สำเร็จ'
        let sqlselecttesttext = sqlselecttest ? '✅ ดึงข้อมูลสำเร็จ' : '❌ ดึงข้อมูลไม่สำเร็จ';
        //plus 543 year to lastlottdate
        let lastlottdateplus543 = moment(lastlottdate).add(543, 'years').format('YYYY-MM-DD');
        //convert lastlottdateplus543 to dd/mm/yyyy
        let lastlottdateplus543toformat = moment(lastlottdateplus543).format('DD/MM/YYYY');
        let sqlselecttesttextplus543
        if (sqlselecttest != 0) {
            //add lastlottdateplus543toformat after text of sqlselecttesttext
            sqlselecttesttextplus543 = sqlselecttesttext + ' ( ' + lastlottdateplus543toformat + ' )';
        }

        //create message embed
        let msg = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('สถานะการเชื่อมต่อ')
            .setURL('https://status.teamquadb.in.th')
            .setDescription('เช็คสถานะการเชื่อมต่อของบอท ระหว่าง ลอตเตอรรี่ API,รูปภาพลอตเตอรรี่ API, ฐานข้อมูล และ เว็บไซต์ glo.or.th')
            .setThumbnail('https://dbstatus.pwisetthon.com/botimage')
            .addFields(
                { name: 'ฐานข้อมูล', value: sqlstatustext },
                { name: 'ทดสอบเพิ่มข้อมูล', value: sqlinserttesttext, inline: true },
                { name: 'ทดสอบลบข้อมูล', value: sqldeletetesttext, inline: true },
                { name: 'ทดสอบดึงข้อมูล', value: sqlselecttesttextplus543, inline: true },
                { name: 'ลอตเตอรรี่ API', value: lotapistatustext, inline: true },
                { name: 'รูปภาพลอตเตอรรี่ API', value: lotimgstatustext, inline: true },
                { name: 'เว็บไซต์ glo.or.th', value: gloapistatustext },
            )
            //.setImage('https://lotimg.pwisetthon.com/?date=' + body.info.date)
            //.setImage('attachment://lottery_' + body.info.date + '.png')
            .setTimestamp()
            .setFooter({ text: 'ข้อมูลจาก status.teamquadb.in.th \nบอทจัดทำโดย Phongsakorn Wisetthon \nซื้อกาแฟให้ผม ko-fi.com/boyphongsakorn' });

        await interaction.editReply({ embeds: [msg] });
        //after 30s delete message
        setTimeout(() => {
            interaction.deleteReply();
        }, 30000);
    }

    if (interaction.commandName == 'syhistory') {
        await interaction.deferReply({ ephemeral: true });
        //get user id
        let userid = interaction.user.id;
        //select * from lott_table where discord_id = userid
        con.query(`SELECT * FROM lott_table WHERE discord_id = '${userid}'`, async (err, result) => {
            //2d {} array
            let history = {};
            //for each result
            /*for(let i = 0; i < result.length; i++){
                console.log(result[i]);
                //push { name: result[i].datetime, value: result[i].numberbuy } to history
                history.push({ name: result[i].datetime, value: result[i].numberbuy,inline: true });
            }
            //let wowwowwow = [];
            console.log(history);*/
            //console.log(history[0]);
            //push history to wowwowwow
            //wowwowwow.push(history);

            let msg = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('ประวัติการบันทึกเลข')
                .setURL('https://lotto.teamquadb.in.th')
                .setDescription('ประวัติการบันทึกเลขของคุณในดิสคอร์ดบอทนี้')
                .setThumbnail('https://dbstatus.pwisetthon.com/botimage')
                //.addFields(history)
                //.setImage('https://lotimg.pwisetthon.com/?date=' + body.info.date)
                //.setImage('attachment://lottery_' + body.info.date + '.png')
                .setTimestamp()
                .setFooter({ text: 'ข้อมูลจาก Database \nบอทจัดทำโดย Phongsakorn Wisetthon \nซื้อกาแฟให้ผม ko-fi.com/boyphongsakorn' });

            console.log(result);

            for (let i = 0; i < result.length; i++) {
                console.log(result[i]);
                console.log(result[i].numberbuy);
                //convert from datetime sql to datetime js
                let datejs = new Date(result[i].datetime);
                //convert from datetime js to datetime string with 24 hour format and dd/mm/yyyy format without time
                let datestring = datejs.toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok', hour12: false, year: 'numeric', month: '2-digit', day: '2-digit' });
                let ssus
                if (result[i].status == 'waiting') {
                    ssus = 'รอสลากฯออก'
                } else {
                    ssus = result[i].status
                }
                msg.addField(result[i].numberbuy + " (" + ssus + ")", datestring, true);
            }

            await interaction.editReply({ embeds: [msg] });
        });
    }

    if (interaction.commandName == 'flottomode') {
        await interaction.deferReply();

        let modearray = [{
            label: 'โหมดปกติ',
            description: 'รูปสรุปสลากกินแบ่งฯ',
            value: 'normal'
        }, {
            label: 'โหมดสลากฯบวกราคาทอง',
            description: 'รูปสรุปสลากกินแบ่งฯบวกกับราคาทอง',
            value: 'gold'
        }]

        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('lottomode')
                    .setPlaceholder('เลือกโหมดการสรุปสลากฯที่ต้องการ')
                    .addOptions(modearray)
            )

        await interaction.editReply({ content: 'เปลี่ยนโหมดการแสดงสรุปสลากกินแบ่งฯ!', components: [row] })
    }

    if (interaction.customId === 'lottomode') {
        await interaction.deferReply();

        console.log(interaction.guildId)

        //select lott_guildid from lott_main where lott_guildid = interaction.guildId if not exist insert lott_guildid = interaction.guildId but if exist update lott_guildid = interaction.guildId
        con.query(`SELECT * FROM lott_main WHERE lott_guildid = '${interaction.guildId}'`, async (err, result) => {
            if (result.length == 0) {
                con.query(`INSERT INTO lott_main (lott_guildid, lott_resultmode) VALUES ('${interaction.guildId}', '${interaction.values[0]}')`, async (err, result) => {
                    console.log(result);
                    await interaction.editReply('บันทึกการเปลี่ยนโหมดการแสดงสรุปสลากกินแบ่งฯเรียบร้อยแล้ว');
                });
            } else {
                con.query(`UPDATE lott_main SET lott_resultmode = '${interaction.values[0]}' WHERE lott_guildid = '${interaction.guildId}'`, async (err, result) => {
                    console.log(result);
                    await interaction.editReply('อัพเดทการเปลี่ยนโหมดการแสดงสรุปสลากกินแบ่งฯเรียบร้อยแล้ว');
                });
            }
        });
    }
});

/*const reply = (interaction, response) => {
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
}*/

client.login(process.env.BOT_TOKEN);