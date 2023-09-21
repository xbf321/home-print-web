import FilesService from '../service/files';
export default defineEventHandler((event) => {
  return FilesService.list();
});