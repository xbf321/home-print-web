<template>
  <div class="absolute bottom-0 h-10 bg-green-100 w-full leading-10 px-2">
    <span class="text-sm">打印机状态：</span>
  </div>
</template>
<script setup>
const printerStatusInterval = ref(null);
const {} = await useFetch();
const getPrinterInfo = async () => {
  const info = await useFetch('/api/get-printer-info', {
    method: 'HEAD',
    server: false,
  });
  console.info('dainfta', info);
};
onMounted(async () => {
  // printerStatusInterval.value = window.setInterval(getPrinterInfo, 3000);
  await getPrinterInfo();
});
// function getPrinterInfo() {
//         fetch('/api/getPrinterInfo', { method: 'HEAD', signal: AbortSignal.timeout(1500) }).then((response) => {
//           const printerState = response.headers.get('printer-state');
//           const printerStateMessage = response.headers.get('printer-state-message');
//           if (printerState === 'idle') {
//             printerStatusNode.innerHTML = '打印机可用。';
//             printerStatusNode.classList.add("success");
//             window.clearInterval(printerStatusInterval);
//             return;
//           }
//           printerStatusNode.innerHTML = `${printerState}, ${printerStateMessage}`;
//         }).catch((err) => {
//           console.error(err);
//         });
//       }
//       printerStatusInterval = window.setInterval(getPrinterInfo, 3000);
//       
</script>