export type CountingDatabaseEntry = {
    guildId: string
    channelId: string
    lastUserId: string
    counter: number
}
export type CountingUserData = {
    userId: string
    guildId: string
    correctCount: number
    wrongCount: number
}
export type EconomyUserData = {
    userId: string
    guildId: string
    balance: number
    bankBalance: number
    inventory: string
    workStreak: number
}
export type EconomyLastExecute = {
    userId: string
    guildId: string
    beg: string
    work: string
    crime: string
}
