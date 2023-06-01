const querystring = require('querystring');
require('dotenv').config();
const sendRequest = require('../utils/send_request');
const store = require('store');

const entityIds = process.env.ENTITY_IDS_TOKEN_PAYMENT.split(", ");
const accessToken = process.env.ACCESS_TOKEN;
const api = process.env.API;

const oneClickPaymentController = async (req, res)  =>  {
    const localCard = store.get('card');

    const path = '/v1/checkouts';
    const data = querystring.stringify({
      'entityId': localCard.cardBrand == "mada" ? entityIds[0] : entityIds[1],
      'amount':'1.00',
      'currency':'SAR',
      'paymentType':'DB',
      'registrations[0].id':localCard.cardId
    });
  
    const options = {
      port: 443,
      host: api,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length,
        'Authorization': `Bearer ${accessToken}`
      }
    };
  
    try {
      const result = await sendRequest(options, data);
      res.render('one_click_payment_view', { result, paymentMethod:localCard.cardBrand });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

module.exports = oneClickPaymentController;