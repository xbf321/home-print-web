import { NextRequest } from 'next/server';
import FilesService from '@/app/service/files';
import LoggerService from '@/app/service/logger';

export async function POST(req: NextRequest) {
  const { uid, pages } = await req.json();
  let fileInfo = null;
  try {
    fileInfo = await FilesService.update(uid, {
      pages,
    });
  } catch (err) {
    fileInfo = null;
    LoggerService.sendToPusher(`[Error]更新文件失败, uid: ${uid}`, err);
  }
  if (!fileInfo) {
    return Response.json(null);
  }
  return Response.json({
    ...fileInfo,
  });
}
