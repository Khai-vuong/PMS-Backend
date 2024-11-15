import { IsEnum } from "class-validator";

export enum UserRole {
    ProjectManager = 'Project Manager',
    Member = 'Member',
    Guest = 'Guest'
}

export class UserRoleDTO {
    @IsEnum(UserRole)
    role: UserRole;
    constructor(role: UserRole) {
        this.role = role;
    }
}