const redis = require("../configs/redis")
const UserModel = require("../models/UserModel")

const typeDefs = `#graphql
    type User {
        _id: ID
        name: String
        username: String
        email: String
        bio: String
        isFollowed: Boolean
    }

    type UserFollow {
        _id: ID
        name: String
        username: String
        email: String
        followersDetail: [User]
        followingsDetail: [User]
    }

    type CurrentUser {
        _id: ID
        name: String
        username: String
        email: String
        bio: String
        followersDetail: [User]
        followingsDetail: [User]
    }

    type LoginResponse {
        access_token: String
    }

    type Query {
        users: [User]
        getUserByName(name: String): [User]
        getUserById(userId: ID): UserFollow
        getCurrentUser: CurrentUser
    }

    type Mutation {
        register(name: String, username: String, email: String, password: String): String
        login(username: String, password: String): LoginResponse
        logout: String
    }
`

const resolvers = {
    Query: {
        users: async () => {
            const users = await UserModel.getAllUsers()
            return users
        },
        getUserByName: async (parent, args, { auth }) => {
            // const user = await auth()
            // console.log(user);

            const { _id } = await auth()
            const { name } = args
            const foundUser = await UserModel.getAllUsers(name, _id)

            return foundUser
        },
        getUserById: async (parent, args, { auth }) => {
            let id;

            // const { userId } = args
            if (!args) {
                const { _id } = await auth()
                id = _id
            } else {
                id = args.userId
            }

            const foundUser = await UserModel.getUserById(id)

            return foundUser
        },
        getCurrentUser: async (parent, args, { auth }) => {
            const { _id } = await auth()

            const foundUser = await UserModel.getUserById(_id)

            return foundUser
        }
    },
    Mutation: {
        register: async (parent, args) => {
            const { name, username, email, password } = args
            const newUser = { name, username, email, password }

            await UserModel.register(newUser)

            return "Success registered new user"
        },
        login: async (parent, args) => {
            // console.log(`masuk`);


            const { username, password } = args
            const user = { username, password }


            const access_token = await UserModel.login(user)
            console.log(`${username} logged in`);

            return {
                access_token
            }
        },
        logout: async (parent, args, { auth }) => {
            const { username } = await auth()
            await redis.del("posts:all")
            console.log(`${username} logged out`);

            return `${username} successfully logged out`
        }
    }
}

module.exports = { userTypeDefs: typeDefs, userResolvers: resolvers }