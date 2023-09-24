// @ts-nocheck
// https://reffect.co.jp/en/nuxt/nuxt3-file-upload/
import path from 'node:path';
import FilesService from '../service/files';
import CloudConvertService from '../service/cloudconvert';
import formidable from 'formidable';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { uploadDir, needToConvertExts } = config.private;

  const form = formidable({ 
    uploadDir,
    keepExtensions: true,
  });
  let uid = '';
  let file = null;
  let result = false;

  try {
    const [fields, files] = await form.parse(event.node.req);
    // [ '1695301172564' ]
    uid = fields.uid[0];
    file = files.file[0];
  } catch(err) {
    sendMessageToPusher('上传文件失败。', err);
    return result;
  }
  
  const { originalFilename } = file;
  let { filepath, mimetype } = file;
  // 是否需要转换
  const extname = path.extname(originalFilename);
  // 非需要转换，直接返回
  if (needToConvertExts.includes(extname)) {
    try {
      filepath = await CloudConvertService.convert(filepath);
      mimetype = 'application/pdf';
    } catch(err) {
      // 出错了，使用原来的路径，避免上层在移除临时文件时出错
      filepath = file.filepath;
      sendMessageToPusher('调用CloudConvertService失败。', err);
    }
  }

  const item = {
    uid,
    filename: originalFilename,
    filepath,
    mimetype,
  };
  
  try {
    result = await FilesService.add(item);
  } catch(err) {
    sendMessageToPusher('添加文件到 DB 失败。', err);
  }
  return result;
});