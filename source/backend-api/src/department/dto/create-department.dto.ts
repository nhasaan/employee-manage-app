import { ApiProperty } from '@nestjs/swagger';
import { 
  IsNotEmpty, 
  IsString, 
  MinLength, 
  IsOptional 
} from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty({ description: 'Department name' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ description: 'Department description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateDepartmentDto extends CreateDepartmentDto {}