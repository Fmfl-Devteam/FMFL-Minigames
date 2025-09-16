import { ClientEvents } from 'discord.js'
import Client from './MyClient.js'
export default class EventHandler<E extends keyof ClientEvents> {
    public eventName: E
    public execute: (client: Client, ...args: ClientEvents[E]) => MaybePromise<void>

    public constructor(options: EventHandler<E>) {
        this.eventName = options.eventName
        this.execute = options.execute
    }
}
