const Redis = require("ioredis")
const redis = new Redis({
    port: 10266, // Redis port
    host: "redis-10266.c252.ap-southeast-1-1.ec2.redns.redis-cloud.com", // Redis host
    username: "default", // needs Redis >= 6
    password: process.env.REDIS_PASSWORD,
    db: 0, // Defaults to 0
  })

module.exports = redis