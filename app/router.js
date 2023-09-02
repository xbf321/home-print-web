'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const auth = app.middleware.auth({}, app);
  const { router, controller } = app;
  router.get('/', auth, controller.home.index);
  router.post('/', auth, controller.home.index);
  router.post('/api/upload', auth, controller.api.upload);
  router.get('/api/getPrinterInfo', auth, controller.api.getPrinterInfo);
};
