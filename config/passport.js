import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import {conectar,desconectarDb} from "./db.js";
import { ObjectId } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const SECRET = process.env.JWT_SECRET;

export function configurePassport(passport) {
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: SECRET
      },
      async (jwtPayload, done) => {
        try {
          const db = await connectDB();
          const user = await db
            .collection("usuarios")
            .findOne({ _id: new ObjectId(jwtPayload.id) });

          if (!user) return done(null, false);
          return done(null, user); // req.user = user
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );
}