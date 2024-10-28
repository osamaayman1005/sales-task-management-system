import { ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/users/users.service";
import { JwtPayload } from "../jwt-payload.interface";
import { Reflector } from "@nestjs/core";
import { UserRole } from "src/users/enums/user.role.enum";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private readonly usersService: UsersService,
         private readonly configService: ConfigService, private readonly reflector: Reflector) {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          ignoreExpiration: false,
          secretOrKey: configService.getOrThrow("JWT_ACCESS_TOKEN_SECRET")
        });
      }
    async validate(payload: JwtPayload){

      return await this.usersService.findOne(payload.id);
    }
}