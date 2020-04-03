require('./globals');
const mysql = require('mysql2');

class DBManager {
    static setupProxyNodeDBConnectionPool() {
        // create the pool
        const pool = mysql.createPool({
            host: global.CONFIG.mysql.host,
            port: global.CONFIG.mysql.port,
            user: global.CONFIG.mysql.username,
            password: global.CONFIG.mysql.password,
            waitForConnections: true,
            connectionLimit: global.CONFIG.mysql.poolSize
        });
        const promisePool = pool.promise();
        global.proxyConnectionPool = promisePool;
    }

    static async getProxyNodeConnection(hostname){
        try {
            hostname = global.CONFIG.mysql.database
            if(!global.proxyConnectionPool) {
                DBManager.setupProxyNodeDBConnectionPool()
            }
            const connection = await global.proxyConnectionPool.getConnection();
            await connection.changeUser({
                database: hostname.replace(/\./g, '_')
            });
            return connection;
        } catch (e) {
            throw e;
        }
    }
    
}

module.exports = DBManager;