const useServerRuntimeConfig = () => {
  const printer = process.env.PRINTER || 'http://192.168.100.1:631/printers/HP1106';
  const messagePushServer = process.env.MESSAGE_PUSHER_SERVER || 'http://192.168.100.1:7030/push/root';
  const authUserName = process.env.AUTH_USER_NAME || 'test';
  const authUserPassword = process.env.AUTH_USER_PASSWORD || 'test';
  const cloudconvertAccesstoken = process.env.CLOUDCONVERT_ACCESS_TOKEN || '';
  return {
    printer,
    authUserName,
    authUserPassword,
    messagePushServer,
    cloudconvertAccesstoken,
  };
};
export default useServerRuntimeConfig;