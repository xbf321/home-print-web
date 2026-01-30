import defu from 'defu';
import dayjs from 'dayjs';
import path from 'node:path';
import fs from 'fs-extra';
import { JsonDB, Config } from 'node-json-db';
import IPPService from './ipp';

class FilesService {
  get db() {
    const dbFile = path.join(process.cwd(), process.env.DB_FILE!);
    return new JsonDB(new Config(dbFile, true, true));
  }
  async remove(uid: string) {
    const index = await this.db.getIndex('/files', uid, 'uid');
    if (index < 0) {
      return false;
    }
    const path = `/files[${index}]`;
    const item = await this.db.getData(path);
    await this.db.delete(path);
    try {
      // 删除物理文件
      await fs.remove(item.filepath);
    } catch {
      // Do noting
    }
    return true;
  }

  async list() {
    let data: FileInfo[] = await this.db.getData('/files');
    data = data.sort((prev, next) => {
      if (prev.createdAt! > next.createdAt!) {
        return -1;
      }
      return 1;
    });
    return data;
  }


  async add(item: FileInfo) {
    const row = defu(item, {
      jid: '',
      pages: 'all',
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    });
    await this.db.push('/files[]', row);
    return row;
  }

  async update(uid: string, params = {}) {
    const index = await this.db.getIndex('/files', uid, 'uid');
    if (index < 0) {
      return null;
    }
    const path = `/files[${index}]`;
    await this.db.push(path, params, false);
    return await this.get(uid);
  }

  async get(uid: string) {
    const index = await this.db.getIndex('/files', uid, 'uid');
    if (index < 0) {
      return null;
    }
    const path = `/files[${index}]`;
    return await this.db.getData(path);
  }

  async getRebootTime() {
    return await this.db.getData('/rebootTime');
  }

  async updateRebootTime() {
    await this.db.push('/rebootTime', new Date().getTime());
  }
}

export default new FilesService();
