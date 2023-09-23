<template>
  <div class="flex flex-col overflow-hidden" ref="rootRef">
    <Header />
    <div class="flex-1 mx-auto pt-12 pb-12 px-2 container overflow-hidden">
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