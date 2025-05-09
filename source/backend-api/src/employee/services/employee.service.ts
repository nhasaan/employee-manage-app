import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../dto/create-employee.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    try {
      // Verify department exists
      const department = await this.prisma.department.findUnique({
        where: {
          id: createEmployeeDto.departmentId,
          deletedAt: null,
        },
      });

      if (!department) {
        throw new BadRequestException('Department not found');
      }

      return await this.prisma.employee.create({
        data: {
          name: createEmployeeDto.name,
          email: createEmployeeDto.email,
          departmentId: createEmployeeDto.departmentId,
          detail: {
            create: {
              designation: createEmployeeDto.designation,
              salary: createEmployeeDto.salary,
              address: createEmployeeDto.address,
              joinedDate: createEmployeeDto.joinedDate,
            },
          },
        },
        include: {
          department: true,
          detail: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Unique constraint violation for email
        if (error.code === 'P2002') {
          throw new ConflictException('Employee with this email already exists');
        }
      }
      throw error;
    }
  }

  async findAll(
    params: {
      page?: number;
      perPage?: number;
      search?: string;
      departmentId?: number;
      minSalary?: number;
      maxSalary?: number;
      sortBy?: string;
      sortDir?: 'asc' | 'desc';
    } = {},
  ) {
    const {
      page = 1,
      perPage = 15,
      search,
      departmentId,
      minSalary,
      maxSalary,
      sortBy = 'name',
      sortDir = 'asc',
    } = params;

    const where: Prisma.EmployeeWhereInput = {
      deletedAt: null,
      AND: [
        departmentId ? { departmentId } : {},
        search
          ? {
              OR: [
                { name: { contains: search } },
                { email: { contains: search } },
                { detail: { designation: { contains: search } } },
              ],
            }
          : {},
        minSalary || maxSalary
          ? {
              detail: {
                salary: {
                  ...(minSalary && { gte: minSalary }),
                  ...(maxSalary && { lte: maxSalary }),
                },
              },
            }
          : {},
      ],
    };

    const orderBy: Prisma.EmployeeOrderByWithRelationInput =
      sortBy === 'salary' ? { detail: { salary: sortDir } } : { [sortBy]: sortDir };

    const totalCount = await this.prisma.employee.count({ where });

    const employees = await this.prisma.employee.findMany({
      where,
      include: {
        department: true,
        detail: true,
      },
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return {
      data: employees,
      meta: {
        current_page: page,
        per_page: perPage,
        total: totalCount,
        last_page: Math.ceil(totalCount / perPage),
      },
    };
  }

  async findOne(id: string) {
    const employee = await this.prisma.employee.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        department: true,
        detail: true,
      },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    try {
      // Verify department exists
      const department = await this.prisma.department.findUnique({
        where: {
          id: updateEmployeeDto.departmentId,
          deletedAt: null,
        },
      });

      if (!department) {
        throw new BadRequestException('Department not found');
      }

      return await this.prisma.employee.update({
        where: { id },
        data: {
          name: updateEmployeeDto.name,
          email: updateEmployeeDto.email,
          departmentId: updateEmployeeDto.departmentId,
          detail: {
            update: {
              designation: updateEmployeeDto.designation,
              salary: updateEmployeeDto.salary,
              address: updateEmployeeDto.address,
              joinedDate: updateEmployeeDto.joinedDate,
            },
          },
        },
        include: {
          department: true,
          detail: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Employee with ID ${id} not found`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException('Employee with this email already exists');
        }
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.employee.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Employee with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  async getDepartmentStatistics() {
    const departments = await this.prisma.department.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        _count: {
          select: { employees: { where: { deletedAt: null } } },
        },
        employees: {
          where: { deletedAt: null },
          select: {
            detail: {
              select: {
                salary: true,
              },
            },
          },
        },
      },
    });

    return departments.map((dept) => ({
      id: dept.id,
      name: dept.name,
      employeeCount: dept._count.employees,
      averageSalary:
        dept.employees.length > 0
          ? dept.employees.reduce((sum, emp) => sum + (emp.detail?.salary || 0), 0) /
            dept.employees.length
          : 0,
    }));
  }

  async getRecentEmployees(limit: number = 5) {
    return this.prisma.employee.findMany({
      where: { deletedAt: null },
      include: {
        department: true,
        detail: true,
      },
      orderBy: {
        detail: {
          joinedDate: 'desc',
        },
      },
      take: limit,
    });
  }

  async getSalaryDistribution() {
    // Define salary ranges
    const ranges = [
      { label: '0-30,000', min: 0, max: 30000 },
      { label: '30,001-50,000', min: 30001, max: 50000 },
      { label: '50,001-75,000', min: 50001, max: 75000 },
      { label: '75,001-100,000', min: 75001, max: 100000 },
      { label: '100,001-125,000', min: 100001, max: 125000 },
      { label: 'Over 125,000', min: 125001, max: Number.MAX_SAFE_INTEGER },
    ];

    // Total number of employees
    const totalEmployees = await this.prisma.employee.count({
      where: { deletedAt: null },
    });

    // Calculate distribution
    const distribution = await Promise.all(
      ranges.map(async (range) => {
        const count = await this.prisma.employee.count({
          where: {
            deletedAt: null,
            detail: {
              salary: {
                gte: range.min,
                lt: range.max,
              },
            },
          },
        });

        return {
          range: range.label,
          count,
          percentage: totalEmployees > 0 ? (count / totalEmployees) * 100 : 0,
        };
      }),
    );

    return {
      totalEmployees,
      distribution,
    };
  }
}
