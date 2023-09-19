<template>
  <div class="flex flex-col h-full">
    <Uploader @change="onChange"/>
    <FileList :data="fileList" />
  </div>
</template>
<script setup>
const fileList = ref([]);
const onChange = () => {
  fileList.value.push(1);
};
</script>