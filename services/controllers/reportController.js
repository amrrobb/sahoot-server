const ModelReports = require('../models/reportModel')

class Controller {
    static async findAllReports (req, res, next) {
        try {
            const userId = req.user.id
            const data = await ModelReports.findAllReports(userId)
            res.status(200).json(data)
        }
        catch(err) {
            next({code: 500})
        }
    }

    static findOneReports (req, res, next) {
        const id = req.params.id
        const userId = req.user.id
        ModelReports.findOneReports(id, userId)
        .then(data => {
            if (data) {
                res.status(200).json(data)
            } else {
                next({code: 404, message: ['Report Not Found']})
            }
        })
        .catch(err => {
            next({code: 500})
        })
    }

    static async createReports (req, res, next) {
        try {
            const userId = req.user.id
            const {quizId, quizTitle, players} = req.body

            let errorInput = []
            !userId && errorInput.push('userId cannot be empty')
            !quizId && errorInput.push('quizId cannot be empty')
            !quizTitle && errorInput.push('quizTitle cannot be empty')
            // !createdAt && errorInput.push('date cannot be empty')
            // !playersCount && errorInput.push('playersCount cannot be empty')
            !players && errorInput.push('players cannot be empty')
            
            if (errorInput.length) {
                next({code: 400, 'message': errorInput})
            }
            const input = {userId, quizId, quizTitle,
                createdAt: new Date(),
                playersCount: players.length, 
                players
            }
            
            const data = await ModelReports.createReports(input)
            res.status(201).json(data)
        }
        catch (err) {
            next({code: 500})
        }
    }  
    
    static deleteReports (req, res, next) {
        const id = req.params.id
        
        ModelReports.deleteReports(id)
        .then(data => {
            if (data) {
                res.status(200).json({'message': 'Delete Item Success'})
            }
            else {
                next({code: 404, message: ['Report Not Found']})
            }
        })
        .catch (err => {
            next({code: 500})
        })
    }
}

module.exports = Controller