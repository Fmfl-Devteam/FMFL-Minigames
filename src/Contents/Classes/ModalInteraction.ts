import * as Discord from 'discord.js'
import Client from './MyClient.js'

export default class ModalInteraction {
    public customId: string
    public execute: (
        interaction: Discord.ModalSubmitInteraction,
        client: Client
    ) => MaybePromise<void>

    public constructor(options: ModalInteraction) {
        this.customId = options.customId
        this.execute = options.execute
    }
}
