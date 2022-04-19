import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.BASE_URL}/users/facebook/redirect`,
      scope: ['email', 'public_profile'],
      profileFields: ['id', 'emails', 'name', 'photos', 'displayName'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { id, emails, displayName, photos, provider } = profile;
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
