'use client';
import dayjs from 'dayjs';
import { useState } from 'react';
import { message as antdMessage, Empty } from 'antd';

import Upload from '@/app/components/Upload';
import Item from '@/app/components/Item';
import SettingModal from '@/app/components/SettingModal';

import { FileStatus } from '@/app/lib/constant';
import request from '@/app/lib/request';

export default function HomeClient({ data }: { data: FileInfo[] }) {
  const [list, setList] = useState<FileInfo[]>(data || []);
  const [settingModal, setSettingModal] = useState({
    open: false,
    uid: '',
    pages: '',
  });

  const handleModalOk = async (uid: string, pages: string) => {
    handleModalCancel({
      uid: '',
      pages: 'all',
    });
    const response = await request('/api/update', {
      method: 'POST',
      body: JSON.stringify({ uid, pages }),
    });
    if (!response) {
      handleModalCancel({
        uid: '',
        pages: 'all',
      });
      return;
    }
    updateFileInfo(uid, {
      ...response,
    });
  };

  const handleModalCancel = (param = {}) => {
    setSettingModal({
      ...settingModal,
      ...param,
      open: false,
    });
  };

  const handleSetting = (file: FileInfo) => {
    setSettingModal({
      uid: file.uid,
      pages: file.pages || 'all',
      open: true,
    });
  };

  const handleDelete = async (file: FileInfo) => {
    if (file.status === FileStatus.UploadError) {
      setList(list.filter((a) => a.uid !== file.uid));
      return;
    }
    const response = await request('/api/deleted', {
      method: 'POST',
      body: JSON.stringify({ uid: file.uid }),
    });
    if (response === true) {
      setList(list.filter((a) => a.uid !== file.uid));
    }
  };

  const updateFileInfo = (uid: string, info = {}) => {
    setList((innerList) => {
      return innerList.map((item) => {
        if (item.uid === uid) {
          return {
            ...item,
            ...info,
          };
        }
        return item;
      });
    });
  };

  const handlePrint = async (file: FileInfo) => {
    const { uid } = file;
    updateFileInfo(uid, {
      status: FileStatus.Processing,
    });
    const data = await request('/api/print', {
      method: 'POST',
      body: JSON.stringify({ uid: file.uid }),
    });
    if (!data) {
      antdMessage.error('打印失败，请检查打印机状态。');
    }
    updateFileInfo(uid, {
      status: FileStatus.Waiting,
    });
  };

  return (
    <>
      <div className="flex-1 py-2 px-2 flex flex-col gap-2">
        {list.map((item) => {
          return (
            <Item
              key={item.uid}
              data={item}
              onDelete={handleDelete}
              onSetting={handleSetting}
              onPrint={handlePrint}
            />
          );
        })}
        {list.length === 0 && (
          <Empty className="flex flex-col items-center justify-center h-full" description={false} />
        )}
      </div>
      <Upload
        onBatchStart={(files) => {
          const nextList: FileInfo[] = [];
          files.forEach((item) => {
            const { uid, name, type } = item.file;
            nextList.push({
              uid,
              name,
              type,
              createdAt: dayjs().format('YYYY-MM-DD HH:mm'),
              status: FileStatus.Uploading,
            });
          });
          setList([...nextList, ...list]);
        }}
        onSuccess={(file) => {
          const { uid, status } = file;
          if (status === FileStatus.UploadError) {
            updateFileInfo(uid as string, {
              status: FileStatus.UploadError,
            });
            return;
          }
          updateFileInfo(uid as string, {
            ...file,
          });
        }}
        onError={(err, response, file) => {
          updateFileInfo(file.uid, {
            status: FileStatus.UploadError,
          });
          antdMessage.error(err.message);
        }}
      />
      {settingModal.open && (
        <SettingModal {...settingModal} onCancel={handleModalCancel} onOk={handleModalOk} />
      )}
    </>
  );
}
