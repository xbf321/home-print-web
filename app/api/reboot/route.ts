import dayjs from 'dayjs';
import FileService from '@/app/service/files';
import LoggerService from '@/app/service/logger';
import { MinRebootHour } from '@/app/lib/constant';

export async function POST() {
  const info = {
    status: false,
    message: '',
  };
  const rebootUrl = process.env.REBOOT_URL;
  if (!rebootUrl) {
    info.message = '[Error]打印机没有配置重启URI';
    LoggerService.sendToPusher(info.message);
    return Response.json(info);
  }
  try {
    const lastRebootTime = await FileService.getRebootTime();
    const hours = dayjs().diff(lastRebootTime, 'hour');
    if (hours < MinRebootHour) {
      info.message = `${MinRebootHour} 小时内，禁止重复重启。`;
    } else {
      // 重启，调用 rebootURL
      await fetch(rebootUrl);
      // 更新重启时间
      await FileService.updateRebootTime();
      info.status = true;
    }
  } catch (err: any) {
    info.status = false;
    info.message = err?.message || '';
    LoggerService.sendToPusher('[Error]打印机重启失败', err);
  }

  return Response.json(info);
}
