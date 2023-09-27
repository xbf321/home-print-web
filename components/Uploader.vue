<template>
  <div class="flex justify-end mb-2">
    <button
      class="py-2 rounded text-white bg-blue-700 hover:bg-blue-800 sm:block min-[320px]:w-full md:w-32 text-sm"
      @click="onSelectFile"
    >
      上传文件
    </button>
    <input
      class="hidden"
      type="file"
      ref="inputFileRef"
      name="file"
      @change="onFileChange"
      :accept="uploadAcceptFormat"
    />
  </div>
</template>
<script setup>
// https://stackoverflow.com/questions/35711724/upload-progress-indicators-for-fetch
const { public: { uploadAcceptFormat } } = useRuntimeConfig();
const inputFileRef = ref();

const emit = defineEmits(['change']);

const onSelectFile = () => {
  if (!inputFileRef.value) {
    return;
  }
  inputFileRef.value.value = '';
  inputFileRef.value.click();
};

const onFileChange = () => {
  const { files } = inputFileRef.value;
  if (!files) {
    return;
  }
  const [file] = files;
  post(file);
};
const post = async (rawFile) => {
  // status: 'waiting' | 'uploading' | 'error'
  const wrapedFile = {
    uid: Date.now(),
    filename: rawFile.name,
    type: rawFile.type,
    status: 'uploading',
  };
  const option = {
    method: 'POST',
    file: rawFile,
    filename: 'file',
    data: {
      uid: wrapedFile.uid,
    },
    action: '/api/upload',
    onProgress: (event) => {
      wrapedFile.response = event;
      emit('change', wrapedFile);
    },
    onSuccess: (res) => {
      if (res === false) {
        option.onError(new Error(res));
        return;
      }
      wrapedFile.status = 'waiting';
      wrapedFile.response = res;
      emit('change', wrapedFile);
    },
    onError: (err) => {
      wrapedFile.status = 'error';
      wrapedFile.response = err;
      emit('change', wrapedFile);
    },
  };
  await upload(option);
};

const getError = (option, xhr) => {
  const msg = `cannot ${option.method} ${option.action} ${xhr.status}'`;
  const err = new Error(msg);
  err.status = xhr.status;
  err.method = option.method;
  err.url = option.action;
  return err;
};

const getBody = (xhr) => {
  const text = xhr.responseText || xhr.response;
  if (!text) {
    return text;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
};

const upload = (option) => {
  const xhr = new XMLHttpRequest();

  if (option.onProgress && xhr.upload) {
    xhr.upload.onprogress = function progress(e) {
      if (e.total > 0) {
        e.percent = (e.loaded / e.total) * 100;
      }
      option.onProgress(e);
    };
  }

  // eslint-disable-next-line no-undef
  const formData = new FormData();

  if (option.data) {
    Object.keys(option.data).map(function (key) {
      formData.append(key, option.data[key]);
    });
  }

  // eslint-disable-next-line no-undef
  if (option.file instanceof Blob) {
    formData.append(option.filename, option.file, option.file.name);
  } else {
    formData.append(option.filename, option.file);
  }

  xhr.onerror = function error(e) {
    option.onError(e);
  };

  xhr.onload = function onload() {
    // allow success when 2xx status
    // see https://github.com/react-component/upload/issues/34
    if (xhr.status < 200 || xhr.status >= 300) {
      return option.onError(getError(option, xhr), getBody(xhr));
    }

    return option.onSuccess(getBody(xhr), xhr);
  };

  xhr.open(option.method, option.action, true);

  // Has to be after `.open()`. See https://github.com/enyo/dropzone/issues/179
  if (option.withCredentials && 'withCredentials' in xhr) {
    xhr.withCredentials = true;
  }

  const headers = option.headers || {};

  // when set headers['X-Requested-With'] = null , can close default XHR header
  // see https://github.com/react-component/upload/issues/33
  if (headers['X-Requested-With'] !== null) {
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  }

  Object.keys(headers).forEach((h) => {
    if (headers[h] !== null) {
      xhr.setRequestHeader(h, headers[h]);
    }
  });

  xhr.send(formData);

  return {
    abort() {
      xhr.abort();
    },
  };
};
</script>
