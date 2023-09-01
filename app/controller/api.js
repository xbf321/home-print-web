'use strict';

const { Controller } = require('egg');
const fs = require('fs-extra');
const path = require('node:path');

class APIController extends Controller {
  async upload() {
    const { ctx, app } = this;
    const files = ctx.request.files;
    try {
      const [ firstFile ] = files;
      // 采用 CloudConvert 对文件进行转换
      // 返回和 原始 File 参数一样，后续可以统一操作
      // 针对 image/pdf 文件 -> temp 文件夹 -> Copy 到项目文件夹 -> db.json
      // 针对 doc/docx 文件 -> temp 文件夹 -> CloudConvert 处理 -> Copy 到项目文件夹 -> db.json
      const { filename: tempFileName, filepath: tempFilePath, mimeType } = await this.cloudConvertFile(firstFile);
      // 防止文件重名，在前面增加时间戳
      const filename = `${Date.now()}_${tempFileName}`;
      // 转移到项目路径下
      // 不能根据 tempFileName 设置，因为当需要转换文件是，返回的 文件名 和 filePath 中的文件名是不一致的，如：
      // filename: test.docx
      // filepath: /var/xxx/xx/test.docx.pdf
      // 也可以一样，想优化在优化吧
      const basename = path.basename(tempFilePath);
      const fullPath = path.join(app.baseDir, 'uploads', basename);
      await fs.copy(tempFilePath, fullPath);
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

  async cloudConvertFile(file) {
    const { ctx, app } = this;
    const { filepath: originFilePath, filename } = file;
    const needToConvertExts = app.config.needToConvertExts;
    const extname = path.extname(filename);
    // 非需要转换，直接返回
    if (!needToConvertExts.includes(extname)) {
      return file;
    }
    // 需要 CloudConvert 转换
    // filepath 替换为转换后的 filepath
    // filename: test.docx
    // filepath: /var/xxx/xx/test.docx.pdf
    const filepath = await ctx.service.cloudconvert.convert(originFilePath);
    return Object.assign({}, {
      ...file,
    }, {
      filepath,
      // 默认都转换为 pdf 格式
      mimeType: 'application/pdf',
    });
  }

  async checkPrinter() {
    const response = await this.ctx.service.ipp.checkPrinter();
    this.ctx.set('printer-stauts', response);
    this.ctx.status = 200;
  }

  async getPrinterInfo() {
    const response = await this.ctx.service.ipp.getPrinterInfo();
    this.ctx.body = response;
  }
}

module.exports = APIController;
