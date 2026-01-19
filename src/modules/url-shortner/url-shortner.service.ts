import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUrlShortnerDto, ShortURLDataDto } from './dto/create-url-shortner.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UrlShortnerEntity } from './entities/url-shortner.entity';
import { FindOptionsWhere, Repository, Timestamp } from 'typeorm';
import { nanoid } from 'nanoid';
import { IFindOneShortURL, IShowShortUrlFields } from './types/url-shortner.types';
import { FetchOriginalUrlDto } from './dto/fetch-short-url.dto';

@Injectable()
export class UrlShortnerService {
  constructor(
    @InjectRepository(UrlShortnerEntity)
    private readonly urlShortnerRepository: Repository<UrlShortnerEntity>
  ) { }


  async createShortURL({ originalUrl }: CreateUrlShortnerDto) {
    const shortUrlData: ShortURLDataDto = {
      originalUrl,
      shortUrl: nanoid(8),
      visitorsCount: 0,
      visitedAt: []
    }

    const shortUrl = this.urlShortnerRepository.create(shortUrlData);
    return await this.urlShortnerRepository.save(shortUrl)
  }

  async findOne({ id, shortUrl }: IFindOneShortURL, showFields?: IShowShortUrlFields): Promise<UrlShortnerEntity | null> {
    const whereOptions = {
      ...(id ? { id: id } : {}),
      ...(shortUrl ? { shortUrl: shortUrl } : {}),
    }

    const { showVisitedAt, showVisitorsCount, showCreatedAt } = showFields || {};
    const shortUrlInfo = await this.urlShortnerRepository.findOne({
      where: whereOptions,
      select: {
        id: true,
        originalUrl: true,
        shortUrl: true,
        visitedAt: showVisitedAt,
        visitorsCount: showVisitorsCount,
        createdAt: showCreatedAt,
      }
    })

    return shortUrlInfo;
  }

  async updateUrlInfo({ shortUrl }: FindOptionsWhere<UrlShortnerEntity>, updateData: Partial<UrlShortnerEntity>) {
    try {
      return await this.urlShortnerRepository.update({ shortUrl }, updateData)
    } catch (error) {
      Logger.error(error)
      throw error;
    }
  }

  async fetchUrlInfo({ shortUrl }: FetchOriginalUrlDto): Promise<UrlShortnerEntity> {
    try {

      const shortUrlInfo = await this.findOne({ shortUrl }, {
        showVisitorsCount: true,
        showVisitedAt: true
      })

      if (!shortUrlInfo) {
        throw new NotFoundException("Invalid short key provided")
      }

      const { visitedAt, visitorsCount } = shortUrlInfo || {};
      const updatedVisitedAt = Array.isArray(visitedAt) ? [...visitedAt, new Date()] : [new Date()];

      const updatedData = {
        visitorsCount: Number(visitorsCount) ? Number(visitorsCount) + 1 : 1,
        visitedAt: updatedVisitedAt as Timestamp[]
      }
      await this.updateUrlInfo({ shortUrl }, updatedData);

      return shortUrlInfo;
    } catch (error) {
      Logger.error(error)
      throw error;
    }
  }
}
