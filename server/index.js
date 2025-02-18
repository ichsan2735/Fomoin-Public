if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require("@apollo/server/standalone")
const { userTypeDefs, userResolvers } = require("./schema/User")
const { postTypeDefs, postResolvers } = require("./schema/Post")
const { followResolvers, followTypeDefs } = require("./schema/Follow")
const { verifyToken } = require("./helpers/jwt")
const UserModel = require("./models/UserModel")

const server = new ApolloServer({
    typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs],
    resolvers: [userResolvers, postResolvers, followResolvers],
    introspection: true
})

const connect = async () => {
    try {
        const { url } = await startStandaloneServer(server, {
            listen: { port: process.env.PORT },
            context: ({ req, res }) => {
                return {
                    auth: async () => {
                        const authorization = req.headers.authorization
                        // console.log(authorization);
                        
                        if (!authorization) throw new Error("Invalid token")

                        const [type, token] = authorization.split(" ")
                        if (type !== "Bearer") throw new Error("Invalid token")

                        const payload = verifyToken(token)
                        const user = await UserModel.getUserByIdAuth(payload.id)

                        return {
                            _id: user._id,
                            username: user.username
                        }
                    }
                }
            }
        });

        console.log(`🚀  Server ready at: ${url}`);
    } catch (error) {
        console.log(error);

    }
}

connect()
