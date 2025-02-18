import { ActivityIndicator, Alert, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as SecureStore from "expo-secure-store"
import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { gql, useMutation, useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";

const LOGOUT_USER = gql`
mutation Mutation {
  logout
}`

const GET_CURRENT_USER = gql`
query GetCurrentUser {
  getCurrentUser {
    _id
    name
    username
    email
    bio
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

export default function Profile({route}) {
    const [refreshing, setRefreshing] = useState(false)
    const [profileData, setProfileData] = useState({})
    const [logout] = useMutation(LOGOUT_USER)
    const { setIsLogin } = useContext(AuthContext)
    const navigation = useNavigation()

    const { loading, data, error, refetch } = useQuery(GET_CURRENT_USER)

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

    async function handleLogout() {
        try {
            const result = await logout()
            setIsLogin(false)
            await SecureStore.deleteItemAsync("access_token")

            Alert.alert(result.data.logout)
        } catch (error) {
            Alert.alert(error.message)
        }
    }

    const handleRefresh = async () => {
        try {
            const result = await refetch()
            setProfileData(result.data.getCurrentUser)
            // console.log(profileData);
            
        } catch (error) {
            Alert.alert(error.message)
        }
    }


    if (loading) {
        return (
            <View>
                <ActivityIndicator color={"#0A66C2"} />
            </View>
        )
    }

    return <ScrollView
        refreshControl={<RefreshControl onRefresh={handleRefresh} refreshing={refreshing} />}>

        {/* header */}
        <View style={styles.headerContainer}>

            {/* cover photo */}
            <Image
                source={{ uri: 'https://image.pollinations.ai/prompt/softwareengineer?width=768&height=768&seed=43&nologo=true&model=flux' }}
                style={styles.coverPhoto}
            />

            {/* avatar */}
            <Image
                source={{ uri: `https://avatar.iran.liara.run/username?username=${profileData.username}` }}
                style={styles.profilePhoto}
            />

            {/* header info */}
            <View style={styles.headerInfo}>

                {/* name */}
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'black' }}>{profileData.name}</Text>

                {/* headline */}
                <Text style={{ fontSize: 16, color: 'gray', marginTop: 4 }}>{profileData.bio}</Text>

                {/* location */}
                <Text style={{ fontSize: 14, color: 'gray', marginTop: 4 }}>Jakarta, Indonesia</Text>

                {/* follows section */}
                <View style={styles.followsSection}>
                    {/* followers */}
                    <TouchableOpacity onPress={() => navigation.navigate("Follows", { action: "followersDetail" })} style={styles.followsInfo}>
                        <Text style={{ fontSize: 14, color: '#0A66C2' }}>{profileData.followersDetail?.length} followers</Text>
                    </TouchableOpacity>

                    {/* followings */}
                    <TouchableOpacity onPress={() => navigation.navigate("Follows", { action: "followingsDetail" })} style={styles.followsInfo}>
                        <Text style={{ fontSize: 14, color: '#0A66C2' }}>{profileData.followingsDetail?.length} followings</Text>
                    </TouchableOpacity>
                </View>

            </View>

            {/* action button */}
            <View style={styles.actionButtons}>

                {/* message (soon) */}
                {/* <TouchableOpacity style={styles.messageButton}>
                    <Text style={{ color: 'white', fontWeight: '600' }}>Message</Text>
                </TouchableOpacity> */}

                {/* follow */}
                {/* <TouchableOpacity style={styles.followButton}>
                    <Text style={{ color: '#0A66C2', fontWeight: '600' }}>+ Follow</Text>
                </TouchableOpacity> */}

                {/* logout  */}
                <TouchableOpacity onPress={handleLogout} style={styles.followButton}>
                    <MaterialIcons name="logout" size={24} color="black" />
                </TouchableOpacity>

            </View>

        </View>
    </ScrollView>
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: 'white',
        marginBottom: 8,
        paddingBottom: 12,
        borderColor: "#000000",
        borderWidth: 1
    },
    coverPhoto: {
        width: '100%',
        height: 150,
        borderColor: "#000000",
        borderWidth: 1
    },
    profilePhoto: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: 'white',
        position: 'absolute',
        top: 100,
        left: 16,
    },
    headerInfo: {
        marginTop: 60,
        marginHorizontal: 16,
        // borderColor: "#000000",
        // borderWidth: 1
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: "flex-end",
        marginTop: 12,
        marginHorizontal: 16,
        // borderColor: "#000000",
        // borderWidth: 1
    },
    messageButton: {
        backgroundColor: '#0A66C2',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
    },
    followButton: {
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#0A66C2',
    },
    followsSection: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
        alignItems: "center"
    },
    followsInfo: {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#0A66C2',
        padding: 6,
        marginTop: 10
    }
});