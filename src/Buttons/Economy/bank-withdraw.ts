import { ComponentType, ModalBuilder, TextInputStyle } from 'discord.js'
import Button from '../../Contents/Classes/Button'
import { EconomyUserData } from '../../Contents/types'

export default new Button({
    customId: 'economy-bank-withdraw',

    async execute(interaction, client) {
        if (!interaction.inGuild() || !interaction.inCachedGuild()) return
        const userDataEntries = await client.db.query<Pick<EconomyUserData, 'bankBalance'>>(
            'SELECT bankBalance FROM EconomyUsers WHERE userId = ? AND guildId = ?',
            [interaction.user.id, interaction.guild.id]
        )
        const userData = userDataEntries[0]

        if (!userData) {
            return void interaction.reply({
                content: 'You do not have an account yet. Use e.g. `/economy work` to create one.',
                flags: 'Ephemeral'
            })
        }

        if (userData.bankBalance <= 0) {
            return void interaction.reply({
                content: 'You do not have any money to withdraw.',
                flags: 'Ephemeral'
            })
        }

        const modal = new ModalBuilder({
            title: 'Bank Withdraw',
            customId: 'economy-bank-withdraw',
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.TextInput,
                            label: 'Amount to withdraw',
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
