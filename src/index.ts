import { GatewayIntentBits } from 'discord.js'
import { readdirSync } from 'fs'
import Logger from './Contents/Classes/Logger'
import MyClient from './Contents/Classes/MyClient'
import { SlashCommand } from './Contents/Classes/SlashCommand'
import path = require('path')
let root = process.argv[0].endsWith('.js') ? 'dist' : 'src'
process.loadEnvFile('.env')
const client = new MyClient({
    clientOptions: {
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
        ]
    },
    dbConfig: {
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT) || 3306,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME
    }
})
const commandFolders = readdirSync(path.join(root, 'Commands'))
const eventFolders = readdirSync(path.join(root, 'Events'))

;(async () => {
    for (const subFolder of commandFolders) {
        const commandFiles = readdirSync(path.join(root, 'Commands', subFolder))
        for (const file of commandFiles) {
            const command: SlashCommand = await import(path.join('./Commands', subFolder, file))
            if (
                !command.data ||
                !command.data.name ||
                !command.data.description ||
                !command.execute
            ) {
                Logger.warn(
                    'Command Loader',
                    `Command from ${file} is missing at least one of the following properties, so skipped: data | data.name | data.description | execute`
                )
                continue
            } else {
                Logger.info('Command Loader', `Command with name ${command.data.name} loaded!`)
                client.slashCommands.set(command.data.name, command)
            }
        }
    }
})()
;async () => {
    for (const folder of eventFolders) {
        const eventFiles = readdirSync(path.join(root, 'Events', folder))
        for (const file of eventFiles) {
            const event = await import(path.join('./Events', folder, file))
            if (!event || !event.eventName || !event.execute) {
                Logger.warn(
                    'Event Loader',
                    `Event from ${file} is missing at least one of the following properties, so skipped: eventName | execute`
                )
                continue
            } else {
                Logger.info(
                    'Event Loader',
                    `Event with name ${event.eventName} from ${file} loaded!`
                )
                client.on(event.eventName, (...args) => event.execute(client, ...args))
            }
        }
    }
}
