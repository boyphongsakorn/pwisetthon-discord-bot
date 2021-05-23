const Pageres = require('pageres');
const fetch = require('node-fetch');
var http = require('http');
var fs = require('fs');

require('dotenv').config();

function padLeadingZeros(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

let date = new Date().getDate();
let month = new Date().getMonth()+1;
let year = new Date().getFullYear();

date = padLeadingZeros(date, 2);
month = padLeadingZeros(month, 2);

http.createServer(function (req, res) {
    (async () => {
        try {
            if (fs.existsSync(year+'-'+month+'-'+date+'.png')) {
                fs.unlinkSync(year+'-'+month+'-'+date+'.png')
            }
            //file removed
        } catch(err) {
            console.error(err)
        }

        await new Pageres({filename: "<%= date %>",launchOptions: {args: ['--no-sandbox','--disable-setuid-sandbox','--no-first-run','--disable-extensions'], executablePath: '/usr/bin/chromium-browser'}})
            .src('https://lottsanook.vercel.app/api/viewlot.php', ['1600x1066'])
            .dest(__dirname)
            .run();
            
        console.log('Finished generating screenshots!');
        res.writeHead(200,{'content-type':'image/png'});
        fs.createReadStream(year+'-'+month+'-'+date+'.png').pipe(res);
    })();
}).listen(process.env.PORT);