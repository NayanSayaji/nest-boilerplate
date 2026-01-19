import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class FetchOriginalUrlDto {
    @ApiProperty({
        example: "78asd7a",
        description: "Short Url"
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(8)
    @MinLength(8)
    shortUrl: string
}