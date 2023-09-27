<template>
  <div class="flex flex-col h-full over-flow-hidden">
    <Uploader @change="onChange" />
    <FileList
      :data="fileList"
      @deleted="onDeleted"
      @printed="onPrinted"
    />
  </div>
</template>
<script setup>
const { data: fileList } = await useFetch('/api/list', {
  transform: (list) => {
    return list.map((item) => {
      const { uid, filename, status } = item;
      return {
        uid,
        filename,
        status,
      };
    });
  },
});

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
