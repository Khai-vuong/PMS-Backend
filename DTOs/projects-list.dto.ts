import { IsString } from "class-validator";

export class ProjectsListDto {
    @IsString()
    name: string;

    @IsString()
    model: string;

    @IsString()
    phase: string;

    @IsString()
    role?: 'Project manager' | 'Member';

    @IsString()
    pid: string;
}