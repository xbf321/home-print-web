const ipp = require('ipp');
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
    const index = await this.ctx.db.getIndex('/files', parseInt(id, 10));
    const path = `/files[${index}]`;
    await this.ctx.db.delete(path);
  }

  async print(id) {
    const index = await this.ctx.db.getIndex('/files', parseInt(id, 10));
    const path = `/files[${index}]`;
    const item = await this.ctx.db.getData(path);
    const { name: jobName, mimeType, fullPath } = item;
    // TODO：
    // 现阶段先使用第一个打印机，后续可以支持选择打印机打印
    const [ defaultPrinter ] = this.ctx.app.config.printers;
    // 1. 调用 IPP 打印
    const printer = ipp.Printer(defaultPrinter);
    const sendPrintJob = msg => {
      return new Promise((resolve, reject) => {
        printer.execute('Print-Job', msg, (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      });
    };
    let isSuccess = false;
    try {
      const fileStream = await fs.readFile(fullPath);
      const msg = {
        'operation-attributes-tag': {
          'requesting-user-name': 'Web',
          'job-name': jobName,
          'document-format': mimeType,
        },
        data: fileStream,
      };
      await sendPrintJob(msg);
      // 2. 更新当前数据
      await this.ctx.db.push(
        path,
        {
          ...item,
          printed: true,
        },
        true
      );
      isSuccess = true;
    } catch (err) {
      this.ctx.logger.error(err);
    }
    return isSuccess;
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
