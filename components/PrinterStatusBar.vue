<template>
  <div class="fixed bottom-0 h-10 bg-green-100 w-full leading-10 px-2 text-sm">
    <span class="font-medium text-base">打印机状态：</span>
    <span
      class="p-1 bg-green-500 rounded text-white text-xs"
      :class="{ 'bg-red-500': printerAvailable === false }"
    >
      {{ printerAvailable ? '可用' : '不可用'
      }}{{ printerInfo.state ? `（${printerInfo.state}）` : '' }}
    </span>
    <span class="text-xs ml-2">
      {{ printerInfo.message }}
    </span>
  </div>
</template>
<script setup>
const printerAvailable = usePrinterAvailable();
const printerInfo = reactive({
  state: '',
  message: '',
});
await useFetch('/api/get-printer-info', {
  method: 'HEAD',
  server: false,
  retry: 5,
  // ms
  retryDelay: 1000,
  onResponse: ({ response }) => {
    // idle
    printerInfo.state = response.headers.get('printer-state');
    printerInfo.message = response.headers.get('printer-state-message');
  },
});

watch(printerInfo, () => {
  const { state } = printerInfo;
  if (state === 'idle') {
    printerAvailable.value = true;
  }
});
</script>
