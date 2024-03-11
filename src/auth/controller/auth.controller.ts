import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthDto, SigninDto } from '../dto';
import { Tokens } from '../types';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('local/signup')
    @HttpCode(HttpStatus.CREATED)
    signup(@Body() dto: AuthDto): Promise<Tokens> {
        console.log(dto.email);
        return this.authService.signup(dto);
    }

    @Post('local/signin')
    @HttpCode(HttpStatus.OK)
    signin(@Body() dto: AuthDto): Promise<Tokens> {
        console.log(dto);
        return this.authService.signin(dto.email, dto.password);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    signOut(@Req() req: Request) {
        const user = req.user;
        this.authService.signOut(user['id']);
    }

    @UseGuards(AuthGuard('jwt-refresh'))
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshToken(@Req() req: Request) {
        const user = req.user;
       return this.authService.refreshToken(user['id'],user['refreshToken']);
    }

}
