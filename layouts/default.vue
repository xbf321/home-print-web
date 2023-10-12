<template>
  <div class="flex flex-col overflow-hidden bg-gray-100" ref="rootRef">
    <Header />
    <div class="flex-1 container mx-auto pt-12 pb-12 px-2 overflow-hidden">
      <slot />
    </div>
    <PrinterStatusBar />
  </div>
</template>
<script setup>
const rootRef = ref();
onMounted(() => {
  nextTick(() => {
    rootRef.value.style.height = (document.documentElement.clientHeight) + 'px';
  });
});
</script>