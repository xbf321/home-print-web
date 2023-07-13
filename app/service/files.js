const ipp = require('ipp');
const dayjs = require('dayjs');
const { Service } = require('egg');

class FilesService extends Service {
  async add(filename, fullPath) {
    const row = {
      id: Date.now(),
      name: filename,
      fullPath,
      printed: false,
      date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };
    await this.ctx.db.push('/files[]', row);
  }

  async remove(id) {
    const index = await this.ctx.db.getIndex('/files', parseInt(id, 10));
    const path = `/files[${index}]`;
    await this.ctx.db.delete(path);
  }

  async print(id) {
    const index = await this.ctx.db.getIndex('/files', parseInt(id, 10));
    const path = `/files[${index}]`;
    const item = await this.ctx.db.getData(path);
    // 1. 调用 IPP 打印
    // const printer = ipp.Printer("http://NPI977E4E.local.:631/ipp/printer");
    // var msg = {
    //     "operation-attributes-tag": {
    //         "requesting-user-name": "William",
    //         "job-name": "My Test Job",
    //         "document-format": "application/pdf"
    //     },
    //     data: pdf
    // };
    // printer.execute("Print-Job", msg, function(err, res){
    //     console.log(res);
    // });
    // 2. 更新当前数据
    await this.ctx.db.push(path, {
      ...item,
      printed: true,
    }, true);
  }

  async find(isShowAll = false) {
    let data = await this.ctx.db.getData('/files', []);
    if (!isShowAll) {
      data = data.filter(item => !item.printed);
    }
    data = data.reverse();
    return data;
  }
}

module.exports = FilesService;
