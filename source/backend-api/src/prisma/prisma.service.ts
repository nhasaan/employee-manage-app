import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async softDeleteDepartment(id: number) {
    return this.department.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  async softDeleteEmployee(id: string) {
    return this.employee.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  // Generic method with explicit type handling
  async softDelete(
    model: 'department' | 'employee', 
    id: number | string
  ) {
    switch (model) {
      case 'department':
        return this.softDeleteDepartment(id as number);
      case 'employee':
        return this.softDeleteEmployee(id as string);
      default:
        throw new Error(`Soft delete not supported for model: ${model}`);
    }
  }
}