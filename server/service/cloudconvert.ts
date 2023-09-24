// @ts-nocheck
import fs from 'fs-extra';
import https from 'node:https';
import CloudConvert from 'cloudconvert';

class CloudConvertService {
  // 输入：原始路径
  // 输出：在原始路径上增加 .pdf 后缀
  async convert(originFilePath) {
    // 简单点：新文件，直接在原来文件基础上直接增加 .pdf 扩展名
    // 如：/var/folders/xx/test.docx -> /var/folders/xx/test.docx.pdf
    let tempFilePath = `${originFilePath}.pdf`;

    // CloudConvert
    const config = useRuntimeConfig();
    const { cloudConvertAccessToken } = config.private;
    const cloudConvert = new CloudConvert(cloudConvertAccessToken);
    let job = await cloudConvert.jobs.create({
      tasks: {
        'upload-my-file': {
          operation: 'import/upload',
        },
        'convert-my-file': {
          operation: 'convert',
          input: [
            'upload-my-file',
          ],
          output_format: 'pdf',
        },
        'export-my-file': {
          operation: 'export/url',
          input: [
            'convert-my-file',
          ],
          inline: false,
          archive_multiple_files: false,
        },
      },
      tag: 'jobbuilder',
    });
    // 上传文件
    const uploadTask = job.tasks.filter(task => task.name === 'upload-my-file')[0];
    const inputFile = fs.createReadStream(originFilePath);
    await cloudConvert.tasks.upload(uploadTask, inputFile);
    job = await cloudConvert.jobs.wait(job.id);
    if (job.status === 'error') {
      throw new Error(JSON.stringify(job));
    }
    const file = await cloudConvert.jobs.getExportUrls(job)[0];
    const { url } = file;
    // 下载文件
    // 写入到临时文件夹中
    // 以 /var/folders/xx/test.docx.pdf 为文件名写入
    const writeStream = fs.createWriteStream(tempFilePath);
    https.get(url, response => {
      response.pipe(writeStream);
    });
    await new Promise((resolve, reject) => {
      writeStream.on('finish', async () => {
        await fs.remove(originFilePath);
        resolve();
      });
      writeStream.on('error', (err) => {
        reject(err);
      });
    });
    return tempFilePath;
  }
}

export default new CloudConvertService();
