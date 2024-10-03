import { Optional } from "@nestjs/common";
import { IsEmail, IsNotEmpty, Matches, MinLength } from "class-validator";

export class AuthDTO
{
    @IsEmail({}, { message: "Please enter a valid email address" })
    @Matches(/^[^@]+@[^@]+\.com$/, { message: "Email must be in the format user@domain.com" })
    email: string;

    @IsNotEmpty()
    @MinLength(8, { message: "Password must be at least 8 characters" })
    password: string;

    @Optional()
    role: string;
}