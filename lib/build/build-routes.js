'use strict';

const fs = require(`fs`);
const { exec } = require(`child_process`);

const titleName = (variable) => {
  try {
    const varArr = variable.split(`_`);
    for (let i = 0; i < varArr.length; i++) {
      let element = varArr[i];
      element = element[0].toUpperCase() + element.slice(1);
      varArr.splice(i, 1, element);
    }

    return varArr.join(``);
  } catch (error) {
    console.error(error);
  }
};

module.exports = async () => {
  try {
    await exec(`rm -rf ./routes/*`, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(stdout);
      console.log(stderr);
    });

    const modelJSON = JSON.parse(fs.readFileSync(`./api-builder.json`, `utf8`));
    const controllers = [];
    const methods = [];

    for (let i = 0; i < modelJSON.length; i++) {
      const currentModel = modelJSON[i];
      const modelMethod = [];
      controllers.push(`const ${titleName(currentModel.name)}Controller = require(\`../controllers/${titleName(currentModel.name)}Controller.js\`);`);

      if (currentModel.controllers.length) {
        for (let j = 0; j < currentModel.controllers.length; j++) {
          const currentMethod = currentModel.controllers[j];

          if (currentMethod === `list`) {
            modelMethod.push(`router.get(\`/${currentModel.name}\`, ${titleName(currentModel.name)}Controller.index);`);
          }
          if (currentMethod === `detail`) {
            modelMethod.push(`router.get(\`/${currentModel.name}/:id\`, ${titleName(currentModel.name)}Controller.show);`);
          }
          if (currentMethod === `create`) {
            modelMethod.push(`router.post(\`/${currentModel.name}\`, ${titleName(currentModel.name)}Controller.create);`);
          }
          if (currentMethod === `update`) {
            modelMethod.push(`router.patch(\`/${currentModel.name}/:id\`, ${titleName(currentModel.name)}Controller.update);`);
          }
          if (currentMethod === `delete`) {
            modelMethod.push(`router.delete(\`/${currentModel.name}/:id\`, ${titleName(currentModel.name)}Controller.delete);`);
          }
        }

        methods.push(modelMethod.join(`\n`));
      }
    }

    const routesData = [
      `'use strict';`,
      ``,
      `const express = require(\`express\`);`,
      ``,
      `const router = express.Router();`,
      ``,
      controllers.join(`\n`),
      ``,
      methods.join(`\n\n`),
      ``,
      `module.exports = router;`,
      ``
    ];

    const routes = routesData.join(`\n`);

    fs.writeFile(`./routes/api.js`, routes, `utf8`, (err) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(`routes/api.js is successfully made.`);
    });
  } catch (error) {
    console.error(error);
  }
};
