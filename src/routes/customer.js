import express from 'express';
import {insertSql, updateSql, selectSql, deleteSql} from '../database/sql';

const router = express.Router();

router.get('/', async (_req, res) => {
    const data = {
        ssn: _req.query.ssn, // login 하고 customer 페이지로 해당 사용자의 ssn을 전달 
    }
    const vehicle2 = await selectSql.getVehicle2(); // customer가 볼 수 있는 vehicle
    const ingSale = await selectSql.getSaleIng(data); // 내 현재 예약 조회 
    const doneSale = await selectSql.getSaleDone(data); // 내 지난 예약 조회

    res.render('customer', {
        title1: '차량 정보 조회',
        title2: '내 예약 조회',
        title3: '지난 예약 조회',
        vehicle2,
        ingSale,
        doneSale
    })
})

router.post('/', async(req, res) => {
    let data = {
        ssn: req.query.ssn, // 사용자 ssn
        vin: req.body.ingBtn, // 예약하기 vin
        idSaleF: req.body.failBtn, // 예약 취소 idsale
    };
    console.log(data);

    if(data.vin !== undefined){
        console.log(data.vin); 
        await insertSql.insertSale(data); // 예약하기
    } 
    if(data.idSaleF !== undefined){
        console.log(data.idSaleF);
        await updateSql.updateFail(data); // 예약취소
    }

    res.redirect('/customer?ssn=' + data.ssn);
});

module.exports = router;