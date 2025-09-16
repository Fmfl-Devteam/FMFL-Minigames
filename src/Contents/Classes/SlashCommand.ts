import * as Discord from 'discord.js'
import Client from './MyClient'
export type TCommandBuilder =
    | Discord.SlashCommandBuilder
    | Discord.SlashCommandOptionsOnlyBuilder
    | Discord.SlashCommandSubcommandsOnlyBuilder

export class SlashCommand {
    public data: TCommandBuilder
    public execute: (
        interaction: Discord.ChatInputCommandInteraction,
        client: Client
    ) => MaybePromise<void>

    public constructor(options: SlashCommand) {
        this.data = options.data
        this.execute = options.execute
    }
}
