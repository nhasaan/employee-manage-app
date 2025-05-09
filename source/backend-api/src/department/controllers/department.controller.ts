import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Put, 
  HttpCode, 
  HttpStatus,
  ParseIntPipe
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiResponse, 
  ApiOperation 
} from '@nestjs/swagger';
import { DepartmentService } from '../services/department.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from '../dto/create-department.dto';

@ApiTags('departments')
@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new department' })
  @ApiResponse({ 
    status: 201, 
    description: 'Department created successfully' 
  })
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentService.create(createDepartmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all departments' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of departments' 
  })
  async findAll() {
    return this.departmentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a department by ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Department details' 
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.departmentService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a department' })
  @ApiResponse({ 
    status: 200, 
    description: 'Department updated successfully' 
  })
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateDepartmentDto: UpdateDepartmentDto
  ) {
    return this.departmentService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a department' })
  @ApiResponse({ status: 204, description: 'Department deleted successfully' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.departmentService.remove(id);
  }
}