import chalk from 'chalk'

export default class Logger {
    public static info(moduleName: string, ...msgParts: string[]) {
        const date = new Date()
        const timePart = chalk.whiteBright(
            `[${date.toLocaleDateString('ru')} ${date.toLocaleTimeString()}]`
        )
        const modulePart = `${chalk.whiteBright('[')}${chalk.greenBright(moduleName)}${chalk.whiteBright(']')}`
        console.log(timePart, modulePart, ...msgParts)
    }

    public static warn(moduleName: string, ...msgParts: string[]) {
        const date = new Date()
        const timePart = chalk.whiteBright(
            `[${date.toLocaleDateString('ru')} ${date.toLocaleTimeString()}]`
        )
        const modulePart = `${chalk.whiteBright('[')}${chalk.yellowBright(moduleName)}${chalk.whiteBright(']')}`
        console.log(timePart, modulePart, ...msgParts)
    }

    public static error(moduleName: string, ...msgParts: string[]) {
        const date = new Date()
        const timePart = chalk.whiteBright(
            `[${date.toLocaleDateString('ru')} ${date.toLocaleTimeString()}]`
        )
        const modulePart = `${chalk.whiteBright('[')}${chalk.redBright(moduleName)}${chalk.whiteBright(']')}`
        console.log(timePart, modulePart, ...msgParts)
    }
}
