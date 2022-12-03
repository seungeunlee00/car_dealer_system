import mysql from 'mysql2';

// 데이터베이스 연결
const pool = mysql.createPool(
    process.env.JAWSDB_URL ?? {
        host: 'localhost',
        user: 'root',
        database: 'car',
        password: 'tmddms30',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    }
);

// async / await 사용
const promisePool = pool.promise();

// select query
export const selectSql = {
    getAdmin: async () => {
        const [rows] = await promisePool.query(`select * from admin`);
        return rows;
    },
    getCustomer: async () => {
        const [rows] = await promisePool.query(`select * from customer`);
        return rows;
    },
    getVehicle: async () => {
        const [rows] = await promisePool.query(`select * from vehicle where vin<10`);
        return rows;
    }
}

// delete query
export const deleteSql = {

}

// update query
export const updateSql = {

}

// insert query
export const insertSql = {

}