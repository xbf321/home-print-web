import FilesService from '../service/files';
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { uid } = body;
  return FilesService.remove(uid);
});