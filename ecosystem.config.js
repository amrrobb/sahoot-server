module.exports = {
  apps : [{
    name: "app",
    script: "node ./orchestrator/app.js",
    env: {
      PORT: 80,
    }
  }, {
     name: 'services',
     script: 'node ./services/bin/http.js'
  }]
}