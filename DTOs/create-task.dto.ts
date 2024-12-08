import { IsArray, IsDate, IsOptional, IsString } from "class-validator";

export class CreateTaskDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  status?: string;

  @IsString()
  comment?: string;

  @IsString()
  assignee: string;

  @IsOptional()
  @IsDate()
  due?: Date;
}
