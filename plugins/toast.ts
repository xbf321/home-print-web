import { useToast } from 'vue-toast-notification';
const $toast = useToast();
export default defineNuxtPlugin(nuxtApp => {
  return {
    provide: {
      toast: $toast,
    }
  }
})