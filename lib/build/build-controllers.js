'use strict';

const fs = require(`fs`);
const { exec } = require(`child_process`);

const variableName = (variable) => {
  try {
    const varArr = variable.split(`_`);
    for (let i = 0; i < varArr.length; i++) {
      let element = varArr[i];
      if (i) {
        element = element[0].toUpperCase() + element.slice(1);
        varArr.splice(i, 1, element);
      }
    }

    return varArr.join(``);
  } catch (error) {
    console.error(error);
  }
};

const responseName = (variable) => {
  try {
    const varArr = variable.split(`_`);
    for (let i = 0; i < varArr.length; i++) {
      let element = varArr[i];
      element = element[0].toUpperCase() + element.slice(1);
      varArr.splice(i, 1, element);
    }

    return varArr.join(` `);
  } catch (error) {
    console.error(error);
  }
};

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

const functions = {
  list: (name, associations, schema, softDelete) => {
    try {
      const varName = variableName(name);
      const fields = [];
      const searchable = [];
      const association = [];

      const searchableData = schema.filter(x => {
        fields.push(x.field);
        return x.searchable;
      }).map(x => x.field);

      for (let i = 0; i < searchableData.length; i++) {
        const element = searchableData[i];
        searchable.push(`\n          { ${element}: { [Op.iLike]: \`%\${search}%\` } }`);
      }

      for (let i = 0; i < associations.length; i++) {
        const element = associations[i];

        let associationData = `{\n          model: ${variableName(element.target)},\n          as: \`${element.as}\`\n        }`;
        if (i) associationData = ` ${associationData}`;

        association.push(associationData);
      }

      const controllerArray = [
        `  index: async (req, res) => {`,
        `    try {`,
        `      const search = req.query.search;`,
        `      const page = req.query.page || 1;`,
        `      const limit = req.query.limit || 20;`,
        `      const offset = limit * (page - 1);`,
        ``,
        `      let where = {${softDelete ? ` deleted_at: { [Op.ne]: null } ` : ``}};`,
        `      if (search) {`,
        `        const condition = [${[...searchable]}${searchable.length ? `\n        ];` : `];`}`,
        `        where = {${softDelete ? `\n          deleted_at: { [Op.ne]: null },` : ``}`,
        `          [Op.or]: condition`,
        `        };`,
        `      }`,
        ``,
        `      const ${varName}Data = await ${varName}.findAll({`,
        `        limit,`,
        `        offset,`,
        `        where${associations.length ? `,\n        include: [${[...association]}]` : ``}`,
        `      });`,
        ``,
        `      return res.status(200).json({ error: null, data: ${varName}Data });`,
        `    } catch (error) {`,
        `      console.error(error);`,
        `      return res.status(500).json({ error, data: null });`,
        `    }`,
        `  }`
      ];

      return controllerArray;
    } catch (error) {
      console.error(error);
    }
  },

  detail: (name, associations, schema, softDelete) => {
    try {
      const varName = variableName(name);
      const resName = responseName(name);
      const association = [];

      for (let i = 0; i < associations.length; i++) {
        const element = associations[i];

        let associationData = `{\n          model: ${variableName(element.target)},\n          as: \`${element.as}\`\n        }`;
        if (i) associationData = ` ${associationData}`;

        association.push(associationData);
      }

      const controllerArray = [
        `  show: async (req, res) => {`,
        `    try {`,
        `      const ${varName}Data = await ${varName}.findOne({`,
        `        where: {`,
        `          id: req.params.id${softDelete ? `,\n          deleted_at: { [Op.ne]: null }` : ``}`,
        `        }${associations.length ? `,\n        include: [${[...association]}]` : ``}`,
        `      });`,
        `      if (!${varName}Data) return res.status(404).json({ error: \`${resName} Data not Found.\`, data: null });`,
        ``,
        `      return res.status(200).json({ error: null, data: ${varName}Data });`,
        `    } catch (error) {`,
        `      console.error(error);`,
        `      return res.status(500).json({ error, data: null });`,
        `    }`,
        `  }`
      ];

      return controllerArray;
    } catch (error) {
      console.error(error);
    }
  },

  create: (name, associations, schema, softDelete) => {
    try {
      const varName = variableName(name);
      const bodyData = [];

      for (let i = 0; i < schema.length; i++) {
        const element = schema[i];

        bodyData.push(element.field === variableName(element.field) ? element.field : `${element.field}: ${variableName(element.field)}`);
      }

      const controllerArray = [
        `  create: async (req, res) => {`,
        `    try {`,
        `      const {\n        ${bodyData.join(`,\n        `)}`,
        `      } = req.body;`,
        ``,
        `      const ${varName}Data = await ${varName}.create({\n        ${bodyData.join(`,\n        `)}`,
        `      });`,
        ``,
        `      return res.status(200).json({ error: null, data: ${varName}Data });`,
        `    } catch (error) {`,
        `      console.error(error);`,
        `      return res.status(500).json({ error, data: null });`,
        `    }`,
        `  }`
      ];

      return controllerArray;
    } catch (error) {
      console.error(error);
    }
  },

  update: (name, associations, schema, softDelete) => {
    try {
      const varName = variableName(name);
      const resName = responseName(name);
      const bodyData = [];
      const updateData = [];

      for (let i = 0; i < schema.length; i++) {
        const element = schema[i];

        bodyData.push(element.field === variableName(element.field) ? element.field : `${element.field}: ${variableName(element.field)}`);
        updateData.push(element.field === variableName(element.field) ? `      ${varName}Data.${element.field} = ${element.field} || ${varName}Data.${element.field};` : `      ${varName}Data.${element.field} = ${variableName(element.field)} || ${varName}Data.${element.field};`);
      }

      const controllerArray = [
        `  update: async (req, res) => {`,
        `    try {`,
        `      const {\n        ${bodyData.join(`,\n        `)}`,
        `      } = req.body;`,
        ``,
        `      const ${varName}Data = await ${varName}.findOne({`,
        `        where: {`,
        `          id: req.params.id${softDelete ? `,\n          deleted_at: { [Op.ne]: null }` : ``}`,
        `        }`,
        `      });`,
        `      if (!${varName}Data) return res.status(404).json({ error: \`${resName} Data not Found.\`, data: null });`,
        ``,
        updateData.join(`\n`),
        ``,
        `      const ${varName}Updated = await ${varName}Data.save();`,
        ``,
        `      return res.status(200).json({ error: null, data: ${varName}Updated });`,
        `    } catch (error) {`,
        `      console.error(error);`,
        `      return res.status(500).json({ error, data: null });`,
        `    }`,
        `  }`
      ];

      return controllerArray;
    } catch (error) {
      console.error(error);
    }
  },

  delete: (name, associations, schema, softDelete) => {
    try {
      const varName = variableName(name);
      const resName = responseName(name);

      const deleteArray = softDelete
        ? [
          `      ${varName}Data.deleted_at = new Date();`,
          `\n      await ${varName}Data.save();`
        ]
        : [
          `      await ${varName}.destroy({`,
          `        where: {`,
          `          id: req.params.id`,
          `        }`,
          `      });`
        ];

      const controllerArray = [
        `  delete: async (req, res) => {`,
        `    try {`,
        `      const ${varName}Data = await ${varName}.findOne({`,
        `        where: {`,
        `          id: req.params.id${softDelete ? `,\n          deleted_at: { [Op.ne]: null }` : ``}`,
        `        }`,
        `      });`,
        `      if (!${varName}Data) return res.status(404).json({ error: \`${resName} Data not Found.\`, data: null });`,
        ``,
        deleteArray.join(`\n`),
        ``,
        `      return res.status(200).json({ error: null, data: {} });`,
        `    } catch (error) {`,
        `      console.error(error);`,
        `      return res.status(500).json({ error, data: null });`,
        `    }`,
        `  }`
      ];

      return controllerArray;
    } catch (error) {
      console.error(error);
    }
  }
};

module.exports = () => {
  exec(`mkdir app/controllers`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Controllers folder is successfully made.`);
    console.log(stdout);
    console.log(stderr);
  });

  const modelJSON = JSON.parse(fs.readFileSync(`./api-builder.json`, `utf8`));

  for (let i = 0; i < modelJSON.length; i++) {
    const currentModel = modelJSON[i];
    const methods = [];
    const models = [(currentModel.name === variableName(currentModel.name) ? currentModel.name : `${currentModel.name}: ${variableName(currentModel.name)}`)];

    for (let j = 0; j < currentModel.associations.length; j++) {
      const element = currentModel.associations[j];

      models.push((element.target === variableName(element.target) ? element.target : `${element.target}: ${variableName(element.target)}`));
    }

    if (currentModel.controllers.length) {
      for (let j = 0; j < currentModel.controllers.length; j++) {
        const currentMethod = currentModel.controllers[j];

        methods.push((functions[currentMethod](currentModel.name, currentModel.associations, currentModel.schema, currentModel.softDelete)).join(`\n`));
      }
    }

    if (currentModel.controllers.length) {
      const controllerData = [
        `'use strict';`,
        ``,
        `const Sequelize = require(\`sequelize\`);`,
        ``,
        `const {\n  ${models.join(`,\n  `)} } = require(\`../models\`);`,
        ``,
        `const Op = Sequelize.Op;`,
        ``,
        `module.exports = {\n${methods.join(`,\n\n`)}`,
        `};`,
        ``
      ];

      const controllers = controllerData.join(`\n`);

      fs.writeFile(`./app/controllers/${titleName(currentModel.name)}Controller.js`, controllers, `utf8`, (err) => {
        if (err) {
          console.error(err);
          return;
        }

        console.log(`app/controllers/${titleName(currentModel.name)}Controller.js is successfully made.`);
      });
    };
  }
};
