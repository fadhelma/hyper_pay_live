const https = require('https');
const querystring = require('querystring');
require('dotenv').config();

const store = require('store');

const entityIds = process.env.ENTITY_IDS_REGISTRATION.split(", ");
const accessToken = process.env.ACCESS_TOKEN;
const api = process.env.API;

const registerStatusController = (req, res) => {

  const checkoutId = req.params.checkoutId;
  const paymentMethod = req.params.paymentMethod;

  const path = `/v1/checkouts/${checkoutId}/registration`;
  const query = querystring.stringify({
    entityId: paymentMethod == 'MADA' || paymentMethod == 'mada' ? entityIds[0] : entityIds[1]
  });
  const options = {
    port: 443,
    host: api,
    path: `${path}?${query}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  };

  const getRequest = https.request(options, (response) => {
    let data = '';
    response.on('data', (chunk) => {
      data += chunk;
    });
    response.on('end', () => {
      try {
        const result = JSON.parse(data);
        console.log(result);
        store.set('card', {cardId: result.id, cardBrand: result.paymentBrand == "MADA"? "mada" :result.paymentBrand });

        res.render('result_view', { result });
        // res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  });

  getRequest.on('error', (error) => {
    res.status(500).json({ error: error.message });
  });

  getRequest.end();
};

module.exports = registerStatusController;