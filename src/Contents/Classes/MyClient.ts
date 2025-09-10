import { Client, ClientOptions, Collection } from 'discord.js'
import Button from './Button'
import ChannelSelectMenuInteraction from './ChannelSelectMenuInteraction'
import Logger from './Logger'
import ModalInteraction from './ModalInteraction'
import { SlashCommand } from './SlashCommand'

export default class MyClient extends Client {
    public logger: Logger
    public slashCommands: Collection<string, SlashCommand> = new Collection()
    public buttons: Collection<string, Button> = new Collection()
    public channelSelectMenus: Collection<string, ChannelSelectMenuInteraction> = new Collection()
    public modals: Collection<string, ModalInteraction> = new Collection()

    public constructor(clientOptions: ClientOptions) {
        super(clientOptions)
    }
}
