// @ts-nocheck
import IPPService from '../service/ipp';
export default defineEventHandler(async (event) => {
  let response = {};
  let statusCode = 200;
  try {
    response = await IPPService.getPrinterInfo();
  } catch(err) {
    statusCode = 408;
    response = {};
  } 
  const {
    'printer-state': printerState,
    'printer-state-message': printerStateMessage,
  } = response['printer-attributes-tag'] || {};
  if (printerState && printerState !== 'idle') {
    sendMessageToPusher(`打印机状态：${printerState}`, printerStateMessage);
  }
  event.node.res.setHeader('printer-state', printerState || '');
  event.node.res.setHeader('printer-state-message', printerStateMessage || '');
  event.node.res.statusCode = statusCode;
  event.node.res.end();
});