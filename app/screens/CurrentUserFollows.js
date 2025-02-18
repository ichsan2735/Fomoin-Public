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

const GET_CURRENT_USER = gql`
query GetCurrentUser {
  getCurrentUser {
    _id
    name
    username
    email
    followersDetail {
      _id
      name
      username
      email
      bio
    }
    followingsDetail {
      _id
      name
      username
      email
      bio
    }
  }
}`

export default function CurrentUserFollows({route}) {
    // const [search, setSearch] = useState(null)
    // const [loading, setLoading] = useState(false)
    // console.log(route.params);
    
    const {action} = route.params    
    const [users, setUsers] = useState([])

    const { loading, data, error, refetch } = useQuery(GET_CURRENT_USER)

    useEffect(() => {
        const refetchData = async () => {
            try {
                const result = await refetch()
                // console.log(result.data.getCurrentUser);
                
                // console.log(result.data.getUserByName, `ini refetch`);
                setUsers(result.data.getCurrentUser[action])
                
            } catch (error) {
                // console.log(error);
                
                Alert.alert(error.message)
            }
        }

        refetchData()
    }, [])

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
            {/* <View style={styles.searchBar}>
                <FontAwesome name="search" size={20} color="#666" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search users..."
                    value={search}
                    onChangeText={setSearch}
                />
            </View> */}

            {/* results */}
            {loading ? (
                <ActivityIndicator style={styles.loading} />
            ) : (
                <FlatList
                    data={users}
                    renderItem={({ item }) => <UserCard user={item} action={"profile"}/>}
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