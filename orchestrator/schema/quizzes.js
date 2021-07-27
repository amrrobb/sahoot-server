const { gql } = require("apollo-server");

const { ApolloError } = require("apollo-server");
const Redis = require("ioredis");
const redis = new Redis();
const { instanceQuizzes } = require("../axios");

const typeDef = gql`
  type Questions {
    type: String
    question: String
    image: String
    choose: [String]
    answer: String
  }

  type Quizzes {
    _id: ID
    userId: String
    title: String
    questions: [Questions]
    timer: Int
    mode: String
    createdAt: Date
    updatedAt: Date
  }

  input InputQuestion {
    type: String
    question: String
    image: String
    choose: [String]
    answer: String
  }

  input InputQuizzes {
    title: String
    questions: [InputQuestion]
    timer: Int
    mode: String
  }

  extend type Query {
    Quizzes: [Quizzes]
    QuizzesById(id: ID): Quizzes
  }

  extend type Mutation {
    DeleteQuizzes(id: ID): Message
    EditQuizzes(
      id: ID, input: InputQuizzes
    ): Quizzes
    AddQuizzes(
      input: InputQuizzes
    ): Quizzes
  }
`;

const resolvers = {
  Query: {
    Quizzes: async (_, args, context) => {
      try {
        let QuizzesRedis = await redis.get("Quizzes");
        QuizzesRedis = JSON.parse(QuizzesRedis);
        if (QuizzesRedis && QuizzesRedis[0].userId === context.user.id) {
          return QuizzesRedis
        } else {
          const Quizzes = await instanceQuizzes({
            url: '/',
            method: 'get',
            headers: {
              access_token: context.access_token
            }
          })
          // console.log(JSON.stringify(Quizzes.data));
          redis.set("Quizzes", JSON.stringify(Quizzes.data));
          return Quizzes.data
        }
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    QuizzesById: async (_, args, context) => {
      const QuizzesByIdRadis = await redis.get("QuizzesById")

      if (QuizzesByIdRadis) {
        const data = JSON.parse(QuizzesByIdRadis);
        // console.log(data._id);
        // console.log(args.id, 'ini args');
        if (data._id === args.id) {
          // console.log('masuk');
          return JSON.parse(QuizzesByIdRadis);
        } else {
          // console.log('else');
          redis.del("QuizzesById");
          const dataQuiz = await instanceQuizzes.get("/" + args.id);
          redis.set("QuizzesById", JSON.stringify(dataQuiz.data));
        }
      } else {
        const dataQuiz = await instanceQuizzes.get("/" + args.id);
        redis.set("QuizzesById", JSON.stringify(dataQuiz.data));
      }
    },
  },
  Mutation: {
    DeleteQuizzes: async (_, args, context) => {
      try {
        const destroyQuiz = await instanceQuizzes({
          url: `/${args.id}`,
          method: 'delete',
          headers: {
            access_token: context.access_token
          }
        });
        redis.del("Quizzes");
        return destroyQuiz.data
      } catch (err) {
        // console.log(err.response.data.message);
        throw new ApolloError(err.response.data.message);
      }
    },
    EditQuizzes: async (_, args, context) => {
      try {
        const {title, questions, timer, mode } = args.input
        const data = {title, questions, timer, mode } 
        const updateQuizzes = await instanceQuizzes({
          url: `/${args.id}`,
          method: 'put',
          data: data,
          headers: {
            access_token: context.access_token
          }
        });
        redis.del("Quizzes");
        return updateQuizzes.data;
      } catch (err) {
        throw new ApolloError(err.response.data.message);
      }
    },
    AddQuizzes: async (_, args, context) => {
      try {
        const {title, questions, timer, mode } = args.input
        const data = {title, questions, timer, mode } 
        const postQuizzes = await instanceQuizzes({
          url: '/',
          method: 'post',
          data: data,
          headers: {
            access_token: context.access_token
          }
        });

        // console.log(postQuizzes.data, 'masuk<<<<<<<');
        redis.del("Quizzes");
        return postQuizzes.data;
      } catch (err) {
        throw new ApolloError(err.response.data.message);
      }
    },
  },
};

module.exports = { typeDef, resolvers };
