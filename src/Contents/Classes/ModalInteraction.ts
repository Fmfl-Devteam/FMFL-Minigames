import * as Discord from 'discord.js'
import Client from './MyClient.js'

export default class ModalInteraction {
    public id: string
    public execute: (
        interaction: Discord.ModalSubmitInteraction,
        client: Client
    ) => MaybePromise<void>

    public constructor(options: ModalInteraction) {
        this.id = options.id
        this.execute = options.execute
    }
}
