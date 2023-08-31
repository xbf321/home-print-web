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
    const index = await this.ctx.db.getIndex('/files', parseInt(id, 10));
    const path = `/files[${index}]`;
    await this.ctx.db.delete(path);
  }

  async print(id) {
    const index = await this.ctx.db.getIndex('/files', parseInt(id, 10));
    const path = `/files[${index}]`;
    const item = await this.ctx.db.getData(path);
    let isPrintSuccess = false;
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
