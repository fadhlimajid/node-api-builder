'use strict';

const initialFiles = require(`./initial-files`);
const initialDependencies = require(`./initial-dependencies`);
const modelBuild = require(`./model-build.js`);

module.exports = {
  /**
  * Initial function to run this API Builder.
  */
  init: async () => {
    await initialFiles();
    await initialDependencies();
  },

  build: async (a) => {
    await modelBuild();
  }
};
