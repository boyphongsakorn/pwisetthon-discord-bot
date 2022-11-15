const { MessageAttachment, MessageEmbed, Client, Intents, MessageActionRow, MessageSelectMenu, MessageButton, ClientUser } = require('discord.js');
const cron = require("cron");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
var fs = require('fs');
var http = require('http');
const pngToJpeg = require('png-to-jpeg');
var mysql = require('mysql');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

//create mysql connection
var con = mysql.createConnection({
    host: "192.168.31.210",
    user: "boyphongsakorn",
    password: "team1556th",
    database: "discordbot"
});

let lottoapi = "http://192.168.31.210:5000";
let lotimgapi = "http://192.168.31.220:14000";

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

        await fetch(client.user.avatarURL({ format: 'jpg', dynamic: true, size: 512 }))
            .then(res => res.arrayBuffer())
            .then(buffer => {
                const base64 = Buffer.from(buffer);
                res.writeHead(200, { 'Content-Type': 'image/jpg' });
                res.write(base64);
                res.end();
            });

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

        /*commands?.create({
            name: 'fthlotto',
            description: "แจ้งเตือนสลากกินแบ่งรัฐบาลเวลาสี่โมงเย็นของวันทึ่ออก"
        }, guildid)*/

        commands?.create({
            name: 'flottomode',
            description: "ปรับโหมดการแจ้งเตือนสลากกินแบ่งฯ"
        }, guildid)

        /*commands?.create({
            name: 'cthlotto',
            description: "ยกเลิกแจ้งเตือนสลากกินแบ่งรัฐบาลของแชนแนลนี้"
        }, guildid)*/

        commands?.create({
            name: 'subthlotto',
            description: "ติดตาม/ยกเลิกการแจ้งเตือนสลากกินแบ่งฯ"
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
                description: 'ตัวเลขที่คุณซื้อหรือเลขที่คุณต้องการแจ้งเตือน (1 เลขต่อครั้ง)',
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

        commands?.create({
            name: 'lastthaioilprice',
            description: 'ดูราคาน้ำมันล่าสุด'
        }, guildid)

        /*commands?.create({
            name: 'fthaioilprice',
            description: 'ติดตาม/แจ้งเตือนราคาน้ำมัน'
        }, guildid)

        commands?.create({
            name: 'cthaioilprice',
            description: 'ยกเลิกการแจ้งเตือนราคาน้ำมัน'
        }, guildid)*/

        commands?.create({
            name: 'subthaioilprice',
            description: 'ติดตาม/ยกเลิกการแจ้งเตือนราคาน้ำมัน'
        }, guildid)

        commands?.create({
            name: 'checkblacklist',
            description: 'ตรวจสอบรายชื่อคนโกง',
            options: [{
                type: 3,
                name: 'search',
                description: 'เลขประจำตัว/บัญชี/เบอร์/ชื่อคนโกง',
                required: true
            }]
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

    await guildCommandCreate(guildid);

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

            try {
                guild.commands.fetch().then(async function (commands) {
                    //if guild has no commands
                    if (commands.size != 13) {
                        //create commands
                        await guildCommandCreate(guild.id);
                    } else {

                    }
                });
            } catch (error) {
                console.log('error: ' + error);
            }
        });
        client.user.setPresence({ activities: [{ name: 'discordbot.pwisetthon.com' }], status: 'online' });
        client.users.fetch('133439202556641280').then(dm => {
            dm.send('Bot เริ่มต้นการทำงานแล้ว')
        });
        //send ok to channel 908708400379097184 and get message id
        client.channels.cache.get('908708400379097184').send('Bot เริ่มต้นการทำงานแล้ว')
            .then(async function (message) {
                //log message id
                console.log(message.id);
                //wait 5 sec
                await new Promise(resolve => setTimeout(resolve, 5000));
                //delete message
                client.channels.cache.get('908708400379097184').messages.cache.get(message.id).delete();
            });
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

        fetch(process.env.URL + '/discordbot/addchannels.php?chid=' + guild.systemChannelId)
            .then(res => res.text())
            .then(body => {
                console.log(body);
                if (body == 'debug') {
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

})

let scheduledMessage = new cron.CronJob('* 15-17 * * *', () => {

    // datedata

    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear() + 543;

    date = padLeadingZeros(date, 2);
    month = padLeadingZeros(month, 2);
    year = padLeadingZeros(year, 4);

    let url = lottoapi+"/?date=" + date + "" + month + "" + year + "&fresh";
    let settings = { "method": "GET" };

    fetch(url, settings)
        .then(res => res.json())
        .then(async (json) => {
            console.log(json.length)
            if (json.length == 7 || json.length == 8 || json.length == 9) {
                if (json[0][1] == "0" || json[0][1] == 0 || json[0][1] == "xxxxxx" || json[0][1] == "XXXXXX" || isNaN(json[0][1])) {

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

                } else {

                    //check every index of json has not "xxxxxx" or "XXXXXX"
                    for (let i = 0; i < json.length; i++) {
                        for (let j = 1; j < json[i].length; j++) {
                            if (json[i][j] == "xxxxxx" || json[i][j] == "XXXXXX") {
                                console.log('Bot ทำงานปกติและเช็คได้ว่าวันนี้หวยยังออกไม่หมด');
                                return;
                            }
                        }
                    }

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
                        });
                    }

                    var lasttime = null

                    try {
                        const stats = fs.statSync('lastout.txt');
                        //const expiry = new Date().getTime()

                        lasttime = stats.mtime

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

                            if (fs.existsSync('./lottery_' + date + '' + month + '' + year + '.png') == false) {

                                await fetch('https://screenshot-xi.vercel.app/?date=' + date + '' + month + '' + year)
                                    .then(res => res.buffer())
                                    .then(async (res) => {
                                        await fs.writeFileSync('./lottery_' + date + '' + month + '' + year + '.png', res)
                                    })
                                    .catch(async (err) => {
                                        console.log('Error:', err.message)
                                    });

                                await fetch('https://lotimg.pwisetthon.com/?date=' + date + '' + month + '' + year + '&mode=gold')
                                    .then(res => res.buffer())
                                    .then(async (res) => {
                                        await fs.writeFileSync('./lottery_' + date + '' + month + '' + year + '_gold.png', res)
                                    })
                                    .catch(async (err) => {
                                        console.log('Error:', err.message)
                                    });
                            }

                            //check number user save
                            con.query("SELECT * FROM lott_table WHERE status = 'waiting'", function (err, result, fields) {
                                if (err) throw err;
                                console.log(result);
                                //loop result
                                for (let i = 0; i < result.length; i++) {
                                    let whatid = result[i].lott_id
                                    let discordid = result[i].discord_id
                                    let numberhebuy = result[i].numberbuy
                                    console.log(result[i].lott_id)
                                    console.log(result[i].numberbuy)
                                    let optitot = { "method": "GET", "headers": { "x-rapidapi-host": "thai-lottery1.p.rapidapi.com", "x-rapidapi-key": "c34ed3c573mshbdf38eb6814e7a7p1e0eedjsnab10f5aef137" } };
                                    fetch("https://thai-lottery1.p.rapidapi.com/checklottery?by=" + date + "" + month + "" + year + "&search=" + result[i].numberbuy, optitot)
                                        .then(res => res.text())
                                        .then((json) => {
                                            //if json is null or empty send message to result[i].discord_id
                                            if (json == '' || json == null) {
                                                var sql = "UPDATE lott_table SET status = 'ไม่ถูก',lotround = '" + (year - 543) + "-" + month + "-" + date + "' WHERE lott_id = '" + whatid + "'";
                                                con.query(sql, function (err, result) {
                                                    if (err) throw err;
                                                    client.users.fetch(discordid).then(dm => {
                                                        dm.send('ขออภัยค่ะ! เลข ' + numberhebuy + ' ยังไม่ถูกรางวัลนี้ค่ะ')
                                                    })
                                                });
                                            } else {
                                                var sql = "UPDATE lott_table SET status = 'win',lotround = '" + (year - 543) + "-" + month + "-" + date + "' WHERE lott_id = '" + whatid + "'";
                                                con.query(sql, function (err, result) {
                                                    if (err) throw err;
                                                    client.users.fetch(discordid).then(dm => {
                                                        dm.send('ยินดีด้วย! เลข ' + numberhebuy + ' ถูกรางวัลนี้ค่ะ')
                                                    })
                                                });
                                            }
                                        });
                                }
                            });

                            const file = new MessageAttachment('./lottery_' + date + '' + month + '' + year + '.png');
                            const filegold = new MessageAttachment('./lottery_' + date + '' + month + '' + year + '_gold.png');

                            const msg = new MessageEmbed()
                                .setColor('#0099ff')
                                .setTitle('ผลสลากกินแบ่งรัฐบาล')
                                .setURL('https://www.glo.or.th/')
                                .setDescription('งวดวันที่ ' + new Date().getDate() + ' ' + convertmonthtotext(month) + ' ' + year)
                                .setThumbnail('https://raw.githubusercontent.com/boyphongsakorn/pwisetthon-discord-bot/master/docs/glologo.png')
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
                                .setFooter('ข้อมูลจาก rapidapi.com/boyphongsakorn/api/thai-lottery1 \nบอทจัดทำโดย Phongsakorn Wisetthon \nให้ค่ากาแฟ buymeacoffee.com/boyphongsakorn');

                            const msggold = new MessageEmbed()
                                .setColor('#0099ff')
                                .setTitle('ผลสลากกินแบ่งรัฐบาล')
                                .setURL('https://www.glo.or.th/')
                                .setDescription('งวดวันที่ ' + new Date().getDate() + ' ' + convertmonthtotext(month) + ' ' + year)
                                .setThumbnail('https://raw.githubusercontent.com/boyphongsakorn/pwisetthon-discord-bot/master/docs/glologo.png')
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
                                .setFooter('ข้อมูลจาก rapidapi.com/boyphongsakorn/api/thai-lottery1 \nบอทจัดทำโดย Phongsakorn Wisetthon \nให้ค่ากาแฟ buymeacoffee.com/boyphongsakorn');

                            const response = await fetch(process.env.URL + '/discordbot/chlist.txt', { method: 'GET' });
                            const data = await response.json();
                            const wow = data;
                            //loop [1,2,3] array
                            for (let i = 0; i < data.length; i++) {
                                let unknows = 0;
                                try {
                                    console.log(client.channels.fetch(wow[i]).then(channel => {
                                        console.log(channel.guildId)
                                        unknows = channel.guildId;
                                    }).catch(console.error));
                                } catch (error) {
                                    unknows = 0;
                                }
                                //wait 3 sec
                                await new Promise(r => setTimeout(r, 3000));

                                if (unknows != 0) {
                                    con.query("SELECT * FROM lott_main WHERE lott_guildid = '" + unknows + "'", function (err, result, fields) {
                                        //if (err) throw err;
                                        if (result.length == 0 || result[0].lott_resultmode == 'normal' || err) {
                                            if (err) {
                                                console.log(err);
                                            }

                                            try {
                                                client.channels.cache.get(wow[i]).send({ embeds: [msg], files: [file] })
                                                    .then((log) => {
                                                        console.log(log);
                                                    })
                                                    .catch((error) => {

                                                    });
                                            } catch (error) {
                                                console.log('don\'t send')
                                            }
                                        } else {
                                            try {
                                                client.channels.cache.get(wow[i]).send({ embeds: [msggold], files: [filegold] })
                                                    .then((log) => {
                                                        console.log(log);
                                                    })
                                                    .catch((error) => {

                                                    });
                                            } catch (error) {
                                                console.log('don\'t send')

                                            }
                                        }
                                    })
                                } else {
                                    try {
                                        client.channels.cache.get(wow[i]).send({ embeds: [msg], files: [file] })
                                            .then((log) => {
                                                console.log(log);
                                            })
                                            .catch((error) => {
                                                console.log(error);

                                            });
                                    } catch (error) {
                                        console.log('don\'t send')

                                    }
                                }
                            }

                            //insert to sql
                            con.query("INSERT INTO lott_round (id, round) VALUES ('" + date + "" + month + "" + year + "', '" + todayformat + "')", function (err, result, fields) {
                                if (err) throw err;
                                //console.log(result);
                                console.log('Insert complete');
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

//thaioilprice cron

let scheduledthaioil = new cron.CronJob('1-59/3 * * * *', () => {
    let nows = new Date();
    // if nows = 3 feb client.user.setAvatar
    if (nows.getDate() >= 1 && nows.getDate() <= 3 && nows.getMonth() == 1) {
        client.user.setAvatar('https://img.gs/fhcphvsghs/512/https://raw.githubusercontent.com/boyphongsakorn/pwisetthon-discord-bot/master/img/botav_hbd.jpg')
    } else if(nows.getDate() >= 14 && nows.getDate() <= 16 && nows.getMonth() == 1){
        client.user.setAvatar('https://img.gs/fhcphvsghs/512/https://raw.githubusercontent.com/boyphongsakorn/pwisetthon-discord-bot/master/img/botav_makha.jpg')
    } else if(nows.getDate() >= 11 && nows.getDate() <= 15 && nows.getMonth() == 3){
        client.user.setAvatar('https://img.gs/fhcphvsghs/512/https://raw.githubusercontent.com/boyphongsakorn/pwisetthon-discord-bot/master/img/botav_songkran.jpg')
    } else if(nows.getDate() >= 21 && nows.getDate() <= 23 && nows.getMonth() == 9){
        client.user.setAvatar('https://img.gs/fhcphvsghs/512/https://raw.githubusercontent.com/boyphongsakorn/pwisetthon-discord-bot/master/img/botav_piya.jpg')
    } else if((nows.getDate() >= 30 && nows.getDate() <= 31 && nows.getMonth() == 9) || (nows.getDate() == 1 && nows.getMonth() == 10)){
        client.user.setAvatar('https://img.gs/fhcphvsghs/512/https://raw.githubusercontent.com/boyphongsakorn/pwisetthon-discord-bot/master/img/botav_hh.jpg')
    } else if(nows.getDate() >= 8 && nows.getDate() <= 10 && nows.getMonth() == 11){
        client.user.setAvatar('https://img.gs/fhcphvsghs/512/https://raw.githubusercontent.com/boyphongsakorn/pwisetthon-discord-bot/master/img/botav_law.jpg')
    } else if((nows.getDate() >= 23 && nows.getDate() <= 31 && nows.getMonth() == 11) || (nows.getDate() == 1 && nows.getMonth() == 0)){
        client.user.setAvatar('https://img.gs/fhcphvsghs/512/https://raw.githubusercontent.com/boyphongsakorn/pwisetthon-discord-bot/master/img/botav_mrahny.jpg')
    } else {
        client.user.setAvatar('https://img.gs/fhcphvsghs/512/https://raw.githubusercontent.com/boyphongsakorn/pwisetthon-discord-bot/master/img/botav.jpg')
    }

    //fetch http://192.168.31.210:1000 || https://topapi.pwisetthon.com
    fetch('https://thaioilpriceapi-vercel.vercel.app')
        .then(res => res.json())
        .then(json => {
            let ngv = json[0][9]

            var sql = 'SELECT * FROM oilprice WHERE date = "' + json[0][0] + '"';
            con.query(sql, function (err, result) {
                if (err) throw err;
                if (result.length == 0) {
                    if (json[0][9] == '-') {
                        ngv = 0
                    }
                    var sql = 'INSERT INTO oilprice VALUES ("' + json[0][0] + '", ' + json[0][1] + ', ' + json[0][2] + ', ' + json[0][3] + ', ' + json[0][4] + ', ' + json[0][5] + ', ' + json[0][6] + ', ' + json[0][7] + ', ' + json[0][8] + ', ' + ngv + ')';
                    con.query(sql, async function (err, result) {
                        if (err) throw err;

                        //set Presence
                        if(parseInt(json[2][8]) > 0){
                            client.user.setPresence({ activities: [{ name: 'เซ็ง 91 ขึ้นอีกละ | discordbot.pwisetthon.com' }], status: 'online' });
                            //after 1 hour set back to default
                            setTimeout(() => {
                                client.user.setPresence({ activities: [{ name: 'discordbot.pwisetthon.com' }], status: 'online' });
                            }, 3600000);
                        }

                        const response = await fetch(process.env.URL + '/discordbot/oilchlist.txt', { method: 'GET' });
                        const data = await response.json();
                        const wow = data;
                        let imagegood = false;

                        await fetch('https://screenshot-xi.vercel.app/api?url=https://boyphongsakorn.github.io/thaioilpriceapi&width=1000&height=1000',{ timeout: 7500 })
                            .then(res => res.buffer())
                            .then(async (res) => {
                                await fs.writeFileSync('./lastoilprice.png', res)
                                //imagegood = true;
                            })
                            .catch(async (err) => {
                                console.log(err);
                                //imagegood = false;
                            });

                        //let files
                        //let imageisgood = false

                        //check if file exist and size > 400kb and size < 500kb
                        if (fs.existsSync('./lastoilprice.png') && fs.statSync('./lastoilprice.png').size > 400000 && fs.statSync('./lastoilprice.png').size < 500000) {
                            //files = new MessageAttachment('./lastoilprice.png');
                            imagegood = true
                        } else {
                            imagegood = false;
                            await fetch('https://topapi.pwisetthon.com/image')
                                .then(res => res.buffer())
                                .then(async (res) => {
                                    await fs.writeFileSync('./lastoilprice.png', res)
                                    //files = new MessageAttachment('./lastoilprice.png');
                                    imagegood = true;
                                })
                        }

                        let todays = new Date();
                        let oilday = new Date(json[0][0].substring(6, 10) + '-' + json[0][0].substring(3, 5) + '-' + json[0][0].substring(0, 2));

                        let desctext

                        //if todays == oilday
                        if (todays.getDate() == oilday.getDate()) {
                            desctext = 'นี้';
                        } else {
                            desctext = 'พรุ่งนี้';
                        }

                        const files = new MessageAttachment('./lastoilprice.png');

                        let msg = new MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle('ราคาน้ำมันพรุ่งนี้')
                            .setURL('https://www.bangchak.co.th/th/oilprice/historical')
                            .setDescription('ราคาน้ำมันมีการเปลี่ยนแปลงสำหรับวัน'+ desctext +' (วันที่ ' + json[0][0].substring(0, 2) + ' ' + convertmonthtotext(json[0][0].substring(3, 5)) + ' ' + json[0][0].substring(6, 10) + ')')
                            .setThumbnail('https://www.bangchak.co.th/glide/assets/images/defaults/opengraph.png?h=350&fit=max&fm=jpg&t=1650602255')
                            .setImage('attachment://lastoilprice.png')
                            .setTimestamp()
                            .setFooter({ text: 'ข้อมูลจาก bangchak.co.th \nบอทจัดทำโดย Phongsakorn Wisetthon \nให้ค่ากาแฟ buymeacoffee.com/boyphongsakorn' });

                        if (imagegood == false) {
                            msg.setImage('https://screenshot-xi.vercel.app/api?url=https://boyphongsakorn.github.io/thaioilpriceapi&width=1000&height=1000')
                        }

                        let messid = [];

                        for (let i = 0; i < wow.length; i++) {
                            try {
                                if (imagegood == true) {
                                    await client.channels.cache.get(wow[i]).send({ embeds: [msg], files: [files] })
                                        .then((log) => {
                                            //console.log(log);
                                            //push message id and channel id to messid
                                            messid.push({
                                                messid: log.id,
                                                chanelid: wow[i]
                                            })
                                        })
                                        .catch((error) => {
                                            //console.log(error);
                                            client.users.fetch('133439202556641280').then(dm => {
                                                dm.send('Bot ไม่สามารถส่งข้อความไปยังแชทแนว ' + wow[i] + ' ได้เนี่องจาก ' + error)
                                            })
                                        });
                                } else {
                                    await client.channels.cache.get(wow[i]).send({ embeds: [msg] })
                                        .then((log) => {
                                            //console.log(log);
                                            //push message id and channel id to messid
                                            messid.push({
                                                messid: log.id,
                                                chanelid: wow[i]
                                            })
                                        })
                                        .catch((error) => {
                                            //console.log(error);
                                            client.users.fetch('133439202556641280').then(dm => {
                                                dm.send('Bot ไม่สามารถส่งข้อความไปยังแชทแนว ' + wow[i] + ' ได้เนี่องจาก ' + error)
                                            })
                                        });
                                }
                            } catch (error) {
                                console.log('he not send')
                            }
                        }

                        //convert messid to json
                        let messidjson = JSON.stringify(messid);
                        //get today date format day/month/thaiyear
                        let today = new Date();
                        let day = today.getDate();
                        let month = today.getMonth() + 1;
                        let thaiyear = today.getFullYear() + 543;
                        let date = day + '/' + month + '/' + thaiyear;
                        //push messidjson to database
                        let sql = `INSERT INTO hell VALUES ('${date}', '${messidjson}')`;
                        con.query(sql, function (err, result) {
                            if (err) throw err;
                            console.log('1 record inserted');
                        });

                        const row = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('hell')
                                    .setLabel('ลบ')
                                    .setStyle('DANGER'),
                                new MessageButton()
                                    .setCustomId('hellandreset')
                                    .setLabel('ลบและรีเซ็ต')
                                    .setStyle('DANGER'),
                            );

                        //send msg to user 133439202556641280
                        if (imagegood == true) {
                            client.users.fetch('133439202556641280').then(dm => {
                                dm.send({ embeds: [msg], files: [files], components: [row] })
                                    .then((log) => {
                                        console.log(log);
                                    })
                                    .catch((error) => {
                                        console.log(error);

                                    });
                            });
                        } else {
                            client.users.fetch('133439202556641280').then(dm => {
                                dm.send({ embeds: [msg], components: [row] })
                                    .then((log) => {
                                        console.log(log);
                                    })
                                    .catch((error) => {
                                        console.log(error);

                                    });
                            });
                        }
                    });
                }
            });
        })
        .catch(err => {
            console.log(err)
        });
});

scheduledthaioil.start();

client.on('messageCreate', message => {
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand() && !interaction.isContextMenu() && !interaction.isSelectMenu() && !interaction.isButton()) return;

    /*if (interaction.commandName === 'fthlotto') {
        await interaction.deferReply();

        fetch(process.env.URL + '/discordbot/addchannels.php?chid=' + interaction.channelId)
            .then(res => res.text())
            .then(async (res) => {
                if (res === 'debug') {
                    await interaction.editReply('ห้องนี้ติดตามสลากฯอยู่แล้ว')
                } else if (res === 'error') {
                    await interaction.editReply('ไม่สามารถติดตามสลากฯได้')
                } else {
                    await interaction.editReply('ติดตามสลากฯในห้องนี้เสร็จเรียบร้อย')
                }
            }).catch(async (err) => {
                await interaction.editReply('ไม่สามารถติดตามสลากฯได้')
            });

    }

    if (interaction.commandName === 'cthlotto') {
        await interaction.deferReply();

        fetch(process.env.URL + '/discordbot/delchannels.php?chid=' + interaction.channelId)
            .then(res => res.text())
            .then(async (res) => {
                if (res === 'debug') {
                    await interaction.editReply('เอ้! ห้องนี้ไม่ได้ติดตามสลากฯ')
                } else {
                    await interaction.editReply('ยกเลิกการติดตามสลากฯในห้องนี้เสร็จเรียบร้อย')
                }
            }).catch(async (err) => {
                await interaction.editReply('ไม่สามารถยกเลิกการติดตามสลากฯได้')
            });

    }*/

    if (interaction.commandName === 'subthlotto') {
        await interaction.deferReply();
        let havesub = false;

        await fetch(process.env.URL + '/discordbot/chlist.txt')
            .then(res => res.json())
            .then(async (res) => {
                if (res.includes(interaction.channelId)) {
                    havesub = true;
                }
            })

        if (havesub == true) {
            fetch(process.env.URL + '/discordbot/delchannels.php?chid=' + interaction.channelId)
                .then(res => res.text())
                .then(async (res) => {
                    if (res === 'debug') {
                        await interaction.editReply('เอ้! ไม่สามารถยกเลิกการติดตามสลากฯได้')
                    } else {
                        await interaction.editReply('ยกเลิกการติดตามสลากฯในห้องนี้เสร็จเรียบร้อย')
                    }
                }).catch(async (err) => {
                    await interaction.editReply('ไม่สามารถยกเลิกการติดตามสลากฯได้')
                });
        } else {
            fetch(process.env.URL + '/discordbot/addchannels.php?chid=' + interaction.channelId)
                .then(res => res.text())
                .then(async (res) => {
                    if (res === 'debug') {
                        await interaction.editReply('เอ้! ไม่สามารถติดตามสลากฯได้')
                    } else if (res === 'error') {
                        await interaction.editReply('เอ้! ไม่สามารถติดตามสลากฯได้')
                    } else {
                        await interaction.editReply('ติดตามสลากฯในห้องนี้เสร็จเรียบร้อย')
                    }
                }).catch(async (err) => {
                    await interaction.editReply('ไม่สามารถติดตามสลากฯได้')
                });
        }
    }

    if (interaction.commandName === 'lastlotto') {
        //await interaction.reply('Loading!');
        await interaction.deferReply();

        const response = await fetch(lottoapi+'/lastlot?info=true');
        const data = await response.json();

        if (fs.existsSync('./lottery_' + data.info.date + '.png') == false) {
            
            //await fetch(lotimgapi+'/?date=' + data.info.date)
            await fetch('https://screenshot-xi.vercel.app/?date=' + data.info.date)
                .then(res => res.buffer())
                .then(async (res) => {
                    await fs.writeFileSync('./lottery_' + data.info.date + '.png', res)
                })
                .catch(async (err) => {
                    await interaction.editReply('ไม่สามารถดึงข้อมูลล่าสุดสลากฯได้')
                });

        }

        const file = new MessageAttachment('./lottery_' + data.info.date + '.png');

        const msg = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('ผลสลากกินแบ่งรัฐบาล')
            .setURL('https://www.glo.or.th/')
            .setDescription('งวดวันที่ ' + parseInt(data.info.date.substring(0, 2)) + ' ' + convertmonthtotext(data.info.date.substring(2, 4)) + ' ' + data.info.date.substring(4, 8))
            .setThumbnail('https://raw.githubusercontent.com/boyphongsakorn/pwisetthon-discord-bot/master/docs/glologo.png')
            .addFields(
                { name: 'รางวัลที่หนึ่ง', value: data.win },
                { name: 'เลขหน้าสามตัว', value: data.threefirst.replace(",", " | "), inline: true },
                { name: 'เลขท้ายสามตัว', value: data.threeend.replace(",", " | "), inline: true },
                { name: 'เลขท้ายสองตัว', value: data.twoend },
            )
            //.setImage('https://lotimg.pwisetthon.com/?date=' + body.info.date)
            .setImage('attachment://lottery_' + data.info.date + '.png')
            .setTimestamp()
            .setFooter({ text: 'ข้อมูลจาก rapidapi.com/boyphongsakorn/api/thai-lottery1 \nบอทจัดทำโดย Phongsakorn Wisetthon \nให้ค่ากาแฟ buymeacoffee.com/boyphongsakorn' });

        //replyembedtype(interaction, msg)
        await interaction.editReply({ embeds: [msg], files: [file] })

    }

    if (interaction.commandName === 'srchlot' || interaction.commandName === 'ตรวจสลากฯ') {
        //console.log(interaction.options.getString('number'));
        let numbertofind = interaction.options.getString('number');
        if (interaction.options.getString('number') == null && interaction.commandName === 'ตรวจสลากฯ') {
            console.log(interaction.options.get('message'));
            numbertofind = interaction.options.get('message').message.content;
        }
        console.log(numbertofind);
        await interaction.deferReply();
        //get this year in buddhist year
        const year = new Date().getFullYear() + 543;

        const response = await fetch(lottoapi+'/lastlot?info=true');
        const data = await response.json();

        const responses = await fetch(lottoapi+'/checklottery?by=' + data.info.date + '&search=' + numbertofind);
        const datas = await responses.text();

        if (datas.search("111111") != -1) {

            const msg = new MessageEmbed()
                .setColor('#FFD700')
                .setTitle('เลขที่คุณตรวจคือ ' + numbertofind + ' ถูกรางวัลที่หนึ่ง')

            await interaction.editReply({ embeds: [msg] })
        } else if (datas.search("222222") != -1) {

            const msg = new MessageEmbed()
                .setColor('#DAA520')
                .setTitle('เลขที่คุณตรวจคือ ' + numbertofind + ' คุณถูกรางวัลที่สอง')

            await interaction.editReply({ embeds: [msg] })
        } else if (datas.search("333333") != -1) {

            const msg = new MessageEmbed()
                .setColor('#F0E68C')
                .setTitle('เลขที่คุณตรวจคือ ' + numbertofind + ' คุณถูกรางวัลที่สาม')

            await interaction.editReply({ embeds: [msg] })
        } else if (datas.search("444444") != -1) {

            const msg = new MessageEmbed()
                .setColor('#EEE8AA')
                .setTitle('เลขที่คุณตรวจคือ ' + numbertofind + ' คุณถูกรางวัลที่สี่')

            await interaction.editReply({ embeds: [msg] })
        } else if (datas.search("555555") != -1) {

            const msg = new MessageEmbed()
                .setColor('#FAFAD2')
                .setTitle('เลขที่คุณตรวจคือ ' + numbertofind + ' คุณถูกรางวัลที่ห้า')

            await interaction.editReply({ embeds: [msg] })
        } else if (datas.search("333000") != -1) {

            const msg = new MessageEmbed()
                .setColor('#D4AF37')
                .setTitle('เลขที่คุณตรวจคือ ' + numbertofind + ' คุณถูกรางวัลเลขหน้าสามตัว')

            await interaction.editReply({ embeds: [msg] })
        } else if (datas.search("000333") != -1) {

            const msg = new MessageEmbed()
                .setColor('#CFB53B')
                .setTitle('เลขที่คุณตรวจคือ ' + numbertofind + ' คุณถูกรางวัลเลขท้ายสามตัว')

            await interaction.editReply({ embeds: [msg] })
        } else if (datas.search("000022") != -1) {

            const msg = new MessageEmbed()
                .setColor('#C5B358')
                .setTitle('เลขที่คุณตรวจคือ ' + numbertofind + ' คุณถูกรางวัลเลขท้ายสองตัว')

            await interaction.editReply({ embeds: [msg] })
        } else if (datas.search("111112") != -1) {

            const msg = new MessageEmbed()
                .setColor('#FFDF00')
                .setTitle('เลขที่คุณตรวจคือ ' + numbertofind + ' คุณถูกรางวัลใกล้เคียงรางวัลที่หนึ่ง')

            await interaction.editReply({ embeds: [msg] })
        } else {

            const msg = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('เลขที่คุณตรวจคือ ' + numbertofind + ' คุณไม่ถูกรางวัล')

            await interaction.editReply({ embeds: [msg] })
        }

    }

    if (interaction.commandName === 'aithing') {
        //deferReply
        await interaction.deferReply();

        await fetch('https://api.apiflash.com/v1/urltoimage?access_key=fda71090a5d94be7b45fe09cb2db840c&delay=10&fresh=true&height=720&url=https%3A%2F%2Flottsanook-chitai-production.up.railway.app%2F%3Fwant%3Dtrue&width=1280')
            .then(res => res.buffer())
            .then(buffer => {
                fs.writeFileSync('./aithing.png', buffer);
            })
            .catch(err => {
                console.log(err)
            });

        const file = new MessageAttachment('./aithing.png');

        //create MessageEmbed
        const msg = new MessageEmbed()
            .setColor('#5454c5')
            .setTitle('เลขเด็ด')
            .setDescription('คำนวณเลขเด็ดจากข่าว โดยใช้ AI')
            //.setImage('https://api.apiflash.com/v1/urltoimage?access_key=fda71090a5d94be7b45fe09cb2db840c&delay=10&fresh=true&height=720&url=https%3A%2F%2Flottsanook-chitai-production.up.railway.app%2F%3Fwant%3Dtrue&width=1280')
            .setImage('attachment://aithing.png')
            .setTimestamp()
            .setFooter({ text: 'ข้อมูลจาก https://lottsanook-chitai-production.up.railway.app/ai \nบอทจัดทำโดย Phongsakorn Wisetthon \nให้ค่ากาแฟ buymeacoffee.com/boyphongsakorn' });

        //edit message
        //await interaction.editReply({ embeds: [msg] })
        await interaction.editReply({ files: [file], embeds: [msg] })
    }

    if (interaction.commandName === 'lotsheet') {
        //deferReply
        await interaction.deferReply({ ephemeral: true });

        //request from https://raw.githubusercontent.com/boyphongsakorn/testrepo/main/godcombothtext to json
        let datearray = []

        fetch('https://raw.githubusercontent.com/boyphongsakorn/testrepo/main/godcombothtext')
            .then(res => res.json())
            .then(async (json) => {
                console.log(json)
                let jsons = json.slice(json.length - 25, json.length)
                for (let i of jsons) {
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
            })

    }

    if (interaction.customId === 'lottsheet') {
        console.log(interaction)

        //deferReply
        await interaction.deferReply();

        if (fs.existsSync('./lotsheet_' + interaction.values[0] + '.pdf') == false && fs.existsSync('./lotsheet_' + interaction.values[0] + '.png') == false) {

            var testdownload = async function (uri, filename, callback) {
                /*const request = require('request');
                request.head(uri, function (err, res, body) {
                    console.log('content-type:', res.headers['content-type']);
                    console.log('content-length:', res.headers['content-length']);

                    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                });*/
                fetch(uri).then(res => res.buffer()).then(buffer => {
                    fs.writeFileSync(filename, buffer)
                    callback()
                }).catch(err => {
                    console.log(err)
                });
            };

            let pdfurl

            var urlencoded = new URLSearchParams();
            urlencoded.append("date", interaction.values[0].substring(0, 2));
            urlencoded.append("month", interaction.values[0].substring(2, 4));
            urlencoded.append("year", parseInt(interaction.values[0].substring(4, 8)) - 543);

            const response = await fetch('https://www.glo.or.th/api/checking/getLotteryResult', {
                method: 'POST',
                body: urlencoded,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            const data = await response.json();

            pdfurl = data.response.result.pdf_url
            console.log(pdfurl)

            if (!fs.existsSync('./docs')) {
                fs.mkdirSync('./docs');
            }

            await testdownload(pdfurl, './lotsheet_' + interaction.values[0] + '.pdf', async function () {
                console.log('done');

                const { ImageMagick } = require('pdf-images');

                //create docs folder if not exist

                const result = ImageMagick.convert('./lotsheet_' + interaction.values[0] + '.pdf', '/app/docs', './lotsheet_' + interaction.values[0]);
                console.log(result)

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
                    .setFooter({ text: 'ข้อมูลจาก glo.or.th \nบอทจัดทำโดย Phongsakorn Wisetthon \nให้ค่ากาแฟ buymeacoffee.com/boyphongsakorn' });

                //edit message
                await interaction.editReply({ embeds: [msg], files: [file] })
                console.log('ok')
            });

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
                .setFooter({ text: 'ข้อมูลจาก ทดสอบ \nบอทจัดทำโดย Phongsakorn Wisetthon \nให้ค่ากาแฟ buymeacoffee.com/boyphongsakorn' });

            //edit message
            await interaction.editReply({ embeds: [msg], files: [file] })
        }
    }

    if (interaction.commandName === 'synumber') {
        await interaction.deferReply({ ephemeral: true });
        let numbertosave = interaction.options.getString('number');
        //check if numbertosave is number
        if (isNaN(numbertosave)) {
            await interaction.editReply({ content: 'กรุณาใส่เลขที่ต้องการบันทึกให้ถูกต้อง' });
        }else{
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
        await fetch(lottoapi+'/reto')
            .then(res => res.text())
            .then(body => {
                if (body == 'yes') {
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

            }
        });

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
        //get YYYY-MM-DD
        let lastlottdateplus543 = lastlottdate.toLocaleString("en-CA", { timeZone: "Asia/Bangkok" });
        console.log(lastlottdateplus543);
        //convert lastlottdateplus543 to dd/mm/yyyy
        let lastlottdateplus543toformat = lastlottdateplus543.substring(8, 10) + '/' + lastlottdateplus543.substring(5, 7) + '/' + (parseInt(lastlottdateplus543.substring(0, 4)) + 543);
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
            .setThumbnail('https://anywhere.pwisetthon.com/https://dbstatus.pwisetthon.com/botimage')
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
            .setFooter({ text: 'ข้อมูลจาก status.teamquadb.in.th \nบอทจัดทำโดย Phongsakorn Wisetthon \nให้ค่ากาแฟ buymeacoffee.com/boyphongsakorn' });

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
                .setDescription('ประวัติการบันทึกเลขของคุณ')
                .setThumbnail('https://dbstatus.pwisetthon.com/botimage')
                //.addFields(history)
                //.setImage('https://lotimg.pwisetthon.com/?date=' + body.info.date)
                //.setImage('attachment://lottery_' + body.info.date + '.png')
                .setTimestamp()
                .setFooter({ text: 'ข้อมูลจาก Database \nบอทจัดทำโดย Phongsakorn Wisetthon \nให้ค่ากาแฟ buymeacoffee.com/boyphongsakorn' });

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

    if (interaction.commandName == 'lastthaioilprice') {
        await interaction.deferReply();

        //let files
        let imagegood = false;

        await fetch('https://screenshot-xi.vercel.app/api?url=https://boyphongsakorn.github.io/thaioilpriceapi&width=1000&height=1000')
            .then(res => res.buffer())
            .then(async (res) => {
                await fs.writeFileSync('./lastoilprice.png', res)
                //imagegood = true;
            })
            .catch(async (err) => {
                console.log(err);
                imagegood = false;
            });

        //check if file exist and size is not 0
        if (fs.existsSync('./lastoilprice.png') && fs.statSync('./lastoilprice.png').size > 0) {
            //files = new MessageAttachment('./lastoilprice.png');
            imagegood = true
        } else {
            imagegood = false;
            await fetch('https://topapi.pwisetthon.com/image')
                .then(res => res.buffer())
                .then(async (res) => {
                    await fs.writeFileSync('./lastoilprice.png', res)
                    //files = new MessageAttachment('./lastoilprice.png');
                    imagegood = true;
                })
                .catch(async (err) => {
                    console.log(err);
                    imagegood = false;
                });
        }

        const files = new MessageAttachment('./lastoilprice.png');

        let msg = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('ราคาน้ำมันล่าสุด')
            .setURL('https://www.bangchak.co.th/th/oilprice/historical')
            .setDescription('ราคาน้ำมันล่าสุด จาก บางจาก')
            .setThumbnail('https://www.bangchak.co.th/glide/assets/images/defaults/opengraph.png?h=350&fit=max&fm=jpg&t=1650602255')
            //.setImage('https://topapi.pwisetthon.com/image')
            .setImage('attachment://lastoilprice.png')
            .setTimestamp()
            .setFooter({ text: 'ข้อมูลจาก bangchak.co.th \nบอทจัดทำโดย Phongsakorn Wisetthon \nให้ค่ากาแฟ buymeacoffee.com/boyphongsakorn' });

        if (imagegood == false) {
            msg.setImage('https://screenshot-xi.vercel.app/api?url=https://boyphongsakorn.github.io/thaioilpriceapi&width=1000&height=1000')
            await interaction.editReply({ embeds: [msg] })
        } else {
            await interaction.editReply({ embeds: [msg], files: [files] });
        }
    }

    /*if (interaction.commandName === 'fthaioilprice') {
        await interaction.deferReply();

        fetch(process.env.URL + '/discordbot/addchanneloil.php?chid=' + interaction.channelId)
            .then(res => res.text())
            .then(async (res) => {
                if (res === 'debug') {
                    await interaction.editReply('ห้องนี้รับแจ้งเตือนราคาน้ำมันอยู่แล้ว')
                } else if (res === 'error') {
                    await interaction.editReply('ไม่สามารถรับแจ้งเตือนราคาน้ำมันได้')
                } else {
                    await interaction.editReply('รับแจ้งเตือนราคาน้ำมันในห้องนี้เสร็จเรียบร้อย')
                }
            }).catch(async (err) => {
                await interaction.editReply('ไม่สามารถรับแจ้งเตือนราคาน้ำมันได้')
            });
    }

    if (interaction.commandName === 'cthaioilprice') {
        await interaction.deferReply();

        fetch(process.env.URL + '/discordbot/delchanneloil.php?chid=' + interaction.channelId)
            .then(res => res.text())
            .then(async (res) => {
                if (res === 'debug') {
                    await interaction.editReply('เอ้! ห้องนี้ไม่ได้รับแจ้งเตือนราคาน้ำมัน')
                } else {
                    await interaction.editReply('ยกเลิกรับแจ้งเตือนราคาน้ำมันในห้องนี้เสร็จเรียบร้อย')
                }
            }).catch(async (err) => {
                await interaction.editReply('ไม่สามารถยกเลิกรับแจ้งเตือนราคาน้ำมันได้')
            });
    }*/

    if (interaction.commandName === 'subthaioilprice') {
        await interaction.deferReply();
        let havesub = false;

        await fetch(process.env.URL + '/discordbot/oilchlist.txt')
            .then(res => res.json())
            .then(async (res) => {
                if (res.includes(interaction.channelId)) {
                    havesub = true;
                }
            })

        if (havesub == false) {
            fetch(process.env.URL + '/discordbot/addchanneloil.php?chid=' + interaction.channelId)
                .then(res => res.text())
                .then(async (res) => {
                    if (res === 'debug') {
                        await interaction.editReply('ไม่สามารถรับแจ้งเตือนราคาน้ำมันได้')
                    } else if (res === 'error') {
                        await interaction.editReply('ไม่สามารถรับแจ้งเตือนราคาน้ำมันได้')
                    } else {
                        await interaction.editReply('รับแจ้งเตือนราคาน้ำมันในห้องนี้เสร็จเรียบร้อย')
                    }
                }).catch(async (err) => {
                    await interaction.editReply('ไม่สามารถรับแจ้งเตือนราคาน้ำมันได้')
                });
        } else {
            fetch(process.env.URL + '/discordbot/delchanneloil.php?chid=' + interaction.channelId)
                .then(res => res.text())
                .then(async (res) => {
                    if (res === 'debug') {
                        await interaction.editReply('ไม่สามารถยกเลิกรับแจ้งเตือนราคาน้ำมันได้')
                    } else {
                        await interaction.editReply('ยกเลิกรับแจ้งเตือนราคาน้ำมันในห้องนี้เสร็จเรียบร้อย')
                    }
                }).catch(async (err) => {
                    await interaction.editReply('ไม่สามารถยกเลิกรับแจ้งเตือนราคาน้ำมันได้')
                });
        }
    }

    if (interaction.commandName === 'checkblacklist') {
        await interaction.deferReply();

        let searchdata = interaction.options.getString('search');
        let arrayreport = [[], [], []];

        //if searchdata is number and length is 10 to 13, then it is phone number,bank account,id card number,etc.
        if (searchdata.length >= 10 && searchdata.length <= 13 && !isNaN(searchdata)) {

            if (searchdata.length == 10) {
                await fetch('https://www.whoscheat.com/_next/data/aEa5U9o6ZMklf6_tJvb9m/results.json?q=' + searchdata + '&by=phone')
                    .then(res => res.json())
                    .then(async (res) => {
                        if (res.pageProps.searchResult != "") {
                            arrayreport[0][0] = res.pageProps.searchResult.totalReport;
                            arrayreport[0][1] = res.pageProps.searchResult.totalDamagedPrice;
                            arrayreport[0][2] = res.pageProps.searchResult.lastedReport.amount;
                            arrayreport[0][3] = res.pageProps.searchResult.lastedReport.eventDate;
                            arrayreport[0][4] = res.pageProps.searchResult.lastedReport.eventDetail;
                            arrayreport[0][5] = res.pageProps.searchResult.lastedReport.bankAccountNo;
                            arrayreport[0][6] = res.pageProps.searchResult.lastedReport.phoneNumber;
                            arrayreport[0][7] = res.pageProps.searchResult.lastedReport.name;
                            //console.log(arrayreport[0]);
                        } else {
                            arrayreport[0][0] = 0;
                        }
                    }).catch(async (err) => {
                        //await interaction.editReply('ไม่สามารถตรวจสอบข้อมูลได้')
                    });
            } else {
                arrayreport[0][0] = 0;
            }

            if (searchdata.length == 13) {
                await fetch('https://www.whoscheat.com/_next/data/aEa5U9o6ZMklf6_tJvb9m/results.json?q=' + searchdata + '&by=id-number')
                    .then(res => res.json())
                    .then(async (res) => {
                        if (res.pageProps.searchResult != "") {
                            arrayreport[1][0] = res.pageProps.searchResult.totalReport;
                            arrayreport[1][1] = res.pageProps.searchResult.totalDamagedPrice;
                            arrayreport[1][2] = res.pageProps.searchResult.lastedReport.amount;
                            arrayreport[1][3] = res.pageProps.searchResult.lastedReport.eventDate;
                            arrayreport[1][4] = res.pageProps.searchResult.lastedReport.eventDetail;
                            arrayreport[1][5] = res.pageProps.searchResult.lastedReport.bankAccountNo;
                            arrayreport[1][6] = res.pageProps.searchResult.lastedReport.phoneNumber;
                            arrayreport[1][7] = res.pageProps.searchResult.lastedReport.name;
                            //console.log(arrayreport[0]);
                        } else {
                            arrayreport[1][0] = 0;
                        }
                    }).catch(async (err) => {
                        //await interaction.editReply('ไม่สามารถตรวจสอบข้อมูลได้')
                    });
            } else {
                arrayreport[1][0] = 0;
            }

            await fetch('https://www.whoscheat.com/_next/data/aEa5U9o6ZMklf6_tJvb9m/results.json?q=' + searchdata + '&by=bank-account')
                .then(res => res.json())
                .then(async (res) => {
                    if (res.pageProps.searchResult != "") {
                        arrayreport[2][0] = res.pageProps.searchResult.totalReport;
                        arrayreport[2][1] = res.pageProps.searchResult.totalDamagedPrice;
                        arrayreport[2][2] = res.pageProps.searchResult.lastedReport.amount;
                        arrayreport[2][3] = res.pageProps.searchResult.lastedReport.eventDate;
                        arrayreport[2][4] = res.pageProps.searchResult.lastedReport.eventDetail;
                        arrayreport[2][5] = res.pageProps.searchResult.lastedReport.bankAccountNo;
                        arrayreport[2][6] = res.pageProps.searchResult.lastedReport.phoneNumber;
                        arrayreport[2][7] = res.pageProps.searchResult.lastedReport.name;
                        //console.log(arrayreport[0]);
                    } else {
                        arrayreport[2][0] = 0;
                    }
                }).catch(async (err) => {
                    //await interaction.editReply('ไม่สามารถตรวจสอบข้อมูลได้')
                });

            if (arrayreport[0][0] != 0) {
                //get arrayreport length
                let arrayreportlength = arrayreport.length;
                //change arrayreport[0][7] space to '+'
                let name = arrayreport[0][7].replace(/\s/g, '+');
                await fetch('https://www.whoscheat.com/_next/data/aEa5U9o6ZMklf6_tJvb9m/results.json?q=' + name + '&by=name')
                    .then(res => res.json())
                    .then(async (res) => {
                        if (res.pageProps.searchResult != "") {
                            arrayreport[arrayreportlength][0] = res.pageProps.searchResult.totalReport;
                            arrayreport[arrayreportlength][1] = res.pageProps.searchResult.totalDamagedPrice;
                            arrayreport[arrayreportlength][2] = res.pageProps.searchResult.lastedReport.amount;
                            arrayreport[arrayreportlength][3] = res.pageProps.searchResult.lastedReport.eventDate;
                            arrayreport[arrayreportlength][4] = res.pageProps.searchResult.lastedReport.eventDetail;
                            arrayreport[arrayreportlength][5] = res.pageProps.searchResult.lastedReport.bankAccountNo;
                            arrayreport[arrayreportlength][6] = res.pageProps.searchResult.lastedReport.phoneNumber;
                            arrayreport[arrayreportlength][7] = res.pageProps.searchResult.lastedReport.name;
                            //console.log(arrayreport[0]);
                        }
                    }).catch(async (err) => {
                        //await interaction.editReply('ไม่สามารถตรวจสอบข้อมูลได้')
                    });
            }

            if (arrayreport[1][0] != 0) {
                if (arrayreport[arrayreport.length - 1][7] != arrayreport[1][7]) {
                    //get arrayreport length
                    let arrayreportlength = arrayreport.length;
                    //change arrayreport[0][7] space to '+'
                    let name = arrayreport[1][7].replace(/\s/g, '+');
                    await fetch('https://www.whoscheat.com/_next/data/aEa5U9o6ZMklf6_tJvb9m/results.json?q=' + name + '&by=name')
                        .then(res => res.json())
                        .then(async (res) => {
                            if (res.pageProps.searchResult != "") {
                                arrayreport[arrayreportlength][0] = res.pageProps.searchResult.totalReport;
                                arrayreport[arrayreportlength][1] = res.pageProps.searchResult.totalDamagedPrice;
                                arrayreport[arrayreportlength][2] = res.pageProps.searchResult.lastedReport.amount;
                                arrayreport[arrayreportlength][3] = res.pageProps.searchResult.lastedReport.eventDate;
                                arrayreport[arrayreportlength][4] = res.pageProps.searchResult.lastedReport.eventDetail;
                                arrayreport[arrayreportlength][5] = res.pageProps.searchResult.lastedReport.bankAccountNo;
                                arrayreport[arrayreportlength][6] = res.pageProps.searchResult.lastedReport.phoneNumber;
                                arrayreport[arrayreportlength][7] = res.pageProps.searchResult.lastedReport.name;
                                //console.log(arrayreport[0]);
                            }
                        }).catch(async (err) => {
                            //await interaction.editReply('ไม่สามารถตรวจสอบข้อมูลได้')
                        });
                }
            }

            if (arrayreport[2][0] != 0) {
                if (arrayreport[arrayreport.length - 1][7] != arrayreport[2][7]) {
                    //get arrayreport length
                    let arrayreportlength = arrayreport.length;
                    //change arrayreport[0][7] space to '+'
                    let name = arrayreport[2][7].replace(/\s/g, '+');
                    await fetch('https://www.whoscheat.com/_next/data/aEa5U9o6ZMklf6_tJvb9m/results.json?q=' + name + '&by=name')
                        .then(res => res.json())
                        .then(async (res) => {
                            if (res.pageProps.searchResult != "") {
                                arrayreport[arrayreportlength][0] = res.pageProps.searchResult.totalReport;
                                arrayreport[arrayreportlength][1] = res.pageProps.searchResult.totalDamagedPrice;
                                arrayreport[arrayreportlength][2] = res.pageProps.searchResult.lastedReport.amount;
                                arrayreport[arrayreportlength][3] = res.pageProps.searchResult.lastedReport.eventDate;
                                arrayreport[arrayreportlength][4] = res.pageProps.searchResult.lastedReport.eventDetail;
                                arrayreport[arrayreportlength][5] = res.pageProps.searchResult.lastedReport.bankAccountNo;
                                arrayreport[arrayreportlength][6] = res.pageProps.searchResult.lastedReport.phoneNumber;
                                arrayreport[arrayreportlength][7] = res.pageProps.searchResult.lastedReport.name;
                                //console.log(arrayreport[0]);
                            }
                        }).catch(async (err) => {
                            //await interaction.editReply('ไม่สามารถตรวจสอบข้อมูลได้')
                        });
                }
            }

            console.log(arrayreport);
            //check if arrayreport[x][0] most number of report use x as index
            let max = 0;
            let index = 0;
            for (let i = 0; i < arrayreport.length; i++) {
                if (arrayreport[i][0] > max) {
                    max = arrayreport[i][0];
                    index = i;
                }
            }

            //if max != 0, then show report
            if (max != 0) {
                let waytocheat
                if (arrayreport[index][5] != null) {
                    waytocheat = 'โอนเงินผ่านบัญชีธนาคาร'
                } else if (arrayreport[index][6] != null) {
                    waytocheat = 'โอนเงินผ่านบัญชีพร้อมเพย์'
                } else {
                    waytocheat = 'โอนเงินผ่านบัญชีธนาคาร'
                }

                let url

                if (index == 2) {
                    url = 'https://www.whoscheat.com/results?q=' + searchdata + '&by=bank-account'
                } else if (index == 1) {
                    url = 'https://www.whoscheat.com/results?q=' + searchdata + '&by=id-number'
                } else {
                    url = 'https://www.whoscheat.com/results?q=' + searchdata + '&by=phone'
                }

                const msg = new MessageEmbed()
                    .setColor('#EE4B2B')
                    .setTitle('ข้อมูลการรายงานของ ' + arrayreport[index][7])
                    .setDescription('ข้อมูลการรายงานประวัติการโกงของ ' + arrayreport[index][7])
                    .setURL(url)
                    .setAuthor({ name: 'whoscheat', iconURL: 'https://www.whoscheat.com/apple-touch-icon.png?v=1', url: 'https://www.whoscheat.com' })
                    .addField('พบรายงานการโกง', 'จำนวน ' + arrayreport[index][0] + ' ครั้ง')
                    .addFields(
                        { name: 'ครั้งล่าสุด', value: arrayreport[index][3], inline: true },
                        { name: 'ช่องทาง', value: waytocheat, inline: true },
                        { name: 'รายละเอียด', value: arrayreport[index][4], inline: false },
                        { name: 'ยอดความเสียหาย', value: arrayreport[index][2] + ' บาท', inline: true }
                    )
                    .setTimestamp()
                    .setFooter({ text: 'ขอบคุณข้อมูลจาก whoscheat.com', iconURL: 'https://www.whoscheat.com/apple-touch-icon.png?v=1' });

                await interaction.editReply({ embeds: [msg] });
            } else {
                await interaction.editReply('ไม่เคยมีประวัติการโกง')
            }

        } else {
            console.log(searchdata);
            //change space in searchdata to +
            searchdata = searchdata.replace(/\s/g, '+');
            //console.log(searchdata);
            //change searchdata to url encode
            //searchdata = encodeURI(searchdata);
            //console.log(searchdata);
            await fetch('https://www.whoscheat.com/_next/data/aEa5U9o6ZMklf6_tJvb9m/results.json?q=' + searchdata + '&by=name')
                .then(res => res.json())
                .then(async (res) => {
                    if (res.pageProps.searchResult != "") {
                        let waytocheat
                        if (res.pageProps.searchResult.lastedReport.bankAccountNo != null) {
                            waytocheat = 'โอนเงินผ่านบัญชีธนาคาร'
                        } else if (res.pageProps.searchResult.lastedReport.phoneNumber != null) {
                            waytocheat = 'โอนเงินผ่านบัญชีพร้อมเพย์'
                        } else {
                            waytocheat = 'โอนเงินผ่านบัญชีธนาคาร'
                        }

                        //let res.pageProps.searchResult.name to URI encode
                        let name = encodeURI(res.pageProps.searchResult.name);

                        const msg = new MessageEmbed()
                            .setColor('#EE4B2B')
                            .setTitle('ข้อมูลการรายงานของ ' + res.pageProps.searchResult.name)
                            .setDescription('ข้อมูลการรายงานประวัติการโกงของ ' + res.pageProps.searchResult.name)
                            .setURL('https://www.whoscheat.com/results?q=' + name + '&by=name')
                            .setAuthor({ name: 'whoscheat', iconURL: 'https://www.whoscheat.com/apple-touch-icon.png?v=1', url: 'https://www.whoscheat.com' })
                            .addField('พบรายงานการโกง', 'จำนวน ' + res.pageProps.searchResult.totalReport + ' ครั้ง')
                            .addFields(
                                { name: 'ครั้งล่าสุด', value: res.pageProps.searchResult.lastedReport.eventDate, inline: true },
                                { name: 'ช่องทาง', value: waytocheat, inline: true }
                            )
                            .addFields(
                                { name: 'รายละเอียด', value: res.pageProps.searchResult.lastedReport.eventDetail, inline: true },
                                { name: 'ยอดความเสียหาย', value: res.pageProps.searchResult.lastedReport.amount + ' บาท', inline: true }
                            )
                            .setTimestamp()
                            .setFooter({ text: 'ขอบคุณข้อมูลจาก whoscheat.com', iconURL: 'https://www.whoscheat.com/apple-touch-icon.png?v=1' });

                        await interaction.editReply({ embeds: [msg] });
                    } else {
                        await interaction.editReply('ไม่เคยมีประวัติการโกง')
                    }
                }).catch(async (err) => {
                    console.log(err);
                    await interaction.editReply('ไม่สามารถตรวจสอบข้อมูลได้')
                });
        }

        //await interaction.editReply('เปิดใช้งาน เร็วๆนี้...');
    }

    if(interaction.customId === 'hellandreset' || interaction.customId === 'hell'){
        await interaction.deferReply();
        
        //get today format day/month/thaiyear
        let today = new Date();
        let day = today.getDate();
        let month = today.getMonth() + 1;
        let thaiyear = today.getFullYear() + 543;
        let todayformat = day + '/' + month + '/' + thaiyear;
        let hellsql = 'SELECT messid FROM hell WHERE date = \'' + todayformat + '\' LIMIT 1';
        con.query(hellsql, async (err, result) => {
            if (err) throw err;
            //convert result[0].messid from json text to json object
            let messid = JSON.parse(result[0].messid);
            //loop messid
            for (let i = 0; i < messid.length; i++) {
                //delete message by messid and chanelid
                try {
                    //client.channels.cache.get(messid[i].chanelid).messages.cache.get(messid[i].messid).delete();
                    client.channels.cache.get(messid[i].chanelid).messages.fetch(messid[i].messid).then(message => message.delete());
                    //client.channels.cache.get(messid[i].chanelid).fetchMessage(messid[i].messid).then(msg => msg.delete());
                    console.log('delete message ' + messid[i].messid + ' in ' + messid[i].chanelid + ' success');
                } catch (error) {
                    console.log(error)
                }
            }
        })

        if(interaction.customId === 'hellandreset'){
            await fetch('https://topapi.pwisetthon.com')
            .then(res => res.json())
            .then(async (res) => {
                let resetsql = 'DELETE FROM oilprice WHERE date = "' + res[0][0] + '"';
                con.query(resetsql, function (err, result) {
                    if (err) throw err;
                    console.log("Number of records deleted: " + result.affectedRows);
                });
                //spilt res[0][0] to get date by /
                let date = res[0][0].split('/');
                let datenumber = parseInt(date[0])-1;
                let datemonth = parseInt(date[1]);
                let dateyear = date[2];
                let newdate = datenumber + '/' + datemonth + '/' + dateyear;
                resetsql = 'DELETE FROM hell WHERE date = "' + newdate + '"';
                con.query(resetsql, function (err, result) {
                    if (err) throw err;
                    console.log("Number of records deleted: " + result.affectedRows);
                })
            })
            .catch(async (err) => {
                console.log(err);
            })
        }

        await interaction.editReply('กำลังล้างข้อมูล...');
    }
});

client.login(process.env.BOT_TOKEN);