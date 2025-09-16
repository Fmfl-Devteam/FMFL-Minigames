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
