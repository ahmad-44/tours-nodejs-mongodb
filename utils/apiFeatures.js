class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    this.query = this.query.find(queryObj); // localhost:3000/api/v1/tours?duration[$gte]=5&difficulty=easy
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      this.query = this.query.sort(this.queryString.sort); //localhost:3000/api/v1/tours?sort=-price+duration
    } else {
      this.query = this.query.sort('_id');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      this.query = this.query.select(this.queryString.fields);
    } else {
      this.query = this.query.select('-__v'); // __v is a field we want to remove
    }
    return this;
  }

  paginate() {
    // set default to be 100 items per page if pagination filters are not applied
    const page = +this.queryString.page * 1 || 1;
    const limit = +this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    //page=3&limit=10, 1-10, page 1, 11-20 page2, 21-30 page3
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
