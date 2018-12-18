import * as dotenv from "dotenv-safe";
dotenv.config(); // require('dotenv-safe').config();

import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import * as session from "express-session";
import * as connectRedis from "connect-redis";
import * as express from "express";
import { buildSchema } from "type-graphql";
import * as passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github";

import { createTypeormConn } from "./createTypeormConn";
import { UserResolver } from "./modules/user/UserResolver";
import { User } from "./entity/User";
import { redis } from "./redis";

// process.env.NODE_ENV = 'development';

const SESSION_SECRET = "ajslkjalksjdfkl";
const RedisStore = connectRedis(session as any);

const startServer = async () => {
  await createTypeormConn();

  const app = express();
  
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver]
    })
  });

  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
        prefix: redisSessionPrefix
      }),
      name: "qid",
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      }
    } as any)
  );

  passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: "http://localhost:4000/oauth/github"
    },
    async (accessToken, refreshToken, profile: any, cb) => {
      console.log(profile);
      let user = await User.findOne({ where: { githubId: profile.id } });
      if(!user) {
        user = await User.create({ 
          githubId: profile.id,
          // pictureUrl: profile.photos![0].value,
          pictureUrl: profile._json.avatar_url,
          bio: profile._json.bio
        }).save();        
      }

      cb(null, {
        user, 
        accessToken,
        refreshToken
      });
      
    }
  ));

  app.use(passport.initialize());


  app.get('/auth/github',
  passport.authenticate('github', { session: false }));

  app.get('/oauth/github', 
  passport.authenticate('github'), (req: any, res) => {
    console.log(req.user);
    // Successful authentication, redirect home.
    req.session.userId = req.user.user.id;
    req.session.accessToken = req.user.accessToken;
    req.session.refreshToken = req.user.refreshToken; 
    res.redirect('http://localhost:3000');
  });

  server.applyMiddleware({ app }); // app is from an existing express app

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();