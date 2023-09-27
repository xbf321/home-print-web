// @ts-nocheck
import FilesService from '../service/files';
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { uid } = body;
  let response = {
    isPrintSuccess: false,
    item: {},
  };
  try {
    response = await FilesService.print(uid);
  } catch (err) {
    response = {
      isPrintSuccess: false,
      item: {},
    };
  } finally {
    sendMessageToPusher(`打印「${uid}」文件${ response.isPrintSuccess ? '成功': '失败'}`, response.item?.filepath);
  }
  return response.isPrintSuccess;
});