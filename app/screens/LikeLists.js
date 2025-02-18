import { FlatList, StyleSheet, View } from "react-native"
import UserCard from "../components/UserCard"

export default function LikeLists({ route }) {
    const { postId, likes } = route.params
    // console.log(likes);
    

    return (
        <View style={styles.container}>

            <FlatList
                data={likes}
                renderItem={({ item }) => <UserCard user={item} action={"likes"} />}
                keyExtractor={(item, idx) => idx}
                contentContainerStyle={styles.listContainer}
            />
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
    listContainer: {
        padding: 10,
        borderColor: "black",
        borderWidth: 1,
    }
})
