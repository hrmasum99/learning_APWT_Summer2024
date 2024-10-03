import { Optional } from "@nestjs/common";
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength } from "class-validator";

export class AdminDTO{

    @IsEmail({}, { message: "Please enter a valid email address" })
    @Matches(/^[^@]+@[^@]+\.com$/, { message: "Email must be in the format user@domain.com" })
    email: string;

    @IsNotEmpty()
    password: string;

    //filename: string;

    @Optional()
    id: number;
    // @Optional()
    // adminProfile: any;
    // @Optional()
    // evt_co: any;
    // @Optional()
    // judge: any;
    // @Optional()
    // entrepreneur: any;
    // @Optional()
    // review: any;
    // @Optional()
    // submissions: any;
    // @Optional()
    // notifications: any;
    // @Optional()
    // idea: any;
    // @Optional()
    // events: any;

    // @IsString({ message: "Please enter a valid NID number" })
    // @Matches(/^\d{13}$/, { message: "NID number must be exactly 13 digits" }) // Assuming NID is a 10 digit number
    // nid: string;
}

export class AdminUpdateDTO{
    @IsString({ message: "Please enter a valid name" })
    @Matches(/^[A-Za-z]+$/, { message: "Please enter a valid name" })
    admin_name: string;

    @IsString({ message: "Please enter a valid NID number" })
    @MaxLength(17)
    admin_NID: string;

    @IsNotEmpty({ message: "Please enter a valid phone number" })
    admin_phone: string;

    @IsNotEmpty()
    @IsString({ message: "Please enter a valid Gender" })
    admin_gender: string;

}

export class AdminProfileDTO{
    @IsString({ message: "Please enter a valid name" })
    @Matches(/^[A-Za-z]+$/, { message: "Please enter a valid name" })
    admin_name: string;

    @IsString({ message: "Please enter a valid NID number" })
    @MaxLength(17)
    admin_NID: string;

    @IsNotEmpty({ message: "Please enter a valid phone number" })
    admin_phone: string;

    @IsNotEmpty()
    @IsString({ message: "Please enter a valid Gender" })
    admin_gender: string;

    // admin_filename:string;

    // @Matches(/^\d{13}$/, { message: "NID number must be exactly 13 digits" }) 
}

export class AdminLoginDTO{
    email: string;
    password: string;
}