// @ts-nocheck
export default defineEventHandler((event) => {
  const { authUserName, authUserPassword } = useServerRuntimeConfig();
  const headers = getRequestHeaders(event);
  const authHeader = headers.authorization;
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
})