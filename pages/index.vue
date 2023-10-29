<template>
  <div class="flex flex-col h-full over-flow-hidden mx-auto sm:max-w-3xl lg:max-w-6xl lg:px-0">
    <div class="mb-2 bg-amber-100 text-center"><a
        class="inline-block text-xs font-normal text-blue-700 hover:text-blue-500"
        href="http://192.168.100.1:7020"
      >
        切换至 => 内网，速度更快。
      </a></div>
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
