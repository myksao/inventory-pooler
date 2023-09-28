exports.ifEmpty = function (data) {
  if (typeof data === "number" || typeof data === "boolean") {
    return false;
  }
  if (typeof data === "undefined" || data === null || data === "null") {
    return true;
  }
  if (typeof data.length !== "undefined") {
    if (/^[\s]*$/.test(data.toString())) {
      return true;
    }
    return data.length === 0;
  }
  let count = 0;
  for (const i in data) {
    if (data.hasOwnProperty(i)) {
      count++;
    }
  }
  return count === 0;
};

exports.paginationLinks = function (path, currentUrl, total, page, limit) {
  // let total = result.count;

  const lastPage = Math.ceil(total / limit);
  let nextPage = parseInt(page) + 1;
  let prevPage = page - 1;
  const from = prevPage * limit + 1;
  const to = total < limit ? total : nextPage * limit - limit;
  if (prevPage < 1) {
    prevPage = null;
  }
  if (nextPage > lastPage) {
    nextPage = null;
  }

  // let path = `${req.protocol}://${req.get('host')}${req.baseUrl}/task/all/`;
  const firstPageUrl = `${path}?pageNo=1&noOfRows=${limit}`;
  const lastPageUrl = `${path}?pageNo=${lastPage}&noOfRows=${limit}`;
  const nextPageUrl =
    nextPage == null ? null : `${path}?pageNo=${nextPage}&noOfRows=${limit}`;
  const prevPageUrl =
    prevPage == null ? null : `${path}?pageNo=${prevPage}&noOfRows=${limit}`;

  return {
    firstPageUrl,
    lastPageUrl,
    nextPageUrl,
    prevPageUrl,
    // self:req.protocol + '://' + req.get('host') + req.originalUrl,
    self: currentUrl,
    meta: {
      total,
      lastPage,
      nextPage,
      prevPage,
      from,
      to,
    },
  };
};
