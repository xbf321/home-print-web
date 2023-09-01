const fs = require('fs-extra');
const dayjs = require('dayjs');
const { Service } = require('egg');

class FilesService extends Service {
  async add({ filename, fullPath, mimeType }) {
    const row = {
      id: Date.now(),
      name: filename,
      fullPath,
      printed: false,
      mimeType,
      date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };
    await this.ctx.db.push('/files[]', row);
  }

  async remove(id) {
    const index = await this.ctx.db.getIndex('/files', id);
    if (index < 0) {
      return false;
    }
    const path = `/files[${index}]`;
    const item = await this.ctx.db.getData(path);
    // 删除物理文件
    await fs.remove(item.fullPath);
    // 删除 DB
    await this.ctx.db.delete(path);
  }

  async print(id) {
    let isPrintSuccess = false;
    const index = await this.ctx.db.getIndex('/files', id);
    if (id < 0) {
      return isPrintSuccess;
    }
    const path = `/files[${index}]`;
    const item = await this.ctx.db.getData(path);
    try {
      isPrintSuccess = await this.ctx.service.ipp.print(item);
      // 更新DB
      await this.ctx.db.push(
        path,
        {
          ...item,
          printed: true,
        },
        true
      );
    } catch (err) {
      this.ctx.logger.error(err);
    }
    return isPrintSuccess;
  }

  async find(isShowAll = false) {
    let data = await this.ctx.db.getData('/files', []);
    if (!isShowAll) {
      data = data.filter(item => !item.printed);
    }
    data = data.reverse();
    return data;
  }
}

module.exports = FilesService;
