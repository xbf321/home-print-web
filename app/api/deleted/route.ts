import { NextRequest } from 'next/server';
import FilesService from '@/app/service/files';
import LoggerService from '@/app/service/logger';

export async function POST(req: NextRequest) {
  const { uid } = await req.json();
  let status = false;
  try {
    status = await FilesService.remove(uid);
  } catch (err) {
    LoggerService.sendToPusher(`[Error]删除文件失败, uid: ${uid}`, err);
  }
  return Response.json(status);
}
