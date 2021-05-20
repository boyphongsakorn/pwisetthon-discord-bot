const Pageres = require('pageres');
const fetch = require('node-fetch');
var http = require('http');
var fs = require('fs');

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
    let url = "https://lottsanook.vercel.app/api/?date="+date+""+month+""+year;

    let settings = { method: "Get" };

    fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        if(json[0][1] == "0" || json[0][1] == 0 || json[0][1] == "XXXXXX"){
            (async () => {
                await new Pageres({filename: "<%= date %>",launchOptions: {args: ['--no-sandbox','--disable-setuid-sandbox','--no-first-run']}})
                    .src('https://lottsanook.vercel.app/api/viewlot.php', ['1600x1066'])
                    .dest(__dirname)
                    .run();
            
                console.log('Finished generating screenshots!');
                res.writeHead(200,{'content-type':'image/png'});
                fs.createReadStream(year+'-'+month+'-'+date+'.png').pipe(res);
            })();
        }else{
            console.log('right now can\'t screenshots!');
            res.writeHead(200,{'content-type':'image/png'});
            fs.createReadStream(year+'-'+month+'-'+date+'.png').pipe(res);
        }
    });
}).listen(process.env.PORT);