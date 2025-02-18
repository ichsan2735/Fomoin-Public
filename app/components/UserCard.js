import { gql, useMutation } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';

const TOGGLE_FOLLOW = gql`
mutation Follow($followingId: ID) {
  follow(followingId: $followingId)
}`

export default function UserCard({ user, action }) {
    // console.log(user);
    const navigation = useNavigation()
    const [isFollowedState, setIsFollowedState] = useState(false)

    const [toggleFollow, { error }] = useMutation(TOGGLE_FOLLOW)

    const handleFollow = async () => {
        try {
            setIsFollowedState((prev) => !prev)

            const result = await toggleFollow({
                variables: {
                    followingId: user._id
                }
            })

            Alert.alert(result.data.follow)

        } catch (error) {
            Alert.alert(error.message)
        }
    }

    useEffect(() => {
        setIsFollowedState(user.isFollowed)
    }, [])

    return (
        <TouchableOpacity onPress={() =>
            navigation.navigate("UserProfile", {
                userId: user._id
            })} style={styles.userCard}>

            {/* avatar */}
            <Image
                source={{ uri: `https://avatar.iran.liara.run/username?username=${user.username}` }}
                style={styles.avatar}
            />

            {/* user info containeer */}
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.username}</Text>
                <Text style={styles.userTitle}>{user.title}</Text>
            </View>

            {/* follow */}

            {!action && (isFollowedState ? (
                <TouchableOpacity onPress={handleFollow} style={styles.connectButton}>
                    <Text style={styles.connectButtonText}>Unfollow</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={handleFollow} style={styles.connectButton2}>
                    <Text style={styles.connectButtonText2}>+ Follow</Text>
                </TouchableOpacity>
            ))}


        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        marginBottom: 8,
        borderRadius: 8,
        borderColor: "black",
        borderWidth: 1,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderColor: "black",
        borderWidth: 1,
    },
    userInfo: {
        flex: 1,
        marginLeft: 12,
        // borderColor: "black",
        // borderWidth: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    userTitle: {
        fontSize: 14,
        color: '#666666',
        marginTop: 2,
    },
    connectButton: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#0A66C2',
    },
    connectButton2: {
        backgroundColor: '#0A66C2',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#0A66C2',
    },
    connectButtonText: {
        color: '#0A66C2',
        fontWeight: '600',
    },
    connectButtonText2: {
        color: '#FFFFFF',
        fontWeight: '600',
    }
})