import { Controller, Get, Req, Res, Post, HttpCode, Header } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('cats')
export class CatsController {
  @Get()
  findAll() {
    return 'This action returns all cats1.';
  }

  @Post()
  @HttpCode(204)
  @Header('Cache-Control', 'none')
  create(): string {
    return 'This action adds a new cat.'
  }

  @Get('express')
  findCatByName(@Req() request: Request, @Res() response: Response) {
    response.status(200).send('this action returns all cats2.');
  }
}
