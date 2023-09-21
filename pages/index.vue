<template>
  <div class="flex flex-col h-full over-flow-hidden">
    <Uploader @change="onChange"/>
    <FileList v-if="fileList.length > 0" :data="fileList" @deleted="onDeleted" @printed="onPrinted" />
    <div v-else class="text-center p-2 text-gray-400">
      暂无要打印的文件，请点击右上角「上传按钮」进行上传。
    </div>
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