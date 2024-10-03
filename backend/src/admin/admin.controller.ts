import { Body, Controller, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe, Req, Request, Delete, BadRequestException, Query, NotFoundException, UseInterceptors, UploadedFile, Res } from "@nestjs/common";
import { AdminService } from "./admin.service";
import * as bcrypt from 'bcrypt';
import { AdminProfile } from "./admin.profile";
import { AdminEntity } from "./admin.entity";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { AdminGuard } from "src/auth/guards/admin.guard";
import { AdminProfileDTO, AdminUpdateDTO } from "./admin.dto";
import { AuthDTO } from "src/auth/dto/auth.dto";
import { Event_CoordinatorEntity } from "src/event-coordinator/event-coordinator.entity";
import { UpdateEventCoordinatorDTO } from "src/event-coordinator/event-coordinator.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage, MulterError } from "multer";

@Controller('/admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    //@UseGuards(JwtAuthGuard, AdminGuard)
    @Get('alladmin')
    getAll(): object {
        return this.adminService.getAllAdmin();
    }

    // @UseGuards(JwtAuthGuard, AdminGuard)
    @Get('getadmin/:id')
    getAdminById(@Param('id') id: number): object {
        return this.adminService.getAdminById(id);
    }

    // @UseGuards(JwtAuthGuard, AdminGuard)
    @Get('getadminbyemail/:email')
    getAdminByEmail(@Param('email') email: string): object {
        return this.adminService.getAdminByEmail(email);
    }

    @Get()
    async getAdminByQuery(
    @Query('id') id?: number,
    @Query('email') email?: string
    ): Promise<AdminEntity[]> {
    const admins = await this.adminService.findByIdAndEmail(id, email);
    if (!admins || admins.length === 0) {
        throw new NotFoundException('No admin found with provided criteria');
    }
    return admins;
    }


    @Post('createadmin')
    @UsePipes(new ValidationPipe)
    async createAdmin(@Body() myobj: AuthDTO): Promise<AuthDTO> {
      
      const salt = await bcrypt.genSalt();
      const hashedpassword = await bcrypt.hash(myobj.password, salt); 
      myobj.password= hashedpassword;  
      return this.adminService.createAdmin(myobj);
    }


    @UseGuards(JwtAuthGuard, AdminGuard)
    @Put('update-profile')
    @UsePipes(new ValidationPipe())
    async updateProfile(@Req() req, @Body() adminProfileDto: AdminUpdateDTO): Promise<any>{
        const user = req.user; 
        //const admin: AdminEntity = req.user;
        return this.adminService.updateAdmin(user.id, adminProfileDto);
    }

    // @Post('addimage')
    // @UseInterceptors(FileInterceptor('myfile',
    // { fileFilter: (req, file, cb) => {
    //     if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
    //     cb(null, true);
    //     else {
    //     cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
    //     }
    //     },
    //     limits: { fileSize: 30000 },
    //     storage:diskStorage({
    //     destination: './uploads',
    //     filename: function (req, file, cb) {
    //     cb(null,Date.now()+file.originalname)
    //     },
    //     })
    //     }
    // )
    // )
    // addImage(@Body() myobj:AdminProfileDTO,@UploadedFile() file: Express.Multer.File) {

    // myobj.admin_filename = file.filename;
    // return this.adminService.updateAdmin(myobj);

    // }


    @Get('/getimage/:name')
    getImage(@Param('name') filename:string, @Res() res) {

    res.sendFile(filename,{ root: './uploads' })
    }

    //Event-Coordinator

    @Post('addeventcoordinator/:id')
    async addCoordinator(@Param('id') id: number, @Body() myobj: Event_CoordinatorEntity,): Promise<Event_CoordinatorEntity> {

        return this.adminService.addCoordinator(id, myobj);
    }

    // @Post('addcoordinator/:id')
    // @UseInterceptors(FileInterceptor('myfile',
    // {storage:diskStorage({
    //     destination: './uploads',
    //     filename: function (req, file, cb) {
    //     cb(null,Date.now()+file.originalname)
    //     }
    // })
    // }))
    // addCoordinator(@Param('id') id: number, @Body() myobj: Event_CoordinatorEntity,@UploadedFile(  new ParseFilePipe({
    //     validators: [
    //     new MaxFileSizeValidator({ maxSize: 160000 }),
    //     new FileTypeValidator({ fileType: 'png|jpg|jpeg|' }),
    //     ],
    // }),) file: Express.Multer.File){
    
    // mydto.filename = file.filename;  
    // console.log(mydto)
    // return this.adminService.insertUser(mydto);
    // }

    
    //@UseGuards(JwtAuthGuard, AdminGuard)
    @Get('/getadminwithcoordinator')
    getAllAdminswithEventCoordinators(): Promise<AdminEntity[]> {
        return this.adminService.getAllAdminsWithCoordinators();
    }

    //@UseGuards(JwtAuthGuard, AdminGuard)
    @Get('eventcoordinator/:id')
    async getCoordinatorById(@Param('id') id: number): Promise<Event_CoordinatorEntity> {
        return this.adminService.getCoordinatorById(id);
    }

    @Put(':adminId/update-coordinator/:coordinatorId')
    async updateEventCoordinator(
    @Param('adminId') adminId: number,
    @Param('coordinatorId') coordinatorId: number,
    @Body() updateData: UpdateEventCoordinatorDTO
    ): Promise<Event_CoordinatorEntity> {
        console.log(`Admin ID: ${adminId}, Coordinator ID: ${coordinatorId}`); 

    if (!adminId || !coordinatorId) {
        throw new BadRequestException('Invalid admin or coordinator ID');
    }
    return this.adminService.updateEventCoordinator(adminId, coordinatorId, updateData);
    }

    //@UseGuards(JwtAuthGuard, AdminGuard)
    @Delete('delete-eventcoordinator/:id')
    async deleteCoordinator(@Param('id') id: number): Promise<void> {
        return this.adminService.deleteCoordinator(id);
    }
}