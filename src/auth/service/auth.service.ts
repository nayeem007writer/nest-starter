import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { AuthDto, SigninDto } from '../dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from '../types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        private jwtService: JwtService
    ) { }

    hashPassword(data) {
        return bcrypt.hash(data, 12);
    }

    async createAccessToken(userId: number, email: string) {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                email
            }, { secret: 'at-secret' }),
            this.jwtService.signAsync({
                sub: userId,
                email
            }, { secret: 'rt-secret' })
        ]);
        return {
            access_token: at,
            refresh_token: rt,
        }

    }

    async updateRefreshToken(id: any, rt: string) {
        const hash = await this.hashPassword(rt);
        const userToUpdate = await this.userRepo.findOneBy(id);
        console.log(userToUpdate)
        if (userToUpdate) {
            userToUpdate.hashRt = hash;

            await this.userRepo.save(userToUpdate);
        }
    }

    async signup(dto: AuthDto): Promise<Tokens> {
        const { email, password } = dto;

        const hash = await this.hashPassword(password);

        const newUser = await this.userRepo.save({

            email: email,
            hash: hash
        });

        const token = this.createAccessToken(newUser.id, newUser.email);
        await this.updateRefreshToken(newUser.id, (await token).refresh_token);
        return token;
    }

    async signin(email: string, password: string):Promise<Tokens> {
        const user = await this.userRepo.findOne({
            where:{email:email},
            select:['id','email','hash']
           })
        console.log(user);
        if(!user) throw new ForbiddenException('invalid credential');

        const validPassword = await bcrypt.compare(password, (await user).hash);
        console.log(validPassword);
        if(!validPassword) throw new ForbiddenException('invalid credential');


        const token = await this.createAccessToken((await user).id, (await user).email);
        await this.updateRefreshToken((await user).id, (await token).refresh_token);
        return token;
     }

    signOut() { }

    refreshToken() { }
}
