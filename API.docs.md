Collecting workspace information```markdown
# API Documentation

## GraphQL Server

### Endpoint
```
POST /graphql
```

### Authentication
All requests must include an `Authorization` header with a valid Bearer token.

### Queries

#### `getUserByName(name: String): [User]`
Fetch users by their name or username.

**Arguments:**
- `name` (String): The name or username of the user.

**Response:**
```json
{
  "data": {
    "getUserByName": [
      {
        "_id": "string",
        "name": "string",
        "username": "string",
        "email": "string",
        "bio": "string",
        "isFollowed": "boolean"
      }
    ]
  }
}
```

#### `getUserById(userId: ID): UserFollow`
Fetch a user by their ID.

**Arguments:**
- `userId` (ID): The ID of the user.

**Response:**
```json
{
  "data": {
    "getUserById": {
      "_id": "string",
      "name": "string",
      "username": "string",
      "email": "string",
      "followersDetail": [
        {
          "_id": "string",
          "name": "string",
          "username": "string",
          "email": "string",
          "bio": "string"
        }
      ],
      "followingsDetail": [
        {
          "_id": "string",
          "name": "string",
          "username": "string",
          "email": "string",
          "bio": "string"
        }
      ]
    }
  }
}
```

#### `getCurrentUser: CurrentUser`
Fetch the current authenticated user.

**Response:**
```json
{
  "data": {
    "getCurrentUser": {
      "_id": "string",
      "name": "string",
      "username": "string",
      "email": "string",
      "bio": "string",
      "followersDetail": [
        {
          "_id": "string",
          "name": "string",
          "username": "string",
          "email": "string",
          "bio": "string"
        }
      ],
      "followingsDetail": [
        {
          "_id": "string",
          "name": "string",
          "username": "string",
          "email": "string",
          "bio": "string"
        }
      ]
    }
  }
}
```

#### `posts: [Post]`
Fetch all posts.

**Response:**
```json
{
  "data": {
    "posts": [
      {
        "_id": "string",
        "content": "string",
        "tags": ["string"],
        "imgUrl": "string",
        "authorId": "string",
        "comments": [
          {
            "content": "string",
            "username": "string",
            "createdAt": "string",
            "updatedAt": "string"
          }
        ],
        "likes": [
          {
            "username": "string",
            "createdAt": "string",
            "updatedAt": "string"
          }
        ],
        "isLiked": "boolean",
        "likeCount": "number",
        "createdAt": "string",
        "updatedAt": "string",
        "userDetail": {
          "_id": "string",
          "name": "string",
          "username": "string",
          "bio": "string"
        },
        "userComments": [
          {
            "username": "string",
            "bio": "string"
          }
        ]
      }
    ]
  }
}
```

#### `postById(postId: ID): Post`
Fetch a post by its ID.

**Arguments:**
- `postId` (ID): The ID of the post.

**Response:**
```json
{
  "data": {
    "postById": {
      "_id": "string",
      "content": "string",
      "tags": ["string"],
      "imgUrl": "string",
      "authorId": "string",
      "comments": [
        {
          "content": "string",
          "username": "string",
          "createdAt": "string",
          "updatedAt": "string"
        }
      ],
      "likes": [
        {
          "username": "string",
          "createdAt": "string",
          "updatedAt": "string"
        }
      ],
      "isLiked": "boolean",
      "likeCount": "number",
      "createdAt": "string",
      "updatedAt": "string",
      "userDetail": {
        "_id": "string",
        "name": "string",
        "username": "string",
        "bio": "string"
      },
      "userComments": [
        {
          "username": "string",
          "bio": "string"
        }
      ]
    }
  }
}
```

### Mutations

#### `register(name: String, username: String, email: String, password: String): String`
Register a new user.

**Arguments:**
- `name` (String): The name of the new user.
- `username` (String): The username of the new user.
- `email` (String): The email of the new user.
- `password` (String): The password of the new user.

**Response:**
```json
{
  "data": {
    "register": "Success registered new user"
  }
}
```

#### `login(username: String, password: String): LoginResponse`
Login a user.

**Arguments:**
- `username` (String): The username of the user.
- `password` (String): The password of the user.

**Response:**
```json
{
  "data": {
    "login": {
      "access_token": "string"
    }
  }
}
```

#### `logout: String`
Logout the current user.

**Response:**
```json
{
  "data": {
    "logout": "string"
  }
}
```

#### `addPost(content: String, tags: [String], imgUrl: String): String`
Create a new post.

**Arguments:**
- `content` (String): The content of the post.
- `tags` ([String]): The tags of the post.
- `imgUrl` (String): The image URL of the post.

**Response:**
```json
{
  "data": {
    "addPost": "Success add post"
  }
}
```

#### `addComment(postId: ID, content: String): String`
Add a comment to a post.

**Arguments:**
- `postId` (ID): The ID of the post.
- `content` (String): The content of the comment.

**Response:**
```json
{
  "data": {
    "addComment": "Success add comment"
  }
}
```

#### `toggleLike(postId: ID): String`
Toggle like on a post.

**Arguments:**
- `postId` (ID): The ID of the post.

**Response:**
```json
{
  "data": {
    "toggleLike": "Added like" | "Removed like"
  }
}
```

#### `follow(followingId: ID): String`
Follow or unfollow a user.

**Arguments:**
- `followingId` (ID): The ID of the user to follow or unfollow.

**Response:**
```json
{
  "data": {
    "follow": "Followed user" | "Unfollowed user"
  }
}
```
```