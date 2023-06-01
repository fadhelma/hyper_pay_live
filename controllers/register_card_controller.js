const querystring = require('querystring');
require('dotenv').config();
const sendRequest = require('../utils/send_request');
const generateRandomNumbers = require('../utils/generate_random_num');
const generateRandomString = require('../utils/generate_random_str');

const entityIds = process.env.ENTITY_IDS_REGISTRATION.split(", ");
const accessToken = process.env.ACCESS_TOKEN;
const api = process.env.API;

const registerCardController = async (req, res)  =>  {
    const { paymentMethod } = req.params;

    const path = '/v1/checkouts';
    const data = querystring.stringify({
      'entityId': paymentMethod == "mada" ? entityIds[0] : entityIds[1],
      // 'testMode': "EXTERNAL",
      'merchantTransactionId': `${paymentMethod == 'mada'? "4000":"5000"}${generateRandomNumbers(6)}`,
      'customer.email': `${generateRandomString(5)}@gmail.com`,
      'customer.givenName': generateRandomString(5),
      'customer.surname': generateRandomString(6),
      'billing.country': "SA",
      'billing.street1': generateRandomString(10),
      'billing.state': "Riyadh",
      'billing.city': "Riyadh",
      'billing.postcode': `${generateRandomNumbers(4)}`,
      'createRegistration': 'true',
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
      res.render('register_card_view', { result, paymentMethod });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

module.exports = registerCardController;