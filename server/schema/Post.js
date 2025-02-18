const redis = require("../configs/redis")
const PostModel = require("../models/PostModel")


const typeDefs = `#graphql
    type Post {
        _id: ID
        content: String
        tags: [String]
        imgUrl: String
        authorId: ID
        comments: [Comment]
        likes: [Like]
        isLiked: Boolean
        likeCount: Int
        createdAt: String
        updatedAt: String
        userDetail: User
        userComments: [UserComment]
    }

    type User {
        _id: ID
        name: String
        username: String
        bio: String
    }

    type Comment {
        content: String
        username: String
        createdAt: String
        updatedAt: String
    }

    type UserComment {
        username: String
        bio: String
    }

    type Like {
        username: String
        createdAt: String
        updatedAt: String
    }

    type Query {
        posts: [Post]
        postById(postId: ID): Post
    }

    type Mutation {
        addPost(content: String, tags: [String], imgUrl: String): String
        addComment(postId: ID, content: String): String
        toggleLike(postId: ID): String
    }
`

const resolvers = {
    Query: {
        posts: async (parent, args, { auth }) => {
            const { _id, username } = await auth()

            const postsCache = await redis.get("posts:all")
            if (postsCache) return JSON.parse(postsCache)

            const posts = await PostModel.getAllPosts(username)
            // console.log(posts);

            await redis.set("posts:all", JSON.stringify(posts))
            // await redis.del("posts:all")            

            return posts
        },
        postById: async (parent, { postId }, { auth }) => {
            const { _id, username } = await auth()

            const post = await PostModel.getPostById(postId, username)
            return post
        }
    },
    Mutation: {
        addPost: async (parent, args, { auth }) => {

            const { content, tags, imgUrl } = args

            if (!content) throw new Error("Description is required")

            const { _id, username } = await auth()
            if (!_id) throw new Error("Author is required")

            const newPost = {
                content, tags, imgUrl, authorId: _id, username,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            await PostModel.addPost(newPost)
            await redis.del("posts:all")

            return "Success add post"
        },
        addComment: async (parent, args, { auth }) => {

            const { postId, content } = args
            if (!content) throw new Error("Comment is required")

            const { username } = await auth()
            if (!username) throw new Error("username is required")


            const newComment = {
                content, username,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            await PostModel.addComment(postId, newComment)
            await redis.del("posts:all")

            return "Success add comment"
        },
        toggleLike: async (parent, args, { auth }) => {
            const { postId } = args
            const { username } = await auth()
            if (!username) throw new Error("username is required")

            const newLike = {
                username,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            const result = await PostModel.toggleLike(postId, newLike)
            await redis.del("posts:all")

            return result
        }
    }
}

module.exports = { postTypeDefs: typeDefs, postResolvers: resolvers }