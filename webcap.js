const Pageres = require('pageres');

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

var http = require('http');
var fs = require('fs');

http.createServer(function (req, res) {
    (async () => {
        await new Pageres({delay: 5,filename: "<%= date %>",launchOptions: {args: ['--no-sandbox', '--disable-setuid-sandbox']}})
            .src('https://lottsanook.herokuapp.com/viewlot.php', ['1600x1066'])
            .dest(__dirname)
            .run();
    
        console.log('Finished generating screenshots!');
        res.writeHead(200,{'content-type':'image/png'});
        fs.createReadStream(year+'-'+month+'-'+date+'.png').pipe(res);
    })();
}).listen(process.env.PORT);