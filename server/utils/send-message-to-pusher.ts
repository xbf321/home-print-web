// @ts-nocheck
const sendMessageToPusher = async (description, content) => {
  const config = useRuntimeConfig();
  const { messagePusherServer } = config.private;
  const isDev = process.env.NODE_ENV === 'development'
  if (!messagePusherServer) {
    console.error(description, content);
    return;
  }
  if (isDev) {
    console.error(description, content);
    return;
  }
  if (typeof content !== 'string') {
    content = `
      ## message
        ${content?.message || ''}
      ## statusCode
        ${content?.statusCode || ''}
      ## statusMessage
        ${content?.statusMessage || ''}
      ## stack
        ${content?.stack}
      ###------EOF
    `;
  }
  try {
    await $fetch(messagePusherServer, {
      method: 'POST',
      body: {
        title: 'Site: home-print-web',
        description,
        content,
      }
    });
  } catch(err) {
    console.error(err);
  }
};
export default sendMessageToPusher;