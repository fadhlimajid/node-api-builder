'use strict';

const initialFiles = require(`./init/initial-files`);
const initialDependencies = require(`./init/initial-dependencies`);

const buildRoutes = require(`./build/build-routes`);
const buildControllers = require(`./build/build-controllers`);

module.exports = {
  /**
  * Initial function to run this API Builder.
  */
  init: () => {
    initialFiles();
    initialDependencies();
  },

  /**
  * Build the API based on api-builder.json.
  */
  build: () => {
    buildRoutes();
    buildControllers();
  }
};
