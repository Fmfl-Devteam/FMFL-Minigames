import { GatewayIntentBits } from 'discord.js'
import { readdirSync } from 'fs'
import Logger from './Contents/Classes/Logger'
import MyClient from './Contents/Classes/MyClient'
import { SlashCommand } from './Contents/Classes/SlashCommand'
import path = require('path')
let root = process.argv[0].endsWith('.js') ? 'dist' : 'src'
const client = new MyClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})
const commandFolders = readdirSync(path.join(root, 'Commands'))

;(async () => {
    for (const subFolder of commandFolders) {
        const commandFiles = readdirSync(path.join(root, 'Commands', subFolder))
        for (const file of commandFiles) {
            const command: SlashCommand = await import(path.join(root, 'Commands', subFolder, file))
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
