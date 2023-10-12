<template>
  <div class="flex-1 h-full overflow-y-auto">
    <template v-if="data && data.length > 0">
      <div
        class="bg-white border-b border-gray-200 py-4 px-4 flex min-[320px]:flex-col md:flex-row"
        v-for="(item, index) in data"
        :key="item.uid"
      >
        <h1 class="font-extrabold flex-1 leading-9 min-[320px]:leading-6 md:leading-9">
          #{{ item.uid }} - {{ item.filename }}
        </h1>
        <div class="mr-4 leading-9 min-[320px]:mr-0 md:mr-4">
          <span class="p-1 bg-green-500 text-white text-xs" :class="item.status">
            {{ item.status }}
            {{ statusChineseMap[item.status] }}
          </span>
        </div>
        <div class="flex w-32 min-[320px]:w-full md:w-32">
          <button
            class="flex-1 text-sm hover:text-blue-800 rounded border border-gray-400"
            @click="onPrint(index, item.uid)"
            :class="{
              'cursor-not-allowed': printButtonStatus(index, item.status),
              'opacity-40': printButtonStatus(index, item.status),
            }"
            :disabled="printButtonStatus(index, item.status)"
          >
            {{ selectedPrintingItemIndex === index ? '正在打印中' : '打印' }}
          </button>
          <button
            class="ml-4 text-sm text-blue-700 hover:text-blue-500"
            @click="onDelete(index, item)"
          >
            删除
          </button>
        </div>
      </div>
    </template>
    <div v-else class="text-center p-2 text-gray-400">暂无文件，请点击「上传按钮」进行上传。</div>
  </div>
</template>
<script setup>
const printerAvailable = usePrinterAvailable();
import { useToast } from 'vue-toast-notification';
const selectedPrintingItemIndex = ref(-1);

const $toast = useToast();

const props = defineProps({
  data: { type: Array, default: () => [], require: true },
});

const emit = defineEmits(['deleted', 'printed']);

const printButtonStatus = computed(() => {
  return (index, status) => {
    if (printerAvailable.value === false) {
      return true;
    }
    if (index === selectedPrintingItemIndex.value) {
      return true;
    }
    if (status === 'waiting' || status === 'printed') {
      return false;
    }
    return true;
  };
});

const statusChineseMap = {
  uploading: '正在上传...',
  error: '上传失败，请重试',
  waiting: '待打印',
  printed: '已打印',
};

const onDelete = async (index, item) => {
  if (window.confirm('Are you sure?')) {
    const { uid, status } = item;
    if (status === 'error') {
      // 说明上传失败，没有上传到 DB
      // 直接在前台删除。
      emit('deleted', index);
      return;
    }
    const { data: result } = await useFetch('/api/remove', {
      method: 'DELETE',
      body: {
        uid,
      },
    });
    if (result.value) {
      emit('deleted', index);
    }

    $toast[result.value ? 'success' : 'error'](
      result.value ? '删除成功!' : '删除失败，请刷新页面重试。',
      {
        position: 'top',
      },
    );
  }
};

const onPrint = async (index, uid) => {
  if (window.confirm('Are you sure?')) {
    selectedPrintingItemIndex.value = index;
    const { data: result } = await useFetch('/api/print', {
      method: 'POST',
      body: {
        uid,
      },
    });
    selectedPrintingItemIndex.value = -1;
    if (result.value) {
      emit('printed', index);
    }
    $toast[result.value ? 'success' : 'error'](result.value ? '打印成功！' : '打印失败，请重试!', {
      position: 'top',
    });
  }
};
</script>
<style scoped>
.uploading {
  background-color: #c75aef;
  border-color: #c75aef;
}
.printed {
  background-color: #f78745;
  border-color: #f78745;
}
.error {
  background-color: #f5483b;
  border-color: #f5483b;
}
</style>
