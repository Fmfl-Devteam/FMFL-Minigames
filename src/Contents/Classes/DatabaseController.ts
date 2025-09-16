import { createPool, Pool, PoolConfig, PoolConnection } from 'mariadb'
import Logger from './Logger'

export default class DatabaseController {
    private pool: Pool

    public constructor(config: PoolConfig) {
        this.pool = createPool(config)
        Logger.info('DatabaseController', 'Database connection pool created.')
    }

    public query<T>(query: string, params?: any[]): Promise<T[]> {
        return new Promise(async (resolve, reject) => {
            let conn: PoolConnection | undefined
            try {
                conn = await this.pool.getConnection()
                const rows = await conn.query<T[]>(query, params)
                resolve(rows)
            } catch (err) {
                reject(err)
            } finally {
                if (conn) conn.release()
            }
        })
    }
}
