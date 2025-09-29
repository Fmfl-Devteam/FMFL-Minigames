import { ComponentType, TextChannel } from 'discord.js'
import ChannelSelectMenuInteraction from '../../Contents/Classes/ChannelSelectMenuInteraction'
import Container from '../../Contents/Classes/Container'
import COLORS from '../../Contents/Constants/COLORS'

export default new ChannelSelectMenuInteraction({
    customId: 'setup_true_or_false_channel',
    async execute(interaction, client) {
        const channelId = interaction.values[0]
        if (!channelId) {
            return void interaction.reply({
                content: 'No channel selected. Please try again.',
                flags: ['Ephemeral']
            })
        }

        await client.db.query(
            'INSERT INTO true_or_false_settings (guildId, channelId) VALUES (?, ?) ON DUPLICATE KEY UPDATE channelId = ?',
            [interaction.guildId, channelId, channelId]
        )
        void interaction.update({
            content: `The true or false game channel has been set to <#${channelId}>.`,
            components: []
        })

        const container = new Container({
            accent_color: COLORS.fmfl_blue,
            components: [
                {
                    type: ComponentType.TextDisplay,
                    content:
                        '## True or False Minigame\nYou can post statements here to start voting!\nUsers can vote by reacting with ✅ for True and ❌ for False.'
                }
            ]
        }).build()

        const channel = interaction.guild.channels.cache.get(channelId) as TextChannel

        const startMessage = await channel.send({
            components: [container],
            flags: 'IsComponentsV2'
        })
        await startMessage.pin()
    }
})
