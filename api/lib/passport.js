import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as Auth0Strategy } from "passport-auth0";
import bcrypt from "bcryptjs";
import Users from "../schema/users.js";

export default function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        try {
          const user = await Users.findOne({ email: email.toLowerCase() });
          if (!user) {
            return done(null, false, { message: "Incorrect email." });
          }

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, { message: "Incorrect password." });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = process.env.JWT_SECRET;

  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await Users.findById(jwt_payload.id);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    })
  );

  passport.use(
    new Auth0Strategy(
      {
        domain: process.env.AUTH0_DOMAIN,
        clientID: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        callbackURL: process.env.AUTH0_CALLBACK_URL,
      },
      async (accessToken, refreshToken, extraParams, profile, done) => {
        // 'profile' berisi informasi pengguna dari Auth0 (Google)
        // seperti profile.id, profile.displayName, profile.emails, dll.
        try {
          // Cari pengguna berdasarkan email yang diberikan oleh provider
          const email =
            profile.emails && profile.emails[0]
              ? profile.emails[0].value.toLowerCase()
              : null;
          if (!email) {
            return done(
              new Error("Email not provided by authentication provider."),
              null
            );
          }

          let user = await Users.findOne({ email: email });

          if (!user) {
            // Jika pengguna tidak ada, buat pengguna baru
            user = new Users({
              // Auth0 ID bisa disimpan jika perlu: auth0Id: profile.id
              name: profile.displayName,
              email: email,
              password: "sso_login_no_password", // Password tidak relevan untuk SSO
              photoUrl: profile.picture,
            });
            await user.save();
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
}
