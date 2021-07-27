const { getDatabase, ObjectId } = require('../config/mongodb')
const { hash } = require('../helpers/bcrypt')

class Kahoot {
  static async findAll() {
    return await getDatabase().collection('Users').find().toArray()
  }
  static async register(input) {
    input.password = hash(input.password)
    input.createdAt = new Date().toLocaleDateString() + ' and ' + new Date().toLocaleTimeString()
    return await getDatabase().collection('Users').insertOne(input)
  }
  static async login(email) {
    return await getDatabase().collection('Users').findOne({ email })
  }
  static async findOne(id) {
    return await getDatabase().collection('Users').findOne({_id: ObjectId(id)})
  }
  // static async add(user) {
  //   return await getDatabase().collection('Users').insertOne(user)
  // }
  // static async edit(id, user) {
  //   return await getDatabase().collection('Users').updateOne(
  //     {_id: ObjectId(id)},
  //     {$set: user}
  //   )
  // }
  // static async delete(id) {
  //   return await getDatabase().collection('Users').deleteOne({_id: ObjectId(id)})
  // }
}
module.exports = Kahoot