import { ButtonStyle, ComponentType, TextChannel } from 'discord.js'
import ChannelSelectMenuInteraction from '../../Contents/Classes/ChannelSelectMenuInteraction'
import Container from '../../Contents/Classes/Container'
import COLORS from '../../Contents/Constants/COLORS'

export default new ChannelSelectMenuInteraction({
    id: 'setup_counting_channel',
    async execute(interaction, client) {
        const channelid = interaction.values[0]
        const guild = interaction.guild
        const channel = guild.channels.cache.get(channelid) as TextChannel
        if (!channel) {
            return void interaction.reply({
                content: 'The selected channel could not be found. Please try again.',
                flags: 'Ephemeral'
            })
        }
        client.db.query(
            `INSERT INTO Counting (guildId, channelId, lastUserId, counter) VALUES (?, ?, ?, 0) ON DUPLICATE KEY UPDATE channelId = ?`,
            [guild.id, channelid, '0', channelid]
        )
        const container = new Container({
            accent_color: COLORS.fmfl_blue,
            components: [
                {
                    type: ComponentType.TextDisplay,
                    content:
                        '## Counting Minigame\nHere you can start counting!\nJust send a message with the number 1 to start the game.'
                },
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            style: ButtonStyle.Danger,
                            custom_id: 'clear_counting_channel',
                            label: 'Clear Counting Channel'
                        }
                    ]
                }
            ]
        }).build()
        const message = await channel.send({ components: [container], flags: 'IsComponentsV2' })
        await message.pin()
        const replyContainer = new Container({
            accent_color: COLORS.fmfl_blue,
            components: [
                {
                    type: ComponentType.TextDisplay,
                    content: `## Counting Minigame Setup\nSuccessfully set <#${channelid}> as the counting channel!`
                }
            ]
        }).build()
        return void interaction.update({ components: [replyContainer] })
    }
})
