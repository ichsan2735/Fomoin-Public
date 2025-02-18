const FollowModel = require("../models/FollowModel")


const typeDefs = `#graphql
    type Follow {
        _id: ID
        followerId: ID
        followingId: ID
    }

    # type Query {
    #     followerByUserId(userId: ID): 
    # }

    type Mutation {
        follow(followingId: ID): String
    }
`

const resolvers = {
    // Query: {
    //     posts: async () => {

    //         const posts = await PostModel.getAllPosts()
    //         // console.log(posts);
    //         return posts
    //     }
    // },
    Mutation: {
        follow: async (parent, { followingId }, { auth }) => {
            const {_id, username} = await auth()

            const newFollow = {
                followingId,
                followerId: _id,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            const result = await FollowModel.toggleFollow(newFollow)

            return result
        }
    }
}

module.exports = { followTypeDefs: typeDefs, followResolvers: resolvers }