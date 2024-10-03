import { IsEmail, IsNotEmpty, Matches } from "class-validator";

export class LoginDTO
{
    @IsEmail({}, { message: "Please enter a valid email address" })
    @Matches(/^[^@]+@[^@]+\.com$/, { message: "Email must be in the format user@domain.com" })
    email: string;

    @IsNotEmpty()
    password: string;

    // @IsNotEmpty()
    // role: string;
}