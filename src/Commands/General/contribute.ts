import { ButtonStyle, ComponentType, SeparatorSpacingSize, SlashCommandBuilder } from 'discord.js'
import Container from '../../Contents/Classes/Container'
import { SlashCommand } from '../../Contents/Classes/SlashCommand'

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setName('contribute')
        .setDescription('Get information on how to contribute to the bot.'),
    async execute(interaction) {
        const container = new Container({
            components: [
                {
                    type: ComponentType.TextDisplay,
                    content:
                        'If you want to contribute to the development of the bot, you can do so by forking our GitHub repository.\n' +
                        'For more information, please visit the link below.\n' +
                        'The Bot is developed using TypeScript and Discord.js, and we welcome contributions from the community!'
                },
                {
                    type: ComponentType.Separator,
                    spacing: SeparatorSpacingSize.Small
                },
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            label: 'GitHub Repository',
                            style: ButtonStyle.Link,
                            url: 'https://github.com/Fmfl-Devteam/Fmfl-Minigames'
                        }
                    ]
                }
            ]
        }).build()

        await interaction.reply({ components: [container], flags: ['Ephemeral', 'IsComponentsV2'] })
    }
})
