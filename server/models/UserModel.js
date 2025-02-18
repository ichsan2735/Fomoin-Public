const { ObjectId } = require("mongodb");
const { database } = require("../configs/mongodb");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");

class UserModel {
  static collection() {
    return database.collection("Users")
  }

  static async getAllUsers(name, _id) {
    if (!name || name.trim() === '') {
      return [];
    }

    const agg = [
      {
        '$match': {
          '$or': [
            {
              'name': {
                '$regex': `${name}`,
                '$options': 'i'
              }
            }, {
              'username': {
                '$regex': `${name}`,
                '$options': 'i'
              }
            }
          ]
        }
      }, {
        '$lookup': {
          'from': 'Follows',
          'localField': '_id',
          'foreignField': 'followingId',
          'as': 'followers'
        }
      }, {
        '$project': {
          'password': false,
          'followers.followingId': false
        }
      }
    ]

    // const users = await this.collection().find({
    //   $or: [{
    //     name: {
    //       $regex: name || "",
    //       $options: "i"
    //     }
    //   },
    //   {
    //     username: {
    //       $regex: name || "",
    //       $options: "i"
    //     }
    //   }
    //   ]
    // }).toArray()

    // console.log(_id, "INI ICAN2");

    const users = await this.collection().aggregate(agg).toArray()
    users.forEach(user => {
      user.isFollowed = !user.followers ? false : user.followers.some(follower => String(follower.followerId) === String(_id))

    });

    // console.log(users[0].followers[0].followerId, `===`, _id, String(users[0].followers[0].followerId) === String(_id)) ;

    return users
  }

  static async getUserByIdAuth(_id) {
    const foundUser = await this.collection().findOne({
      _id: new ObjectId(String(_id))
    })

    if (!foundUser) throw new Error("")
    // console.log(foundUser);
    return foundUser
  }

  static async getUserById(userId) {
    const agg = [
      {
        '$match': {
          '_id': new ObjectId(String(userId))
        }
      }, {
        '$lookup': {
          'from': 'Follows',
          'localField': '_id',
          'foreignField': 'followingId',
          'as': 'followers'
        }
      }, {
        '$lookup': {
          'from': 'Users',
          'localField': 'followers.followerId',
          'foreignField': '_id',
          'as': 'followersDetail'
        }
      }, {
        '$lookup': {
          'from': 'Follows',
          'localField': '_id',
          'foreignField': 'followerId',
          'as': 'followings'
        }
      }, {
        '$lookup': {
          'from': 'Users',
          'localField': 'followings.followingId',
          'foreignField': '_id',
          'as': 'followingsDetail'
        }
      }, {
        '$project': {
          'password': false,
          'followersDetail.password': false,
          'followers': false,
          'followingsDetail.password': false,
          'followings': false
        }
      }
    ]

    const foundUser = await this.collection().aggregate(agg).toArray()
    
    // console.log(foundUser[0].followersDetail[0].followerId, `===`, userId, String(foundUser[0].followersDetail[0].followerId) === String(userId)) ;

    // if (foundUser[0].followersDetail) {
    //   foundUser[0].followersDetail.some(follower => String(follower.followerId) === String(userId))
    // }

    // console.log(foundUser[0]);
    

    return foundUser[0]
  }

  static async register(newUser) {
    const { name, username, email, password } = newUser

    if (!username) throw new Error("Username is required")

    const foundUsername = await this.collection().findOne({ username })
    if (foundUsername) throw new Error("Username already exist")


    if (!email) throw new Error("Email is required")

    const foundEmail = await this.collection().findOne({ email })
    if (foundEmail) throw new Error("Email already exist")

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@0-9]{2,}$/
    if (!EMAIL_REGEX.test(email)) throw new Error("Email format is invalid")


    if (!password) throw new Error("Password is required")
    if (password.length < 5) throw new Error("Password minimum character is 5")

    return await this.collection().insertOne({
      name, username, email,
      password: hashPassword(password)
    })
  }

  static async login(user) {
    const { username, password } = user

    if (!username) throw new Error("Username is required")
    if (!password) throw new Error("Password is required")

    // console.log(`masuk model login`);
    const foundUser = await this.collection().findOne({ username })



    if (!foundUser) throw new Error("Email or Password incorrect");

    const checkPassword = comparePassword(password, foundUser.password)

    if (!checkPassword) throw new Error("Email or Password incorrect");

    const token = signToken({ id: foundUser._id })

    return token
  }
}

module.exports = UserModel