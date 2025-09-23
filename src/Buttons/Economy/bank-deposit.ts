import { ComponentType, ModalBuilder, TextInputStyle } from 'discord.js'
import Button from '../../Contents/Classes/Button'
import { EconomyUserData } from '../../Contents/types'

export default new Button({
    customId: 'economy-bank-deposit',

    async execute(interaction, client) {
        if (!interaction.inGuild() || !interaction.inCachedGuild()) return
        const userDataEntries = await client.db.query<Pick<EconomyUserData, 'balance'>>(
            'SELECT balance FROM EconomyUsers WHERE userId = ? AND guildId = ?',
            [interaction.user.id, interaction.guild.id]
        )
        const userData = userDataEntries[0]

        if (!userData) {
            return void interaction.reply({
                content: 'You do not have an account yet. Use e.g. `/economy work` to create one.',
                flags: 'Ephemeral'
            })
        }

        if (userData.balance <= 0) {
            return void interaction.reply({
                content: 'You do not have any money to deposit.',
                flags: 'Ephemeral'
            })
        }

        const modal = new ModalBuilder({
            title: 'Bank Deposit',
            customId: 'economy-bank-deposit',
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.TextInput,
                            label: 'Amount to deposit',
                            customId: 'amount',
                            style: TextInputStyle.Short
                        }
                    ]
                }
            ]
        })
        void interaction.showModal(modal)
    }
})
