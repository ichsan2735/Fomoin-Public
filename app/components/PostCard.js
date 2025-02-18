import { Image, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";

const TOGGLE_LIKE = gql`
    mutation ToggleLike($postId: ID) {
        toggleLike(postId: $postId)
    }
`

export default function PostCard({ post }) {
    const [likeState, setLikeState] = useState(post.isLiked)
    const [likeCountState, setLikeCountState] = useState(post.likeCount)
    // console.log(post, "di card")

    useEffect(() => {
        setLikeState(post.isLiked)
        setLikeCountState(post.likeCount)
    }, [post.isLiked, post.likeCount])

    const navigation = useNavigation()

    const [toggleLike, { loading, data, error }] = useMutation(TOGGLE_LIKE)

    const formatTags = post.tags.map(el => `#${el}`).join('')

    const handleLike = async () => {
        setLikeState((prev) => !prev)
        setLikeCountState((prev) => likeState ? (prev - 1) : (prev + 1))
        const result = await toggleLike({
            variables: {
                postId: post._id
            }
        })

        // console.log(result);
    }

    return (
        <View
            style={styles.container}
        >

            {/* user section */}
            <View style={styles.userContainer}>

                {/* avatar */}
                <Image
                    source={{
                        uri: `https://avatar.iran.liara.run/username?username=${post.userDetail.username}`
                    }}
                    style={{
                        width: 50,
                        height: 50
                    }}
                />

                <View style={styles.usernameContainer}>

                    {/* username */}
                    <Text>{post.userDetail.username}</Text>
                    {/* bio */}
                    <Text style={{color: "gray", fontSize: 12}}>{post.userDetail.bio}</Text>
                </View>

            </View>

            {/* content */}
            <Text>{post.content}</Text>
            <Text>{formatTags}</Text>

            {/* image container */}
            <TouchableOpacity onPress={() =>
                navigation.navigate("Detail", {
                    postId: post._id
                })
            } style={styles.imageContainer}>

                {/* image */}
                {/* `https://image.pollinations.ai/prompt/${post.title}?width=768&height=768&seed=43&nologo=true&model=flux` */}
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


            {/* action section */}
            <View style={styles.actionContainer}>

                {/* like container */}
                <TouchableOpacity onPress={() => {
                    navigation.navigate("Likes", {
                        postId: post._id,
                        likes: post.likes
                    })
                }} style={styles.likeContainer}>

                    {/* like stat */}
                    <Text style={{ fontSize: 10, color: "#0A66C2" }}>{likeCountState} likes</Text>
                </TouchableOpacity>

                {/* comment container */}
                <TouchableOpacity onPress={() =>
                    navigation.navigate("Detail", {
                        postId: post._id
                    })
                } style={styles.likeContainer}>
                    {/* comment stat */}
                    <Text style={{ fontSize: 10, color: "#0A66C2" }}>{post.comments?.length} comments</Text>
                </TouchableOpacity>

                {/* share container */}
                <View style={styles.likeContainer}>
                    {/* share stat */}
                    <Text style={{ fontSize: 10, color: "#0A66C2" }}>17 shared</Text>
                </View>

            </View>

            {/* action button */}
            <View style={styles.actionContainer}>

                {/* like container */}
                <TouchableOpacity onPress={handleLike} style={styles.likeContainer}>
                    {/* like button */}
                    <AntDesign name={likeState ? "like1" : "like2"} size={24} color={likeState ? "#0A66C2" : "gray"} />
                    <Text style={{ fontSize: 16, color: "gray" }}>Like</Text>
                </TouchableOpacity>

                {/* comment container */}
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate("Detail", {
                            postId: post._id
                        })
                    }
                    style={styles.likeContainer}>
                    {/* comment button */}
                    <FontAwesome name="commenting-o" size={24} color="gray" />
                    <Text style={{ fontSize: 16, color: "gray" }}>Comments</Text>
                </TouchableOpacity>

                {/* share container */}
                <View style={styles.likeContainer}>
                    {/* share button */}
                    <SimpleLineIcons name="share" size={18} color="gray" />
                    <Text style={{ fontSize: 16, color: "gray" }}>Share</Text>
                </View>


            </View>

        </View>)
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "col",
        gap: 5,
        backgroundColor: '#fff',
        padding: 15,
        // borderColor: "#000000",
        // borderWidth: 1,
        marginBottom: 10,
    },
    userContainer: {
        flexDirection: "row",
        // borderColor: "#000000",
        // borderWidth: 1
    },
    imageContainer: {
        flexDirection: "row",
        justifyContent: "center",
        borderColor: "#000000",
        borderWidth: 1
    },
    actionContainer: {
        flexDirection: "row",
        // borderColor: "#000000",
        // borderWidth: 1,
        alignItems: "center",
        justifyContent: "space-between",
    },
    likeContainer: {
        flexDirection: "row",
        gap: 1,
        alignItems: "center"
    },
    usernameContainer: {
        marginLeft: 10
    }
});