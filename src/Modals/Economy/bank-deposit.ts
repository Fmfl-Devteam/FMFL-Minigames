import ModalInteraction from '../../Contents/Classes/ModalInteraction'
import { EconomyUserData } from '../../Contents/types'

export default new ModalInteraction({
    id: 'economy-bank-deposit',

    async execute(interaction, client) {
        if (!interaction.inGuild() || !interaction.inCachedGuild()) return
        const amount = interaction.fields.getTextInputValue('amount')
        const depositAmount = parseInt(amount)

        if (isNaN(depositAmount) || depositAmount <= 0) {
            return void interaction.reply({
                content: 'Please enter a valid amount to deposit.',
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

        if (userData.balance < depositAmount) {
            return void interaction.reply({
                content: 'You do not have enough money to deposit that amount.',
                flags: 'Ephemeral'
            })
        }

        await client.db.query(
            'UPDATE EconomyUserData SET balance = balance - ?, bankBalance = bankBalance + ? WHERE userId = ? AND guildId = ?',
            [depositAmount, depositAmount, interaction.user.id, interaction.guild.id]
        )

        return void interaction.reply({
            content: `Successfully deposited ${depositAmount} coins into your bank.`,
            flags: 'Ephemeral'
        })
    }
})
