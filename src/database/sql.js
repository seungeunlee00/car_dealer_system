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
    getVehicle: async () => { // 관리자 - 전체 챠량 정보 조회
        const sql = `select * from vehicle`;
        const [result] = await promisePool.query(sql);
        
        return result;
    },
    getVehicle2: async () => { // 사용자 - 예약 중, 예약 완료된 차량 제외 검색
        const sql = `(select * from vehicle where vin not in (select vehicle_vin from sale where vehicle_vin is not null)) 
        union 
        (select vin, model, type, price, buyyear from vehicle, sale where vin=vehicle_vin and state='fail') 
        order by vin asc;`;
        const [result] = await promisePool.query(sql);
        
        return result;
    },
    getSale: async () => { // 관리자 - 차량 예약 조회
        const sql = `select * from sale`;
        const [result] = await promisePool.query(sql);
        
        return result;
    },
    getSaleIng: async (data) => { // 사용자 - 내 현재 예약 조회
        //console.log(data);
        const sql = `select * from sale where Customer_Ssn=${data.ssn} and state='ing'`;
        const [result] = await promisePool.query(sql);
        
        return result;
    },
    getSaleDone: async(data)=>{ // 사용자 - 내 과거 내역 조회
        //console.log(data);
        const sql = `select * from sale where customer_ssn=${data.ssn} and state!='ing'`;
        const [result] = await promisePool.query(sql);

        return result;
    }
}

// delete query
export const deleteSql = {
    deleteVehicle: async(data) => { // 관리자 - 차량 정보 삭제
        console.log(data);
        const sql = `delete from vehicle where vin=${data.vinD}`;
        
        await promisePool.query(sql);
    }
}

// update query
export const updateSql = {
    updateVehicle: async() => { // 관리자 - 차량 정보 수정
        console.log(data);
        const sql = `update vehicle from vehicle where vin=${data.vinU}`;
        
        await promisePool.query(sql);
    },
    updateSale: async(data) => { // 관리자 - 예약 수정
        console.log(data);
        const sql = `update sale set state='${data.state}' where idSale=${data.idSaleU}`;
    
        await promisePool.query(sql);
    },
    updateSuccess: async(data) => { // 관리자 - 판매 성공
        console.log(data);
        const sql = `update sale set state='success' where idSale=${data.idSaleS}`;
    
        await promisePool.query(sql);
    },
    updateFail: async(data) => { // 관리자 - 판매 실패, 판매자 - 예약 취소
        console.log(data);
        const sql = `update sale set state='fail' where idSale=${data.idSaleF}`;
    
        await promisePool.query(sql);
    },
}

// insert query
export const insertSql = {
    insertVehicle: async (data) => { // 관리자 - 차량 정보 입력
        console.log(data);
        const sql = `insert into vehicle(Model, Type, Price, BuyYear) values("${data.model}", "${data.type}", "${data.price}", "${data.buyyear}")`;
       
        await promisePool.query(sql);
    },
    insertSale: async(data)=>{ // 사용자 - 차량 예약하기
        console.log(data);
        const sql = `insert into sale(vehicle_vin, customer_ssn, state) values(${data.vin}, ${data.ssn}, "ing")`;

        await promisePool.query(sql);
    }
}