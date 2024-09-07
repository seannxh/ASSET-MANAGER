const express = require('express');
const Asset = require('../models/assets');

const router = express.Router();

router.use((req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/user/login');
    }
});

router.get('/new', (req, res) => {
    res.render('assetpost.ejs', { asset: {} });
});



router.get('/', async (req, res) => {
    try {
        const typeFilter = req.query.type || ''; 
        const filter = { username: req.session.username }; 
        
        if (typeFilter) {
            filter.type = typeFilter; 
        }
        const assets = await Asset.find(filter);

        const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

        res.render('asset', {
            asset: assets,
            totalValue: totalValue,
            type: typeFilter,
        });
    } catch (err) {
        console.error('Error fetching assets:', err);
        res.status(500).send('Server error');
    }
});



router.post('/', async (req, res) => {
    try {
        if (Array.isArray(req.body.value)) {
            req.body.value = req.body.value.find(v => v !== '');
        }
        req.body.value = parseFloat(req.body.value);

        if (isNaN(req.body.value)) {
            throw new Error('Invalid value provided');
        }
        req.body.forSale = req.body.forSale === 'on';
        req.body.username = req.session.username;
        const newAsset = new Asset(req.body);
        await newAsset.save();
        res.redirect('/asset');
    } catch (error) {
        console.error('Error creating asset:', error);
        res.status(500).send('Server error');
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const asset = await Asset.findOne({ _id: id, username: req.session.username });
        if (!asset) {
            console.log('Asset not found or you do not have permission to view it');
            return res.status(404).send('Asset not found or unauthorized');
        }
        res.render('assetedit.ejs', { asset });
    } catch (error) {
        console.error('Error fetching asset:', error);
        res.status(500).send('Server error');
    }
});


router.get('/:id/edit', async (req, res) => {
    const id = req.params.id;
    try {
        const asset = await Asset.findOne({ _id: id, username: req.session.username });
        if (!asset) {
            console.log('Asset not found or you do not have permission to edit it');
            return res.status(404).send('Asset not found or unauthorized');
        }
        res.render('assetpost.ejs', { asset });
    } catch (error) {
        console.error('Error fetching asset:', error);
        res.status(500).send('Server error');
    }
});



router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        
        req.body.forSale = req.body.forSale ? true : false;

        const result = await Asset.findOneAndUpdate(
            { _id: id, username: req.session.username },
            req.body,
            { new: true }
        );

        if (!result) {
            return res.status(404).send('Asset not found or unauthorized');
        }

        res.redirect('/asset');
    } catch (error) {
        console.error('Error updating asset:', error);
        res.status(500).send('Server error');
    }
});



router.delete('/:id', async (req, res) => {
    try {
        const assetId = req.params.id;

        const result = await Asset.findOneAndDelete({ _id: assetId, username: req.session.username });

        if (!result) {
            return res.status(404).send('Asset not found or unauthorized');
        }

        res.redirect('/asset');
    } catch (error) {
        console.error('Error deleting asset:', error);
        res.status(500).send('Server error');
    }
});


module.exports = router;
