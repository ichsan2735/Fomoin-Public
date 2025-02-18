import { Alert, Image, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

const ADD_POST = gql`
mutation AddPost($content: String, $tags: [String], $imgUrl: String) {
  addPost(content: $content, tags: $tags, imgUrl: $imgUrl)
}`

const GET_CURRENT_USER = gql`
query GetCurrentUser {
  getCurrentUser {
    _id
    name
    username
    bio
  }
}`

export default function AddPost() {
    const navigation = useNavigation()

    const [content, setContent] = useState('')
    const [imgUrl, setImgUrl] = useState('')
    const [tags, setTags] = useState('')
    const [profileData, setProfileData] = useState({})


    const [addPost, { loading }] = useMutation(ADD_POST, {
        refetchQueries: ["Posts"]
    })

    const { data, error, refetch } = useQuery(GET_CURRENT_USER)

    const handleSubmitPost = async () => {
        try {
            const newPost = {
                content, imgUrl,
                tags: tags.split(/[#,]/).map(el => el.trim()).filter(tag => tag)
            }

            // console.log(newPost);
            const result = await addPost({
                variables: newPost
            })

            Keyboard.dismiss()
            setContent('')
            setImgUrl('')
            setTags('')

            Alert.alert(result.data.addPost)
            navigation.navigate("Home")

        } catch (error) {
            Alert.alert(error.message)
        }
    }

    useEffect(() => {
        const refetchData = async () => {
            try {
                const result = await refetch()
                setProfileData(result.data.getCurrentUser)
            } catch (error) {
                Alert.alert(error.message)
            }
        }

        refetchData()
    }, [])

    return (
        <View style={styles.container}>

            {/* post header */}
            <View style={styles.header}>

                {/* back button */}
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>

                {/* right side */}
                <View style={styles.headerRight}>
                    {/* clear button */}
                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={() => {
                            setContent('')
                            setImgUrl('')
                            setTags('')
                        }}
                    >
                        <Text style={styles.clearButtonText}>
                            Clear
                        </Text>
                    </TouchableOpacity>

                    {/* post button */}
                    <TouchableOpacity
                        style={styles.postButton}
                        onPress={handleSubmitPost}
                    >
                        <Text style={styles.postButtonText}>
                            Post
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>

            {/* content container */}
            <View style={styles.content}>

                {/* user info container*/}
                <View style={styles.userInfo}>

                    {/* avatar */}
                    <Image
                        source={{ uri: `https://avatar.iran.liara.run/username?username=${profileData.username}` }}
                        style={styles.avatar}
                    />

                    {/* user info */}
                    <View>
                        <Text style={styles.userName}>{profileData.username}</Text>
                        <View style={styles.visibilityButton}>
                            <FontAwesome name="globe" size={14} color="#666666" />
                            <Text style={styles.visibilityText}>{profileData.bio}</Text>
                        </View>
                    </View>
                </View>

                {/* content */}
                <TextInput
                    style={styles.input}
                    placeholder="Leave your thoughts here..."
                    multiline
                    value={content}
                    onChangeText={setContent}
                    autoFocus
                />

                {/* image url */}
                <TextInput
                    style={styles.inputTags}
                    placeholder="Insert your image url"
                    multiline
                    value={imgUrl}
                    onChangeText={setImgUrl}
                    autoFocus
                />

                {/* tags */}
                <TextInput
                    style={styles.inputTags}
                    placeholder="Write tags? (separated by '#' or ',' )"
                    multiline
                    value={tags}
                    onChangeText={setTags}
                    autoFocus
                />
            </View>

            {/* bottom section */}
            {/* <View style={styles.toolbar}>
                <TouchableOpacity style={styles.toolbarButton}>
                    <FontAwesome name="image" size={24} color="#666666" />
                </TouchableOpacity>
            </View> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        // borderColor: "black",
        // borderWidth: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E9E9E9',
        // borderColor: "black",
        // borderWidth: 1,
    },
    headerRight: {
        flexDirection: "row",
        gap: 5,
        // borderColor: "black",
        // borderWidth: 1,
    },
    postButton: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#0A66C2',
    },
    clearButton: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: 'white',
        borderColor: "gray",
        borderWidth: 1,
    },
    postButtonDisabled: {
        backgroundColor: '#E9E9E9',
    },
    postButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    clearButtonText: {
        color: 'gray',
        fontWeight: '600',
    },
    postButtonTextDisabled: {
        color: '#666666',
    },
    content: {
        flex: 1,
        padding: 16,
        // borderColor: "black",
        // borderWidth: 1,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        // borderColor: "black",
        // borderWidth: 1,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    visibilityButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F2EF',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 16,
        borderColor: "black",
        borderWidth: 1,
    },
    visibilityText: {
        marginLeft: 4,
        fontSize: 12,
        color: '#666666',
    },
    input: {
        fontSize: 16,
        textAlignVertical: 'top',
        minHeight: 120,
        borderColor: "black",
        borderWidth: 1,
    },
    inputTags: {
        fontSize: 16,
        textAlignVertical: 'top',
        minHeight: 50,
        borderColor: "black",
        borderWidth: 1,
    },
    toolbar: {
        flexDirection: 'row',
        justifyContent: "flex-end",
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#E9E9E9',
        // borderColor: "black",
        // borderWidth: 1,
    },
    toolbarButton: {
        marginRight: 24,
    },
})