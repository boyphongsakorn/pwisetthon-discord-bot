const { MessageAttachment, EmbedBuilder, Client, GatewayIntentBits, ButtonBuilder, SelectMenuBuilder, ActionRowBuilder, ClientUser, AttachmentBuilder } = require('discord.js');
const cron = require("cron");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
var fs = require('fs');
var http = require('http');
const pngToJpeg = require('png-to-jpeg');
var mysql = require('mysql');
const cheerio = require('cheerio');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

//create mysql connection
/*var con = mysql.createConnection({
    host: "192.168.31.210",
    user: "boyphongsakorn",
    password: "team1556th",
    database: "discordbot"
});*/

var con

let lottoapi = "http://192.168.31.210:5000";
let lotimgapi = "http://192.168.31.220:14000";
let apikey = process.env.rapidapikey;

//create a server object:
http.createServer(async function (req, res) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Max-Age': 2592000, // 30 days
        /** add other headers as per requirement */
        // set utf-8 encoding
        'Content-Type': 'application/json; charset=utf-8'
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
    } else if (req.url === '/guildlist') {
        res.writeHead(200, headers);
        //res.write(JSON.stringify(client.guilds.cache.map(guild => guild.name))); //write a response to the client
        //response guild name and guild image url
        let guildlist = client.guilds.cache.map(guild => {
            return {
                name: guild.name,
                icon: guild.iconURL({ format: 'jpg', dynamic: true, size: 512 })
            }
        });
        //shuffling array
        guildlist.sort(() => Math.random() - 0.5);
        res.write(JSON.stringify(guildlist)); //write a response to the client
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
                    .then(/*console.log*/)
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

function handleDisconnect() {
    con = mysql.createConnection({
        host: "192.168.31.210",
        user: "boyphongsakorn",
        password: "team1556th",
        database: "discordbot"
    }); // Recreate the connection, since
    // the old one cannot be reused.

    con.connect(function (err) {              // The server is either down
        if (err) {                                     // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        } else {
            console.log("Database Connected!");
        }                                     // to avoid a hot loop, and to allow our node script to
    });                                       // process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    con.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

// end functions

client.once('ready', () => {
    handleDisconnect();
    //con.connect(function (err) {
    //if (err) throw err;
    //console.log("Database Connected!");
    //get all guilds
    client.guilds.cache.forEach(async function (guild) {

        try {
            guild.commands.fetch().then(async function (commands) {
                //if guild has no commands
                if (commands.size != 13) {
                    //create commands
                    //await guildCommandCreate(guild.id);
                    await guildCommandDelete(guild);
                    await guildCommandCreate(guild.id);
                }
            });
        } catch (error) {
            console.log('error: ' + error);
        }
    });
    //client.user.setPresence({ activities: [{ name: 'discordbot.pwisetthon.com' }], status: 'online' });
    client.user.setPresence({ activities: [{ name: 'เจอปัญหาแจ้งได้ที่ discord.com/invite/j7xce5hxUf' }], status: 'online' });
    //client.user.setPresence({ activities: [{ name: '📙  /lotsheet ใช้ได้แล้วนะ 👍' }], status: 'online' });
    client.users.fetch('133439202556641280').then(dm => {
        dm.send('Bot เริ่มต้นการทำงานแล้ว')
    });
    //send ok to channel 908708400379097184 and get message id
    /*client.channels.cache.get('908708400379097184').send('Bot เริ่มต้นการทำงานแล้ว')
        .then(async function (message) {
            //log message id
            console.log(message.id);
            //wait 5 sec
            await new Promise(resolve => setTimeout(resolve, 5000));
            //delete message
            client.channels.cache.get('908708400379097184').messages.cache.get(message.id).delete();
        });*/
    console.log('I am ready!');
    //});
});

client.on("guildCreate", async guild => {

    console.log("Joined a new guild: " + guild.id);

    client.users.fetch('133439202556641280').then(dm => {
        dm.send('ดิส ' + guild.name + '(' + guild.id + ') ได้เชิญ บอท PWisetthon.com เข้าเรียบร้อยแล้ว')
    });

    if (guild.systemChannelId != null && guild.systemChannelId != undefined) {
        console.log("System Channel: " + guild.systemChannelId);

        /*fetch(process.env.URL + '/discordbot/addchannels.php?chid=' + guild.systemChannelId)
            .then(res => res.text())
            .then(body => {
                console.log(body);
                if (body == 'debug') {
                    client.channels.cache.get(guild.systemChannelId).send('ขอบคุณ! ที่เชิญเราเข้าส่วนหนึ่งในดิสของคุณ')
                        .catch(console.error);
                } else {
                    client.channels.cache.get(guild.systemChannelId).send('ขอบคุณ! ที่เชิญเราเข้าเป็นส่วนร่วมของดิสคุณ เราได้ทำการติดตามสลากฯให้สำหรับดิสนี้เรียบร้อยแล้ว! \nใช้คำสั่ง /subthlotto เพื่อยกเลิก')
                        .catch(console.error);
                }
            });*/

        const fetchadd = await fetch(process.env.URL + '/discordbot/addchannels.php?chid=' + guild.systemChannelId)
        const bodyadd = await fetchadd.text()
        if (bodyadd == 'debug') {
            client.channels.cache.get(guild.systemChannelId).send('ขอบคุณ! ที่เชิญเราเข้าส่วนหนึ่งในดิสของคุณ')
                .catch(console.error);
        } else {
            client.channels.cache.get(guild.systemChannelId).send('ขอบคุณ! ที่เชิญเราเข้าเป็นส่วนร่วมของดิสคุณ เราได้ทำการติดตามสลากฯให้สำหรับดิสนี้เรียบร้อยแล้ว! \nใช้คำสั่ง /subthlotto เพื่อยกเลิก')
                .catch(console.error);
        }

    }

    //use guildCommandCreate
    guildCommandCreate(guild.id);

})

let scheduledMessage = new cron.CronJob('* 15-17 * * *', async () => {

    // datedata

    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear() + 543;

    date = padLeadingZeros(date, 2);
    month = padLeadingZeros(month, 2);
    year = padLeadingZeros(year, 4);

    let url = lottoapi + "/?date=" + date + "" + month + "" + year + "&fresh";
    let settings = { "method": "GET" };

    /*fetch(url, settings)
        .then(res => res.json())
        .then(async (json) => {*/
    const fetchapi = await fetch(url, settings);
    const json = await fetchapi.json();
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

            let imgurl = 'https://screenshot-xi.vercel.app/api?date=';

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
                if(lasttime == null){
                    lasttime = new Date();
                    //minus 2 days
                    lasttime.setDate(lasttime.getDate() - 2);
                }
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

                    //if (fs.existsSync('./lottery_' + date + '' + month + '' + year + '.png') == false) {

                    /*await fetch('https://screenshot-xi.vercel.app/api?date=' + date + '' + month + '' + year)
                        .then(res => res.buffer())
                        .then(async (res) => {
                            await fs.writeFileSync('./lottery_' + date + '' + month + '' + year + '.png', res)
                        })
                        .catch(async (err) => {
                            console.log('Error:', err.message)
                        });*/

                    const normalimg = await fetch('https://screenshot-xi.vercel.app/api?date=' + date + '' + month + '' + year)
                    const bufimg = await normalimg.arrayBuffer()

                    /*await fetch('https://lotimg.pwisetthon.com/?date=' + date + '' + month + '' + year + '&mode=gold')
                        .then(res => res.buffer())
                        .then(async (res) => {
                            await fs.writeFileSync('./lottery_' + date + '' + month + '' + year + '_gold.png', res)
                        })
                        .catch(async (err) => {
                            console.log('Error:', err.message)
                        });*/

                    const goldimg = await fetch('https://lotimg.pwisetthon.com/?date=' + date + '' + month + '' + year + '&mode=gold')
                    const bufgoldimg = await goldimg.arrayBuffer()
                    //}

                    console.log(Buffer.from(bufimg).length)

                    //Buffer.from(bufimg).length is low to be image then kill process
                    if (Buffer.from(bufimg).length < 1000) {
                        process.exit(1);
                    }

                    //check number user save
                    con.query("SELECT * FROM lott_table WHERE status = 'waiting'", async function (err, result, fields) {
                        if (err) throw err;
                        console.log(result);
                        //loop result
                        for (let i = 0; i < result.length; i++) {
                            let whatid = result[i].lott_id
                            let discordid = result[i].discord_id
                            let numberhebuy = result[i].numberbuy
                            console.log(result[i].lott_id)
                            console.log(result[i].numberbuy)
                            let optitot = { "method": "GET", "headers": { "x-rapidapi-host": "thai-lottery1.p.rapidapi.com", "x-rapidapi-key": apikey } };
                            /*fetch("https://thai-lottery1.p.rapidapi.com/checklottery?by=" + date + "" + month + "" + year + "&search=" + result[i].numberbuy, optitot)
                                .then(res => res.text())
                                .then((json) => {
                                    //if json is null or empty send message to result[i].discord_id
                                    if (json == '' || json == null) {
                                        var sql = "UPDATE lott_table SET status = 'ไม่ถูก',lotround = '" + (year - 543) + "-" + month + "-" + date + "' WHERE lott_id = '" + whatid + "'";
                                        con.query(sql, function (err, result) {
                                            if (err) throw err;
                                            client.users.fetch(discordid).then(dm => {
                                                dm.send('ขออภัยค่ะ! เลข ' + numberhebuy + ' ยังไม่ถูกรางวัลในงวดวันนี้ค่ะ')
                                            })
                                        });
                                    } else {
                                        var sql = "UPDATE lott_table SET status = 'win',lotround = '" + (year - 543) + "-" + month + "-" + date + "' WHERE lott_id = '" + whatid + "'";
                                        con.query(sql, function (err, result) {
                                            if (err) throw err;
                                            client.users.fetch(discordid).then(dm => {
                                                dm.send('ยินดีด้วย! เลข ' + numberhebuy + ' ถูกรางวัลในงวดวันนี้ค่ะ')
                                            })
                                        });
                                    }
                                });*/
                            const checkapi = await fetch('https://thai-lottery1.p.rapidapi.com/checklottery?by=' + date + '' + month + '' + year + '&search=' + result[i].numberbuy, optitot)
                            const checkjson = await checkapi.json()
                            if (checkjson == '' || checkjson == null || checkjson == {} || checkjson == [] || checkjson.length == 0) {
                                var sql = "UPDATE lott_table SET status = 'ไม่ถูก',lotround = '" + (year - 543) + "-" + month + "-" + date + "' WHERE lott_id = '" + whatid + "'";
                                con.query(sql, function (err, result) {
                                    if (err) throw err;
                                    client.users.fetch(discordid).then(dm => {
                                        dm.send('ขออภัยค่ะ! เลข ' + numberhebuy + ' ยังไม่ถูกรางวัลในงวดวันนี้ค่ะ')
                                    })
                                });
                            } else {
                                var sql = "UPDATE lott_table SET status = 'win',lotround = '" + (year - 543) + "-" + month + "-" + date + "' WHERE lott_id = '" + whatid + "'";
                                con.query(sql, function (err, result) {
                                    if (err) throw err;
                                    client.users.fetch(discordid).then(dm => {
                                        dm.send('ยินดีด้วย! เลข ' + numberhebuy + ' ถูกรางวัลในงวดวันนี้ค่ะ')
                                    })
                                });
                            }
                        }
                    });

                    //const file = new MessageAttachment('./lottery_' + date + '' + month + '' + year + '.png');
                    //const file = new AttachmentBuilder('./lottery_' + date + '' + month + '' + year + '.png');
                    const file = new AttachmentBuilder(Buffer.from(bufimg), { name: 'lottery_' + date + '' + month + '' + year + '.png' });
                    //const filegold = new MessageAttachment('./lottery_' + date + '' + month + '' + year + '_gold.png');
                    //const filegold = new AttachmentBuilder('./lottery_' + date + '' + month + '' + year + '_gold.png');
                    const filegold = new AttachmentBuilder(Buffer.from(bufgoldimg), { name: 'lottery_' + date + '' + month + '' + year + '_gold.png' });

                    const msg = new EmbedBuilder()
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
                        //.setFooter('ข้อมูลจาก rapidapi.com/boyphongsakorn/api/thai-lottery1 \nบอทจัดทำโดย Phongsakorn Wisetthon \nให้ค่ากาแฟ buymeacoffee.com/boyphongsakorn');
                        .setFooter({ text: 'ข้อมูลจาก rapidapi.com/boyphongsakorn/api/thai-lottery1 \nบอทจัดทำโดย Phongsakorn Wisetthon \nให้ค่ากาแฟ buymeacoffee.com/boyphongsakorn' });

                    const msggold = new EmbedBuilder()
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
                        //.setFooter('ข้อมูลจาก rapidapi.com/boyphongsakorn/api/thai-lottery1 \nบอทจัดทำโดย Phongsakorn Wisetthon \nให้ค่ากาแฟ buymeacoffee.com/boyphongsakorn');
                        .setFooter({ text: 'ข้อมูลจาก rapidapi.com/boyphongsakorn/api/thai-lottery1 \nบอทจัดทำโดย Phongsakorn Wisetthon \nให้ค่ากาแฟ buymeacoffee.com/boyphongsakorn' });

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

    //});

});

// When you want to start it, use:
scheduledMessage.start()
// You could also make a command to pause and resume the job

//thaioilprice cron

let scheduledthaioil = new cron.CronJob('* 05-18 * * *', async () => {
    let nows = new Date();
    //is 5 in morning
    if (nows.getHours() == 5 && nows.getMinutes() == 0) {
        // if nows = 3 feb client.user.setAvatar
        if ((nows.getDate() >= 21 && nows.getDate() <= 23 && nows.getMonth() == 0)) {
            client.user.setAvatar('https://img.gs/fhcphvsghs/512/https://raw.githubusercontent.com/boyphongsakorn/pwisetthon-discord-bot/master/img/botav_cny.png')
        } else if (nows.getDate() >= 1 && nows.getDate() <= 3 && nows.getMonth() == 1) {
            client.user.setAvatar('https://img.gs/fhcphvsghs/512/https://raw.githubusercontent.com/boyphongsakorn/pwisetthon-discord-bot/master/img/botav_hbd.jpg')
        } else if (nows.getDate() >= 13 && nows.getDate() <= 15 && nows.getMonth() == 1) {
            client.user.setAvatar('https://img.gs/fhcphvsghs/512/https://raw.githubusercontent.com/boyphongsakorn/pwisetthon-discord-bot/master/img/botav_vd.png')
        //} else if (nows.getDate() >= 15 && nows.getDate() <= 16 && nows.getMonth() == 1) {
        } else if (nows.getDate() >= 4 && nows.getDate() <= 6 && nows.getMonth() == 2) {
            client.user.setAvatar('https://img.gs/fhcphvsghs/512/https://raw.githubusercontent.com/boyphongsakorn/pwisetthon-discord-bot/master/img/botav_makha.jpg')
        } else if (nows.getDate() >= 11 && nows.getDate() <= 15 && nows.getMonth() == 3) {
            client.user.setAvatar('https://img.gs/fhcphvsghs/512/https://raw.githubusercontent.com/boyphongsakorn/pwisetthon-discord-bot/master/img/botav_songkran.jpg')
        } else if (nows.getDate() >= 21 && nows.getDate() <= 23 && nows.getMonth() == 9) {
            client.user.setAvatar('https://img.gs/fhcphvsghs/512/https://raw.githubusercontent.com/boyphongsakorn/pwisetthon-discord-bot/master/img/botav_piya.jpg')
        } else if ((nows.getDate() >= 30 && nows.getDate() <= 31 && nows.getMonth() == 9) || (nows.getDate() == 1 && nows.getMonth() == 10)) {
            client.user.setAvatar('https://img.gs/fhcphvsghs/512/https://raw.githubusercontent.com/boyphongsakorn/pwisetthon-discord-bot/master/img/botav_hh.jpg')
        } else if (nows.getDate() >= 8 && nows.getDate() <= 10 && nows.getMonth() == 11) {
            client.user.setAvatar('https://img.gs/fhcphvsghs/512/https://raw.githubusercontent.com/boyphongsakorn/pwisetthon-discord-bot/master/img/botav_law.jpg')
        } else if ((nows.getDate() >= 23 && nows.getDate() <= 31 && nows.getMonth() == 11) || (nows.getDate() == 1 && nows.getMonth() == 0)) {
            client.user.setAvatar('https://img.gs/fhcphvsghs/512/https://raw.githubusercontent.com/boyphongsakorn/pwisetthon-discord-bot/master/img/botav_mrahny.jpg')
        } else {
            client.user.setAvatar('https://img.gs/fhcphvsghs/512/https://raw.githubusercontent.com/boyphongsakorn/pwisetthon-discord-bot/master/img/botav.jpg')
        }
    }

    //fetch http://192.168.31.210:1000 || https://topapi.pwisetthon.com
    /*fetch('https://thaioilpriceapi-vercel.vercel.app')
        .then(res => res.json())
        .then(json => {*/
    try {
        const fetchapi = await fetch('https://topapi.pwisetthon.com');
        const json = await fetchapi.json();
        let ngv = json[0][10]

        var sql = 'SELECT * FROM oilprice WHERE date = "' + json[0][0] + '"';
        con.query(sql, function (err, result) {
            if (err) throw err;
            if (result.length == 0 && json[0][0] != '') {
                console.log('hey new oil price has come');
                if (json[0][10] == '-') {
                    ngv = 0
                }
                var sql = 'INSERT INTO oilprice VALUES ("' + json[0][0] + '", ' + json[0][1] + ', ' + json[0][2] + ', ' + json[0][3] + ', ' + json[0][4] + ', ' + json[0][5] + ', ' + json[0][6] + ', ' + json[0][7] + ', ' + json[0][8] + ', ' + ngv + ')';
                con.query(sql, async function (err, result) {
                    if (err) throw err;

                    //set Presence
                    if (parseInt(json[2][8]) > 0) {
                        client.user.setPresence({ activities: [{ name: 'เซ็ง 91 ขึ้นอีกละ | discordbot.pwisetthon.com' }], status: 'online' });
                        //after 1 hour set back to default
                        setTimeout(() => {
                            client.user.setPresence({ activities: [{ name: 'discordbot.pwisetthon.com' }], status: 'online' });
                        }, 3600000);
                    }

                    const response = await fetch(process.env.URL + '/discordbot/oilchlist.txt');
                    const data = await response.json();
                    const wow = data;
                    //let imagegood = false;

                    /*await fetch('https://screenshot-xi.vercel.app/api?url=https://boyphongsakorn.github.io/thaioilpriceapi&width=1000&height=1000', { timeout: 7500 })
                        .then(res => res.buffer())
                        .then(async (res) => {
                            await fs.writeFileSync('./lastoilprice.png', res)
                            //imagegood = true;
                        })
                        .catch(async (err) => {
                            console.log(err);
                            //imagegood = false;
                        });*/

                    let downloadscussess = false;
                    let thaioilimg

                    while (downloadscussess == false) {
                        try {
                            //const fetchthaioilimg = await fetch('https://screenshot-xi.vercel.app/api?url=https://boyphongsakorn.github.io/thaioilpriceapi&width=1000&height=1000');
                            const fetchthaioilimg = await fetch('https://thaioilpriceapi-vercel.vercel.app/image');
                            thaioilimg = await fetchthaioilimg.arrayBuffer();
                            if (Buffer.from(thaioilimg).length > 100000) {
                                downloadscussess = true;
                            }
                        } catch (err) {
                            console.log(err);
                        }
                    }

                    //const fetchthaioilimg = await fetch('https://topapi.pwisetthon.com/image');
                    //const thaioilimg = await fetchthaioilimg.arrayBuffer();

                    //let files
                    //let imageisgood = false

                    //check if file exist and size > 400kb and size < 500kb
                    /*if (fs.existsSync('./lastoilprice.png') && fs.statSync('./lastoilprice.png').size > 400000 && fs.statSync('./lastoilprice.png').size < 500000) {
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
                    }*/

                    let todays = new Date();
                    let oilday = new Date(json[0][0].substring(6, 10) + '-' + json[0][0].substring(3, 5) + '-' + json[0][0].substring(0, 2));

                    let desctext

                    //if todays == oilday
                    if (todays.getDate() == oilday.getDate()) {
                        desctext = 'นี้';
                    } else if (todays.getDate() > oilday.getDate()) {
                        desctext = 'เมื่อวานนี้';
                    } else {
                        desctext = 'พรุ่งนี้';
                    }

                    //const files = new MessageAttachment('./lastoilprice.png');
                    //const files = new AttachmentBuilder('./lastoilprice.png');
                    const files = new AttachmentBuilder(Buffer.from(thaioilimg), { name: 'lastoilprice.png' });

                    let msg = new EmbedBuilder()
                        .setColor('#0099ff')
                        .setTitle('ราคาน้ำมันวัน' + desctext)
                        .setURL('https://www.bangchak.co.th/th/oilprice/historical')
                        .setDescription('ราคาน้ำมันมีการเปลี่ยนแปลงสำหรับวัน' + desctext + ' (วันที่ ' + parseInt(json[0][0].substring(0, 2)) + ' ' + convertmonthtotext(json[0][0].substring(3, 5)) + ' ' + json[0][0].substring(6, 10) + ')')
                        .setThumbnail('https://www.bangchak.co.th/glide/assets/images/defaults/opengraph.png?h=350&fit=max&fm=jpg&t=1650602255')
                        .setImage('attachment://lastoilprice.png')
                        .setTimestamp()
                        .setFooter({ text: 'ข้อมูลจาก bangchak.co.th \nบอทจัดทำโดย Phongsakorn Wisetthon \nให้ค่ากาแฟ buymeacoffee.com/boyphongsakorn' });

                    /*if (imagegood == false) {
                        msg.setImage('https://screenshot-xi.vercel.app/api?url=https://boyphongsakorn.github.io/thaioilpriceapi&width=1000&height=1000')
                    }*/

                    let messid = [];

                    for (let i = 0; i < wow.length; i++) {
                        try {
                            //if (imagegood == true) {
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
                            /*} else {
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
                            }*/
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
                        if (err) {
                            //loop messid and delete message
                            for (let i = 0; i < messid.length; i++) {
                                client.channels.cache.get(messid[i].chanelid).messages.fetch(messid[i].messid).then(msg => {
                                    msg.delete()
                                }).catch((error) => {
                                    console.log('this message not found or bot not have permission to delete this message or somebody delete this message');
                                })
                            }
                            console.log('error insert to database');
                            client.users.fetch('133439202556641280').then(dm => {
                                dm.send('Bot มีปัญหาในการเชื่อมต่อกับฐานข้อมูล เนื่องจาก ' + err)
                            });
                        } else {
                            console.log('1 record inserted');
                        }
                    });

                    //const row = new MessageActionRow()
                    const row = new ActionRowBuilder()
                        .addComponents(
                            //new MessageButton()
                            new ButtonBuilder()
                                .setCustomId('hell')
                                .setLabel('ลบ')
                                .setStyle('Danger'),
                            //new MessageButton()
                            new ButtonBuilder()
                                .setCustomId('hellandreset')
                                .setLabel('ลบและรีเซ็ต')
                                .setStyle('Danger'),
                        );

                    //send msg to user 133439202556641280
                    //if (imagegood == true) {
                    client.users.fetch('133439202556641280').then(dm => {
                        dm.send({ embeds: [msg], files: [files], components: [row] })
                            .then((log) => {
                                console.log(log);
                            })
                            .catch((error) => {
                                console.log(error);

                            });
                    });
                    /*} else {
                        client.users.fetch('133439202556641280').then(dm => {
                            dm.send({ embeds: [msg], components: [row] })
                                .then((log) => {
                                    console.log(log);
                                })
                                .catch((error) => {
                                    console.log(error);

                                });
                        });
                    }*/
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
    /*})
    .catch(err => {
        console.log(err)
    });*/
});

scheduledthaioil.start();

client.on('messageCreate', message => {
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand() && !interaction.isUserContextMenuCommand() && !interaction.isSelectMenu() && !interaction.isButton()) return;

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

        /*await fetch(process.env.URL + '/discordbot/chlist.txt')
            .then(res => res.json())
            .then(async (res) => {
                if (res.includes(interaction.channelId)) {
                    havesub = true;
                }
            })*/

        const checklist = await fetch(process.env.URL + '/discordbot/chlist.txt')
        const list = await checklist.json()
        if (list.includes(interaction.channelId)) {
            havesub = true;
        }

        if (havesub == true) {
            /*fetch(process.env.URL + '/discordbot/delchannels.php?chid=' + interaction.channelId)
                .then(res => res.text())
                .then(async (res) => {
                    if (res === 'debug') {
                        await interaction.editReply('เอ้! ไม่สามารถยกเลิกการติดตามสลากฯได้')
                    } else {
                        await interaction.editReply('ยกเลิกการติดตามสลากฯในห้องนี้เสร็จเรียบร้อย')
                    }
                }).catch(async (err) => {
                    await interaction.editReply('ไม่สามารถยกเลิกการติดตามสลากฯได้')
                });*/
            const delfromlist = await fetch(process.env.URL + '/discordbot/delchannels.php?chid=' + interaction.channelId)
            const delfromlistres = await delfromlist.text()
            const delfromliststatus = await delfromlist.status
            if (delfromliststatus === 200) {
                if (delfromlistres === 'debug') {
                    await interaction.editReply('เอ้! ไม่สามารถยกเลิกการติดตามสลากฯได้')
                } else {
                    await interaction.editReply('ยกเลิกการติดตามสลากฯในห้องนี้เสร็จเรียบร้อย')
                }
            } else {
                await interaction.editReply('ไม่สามารถยกเลิกการติดตามสลากฯได้')
            }
        } else {
            /*fetch(process.env.URL + '/discordbot/addchannels.php?chid=' + interaction.channelId)
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
                });*/
            const addtolist = await fetch(process.env.URL + '/discordbot/addchannels.php?chid=' + interaction.channelId)
            const addtolistres = await addtolist.text()
            const addtoliststatus = await addtolist.status
            if (addtoliststatus === 200) {
                if (addtolistres === 'debug') {
                    await interaction.editReply('เอ้! ไม่สามารถติดตามสลากฯได้')
                } else if (addtolistres === 'error') {
                    await interaction.editReply('เอ้! ไม่สามารถติดตามสลากฯได้')
                } else {
                    await interaction.editReply('ติดตามสลากฯในห้องนี้เสร็จเรียบร้อย')
                }
            } else {
                await interaction.editReply('ไม่สามารถติดตามสลากฯได้')
            }
        }
    }

    if (interaction.commandName === 'lastlotto') {
        //await interaction.reply('Loading!');
        await interaction.deferReply();

        const response = await fetch(lottoapi + '/lastlot?info=true');
        const data = await response.json();

        //if (fs.existsSync('./lottery_' + data.info.date + '.png') == false) {

        //await fetch(lotimgapi+'/?date=' + data.info.date)
        /*await fetch('https://screenshot-xi.vercel.app/?date=' + data.info.date)
            .then(res => res.buffer())
            .then(async (res) => {
                await fs.writeFileSync('./lottery_' + data.info.date + '.png', res)
            })
            .catch(async (err) => {
                await interaction.editReply('ไม่สามารถดึงข้อมูลล่าสุดสลากฯได้')
            });*/

        const fetchlotimg = await fetch('https://screenshot-xi.vercel.app/?date=' + data.info.date)
        const fetchlotimgres = await fetchlotimg.arrayBuffer()

        //}

        //const file = new MessageAttachment('./lottery_' + data.info.date + '.png');
        //const file = new AttachmentBuilder('./lottery_' + data.info.date + '.png');
        const file = new AttachmentBuilder(Buffer.from(fetchlotimgres), { name: 'lottery_' + data.info.date + '.png' });

        const msg = new EmbedBuilder()
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

        const response = await fetch(lottoapi + '/lastlot?info=true');
        const data = await response.json();

        const responses = await fetch(lottoapi + '/checklottery?by=' + data.info.date + '&search=' + numbertofind);
        const datas = await responses.text();

        if (datas.search("111111") != -1) {

            const msg = new EmbedBuilder()
                .setColor('#FFD700')
                .setTitle('เลขที่คุณตรวจคือ ' + numbertofind + ' ถูกรางวัลที่หนึ่ง')

            await interaction.editReply({ embeds: [msg] })
        } else if (datas.search("222222") != -1) {

            const msg = new EmbedBuilder()
                .setColor('#DAA520')
                .setTitle('เลขที่คุณตรวจคือ ' + numbertofind + ' คุณถูกรางวัลที่สอง')

            await interaction.editReply({ embeds: [msg] })
        } else if (datas.search("333333") != -1) {

            const msg = new EmbedBuilder()
                .setColor('#F0E68C')
                .setTitle('เลขที่คุณตรวจคือ ' + numbertofind + ' คุณถูกรางวัลที่สาม')

            await interaction.editReply({ embeds: [msg] })
        } else if (datas.search("444444") != -1) {

            const msg = new EmbedBuilder()
                .setColor('#EEE8AA')
                .setTitle('เลขที่คุณตรวจคือ ' + numbertofind + ' คุณถูกรางวัลที่สี่')

            await interaction.editReply({ embeds: [msg] })
        } else if (datas.search("555555") != -1) {

            const msg = new EmbedBuilder()
                .setColor('#FAFAD2')
                .setTitle('เลขที่คุณตรวจคือ ' + numbertofind + ' คุณถูกรางวัลที่ห้า')

            await interaction.editReply({ embeds: [msg] })
        } else if (datas.search("333000") != -1) {

            const msg = new EmbedBuilder()
                .setColor('#D4AF37')
                .setTitle('เลขที่คุณตรวจคือ ' + numbertofind + ' คุณถูกรางวัลเลขหน้าสามตัว')

            await interaction.editReply({ embeds: [msg] })
        } else if (datas.search("000333") != -1) {

            const msg = new EmbedBuilder()
                .setColor('#CFB53B')
                .setTitle('เลขที่คุณตรวจคือ ' + numbertofind + ' คุณถูกรางวัลเลขท้ายสามตัว')

            await interaction.editReply({ embeds: [msg] })
        } else if (datas.search("000022") != -1) {

            const msg = new EmbedBuilder()
                .setColor('#C5B358')
                .setTitle('เลขที่คุณตรวจคือ ' + numbertofind + ' คุณถูกรางวัลเลขท้ายสองตัว')

            await interaction.editReply({ embeds: [msg] })
        } else if (datas.search("111112") != -1) {

            const msg = new EmbedBuilder()
                .setColor('#FFDF00')
                .setTitle('เลขที่คุณตรวจคือ ' + numbertofind + ' คุณถูกรางวัลใกล้เคียงรางวัลที่หนึ่ง')

            await interaction.editReply({ embeds: [msg] })
        } else {

            const msg = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('เลขที่คุณตรวจคือ ' + numbertofind + ' คุณไม่ถูกรางวัล')

            await interaction.editReply({ embeds: [msg] })
        }

    }

    if (interaction.commandName === 'aithing') {
        //deferReply
        await interaction.deferReply();

        /*await fetch('https://api.apiflash.com/v1/urltoimage?access_key=fda71090a5d94be7b45fe09cb2db840c&delay=10&fresh=true&height=720&url=https%3A%2F%2Flottsanook-chitai-production.up.railway.app%2F%3Fwant%3Dtrue&width=1280')
            .then(res => res.buffer())
            .then(buffer => {
                fs.writeFileSync('./aithing.png', buffer);
            })
            .catch(err => {
                console.log(err)
            });*/

        const flashapi = await fetch('https://api.apiflash.com/v1/urltoimage?access_key=fda71090a5d94be7b45fe09cb2db840c&delay=10&fresh=true&height=720&url=https%3A%2F%2Flottsanook-chitai.vercel.app%2F%3Fwant%3Dtrue&width=1280')
        const imgapi = await flashapi.arrayBuffer()

        //const file = new MessageAttachment('./aithing.png');
        //const file = new AttachmentBuilder('./aithing.png');
        const file = new AttachmentBuilder(Buffer.from(imgapi), { name: 'aithing.png' });

        //create EmbedBuilder
        const msg = new EmbedBuilder()
            .setColor('#5454c5')
            .setTitle('เลขเด็ด')
            .setDescription('คำนวณเลขเด็ดจากข่าว โดยใช้ AI')
            //.setImage('https://api.apiflash.com/v1/urltoimage?access_key=fda71090a5d94be7b45fe09cb2db840c&delay=10&fresh=true&height=720&url=https%3A%2F%2Flottsanook-chitai-production.up.railway.app%2F%3Fwant%3Dtrue&width=1280')
            .setImage('attachment://aithing.png')
            .setTimestamp()
            .setFooter({ text: 'ข้อมูลจาก https://lottsanook-chitai.vercel.app/ai \nบอทจัดทำโดย Phongsakorn Wisetthon \nให้ค่ากาแฟ buymeacoffee.com/boyphongsakorn' });

        //edit message
        //await interaction.editReply({ embeds: [msg] })
        await interaction.editReply({ files: [file], embeds: [msg] })
    }

    if (interaction.commandName === 'lotsheet') {
        //deferReply
        await interaction.deferReply({ ephemeral: true });

        //request from https://raw.githubusercontent.com/boyphongsakorn/testrepo/main/godcombothtext to json
        let datearray = []

        /*fetch('https://raw.githubusercontent.com/boyphongsakorn/testrepo/main/godcombothtext')
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

                //const row = new MessageActionRow()
                const row = new ActionRowBuilder()
                    .addComponents(
                        //new MessageSelectMenu()
                        new SelectMenuBuilder()
                            .setCustomId('lottsheet')
                            .setPlaceholder('เลือกวันที่ต้องการ (25 งวดล่าสุด)')
                            .addOptions(datearray)
                    )

                await interaction.editReply({ content: 'ใบตรวจสลาก!', components: [row] })
            })*/

        const fetchdate = await fetch('https://raw.githubusercontent.com/boyphongsakorn/testrepo/main/godcombothtext')
        const jsondate = await fetchdate.json()
        let jsons = jsondate.slice(jsondate.length - 25, jsondate.length)
        for (let i of jsons) {
            datearray.push({
                label: String(i[1]),
                description: String(i[0]),
                value: String(i[0])
            })
        }

        console.log(datearray)

        const row = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId('lottsheet')
                    .setPlaceholder('เลือกวันที่ต้องการ (25 งวดล่าสุด)')
                    .addOptions(datearray)
            )

        await interaction.editReply({ content: 'ใบตรวจสลาก!', components: [row] })

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

                //const file = new MessageAttachment('./lotsheet_' + interaction.values[0] + '_edit.jpeg');
                const file = new AttachmentBuilder('./lotsheet_' + interaction.values[0] + '_edit.jpeg');

                //create EmbedBuilder
                const msg = new EmbedBuilder()
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
            //const file = new MessageAttachment('./docs/lotsheet_' + interaction.values[0] + '.png');
            const file = new AttachmentBuilder('./docs/lotsheet_' + interaction.values[0] + '.png');

            //create EmbedBuilder
            const msg = new EmbedBuilder()
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
        } else {
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
        /*await fetch(lottoapi + '/reto')
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
            });*/
        const fetchreto = await fetch(lottoapi + '/reto');
        const reto = await fetchreto.text();
        if (reto == 'yes') {
            //add 1 day to todayformat
            dd = parseInt(dd) + 1;
            dd = padLeadingZeros(dd, 2);
            todayformat = yyyy + '-' + mm + '-' + dd;
            console.log(todayformat);
        }
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
        /*await fetch('https://anywhere.pwisetthon.com/https://www.glo.or.th/api/lottery/getLotteryAward', reop)
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
            });*/
        const gloapifetch = await fetch('https://anywhere.pwisetthon.com/https://www.glo.or.th/api/lottery/getLotteryAward', reop);
        const gloapifetchjson = await gloapifetch.json();
        if (gloapifetchjson['status']) {
            gloapistatus = 1;
        } else {
            gloapistatus = 0;
        }
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
        let msg = new EmbedBuilder()
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

            let msg = new EmbedBuilder()
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
                //msg.addField(result[i].numberbuy + " (" + ssus + ")", datestring, true);
                msg.addFields({ name: result[i].numberbuy + " (" + ssus + ")", value: datestring, inline: true });
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
            description: 'รูปสรุปสลากกินแบ่งฯบวกกับราคาทอง (เฉพาะวันที่มีการออกผลสลากกินแบ่งฯ)',
            value: 'gold'
        }]

        //const row = new MessageActionRow()
        const row = new ActionRowBuilder()
            .addComponents(
                //new MessageSelectMenu()
                new SelectMenuBuilder()
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
        //let imagegood = false;

        /*await fetch('https://screenshot-xi.vercel.app/api?url=https://boyphongsakorn.github.io/thaioilpriceapi&width=1000&height=1000')
            .then(res => res.buffer())
            .then(async (res) => {
                await fs.writeFileSync('./lastoilprice.png', res)
                //imagegood = true;
            })
            .catch(async (err) => {
                console.log(err);
                imagegood = false;
            });*/

        //const thaioilimg = await fetch('https://screenshot-xi.vercel.app/api?url=https://boyphongsakorn.github.io/thaioilpriceapi&width=1000&height=1000')
        //const thaioil = await thaioilimg.arrayBuffer()

        let downloadscussess = false;
        let thaioil

        while (downloadscussess == false) {
            try {
                const thaioilimg = await fetch('https://screenshot-xi.vercel.app/api?url=https://boyphongsakorn.github.io/thaioilpriceapi&width=1000&height=1000');
                thaioil = await thaioilimg.arrayBuffer();
                if (Buffer.from(thaioil).length > 100000) {
                    downloadscussess = true;
                }
            } catch (err) {
                console.log(err);
            }
        }

        //check if file exist and size is not 0
        /*if (fs.existsSync('./lastoilprice.png') && fs.statSync('./lastoilprice.png').size > 0) {
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
        }*/

        //const files = new MessageAttachment('./lastoilprice.png');
        //const files = new AttachmentBuilder('./lastoilprice.png');
        const files = new AttachmentBuilder(Buffer.from(thaioil), { name: 'lastoilprice.png' });

        let msg = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('ราคาน้ำมันล่าสุด')
            .setURL('https://www.bangchak.co.th/th/oilprice/historical')
            .setDescription('ราคาน้ำมันล่าสุด จาก บางจาก')
            .setThumbnail('https://www.bangchak.co.th/glide/assets/images/defaults/opengraph.png?h=350&fit=max&fm=jpg&t=1650602255')
            //.setImage('https://topapi.pwisetthon.com/image')
            .setImage('attachment://lastoilprice.png')
            .setTimestamp()
            .setFooter({ text: 'ข้อมูลจาก bangchak.co.th \nบอทจัดทำโดย Phongsakorn Wisetthon \nให้ค่ากาแฟ buymeacoffee.com/boyphongsakorn' });

        /*if (imagegood == false) {
            msg.setImage('https://screenshot-xi.vercel.app/api?url=https://boyphongsakorn.github.io/thaioilpriceapi&width=1000&height=1000')
            await interaction.editReply({ embeds: [msg] })
        } else {*/
        await interaction.editReply({ embeds: [msg], files: [files] });
        //}
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

        /*await fetch(process.env.URL + '/discordbot/oilchlist.txt')
            .then(res => res.json())
            .then(async (res) => {
                if (res.includes(interaction.channelId)) {
                    havesub = true;
                }
            })*/

        const oillist = await fetch(process.env.URL + '/discordbot/oilchlist.txt')
        const oillistjson = await oillist.json();

        if (oillistjson.includes(interaction.channelId)) {
            havesub = true;
        }

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
                /*await fetch('https://www.whoscheat.com/_next/data/aEa5U9o6ZMklf6_tJvb9m/results.json?q=' + searchdata + '&by=phone')
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
                    });*/
                await fetch('https://www.whoscheat.com/Home/Results/?s_type=2&s_inp=' + searchdata)
                    .then(res => res.text())
                    .then(body => {
                        const $ = cheerio.load(body);
                        const result = $('h4').toArray().map(p => $(p).text());
                        //if reusult length is 1, it means no result
                        if (result.length == 1) {
                            console.log(result);
                            arrayreport[0][0] = 0;
                        } else {
                            //console.log(result);
                            //get text from id s_amount
                            const amount = $('#s_amount').text();
                            //remove space new line \n from amount
                            const amount2 = amount.replace(/(\r|\n|\r)/gm, "");
                            //remove space from amount2
                            const amount3 = amount2.replace(/\s/g, "");
                            const date = $('#s_date').text();
                            const from = $('#s_paymentmethod').text();
                            const type = $('#s_producttype').text();
                            arrayreport[0][0] = result[1];
                            arrayreport[0][1] = result[2].replace(" บาท", "");
                            arrayreport[0][2] = amount3.replace("บาท", " บาท");
                            arrayreport[0][3] = date;
                            arrayreport[0][4] = from + " " + bank;
                            arrayreport[0][5] = bank ? bank : "ไม่ระบุ";
                            arrayreport[0][6] = number ? number : "ไม่ระบุ";
                            arrayreport[0][7] = name ? name : result[0];
                            console.log("found");
                            console.log(arrayreport[0]);
                        }
                    }).catch(async (err) => {
                        //await interaction.editReply('ไม่สามารถตรวจสอบข้อมูลได้')
                    });
            } else {
                arrayreport[0][0] = 0;
            }

            if (searchdata.length == 13) {
                /*await fetch('https://www.whoscheat.com/_next/data/aEa5U9o6ZMklf6_tJvb9m/results.json?q=' + searchdata + '&by=id-number')
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
                    });*/
                await fetch('https://www.whoscheat.com/Home/Results/?s_type=3&s_inp=' + searchdata)
                    .then(res => res.text())
                    .then(body => {
                        const $ = cheerio.load(body);
                        const result = $('h4').toArray().map(p => $(p).text());
                        //if reusult length is 1, it means no result
                        if (result.length == 1) {
                            console.log(result);
                            arrayreport[1][0] = 0;
                        } else {
                            //console.log(result);
                            //get text from id s_amount
                            const amount = $('#s_amount').text();
                            //remove space new line \n from amount
                            const amount2 = amount.replace(/(\r|\n|\r)/gm, "");
                            //remove space from amount2
                            const amount3 = amount2.replace(/\s/g, "");
                            const date = $('#s_date').text();
                            const from = $('#s_paymentmethod').text();
                            const type = $('#s_producttype').text();
                            arrayreport[1][0] = result[1];
                            arrayreport[1][1] = result[2].replace(" บาท", "");
                            arrayreport[1][2] = amount3.replace("บาท", " บาท");
                            arrayreport[1][3] = date;
                            arrayreport[1][4] = from + " " + bank;
                            arrayreport[1][5] = bank ? bank : "ไม่ระบุ";
                            arrayreport[1][6] = number ? number : "ไม่ระบุ";
                            arrayreport[1][7] = name ? name : result[0];
                            console.log("found");
                            console.log(arrayreport[0]);
                        }
                    }).catch(async (err) => {
                        //await interaction.editReply('ไม่สามารถตรวจสอบข้อมูลได้')
                    });
            } else {
                arrayreport[1][0] = 0;
            }

            /*await fetch('https://www.whoscheat.com/_next/data/aEa5U9o6ZMklf6_tJvb9m/results.json?q=' + searchdata + '&by=bank-account')
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
                });*/

            await fetch('https://www.whoscheat.com/Home/Results/?s_type=1&s_inp=' + searchdata)
                .then(res => res.text())
                .then(body => {
                    const $ = cheerio.load(body);
                    const result = $('h4').toArray().map(p => $(p).text());
                    //if reusult length is 1, it means no result
                    if (result.length == 1) {
                        console.log(result);
                        arrayreport[2][0] = 0;
                    } else {
                        //console.log(result);
                        //get text from id s_amount
                        const amount = $('#s_amount').text();
                        //remove space new line \n from amount
                        const amount2 = amount.replace(/(\r|\n|\r)/gm, "");
                        //remove space from amount2
                        const amount3 = amount2.replace(/\s/g, "");
                        const date = $('#s_date').text();
                        const from = $('#s_paymentmethod').text();
                        const type = $('#s_producttype').text();
                        arrayreport[2][0] = result[1];
                        arrayreport[2][1] = result[2].replace(" บาท", "");
                        arrayreport[2][2] = amount3.replace("บาท", " บาท");
                        arrayreport[2][3] = date;
                        arrayreport[2][4] = from + " " + bank;
                        arrayreport[2][5] = bank ? bank : "ไม่ระบุ";
                        arrayreport[2][6] = number ? number : "ไม่ระบุ";
                        arrayreport[2][7] = name ? name : result[0];
                        console.log("found");
                        console.log(arrayreport[0]);
                    }
                }).catch(async (err) => {
                    //await interaction.editReply('ไม่สามารถตรวจสอบข้อมูลได้')
                });

            if (arrayreport[0][0] != 0) {
                //get arrayreport length
                let arrayreportlength = arrayreport.length;
                //change arrayreport[0][7] space to '+'
                let name = arrayreport[0][7].replace(/\s/g, '+');
                /*await fetch('https://www.whoscheat.com/_next/data/aEa5U9o6ZMklf6_tJvb9m/results.json?q=' + name + '&by=name')
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
                    });*/

                await fetch('https://www.whoscheat.com/Home/Results/?s_type=4&s_inp=' + name)
                    .then(res => res.text())
                    .then(body => {
                        const $ = cheerio.load(body);
                        const result = $('h4').toArray().map(p => $(p).text());
                        //if reusult length is 1, it means no result
                        if (result.length == 1) {
                            console.log(result);
                        } else {
                            //console.log(result);
                            //get text from id s_amount
                            const amount = $('#s_amount').text();
                            //remove space new line \n from amount
                            const amount2 = amount.replace(/(\r|\n|\r)/gm, "");
                            //remove space from amount2
                            const amount3 = amount2.replace(/\s/g, "");
                            const date = $('#s_date').text();
                            const from = $('#s_paymentmethod').text();
                            const type = $('#s_producttype').text();
                            arrayreport[arrayreportlength][0] = result[1];
                            arrayreport[arrayreportlength][1] = result[2].replace(" บาท", "");
                            arrayreport[arrayreportlength][2] = amount3.replace("บาท", " บาท");
                            arrayreport[arrayreportlength][3] = date;
                            arrayreport[arrayreportlength][4] = from + " " + bank;
                            arrayreport[arrayreportlength][5] = bank ? bank : "ไม่ระบุ";
                            arrayreport[arrayreportlength][6] = number ? number : "ไม่ระบุ";
                            arrayreport[arrayreportlength][7] = name ? name : result[0];
                            console.log("found");
                            console.log(arrayreport[0]);
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
                    /*await fetch('https://www.whoscheat.com/_next/data/aEa5U9o6ZMklf6_tJvb9m/results.json?q=' + name + '&by=name')
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
                        });*/

                    await fetch('https://www.whoscheat.com/Home/Results/?s_type=4&s_inp=' + name)
                        .then(res => res.text())
                        .then(body => {
                            const $ = cheerio.load(body);
                            const result = $('h4').toArray().map(p => $(p).text());
                            //if reusult length is 1, it means no result
                            if (result.length == 1) {
                                console.log(result);
                            } else {
                                //console.log(result);
                                //get text from id s_amount
                                const amount = $('#s_amount').text();
                                //remove space new line \n from amount
                                const amount2 = amount.replace(/(\r|\n|\r)/gm, "");
                                //remove space from amount2
                                const amount3 = amount2.replace(/\s/g, "");
                                const date = $('#s_date').text();
                                const from = $('#s_paymentmethod').text();
                                const type = $('#s_producttype').text();
                                arrayreport[arrayreportlength][0] = result[1];
                                arrayreport[arrayreportlength][1] = result[2].replace(" บาท", "");
                                arrayreport[arrayreportlength][2] = amount3.replace("บาท", " บาท");
                                arrayreport[arrayreportlength][3] = date;
                                arrayreport[arrayreportlength][4] = from + " " + bank;
                                arrayreport[arrayreportlength][5] = bank ? bank : "ไม่ระบุ";
                                arrayreport[arrayreportlength][6] = number ? number : "ไม่ระบุ";
                                arrayreport[arrayreportlength][7] = name ? name : result[0];
                                console.log("found");
                                console.log(arrayreport[0]);
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
                    /*await fetch('https://www.whoscheat.com/_next/data/aEa5U9o6ZMklf6_tJvb9m/results.json?q=' + name + '&by=name')
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
                        });*/

                    await fetch('https://www.whoscheat.com/Home/Results/?s_type=4&s_inp=' + name)
                        .then(res => res.text())
                        .then(body => {
                            const $ = cheerio.load(body);
                            const result = $('h4').toArray().map(p => $(p).text());
                            //if reusult length is 1, it means no result
                            if (result.length == 1) {
                                console.log(result);
                            } else {
                                //console.log(result);
                                //get text from id s_amount
                                const amount = $('#s_amount').text();
                                //remove space new line \n from amount
                                const amount2 = amount.replace(/(\r|\n|\r)/gm, "");
                                //remove space from amount2
                                const amount3 = amount2.replace(/\s/g, "");
                                const date = $('#s_date').text();
                                const from = $('#s_paymentmethod').text();
                                const type = $('#s_producttype').text();
                                arrayreport[arrayreportlength][0] = result[1];
                                arrayreport[arrayreportlength][1] = result[2].replace(" บาท", "");
                                arrayreport[arrayreportlength][2] = amount3.replace("บาท", " บาท");
                                arrayreport[arrayreportlength][3] = date;
                                arrayreport[arrayreportlength][4] = from + " " + bank;
                                arrayreport[arrayreportlength][5] = bank ? bank : "ไม่ระบุ";
                                arrayreport[arrayreportlength][6] = number ? number : "ไม่ระบุ";
                                arrayreport[arrayreportlength][7] = name ? name : result[0];
                                console.log("found");
                                console.log(arrayreport[0]);
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
                /*if (arrayreport[index][5] != null) {
                    waytocheat = 'โอนเงินผ่านบัญชีธนาคาร'
                } else if (arrayreport[index][6] != null) {
                    waytocheat = 'โอนเงินผ่านบัญชีพร้อมเพย์'
                } else {
                    waytocheat = 'โอนเงินผ่านบัญชีธนาคาร'
                }*/
                waytocheat = arrayreport[index][4].split(" ")[0];

                let url

                if (index == 2) {
                    url = 'https://www.whoscheat.com/results?q=' + searchdata + '&by=bank-account'
                    url = 'https://www.whoscheat.com/Home/Results/?s_type=1&s_inp=' + searchdata
                } else if (index == 1) {
                    url = 'https://www.whoscheat.com/results?q=' + searchdata + '&by=id-number'
                    url = 'https://www.whoscheat.com/Home/Results/?s_type=3&s_inp=' + searchdata
                } else {
                    url = 'https://www.whoscheat.com/results?q=' + searchdata + '&by=phone'
                    url = 'https://www.whoscheat.com/Home/Results/?s_type=2&s_inp=' + searchdata
                }

                const msg = new EmbedBuilder()
                    .setColor('#EE4B2B')
                    .setTitle('ข้อมูลการรายงานของ ' + arrayreport[index][7])
                    .setDescription('ข้อมูลการรายงานประวัติการโกงของ ' + arrayreport[index][7])
                    .setURL(url)
                    .setAuthor({ name: 'whoscheat', iconURL: 'https://www.whoscheat.com/Images/apple-touch-icon.png?v=1', url: 'https://www.whoscheat.com' })
                    //.addField('พบรายงานการโกง', 'จำนวน ' + arrayreport[index][0] + ' ครั้ง')
                    .addFields(
                        { name: 'พบรายงานการโกง', value: 'จำนวน ' + arrayreport[index][0] + ' ครั้ง' },
                    )
                    .addFields(
                        { name: 'ครั้งล่าสุด', value: arrayreport[index][3], inline: true },
                        { name: 'ช่องทาง', value: waytocheat, inline: true },
                        { name: 'รายละเอียด', value: arrayreport[index][4], inline: false },
                        { name: 'ยอดความเสียหาย', value: arrayreport[index][2] + ' บาท', inline: true }
                    )
                    .setTimestamp()
                    .setFooter({ text: 'ขอบคุณข้อมูลจาก whoscheat.com', iconURL: 'https://www.whoscheat.com/Images/apple-touch-icon.png?v=1' });

                await interaction.editReply({ embeds: [msg] });
            } else {
                await interaction.editReply('จากการตรวจสอบเบื้องต้น ไม่เคยมีประวัติการโกง')
            }

        } else {
            console.log(searchdata);
            //change space in searchdata to +
            let ogsearchdata = searchdata;
            //searchdata = searchdata.replace(/\s/g, '+');
            let twodata = [[],[]];
            //console.log(searchdata);
            //change searchdata to url encode
            //searchdata = encodeURI(searchdata);
            //console.log(searchdata);
            /*await fetch('https://www.whoscheat.com/_next/data/aEa5U9o6ZMklf6_tJvb9m/results.json?q=' + searchdata + '&by=name')
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

                        const msg = new EmbedBuilder()
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
                });*/
            await fetch('https://www.whoscheat.com/Home/Results/?s_type=4&s_inp=' + searchdata)
                .then(res => res.text())
                .then(async body => {
                    const $ = cheerio.load(body);
                    const result = $('h4').toArray().map(p => $(p).text());
                    //if reusult length is 1, it means no result
                    if (result.length == 1) {
                        //console.log(result);
                        //await interaction.editReply('จากการตรวจสอบเบื้องต้น ไม่เคยมีประวัติการโกง')
                        twodata[0] = 'nothing'
                    } else {
                        //console.log(result);
                        //get text from id s_amount
                        const amount = $('#s_amount').text();
                        //remove space new line \n from amount
                        const amount2 = amount.replace(/(\r|\n|\r)/gm, "");
                        //remove space from amount2
                        const amount3 = amount2.replace(/\s/g, "");
                        const date = $('#s_date').text();
                        const from = $('#s_paymentmethod').text();
                        const type = $('#s_producttype').text();
                        /*arrayreport[arrayreportlength][0] = result[1];
                        arrayreport[arrayreportlength][1] = result[2].replace(" บาท", "");
                        arrayreport[arrayreportlength][2] = amount3.replace("บาท", " บาท");
                        arrayreport[arrayreportlength][3] = date;
                        arrayreport[arrayreportlength][4] = from + " " + bank; 
                        arrayreport[arrayreportlength][5] = bank ? bank : "ไม่ระบุ";
                        arrayreport[arrayreportlength][6] = number ? number : "ไม่ระบุ";
                        arrayreport[arrayreportlength][7] = name ? name : result[0];
                        console.log("found");
                        console.log(arrayreport[0]);*/
                        //let name = encodeURI(searchdata);

                        twodata[0][0] = result[1]
                        twodata[0][1] = amount3.replace("บาท", "")
                        twodata[0][2] = amount3.replace("บาท", " บาท")
                        twodata[0][3] = date
                        twodata[0][4] = from
                        twodata[0][5] = type
                        twodata[0][6] = "ไม่ระบุ"
                        twodata[0][7] = ogsearchdata

                        /*const msg = new EmbedBuilder()
                            .setColor('#EE4B2B')
                            .setTitle('ข้อมูลการรายงานของ ' + ogsearchdata)
                            .setDescription('ข้อมูลการรายงานประวัติการโกงของ ' + ogsearchdata)
                            .setURL('https://www.whoscheat.com/Home/Results/?s_type=4&s_inp=' + name)
                            .setAuthor({ name: 'whoscheat', iconURL: 'https://www.whoscheat.com/Images/apple-touch-icon.png?v=1', url: 'https://www.whoscheat.com' })
                            //.addField('พบรายงานการโกง', 'จำนวน ' + res.pageProps.searchResult.totalReport + ' ครั้ง')
                            .addFields(
                                { name: 'พบรายงานการโกง', value: 'จำนวน ' + result[1] + ' ครั้ง', inline: false },
                            )
                            .addFields(
                                { name: 'ครั้งล่าสุด', value: date, inline: true },
                                { name: 'ช่องทาง', value: from, inline: true }
                            )
                            .addFields(
                                { name: 'รายละเอียด', value: from + '' + type, inline: false },
                                { name: 'ยอดความเสียหาย', value: amount3.replace("บาท", " บาท"), inline: true }
                            )
                            .setTimestamp()
                            .setFooter({ text: 'ขอบคุณข้อมูลจาก whoscheat.com', iconURL: 'https://www.whoscheat.com/Images/apple-touch-icon.png?v=1' });

                        await interaction.editReply({ embeds: [msg] });*/
                    }
                }).catch(async (err) => {
                    //await interaction.editReply('ไม่สามารถตรวจสอบข้อมูลได้')
                    twodata[0] = 'nothing'
                });

            if (searchdata.indexOf("นาย") == 0) {
                searchdata = searchdata.replace("นาย", "");
            } else if (searchdata.indexOf("นาง") == 0) {
                searchdata = searchdata.replace("นาง", "");
            } else if (searchdata.indexOf("นางสาว") == 0) {
                searchdata = searchdata.replace("นางสาว", "");
            }

            //await fetch("https://www.chaladohn.com/report/detail/" + encodeURIComponent(name))
            await fetch("https://www.chaladohn.com/report/detail/" + encodeURIComponent(searchdata))
                .then(res => res.text())
                .then(body => {
                    //console.log(body);
                    const $ = cheerio.load(body);
                    //get div text
                    const result = $('div').toArray();
                    //check all result if result have word ข้อมูลนี้พบเรื่องร้องเรียน console.log("found")
                    let found = false;
                    for (let i = 0; i < result.length; i++) {
                        if (result[i].children[0].data.indexOf("ข้อมูลนี้พบเรื่องร้องเรียน") != -1) {
                            console.log("found");
                            found = true;
                        }
                    }
                    //if found is false
                    if (found == false) {
                        twodata[1] = 'nothing'
                    }
                    //get text from div with class col-4
                    const result2 = $('.col-4').toArray().map(p => $(p).text());
                    //console log all result2 text
                    for (let i = 0; i < result2.length; i++) {
                        //console.log('--');
                        //console.log(result2[i]);
                        //if result2[i] have word รายงานการร้องเรียนที่นับได้ console log that
                        if (result2[i].indexOf("รายงานการร้องเรียนที่นับได้") != -1) {
                            console.log("found");
                            //console.log(result2[i]);
                            //remove word การร้องเรียน but remove last word
                            const result3 = result2[i].replace("รายงานการร้องเรียนที่นับได้", "");
                            //remove space from result3
                            const result4 = result3.replace(/\s/g, "");
                            twodata[1][0] = result4
                            twodata[1][1] = "กดปุ่มข้างล่างเพื่อดูรายละเอียด"
                            twodata[1][2] = "กดปุ่มข้างล่างเพื่อดูรายละเอียด"
                            twodata[1][3] = "กดปุ่มข้างล่างเพื่อดูรายละเอียด"
                            twodata[1][4] = "กดปุ่มข้างล่างเพื่อดูรายละเอียด"
                            twodata[1][5] = "กดปุ่มข้างล่างเพื่อดูรายละเอียด"
                            twodata[1][6] = "กดปุ่มข้างล่างเพื่อดูรายละเอียด"
                            twodata[1][7] = ogsearchdata
                            const result5 = result4.replace("การร้องเรียน", "รายงานการร้องเรียนที่นับได้ ");
                            console.log(result5);
                            //get all a tag
                            const result6 = $('a').toArray();
                            //log all href from a tag
                            console.log(result6.length);
                            for (let i = 0; i < result6.length; i++) {
                                //console.log(result6[i].attribs.href);
                                //if href have google.com log that
                                if (result6[i].attribs.href.indexOf("google.com") != -1) {
                                    console.log("found");
                                    console.log(result6[i].attribs.href);
                                    twodata[1][4] = result6[i].attribs.href
                                }
                            }
                        }
                    }
                });

            console.log(twodata);
            if (twodata[0] != 'nothing' && twodata[0].length > 0) {
                const msg = new EmbedBuilder()
                    .setColor('#EE4B2B')
                    .setTitle('ข้อมูลการรายงานของ ' + twodata[0][7])
                    .setDescription('ข้อมูลการรายงานประวัติการโกงของ ' + twodata[0][7])
                    .setURL('https://www.whoscheat.com/Home/Results/?s_type=4&s_inp=' + twodata[0][7])
                    .setAuthor({ name: 'whoscheat', iconURL: 'https://www.whoscheat.com/Images/apple-touch-icon.png?v=1', url: 'https://www.whoscheat.com' })
                    //.addField('พบรายงานการโกง', 'จำนวน ' + res.pageProps.searchResult.totalReport + ' ครั้ง')
                    .addFields(
                        { name: 'พบรายงานการโกง', value: 'จำนวน ' + twodata[0][0] + ' ครั้ง', inline: false },
                    )
                    .addFields(
                        { name: 'ครั้งล่าสุด', value: twodata[0][3], inline: true },
                        { name: 'ช่องทาง', value: twodata[0][4], inline: true }
                    )
                    .addFields(
                        { name: 'รายละเอียด', value: twodata[0][4] + '' + twodata[0][5], inline: false },
                        { name: 'ยอดความเสียหาย', value: twodata[0][2], inline: true }
                    )
                    .setTimestamp()
                    .setFooter({ text: 'ขอบคุณข้อมูลจาก whoscheat.com', iconURL: 'https://www.whoscheat.com/Images/apple-touch-icon.png?v=1' });

                await interaction.editReply({ embeds: [msg] });
            } else if (twodata[1] != 'nothing' && twodata[1].length > 0) {
                const msg = new EmbedBuilder()
                    .setColor('#EE4B2B')
                    .setTitle('ข้อมูลการรายงานของ ' + twodata[1][7])
                    .setDescription('ข้อมูลการรายงานประวัติการโกงของ ' + twodata[1][7])
                    .setURL('https://www.chaladohn.com/report/detail/' + encodeURIComponent(twodata[1][7]))
                    .setAuthor({ name: 'chaladohn', iconURL: 'https://www.chaladohn.com/public/images/web/logo_meta.png', url: 'https://www.chaladohn.com' })
                    //.addField('พบรายงานการโกง', 'จำนวน ' + res.pageProps.searchResult.totalReport + ' ครั้ง')
                    .addFields(
                        { name: 'พบรายงานการโกง', value: 'จำนวน ' + twodata[1][0], inline: false },
                    )
                    .addFields(
                        { name: 'ครั้งล่าสุด', value: twodata[1][3], inline: true },
                        //{ name: 'ช่องทาง', value: twodata[1][4], inline: true }
                        { name: 'ช่องทาง', value: 'ไม่ทราบแน่ชัด', inline: true}
                    )
                    .addFields(
                        { name: 'รายละเอียด', value: 'กดปุ่มข้างล่างเพื่อดูรายละเอียด', inline: false },
                        { name: 'ยอดความเสียหาย', value: twodata[1][2], inline: true }
                    )
                    .setTimestamp()
                    .setFooter({ text: 'ขอบคุณข้อมูลจาก chaladohn.com', iconURL: 'https://www.chaladohn.com/public/images/web/logo_meta.png' });

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel('ดูรายละเอียด')
                            .setStyle('Link')
                            //.setURL('https://www.chaladohn.com/report/detail/' + encodeURIComponent(twodata[1][7]))
                            .setURL(encodeURI(twodata[1][4]))
                    );

                await interaction.editReply({ embeds: [msg], components: [row] });
            } else {
                await interaction.editReply('ไม่เคยมีประวัติการโกง');
            }
        }

        //await interaction.editReply('เปิดใช้งาน เร็วๆนี้...');
    }

    if (interaction.customId === 'hellandreset' || interaction.customId === 'hell') {
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
            if (result.length > 0) {
                //convert result[0].messid from json text to json object
                let messid = JSON.parse(result[0].messid);
                //loop messid
                for (let i = 0; i < messid.length; i++) {
                    //delete message by messid and chanelid
                    try {
                        //client.channels.cache.get(messid[i].chanelid).messages.cache.get(messid[i].messid).delete();
                        client.channels.cache.get(messid[i].chanelid).messages.fetch(messid[i].messid).then(message => message.delete()).catch(console.log);
                        //client.channels.cache.get(messid[i].chanelid).fetchMessage(messid[i].messid).then(msg => msg.delete());
                        console.log('delete message ' + messid[i].messid + ' in ' + messid[i].chanelid + ' success');
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
        })

        await interaction.editReply('กำลังล้างข้อมูล...');

        if (interaction.customId === 'hellandreset') {
            /*await fetch('https://topapi.pwisetthon.com')
                .then(res => res.json())
                .then(async (res) => {
                    let resetsql = 'DELETE FROM oilprice WHERE date = "' + res[0][0] + '"';
                    con.query(resetsql, function (err, result) {
                        if (err) throw err;
                        console.log("Number of records deleted: " + result.affectedRows);
                    });
                    //spilt res[0][0] to get date by /
                    let date = res[0][0].split('/');
                    let datenumber = parseInt(date[0]) - 1;
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
                })*/
            const topapifetch = await fetch('https://topapi.pwisetthon.com');
            const topapijson = await topapifetch.json();
            let resetsql = 'DELETE FROM oilprice WHERE date = "' + topapijson[0][0] + '"';
            con.query(resetsql, function (err, result) {
                if (err) throw err;
                console.log("Number of records deleted: " + result.affectedRows);
            });
            //spilt res[0][0] to get date by /
            let date = topapijson[0][0].split('/');
            let datenumber = parseInt(date[0]) - 1;
            let datemonth = parseInt(date[1]);
            let dateyear = date[2];
            //convert datenumber datemonth dateyear-543 to date
            let newoildate = new Date(dateyear - 543, datemonth - 1, datenumber+1);
            //minus 1 day
            newoildate.setDate(newoildate.getDate() - 1);
            let newdate = datenumber + '/' + datemonth + '/' + dateyear;
            newdate = newoildate.getDate() + '/' + (newoildate.getMonth() + 1) + '/' + (newoildate.getFullYear() + 543);
            resetsql = 'DELETE FROM hell WHERE date = "' + newdate + '"';
            con.query(resetsql, function (err, result) {
                if (err) throw err;
                console.log("Number of records deleted: " + result.affectedRows);
            })
            await interaction.editReply('ล้างข้อมูลเรียบร้อย');
        }

    }
});

client.login(process.env.BOT_TOKEN);
