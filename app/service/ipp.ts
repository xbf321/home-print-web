import ipp from 'ipp';
import fs from 'fs-extra';
import { IPPRequestTimeout, PrinterStatus } from '@/app/lib/constant';

const withTimeout = (millis: number, promise: any) => {
  const timeout = new Promise((resolve, reject) =>
    setTimeout(() => reject(`Timed out after ${millis} ms.`), millis),
  );
  return Promise.race([promise, timeout]);
};

class IPPService {
  __instantPrinter() {
    if (!process.env.PRINTER) {
      return null;
    }
    return ipp.Printer(process.env.PRINTER);
  }
  async __command(action: string, message: any = null) {
    const printer: any = this.__instantPrinter();
    // https://stackoverflow.com/questions/32461271/nodejs-timeout-a-promise-if-failed-to-complete-in-time
    const execute = (msg: object) => {
      return new Promise((resolve: any, reject: any) => {
        if (!printer) {
          return reject('Printer is not set.');
        }
        printer.execute(action, msg, (err: any, res: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      });
    };
    return await withTimeout(IPPRequestTimeout, execute(message));
  }

  async print(fileInfo: FileInfo) {
    const { name: jobName, type, filepath, pages = 'all' } = fileInfo;
    const fileStream = await fs.readFile(filepath as string);

    const jobOption: any = {};
    if (pages !== 'all') {
      jobOption['page-ranges'] = '1';
    }
    const msg = {
      'operation-attributes-tag': {
        'job-name': jobName,
        'document-format': type,
      },
      data: fileStream,
    };
    const response = await this.__command('Print-Job', msg);
    if (response && response['job-attributes-tag']) {
      return response['job-attributes-tag'];
    }
    return null;
  }

  async getInfo() {
    console.info('getInfo', process.env);
    const info = {
      state: PrinterStatus.Idle,
      message: '',
      reasons: '',
    };
    const msg: any = {
      'operation-attributes-tag': {
        'requested-attributes': [
          'queued-job-count',
          'marker-levels',
          'printer-state',
          'printer-state-reasons',
          'printer-state-message',
          'printer-up-time',
        ],
      },
    };
    const response: any = await this.__command('Get-Printer-Attributes', msg);

    if (response && response['printer-attributes-tag']) {
      info.state = response['printer-attributes-tag']['printer-state'];
      info.message = response['printer-attributes-tag']['printer-state-message'];
      info.reasons = response['printer-attributes-tag']['printer-state-reasons'];
    }
    return info;
  }
}
export default new IPPService();
