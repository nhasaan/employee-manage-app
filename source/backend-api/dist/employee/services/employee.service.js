"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let EmployeeService = class EmployeeService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createEmployeeDto) {
        try {
            const department = await this.prisma.department.findUnique({
                where: {
                    id: createEmployeeDto.departmentId,
                    deletedAt: null,
                },
            });
            if (!department) {
                throw new common_1.BadRequestException('Department not found');
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
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ConflictException('Employee with this email already exists');
                }
            }
            throw error;
        }
    }
    async findAll(params = {}) {
        const { page = 1, perPage = 15, search, departmentId, minSalary, maxSalary, sortBy = 'name', sortDir = 'asc', } = params;
        const where = {
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
        const orderBy = sortBy === 'salary' ? { detail: { salary: sortDir } } : { [sortBy]: sortDir };
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
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Employee with ID ${id} not found`);
        }
        return employee;
    }
    async update(id, updateEmployeeDto) {
        try {
            const department = await this.prisma.department.findUnique({
                where: {
                    id: updateEmployeeDto.departmentId,
                    deletedAt: null,
                },
            });
            if (!department) {
                throw new common_1.BadRequestException('Department not found');
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
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new common_1.NotFoundException(`Employee with ID ${id} not found`);
                }
                if (error.code === 'P2002') {
                    throw new common_1.ConflictException('Employee with this email already exists');
                }
            }
            throw error;
        }
    }
    async remove(id) {
        try {
            await this.prisma.employee.update({
                where: { id },
                data: { deletedAt: new Date() },
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new common_1.NotFoundException(`Employee with ID ${id} not found`);
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
            averageSalary: dept.employees.length > 0
                ? dept.employees.reduce((sum, emp) => sum + (emp.detail?.salary || 0), 0) /
                    dept.employees.length
                : 0,
        }));
    }
    async getRecentEmployees(limit = 5) {
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
        const ranges = [
            { label: '0-30,000', min: 0, max: 30000 },
            { label: '30,001-50,000', min: 30001, max: 50000 },
            { label: '50,001-75,000', min: 50001, max: 75000 },
            { label: '75,001-100,000', min: 75001, max: 100000 },
            { label: '100,001-125,000', min: 100001, max: 125000 },
            { label: 'Over 125,000', min: 125001, max: Number.MAX_SAFE_INTEGER },
        ];
        const totalEmployees = await this.prisma.employee.count({
            where: { deletedAt: null },
        });
        const distribution = await Promise.all(ranges.map(async (range) => {
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
        }));
        return {
            totalEmployees,
            distribution,
        };
    }
};
exports.EmployeeService = EmployeeService;
exports.EmployeeService = EmployeeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmployeeService);
//# sourceMappingURL=employee.service.js.map