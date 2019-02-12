'use strict';

const { exec } = require(`child_process`);
const fs = require(`fs`);

const initialDependencies = () => {
  try {
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

        exec(`node_modules/.bin/sequelize model:generate --name users --attributes full_name:string,email:string,password:string,address:string,phone:string --underscored`, (err, stdout, stderr) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(stdout);
          console.log(stderr);

          const migrations = fs.readdirSync(`./database/migrations`, `utf8`);
          const userDir = migrations.find(x => x.match(/.*-create-users.js/));

          fs.readFile(`./database/migrations/${userDir}`, `utf8`, (err, data) => {
            if (err) throw err;

            const dataArray = data.split(`\n`);
            dataArray[23] += `(16)`;
            dataArray.splice(17, 0, `        allowNull: false,`);
            dataArray.splice(14, 0, `        allowNull: false,`);
            dataArray.splice(14, 0, `        unique: true,`);

            const finalUserData = dataArray.join(`\n`);

            fs.writeFileSync(`./database/migrations/${userDir}`, finalUserData, `utf8`);
          });
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
  } catch (error) {
    console.error(error);
  }
};

module.exports = initialDependencies;
