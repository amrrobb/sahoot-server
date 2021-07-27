const { getDatabase, ObjectId } = require('../config/mongodb')

class Quizzes {
    static async findAll(userId) {
        const quizzesCollection = getDatabase().collection('Quizzes')
        const quizzes = await quizzesCollection.find({userId: userId}).toArray()
        return quizzes
    }

    static async findOne(id) {

        const quizzesCollection = getDatabase().collection('Quizzes')

        const quizzes = await quizzesCollection.find({
            _id: ObjectId(id)
        }).toArray()

        return quizzes[0]
    }

    static async postQuiz(payload) {
        const { userId, title, questions, timer, mode} = payload
        let result = {userId, title, questions, timer, mode, createdAt: new Date(),
            updatedAt: new Date()}
        let err = {
            message: []
        }
        // if (!userId) {
        //     err.message.push("userId must be filled")
        // }
        if (!title) {
            err.message.push("title must be filled")
        }
        if (!questions) {
            err.message.push("questions must be filled")
        }
        
        if (!timer) {
            err.message.push("timer must be filled")
        }
        if (!mode) {
            err.message.push("mode must be filled")
        }

        if (err.message.length > 0) {
            return err
        }

        const quizzesCollectios = getDatabase().collection('Quizzes')

        let quizzes = await quizzesCollectios.insertOne(result)
        
        result._id = quizzes.insertedId

        return result
    }

    static async putQuiz(payload, id) {
        const { userId, title, questions, timer, mode} = payload
        let result = {userId, title, questions, timer, mode, updatedAt: new Date()}
        
        let err = {
            message: []
        }
        // if (!userId) {
        //     err.message.push("userId must be filled")
        // }
        if (!title) {
            err.message.push("title must be filled")
        }
        // if (!questions) {
        //     err.message.push("questions must be filled")
        // }
        
        if (!timer) {
            err.message.push("timer must be filled")
        }
        if (!mode) {
            err.message.push("mode must be filled")
        }

        if (err.message.length > 0) {
            return err
        }       

        const quizzesCollection = getDatabase().collection('Quizzes')

        quizzesCollection.findOne({_id: ObjectId(id)})
        .then(data => {
            if (data) {
                result.createdAt = data.createdAt
            } else {
                return result.matchedCount = 0
            }
        })
        
        let quizzes = await quizzesCollection.updateOne(
            {
                _id: ObjectId(id)
            }, {
            $set: result
        })
        
        result._id = id
        result.matchedCount = quizzes.matchedCount 

        return result
    }

    static async deleteQuiz(id) {

        const quizzesCollection = getDatabase().collection('Quizzes')

        let quizzes = await quizzesCollection.deleteMany({
            _id: ObjectId(id)
        })
        
        return quizzes
    }

}

module.exports = Quizzes