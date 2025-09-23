import * as Discord from 'discord.js'
import Client from './MyClient.js'

export default class ChannelSelectMenuInteraction {
    public customId: string
    public execute: (
        interaction: Discord.ChannelSelectMenuInteraction,
        client: Client
    ) => MaybePromise<void>

    public constructor(options: ChannelSelectMenuInteraction) {
        this.customId = options.customId
        this.execute = options.execute
    }
}
