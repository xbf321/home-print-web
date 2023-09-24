import FilesService from '../service/files';
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { uid } = body;
  let result = false;
  try {
    const { isPrintSuccess, item } = await FilesService.print(uid);
    result = isPrintSuccess;
    sendMessageToPusher(`打印 uid 为 ${uid} 的文件成功`, item.filepath);
  } catch (err) {
    result = false;
    sendMessageToPusher(`打印 uid 为 ${uid} 的文件失败`, err);
  }
  return result;
});