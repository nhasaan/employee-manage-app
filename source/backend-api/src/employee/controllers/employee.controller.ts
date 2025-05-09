import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Put, 
  Query,
  HttpCode, 
  HttpStatus 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiResponse, 
  ApiOperation, 
  ApiQuery 
} from '@nestjs/swagger';
import { EmployeeService } from '../services/employee.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../dto/create-employee.dto';

@ApiTags('employees')
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new employee' })
  @ApiResponse({ 
    status: 201, 
    description: 'Employee created successfully' 
  })
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get list of employees' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'perPage', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'departmentId', required: false, type: Number })
  @ApiQuery({ name: 'minSalary', required: false, type: Number })
  @ApiQuery({ name: 'maxSalary', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortDir', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({ 
    status: 200, 
    description: 'List of employees' 
  })
  async findAll(
    @Query('page') page?: number,
    @Query('perPage') perPage?: number,
    @Query('search') search?: string,
    @Query('departmentId') departmentId?: number,
    @Query('minSalary') minSalary?: number,
    @Query('maxSalary') maxSalary?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortDir') sortDir?: 'asc' | 'desc'
  ) {
    return this.employeeService.findAll({
      page,
      perPage,
      search,
      departmentId,
      minSalary,
      maxSalary,
      sortBy,
      sortDir
    });
  }

  @Get('department-statistics')
  @ApiOperation({ summary: 'Get department statistics' })
  @ApiResponse({ 
    status: 200, 
    description: 'Department statistics' 
  })
  async getDepartmentStatistics() {
    return this.employeeService.getDepartmentStatistics();
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recently joined employees' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ 
    status: 200, 
    description: 'Recently joined employees' 
  })
  async getRecentEmployees(
    @Query('limit') limit: number = 5
  ) {
    return this.employeeService.getRecentEmployees(limit);
  }

  @Get('salary-distribution')
  @ApiOperation({ summary: 'Get salary distribution' })
  @ApiResponse({ 
    status: 200, 
    description: 'Salary distribution statistics' 
  })
  async getSalaryDistribution() {
    return this.employeeService.getSalaryDistribution();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an employee by ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Employee details' 
  })
  async findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an employee' })
  @ApiResponse({ 
    status: 200, 
    description: 'Employee updated successfully' 
  })
  async update(
    @Param('id') id: string, 
    @Body() updateEmployeeDto: UpdateEmployeeDto
  ) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an employee' })
  @ApiResponse({ status: 204, description: 'Employee deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.employeeService.remove(id);
  }
}