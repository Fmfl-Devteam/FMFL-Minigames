import { ComponentType, SeparatorSpacingSize, SlashCommandBuilder } from 'discord.js'
import { workPhrases } from '../../../Storage/economy_phrases.json'
import Container from '../../Contents/Classes/Container'
import { SlashCommand } from '../../Contents/Classes/SlashCommand'
import { EconomyUserData } from '../../Contents/types'

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setName('economy')
        .setDescription('Economy Commands')
        .addSubcommand((cmd) => cmd.setName('balance').setDescription('Show your balance'))
        .addSubcommand((cmd) =>
            cmd.setName('work').setDescription('Work for a little extra money')
        ),

    async execute(interaction, client) {
        if (!interaction.inGuild() || !interaction.inCachedGuild()) return
        const subcommand = interaction.options.getSubcommand()
        switch (subcommand) {
            case 'work': {
                const userData = (
                    await client.db.query<
                        Pick<EconomyUserData, 'balance' | 'workStreak' | 'lastWork'>
                    >(
                        'SELECT balance,workStreak,lastWork FROM EconomyUsers WHERE guildId = ? AND userId = ?',
                        [interaction.guild.id, interaction.user.id]
                    )
                )[0]
                const lastWorkDate = new Date(userData.lastWork)
                const now = new Date()
                if (lastWorkDate.toDateString() !== now.toDateString()) {
                    const yesterday = new Date(now)
                    yesterday.setDate(yesterday.getDate() - 1)

                    if (lastWorkDate.toDateString() === yesterday.toDateString()) {
                        userData.workStreak++
                    } else {
                        userData.workStreak = 1
                    }
                } else {
                    const container = new Container({
                        components: [
                            {
                                type: ComponentType.TextDisplay,
                                content:
                                    '## Fmfl Economy\nYou already worked today. Please come back tomorrow!'
                            }
                        ]
                    }).build()
                    return void interaction.reply({
                        components: [container],
                        flags: 'IsComponentsV2'
                    })
                }
                const salary = calculateWorkReward(userData.workStreak)
                const workPhrase = workPhrases[Math.floor(Math.random() * workPhrases.length)]

                const formattedDate = now.toISOString().split('T')[0]
                await client.db.query(
                    'INSERT INTO EconomyUsers (userId, guildId, balance, inventory, workStreak, lastWork) VALUES (?,?,?,?,?,?) ON DUPLICATE KEY UPDATE balance = balance + VALUES(balance), workStreak = VALUES(workStreak), lastWork = VALUES(lastWork)',
                    [
                        interaction.user.id,
                        interaction.guild.id,
                        salary,
                        '{}',
                        userData.workStreak,
                        formattedDate
                    ]
                )

                const container = new Container({
                    components: [
                        {
                            type: ComponentType.TextDisplay,
                            content: `## Fmfl Economy\n${workPhrase}`
                        },
                        {
                            type: ComponentType.Separator,
                            spacing: SeparatorSpacingSize.Small
                        },
                        {
                            type: ComponentType.TextDisplay,
                            content: `You earned 🪙 ${salary} today!`
                        }
                    ]
                }).build()

                void interaction.reply({ components: [container], flags: 'IsComponentsV2' })
                break
            }
            case 'balance': {
                const userData = (
                    await client.db.query<Pick<EconomyUserData, 'balance'>>(
                        'SELECT balance FROM EconomyUsers WHERE userId = ? AND guildId = ?',
                        [interaction.user.id, interaction.guild.id]
                    )
                )[0]

                const container = new Container({
                    components: [
                        {
                            type: ComponentType.TextDisplay,
                            content: `## Fmfl Economy\nYou currently have 🪙 ${userData.balance} in your wallet!`
                        }
                    ]
                }).build()

                void interaction.reply({ components: [container], flags: 'IsComponentsV2' })
                break
            }
        }
    }
})

function calculateWorkReward(workStreak: number) {
    const minBase = 20
    const maxBase = 100

    const baseReward = Math.floor(Math.random() * (maxBase - minBase + 1)) + minBase

    const streakMultiplier = 1 + (workStreak - 1) * 0.02
    return Math.floor(baseReward * streakMultiplier)
}
