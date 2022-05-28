import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_APP_ID,
      clientSecret: process.env.GOOGLE_APP_SECRET,
      callbackURL: `${process.env.BASE_URL}/users/google/redirect`,
      scope: ['email', 'profile'],
      profileFields: ['id', 'emails', 'name', 'photos', 'displayName'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, emails, photos, displayName, provider } = profile;
    const user = {
      id,
      email: emails[0].value,
      picture: photos[0].value,
      provider,
      displayName,
      accessToken,
    };
    done(null, user);
  }
}
