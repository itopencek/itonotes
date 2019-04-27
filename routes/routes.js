const express = require('express');
const router = express.Router();


router.get('*', (req, res) => {
    switch (req.originalUrl) {
        case '/':
            res.render('index');
            break;
        case '/request':
            require('../request/request')(data, (response) => {
                res.send(response);
            })
            break;
        case '/start':
            require('../request/start')((response) => {
                res.send(response);
            })
            break;
        default:
            console.log('tu som?')
            res.sendStatus(404)
            break;
    }

});

router.post('*', (req, res) => {
            switch (req.originalUrl) {
                case '/getData':
                    let data = req.body.data;
                    require('../request/getData')(data, (bool, updateData) => {
                        res.send(updateData)
                        
                    })
                    break;
                default:
                    res.sendStatus(404);
                    break;
                }
            })
module.exports = router;