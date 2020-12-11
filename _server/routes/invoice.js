const express = require('express');
const router = express.Router();

const passport = require('passport');

const { Invoice } = require('../models/Invoice');

const { createErrorObject } = require('../middleware/authenticate');

/**
 * @description GET /api/invoice/:vendor_id
 */
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    console.log('[get invoices]', req.params);
    if (!req.params.id) return;

    const invoices = await Invoice.find({ vendor: req.params.id });

    if (invoices) {
        return res.status(200).json(invoices);
    } else {
        return res.status(404).json({ error: 'No invoices found' });
    }
});

/**
 * @description POST /api/invoice/
 */
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let errors = [];
    console.log('[invoice create]', req.body);
    const { id, vendor, client, billfor, products, tax, status } = req.body;

    if (!req.body.id || !req.body.vendor) {
        errors.push({ param: 'no_content', msg: 'Check the fields again' });
        return res.json({ errors: createErrorObject(errors) });
    }

    const newInvoice = new Invoice({
        id,
        vendor,
        client,
        billfor,
        products,
        tax,
        status
    }).save();

    return res.status(200).json(newInvoice);
});

module.exports = router;
