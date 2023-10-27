<template>
  <div class="bg-white fixed w-full h-10 border-b mx-auto">
    <div
      class="container h-full mx-auto justify-between text-xl font-mono leading-10 min-[320px]:text-center md:text-left px-2 sm:max-w-3xl lg:max-w-6xl font-extrabold"
    >
      Web-Print System
      <a
        v-if="showSwitchBar"
        class="inline-block text-xs font-normal text-blue-700 hover:text-blue-500"
        href="http://192.168.100.1:7020"
      >
        切换至内网
      </a>
    </div>
  </div>
</template>
<script setup>
const { $toast } = useNuxtApp();
const { data: response } = await useFetch('/api/myip');
const showSwitchBar = computed(() => {
  return !!response.value.match(/^192/);
});
onMounted(() => {
  if (showSwitchBar.value) {
    $toast.info('您现在在内网，建议切换至「内网」，速度更快。', {
      position: 'top',
    });
  }
});
</script>
