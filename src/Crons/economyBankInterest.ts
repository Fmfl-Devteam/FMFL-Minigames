import { Cron } from 'croner'
import MyClient from '../Contents/Classes/MyClient'

export default class EconomyBankInterestCron extends Cron {
    public constructor(client: MyClient) {
        super('0 0 * * *', async () => {
            const interestRate = 0.005 // 0.5% interest rate
            try {
                await client.db.query(
                    'UPDATE EconomyUserData SET bankBalance = bankBalance + (bankBalance * ?)',
                    [interestRate]
                )
            } catch (error) {
                console.error('Failed to apply bank interest in EconomyBankInterestCron:', error);
            }
        })
    }
}
