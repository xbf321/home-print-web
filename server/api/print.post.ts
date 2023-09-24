import FilesService from '../service/files';
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { uid } = body;
  let result = false;
  try {
    result = await FilesService.print(uid);
  } catch (err) {
    result = false;
    sendMessageToPusher(`打印 ${uid} 失败`, err);
  }
  return result;
});