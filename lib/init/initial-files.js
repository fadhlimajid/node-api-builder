'use strict';

const fs = require(`fs`);

const initialFiles = () => {
  try {
    const jsonData = [{
      name: `book`,
      softDelete: false,
      timeStamps: true,
      controllers: [`list`, `detail`, `create`, `update`, `delete`],
      associations: [
        { type: `belongsTo`, target: `category`, as: `category` }
      ],
      schema: [
        {
          field: `title`,
          type: `string`,
          length: 50,
          nullable: true,
          searchable: true,
          default: `NULL`
        },
        {
          field: `description`,
          type: `text`,
          length: `default`,
          nullable: true,
          searchable: true,
          default: `NULL`
        },
        {
          field: `picture`,
          type: `string`,
          length: `default`,
          nullable: true,
          searchable: false,
          default: `NULL`
        },
        {
          field: `author_id`,
          type: `integer:unsigned`,
          length: `default`,
          nullable: true,
          searchable: false,
          default: `NULL`
        },
        {
          field: `category_id`,
          type: `integer:unsigned`,
          length: `default`,
          nullable: true,
          searchable: false,
          default: `NULL`
        },
        {
          field: `publish`,
          type: `boolean`,
          length: `default`,
          nullable: true,
          searchable: false,
          default: `true`
        }
      ]
    }];

    const envData = [
      `NODE_ENV=development`,
      ``,
      `HOST=127.0.0.1`,
      `PORT=8000`,
      ``,
      `DB_DEV_USER=`,
      `DB_DEV_PASS=`,
      `DB_DEV=`,
      `DB_DEV_HOST=`,
      ``,
      `DB_TEST_USER=`,
      `DB_TEST_PASS=`,
      `DB_TEST=`,
      `DB_TEST_HOST=`,
      ``,
      `DB_PROD_USER=`,
      `DB_PROD_PASS=`,
      `DB_PROD=`,
      `DB_PROD_HOST=`
    ];

    const sequelizercData = [
      `const path = require('path');`,
      ``,
      `module.exports = {`,
      ` 'models-path': path.resolve('app', 'models'),`,
      ` 'seeders-path': path.resolve('database', 'seeders'),`,
      ` 'migrations-path': path.resolve('database', 'migrations')`,
      `}`
    ];

    const json = JSON.stringify(jsonData, null, 2);
    const env = envData.join(`\n`);
    const sequelizerc = sequelizercData.join(`\n`);

    const fsData = [
      [`api-builder.json`, json],
      [`.env.example`, env],
      [`.sequelizerc`, sequelizerc]
    ];

    for (let i = 0; i < fsData.length; i++) {
      const currentData = fsData[i];

      fs.writeFile(currentData[0], currentData[1], `utf8`, (err) => {
        if (err) {
          console.error(err);
          return;
        }

        console.log(`${currentData[0]} is successfully made.`);
      });
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = initialFiles;
