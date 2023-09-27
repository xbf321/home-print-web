// @ts-nocheck
import ipp from 'ipp';
import fs from 'fs-extra';

class IPPService {
  async wrapExecuteToPromise(action, message = null) {
    const config = useRuntimeConfig();
    const { ippRequestTimout } = config.private;
    const { printer: defaultPrinter } = useServerRuntimeConfig();
    const printer = ipp.Printer(defaultPrinter);
    // https://stackoverflow.com/questions/32461271/nodejs-timeout-a-promise-if-failed-to-complete-in-time
    const withTimeout = (millis, promise) => {
      const timeout = new Promise((resolve, reject) =>
        setTimeout(() => reject(`Timed out after ${millis} ms.`), millis),
      );
      return Promise.race([promise, timeout]);
    };

    const execute = (msg) => {
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
    return await withTimeout(ippRequestTimout, execute(message));
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
        'requested-attributes': ['printer-state', 'printer-state-message'],
      },
    };
    return await this.wrapExecuteToPromise('Get-Printer-Attributes', msg);
  }
}
export default new IPPService();
