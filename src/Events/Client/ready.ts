import EventHandler from '../../Contents/Classes/EventHandler'
import Logger from '../../Contents/Classes/Logger'

export default new EventHandler({
    eventName: 'clientReady',

    execute(client) {
        Logger.info('Ready Event', `Client is online as ${client.user?.tag}`)
    }
})
