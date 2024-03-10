import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthDto, SigninDto } from '../dto';
import { Tokens } from '../types';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('/local/signup')
    signup(@Body() dto: AuthDto): Promise<Tokens> {
        console.log(dto.email);
        return this.authService.signup(dto);
    }

    @Post('/local/signin')
    signin(@Body() dto: AuthDto): Promise<Tokens> {
        console.log(dto);
        return this.authService.signin(dto.email, dto.password);
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
