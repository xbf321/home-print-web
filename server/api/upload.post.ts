// @ts-nocheck
// https://reffect.co.jp/en/nuxt/nuxt3-file-upload/
import path from 'node:path';
import FilesService from '../service/files';
import CloudConvertService from '../service/cloudconvert';
import formidable from 'formidable';

export default defineEventHandler(async (event) => {
  const { private: { uploadDir, needToConvertExts } } = useRuntimeConfig();

  const form = formidable({ 
    uploadDir,
    keepExtensions: true,
  });

  let uid = '';
  let file = null;
  let result = false;
  try {
    const [fields, files] = await form.parse(event.node.req);
    // 返回格式时：[ '1695301172564' ]
    uid = fields.uid[0];
    // 同上
    file = files.file[0];
    useLogInfo(`上传文件成功， uid: ${uid}。`);
  } catch(err) {
    useLogError(err?.message);
    sendMessageToPusher('上传文件失败。', err);
    return result;
  }
  
  const { originalFilename } = file;
  let { filepath, mimetype } = file;
  // 是否需要转换
  const extname = path.extname(originalFilename);
  if (needToConvertExts.includes(extname)) {
    const { filepath: convertFilePath, mimetype: convertMimeType} = await CloudConvertService.convert(filepath, mimetype);
    filepath = convertFilePath;
    mimetype = convertMimeType;
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