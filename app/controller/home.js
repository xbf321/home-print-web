'use strict';

const ipp = require('ipp');
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

  async test() {
    const printer = ipp.Printer('http://192.168.100.1:631/printers/HP1106');
    const getPrinterInfo = () => {
      return new Promise((resolve, reject) => {
        printer.execute('Get-Printer-Attributes', null, (err, res) => {
          console.info(err, res);
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      });
    };
    try {
      await getPrinterInfo();
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = HomeController;
