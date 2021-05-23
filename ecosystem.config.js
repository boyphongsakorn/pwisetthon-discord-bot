module.exports = {
  apps : [{
    name : 'discordbot',
    script: 'bot.js',
    watch: true
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