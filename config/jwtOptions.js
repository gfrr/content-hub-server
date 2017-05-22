const dotenv = require("dotenv");
const passportJWT = require("passport-jwt");
const ExtractJwt  = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const jwtOptions = {};
dotenv.config();
dotenv.load();

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = process.env.SECRET;

module.exports = jwtOptions;
