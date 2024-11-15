import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateProjectDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsString()
    model: string;

    @IsString()
    phase: string;

    @IsOptional()
    @IsArray()
    manager_ids?: string[];

    @IsOptional()
    @IsArray()
    members?: string[];
}
