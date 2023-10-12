// @ts-nocheck
import defu from 'defu';
import fs from 'fs-extra';
import { JsonDB, Config } from 'node-json-db';
import IPPService from './ipp';

class FilesService {

  constructor() {
    const config = useRuntimeConfig();
    this.config = config;
  }

  get db() {
    const { dbFile } = this.config.private;
    return new JsonDB(new Config(dbFile, true, true));
  }

  async list() {
    let data = await this.db.getData('/files', []);
    data = data.sort((prev, next) => {
      if (prev.date > next.date) {
        return -1
      }
      return 1;
    });
    return data;
  }

  async add(item) {
    const row = defu(item, {
      status: 'waiting',
      date: new Date().getTime(),
    });
    row.uid = parseFloat(row.uid, 10);
    try {
      await this.db.push('/files[]', row);
    } catch(err) {
      throw err;
    }
    return true;
  }

  async remove(uid) {
    const index = await this.db.getIndex('/files', uid, 'uid');
    if (index < 0) {
      return false;
    }
    const path = `/files[${index}]`;
    const item = await this.db.getData(path);
    
    try {
      // 删除物理文件
      await fs.remove(item.filepath);
    } catch {
      // Do noting
    }

    try {
      // 删除 DB
      await this.db.delete(path);
    } catch(err) {
      throw err;
    }
    return true;
  }

  async getRebootTime() {
    return await this.db.getData('/rebootTime');
  }

  async updateRebootTime() {
    await this.db.push('/rebootTime', new Date().getTime());
  }

  async print(uid) {
    let isPrintSuccess = true;
    const index = await this.db.getIndex('/files', uid, 'uid');
    if (index < 0) {
      isPrintSuccess = false;
      return { isPrintSuccess, item: null };
    }
    const path = `/files[${index}]`;
    const item = await this.db.getData(path);
    try {
      isPrintSuccess = await IPPService.print(item);
      if (isPrintSuccess) {
        // 更新DB
        await this.db.push(
          path,
          {
            ...item,
            status: 'printed',
          },
          true,
        );
      }
    } catch (err) {
      throw new Error(err);
    }
    return { isPrintSuccess, item };
  }
}

export default new FilesService();
