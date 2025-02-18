import { View, FlatList, ActivityIndicator, Text, Alert } from "react-native";
import PostCard from "../components/PostCard";
import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

const GET_POSTS = gql`
        query Posts {
  posts {
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
  }
}
`

export default function Home() {
    const [refreshing, setRefreshing] = useState(false)
    const [posts, setPosts] = useState([])
    const { loading, data, error, refetch } = useQuery(GET_POSTS, { fetchPolicy: 'network-only' })

    const handleRefresh = async () => {
        setRefreshing(true)
        try {
            const result = await refetch()
            // console.log(result.data.posts, "INI DI HOMEEEEEE");
            setPosts(result.data.posts)
            setRefreshing(false)
        } catch (error) {
            Alert.alert(error.message)
        }
    }

    const fetchPost = async (params) => {
        const result = await refetch()
        setPosts(result.data.posts)
        // console.log(result.data.posts, "INI DI HOMEEEEEE");
    }

    useEffect(() => {
        fetchPost()
    }, [])

    if (loading) {
        return (
            <View>
                <ActivityIndicator color={"#0A66C2"} />
            </View>
        )
    }

    if (error) {
        return (<View>
            <Text>{error.message}</Text>
        </View>)
    }

    return <View style={{
        // borderColor: "red",
        // borderWidth: 3,
    }}>
        <FlatList
            data={posts}
            renderItem={({ item }) => <PostCard post={item} />}
            keyExtractor={(item) => item._id}
            onRefresh={handleRefresh}
            refreshing={refreshing}
            style={{
                padding: 10,
                // borderColor: "red",
                // borderWidth: 1,
            }}
        />
    </View>
}
