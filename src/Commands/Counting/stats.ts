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
        .addSubcommandGroup((grp) =>
            grp
                .setName('stats')
                .setDescription('Counting Stats Commands')
                .addSubcommand((cmd) =>
                    cmd
                        .setName('user')
                        .setDescription('View counting stats for a member')
                        .addUserOption((option) =>
                            option
                                .setName('user')
                                .setDescription('The user to view stats for')
                                .setRequired(false)
                        )
                )
                .addSubcommand((cmd) =>
                    cmd.setName('guild').setDescription('View counting stats for the guild')
                )
        ),
    async execute(interaction, client) {
        const subcommandGroup = interaction.options.getSubcommandGroup()
        const subcommand = interaction.options.getSubcommand()
        switch (subcommandGroup) {
            case 'stats': {
                switch (subcommand) {
                    case 'user': {
                        const user = interaction.options.getUser('user') ?? interaction.user
                        const countingData = (
                            await client.db.query<
                                Pick<CountingUserData, 'correctCount' | 'wrongCount'>
                            >(
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

                    case 'guild': {
                        const countingData = await client.db.query<
                            Pick<CountingUserData, 'correctCount' | 'wrongCount'>
                        >(
                            'SELECT SUM(correctCount) as correctCount, SUM(wrongCount) as wrongCount FROM CountingUsers WHERE guildId = ?',
                            [interaction.guild.id]
                        )
                        const container = new Container({
                            components: [
                                {
                                    type: ComponentType.TextDisplay,
                                    content: `## Counting Minigame Stats\n\n**Total Correct Counts:** ${countingData[0].correctCount ?? 0}\n**Total Wrong Counts:** ${countingData[0].wrongCount ?? 0}\n**Total Counts:** ${(countingData[0].correctCount ?? 0) + (countingData[0].wrongCount ?? 0)}`
                                }
                            ]
                        }).build()
                        void interaction.reply({ components: [container], flags: 'IsComponentsV2' })
                        break
                    }
                }
                break
            }
        }
    }
})
