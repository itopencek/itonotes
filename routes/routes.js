const express = require('express');
const router = express.Router();


router.get('*', (req, res) => {
    switch (req.originalUrl) {
        case '/':
            res.render('index');
            break;
        case '/start':
            require('../request/start')((response) => {
                res.send(response);
            })
            break;
        default:
            res.sendStatus(404)
            break;
    }

});

router.post('*', (req, res) => {
    let data;
    if (req.body.data) {
        data = req.body.data;
    }
    switch (req.originalUrl) {

        //getting content for existing url
        case '/getData':
            require('../request/getData')(data, (bool, updateData) => {
                res.send(updateData)
            })
            break;

        //updating content
        case '/update':
            let hash = req.body.hash;
            require('../request/update')(data, hash, (response) => {
                res.send(response);
            })
            break;
            
        //default
        default:
            res.sendStatus(404);
            break;
    }
})
module.exports = router;