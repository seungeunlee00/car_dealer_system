import express from 'express';
import logger from 'morgan';
import path from 'path';

import loginRouter from "./routes/login";
import adminRouter from './routes/admin';
import customerRouter from './routes/customer';

const PORT = 3000;

const app = express();

app.use(express.urlencoded({extended: false}))
app.use(express.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));

app.use('/', loginRouter);
app.use('/admin', adminRouter);
app.use('/customer', customerRouter);

app.listen(PORT, ()=> {
    console.log(`Example app listening at http://localhost:${PORT}`)
});