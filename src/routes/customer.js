import express from 'express';
import {insertSql, updateSql, selectSql, deleteSql} from '../database/sql';

const router = express.Router();

router.get('/', async (_req, res) => {
    const data = {
        ssn: _req.query.ssn,
    }
    const vehicle2 = await selectSql.getVehicle2();
    const ingSale = await selectSql.getSaleIng(data);
    const doneSale = await selectSql.getSaleDone(data);

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
        ssn: req.query.ssn,
        vin: req.body.ingBtn,
        idSaleF: req.body.failBtn
    };
    console.log(data);

    if(data.vin !== undefined){
        console.log(data.vin); 
        await insertSql.insertSale(data); // 예약하기
    } 
    else if(data.idSaleF !== undefined){
        console.log(data.idSaleF);
        await updateSql.updateFail(data); // 예약취소
    }

    res.redirect('/customer?ssn=' + data.ssn);
});

module.exports = router;