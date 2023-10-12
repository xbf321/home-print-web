// @ts-nocheck
import FilesService from '../service/files';
export default defineEventHandler(async () => {
  let filterResult = [];
  try {
    const files = await FilesService.list();
    filterResult = files.map((item) => {
      const { uid, filename, status } = item;
      return {
        uid,
        filename,
        status,
      };
    });
  } catch(err) {
    useLogError(err?.message);
  }
  return filterResult;
});