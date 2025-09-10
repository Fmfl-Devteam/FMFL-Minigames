import { ClientEvents } from 'discord.js'
import MyClient from '../Classes/MyClient'

export default interface IEventHandler {
    eventName: keyof ClientEvents
    execute: (client: MyClient, ...args: unknown[]) => Promise<void> | void
}
