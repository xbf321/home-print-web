// @ts-nocheck
export default defineEventHandler(async (event) => {
  const { authUserName, authUserPassword, isDev } = useServerRuntimeConfig();
  if (!isDev) {
    const headers = getRequestHeaders(event);
    const authHeader = headers.authorization;
    const xRealIP = headers['x-real-ip'];
    if (!/^1(2|9)(7|2)\./gi.test(xRealIP)) {
      if (!authHeader) {
        setHeader(event, 'WWW-Authenticate', 'Basic realm="Restricted"');
        setResponseStatus(event, 401);
        event.node.res.end('No auth');
      } else {
        const requestAuth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        const [ requestUserName, requestUserPassword ] = requestAuth;
        if (authUserName !== requestUserName && authUserPassword !== requestUserPassword) {
          setHeader(event, 'WWW-Authenticate', 'Basic realm="Restricted"');
          setResponseStatus(event, 401);
          event.node.res.end('No auth');
        }
      }
    }
  }
})