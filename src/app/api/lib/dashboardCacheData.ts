let cachedData = {};

export function getFromCache(businessId) {
  return cachedData[businessId] || null;
}

export function setToCache(businessId, data) {
  cachedData[businessId] = data;
}

export function invalidateCache(businessId) {
  delete cachedData[businessId];
}
