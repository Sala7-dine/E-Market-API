import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 60 }); // cache expires after 60 seconds

export const cacheMiddleware = (req, res, next) => {
  if (req.method !== 'GET') {
    return next();
  }

  const key = req.originalUrl; // unique key for each route
  const cachedData = cache.get(key);

  if (cachedData) {
    console.log("Serving from cache:", key);
    return res.json(cachedData);
  }

  // modify res.json to store the data in cache before sending
  res.sendResponse = res.json;
  res.json = (body) => {
    cache.set(key, body);
    res.sendResponse(body);
  };

  next();
};
