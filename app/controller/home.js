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
      const id = parseInt(selectedId, 10);
      if (action.toLocaleUpperCase() === 'DELETE') {
        await ctx.service.files.remove(id);
        messageCode = 1;
      }
      if (action.toLocaleUpperCase() === 'PRINT') {
        const isSuccess = await ctx.service.files.print(id);
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
