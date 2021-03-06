const { gql } = require('apollo-server')
const { ApolloError } = require('apollo-server-errors')
const { instanceReports } = require('../axios')

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
        getReportsAll(quizId: String, access_token: String): [Report]
        getReports(id: ID, access_token: String): Report
    }

    extend type Mutation {
        addReports(input: InputReport, access_token: String): Report
        delReports(id: ID, access_token: String): Message
    }  
`

const resolvers = {

    Query: {
        getReportsAll: async(_, args, context) => {
            try {
                const {access_token} = args
                // const {input} = args
                // let reports = await redis.get('reports')
                // reports = JSON.parse(reports)
                // if (reports && (reports[0].userId === context.user.id)) {
                //     return reports
                // } 
                // else {
                //     // redis.del('reports')
                // }
                const {data} = await instanceReports({
                    method: 'get',
                    headers: {
                        access_token: args.access_token
                    }
                })
                // redis.set('reports', JSON.stringify(data))
                // result = data
                return data
            }
            catch (err) {
                throw new ApolloError(err.response.data.message);
            }

        },
        getReports: async (_, args, context) => {
            try {
                const id = args.id
                // let reportById = await redis.get('reportById')
                // reportById = JSON.parse(reportById)
                
                // if (reportById && reportById._id === id) {
                //     return reportById
                // } 
                // else {
                //     // redis.del('reportById')
                // }
                const {data} = await instanceReports({
                    method: 'get',
                    url: `/${id}`,
                    headers: {
                        access_token: args.access_token
                    }
                })
                // redis.set('reportById', JSON.stringify(data))
                return data
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
                        access_token: args.access_token
                    }
                })
                // redis.del('reports')
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
                        access_token: args.access_token
                    }
                })
                // redis.del('reports')
                return ({'message': 'Delete Item Success'})
            }
            catch (err) {
                throw new ApolloError(err.response.data.message);
            }
        }
    }
}


module.exports = { typeDef, resolvers }