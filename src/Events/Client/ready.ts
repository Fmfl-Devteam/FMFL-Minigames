import EventHandler from '../../Contents/Classes/EventHandler'
import Logger from '../../Contents/Classes/Logger'
import EconomyBankInterestCron from '../../Crons/economyBankInterest'

export default new EventHandler({
    eventName: 'clientReady',

    execute(client) {
        Logger.info('Ready Event', `Client is online as ${client.user?.tag}`)
        client.application?.commands.set(client.slashCommands.map((c) => c.data))

        new EconomyBankInterestCron(client)
    }
})
