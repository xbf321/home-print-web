// @ts-nocheck
const sendMessageToPusher = async (description, content) => {
  const { isDev, messagePusherServer, messagePusherServerToken: token } = useServerRuntimeConfig();
  if (!messagePusherServer || isDev) {
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
      ## ------EOF
    `;
  }
  try {
    await $fetch(messagePusherServer, {
      method: 'POST',
      body: {
        title: '[INFO] The file has been printed.',
        description,
        content,
        token,
      }
    });
  } catch(err) {
    useLogError('调用 messagePusherServer 失败。', err?.message);
  }
};
export default sendMessageToPusher;