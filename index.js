import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(bodyParser.json({ extended: true, limit: '30mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }));
app.use (cors ());  

app.post('/', generateStep);
app.listen(8000, () => console.log('server Live'));

async function generateStep(req, res) {
    let { firstNumber, secondNumber } = req.body;
    const positiveInt = new RegExp('^[1-9]\\d*$');
    let step_log = Object.create(null);
    let carry = '_';
    let sum = '';
    try {
        if (!positiveInt.test(firstNumber)) throw new Error('first number is not +ve');
        if (!positiveInt.test(secondNumber)) throw new Error('second number is not +ve');

        for (let i = 0; i <= firstNumber.length; i++) {

            const first = +firstNumber[firstNumber.length - i - 1];
            const second = +secondNumber[secondNumber.length - i - 1];
            const carrySum = !i ? 0 : +carry[0];
            const secondSum = second ? second : 0;
            const summer = first + secondSum + carrySum;

            if (i === firstNumber.length - 1) {
                sum = String(summer) + sum;
                step_log[`step${i + 1}`] = { 'carryString': carry, 'sumString': sum };
                break;
            };

            if (summer >= 10) {
                carry = '1' + carry;
                sum = (String(summer))[1] + sum;
                step_log[`step${i + 1}`] = { 'carryString': carry, 'sumString': sum };
            } else {
                carry = '0' + carry;
                sum = summer + sum;
                step_log[`step${i + 1}`] = { 'carryString': carry, 'sumString': sum };
            }
        }
        console.log(step_log);
        res.status (200).json ({isSuccess : true,data : step_log})
    } catch (error) {
        console.log(error);
        res.status(200).json({ isSuccess: false, message: error.message });
    }
};