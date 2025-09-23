import { GatewayIntentBits } from 'discord.js'
import { readdirSync } from 'fs'
import Logger from './Contents/Classes/Logger'
import MyClient from './Contents/Classes/MyClient'
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
const channelSelectFolders = readdirSync(path.join(root, 'ChannelSelects'))
const buttonFolders = readdirSync(path.join(root, 'Buttons'))
const modalFolders = readdirSync(path.join(root, 'Modals'))

;(async () => {
    await client.loadCommands(commandFolders, root)
    await client.loadEvents(eventFolders, root)
    await client.loadChannelSelectMenus(channelSelectFolders, root)
    await client.loadButtons(buttonFolders, root)
    await client.loadModals(modalFolders, root)
})().catch((err) => {
    Logger.error('Loaders', `Failed to load components: ${err}`)
    process.exit(1)
})

client.login(process.env.TOKEN).catch((err) => {
    Logger.error('Client', `Failed to log in: ${err}`)
    process.exit(1)
})
