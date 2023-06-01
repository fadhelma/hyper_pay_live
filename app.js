const express = require('express');
const app = express();
app.use(express.json());
const bodyParser = require('body-parser');
app.set('view engine', 'ejs');

const cors = require('cors');
// Enable CORS middleware
app.use(cors());


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('home_view');
});

const paymentStatusController = require('./controllers/payment_status_controller');
const directPaymentController = require('./controllers/direct_payment_controller');
const registerCardController = require('./controllers/register_card_controller');
const registerStatusController = require('./controllers/register_status_controller');
const oneClickPaymentController = require('./controllers/one_click_payment_controller');

app.get('/payment-status/:checkoutId/:paymentMethod', paymentStatusController);
app.get('/register-status/:checkoutId/:paymentMethod', registerStatusController);

app.get('/direct-payment/:paymentMethod', directPaymentController);
app.get('/register-card/:paymentMethod', registerCardController);
app.get('/one-click-payment', oneClickPaymentController);

app.get('/select-register-card', (req, res) => {
  res.render('select_register_card_view');
});

app.get('/direct-payment-page', (req, res) => {
  res.render('direct_payment_view');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});