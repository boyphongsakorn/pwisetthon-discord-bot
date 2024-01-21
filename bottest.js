const { MessageAttachment, EmbedBuilder, Client, GatewayIntentBits, ButtonBuilder, SelectMenuBuilder, ActionRowBuilder, ClientUser, AttachmentBuilder, ChannelType } = require('discord.js');
const cron = require("cron");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.once('ready', async () => {
    client.users.fetch('133439202556641280').then(dm => {
        dm.send('Test Bot เริ่มต้นการทำงานแล้ว')
    });
    console.log('I am ready!');

    //get guild from id 908708400379097181
    const guild = client.guilds.cache.get('908708400379097181');
    //if have gaming category remove it
    const gamingCategory = guild.channels.cache.find(channel => channel.name === 'Gaming');
    if (gamingCategory) {
        gamingCategory.delete();
    }
    guild.channels.create({ name: 'Gaming', type: ChannelType.GuildCategory, position: 99}).then(category => {
        console.log(category);
        //create text channel in gaming category
        guild.channels.create({ name: 'Among Us', type: ChannelType.GuildText, parent: category.id});
    });
});

client.login('NjkxNjEwNTU3MTU2OTUwMDMw.Xniehg.azxDEeTB3mzxqyvY1v-IG-5FFcs');