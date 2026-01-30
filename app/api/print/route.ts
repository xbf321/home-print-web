import { NextRequest } from 'next/server';
import IPPService from '@/app/service/ipp';
import FilesService from '@/app/service/files';
import LoggerService from '@/app/service/logger';

export async function POST(req: NextRequest) {
  const { uid } = await req.json();

  let jobInfo: any = null;
  const fileInfo = await FilesService.get(uid);
  if (!fileInfo) {
    return Response.json(null);
  }
  try {
    jobInfo = await IPPService.print(uid);
    if (jobInfo) {
      await FilesService.update(uid, {
        jid: jobInfo['job-uri'],
      });
    }
    LoggerService.sendToPusher(`文件「${fileInfo.name}」打印成功。`);
  } catch (err: any) {
    jobInfo = null;
    LoggerService.sendToPusher(`[Error]文件「${fileInfo.name}」打印失败。`, err?.message);
  }
  if (!jobInfo) {
    return Response.json(null);
  }
  return Response.json({
    ...jobInfo,
  });
}
