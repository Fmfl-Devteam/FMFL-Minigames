import { Client, ClientOptions, Collection } from 'discord.js'
import { PoolConfig } from 'mariadb/*'
import Button from './Button'
import ChannelSelectMenuInteraction from './ChannelSelectMenuInteraction'
import DatabaseController from './DatabaseController'
import ModalInteraction from './ModalInteraction'
import { SlashCommand } from './SlashCommand'

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
}
