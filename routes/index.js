const express = require('express')
const router = express.Router()
const routerQuizzes = require('./quizRoutes')
const routeReports = require('./reportRoutes')
const errorHandler = require('../middlewares/errorHandler')
const AuthController = require('../controllers/authController')
const authentication = require('../middlewares/authentification')

router.get('/', (req, res) => {
    res.send("home test");
})

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.post('/googlelogin', AuthController.googlelogin)

router.use(authentication)
router.use('/quizzes', routerQuizzes)
router.use('/reports', routeReports)

router.use(errorHandler)

module.exports = router