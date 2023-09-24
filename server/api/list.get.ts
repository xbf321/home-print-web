import FilesService from '../service/files';
export default defineEventHandler(() => {
  return FilesService.list();
});