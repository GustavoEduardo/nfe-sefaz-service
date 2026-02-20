import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco...');

 
  // USUÁRIO ADMIN

  const adminLogin = process.env.SEED_USER_LOGIN || '';
  const adminPassword = process.env.SEED_USER_PASSWORD || '';
  const adminName = process.env.SEED_USER_NAME || '';

  const adminExists = await prisma.user.findUnique({
    where: { login: adminLogin },
  });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.user.create({
      data: {
        name: adminName,
        login: adminLogin,
        password: hashedPassword,
      },
    });

    console.log('Usuário admin criado');
  } else {
    console.log('ℹUsuário admin já existe');
  }
}

main()
  .catch((error) => {
    console.error('Erro ao executar seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
