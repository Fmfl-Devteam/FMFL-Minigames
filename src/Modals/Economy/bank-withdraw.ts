import { ButtonStyle, ComponentType, SeparatorSpacingSize } from 'discord.js'
import Container from '../../Contents/Classes/Container'
import ModalInteraction from '../../Contents/Classes/ModalInteraction'
import { EconomyUserData } from '../../Contents/types'

export default new ModalInteraction({
    customId: 'economy-bank-withdraw',

    async execute(interaction, client) {
        if (!interaction.inGuild() || !interaction.inCachedGuild() || !interaction.isFromMessage())
            return
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

        const container = new Container({
            components: [
                {
                    type: ComponentType.TextDisplay,
                    content: `## Fmfl Economy\nYour overview of your bank account.`
                },
                {
                    type: ComponentType.Separator,
                    spacing: SeparatorSpacingSize.Small
                },
                {
                    type: ComponentType.TextDisplay,
                    content: `**Bank Balance:** 🪙 ${userData.bankBalance - withdrawAmount}`
                },
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            label: 'Deposit',
                            custom_id: 'economy-bank-deposit',
                            style: ButtonStyle.Primary
                        },
                        {
                            type: ComponentType.Button,
                            label: 'Withdraw',
                            custom_id: 'economy-bank-withdraw',
                            style: ButtonStyle.Primary
                        }
                    ]
                }
            ]
        }).build()

        await interaction.update({ components: [container] })
    }
})
