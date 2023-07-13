/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1689144510975_5833';

  // add your middleware config here
  config.middleware = [];

  config.multipart = {
    mode: 'file',
    fileSize: '50mb',
    fileExtensions: [
      '.pdf',
      '.doc',
      '.docx',
    ],
  };

  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.nj': 'nunjucks',
    },
  };

  // add your user config here
  const userConfig = {
    dbFilePath: '/config/db.json',
    auth: {
      userName: 'test',
      userPassword: 'test',
    },
    printers: [ 'http://192.168.100.1:631/ipp/printer' ],
  };

  return {
    ...config,
    ...userConfig,
  };
};
