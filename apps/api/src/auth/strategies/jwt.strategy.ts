import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@yourcompanyofone/database';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { 
        organizations: {
          include: {
            organization: true
          }
        } 
      },
    });

    if (!user) {
      return null;
    }

    // Return the payload with user data for backward compatibility
    return {
      sub: payload.sub,
      email: payload.email,
      organizationId: payload.organizationId,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        organizations: user.organizations,
      },
    };
  }
} 