import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { type Response } from 'express';
import { UrlShortnerService } from './url-shortner.service';
import { CreateUrlShortnerDto } from './dto/create-url-shortner.dto';
import { UpdateUrlShortnerDto } from './dto/update-url-shortner.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FetchOriginalUrlDto } from './dto/fetch-short-url.dto';

@ApiTags('URL Shortner')
@Controller('url-shortner')
export class UrlShortnerController {
  constructor(private readonly urlShortnerService: UrlShortnerService) { }

  @ApiOperation({
    summary: "Create a new shortURL"
  })
  @Post('')
  async createShortURL(@Body() body: CreateUrlShortnerDto) {
    return await this.urlShortnerService.createShortURL(body)
  }

  @ApiOperation({ summary: "Redirect to the original url" })
  @Get('/:shortUrl')
  async fetchOriginalUrl(@Param() { shortUrl }: FetchOriginalUrlDto, @Res() res: Response) {
    const { originalUrl } = await this.urlShortnerService.fetchUrlInfo({ shortUrl });
    res.status(301).redirect(originalUrl)
  }
}
