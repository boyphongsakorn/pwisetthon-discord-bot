declare module "discord.js-slash-command" {
    import { Client } from "discord.js";

    export class Slash {
        constructor(client: Client);
        public on<K extends keyof InteractionEvents>(event: K, listener: (...args: InteractionEvent[K]) => void): this;
        public on<S extends string | symbol>(
        event: Exclude<S, keyof InteractionEvents>,
        listener: (...args: any[]) => void,
        ): this;
        public get(commandid?: string, guildid?: string);
        public update(commandId: string, commandObject: object, guildId?: string);
        public create(commandObject: object, guildId?: string);
        public delete(commandId: string, guildId?: string);
    }

    export class CommandBuilder {
        constructor();
        public setName(name: string);
        public setDescription(description: string);
        public setDefault(isDefault: boolean);
        public setRequired(isRequired: boolean);
        public setType(type: number);
        public addOption(command: CommandBuilder);
        public addChoice(name: string, value: string);
    }

    interface InteractionEvents {
        slashInteraction: object
    }
}