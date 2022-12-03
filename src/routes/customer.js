import express from 'express';
import {selectSql} from '../database/sql';

const router = express.Router();

router.get('/', async (_req, res) => {
    const vehicle = await selectSql.getVehicle();
    
    res.render('customer', {
        title: 'Vehicle',
        vehicle,
    })
})

module.exports = router;