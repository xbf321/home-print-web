import { PrinterStatus } from "./app/lib/constant";

declare global {
  type FileInfo = {
    uid: string;
    type: string;
    name: string;
    status?: FileStatus;
    // 打印页码
    pages?: string;
    // 实际保存路径
    filepath?: string;
    // JobId
    jid?: string;
    createdAt?: string;
  };

  type PrinterInfo = {
    message: string;
    reasons: string;
    state: PrinterStatus
  };
}
export {};