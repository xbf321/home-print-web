'use client';
import { PrinterStatus } from '@/app/lib/constant';
import { Tag, Alert, Popconfirm, message as antdMessage } from 'antd';
import request from '@/app/lib/request';
export default function Header({ data }: { data: PrinterInfo | null }) {
  const { message = 'error', state = PrinterStatus.Stopped } = data || {};

  const handleReboot = async () => {
    const response = await request('/api/reboot', {
      method: 'POST',
    });
    if (!response) {
      return;
    }
    const { status, message } = response;
    if (!status) {
      antdMessage.error(`重启失败。原因：${message}`);
      return;
    }
    antdMessage.success('重启成功，请刷新页面。');
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-900">
        <div className="flex h-12 items-center px-3">
          <a className="block text-teal-600 dark:text-teal-300 font-bold text-2xl" href="/">
            Web Print System
          </a>

          <div className="flex-1 text-right">
            {state === PrinterStatus.Idle && (
              <Tag variant="solid" color={'green'}>
                {PrinterStatus.Idle}
              </Tag>
            )}
            {state === PrinterStatus.Processing && (
              <Tag variant="solid" color={'blue'}>
                {state}
              </Tag>
            )}
            {state === PrinterStatus.Stopped && (
              <>
                <Tag variant="solid" color={'red'}>
                  {state}
                </Tag>
              </>
            )}
          </div>
        </div>
      </header>
      {state === PrinterStatus.Stopped && (
        <Alert
          className="!mx-2 !mt-2"
          title={message}
          type="error"
          showIcon
          action={
            <Popconfirm
              title="Confirm"
              description="Are you sure to reboot this printer?"
              onConfirm={handleReboot}
              okText="Yes"
              cancelText="No"
            >
              <button className="ml-2 inline-block rounded-md bg-gray-100 px-5 py-1.5 text-sm font-medium text-teal-600 hover:text-teal-600/75 dark:bg-gray-800 dark:text-white dark:hover:text-white/75 cursor-pointer">
                Reboot
              </button>
            </Popconfirm>
          }
        />
      )}
    </>
  );
}
