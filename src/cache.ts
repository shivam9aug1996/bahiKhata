class Cache {
  constructor() {
    this.cachedData = {};
  }

  hasCache(businessId) {
    return this.cachedData[businessId] ? true : false;
  }

  getFromCache(businessId) {
    return this.cachedData[businessId] || {};
  }

  setToCache(businessId, data) {
    this.cachedData[businessId] = data;
  }

  invalidateCache(businessId) {
    delete this.cachedData[businessId];
  }
}

// Export a single instance of the Cache class
export default new Cache();
