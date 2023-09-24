export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { message, stack } = body;
  sendMessageToPusher('触发 Vue 全局错误', {
    message,
    stack,
  });
});