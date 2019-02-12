'use strict';

const fs = require(`fs`);

const initialFiles = require(`./initial-files`);
const initialDependencies = require(`./initial-dependencies`);

module.exports = {
  /**
  * Initial function to run this API Builder.
  */
  init: async () => {
    await initialFiles();
    await initialDependencies();
  },

  check: () => {
    const migrations = fs.readdirSync(`./database/migrations`, `utf8`);

    const userDir = migrations.find(x => x.match(/.*-create-users.js/));

    // console.log(userDir);
    fs.readFile(`./database/migrations/${userDir}`, `utf8`, (err, data) => {
      if (err) throw err;

      const arr = data.split(`\n`);
      arr[23] += `(16)`;
      arr.splice(17, 0, `        allowNull: false,`);
      arr.splice(14, 0, `        allowNull: false,`);
      arr.splice(14, 0, `        unique: true,`);
      console.log(arr.join(`\n`));
    });

    // , (err, data) => {
    //   if (err) throw err;

    //   dir = data.find(x => x.match(/.*-create-users.js/));
    //   console.log(dir);

    //   fs.readFile(`.database/migrations/${dir}`);
    // }
    // console.log(dir);
  }
};
