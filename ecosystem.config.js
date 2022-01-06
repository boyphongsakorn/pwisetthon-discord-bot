module.exports = {
  apps : [{
    name : 'discordbot',
    script: 'bot.js',
    log_date_format: 'DD/MM/YYYY HH:mm Z',
    error_file : "./err.log",
    out_file : "./out.log",
    ignore_watch: ["node_modules","err.log",".env","Procfile","out.log","./check.txt","lastlot.txt"],
    autorestart: true,
    //cron_restart: "30 14 * * *",
    max_memory_restart: '60M'
  }],
  deploy : {
    production : {
      user : 'pi',
      host : 'raspberrypi',
      ref  : 'origin/master',
      repo : 'git@github.com:boyphongsakorn/pwisetthon-discord-bot.git',
      path : '.',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
