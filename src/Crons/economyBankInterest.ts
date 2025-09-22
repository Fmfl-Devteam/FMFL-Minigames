import { Cron } from 'croner'
import Logger from '../Contents/Classes/Logger'
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
                const err = error as Error
                Logger.error(
                    'Failed to apply bank interest in EconomyBankInterestCron:',
                    err.message,
                    err.stack || ''
                )
            }
        })
    }
}
