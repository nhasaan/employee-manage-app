import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Create departments
  const departments = await Promise.all(
    Array(10).fill(null).map(() => 
      prisma.department.create({
        data: {
          name: faker.company.name(),
          description: faker.company.catchPhrase()
        }
      })
    )
  );

  // Create employees
  for (let i = 0; i < 100; i++) {
    const department = departments[Math.floor(Math.random() * departments.length)];
    
    await prisma.employee.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        departmentId: department.id,
        detail: {
          create: {
            designation: faker.person.jobTitle(),
            salary: parseFloat(faker.finance.amount(30000, 150000, 2)),
            address: faker.location.streetAddress(),
            joinedDate: faker.date.past()
          }
        }
      }
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });