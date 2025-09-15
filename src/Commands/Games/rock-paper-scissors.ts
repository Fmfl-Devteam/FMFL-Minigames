import {
    ApplicationIntegrationType,
    ButtonStyle,
    ComponentType,
    InteractionContextType,
    SlashCommandBuilder
} from 'discord.js'
import Container from '../../Contents/Classes/Container'
import { SlashCommand } from '../../Contents/Classes/SlashCommand'
const weapons = ['rock', 'paper', 'scissors']

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .setName('rock-paper-scissors')
        .setDescription('Play a game of rock-paper-scissors against the bot!'),

    async execute(interaction, client) {
        const container = new Container({
            components: [
                {
                    type: ComponentType.TextDisplay,
                    content: '## Rock-Paper-Scissors\nChoose your weapon below:'
                },
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            custom_id: 'internal_rock',
                            label: '🪨',
                            style: ButtonStyle.Primary
                        },
                        {
                            type: ComponentType.Button,
                            custom_id: 'internal_paper',
                            label: '📄',
                            style: ButtonStyle.Primary
                        },
                        {
                            type: ComponentType.Button,
                            custom_id: 'internal_scissors',
                            label: '✂️',
                            style: ButtonStyle.Primary
                        }
                    ]
                }
            ]
        }).build()

        const message = await interaction.reply({
            components: [container],
            flags: 'IsComponentsV2'
        })
        message
            .createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: 60000,
                filter: (i) => i.user.id === interaction.user.id
            })
            .on('collect', async (i) => {
                const userWeapon = i.customId.split('_')[1]
                const botWeapon = weapons[Math.floor(Math.random() * weapons.length)]

                let result: string
                if (userWeapon === botWeapon) {
                    result = "It's a tie!"
                    await client.db.query(
                        'INSERT INTO RPS_USER_DATA (guildId, userId, wins, losses, ties) VALUES (?, ?, 0, 0, 1) ON DUPLICATE KEY UPDATE ties = ties + 1',
                        [interaction.guild.id, interaction.user.id]
                    )
                } else if (
                    (userWeapon === 'rock' && botWeapon === 'scissors') ||
                    (userWeapon === 'paper' && botWeapon === 'rock') ||
                    (userWeapon === 'scissors' && botWeapon === 'paper')
                ) {
                    result = 'You win!'
                    await client.db.query(
                        'INSERT INTO RPS_USER_DATA (guildId, userId, wins, losses, ties) VALUES (?, ?, 1, 0, 0) ON DUPLICATE KEY UPDATE wins = wins + 1',
                        [interaction.guild.id, interaction.user.id]
                    )
                } else {
                    result = 'You lose!'
                    await client.db.query(
                        'INSERT INTO RPS_USER_DATA (guildId, userId, wins, losses, ties) VALUES (?, ?, 0, 1, 0) ON DUPLICATE KEY UPDATE losses = losses + 1',
                        [interaction.guild.id, interaction.user.id]
                    )
                }

                const container = new Container({
                    components: [
                        {
                            type: ComponentType.TextDisplay,
                            content: `## Rock-Paper-Scissors\nYou chose **${userWeapon}**. I chose **${botWeapon}**. ${result}`
                        }
                    ]
                }).build()

                await i.update({ components: [container] })
            })
            .on('end', async (collected) => {
                if (collected.size === 0) {
                    const container = new Container({
                        components: [
                            {
                                type: ComponentType.TextDisplay,
                                content:
                                    '## Rock-Paper-Scissors\nYou did not choose a weapon in time!'
                            }
                        ]
                    }).build()

                    await interaction.editReply({ components: [container] })
                }
            })
    }
})
