import express from "express";
import { selectSql } from "../database/sql";

const router = express.Router();

router.get('/', (req,res) => {
    res.render('login');
})

router.post('/', async (req,res) => {
    const vars = req.body;
    const admin = await selectSql.getAdmin();
    const customer = await selectSql.getCustomer();
    let whoAmI = ''; // 관리자 admin / 사용자 customer
    let ssn = ''; // 사용자 ssn
    let name= ''; // 관리자, 사용자 name
    let checkLogin = false; // login 여부

    admin.map((user) => {
        if(vars.id === user.id && vars.password === user.pwd) {
            checkLogin = true;
            whoAmI = 'admin';
            name = user.Name;
        }
    })
    customer.map((user) => {
        if(vars.id === user.id && vars.password === user.pwd) {
            checkLogin = true;
            whoAmI = 'customer';
            ssn = user.Ssn;
            name = user.Name;
        }
    })

    if(checkLogin && whoAmI === 'admin'){
        res.redirect('/admin?name=' + name); // 관리자 페이지로 이동 + 쿼리 스트링을 통해 name 전달
        console.log('login admin!');
    } else if(checkLogin && whoAmI === 'customer'){
        res.redirect('/customer?ssn=' + ssn + '&name=' + name); // 사용자 페이지로 이동 + 쿼리 스트링을 통해 ssn, name 전달
        console.log('login customer!');
    } else {
        console.log('login failed!');
        res.send("<script>alert('로그인에 실패했습니다.'); location.href='/';</script>")
    }

})

module.exports = router;