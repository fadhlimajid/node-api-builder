'use strict';

const fs = require(`fs`);
// const { exec } = require(`child_process`);

// const routes = [];

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

const functions = {
  list: (name, associations, schema, softDelete) => {
    try {
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
        `  list: async (req, res) => {`,
        `    try {`,
        `      const search = req.query.search;`,
        `      const page = req.query.page || 1;`,
        `      const limit = req.query.limit || 20;`,
        `      const offset = limit * (page - 1);`,
        ``,
        `      let where = {${schema.softDelete ? ` deleted_at: { [Op.ne]: null } ` : ``}};`,
        `      if (search) {`,
        `        const condition = [${[...searchable]}${searchable.length ? `\n        ];` : `];`}`,
        `        where = { [Op.or]: condition };`,
        `      }`,
        ``,
        `      const ${name}Data = await ${name}.findAll({`,
        `        limit,`,
        `        offset,`,
        `        where${associations.length ? `,\n        include: [${[...association]}]` : ``}`,
        `      });`,
        ``,
        `      return res.status(200).json({ error: null, data: ${name}Data });`,
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

  detail: (name, association, schema, softDelete) => {
    try {
      const controllerArray = [
        `    try {`,
        ``,
        `    } catch (error) {`,
        `      console.error(error);`,
        `      return res.status(500).json({ error, data: null });`,
        `    }`
      ];

      return controllerArray;
    } catch (error) {
      console.error(error);
    }
  },

  create: (name, association, schema, softDelete) => {
    try {
      const controllerArray = [
        `    try {`,
        ``,
        `    } catch (error) {`,
        `      console.error(error);`,
        `      return res.status(500).json({ error, data: null });`,
        `    }`
      ];

      return controllerArray;
    } catch (error) {
      console.error(error);
    }
  },

  update: (name, association, schema, softDelete) => {
    try {
      const controllerArray = [
        `    try {`,
        ``,
        `    } catch (error) {`,
        `      console.error(error);`,
        `      return res.status(500).json({ error, data: null });`,
        `    }`
      ];

      return controllerArray;
    } catch (error) {
      console.error(error);
    }
  },

  delete: (name, association, schema, softDelete) => {
    try {
      const controllerArray = [
        `    try {`,
        ``,
        `    } catch (error) {`,
        `      console.error(error);`,
        `      return res.status(500).json({ error, data: null });`,
        `    }`
      ];

      return controllerArray;
    } catch (error) {
      console.error(error);
    }
  }
};

module.exports = () => {
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

        methods.push((functions[currentMethod](variableName(currentModel.name), currentModel.associations, currentModel.schema, currentModel.softDelete)).join(`\n`));
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

      console.log(controllers);
    };
  }
};
