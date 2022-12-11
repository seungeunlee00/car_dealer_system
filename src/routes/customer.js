import express from 'express';
import {insertSql, updateSql, selectSql, deleteSql} from '../database/sql';

const router = express.Router();

// 페이지네이션 구현을 위한 변수
let page = {
    min: 0,
    max: 0
}

router.get('/', async (_req, res) => {
    const data = { // login 하고 쿼리 스트링을 통해 해당 사용자의 ssn과 name을 전달 받음
        ssn: _req.query.ssn, 
        name: _req.query.name 
    }
    const vehicle2 = await selectSql.getVehicle2(page); // customer가 조회할 수 있는 vehicle
    const count = await selectSql.getCount2(); // customer가 조회할 수 있는 vehicle의 개수
    const ingSale = await selectSql.getSaleIng(data); // 내 현재 예약 조회 
    const doneSale = await selectSql.getSaleDone(data); // 내 지난 예약 조회

    /* count table에서 vehicle의 개수만 추출 */
    // console.log(count); -> [ { count: 11 } ]
    count.map((i) => {
        page.max = i.count;
    })
    // console.log(page.max); -> 11

    res.render('customer', {
        data,
        title1: '차량 정보 조회',
        title2: '내 예약 조회',
        title3: '지난 예약 조회',
        vehicle2,
        ingSale,
        doneSale
    })
})

router.post('/', async(req, res) => {
    const data = {
        ssn: req.query.ssn, // 사용자 ssn
        name: req.query.name, // 사용자 name
        vin: req.body.ingBtn, // 예약하기 vin
        idSaleF: req.body.failBtn, // 예약 취소 idsale
        vehicle_vin: req.body.vin, // 예약 취소 vin
        prev: req.body.prev, // vehicle prev
        next: req.body.next, // vehicle next
    };
    console.log(data);

    if(data.vin !== undefined){
        await insertSql.insertSale(data); // 예약하기
    } 
    if(data.idSaleF !== undefined){
        await updateSql.updateFail(data); // 예약취소
    }

    if(data.prev == 1){ // click prev button
        if(page.min >= 10){
            page.min = page.min - 10;
        }
        console.log("prev min=" + page.min);
    }
    if(data.next == 1){ // click next button
        if(page.min < page.max - 10){
            page.min = page.min + 10;
        }
        console.log("next min=" + page.min);
    }

    res.redirect('/customer?ssn=' + data.ssn + '&name=' + data.name);
});

module.exports = router;