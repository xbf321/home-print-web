import { FileStatus } from '@/app/lib/constant';
import { Popconfirm, Radio, Tag } from 'antd';
const { Group, Button: GroupButton } = Radio;

const STATUS_COLOR_MAP: any = {
  [`${FileStatus.Uploading}`]: 'volcano',
  [`${FileStatus.UploadError}`]: 'red',
  [`${FileStatus.Waiting}`]: 'green',
  [`${FileStatus.Processing}`]: 'processing',
};
export default function Item({
  data: item,
  onDelete,
  onSetting,
  onPrint,
}: {
  data: FileInfo;
  onDelete: (file: FileInfo) => void;
  onPrint: (file: FileInfo) => void;
  onSetting: (file: FileInfo) => void;
}) {
  return (
    <>
      <article
        key={item.uid}
        className="rounded-lg border border-gray-100 bg-white dark:bg-gray-900 dark:*:text-white flex flex-col gap-1 p-2"
      >
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <svg viewBox="0 0 16 16" fill="currentColor" className="size-4">
              <path
                fillRule="evenodd"
                d="M4 1.75a.75.75 0 0 1 1.5 0V3h5V1.75a.75.75 0 0 1 1.5 0V3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2V1.75ZM4.5 6a1 1 0 0 0-1 1v4.5a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-7Z"
                clipRule="evenodd"
              ></path>
            </svg>
            <time className="text-xs/none font-semibold uppercase">{item.createdAt}</time>
          </p>
        </div>
        <p className="text-xl font-medium text-gray-900 break-all">{item.name}</p>
        <div className="!text-xs !text-gray-500">{item.pages && <>Pages: {item.pages}</>}</div>
        <div className="flex">
          <div>
            <Tag color={STATUS_COLOR_MAP[item.status]} variant="filled">
              {item.status}
            </Tag>
          </div>
          <div className="flex-1 text-right">
            <Group>
              <GroupButton
                className="!bg-white"
                disabled={item.status !== FileStatus.Waiting}
                onClick={() => onSetting(item)}
              >
                Setting
              </GroupButton>
              <Popconfirm
                title="Delete"
                description="Are you sure to delete this file?"
                onConfirm={() => onDelete(item)}
                okText="Yes"
                cancelText="No"
              >
                <GroupButton disabled={item.status === FileStatus.Processing} className="!bg-white">
                  Delete
                </GroupButton>
              </Popconfirm>

              <Popconfirm
                title="Confirm"
                description="Are you sure to print this file?"
                onConfirm={() => onPrint(item)}
                okText="Yes"
                cancelText="No"
              >
                <GroupButton disabled={item.status !== FileStatus.Waiting} className="!bg-white">
                  Print
                </GroupButton>
              </Popconfirm>
            </Group>
          </div>
        </div>
      </article>
    </>
  );
}
