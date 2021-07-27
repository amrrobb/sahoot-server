const express = require('express')
const router = express.Router()
const Controller = require('../controllers/quizController')

router.get('/', Controller.getQuizHandler)

router.post('/', Controller.postQuizHandler)

router.get('/:id', Controller.getQuizByIdHandler)

router.put('/:id', Controller.putQuizHandler)

router.delete('/:id', Controller.deleteQuizHandler)



module.exports = router