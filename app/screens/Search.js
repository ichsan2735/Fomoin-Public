import { useEffect, useState } from "react";
import {
    View,
    TextInput,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    Alert,
} from "react-native";
import { FontAwesome } from '@expo/vector-icons';

import UserCard from "../components/UserCard";
import { gql, useQuery } from "@apollo/client";

const GET_USERNAMES = gql`
query GetUserByName($name: String) {
  getUserByName(name: $name) {
    _id
    name
    username
    email
    bio
    isFollowed
  }
}`

export default function Search() {
    const [search, setSearch] = useState(null)
    // const [loading, setLoading] = useState(false)

    const [users, setUsers] = useState([])

    const { loading, data, error, refetch } = useQuery(GET_USERNAMES, {
        variables: { name: search },
        // onCompleted: (result) => {
        //     console.log(result.getUserByName, `ini oncompleted`);

        // }
    })

    useEffect(() => {
        const refetchSearch = async () => {
            try {
                const result = await refetch()
                // console.log(result.data.getUserByName, `ini refetch`);
                setUsers(result.data.getUserByName)
                // console.log(users);
                
            } catch (error) {
                Alert.alert(error.message)
            }
        }

        refetchSearch()
    }, [search])

    // if (loading) {
    //     return (
    //         <View>
    //             <ActivityIndicator color={"#0A66C2"} />
    //         </View>
    //     )
    // }

    return (
        <View style={styles.container}>

            {/* search bar */}
            <View style={styles.searchBar}>
                <FontAwesome name="search" size={20} color="#666" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search users..."
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            {/* results */}
            {loading ? (
                <ActivityIndicator style={styles.loading} />
            ) : (
                <FlatList
                    data={users}
                    renderItem={({ item }) => <UserCard user={item} />}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F2EF',
        borderColor: "black",
        borderWidth: 1,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E9E9E9',
        borderColor: "black",
        borderWidth: 1,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
    },
    loading: {
        marginTop: 20,
    },
    listContainer: {
        padding: 10,
        borderColor: "black",
        borderWidth: 1,
    }
})