const querystring = require('querystring');
require('dotenv').config();
const sendRequest = require('../utils/send_request');

const entityIds = process.env.ENTITY_IDS.split(", ");
const accessToken = process.env.ACCESS_TOKEN;
const api = process.env.API;

const directPaymentController = async (req, res)  =>  {
    const { paymentMethod } = req.params;

    const path = '/v1/checkouts';
    const data = querystring.stringify({
      'entityId': paymentMethod == "mada" ? entityIds[0] : entityIds[1],
      'amount': "1.00",
      'currency': 'SAR',
      'paymentType': 'DB',
      // 'createRegistration': 'true'
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
      res.render('selected_method_view', { result, paymentMethod });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

module.exports = directPaymentController;