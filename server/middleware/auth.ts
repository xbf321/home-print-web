// @ts-nocheck
import ping from 'ping';

export default defineEventHandler(async (event) => {
  // 内外网都是使用同一个域名访问
  // 所以这里对域名进行 ping 
  // 如果非公网，忽略校验，反之
  const host = getRequestHost(event);
  const { numeric_host: targetIP } = await ping.promise.probe([host], {
    timeout: 1,
  });
  if (!targetIP.match(/^127\./) || !targetIP.match(/^192\./)) {
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
  }
})