import { 
  Injectable, 
  ConflictException, 
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from '../dto/create-department.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DepartmentService {
  constructor(private prisma: PrismaService) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    try {
      return await this.prisma.department.create({
        data: {
          name: createDepartmentDto.name,
          description: createDepartmentDto.description,
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Unique constraint violation
        if (error.code === 'P2002') {
          throw new ConflictException('Department with this name already exists');
        }
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.department.findMany({
      where: { deletedAt: null },
      include: { 
        _count: { 
          select: { employees: true } 
        } 
      }
    });
  }

  async findOne(id: number) {
    const department = await this.prisma.department.findUnique({
      where: { 
        id, 
        deletedAt: null 
      },
      include: { 
        employees: {
          where: { deletedAt: null }
        }
      }
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return department;
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    try {
      return await this.prisma.department.update({
        where: { id },
        data: {
          name: updateDepartmentDto.name,
          description: updateDepartmentDto.description,
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Department with ID ${id} not found`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException('Department with this name already exists');
        }
      }
      throw error;
    }
  }

  async remove(id: number) {
    // Check if department has any employees
    const employeeCount = await this.prisma.employee.count({
      where: { 
        departmentId: id,
        deletedAt: null 
      }
    });

    if (employeeCount > 0) {
      throw new BadRequestException('Cannot delete department with active employees');
    }

    try {
      await this.prisma.department.update({
        where: { id },
        data: { deletedAt: new Date() }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Department with ID ${id} not found`);
        }
      }
      throw error;
    }
  }
}