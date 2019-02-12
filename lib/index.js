'use strict';

const initialFiles = require(`./init/initial-files`);
const initialDependencies = require(`./init/initial-dependencies`);

const buildControllers = require(`./build/build-controllers`);

module.exports = {
  /**
  * Initial function to run this API Builder.
  */
  init: () => {
    initialFiles();
    initialDependencies();
  },

  build: () => {
    buildControllers();
  }
};
