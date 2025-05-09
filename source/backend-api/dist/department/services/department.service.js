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
exports.DepartmentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let DepartmentService = class DepartmentService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDepartmentDto) {
        try {
            return await this.prisma.department.create({
                data: {
                    name: createDepartmentDto.name,
                    description: createDepartmentDto.description,
                }
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ConflictException('Department with this name already exists');
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
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Department with ID ${id} not found`);
        }
        return department;
    }
    async update(id, updateDepartmentDto) {
        try {
            return await this.prisma.department.update({
                where: { id },
                data: {
                    name: updateDepartmentDto.name,
                    description: updateDepartmentDto.description,
                }
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new common_1.NotFoundException(`Department with ID ${id} not found`);
                }
                if (error.code === 'P2002') {
                    throw new common_1.ConflictException('Department with this name already exists');
                }
            }
            throw error;
        }
    }
    async remove(id) {
        const employeeCount = await this.prisma.employee.count({
            where: {
                departmentId: id,
                deletedAt: null
            }
        });
        if (employeeCount > 0) {
            throw new common_1.BadRequestException('Cannot delete department with active employees');
        }
        try {
            await this.prisma.department.update({
                where: { id },
                data: { deletedAt: new Date() }
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new common_1.NotFoundException(`Department with ID ${id} not found`);
                }
            }
            throw error;
        }
    }
};
exports.DepartmentService = DepartmentService;
exports.DepartmentService = DepartmentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DepartmentService);
//# sourceMappingURL=department.service.js.map