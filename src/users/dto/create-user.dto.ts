import { IsEmail, IsStrongPassword } from "class-validator";
import { UserRole } from "../enums/user.role.enum";

export class CreateUserDto {
    @IsEmail()
    email: string;
    
    @IsStrongPassword()
    password: string;

    role?: UserRole;
}
