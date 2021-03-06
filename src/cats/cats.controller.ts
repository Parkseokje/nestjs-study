import { Controller, Get, Req, Res, Post, Param, Body, HttpException, HttpStatus, UseFilters, ForbiddenException } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateCatDto } from './dto/cats.dto';
import { CatsService } from "./cats.service";
import { Cat } from "./interfaces/cat.interface";
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();

    // return new Promise((resolve) => {
    //   setTimeout(resolve, 2000);
    // }).then(function () {
    //   return ['cat1', 'cat3'];
    // })
  }

  @Get('error')
  @UseFilters(HttpExceptionFilter)
  // @UseFilters(new HttpExceptionFilter())
  getError() {
    // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    // throw new HttpException({
    //   status: HttpStatus.FORBIDDEN,
    //   error: 'This is a custom message.'
    // }, 403)
    throw new ForbiddenException();
  }

  @Get(':id')
  findOne(@Param() params): string {
    console.log(params.id);
    return `This action returns a #${params.id}`;
  }

  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
    // console.log(createCatDto.name);
    // return 'This action adds a new cat.'
  }

  @Get('express')
  findCatByName(@Req() request: Request, @Res() response: Response) {
    response.status(200).send('this action returns all cats2.');
  }
}
