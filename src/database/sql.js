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
    getAdmin: async () => { // 로그인
        const sql = `select * from admin`;
        const [result] = await promisePool.query(sql);
        
        return result;
    },
    getCustomer: async () => { // 로그인
        const sql = `select * from customer`;
        const [result] = await promisePool.query(sql);
       
        return result;
    },
    getVehicle: async (data) => { // 관리자 - 전체 챠량 정보 조회
        const sql = `select * from vehicle orders limit ${data.min}, 10`;
        const [result] = await promisePool.query(sql);
        
        return result;
    },
    getCount: async () => { // 관리자 - vehicle 총 개수  
        const sql = `select count(*) as count from vehicle`
        const [result] = await promisePool.query(sql);
        
        return result;
    },
    getSale: async () => { // 관리자 - 차량 예약 조회
        const sql = `select * from sale`;
        const [result] = await promisePool.query(sql);
        
        return result;
    },
    getVehicle2: async (data) => { // 사용자 - 사용자가 조회 가능한 차량 조회
        const sql = `select * from cusvehicle orders limit ${data.min}, 10`;
        const [result] = await promisePool.query(sql);
        
        return result;
    },
    getCount2: async () => { // 사용자 - 사용자가 조회 가능한 차량의 개수
        const sql = `select count(*) as count from cusvehicle;`;
        const [result] = await promisePool.query(sql);

        return result;
    },
    getSaleIng: async (data) => { // 사용자 - 내 현재 예약 조회
        const sql = `select idSale, Vin, Model, Type, Price, BuyYear, State from sale, vehicle 
        where customer_ssn=${data.ssn} and vehicle_vin=vin and state='ing';`;
        const [result] = await promisePool.query(sql);
        
        return result;
    },
    getSaleDone: async (data) => { // 사용자 - 내 과거 내역 조회
        const sql = `select idSale, Vin, Model, Type, Price, BuyYear, State from sale, vehicle 
        where customer_ssn=${data.ssn} and vehicle_vin=vin and state!='ing'`;
        const [result] = await promisePool.query(sql);

        return result;
    }, 
}

// delete query
export const deleteSql = {
    deleteVehicle: async(data) => { // 관리자 - 차량 정보 삭제
        const sql = `delete from vehicle where vin=${data.vinD}`;
        
        await promisePool.query(sql);
    }
}

// update query
export const updateSql = {
    updateVehicle: async(data) => { // 관리자 - 차량 정보 수정
        const sql = `update vehicle set model='${data.model}', type='${data.type}', 
        price='${data.price}', buyyear='${data.buyyear}', cusview='${data.cusview}' where vin=${data.vinU}`;
        
        await promisePool.query(sql);
    },
    updateSale: async(data) => { // 관리자 - 예약 수정
        const sql = `update salev set vehicle_vin='${data.vehicle_vin}' where idSale=${data.idSaleU}`;
        const sql2 = `update salec set customer_ssn='${data.customer_ssn}' where idSale=${data.idSaleU}`;
        const sql3 = `update sales set state='${data.state}' where idSale=${data.idSaleU}`;

        let sql4=[];
        if(data.state == 'ing' || data.state == 'success'){
            sql4 = `update vehicle set cusview="N" where vin=${data.vehicle_vin}`;
        } 
        if(data.state == 'fail'){
            sql4 = `update vehicle set cusview="Y" where vin=${data.vehicle_vin}`;
        }
        
        await promisePool.query(sql);
        await promisePool.query(sql2);
        await promisePool.query(sql3);
        await promisePool.query(sql4);
    },
    updateSuccess: async(data) => { // 관리자 - 판매 성공
        const sql = `update sales set state='success' where idSale=${data.idSaleS}`;
        const sql2 = `update vehicle set cusview ="N" where vin=${data.vehicle_vin}`;

        await promisePool.query(sql);
        await promisePool.query(sql2);
    },
    updateFail: async(data) => { // 관리자 - 판매 실패, 판매자 - 예약 취소
        const sql = `update sales set state='fail' where idSale=${data.idSaleF}`;
        const sql2 = `update vehicle set cusview ="Y" where vin=${data.vehicle_vin}`;
    
        await promisePool.query(sql);
        await promisePool.query(sql2);
    },
}

// insert query
export const insertSql = {
    insertVehicle: async (data) => { // 관리자 - 차량 정보 입력
        const sql = `insert into vehicle(Model, Type, Price, BuyYear, CusView) 
        values("${data.newmodel}", "${data.newtype}", "${data.newprice}", "${data.newbuyyear}", "${data.newcusview}")`;
       
        await promisePool.query(sql);
    },
    insertSale: async(data)=>{ // 사용자 - 차량 예약하기
        const sql = `insert into sales(state) values("ing")`;
        const sql2 = `insert into salev(vehicle_vin) values(${data.vin})`;
        const sql3 = `insert into salec(customer_ssn) values(${data.ssn})`;
        const sql4 = `update vehicle set cusview="N" where vin=${data.vin}`;

        await promisePool.query(sql);
        await promisePool.query(sql2);
        await promisePool.query(sql3);
        await promisePool.query(sql4);
    }
}