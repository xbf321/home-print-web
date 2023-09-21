// @ts-nocheck
import ipp from 'ipp';
import fs from 'fs-extra';

class IPPService {
  async wrapExecuteToPromise(action, message = null) {
    const config = useRuntimeConfig();
    const { printer: defaultPrinter } = config.private; 
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
    const { filename: jobName, mimetype, filepath } = fileInfo;
    const fileStream = await fs.readFile(filepath);
    const msg = {
      'operation-attributes-tag': {
        'requesting-user-name': 'Web',
        'job-name': jobName,
        'document-format': mimetype,
      },
      data: fileStream,
    };
    await this.wrapExecuteToPromise('Print-Job', msg);
    return true;
  }

  async getPrinterInfo() {
    const msg = {
      'operation-attributes-tag': {
        'requested-attributes': [
          'printer-state',
          'printer-state-message',
        ],
      },
    };
    return await this.wrapExecuteToPromise('Get-Printer-Attributes', msg);
  }
}
export default new IPPService();
