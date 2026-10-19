import {existsSync,writeFileSync} from 'node:fs';
import {randomBytes} from 'node:crypto';
import {hashPassword} from '../src/security.js';
if(existsSync('.env')){console.error('.env sudah ada. Tidak diubah. Untuk rotasi sandi, buat hash baru pada terminal aman dan hapus sesi database atau restart aplikasi.');process.exit(1);}
const password=randomBytes(24).toString('base64url');
writeFileSync('.env',`HOST=127.0.0.1\nPORT=3000\nPUBLIC_ORIGIN=http://localhost:3000\nNODE_ENV=development\nDATABASE_PATH=./data/brmp.sqlite\nADMIN_USER=admin\nADMIN_PASSWORD_HASH=${hashPassword(password)}\nOPENAI_API_KEY=\nOPENAI_MODEL=\nAI_DAILY_LIMIT=200\nAI_TIMEOUT_MS=20000\nTRUST_PROXY=0\n`,{mode:0o600});
console.log('Konfigurasi dibuat. Simpan kata sandi ini di password manager; tidak disimpan dalam bentuk asli.\nAdmin: admin\nKata sandi awal: '+password+'\nJalankan npm start, lalu buka http://localhost:3000/admin');
