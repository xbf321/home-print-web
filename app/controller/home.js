'use strict';

const { Controller } = require('egg');
class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const { request } = ctx;
    const { method, body } = request;
    const status = parseInt(ctx.query.status, 10);
    let messageCode = 0;
    if (method.toLocaleUpperCase() === 'POST') {
      const { action, selectedId } = body;
      if (action.toLocaleUpperCase() === 'DELETE') {
        await ctx.service.files.remove(selectedId);
        messageCode = 1;
      }
      if (action.toLocaleUpperCase() === 'PRINT') {
        const isSuccess = await ctx.service.files.print(selectedId);
        messageCode = isSuccess === true ? 2 : 3;
      }
    }
    const files = await ctx.service.files.find(status === 1);
    await ctx.render('home.nj', {
      files,
      status,
      messageCode,
    });
  }
}

module.exports = HomeController;
