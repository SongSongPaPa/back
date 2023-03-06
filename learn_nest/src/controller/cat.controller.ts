
import { Controller, Get, Post, Body, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { CreateCatDto } from 'src/dto/create-cat.dto';


import { CatsService } from 'src/service/cat.service';
import { Cat } from 'src/interface/cat.interface';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Get("/test")
  test(): string {
    return "test";
  }

  @Get("/test/error")
  throwError(): string {
    // throw new HttpException("custom message", HttpStatus.EXPECTATION_FAILED);
    throw new NotFoundException();
  }
}