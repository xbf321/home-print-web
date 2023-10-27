import ip from 'ip';
export default defineEventHandler(async () => {
  return ip.address();
});