import {
    ApplicationIntegrationType,
    ComponentType,
    InteractionContextType,
    SlashCommandBuilder
} from 'discord.js'
import Container from '../../Contents/Classes/Container'
import { SlashCommand } from '../../Contents/Classes/SlashCommand'
import { CountingUserData } from '../../Contents/types'

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .setName('counting')
        .setDescription('Counting Commands')
        .addSubcommand((cmd) =>
            cmd
                .setName('stats')
                .setDescription('View counting stats for a member')
                .addUserOption((option) =>
                    option
                        .setName('user')
                        .setDescription('The user to view stats for')
                        .setRequired(false)
                )
        ),
    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand()
        switch (subcommand) {
            case 'stats': {
                const user = interaction.options.getUser('user') ?? interaction.user
                const countingData = (
                    await client.db.query<Pick<CountingUserData, 'correctCount' | 'wrongCount'>>(
                        'SELECT correctCount,wrongCount FROM CountingUsers WHERE guildId = ? AND userId = ?',
                        [interaction.guild.id, user.id]
                    )
                )[0]
                if (!countingData) {
                    const container = new Container({
                        components: [
                            {
                                type: ComponentType.TextDisplay,
                                content: `## Counting Minigame Stats\n\n${user} has not played the counting minigame yet.`
                            }
                        ]
                    }).build()
                    void interaction.reply({ components: [container] })
                } else {
                    const container = new Container({
                        components: [
                            {
                                type: ComponentType.TextDisplay,
                                content: `## Counting Minigame Stats\n\n**User:** ${user}\n**Correct Counts:** ${countingData.correctCount}\n**Wrong Counts:** ${countingData.wrongCount}`
                            }
                        ]
                    }).build()
                    void interaction.reply({ components: [container] })
                }
                break
            }
        }
    }
})
