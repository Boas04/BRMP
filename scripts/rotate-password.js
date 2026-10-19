import {readFileSync,writeFileSync} from 'node:fs';
import {randomBytes} from 'node:crypto';
import {hashPassword} from '../src/security.js';
const source=readFileSync('.env','utf8');const password=randomBytes(24).toString('base64url');const value='ADMIN_PASSWORD_HASH='+hashPassword(password);const updated=/^ADMIN_PASSWORD_HASH=.*$/m.test(source)?source.replace(/^ADMIN_PASSWORD_HASH=.*$/m,value):source+'\n'+value+'\n';writeFileSync('.env',updated,{mode:0o600});console.log('Password admin baru: '+password+'\nRestart aplikasi untuk menerapkan dan membatalkan semua sesi lama.');
