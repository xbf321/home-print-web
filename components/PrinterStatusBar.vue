<template>
  <div class="fixed bottom-0 h-10 bg-green-100 w-full leading-10 px-2 text-sm mx-auto">
    <div class="mx-auto sm:max-w-3xl lg:max-w-6xl flex">
      <div class="flex-1">
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
      <button
        class="rounded border px-4 bg-green-500 text-sm font-medium text-white hover:bg-green-600 focus:outline-none cursor-pointer h-8 mt-1"
        @click="onRebootPrinter"
      >
        重启打印机
      </button>
    </div>
  </div>
</template>
<script setup>
const { $toast } = useNuxtApp();
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
  printerAvailable.value = state === 'idle';
});

async function onRebootPrinter() {
  if (window.confirm('Are you sure?')) {
    const { data: response } = await useFetch('/api/reboot-printer', {
      method: 'POST',
    });
    const { status, message } = response.value;
    $toast[status ? 'success' : 'error'](status ? '打印机重启成功' : message, {
      position: 'top',
    });
  }
}
</script>
