import { ApiResponse } from '@nestjs/swagger';
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CategoryService } from './category.service';

const category = {
  id: 1,
  value: 'Food',
};

const categories = [
  {
    id: 1,
    value: 'Food',
  },
  {
    id: 2,
    value: 'Clothes',
  },
];

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiResponse({ example: categories })
  @Get()
  async findMany() {
    const [categories, err] = await this.categoryService.findMany();
    if (err) throw err;
    return categories;
  }

  @ApiResponse({ example: category })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [category, err] = await this.categoryService.findOne({ id });
    if (err) throw err;
    return category;
  }
}
