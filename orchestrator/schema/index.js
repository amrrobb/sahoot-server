const { gql } = require('apollo-server')
const { merge } = require('lodash')
const {makeExecutableSchema} = require('@graphql-tools/schema')
const { typeDef: Reports, resolvers: reportsResolvers } = require('./reports')
const { typeDef: Quizzes, resolvers: quizResolvers } = require('./quizzes')
const { typeDef: Users, resolvers: userResolvers } = require('./user')

const { GraphQLScalarType, Kind } = require('graphql')
const dayjs = require('dayjs')
const localizedFormat = require('dayjs/plugin/localizedFormat')


const typeDef = gql`
  scalar Date

  type Message {
      message: String
  }

  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  parseValue(value) {
    return dayjs(value); // Convert incoming integer to Date
  },
  serialize(value) {
    dayjs.extend(localizedFormat)
    return dayjs(value).format('LLLL') // Convert outgoing Date to integer for JSON
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return dayjs(ast.value); // Convert hard-coded AST string to integer and then to Date
    }
    return null; // Invalid hard-coded value (not an integer)
  },
});

const resolvers = {
  Date: dateScalar
};

const schema = makeExecutableSchema({
    typeDefs: [ typeDef, Reports, Quizzes, Users],
    resolvers: merge(resolvers, reportsResolvers, quizResolvers, userResolvers)
});

module.exports = schema