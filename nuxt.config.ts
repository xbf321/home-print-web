// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devServer: {
    port: 7020,
  },
  pages: true,
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  // 组件目录使用 XX.server.ts 标识，必须启用 componentIslands 选项
  experimental: {
    componentIslands: true,
  },
  runtimeConfig: {
    // only for server
    private: {
      rootDir: __dirname,
      uploadDir: './uploads/',
      dbFile: './db.json',
      ippRequestTimout: 3000,
      printer: process.env.PRINTER,
      // 当发生错误时，把错误发送到配置的 Server 中
      messagePusherServer: process.env.MESSAGE_PUSHER_SERVER,
      cloudConvertAccessToken: process.env.CLOUDCONVERT_ACCESS_TOKEN,
      needToConvertExts: [ '.doc', '.docx', '.xls', '.xlsx', '.csv' ],
      auth: {
        userName: process.env.AUTH_USER_NAME,
        userPassword: process.env.AUTH_USER_PASSWORD,
      },
    },
    // for client or server
    public: {}
  },
})
