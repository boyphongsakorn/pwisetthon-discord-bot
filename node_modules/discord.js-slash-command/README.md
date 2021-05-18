# discord.js-slash-command
Slash command extension for Discord.js

# Example Usage
```js
const Discord = require("discord.js");
const DiscordSlash = require("discord.js-slash-command");

const client = new Discord.Client();
const slash = new DiscordSlash.Slash(client);

client.on("ready", () => {
    // Creating command
    let mainCommand = new DiscordSlash.CommandBuilder();
    let subCommand1 = new DiscordSlash.CommandBuilder();
    let subCommand2 = new DiscordSlash.CommandBuilder();
    let subSubCommand = new DiscordSlash.CommandBuilder(); 

    // Setting command name
    mainCommand.setName("exampleCommand");
    // Setting command description
    mainCommand.setDescription("exampleCommand Description");
    
    subCommand1.setName("subCommand1");
    subCommand1.setDescription("subCommand1 Description");
    // Setting type
    subCommand1.setType(DiscordSlash.CommandType.STRING); //You can also use the plain command type ex: setType(3)

    // Adding Choices
    subCommand1.addChoice("choiceName", "choiceValue");
    // Setting if the subcommand is required or not, default: false
    subCommand1.setRequired(true);

    subCommand2.setName("subCommand2");
    subCommand2.setDescription("subCommand2 Description");
    subCommand2.setType(DiscordSlash.CommandType.SUB_COMMAND);
    
    subSubCommand.setName("subSubCommand");
    subSubCommand.setDescription("subSubCommand Description");
    subSubCommand.setType(DiscordSlash.CommandType.BOOLEAN);
    subSubCommand.setRequired(false);

    // Adding Sub-Command to Option
    subCommand2.addOption(subSubCommand);
    mainCommand.addOption(subCommand1);
    // mainCommand.addOption(subCommand2) 

    // Creating the command
    slash.create(mainCommand /* optional: Guild ID */).then((res) => {
        console.log(res);
    })

    // Updating Command
    let updateCommand = new DiscordSlash.CommandBuilder();

    updateCommand.setDescription("Updated Command Description");

    slash.update("Command ID", updateCommand /* optional: Guild ID */).then((res) => {
        console.log(res);
    });

    // Getting Commands
    slash.get(/* optional: Command ID , optional: Guild ID */).then((res) => {
        console.log(res);
    })

    // Deleting Command
    slash.delete("Command ID" /* optional: Guild ID */);
});

// Command Interaction
slash.on("slashInteraction", (interaction) => {
    console.log(interaction)
    interaction.callback("put embed or plain text");
    interaction.channel.send("you can also send message to the channel");
})
```

# Examples
## Creating command in specific guild
```js
let cmd = new DiscordSlash.CommandBuilder();
cmd.setName("exCmdGuild");
cmd.setDescription("exCmdGuild Desc");
slash.create(cmd, "832661859xxxx" /* Guild ID */);
```
## Updating command in specific guild
```js
let cmd = new DiscordSlash.CommandBuilder();
cmd.setName("exCmdGuild-Updated");
cmd.setDescription("exCmdGuild Desc Updated");
slash.update("832661859xxxx" /* Command ID */, cmd, "832661859xxxx" /* Guild ID */);
```
## Deleting all command
```js
slash.get().then((res)=>{
    res.forEach((obj)=>{
        slash.delete(obj.id);
    });
});
```
## Handling Commands
```js
slash.on("slashInteraction", (interaction) => {
    switch (interaction.command.name) {
        case "start":
            interaction.callback("Starting activities");
            break;
        case "lang":
            interaction.callback("Setting Lang");
            break;
        default:
    }
});
```
## Handling Choices
```js
slash.on("slashInteraction", (interaction) => {
    switch (interaction.command.options[0].value) {
        case "start":
            interaction.callback("Starting activities");
            break;
        case "lang":
            interaction.callback("Setting Lang");
            break;
        default:
    }
});
```

Have a question? 
email me at [mradhit@adhdev.xyz](mailto:mradhit.adhdev.xyz)