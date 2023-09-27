// @ts-nocheck
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = async (error) => {
    await useFetch('/api/send-error', {
      method: 'POST',
      body: {
        message: error?.message,
        stack: error?.stack,
      }
    });
  }
});