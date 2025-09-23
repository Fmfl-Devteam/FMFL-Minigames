import ModalInteraction from '../../Contents/Classes/ModalInteraction'
import { EconomyUserData } from '../../Contents/types'

export default new ModalInteraction({
    customId: 'economy-bank-withdraw',

    async execute(interaction, client) {
        if (!interaction.inGuild() || !interaction.inCachedGuild()) return
        const amount = interaction.fields.getTextInputValue('amount')
        const withdrawAmount = parseInt(amount)

        if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
            return void interaction.reply({
                content: 'Please enter a valid amount to withdraw.',
                flags: 'Ephemeral'
            })
        }

        const userDataEntries = await client.db.query<
            Pick<EconomyUserData, 'balance' | 'bankBalance'>
        >('SELECT balance, bankBalance FROM EconomyUserData WHERE userId = ? AND guildId = ?', [
            interaction.user.id,
            interaction.guild.id
        ])
        const userData = userDataEntries[0]

        if (!userData) {
            return void interaction.reply({
                content: 'You do not have an account yet. Use e.g. `/economy work` to create one.',
                flags: 'Ephemeral'
            })
        }

        if (userData.bankBalance < withdrawAmount) {
            return void interaction.reply({
                content: 'You do not have enough money to withdraw that amount.',
                flags: 'Ephemeral'
            })
        }

        await client.db.query(
            'UPDATE EconomyUserData SET balance = balance + ?, bankBalance = bankBalance - ? WHERE userId = ? AND guildId = ?',
            [withdrawAmount, withdrawAmount, interaction.user.id, interaction.guild.id]
        )

        return void interaction.reply({
            content: `Successfully withdrew ${withdrawAmount} coins from your bank.`,
            flags: 'Ephemeral'
        })
    }
})
