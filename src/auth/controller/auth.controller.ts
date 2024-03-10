import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthDto } from '../dto';
import { Tokens } from '../types';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('/local/signup')
    signup(@Body() dto: AuthDto): Promise<Tokens> {
        console.log(dto.email);
        return this.authService.signup(dto);
    }

    @Post('signin')
    signin() {
        this.authService.signin();
    }

    @Post('logout')
    signOut() {
        this.authService.signOut();
    }

    @Post('refresh')
    refreshToken() {
        this.authService.refreshToken();
    }

}
