import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AtStrategy, RtStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: 'at-secret',
        signOptions: {
          expiresIn: '30m', // Set the expiresIn for strategyOne
        },
        name: 'jwt' // Give a name to this strategy
      }),
    }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: 'rt-secret',
        signOptions: {
          expiresIn: '3600*24*15', // Set the expiresIn for strategyOne
        },
        name: 'jwt-refresh' // Give a name to this strategy
      }),
    }),
    
    TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [ AuthService, AtStrategy, RtStrategy ]
})
export class AuthModule {}
