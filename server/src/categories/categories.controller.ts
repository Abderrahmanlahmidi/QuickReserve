import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { DRIZZLE } from '../db/drizzle.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const [category] = await this.db
      .insert(schema.categories)
      .values(createCategoryDto)
      .returning();
    return category;
  }

  @Get()
  async findAll() {
    return await this.db.select().from(schema.categories);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const [category] = await this.db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.id, id))
      .limit(1);

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const [category] = await this.db
      .update(schema.categories)
      .set(updateCategoryDto)
      .where(eq(schema.categories.id, id))
      .returning();

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    const [category] = await this.db
      .delete(schema.categories)
      .where(eq(schema.categories.id, id))
      .returning();

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return { message: 'Category deleted successfully' };
  }
}
