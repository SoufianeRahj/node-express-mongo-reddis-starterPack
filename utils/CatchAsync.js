// this function is added to remove all the catch blocks
// inside the route handlers, it permits to catch the err
// from the execution of the async route handler and pass
// it to the global error middleware
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
