const axios = require('axios')
const uri = 'http://54.166.28.112'

const instanceReports = axios.create({
    baseURL: `${uri}/reports`,
  });

const instanceQuizzes = axios.create({
    baseURL: `${uri}/quizzes`
})

const instanceUsers = axios.create({
  baseURL: `${uri}`
})


module.exports = {instanceReports, instanceQuizzes, instanceUsers}


