export const version: string;

export interface CommandOptions {
    guildOnly?: boolean;
    guildID?: string;
    data: {
        name: string;
        description?: string;
        type?: number;
        content: string;
    };
}
export interface getCommandsType {
    id: string;
    application_id: string;
    description: string;
}

export class Slash {
    public client: any;
    public axios: any;

    public constructor(client: any);

    public command(options: CommandOptions): Slash;

    public getCommands(): getCommandsType[];

    public deleteCommand(options: { id: string; guildID?: string });
}
