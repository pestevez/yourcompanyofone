import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@yourcompanyofone/database';
import { AuthModule } from './auth/auth.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { UsersModule } from './users/users.module';
import { ContentModule } from './content/content.module';
import { PlatformsModule } from './platforms/platforms.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    OrganizationsModule,
    UsersModule,
    ContentModule,
    PlatformsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
