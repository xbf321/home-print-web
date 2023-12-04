const useServerRuntimeConfig = () => {
  const printer = process.env.PRINTER || 'http://cups.sixwifi.com/printers/HP1106';
  const messagePusherServer = process.env.MESSAGE_PUSHER_SERVER || 'http://message-pusher.sixwifi.com/push/root';
  const messagePusherServerToken = process.env.MESSAGE_PUSHER_SERVER_TOKEN || '';
  const rebootURL =  process.env.REBOOT_URL || 'http://sg90.sixwifi.com/go'
  const authUserName = process.env.AUTH_USER_NAME || 'test';
  const authUserPassword = process.env.AUTH_USER_PASSWORD || 'test';
  const cloudconvertAccesstoken = process.env.CLOUDCONVERT_ACCESS_TOKEN || '';
  
  return {
    printer,
    rebootURL,
    authUserName,
    authUserPassword,
    messagePusherServer,
    messagePusherServerToken,
    cloudconvertAccesstoken,
  };
};
export default useServerRuntimeConfig;