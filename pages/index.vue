<template>
  <div class="flex flex-col h-full over-flow-hidden mx-auto sm:max-w-3xl lg:max-w-6xl lg:px-0">
    <Uploader @change="onChange" />
    <FileList
      :data="fileList"
      @deleted="onDeleted"
      @printed="onPrinted"
    />
  </div>
</template>
<script setup>
const { data: fileList } = await useFetch('/api/list');

const onChange = (file) => {
  const { uid } = file;
  const isExists = fileList.value.find((item) => item.uid === uid);
  if (!isExists) {
    fileList.value.unshift(file);
    return;
  }
  fileList.value = fileList.value.map((item) => {
    if (item.uid === uid) {
      item = file;
    }
    return item;
  });
};

const onDeleted = async (index) => {
  fileList.value.splice(index, 1);
};

// 打印成功
const onPrinted = async (index) => {
  fileList.value[index].status = 'printed';
};
</script>
