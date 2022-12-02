class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1 - FILTERING
    const queryObj = { ...this.queryString }; // shallow copy of the object

    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2 - ADVANCED FILTERING, to add the option to pass gt, gte, lt, lte as possible filters
    // it is done by the following syntax path?queryparam1[gte]=val1
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|ge|lte|lt)\b/g, (match) => `$${match}`);
    const newQueryObj = JSON.parse(queryStr);

    //creating the query instance with the find method applied on the model
    this.query = this.query.find(newQueryObj);

    return this; // to permit chaining methods on class instance
  }

  sort() {
    /* 3 - Sorting
     the sorting here will be done by passing a property or multiple properties to the sort param
     if multiple params are passed, they will be splitted by a coma (implementation done here)
     the sorting is done here by chaining the sort method to the query object that returns
     another query object */

    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      // sorting by default by descending order of creation date
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    /* 4 - Field Limiting
     the field limiting is done by passing a property or multiple properties to the fields param
     if multiple params are passed, they will be splitted by a coma (implementation here)
     the field limiting is done here by chaining the select to the query object that returns
     another query object */
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      // removing fields that are not useful for the api consumer
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    /* 5 - pagination
     works by passing 2 query params, limit and page
     this is done using 2 methods for the query instance
     skip(arg1) which skips arg1 number of documents
     and limit(arg2) method that limits the number of documents to arg2 */

    const page = this.queryString.page * 1 || 1; // to convert a string to an int
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
