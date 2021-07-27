const router = require('express').Router()
const ControllerReports = require('../controllers/reportController')

router.get('/', ControllerReports.findAllReports)
router.get('/:id', ControllerReports.findOneReports)
router.post('/', ControllerReports.createReports)
router.delete('/:id', ControllerReports.deleteReports)

module.exports = router