module.exports = () => {
  return async function auth(ctx, next) {
    const { request } = ctx;
    const { userName, userPassword } = ctx.app.config.auth;
    const authHeader = request.header.authorization;
    if (!authHeader) {
      ctx.status = 401;
      ctx.set('WWW-Authenticate', 'Basic realm="Restricted"');
    } else {
      const requestAuth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
      const [ requestUserName, requestUserPassword ] = requestAuth;
      if (userName !== requestUserName && userPassword !== requestUserPassword) {
        ctx.status = 401;
        ctx.set('WWW-Authenticate', 'Basic realm="Restricted"');
      } else {
        await next();
      }
    }
  };
};
