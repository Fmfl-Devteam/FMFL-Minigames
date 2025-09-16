import { Colors, ComponentType, GuildMember, PermissionFlagsBits, TextChannel } from 'discord.js'
import Button from '../../Contents/Classes/Button'
import Container from '../../Contents/Classes/Container'
import { CountingDatabaseEntry } from '../../Contents/types'

export default new Button({
    id: 'clear_counting_channel',
    async execute(interaction, client) {
        const member = interaction.member as GuildMember
        if (!member.permissionsIn(interaction.channel).has(PermissionFlagsBits.ManageMessages)) {
            const container = new Container({
                accent_color: Colors.Red,
                components: [
                    {
                        type: ComponentType.TextDisplay,
                        content:
                            '## Counting Minigame\nYou need the ManageMessages Permission in this channel to clear it!'
                    }
                ]
            }).build()
            return void interaction.reply({
                components: [container],
                flags: ['IsComponentsV2', 'Ephemeral']
            })
        }
        if (client.activeServices.get('countingClear')) {
            const container = new Container({
                accent_color: Colors.Yellow,
                components: [
                    {
                        type: ComponentType.TextDisplay,
                        content:
                            '## Counting Minigame\nThe counting channel is already being cleared. Please wait a moment and try again.'
                    }
                ]
            }).build()
            return void interaction.reply({
                components: [container],
                flags: ['Ephemeral', 'IsComponentsV2']
            })
        } else {
            const deferred = await interaction.deferReply()
            const deferredMessage = await deferred.fetch()
            client.activeServices.set('countingClear', true)
            const channel = interaction.channel as TextChannel

            await deleteUnpinnedMessages(channel)

            client.activeServices.set('countingClear', false)
            const currentNumber =
                (
                    await client.db.query<Pick<CountingDatabaseEntry, 'counter'>>(
                        'SELECT counter FROM Counting WHERE guildId = ?',
                        [interaction.guild.id]
                    )
                )[0]?.counter || 0

            const container = new Container({
                accent_color: Colors.Green,
                components: [
                    {
                        type: ComponentType.TextDisplay,
                        content: `## Counting Minigame\nThe counting channel has been cleared. You can start counting again by sending a message with the number ${currentNumber + 1}.`
                    }
                ]
            })
            return void interaction.editReply({
                components: [container],
                flags: 'IsComponentsV2'
            })

            async function deleteUnpinnedMessages(channel: TextChannel) {
                const fetched = await channel.messages.fetch({ limit: 100 })
                if (!fetched.size) return
                const unpinned = fetched.filter((message) => !message.pinned)
                const filtered = unpinned.filter((message) => deferredMessage.id !== message.id)
                await Promise.all(filtered.map((message) => message.delete().catch(() => {})))
                if (fetched.size === 100) {
                    await deleteUnpinnedMessages(channel)
                }
            }
        }
    }
})
