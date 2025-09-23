import { ButtonInteraction } from 'discord.js'
import Client from './MyClient.js'

export default class Button {
    public customId: string
    public execute: (interaction: ButtonInteraction, client: Client) => MaybePromise<void>

    public constructor(options: Button) {
        this.customId = options.customId
        this.execute = options.execute
    }
}
