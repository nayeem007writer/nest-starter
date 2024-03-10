import { Controller, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('/signup')
    signup(){
        this.authService.signup();
    }

    @Post('/signin')
    signin() {
        this.authService.signin();
    }

    @Post('/logout')
    signOut() {
        this.authService.signOut();
    }

    @Post('/refresh')
    refreshToken(){
        this.authService.refreshToken();
    }

}
