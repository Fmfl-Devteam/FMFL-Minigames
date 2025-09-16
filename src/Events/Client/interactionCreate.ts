import { ComponentType } from 'discord.js'
import Container from '../../Contents/Classes/Container'
import EventHandler from '../../Contents/Classes/EventHandler'
import Logger from '../../Contents/Classes/Logger'

export default new EventHandler({
    eventName: 'interactionCreate',
    async execute(client, interaction) {
        switch (true) {
            case interaction.isChatInputCommand(): {
                const command = client.slashCommands.get(interaction.commandName)
                if (!command) {
                    const container = new Container({
                        components: [
                            {
                                type: ComponentType.TextDisplay,
                                content:
                                    '## Error\nThis command does not exist or has been removed.'
                            }
                        ]
                    }).build()
                    return void interaction.reply({
                        components: [container],
                        flags: ['Ephemeral', 'IsComponentsV2']
                    })
                } else {
                    try {
                        void command.execute(interaction, client)
                    } catch (error: unknown) {
                        const err = error as Error
                        Logger.error(`Command "${command.data.name}"`, err.message, err.stack ?? '')
                        const container = new Container({
                            components: [
                                {
                                    type: ComponentType.TextDisplay,
                                    content:
                                        '## Error\nThere was an error while executing this command.'
                                }
                            ]
                        }).build()
                        if (interaction.replied || interaction.deferred) {
                            return void interaction.followUp({
                                components: [container],
                                flags: ['Ephemeral', 'IsComponentsV2']
                            })
                        } else {
                            return void interaction.reply({
                                components: [container],
                                flags: ['Ephemeral', 'IsComponentsV2']
                            })
                        }
                    }
                }
                break
            }
            case interaction.isChannelSelectMenu(): {
                const channelSelect = client.channelSelects.get(interaction.customId)
                if (!channelSelect) {
                    const container = new Container({
                        components: [
                            {
                                type: ComponentType.TextDisplay,
                                content:
                                    '## Error\nThis channel select menu does not exist or has been removed.'
                            }
                        ]
                    }).build()
                    return void interaction.reply({
                        components: [container],
                        flags: ['Ephemeral', 'IsComponentsV2']
                    })
                } else {
                    try {
                        void channelSelect.execute(interaction, client)
                    } catch (error) {
                        const err = error as Error
                        Logger.error(
                            `Channel Select Menu "${channelSelect.id}"`,
                            err.message,
                            err.stack ?? ''
                        )
                        const container = new Container({
                            components: [
                                {
                                    type: ComponentType.TextDisplay,
                                    content:
                                        '## Error\nThere was an error while executing this channel select menu.'
                                }
                            ]
                        }).build()
                        if (interaction.replied || interaction.deferred) {
                            return void interaction.followUp({
                                components: [container],
                                flags: ['Ephemeral', 'IsComponentsV2']
                            })
                        } else {
                            return void interaction.reply({
                                components: [container],
                                flags: ['Ephemeral', 'IsComponentsV2']
                            })
                        }
                    }
                }
                break
            }
            case interaction.isButton(): {
                if (interaction.customId.startsWith('internal_')) return
                const button = client.buttons.get(interaction.customId)
                if (!button) {
                    const container = new Container({
                        components: [
                            {
                                type: ComponentType.TextDisplay,
                                content: '## Error\nThis button does not exist or has been removed.'
                            }
                        ]
                    }).build()
                    return void interaction.reply({
                        components: [container],
                        flags: ['Ephemeral', 'IsComponentsV2']
                    })
                } else {
                    try {
                        void button.execute(interaction, client)
                    } catch (error) {
                        const err = error as Error
                        Logger.error(`Button "${button.id}"`, err.message, err.stack ?? '')
                        const container = new Container({
                            components: [
                                {
                                    type: ComponentType.TextDisplay,
                                    content:
                                        '## Error\nThere was an error while executing this button.'
                                }
                            ]
                        }).build()
                        if (interaction.replied || interaction.deferred) {
                            return void interaction.followUp({
                                components: [container],
                                flags: ['Ephemeral', 'IsComponentsV2']
                            })
                        } else {
                            return void interaction.reply({
                                components: [container],
                                flags: ['Ephemeral', 'IsComponentsV2']
                            })
                        }
                    }
                }
                break
            }
        }
    }
})
