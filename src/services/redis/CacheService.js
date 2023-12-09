const redis = require('redis');

class CacheService {
  constructor() {
    this.client = redis.createClient({
      url: process.env.REDIS_SERVER,
    });

    this.client.on('error', (error) => {
      console.error({
        error,
        host: process.env.REDIS_SERVER,
      });
    });

    this.client.on('ready', () => {
      console.log('Cache service ready');
    });

    this.client.connect();
  }

  async set(key, value, expirationInSecond = 3600) {
    const result = await this.client.set(key, value, {
      EX: expirationInSecond,
    });

    return result;
  }

  async get(key) {
    const result = await this.client.get(key);

    if (result == null) {
      return null;
    }

    return result;
  }

  async delete(key) {
    const result = await this.client.del(key);

    return result;
  }
}

module.exports = CacheService;
