const express = require('express');
const router = express.Router();


router.get('*', (req, res) => {
    switch (req.originalUrl) {
        case '/':
            res.render('index')
            break;
        case '/request':
            require('../request/request')(data, (response)=>{
                res.send(response)
            })
            break;
        default:
            res.sendStatus(404);
            break;
    }
});
module.exports = router;