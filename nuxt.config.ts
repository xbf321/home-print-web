import path from 'node:path';
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
  },
  runtimeConfig: {
    // only for server
    private: {
      rootDir: __dirname,
      uploadDir: './uploads/',
      dbFile: './db.json',
      printer: 'http://192.168.100.1:631/printers/HP1106',
      cloudConvertAccessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMTU1ZDRmMTI0ZWI0NWJjM2M5YTI3MWUyNDg3NmQ2ZmNiYTY0Y2JkMTU4ZTRkYjY5ZjIzMDNkYzE5Y2JkOThmODM0ZjNjZTQ5YWYzNzBhNDciLCJpYXQiOjE2OTM0NzY5MTEuNzQ3MDk1LCJuYmYiOjE2OTM0NzY5MTEuNzQ3MDk1LCJleHAiOjQ4NDkxNTA1MTEuNzM2NjM1LCJzdWIiOiI2NDMyMDA5OCIsInNjb3BlcyI6WyJ0YXNrLnJlYWQiLCJ0YXNrLndyaXRlIiwicHJlc2V0LnJlYWQiLCJwcmVzZXQud3JpdGUiXX0.hFXpw7EMJo3KWWAeav0vIdAfDPSzxsjuSr3fvnu-Cpt2yC-HZabHHve-q82Ga3eiDsXpdUOf0llkvbFuCl7SSfDBmfabyi0Jolf7Jnv1WED88s7WJQtp_atc3iyEnEmJoYmV1YZd7gxfWb-9Bjr2viXZBoTsDOCY3kesO5ARcP-HjH_2q6f0ZecQmC4dtD_vskwhRr59XRQ_B8x_giPJ8fg82ebT4_b2UKE6snCjWIiPeqV5I6ctA47gks9PWC17LWetPcsWU1CPRUpfsnk-NkQg0YER1Zju0sBwAGidj61pksbhOEgkv8wCZr127M-RzA8AOaq_UbDr3hf6yKU4b7XYzyZ_A3R4Z-ILN_ZFdVglMqIOaDxyvNWktUCcKK7BaLHgBJNMDj9F80WBf69_n5qe-O-oy5NAqL0SQvl8n1cFvtkCDSDXGxi28Rud40dGb6-veW_eOFN4kbSD9aHdWMiKz2Sx3yxa6V_5iZgHv4-ypU9SWPlHSpbjng32WYfLhbf51ivKTtUb9TqvnE1MSk4wRhngpHTCrQf9kMmczb_uAASQcm89Dhs5teGrlPU66-zKBhcSp3x5VOnr0t9Sg8qp9GB3y15IXevLw4cSeWmpObugECZ7ayBIIf7jrtLA9d0ujiszPLRLPdKCr5rUorNqGTeLzfAX3Qgto1Qlwao',
      needToConvertExts: [ '.doc', '.docx', '.xls', '.xlsx', '.csv' ],
      auth: {
        userName: 'test',
        userPassword: 'test',
      },
    },
    // for client or server
    public: {}
  },
})
