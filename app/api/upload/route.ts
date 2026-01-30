import fs from 'fs-extra';
import path from 'node:path';
import { NextRequest } from 'next/server';
import LoggerService from '@/app/service/logger';
import CloudConvertService from '@/app/service/cloudconvert';
import FilesService from '@/app/service/files';
import { FileStatus, NeedToConvertExts } from '@/app/lib/constant';

async function deletePhysicalFile(filepath: string) {
  try {
    // 删除物理文件
    await fs.remove(filepath);
  } catch {
    // Do noting
  }
}
export async function POST(req: NextRequest): Promise<Response> {
  let uploadStatus = false;
  const { searchParams } = new URL(req.url);
  const formData = await req.formData();
  const uid = searchParams.get('uid') as string;
  const file = formData.get('file') as File;
  const { name: rawFilename, type: fileType } = file;
  const physicalFilename = `${uid}_${rawFilename}`;
  const filepath = path.join(process.cwd(), process.env.UPLOAD_DIR!, physicalFilename);
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    fs.outputFileSync(filepath, buffer);
    LoggerService.sendToPusher(`文件上传成功， uid: ${uid}。`);
    uploadStatus = true;
  } catch (err) {
    LoggerService.sendToPusher('[Error]文件上传失败。', err);
  }
  if (!uploadStatus) {
    return Response.json({
      uid,
      status: FileStatus.UploadError,
    });
  }
  const item: FileInfo = {
    uid,
    type: fileType,
    name: rawFilename,
    status: FileStatus.Waiting,
    filepath,
  };

  // 是否需要转换
  const extname = path.extname(rawFilename);
  if (NeedToConvertExts.includes(extname)) {
    const {
      filepath: convertFilePath,
      mimetype: convertMimeType,
      error,
    } = await CloudConvertService.convert(filepath, fileType);
    item.filepath = convertFilePath;
    item.type = convertMimeType;
    // 转换失败，禁止上传
    // 因为上传上去，也打印不了
    if (error) {
      await deletePhysicalFile(filepath);
      return Response.json({
        uid,
        status: FileStatus.UploadError,
      });
    }
  }

  let saveSuccess = false;
  let fileInfo = null;
  try {
    fileInfo = await FilesService.add(item);
    saveSuccess = true;
  } catch (err) {
    LoggerService.sendToPusher('[Error]添加文件到 DB 失败。', err);
  }
  if (!saveSuccess) {
    await deletePhysicalFile(filepath);
    return Response.json({
      uid,
      status: FileStatus.UploadError,
    });
  }
  return Response.json({
    uid,
    status: FileStatus.Waiting,
    ...fileInfo,
  });
}
