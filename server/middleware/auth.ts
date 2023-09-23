// @ts-nocheck
export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const { userName, userPassword } = config.private.auth;
  const headers = getRequestHeaders(event);
  const authHeader = headers.authorization;
  if (!authHeader) {
    event.node.res.setHeader('WWW-Authenticate', 'Basic realm="Restricted"');
    event.node.res.statusCode = 401;
    event.node.res.end('No auth');
  } else {
    const requestAuth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const [ requestUserName, requestUserPassword ] = requestAuth;
    if (userName !== requestUserName && userPassword !== requestUserPassword) {
      event.node.res.statusCode = 401;
      event.node.res.setHeader('WWW-Authenticate', 'Basic realm="Restricted"');
      event.node.res.end('No auth');
    }
  }
})