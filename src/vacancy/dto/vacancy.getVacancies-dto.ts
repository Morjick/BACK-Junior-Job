import { IsString, IsEnum, IsNumber } from 'class-validator'

export class SearchVacanciesDto {
    @IsString()
    sortColumn: string;

    @IsString()
    @IsEnum(['ASC', 'DESC'])
    sortBy: string;

    @IsNumber()
    limit: number;

    @IsNumber()
    offset: number;

    @IsString()
    title: string;

    @IsNumber()
    category: number;
}