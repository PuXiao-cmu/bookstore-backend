const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.post('/', customerController.addCustomer);

router.get('/:id', customerController.getCustomerById);
router.get('/', customerController.getCustomerByUserId);

module.exports = router;
