import { message as antdMessage } from 'antd';
export default async function request(url: string, params: any) {
  const response = await fetch(url, params);
  if (!response.ok) {
    const message = `url: ${response.url}, status: ${response.status}, statusText: ${response.statusText}`;
    antdMessage.error(message);
    return null;
  }
  const data = await response.json();
  return data;
}
