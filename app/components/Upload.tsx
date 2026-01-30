import { FloatButton } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import RCUpload, { type UploadProps } from '@rc-component/upload';

export default function Upload(props: UploadProps) {
  const uploaderProps: UploadProps = {
    action: (file) => `/api/upload?uid=${file.uid}`,
    multiple: true,
    accept: '.png,.jpg,.jpeg,.doc,.docx,.pdf,.txt',
    capture: 'user',
    ...props,
  };
  return (
    <>
      <RCUpload {...uploaderProps}>
        <FloatButton
          shape="square"
          type="primary"
          style={{ insetInlineEnd: 24 }}
          icon={<UploadOutlined />}
        />
      </RCUpload>
    </>
  );
}
