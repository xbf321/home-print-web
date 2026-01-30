import LoggerService from '@/app/service/logger';
import IPPService from '@/app/service/ipp';
import { PrinterStatus } from '@/app/lib/constant';

export async function GET() {
  const info = await IPPService.getInfo();

  if (info.state === PrinterStatus.Stopped) {
    LoggerService.sendToPusher('[Error]打印机不可用。', info.message);
  }

  return Response.json({
    ...info,
  });
}
