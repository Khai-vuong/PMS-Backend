import { IsArray, IsDate, IsOptional, IsString } from "class-validator";

export class CreateTaskDto {

    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsString()
    status: string;

    @IsString()
    comment: string;

    @IsDate()
    due: Date;
}
