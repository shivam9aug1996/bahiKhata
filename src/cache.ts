class Cache {
  constructor() {
    this.cachedData = [];
  }

  async findIndexById(businessId) {
    return new Promise((resolve, reject) => {
      const index = this.cachedData.findIndex(
        (entry) => entry.businessId === businessId
      );
      resolve(index);
    });
  }

  async hasCache(businessId) {
    const index = await this.findIndexById(businessId);
    return index !== -1;
  }

  async getFromCache(businessId) {
    const index = await this.findIndexById(businessId);
    return index !== -1 ? this.cachedData[index].data : {};
  }

  async setToCache(businessId, data) {
    const index = await this.findIndexById(businessId);
    if (index !== -1) {
      this.cachedData[index].data = data;
    } else {
      this.cachedData.push({ businessId, data });
    }
    return Promise.resolve();
  }

  async invalidateCache(businessId) {
    const index = await this.findIndexById(businessId);
    if (index !== -1) {
      this.cachedData.splice(index, 1);
    }
    return Promise.resolve();
  }
}

// Export a single instance of the Cache class
export default new Cache();
