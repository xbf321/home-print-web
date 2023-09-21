// @ts-nocheck
import IPPService from '../service/ipp';
export default defineEventHandler(async (event) => {
  // const response = (await IPPService.getPrinterInfo()) || {};
  const response = {};
  const {
    'printer-state': printerState,
    'printer-state-message': printerStateMessage,
  } = response['printer-attributes-tag'] || {};

  event.node.res.setHeader('printer-state', printerState || '');
  event.node.res.setHeader('printer-state-message', printerStateMessage || '');
  event.node.res.statusCode = 200;
  event.node.res.end();
});