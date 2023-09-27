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
      needToConvertExts: [ '.doc', '.docx', '.xls', '.xlsx', '.csv' ],
    },
    // for client or server
    public: {
      uploadAcceptFormat: 'image/*,.pdf,.doc,.docx,.xls,.xlsx',
    },
  },
})
