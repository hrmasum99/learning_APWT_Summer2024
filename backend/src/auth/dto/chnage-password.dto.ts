import { IsString, MinLength,  } from "class-validator";

export class changePasswordDTO{
    @IsString()
    @MinLength(8, { message: "Password must be at least 8 characters" })
    oldpassword: string;

    @IsString()
    @MinLength(8, { message: "Password must be at least 8 characters" })
    newpassword: string;
}