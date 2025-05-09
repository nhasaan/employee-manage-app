import { ApiProperty } from '@nestjs/swagger';
import { 
  IsNotEmpty, 
  IsString, 
  IsEmail, 
  IsNumber, 
  IsDate, 
  Min, 
  MinLength 
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEmployeeDto {
  @ApiProperty({ description: 'Employee name' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ description: 'Employee email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Department ID' })
  @IsNotEmpty()
  @IsNumber()
  departmentId: number;

  @ApiProperty({ description: 'Employee designation' })
  @IsNotEmpty()
  @IsString()
  designation: string;

  @ApiProperty({ description: 'Employee salary' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  salary: number;

  @ApiProperty({ description: 'Employee address' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ description: 'Employee joined date' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  joinedDate: Date;
}

export class UpdateEmployeeDto extends CreateEmployeeDto {}