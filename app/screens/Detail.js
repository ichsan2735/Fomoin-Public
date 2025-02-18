import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import Comment from '../components/Comment';
import { gql, useApolloClient, useMutation, useQuery } from '@apollo/client';
import AddComment from '../components/AddComment';
import { useNavigation } from '@react-navigation/native';

const GET_POST_BYID = gql`
query PostById($postId: ID) {
  postById(postId: $postId) {
    _id
    content
    tags
    imgUrl
    authorId
    comments {
      content
      username
      createdAt
      updatedAt
    }
    likes {
      username
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
    userDetail {
      _id
      name
      username
      email
      bio
    }
    isLiked
    likeCount
    userComments {
      username
      bio
    }
  }
}`

const TOGGLE_LIKE = gql`
    mutation ToggleLike($postId: ID) {
        toggleLike(postId: $postId)
    }
`

export default function Detail({ route }) {
    const { postId } = route.params

    const client = useApolloClient()
    const [loading, setLoading] = useState(true)
    const [likeCountState, setLikeCountState] = useState(0)
    const [likeState, setLikeState] = useState(false)
    const [post, setPost] = useState({})
    const navigation = useNavigation()

    // const [postById, { data }] = useQuery()
    const fetchPost = async () => {
        try {
            const result = await client.query({
                query: GET_POST_BYID,
                variables: { postId },
                fetchPolicy: "network-only"
            });
            setPost(result.data.postById)
            setLikeCountState(result.data.postById.likeCount)
            setLikeState(result.data.postById.isLiked)
            setLoading(false);
            // console.log(result);
            // console.log(`refetched post detail`);

        } catch (error) {
            Alert.alert(error.message)
        }
    };

    const [toggleLike, { error }] = useMutation(TOGGLE_LIKE)
    const handleLike = async () => {
        setLikeState((prev) => !prev)
        setLikeCountState((prev) => likeState ? (prev - 1) : (prev + 1))
        const result = await toggleLike({
            variables: {
                postId: post._id
            }
        })
        console.log(result);
    }

    useEffect(() => {
        fetchPost();
    }, []);

    // const { loading, data, error, refetch } = useQuery(GET_POST_BYID, {
    //     variables: { postId },
    //     onCompleted: (data) => {
    //         setPost(post)
    //         setLikeCountState(post.likeCount)
    //         setLikeState(post.isLiked)
    //     },
    //     onError: (error) => {
    //         Alert.alert(error.message)
    //     }
    // })


    // useEffect(() => {
    //     const fetchPostDetail = async () => {
    //         await refetch()
    //     }
    //     fetchPostDetail()
    // }, [])

    if (loading) {
        return (
            <View>
                <ActivityIndicator color={"#0A66C2"} />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>

                {/* user header */}
                <View style={styles.headerContainer}>

                    {/* left sectioon */}
                    <View style={styles.headerLeft}>

                        {/* avatar */}
                        <Image
                            source={{ uri: "https://avatar.iran.liara.run/username?username=ICAN1" }}
                            style={styles.avatar}
                        />

                        {/* user info */}
                        <View style={styles.userInfo}>

                            {/* usernamwe */}
                            <Text style={styles.userName}>{post.userDetail.username}</Text>

                            {/* bio */}
                            <Text style={styles.userBio}>{post.userDetail.bio}</Text>

                            {/* timestamp */}
                            <Text style={styles.timestamp}>10h ago</Text>
                        </View>
                    </View>

                    {/* right side */}
                    <View style={styles.headerRight}>

                        {/* follow */}
                        <TouchableOpacity style={styles.followButton}>
                            <FontAwesome5 name="plus" size={12} color="#0a66c2" />
                            <Text style={styles.followButtonText}>Follow</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* content */}
                <View style={styles.contentContainer}>
                    <Text style={styles.content}>{post.content}</Text>
                </View>

                {/* image container */}
                <TouchableOpacity style={styles.imageContainer}>

                    {/* image */}
                    {/* `https://image.pollinations.ai/prompt/${data.title}?width=768&height=768&seed=43&nologo=true&model=flux` */}
                    <Image
                        source={{
                            uri: `${post.imgUrl}`
                        }}
                        style={{
                            width: 300,
                            height: 300
                        }}
                    />
                </TouchableOpacity>

                {/* reaction */}
                <View style={styles.reactionsContainer}>

                    {/* like */}
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("Likes", {
                            postId: post._id,
                            likes: post.likes
                        })
                    }} style={styles.reactionLikes}>
                        <AntDesign style={styles.reactionIcon} name={"like1"} size={18} color={"gray"} />
                        <Text style={styles.reactionCount}>{likeCountState} likes</Text>
                    </TouchableOpacity>

                    {/* comments and shared */}
                    <View style={styles.reactionComments}>
                        <Text style={styles.reactionText}>
                            {post.comments?.length} comments | 7 shared
                        </Text>
                    </View>
                </View>

                {/* action */}
                <View style={styles.actionButtonsContainer}>

                    {/* like */}
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleLike}
                    >
                        <AntDesign style={styles.reactionIcon} name={likeState ? "like1" : "like2"} size={24} color={likeState ? "#0A66C2" : "gray"} />
                        <Text style={[styles.actionButtonText]}>
                            {/* , likeState && styles.actionButtonTextActive */}
                            Like
                        </Text>
                    </TouchableOpacity>

                    {/* comment */}
                    <TouchableOpacity style={styles.actionButton}>
                        <FontAwesome name="commenting-o" size={24} color="gray" />
                        <Text style={styles.actionButtonText}>Comment</Text>
                    </TouchableOpacity>

                    {/* share */}
                    <TouchableOpacity style={styles.actionButton}>
                        <SimpleLineIcons name="share" size={20} color="gray" />
                        <Text style={styles.actionButtonText}>Share</Text>
                    </TouchableOpacity>
                </View>

                {/* comments seciton */}
                <View style={styles.commentsContainer}>

                    {post.comments?.map((comment, index) => {

                        // post.userComments.forEach(userComment => {
                        //     if(userComment.username === comment.username) comment.userBio = userComment.bio
                        // });

                        return <Comment key={index} comment={comment} />
                    })}
                </View>
            </ScrollView>

            {/* form */}
            <AddComment postId={post._id} fetchPost={fetchPost} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollView: {
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        // borderColor: "black",
        // borderWidth: 1,
    },
    headerLeft: {
        flexDirection: 'row',
        flex: 1,
        // borderColor: "black",
        // borderWidth: 1,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        // borderColor: "black",
        // borderWidth: 1,
    },
    userInfo: {
        marginLeft: 12,
        flex: 1,
        // borderColor: "black",
        // borderWidth: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    userBio: {
        fontSize: 14,
        color: '#666666',
        marginTop: 2,
    },
    timestamp: {
        fontSize: 12,
        color: '#666666',
        // borderColor: "black",
        // borderWidth: 1,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "flex-end",
        // borderColor: "black",
        // borderWidth: 1,
    },
    followButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#0a66c2',
    },
    followButtonText: {
        color: '#0a66c2',
        marginLeft: 4,
        fontSize: 14,
        fontWeight: '600',
    },
    contentContainer: {
        padding: 16,
        // borderColor: "black",
        // borderWidth: 1,
    },
    content: {
        fontSize: 14,
        lineHeight: 20,
        color: '#000000',
    },
    imageContainer: {
        flexDirection: "row",
        justifyContent: "center",
        borderColor: "#000000",
        borderWidth: 1
    },
    reactionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E9E9E9',
        // borderColor: "black",
        // borderWidth: 1,
    },
    reactionLikes: {
        flexDirection: 'row',
        alignItems: 'center',
        // borderColor: "black",
        // borderWidth: 1,
    },
    reactionIcon: {
        marginRight: 4,
    },
    reactionCount: {
        fontSize: 12,
        color: '#0A66C2',
    },
    reactionComments: {
        flexDirection: 'row',
    },
    reactionText: {
        fontSize: 12,
        color: '#666666',
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#E9E9E9',
        // borderColor: "black",
        // borderWidth: 1,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    actionButtonText: {
        marginLeft: 4,
        fontSize: 14,
        color: '#666666',
    },
    actionButtonTextActive: {
        color: '#0a66c2',
    },
    commentsContainer: {
        padding: 16,
        // borderColor: "black",
        // borderWidth: 1,
    },
})

