import { Modal, Select, Input } from 'antd';
import { useState, useEffect } from 'react';

export type SettingModalPropsType = {
  open: boolean;
  pages: string;
  uid: string;
  onOk: (uid: string, pages: string) => void;
  onCancel: () => void;
};
export default function SettingModal(props: SettingModalPropsType) {
  const { open, uid, onOk, onCancel, pages = 'all' } = props;

  const [selectedValue, setSelectedValue] = useState('all');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setSelectedValue(pages === 'all' ? 'all' : 'custom');
    if (pages !== 'all') {
      setInputValue(pages);
    }
  }, []);

  const handleChange = (value: string) => {
    setSelectedValue(value);
  };

  const handleOk = () => {
    let value = null;
    if (selectedValue === 'all') {
      value = 'all';
    } else {
      value = inputValue || '1';
    }
    onOk(uid, value);
  };
  return (
    <>
      <Modal title="Setting" open={open} onOk={handleOk} onCancel={onCancel}>
        <div className="flex gap-4">
          <div className="mt-1">Pages</div>
          <div className="flex-1 grid gap-2">
            <Select
              className="w-full"
              value={selectedValue}
              onChange={handleChange}
              options={[
                { value: 'all', label: 'All' },
                { value: 'custom', label: 'Custom' },
              ]}
            />
            {selectedValue !== 'all' && (
              <Input
                value={inputValue}
                placeholder="e.g. 1-5, 8, 11-13"
                onChange={(event) => setInputValue(event.target.value)}
              />
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
