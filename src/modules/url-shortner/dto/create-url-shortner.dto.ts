import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { Timestamp } from "typeorm";

export class CreateUrlShortnerDto {
    @ApiProperty({
        example: "https://www.google.com"
    })
    @IsNotEmpty()
    @IsString()
    originalUrl: string;
}


export class ShortURLDataDto {
    originalUrl: string;
    shortUrl: string;
    visitorsCount: number;
    visitedAt: Timestamp[];
}
