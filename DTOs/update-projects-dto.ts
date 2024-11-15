import { PartialType } from "@nestjs/mapped-types";
import { IsString, IsOptional, IsArray } from "class-validator";
import { CreateProjectDto } from "./create-projects.dto";

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
    @IsOptional()
    @IsString({ each: true })
    manager_ids?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    members?: string[];

}