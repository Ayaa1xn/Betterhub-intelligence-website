import { hashPassword } from '../server/security';

const password = process.argv[2];

if (!password) {
  console.error('Usage: npm run admin:hash -- "<password>"');
  process.exit(1);
}

console.log(hashPassword(password));
