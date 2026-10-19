import {DatabaseSync,backup} from 'node:sqlite';
import {mkdirSync,existsSync} from 'node:fs';
const source=process.env.DATABASE_PATH||'./data/brmp.sqlite';if(!existsSync(source))throw new Error('Database belum ada. Jalankan aplikasi terlebih dahulu.');mkdirSync('backups',{recursive:true});const target='backups/brmp-'+new Date().toISOString().replaceAll(':','-')+'.sqlite';const db=new DatabaseSync(source);await backup(db,target);db.close();console.log('Backup dibuat: '+target);
