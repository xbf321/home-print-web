// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
  }
})
