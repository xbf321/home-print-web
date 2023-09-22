export default defineNuxtRouteMiddleware((to, from) => {
  console.info('auth');
  // // isAuthenticated() is an example method verifying if a user is authenticated
  // if (isAuthenticated() === false) {
  //   return navigateTo('/login')
  // }
  /**
   * 
   * const { request } = ctx;
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
   */
})