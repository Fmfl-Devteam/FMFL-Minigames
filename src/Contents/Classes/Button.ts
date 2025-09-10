import { ButtonInteraction } from 'discord.js'
import Client from './MyClient.js'

export default class Button {
    public id: string
    public execute: (interaction: ButtonInteraction, client: Client) => Promise<void> | void

    public constructor(options: Button) {
        this.id = options.id
        this.execute = options.execute
    }
}
