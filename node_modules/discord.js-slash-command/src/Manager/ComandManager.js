"use strict";

class CommandManager {

    /**
     * 
     * @param {Object} command Command Object
     * @returns Object
     */
    constructor(command){
        this.id = command.id;
        this.name = command.name;
        this.description = (command.description != undefined) ? command.description : null;
        this.options = (command.options != undefined) ? command.options : null;
        return this;
    }
}

module.exports = CommandManager;