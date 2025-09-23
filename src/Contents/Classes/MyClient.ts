import { Client, ClientOptions, Collection } from 'discord.js'
import { readdirSync } from 'fs'
import { PoolConfig } from 'mariadb/*'
import Button from './Button'
import ChannelSelectMenuInteraction from './ChannelSelectMenuInteraction'
import DatabaseController from './DatabaseController'
import Logger from './Logger'
import ModalInteraction from './ModalInteraction'
import { SlashCommand } from './SlashCommand'
import path = require('path')

export default class MyClient extends Client {
    public slashCommands: Collection<string, SlashCommand> = new Collection()
    public buttons: Collection<string, Button> = new Collection()
    public channelSelectMenus: Collection<string, ChannelSelectMenuInteraction> = new Collection()
    public modals: Collection<string, ModalInteraction> = new Collection()
    public channelSelects: Collection<string, ChannelSelectMenuInteraction> = new Collection()
    public activeServices: Collection<string, boolean> = new Collection()
    db: DatabaseController

    public constructor(options: { clientOptions: ClientOptions; dbConfig: PoolConfig }) {
        super(options.clientOptions)
        this.db = new DatabaseController(options.dbConfig)
        this.activeServices.set('countingClear', false)
    }

    public async loadCommands(commandFolders: string[], root: string) {
        for (const subFolder of commandFolders) {
            const commandFiles = readdirSync(path.join(root, 'Commands', subFolder))
            for (const file of commandFiles) {
                const command: SlashCommand = (await import(`../../Commands/${subFolder}/${file}`))
                    .default
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
                    this.slashCommands.set(command.data.name, command)
                }
            }
        }
    }

    public async loadEvents(eventFolders: string[], root: string) {
        for (const folder of eventFolders) {
            const eventFiles = readdirSync(path.join(root, 'Events', folder))
            for (const file of eventFiles) {
                const event = (await import(`../../Events/${folder}/${file}`)).default
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
                    this.on(event.eventName, (...args) => event.execute(this, ...args))
                }
            }
        }
    }

    public async loadChannelSelectMenus(channelSelectFolders: string[], root: string) {
        for (const folder of channelSelectFolders) {
            const channelSelectFiles = readdirSync(path.join(root, 'ChannelSelects', folder))
            for (const file of channelSelectFiles) {
                const channelSelect: ChannelSelectMenuInteraction = (
                    await import(`../../ChannelSelects/${folder}/${file}`)
                ).default
                if (!channelSelect || !channelSelect.customId || !channelSelect.execute) {
                    Logger.warn(
                        'Channel Select Loader',
                        `Channel Select from ${file} is missing at least one of the following properties, so skipped: customcustomId | execute`
                    )
                    continue
                } else {
                    Logger.info(
                        'Channel Select Loader',
                        `Channel Select with custom customId ${channelSelect.customId} from ${file} loaded!`
                    )
                    this.channelSelects.set(channelSelect.customId, channelSelect)
                }
            }
        }
    }

    public async loadButtons(buttonFolders: string[], root: string) {
        for (const folder of buttonFolders) {
            const buttonFiles = readdirSync(path.join(root, 'Buttons', folder))
            for (const file of buttonFiles) {
                const button: Button = (await import(`../../Buttons/${folder}/${file}`)).default
                if (!button || !button.customId || !button.execute) {
                    Logger.warn(
                        'Button Loader',
                        `Button from ${file} is missing at least one of the following properties, so skipped: customcustomId | execute`
                    )
                    continue
                } else {
                    Logger.info(
                        'Button Loader',
                        `Button with custom customId ${button.customId} from ${file} loaded!`
                    )
                    this.buttons.set(button.customId, button)
                }
            }
        }
    }

    public async loadModals(modalFolders: string[], root: string) {
        for (const folder of modalFolders) {
            const modalFiles = readdirSync(path.join(root, 'Modals', folder))
            for (const file of modalFiles) {
                const modal: ModalInteraction = (await import(`../../Modals/${folder}/${file}`))
                    .default
                if (!modal || !modal.customId || !modal.execute) {
                    Logger.warn(
                        'Modal Loader',
                        `Modal from ${file} is missing at least one of the following properties, so skipped: customcustomId | execute`
                    )
                    continue
                } else {
                    Logger.info(
                        'Modal Loader',
                        `Modal with custom customId ${modal.customId} from ${file} loaded!`
                    )
                    this.modals.set(modal.customId, modal)
                }
            }
        }
    }
}
