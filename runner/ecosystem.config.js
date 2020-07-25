module.exports = {
  apps: [{
    name: 'mutantarena-runner',
    script: 'src/index.js',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
