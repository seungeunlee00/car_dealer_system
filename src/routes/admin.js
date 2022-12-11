import express from 'express';
import {deleteSql, selectSql, updateSql, insertSql} from '../database/sql';

const router = express.Router();

// 페이지네이션 구현을 위한 변수
let page = {
    min: 0,
    max: 0
}

router.get('/', async (_req, res) => {
    const data = { // login 하고 쿼리 스트링을 통해 해당 관리자의 ssn과 name을 전달 받음
        name: _req.query.name 
    }
    const vehicle = await selectSql.getVehicle(page); // 차량 정보 조회
    const sale = await selectSql.getSale(); // 구매 예약 조회
    const count = await selectSql.getCount(); // vehicle의 개수
    
    /* count table에서 vehicle의 개수만 추출 */
    // console.log(count); -> [ { count: 11 } ]
    count.map((i) => {
        page.max = i.count;
    })
    // console.log(page.max); -> 11

    res.render('admin', {
        data,
        title1: '차량 정보 조회',
        title2: '차량 구매 조회',
        vehicle,
        sale,
    })
})

router.post('/', async(req, res) => {
    const data = {
        name: req.query.name, // 관리자 name
        /* vehicle */
        vinD: req.body.delBtnV, // 삭제 vin
        vinU: req.body.updBtnV, // 수정 vin
        model: req.body.model, // 수정 model
        type: req.body.type, // 수정 type
        price: req.body.price, // 수정 price
        buyyear: req.body.buyyear, // 수정 buyyear
        cusview: req.body.cusview, // 수정 cusview
        newmodel: req.body.newmodel, // 추가 model
        newtype: req.body.newtype, // 추가 type
        newprice: req.body.newprice, // 추가 price
        newbuyyear: req.body.newbuyyear, // 추가 buyyear
        newcusview: req.body.newcusview, // 추가 cusview
        prev: req.body.prev, // vehicle prev
        next: req.body.next, // vehicle next
        /* sale */
        idSaleU: req.body.updBtnS, // 수정 idSale
        vehicle_vin: req.body.vehicle_vin, // 수정 vin
        customer_ssn: req.body.customer_ssn, // 수정 ssn
        state: req.body.state, // 수정 state
        idSaleS: req.body.SuccessBtnS, // 판매 성공
        idSaleF: req.body.failBtnS, // 판매 실패
    };
    console.log(data);

    if(data.vinD !== undefined){ 
        await deleteSql.deleteVehicle(data); // 차량 정보 삭제
    } 
    if(data.vinU !== undefined){ 
        await updateSql.updateVehicle(data); // 차량 정보 수정
    }
    if(data.newmodel !== undefined && data.newmodel !== "" 
        && data.newtype !== undefined && data.newtype !== ""
        && data.newprice !== undefined && data.newprice !== ""
        && data.newbuyyear !== undefined && data.newbuyyear !== ""
        && data.newcusview !== undefined && data.newcusview !== "" ){ 
        await insertSql.insertVehicle(data); // 차량 정보 입력
    }
    if(data.idSaleU !== undefined){
        await updateSql.updateSale(data); // 구매 예약 수정
    }
    if(data.idSaleS !== undefined){ 
        await updateSql.updateSuccess(data); // 판매 성공
    }
    if(data.idSaleF !== undefined){ 
        await updateSql.updateFail(data); // 판매 실패
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

    res.redirect('/admin?name=' + data.name);
});

module.exports = router;