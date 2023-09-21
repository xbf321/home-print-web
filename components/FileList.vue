<template>
  <div class="flex-1 h-full overflow-y-auto">
    <div
      class="border-b py-3 flex min-[320px]:flex-col md:flex-row"
      v-for="(item, index) in data"
      :key="item.uid"
    >
      <h1 class="font-medium flex-1 leading-9 min-[320px]:leading-6 md:leading-9">
        {{ item.filename }}
      </h1>
      <div class="mr-4 leading-9 min-[320px]:mr-0 md:mr-4">
        <span class="p-1 bg-green-500 text-white text-xs" :class="item.status">
          {{item.status}}
          {{ statusChineseMap[item.status] }}
        </span>
      </div>
      <div class="flex w-40 min-[320px]:w-full md:w-40">
        <button
          class="rounded shadow-lg py-1 bg-blue-500 text-white hover:bg-blue-700 flex-1"
          @click="onPrint(index, item.uid)"
          :class="{
            'cursor-not-allowed': printButtonStatus(item.status),
            'opacity-40': printButtonStatus(item.status),
            'hover:bg-blue-500': printButtonStatus(item.status),
          }"
          :disabled="printButtonStatus(item.status)"
        >
          {{ isPrinting ? '正在打印中' : '打印'}}
        </button>
        <button class="ml-2 text-sm" @click="onDelete(index, item.uid)">删除</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useToast } from 'vue-toast-notification';
const isPrinting = ref(false);
const $toast = useToast();

const props = defineProps({
  data: { type: Array, default: () => [], require: true },
});

const emit = defineEmits(['deleted', 'printed']);

const printButtonStatus = computed(() => {
  return (status) => {
    if (isPrinting.value) {
      return true;
    }
    if (status === 'waiting' || status === 'printed') {
      return false;
    }
    return true;
  }
});

const statusChineseMap = {
  uploading: '正在上传...',
  error: '上传失败，请重试',
  waiting: '待打印',
  printed: '已打印',
};

const onDelete = async (index, uid) => {
  if (window.confirm('Are you sure?')) {
    const { data: result} = await useFetch('/api/remove', {
      method: 'DELETE',
      body: {
        uid,
      },
    });
    if (result.value) {
      emit('deleted', index);
    }
    
    $toast[result.value ? 'success' : 'error'](result.value ? '删除成功!' : '删除失败，请刷新页面重试。', {
      position: 'top',
    });
  }
};

const onPrint = async (index, uid) => {
  if (window.confirm('Are you sure?')) {
    isPrinting.value = true;
    const { data: result } = await useFetch('/api/print', {
      method: 'POST',
      body: {
        uid,
      },
    });
    isPrinting.value = false;
    if (result.value) {
      emit('printed', index);
    }
    $toast[result.value ? 'success' : 'error'](result.value ? '打印成功！' : '打印失败!', {
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
