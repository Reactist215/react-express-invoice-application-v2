const express = require('express');
const router = express.Router();

const passport = require('passport');

const { Invoice } = require('../models/Invoice');

const { createErrorObject } = require('../middleware/authenticate');
const { getValueForNextSequence } = require('../helpers/utils');

/**
 * @description GET /api/invoice/:invoice_id
 */
router.get('/:invoice_id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    console.log('/:invoice_id', req.params.invoice_id);
    if (!req.params.invoice_id) return;

    const invoices = await Invoice.findOne({ _id: req.params.invoice_id })
        .populate('client')
        .populate('products.product');
    console.log('[get invoice from ID]', invoices._id);

    if (invoices) {
        return res.status(200).json(invoices);
    } else {
        return res.status(404).json({ error: 'No invoices found' });
    }
});
/**
 * @description GET /api/invoice/
 */
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (!req.user || !req.user._id) return;

    const invoices = await Invoice.find({ vendor: req.user._id })
        .populate('client')
        .populate('products.product');
    console.log('[get invoices]', invoices.length);

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
    const { id, orgId, vendor, client, billfor, products, tax, status } = req.body;

    if (!req.body.vendor) {
        errors.push({ param: 'no_content', msg: 'Check the fields again' });
        return res.json({ errors: createErrorObject(errors) });
    }

    const formatedProducts = products.map(product => ({ ...product, product: product._id }));
    const fields = {
        vendor,
        client,
        billfor,
        products: formatedProducts,
        tax,
        status
    };
    // find out `_id` from product list and save it as `id`

    // create a new invoice
    if (!orgId) {
        const autoIncId = await getValueForNextSequence('invoice', null);
        const newInvoice = new Invoice({ ...fields, id: autoIncId }).save();
        return res.status(200).json(newInvoice);
    }

    // it is draft, so update it
    const orgInvoice = await Invoice.findOne({ _id: orgId });
    if (orgInvoice.status === 'draft') {
        Object.entries(fields).forEach(([key, value]) => (orgInvoice[key] = value));
        await orgInvoice.save();
        return res.status(200).json(orgInvoice);
    }

    // it was sent already, create a new
    if (orgInvoice.status === 'sent') {
        const autoIncId = await getValueForNextSequence('invoice', id);
        const newInvoice = new Invoice({ ...fields, id: autoIncId }).save();
        return res.status(200).json(newInvoice);
    }
    return res.status(500).json({ success: false });
});

module.exports = router;
