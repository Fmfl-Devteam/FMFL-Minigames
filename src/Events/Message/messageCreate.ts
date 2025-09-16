import { ComponentType } from 'discord.js'
import Container from '../../Contents/Classes/Container'
import EventHandler from '../../Contents/Classes/EventHandler'
import { CountingDatabaseEntry } from '../../Contents/types'

export default new EventHandler({
    eventName: 'messageCreate',
    async execute(client, message) {
        const countingChannelId = (
            await client.db.query<Pick<CountingDatabaseEntry, 'channelId'>>(
                'SELECT channelId FROM Counting WHERE guildId = ?',
                [message.guild.id]
            )
        )[0]?.channelId
        // Counting Minigame
        if (message.channel.id == countingChannelId && !message.author.bot) {
            if (client.activeServices.get('countingClear')) return
            const countingData = (
                await client.db.query<Pick<CountingDatabaseEntry, 'counter' | 'lastUserId'>>(
                    'SELECT lastUserId,counter FROM Counting WHERE guildId = ?',
                    [message.guild.id]
                )
            )[0]
            if (message.author.id == countingData.lastUserId) {
                const container = new Container({
                    components: [
                        {
                            type: ComponentType.TextDisplay,
                            content:
                                '## Counting Minigame\nYou cannot count twice in a row! Please wait for another user to count before you can count again.'
                        }
                    ]
                }).build()
                const msg = await message.reply({
                    components: [container],
                    flags: 'IsComponentsV2'
                })
                setTimeout(() => {
                    void message.delete().catch(() => {})
                    void msg.delete().catch(() => {})
                }, 3000)
            } else {
                await client.db.query(
                    `UPDATE Counting SET lastUserId = ?, counter = ? WHERE guildId = ?`,
                    [message.author.id, countingData.counter + 1, message.guild.id]
                )
                if (message.content.trim() === (countingData.counter + 1).toString()) {
                    await client.db.query(
                        'INSERT INTO CountingUsers (guildId, userId, correctCount) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE correctCount = correctCount + 1',
                        [message.guild.id, message.author.id]
                    )
                    await message.react('✅')
                } else {
                    const container = new Container({
                        components: [
                            {
                                type: ComponentType.TextDisplay,
                                content: `## Counting Minigame\nIncorrect number! You have to restart counting from 1.`
                            }
                        ]
                    }).build()
                    await client.db.query(
                        'UPDATE Counting SET lastUserId = ?, counter = 0 WHERE guildId = ?',
                        [message.author.id, message.guild.id]
                    )
                    await client.db.query(
                        'INSERT INTO CountingUsers (guildId, userId, wrongCount) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE wrongCount = wrongCount + 1',
                        [message.guild.id, message.author.id]
                    )
                    await message.react('❌')
                    void message.reply({ components: [container], flags: 'IsComponentsV2' })
                }
            }
        }
    }
})
