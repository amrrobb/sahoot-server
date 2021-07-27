const { gql } = require('apollo-server')
const { ApolloError } = require('apollo-server-errors')
const { instanceReports } = require('../axios')
const Redis = require('ioredis')
const redis = new Redis()

const typeDef = gql`
    type Report {
        _id: ID
        userId: String
        quizId: String
        quizTitle: String
        playersCount: Int
        players: [Player]
        createdAt: Date
    }

    input InputReport {
        quizId: String!
        quizTitle: String!
        players: [inputPlayer]!
    }

    input inputPlayer {
        name: String
        score: Int
    }

    type Player{
        name: String
        score: Int
    } 

    extend type Query {
        getReportsAll(quizId: String): [Report]
        getReports(id: ID): Report
    }

    extend type Mutation {
        addReports(input: InputReport): Report
        delReports(id: ID): Message
    }  
`

const resolvers = {

    Query: {
        getReportsAll: async(_, args, context) => {
            try {
                let result = null
                // const {input} = args
                let reports = await redis.get('reports')
                reports = JSON.parse(reports)
                if (reports && reports[0].userId === context.user.id) {
                    result = reports
                } 
                else {
                    const {data} = await instanceReports({
                        method: 'get',
                        headers: {
                            access_token: context.access_token
                        }
                    })
                    redis.set('reports', JSON.stringify(data))
                    result = data
                }
                return result
            }
            catch (err) {
                throw new ApolloError(err.response.data.message);
            }

        },
        getReports: async (_, args, context) => {
            try {
                const id = args.id
                let reportById = await redis.get('reportById')
                reportById = JSON.parse(reportById)
                
                if (reportById && reportById._id === id) {
                    return reportById
                } 
                else {
                    const {data} = await instanceReports({
                        method: 'get',
                        url: `/${id}`,
                        headers: {
                            access_token: context.access_token
                        }
                    })
                    return data
                }
            }
            catch (err) {
                throw new ApolloError(err.response.data.message);
            }
            
        }
    },
    Mutation: {
        addReports: async(_, args, context) => {
            try {
                const {quizTitle, quizId, players} = args.input
                const input = {quizId, quizTitle, players}
                
                const {data} = await instanceReports({
                    method: 'post',
                    data: input,
                    headers: {
                        access_token: context.access_token
                    }
                })
                redis.del('reports')
                return data
            }
            catch (err) {
                throw new ApolloError(err.response.data.message);
            }
        },
        delReports: async(_, args, context) => {
            try {
                const id = args.id
                await instanceReports({
                    method: 'delete',
                    url: `/${id}`,
                    headers: {
                        access_token: context.access_token
                    }
                })
                redis.del('reports')
                return ({'message': 'Delete Item Success'})
            }
            catch (err) {
                throw new ApolloError(err.response.data.message);
            }
        }
    }
}


module.exports = { typeDef, resolvers }