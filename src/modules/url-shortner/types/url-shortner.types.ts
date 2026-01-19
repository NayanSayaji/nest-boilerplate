import { UrlShortnerEntity } from "../entities/url-shortner.entity";

export interface IShowShortUrlFields {
    showVisitorsCount?: boolean,
    showVisitedAt?: boolean,
    showCreatedAt?: boolean,
}

export interface IFindOneShortURL extends Partial<Pick<UrlShortnerEntity, 'id' | 'shortUrl'>> { }
