"use strict";

class CommandBuilder {
    constructor(){
        
    }

    /**
     * 
     * @param {string} name Command Name
     * @returns Object
     */
    setName(name){
        this.name = name;
        return this;
    }

    /**
     * 
     * @param {string} description Command Description
     * @returns Object
     */
    setDescription(description){
        this.description = description;
        return this;
    }

    /**
     * whether the command is enabled by default when the app is added to a guild
     * Only applies to main command
     * @param {boolean} isDefault 
     * @returns Object
     */
    setDefault(isDefault){
        this.default = isDefault;
        return this;
    }

    /**
     * if the parameter is required or optional
     * Only applies to option
     * @param {boolean} isRequired 
     * @returns Object
     */
    setRequired(isRequired){
        this.required = isRequired;
        return this;
    }

    /**
     * 
     * @param {Command} command Command object
     * @returns Object
     */
    addOption(command){
        this.options = ((this.options == undefined) ? [] : this.options);
        this.options.push(command);
        return this;
    }

    /**
     * Only applies to options
     * @param {integer} type Parameter type id
     * @returns Object
     */
    setType(type){
        this.type = type;
        return this;
    }

    /**
     * 
     * @param {string} name Choice Name
     * @param {string} value Choice Value
     * @returns Object
     */
    addChoice(name, value){
        this.choices = ((this.choices == undefined) ? [] : this.choices)
        this.choices.push({name: name, value: value});
        return this
    }
}

module.exports = CommandBuilder;