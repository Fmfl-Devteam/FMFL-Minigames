import {
    ApplicationIntegrationType,
    ChannelType,
    ComponentType,
    InteractionContextType,
    SeparatorSpacingSize,
    SlashCommandBuilder
} from 'discord.js'
import Container from '../../Contents/Classes/Container'
import { SlashCommand } from '../../Contents/Classes/SlashCommand'

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .setName('setup')
        .setDescription('Set up the bot for this server')
        .addSubcommand((cmd) => cmd.setName('counting').setDescription('Set up the counting game')),

    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand()
        switch (subcommand) {
            case 'counting': {
                const container = new Container({
                    components: [
                        {
                            type: ComponentType.TextDisplay,
                            content:
                                '## Counting Minigame Setup\nPlease select the channel you want to use for the counting game.'
                        },
                        {
                            type: ComponentType.Separator,
                            spacing: SeparatorSpacingSize.Small
                        },
                        {
                            type: ComponentType.ActionRow,
                            components: [
                                {
                                    type: ComponentType.ChannelSelect,
                                    custom_id: 'setup_counting_channel',
                                    channel_types: [ChannelType.GuildText],
                                    required: true,
                                    placeholder: 'Select the channel for the counting game',
                                    max_values: 1
                                }
                            ]
                        }
                    ]
                }).build()

                void interaction.reply({
                    components: [container],
                    flags: ['Ephemeral', 'IsComponentsV2']
                })
            }
        }
    }
})
