import * as z from 'zod';

export const EmployeeSchema = z.object({
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name cannot exceed 50 characters" }),
  
  email: z.string()
    .email({ message: "Invalid email address" }),
  
  departmentId: z.number()
    .min(1, { message: "Department is required" }),
  
  designation: z.string()
    .min(2, { message: "Designation must be at least 2 characters long" })
    .max(50, { message: "Designation cannot exceed 50 characters" }),
  
  salary: z.number()
    .min(0, { message: "Salary must be a positive number" })
    .max(1000000, { message: "Salary is too high" }),
  
  address: z.string()
    .min(5, { message: "Address must be at least 5 characters long" })
    .max(200, { message: "Address cannot exceed 200 characters" }),
  
  joinedDate: z.date()
    .max(new Date(), { message: "Joined date cannot be in the future" })
});

// Type inference for TypeScript
export type EmployeeFormData = z.infer<typeof EmployeeSchema>;