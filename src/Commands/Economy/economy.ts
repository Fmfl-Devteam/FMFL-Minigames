import { ButtonStyle, ComponentType, SeparatorSpacingSize, SlashCommandBuilder } from 'discord.js'
import { begPhrases, workPhrases } from '../../../Storage/economy_phrases.json'
import Container from '../../Contents/Classes/Container'
import { SlashCommand } from '../../Contents/Classes/SlashCommand'
import COOLDOWNS from '../../Contents/Constants/COOLDOWNS'
import { EconomyLastExecute, EconomyUserData } from '../../Contents/types'

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setName('economy')
        .setDescription('Economy Commands')
        .addSubcommand((cmd) => cmd.setName('balance').setDescription('Show your balance'))
        .addSubcommand((cmd) => cmd.setName('work').setDescription('Work for a little extra money'))
        .addSubcommand((cmd) => cmd.setName('beg').setDescription("I'm beggin, beggin you"))
        .addSubcommand((cmd) => cmd.setName('bank').setDescription('Manage your bank account')),

    async execute(interaction, client) {
        if (!interaction.inGuild() || !interaction.inCachedGuild()) return
        const subcommand = interaction.options.getSubcommand()
        switch (subcommand) {
            case 'work': {
                const userData = (
                    await client.db.query<Pick<EconomyUserData, 'balance' | 'workStreak'>>(
                        'SELECT balance,workStreak FROM EconomyUsers WHERE userId = ? AND guildId = ?',
                        [interaction.user.id, interaction.guild.id]
                    )
                )[0]
                const lastExecuteEntries = await client.db.query<Pick<EconomyLastExecute, 'work'>>(
                    'SELECT work FROM EconomyLastExecutes WHERE userId = ? AND guildId = ?',
                    [interaction.user.id, interaction.guild.id]
                )
                const lastExecute = lastExecuteEntries[0]
                const lastWorkDate = new Date(lastExecute.work)
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
                await client.db.query(
                    'INSERT INTO EconomyUsers (userId, guildId, balance, inventory, workStreak) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE balance = balance + VALUES(balance), workStreak = VALUES(workStreak)',
                    [interaction.user.id, interaction.guild.id, salary, '{}', userData.workStreak]
                )

                await client.db.query(
                    'INSERT INTO EconomyLastExecutes (userId, guildId, work) VALUES (?,?,?) ON DUPLICATE KEY UPDATE work = VALUES(work)',
                    [interaction.user.id, interaction.guild.id, now.getTime()]
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
            case 'beg': {
                const lastExecuteEntries = await client.db.query<Pick<EconomyLastExecute, 'beg'>>(
                    'SELECT beg FROM EconomyLastExecutes WHERE userId = ? AND guildId = ?',
                    [interaction.user.id, interaction.guild.id]
                )
                const lastExecute = lastExecuteEntries[0]
                const now = Date.now()
                if (lastExecute && now - lastExecute.beg < COOLDOWNS.beg) {
                    const remaining = COOLDOWNS.beg - (now - lastExecute.beg)
                    const minutes = Math.floor(remaining / 60_000)
                    const seconds = Math.floor((remaining % 60_000) / 1000)
                    const container = new Container({
                        components: [
                            {
                                type: ComponentType.TextDisplay,
                                content: `## Fmfl Economy\nYou are begging too much! Please wait ${minutes} minute(s) and ${seconds} second(s) before begging again.`
                            }
                        ]
                    }).build()
                    return void interaction.reply({
                        components: [container],
                        flags: 'IsComponentsV2'
                    })
                }

                await client.db.query(
                    'INSERT INTO EconomyLastExecutes (userId, guildId, beg) VALUES (?,?,?) ON DUPLICATE KEY UPDATE beg = VALUES(beg)',
                    [interaction.user.id, interaction.guild.id, now]
                )
                const reward = calculateBegReward()

                const container = new Container({
                    components: [
                        {
                            type: ComponentType.TextDisplay,
                            content: `## Fmfl Economy\n${reward < 0 ? `${begPhrases.loss[Math.floor(Math.random() * begPhrases.loss.length)]}` : `${begPhrases.gain[Math.floor(Math.random() * begPhrases.gain.length)]}`}`
                        }
                    ]
                }).build()

                await client.db.query(
                    'INSERT INTO EconomyUsers (userId, guildId, balance, inventory, workStreak) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE balance = balance + VALUES(balance), workStreak = VALUES(workStreak)',
                    [interaction.user.id, interaction.guild.id, reward, '{}', 0]
                )

                void interaction.reply({ components: [container], flags: 'IsComponentsV2' })
                break
            }
            case 'bank': {
                const balance = await client.db.query<Pick<EconomyUserData, 'bankBalance'>>(
                    'SELECT bankBalance FROM EconomyUsers WHERE userId = ? AND guildId = ?',
                    [interaction.user.id, interaction.guild.id]
                )

                const container = new Container({
                    components: [
                        {
                            type: ComponentType.TextDisplay,
                            content: `## Fmfl Economy\nYour overview of your bank account.`
                        },
                        {
                            type: ComponentType.Separator,
                            spacing: SeparatorSpacingSize.Small
                        },
                        {
                            type: ComponentType.TextDisplay,
                            content: `**Bank Balance:** 🪙 ${balance[0].bankBalance}`
                        },
                        {
                            type: ComponentType.ActionRow,
                            components: [
                                {
                                    type: ComponentType.Button,
                                    label: 'Deposit',
                                    custom_id: 'economy-bank-deposit',
                                    style: ButtonStyle.Primary
                                },
                                {
                                    type: ComponentType.Button,
                                    label: 'Withdraw',
                                    custom_id: 'economy-bank-withdraw',
                                    style: ButtonStyle.Primary
                                }
                            ]
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
    const minBase = 50
    const maxBase = 200

    const baseReward = Math.floor(Math.random() * (maxBase - minBase + 1)) + minBase

    const streakMultiplier = 1 + (workStreak - 1) * 0.02
    return Math.floor(baseReward * streakMultiplier)
}

function calculateBegReward() {
    const minBase = 10
    const maxBase = 50

    const reward = Math.floor(Math.random() * (maxBase - minBase + 1)) + minBase
    // 30% chance to lose money instead of gain it
    return Math.random() < 0.3 ? -reward : reward
}
