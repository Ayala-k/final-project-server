const usersRoute = require("./users");
const professionalsRoute = require("./professionals");
const commentsRoute = require("./comments");
const jobsRoute = require("./jobs");
const jobOffersRoute = require("./jobOffers");

exports.routesInit = (app) => {
  app.use("/user",usersRoute);
  app.use("/professional",professionalsRoute);
  app.use("/comment",commentsRoute);
  app.use("/job",jobsRoute);
  app.use("/jobOffer",jobOffersRoute);
}