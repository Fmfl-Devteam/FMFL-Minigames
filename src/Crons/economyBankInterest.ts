import { Cron } from 'croner'
import MyClient from '../Contents/Classes/MyClient'

export default class EconomyBankInterestCron extends Cron {
    public constructor(client: MyClient) {
        super('0 0 * * *', () => {
            const interestRate = 0.005 // 0.5% interest rate
            client.db.query(
                'UPDATE EconomyUsers SET bankBalance = bankBalance + (bankBalance * ?)',
                [interestRate]
            )
        })
    }
}
