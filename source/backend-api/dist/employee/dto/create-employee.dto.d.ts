export declare class CreateEmployeeDto {
    name: string;
    email: string;
    departmentId: number;
    designation: string;
    salary: number;
    address: string;
    joinedDate: Date;
}
export declare class UpdateEmployeeDto extends CreateEmployeeDto {
}
