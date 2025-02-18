const { ObjectId } = require("mongodb")
const { database } = require("../configs/mongodb");

class FollowModel {
    static collection() {
        return database.collection("Follows")
    }

    static async toggleFollow(newFollow) {
        newFollow.followingId = new ObjectId(String(newFollow.followingId))

        // console.log(newFollow);
        

        const isFollowing = await this.collection().findOne({
            followingId: newFollow.followingId,
            followerId: newFollow.followerId

        })

        // console.log(isFollowing);
        
        
        let message = ""

        if (isFollowing) {
            this.collection().deleteOne(isFollowing)
            message = "Unfollowed user"

        } else {
            this.collection().insertOne(newFollow)
            message = "Followed user"

        }

        return message
    }

}

module.exports = FollowModel