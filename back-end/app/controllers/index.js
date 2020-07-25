const express = require('express');
const router = express.Router();
// const authMiddleware = require('../middleware/AuthMiddleware');

router.use('/auth', require('./auth'));
router.use('/user', require('./user'));
router.use('/arena', require('./arena'));
router.use('/round', require('./round'));
router.use('/ranking', require('./ranking'));

router.get("/healthcheck", function (req, res) {
    res.send("OK");
});

// router.get("/hello", authMiddleware.validate, function (req, res) {
//   res.send("Hello from our node server");x
// });

module.exports = router;
