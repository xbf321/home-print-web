'use strict';

const { Controller } = require('egg');
const fs = require('fs-extra');
const path = require('path');
const ipp = require('ipp');

class APIController extends Controller {
  async upload() {
    const { ctx, app } = this;
    const files = ctx.request.files;
    try {
      const { filepath, filename: originFileName, mimeType } = files[0];
      console.info(files[0]);
      const filename = `${Date.now()}_${originFileName}`;
      const fullPath = path.join(app.baseDir, 'uploads', filename);
      await fs.copy(filepath, fullPath);
      await ctx.service.files.add({
        filename,
        fullPath,
        mimeType,
      });
    } finally {
      // 需要删除临时文件
      await ctx.cleanupRequestFiles();
    }
    ctx.body = 'ok';
  }

  async checkPrinter() {
    const [ defaultPrinter ] = this.ctx.app.config.printers;
    const printer = ipp.Printer(defaultPrinter);
    const getPrinterAttributes = () => {
      return new Promise((resolve, reject) => {
        printer.execute('Identify-Printer', null, (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      });
    };
    const res = await getPrinterAttributes();
    this.ctx.body = res;
  }
}

module.exports = APIController;
