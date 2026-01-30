class LoggerService {
  async sendToPusher(title: string, ...params: any) {
    const body = JSON.stringify({
      title,
      description: params.join(','),
      token: process.env.PUSHER_TOKEN,
    });
    if (process.env.NODE_ENV === 'development') {
      console.info('sendToPusher', body);
      return;
    }
    try {
      await fetch(process.env.PUSHER_SERVER!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });
    } catch (err: any) {
      console.error('调用 messagePusherServer 失败。', err?.message);
    }
  }
}

export default new LoggerService();
