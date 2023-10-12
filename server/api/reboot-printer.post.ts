// @ts-nocheck
import FilesService from '../service/files';
export default defineEventHandler(async () => {
  const info = {
    status: true,
    message: '',
  };
  // 1小时内禁止重复重启
  const MIN_HOUR_DIFF = 1;
  try {
    const rebootTime = await FilesService.getRebootTime();
    const timeDifference = new Date().getTime() - rebootTime;
    // 相差天数
    const dayDifference = Math.floor(timeDifference / (24 * 3600 * 1000));
    // 天数之后相差毫秒数
    const leaveTimeDifference = timeDifference % (24 * 3600 * 1000);
    const hoursDifference = Math.floor(leaveTimeDifference / (3600 * 1000));
    // 如果是当天，且时间间隔小于规定的时间，重启失败
    if (dayDifference === 0 && hoursDifference < MIN_HOUR_DIFF) {
      // 不足间隔时间
      info.status = false;
      info.message = `${MIN_HOUR_DIFF} 小时内，禁止重复重启。`;
      return info;
    }
    // TODO: 重启，调用 shell
    // 更新重启时间
    await FilesService.updateRebootTime();
  } catch(err) {
    useLogError(err?.message);
  }
  return info;
});