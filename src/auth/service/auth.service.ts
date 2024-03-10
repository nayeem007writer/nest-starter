import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { AuthDto } from '../dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from '../types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        private jwtService: JwtService
        ) {}

    hashPassword(data) {
        return bcrypt.hash(data, 12);
    }

    async createAccessToken(userId: number, email:string ) {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync({
                sub:userId,
                email
            },{secret: 'at-secret'}),
            this.jwtService.signAsync({
                sub:userId,
                email
            },{secret:'rt-secret'})
        ]);
        return {
            access_token: at,
            refresh_token: rt,
        }

    }

   async updateRefreshToken(userId: number, rt: string ) {
        const hash = await this.hashPassword(rt);
        const user = this.userRepo.findOne({where:{id:userId}});
        if(user) (await user).hashRt=hash;
    }

    async signup(dto: AuthDto): Promise<Tokens> {
        const { name, email, password} = dto;

        const hash = await this.hashPassword(password);

        const newUser = await this.userRepo.save({
            name:name,
            email:email,
            hash:hash
        });

        const  token = this.createAccessToken(newUser.id,newUser.email);
        await this.updateRefreshToken(newUser.id, (await token).refresh_token);
        return token;
    }

    signin() {}

    signOut() {}

    refreshToken(){}
}
