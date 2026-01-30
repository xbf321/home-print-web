export const MinRebootHour = 1;

export const IPPRequestTimeout = 3000;

export const NeedToConvertExts = ['.doc', '.docx', '.xls', '.xlsx', '.csv'];

export enum FileStatus {
  // 上传中
  Uploading = 'uploading',
  // 上传失败
  UploadError = 'upload-error',
  // 待打印
  Waiting = 'waiting',
  // 打印中
  Processing = 'processing',
};

export enum PrinterStatus {
  Idle = 'idle',
  Processing = 'processing',
  Stopped = 'stopped',
};
