import ChannelSelectMenuInteraction from '../../Contents/Classes/ChannelSelectMenuInteraction'

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
    }
})
