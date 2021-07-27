module.exports ={
  apps: [{
    name: 'server ',
    script: 'node ./bin/http.js',
    env: {
      PORT: 80,
    }
  }]
}