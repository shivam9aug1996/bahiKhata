class Cache {
  constructor() {
    this.cachedData = [];
  }

  findIndexById(businessId) {
    return this.cachedData.findIndex(
      (entry) => entry.businessId === businessId
    );
  }

  hasCache(businessId) {
    return this.findIndexById(businessId) !== -1;
  }

  getFromCache(businessId) {
    const index = this.findIndexById(businessId);
    return index !== -1 ? this.cachedData[index].data : {};
  }

  setToCache(businessId, data) {
    const index = this.findIndexById(businessId);
    if (index !== -1) {
      this.cachedData[index].data = data;
    } else {
      this.cachedData.push({ businessId, data });
    }
  }

  invalidateCache(businessId) {
    const index = this.findIndexById(businessId);
    if (index !== -1) {
      this.cachedData.splice(index, 1);
    }
  }
}

// Export a single instance of the Cache class
export default new Cache();
