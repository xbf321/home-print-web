module.exports = {
  apps: [
    {
      name: 'home-print-web',
      port: '7020',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs'
    }
  ]
}