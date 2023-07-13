'use strict';

const { Controller } = require('egg');
const fs = require('fs-extra');
const path = require('path');

class APIController extends Controller {
  async upload() {
    const { ctx, app } = this;
    const files = ctx.request.files;
    try {
      const { filepath, filename: originFileName } = files[0];
      const filename = `${Date.now()}_${originFileName}`;
      const fullPath = path.join(app.baseDir, 'uploads', filename);
      await fs.copy(filepath, fullPath);
      await ctx.service.files.add(filename, fullPath);
    } finally {
      // 需要删除临时文件
      await ctx.cleanupRequestFiles();
    }
    ctx.body = 'ok';
  }
}

module.exports = APIController;
