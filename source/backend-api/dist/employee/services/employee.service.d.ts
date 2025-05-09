import { PrismaService } from '../../prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../dto/create-employee.dto';
export declare class EmployeeService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createEmployeeDto: CreateEmployeeDto): Promise<{
        department: {
            id: number;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
        detail: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            designation: string;
            salary: number;
            address: string;
            joinedDate: Date;
            employeeId: string;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        email: string;
        departmentId: number;
    }>;
    findAll(params?: {
        page?: number;
        perPage?: number;
        search?: string;
        departmentId?: number;
        minSalary?: number;
        maxSalary?: number;
        sortBy?: string;
        sortDir?: 'asc' | 'desc';
    }): Promise<{
        data: ({
            department: {
                id: number;
                name: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
            };
            detail: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                designation: string;
                salary: number;
                address: string;
                joinedDate: Date;
                employeeId: string;
            } | null;
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            email: string;
            departmentId: number;
        })[];
        meta: {
            current_page: number;
            per_page: number;
            total: number;
            last_page: number;
        };
    }>;
    findOne(id: string): Promise<{
        department: {
            id: number;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
        detail: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            designation: string;
            salary: number;
            address: string;
            joinedDate: Date;
            employeeId: string;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        email: string;
        departmentId: number;
    }>;
    update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<{
        department: {
            id: number;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
        detail: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            designation: string;
            salary: number;
            address: string;
            joinedDate: Date;
            employeeId: string;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        email: string;
        departmentId: number;
    }>;
    remove(id: string): Promise<void>;
    getDepartmentStatistics(): Promise<{
        id: number;
        name: string;
        employeeCount: number;
        averageSalary: number;
    }[]>;
    getRecentEmployees(limit?: number): Promise<({
        department: {
            id: number;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
        detail: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            designation: string;
            salary: number;
            address: string;
            joinedDate: Date;
            employeeId: string;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        email: string;
        departmentId: number;
    })[]>;
    getSalaryDistribution(): Promise<{
        totalEmployees: number;
        distribution: {
            range: string;
            count: number;
            percentage: number;
        }[];
    }>;
}
