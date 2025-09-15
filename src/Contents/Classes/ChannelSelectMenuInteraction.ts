import * as Discord from 'discord.js'
import Client from './MyClient.js'

export default class ChannelSelectMenuInteraction {
    public id: string
    public execute: (
        interaction: Discord.ChannelSelectMenuInteraction,
        client: Client
    ) => Promise<void> | void

    public constructor(options: ChannelSelectMenuInteraction) {
        this.id = options.id
        this.execute = options.execute
    }
}
