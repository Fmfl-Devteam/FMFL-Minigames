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
    inventory: string
    workStreak: number
    /**
     * Stores a Date with following format YYYY-MM-DD
     * @example
     * 2025-09-16
     * 2025-04-25
     */
    lastWork: string
}
