const ipp = require('ipp');
const fs = require('fs-extra');
const { Service } = require('egg');

class IPPService extends Service {

  async wrapExecuteToPromise(action, message = null) {
    const { printer: defaultPrinter } = this.ctx.app.config;
    const printer = ipp.Printer(defaultPrinter);
    const execute = msg => {
      return new Promise((resolve, reject) => {
        printer.execute(action, msg, (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      });
    };
    return await execute(message);
  }

  async print(fileInfo) {
    const { name: jobName, mimeType, fullPath } = fileInfo;
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
      await this.wrapExecuteToPromise('Print-Job', msg);
      isSuccess = true;
    } catch (err) {
      this.ctx.logger.error(err);
    }
    return isSuccess;
  }

  async getPrinterInfo() {
    let response = null;
    try {
      const msg = {
        'operation-attributes-tag': {
          'requested-attributes': [
            'printer-state',
            'printer-state-message',
          ],
        },
      };
      response = await this.wrapExecuteToPromise('Get-Printer-Attributes', msg);
    } catch (err) {
      response = null;
      this.ctx.logger.error(err);
    }
    return response;
  }
}
module.exports = IPPService;
