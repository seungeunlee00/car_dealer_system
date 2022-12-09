import express from 'express';
import {deleteSql, selectSql, updateSql, insertSql} from '../database/sql';

const router = express.Router();

router.get('/', async (_req, res) => {
    const vehicle = await selectSql.getVehicle();
    const sale = await selectSql.getSale();

    res.render('admin', {
        title1: '차량 정보 조회',
        title2: '차량 구매 조회',
        vehicle,
        sale
    })
})

router.post('/', async(req, res) => {
    const data = {
        vinD: req.body.delBtnV,
        vinU: req.body.updBtnV,
        model: req.body.model,
        type: req.body.type,
        price: req.body.price,
        buyyear: req.body.buyyear,
        vinI: req.body.insBtnV,
        newmodel: req.body.newmodel,
        newtype: req.body.newtype,
        newprice: req.body.newprice,
        newbuyyear: req.body.newbuyyear,
        idSaleU: req.body.updBtnS,
        vehicle_vin: req.body.vehicle_vin,
        customer_ssn: req.body.customer_ssn,
        state: req.body.state,
        idSaleS: req.body.SuccessBtnS,
        idSaleF: req.body.failBtnS
    };

    if(data.vinD !== undefined){
        console.log(data.vinD);
        //await deleteSql.deleteVehicle(data);
    } 
    else if(data.vinU !== undefined){
        console.log(data.vinU);
        await updateSql.updateVehicle(data);
    }
    else if(data.vinI !==undefined){
        console.log(data.vinI);
        await insertSql.insertVehicle(data);
    }
    else if(data.idSaleU !== undefined){
        console.log(data.idSaleU);
        await updateSql.updateSale(data);
    }
    else if(data.idSaleS !== undefined){
        console.log(data.idSaleS);
        await updateSql.updateSuccess(data);
    }
    else if(data.idSaleF !== undefined){
        console.log(data.idSaleF);
        await updateSql.updateFail(data);
    }

    res.redirect('/admin');

});

module.exports = router;