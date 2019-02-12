'use strict';

const { exec } = require(`child_process`);

const initialDependencies = () => {
  exec(`npm install && npm install dotenv helmet bcrypt jsonwebtoken passport passport-http passport-http-bearer passport-local`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
    console.log(stderr);
  });

  exec(`npm install sequelize sequelize-cli pg pg-hstore .`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
    console.log(stderr);

    exec(`node_modules/.bin/sequelize init`, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(stdout);
      console.log(stderr);

      exec(`node_modules/.bin/sequelize model:generate --name users --attributes full_name:string,email:string,password:string,address:string,phone:string`, (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(stdout);
        console.log(stderr);
      });

      // exec(`node_modules/.bin/sequelize init`, (err, stdout, stderr) => {
      //   if (err) {
      //     console.error(err);
      //     return;
      //   }
      //   console.log(stdout);
      //   console.log(stderr);
      // });

      // exec(`node_modules/.bin/sequelize init`, (err, stdout, stderr) => {
      //   if (err) {
      //     console.error(err);
      //     return;
      //   }
      //   console.log(stdout);
      //   console.log(stderr);
      // });
    });
  });
};

module.exports = initialDependencies;
