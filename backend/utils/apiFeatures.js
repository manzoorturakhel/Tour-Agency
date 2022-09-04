class APIFeautures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    console.log("filter");
    // console.log("only Query:",this.query);
    //console.log("Query with find Method:",this.query.find());
    const queryObj = { ...this.queryString };

    const exculdeQuery = ["limit", "page", "fields", "sort"];

    // if queryObj includes the excludedquery then we delete them for queryObj

    exculdeQuery.forEach((el) => delete queryObj[el]);

    // console.log(queryObj);
    //advanced Filtering for gte,gt,lte,lt
    let advancedFilter = JSON.stringify(queryObj);
    // replacing the gte and other with $gte and others to match the query
    advancedFilter = advancedFilter.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    // console.log(advancedFilter);

    // Tour.find({difficulty:'easy',duration:{$gte:5}})
    this.query.find(JSON.parse(advancedFilter));

    //let query=  Tour.find(JSON.parse(advancedFilter));
  }

  sort() {
    if (this.queryString.sort) {
      console.log("sorting");
      // this is ascending order inorder to sort it in descending order we should put - infront of it.
      const sortBy = this.queryString.sort.split(",").join(" ");
      //console.log("sort is included")
      this.query.sort(sortBy);
    } else {
      // if there is no sort query we will sort it based on createdData(newest one)
      // query=query.sort('-createdAt');
      this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      console.log("limiting fields");

      const fields = this.queryString.fields.split(",").join(" ");
      this.query.select(fields);
    } else {
      this.query.select("-__v"); // adding - will exclude the field.
    }
    return this;
  }

  async pagination() {
    // console.log("paginations");
    // const page = this.queryString.page * 1 || 1;
    // const limit = this.queryString.limit * 1 || 4;
    // const skip = (page - 1) * limit;
    // // const totalDocs= this.totalDocs();
    // // console.log(totalDocs);
    // // if(skip>=totalDocs) throw new Error("couldn't find the page")
    // //console.log(typeof +page,typeof +limit,typeof skip,skip,page)
    // this.query.skip(skip).limit(limit);
    // return this;
  }
}
module.exports = APIFeautures;
