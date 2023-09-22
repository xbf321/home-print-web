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
  const [fields, files] = await form.parse(event.node.req);
  // [ '1695301172564' ]
  const [uid] = fields.uid;
  const [file] = files.file;
  const { originalFilename } = file;
  let { filepath, mimetype } = file;

  // 是否需要转换
  const extname = path.extname(originalFilename);
  // 非需要转换，直接返回
  if (needToConvertExts.includes(extname)) {
    try {
      filepath = await CloudConvertService.convert(filepath);
      mimetype = 'application/pdf';
    } catch {
      // 出错了，使用原来的路径，避免上层在移除临时文件时出错
      filepath = file.filepath;
    }
  }

  const item = {
    uid,
    filename: originalFilename,
    filepath,
    mimetype,
  };
  return await FilesService.add(item);
});