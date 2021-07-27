const { getDatabase, ObjectId } = require('../config/mongodb')

class Model {
    static collection() {
        return getDatabase().collection('Reports')
    }

    static async findAllReports (userId) {
        try {
            const data = await Model.collection().find({userId}).toArray()
            return data
            
        } catch (error) {}
    }

    static async findOneReports (id, userId) {
        try {
            const data = await Model.collection().findOne({"_id": ObjectId(id), userId})
            return data
        } catch (error) {}
    }

    static async createReports (input) {
        try {
            const data = Model.collection()
            const { insertedId } = await data.insertOne(input)
            return await data.findOne(insertedId)
            
        } catch (error) {}
    }

    static async deleteReports (id) {
        try {
            const data = Model.collection()
            await data.findOne({_id: ObjectId(id)})
            
            await data.deleteOne(
                {"_id": ObjectId(id)}, 
            )
            return true
                       
        } catch (error) {}

    }
}

module.exports = Model