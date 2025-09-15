import Button from '../../Contents/Classes/Button'
import { CountingDatabaseEntry } from '../../Contents/types'

export default new Button({
    id: 'clear_counting_channel',
    async execute(interaction, client) {
        if (client.activeServices.get('countingClear')) {
            return void interaction.reply({
                content:
                    'The counting channel is already being cleared. Please wait a moment and try again.',
                flags: 'Ephemeral'
            })
        } else {
            client.activeServices.set('countingClear', true)
            await client.db.query(
                `UPDATE Counting SET lastUserId = ?, counter = 0 WHERE guildId = ?`,
                ['0', interaction.guild.id]
            )
            const channel = interaction.channel

            await deleteUnpinnedMessages(channel)

            client.activeServices.set('countingClear', false)
            const currentNumber =
                (
                    await client.db.query<Pick<CountingDatabaseEntry, 'counter'>>(
                        'SELECT counter FROM Counting WHERE guildId = ?',
                        [interaction.guild.id]
                    )
                )[0]?.counter || 0
            return void interaction.reply({
                content: `The counting channel has been cleared. You can start counting again by sending a message with the number ${currentNumber}.`,
                flags: 'Ephemeral'
            })

            async function deleteUnpinnedMessages(channel) {
                const fetched = await channel.messages.fetch({ limit: 100 })
                if (!fetched.size) return
                const unpinned = fetched.filter((message) => !message.pinned)
                await Promise.all(unpinned.map((message) => message.delete().catch(() => {})))
                if (fetched.size === 100) {
                    await deleteUnpinnedMessages(channel)
                }
            }
        }
    }
})
