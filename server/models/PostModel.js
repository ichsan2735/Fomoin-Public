const { ObjectId } = require("mongodb")
const { database } = require("../configs/mongodb");

class PostModel {
    static collection() {
        return database.collection("Posts")
    }

    static async getAllPosts(username) {
        const agg = [
            {
                '$lookup': {
                    'from': 'Users',
                    'localField': 'authorId',
                    'foreignField': '_id',
                    'as': 'userDetail'
                }
            }, {
                '$unwind': {
                    'path': '$userDetail',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$addFields': {
                    'likeCount': { '$size': '$likes' }
                }
            }, {
                '$project': {
                    'userDetail.password': false
                }
            }, {
                '$sort': {
                    'updatedAt': -1
                }
            }
        ]

        const posts = await this.collection().aggregate(agg).toArray()

        posts.forEach(post => {
            post.isLiked = !post.likes ? false : post.likes?.some(like => like.username === username)
        });
        // const isLiked = posts.map(post => post.likes?.some(like => like.username === username))
        // console.log(posts);


        return posts
    }

    static async getPostById(postId, username) {
        const agg = [
            {

                '$match': {
                    _id: new ObjectId(String(postId))
                }

            },
            {
                '$lookup': {
                    'from': 'Users',
                    'localField': 'authorId',
                    'foreignField': '_id',
                    'as': 'userDetail'
                }
            }, {
                '$unwind': {
                    'path': '$userDetail',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$addFields': {
                    'likeCount': { '$size': '$likes' }
                }
            }, {
                '$lookup': {
                    'from': 'Users',
                    'localField': 'comments.username',
                    'foreignField': 'username',
                    'as': 'userComments'
                }
            }, {
                '$project': {
                    'userDetail.password': false,
                    'userComments.password': false,
                    'userComments.email': false
                }
            }
        ]

        const post = await this.collection().aggregate(agg).toArray()
        if (!post) throw new Error("Post not found")

        post[0].isLiked = !post[0].likes ? false : post[0].likes?.some(like => like.username === username)

        return post[0]
    }

    static async addPost(newPost) {
        const { content, tags, imgUrl, authorId, username, createdAt, updatedAt } = newPost

        newPost = await this.collection().insertOne({
            content, tags, imgUrl, username, createdAt, updatedAt,
            likes: [],
            comments: [],
            authorId: new ObjectId(String(authorId))
        })

        return newPost
    }

    static async addComment(postId, newComment) {
        return await this.collection().updateOne(
            {
                _id: new ObjectId(String(postId))
            },
            {
                $push: {
                    comments: newComment
                }
            })
    }

    static async toggleLike(postId, newLike) {
        let option = {}

        const isLiked = await this.collection().findOne({
            _id: new ObjectId(String(postId)),
            'likes.username': newLike.username
        })


        if (!isLiked) option.$push = { likes: newLike }
        if (isLiked) option.$pull = { likes: { username: newLike.username } }

        await this.collection().updateOne(
            {
                _id: new ObjectId(String(postId))
            },
            option
        )

        let message = isLiked ? `Removed like` : `Added like`

        return message
    }

}

module.exports = PostModel