import { ActivityIndicator, Alert, Image, Keyboard, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";

const ADD_COMMENT = gql`
mutation AddComment($postId: ID, $content: String) {
  addComment(postId: $postId, content: $content)
}`

export default function AddComment({ postId, fetchPost }) {
    const [comment, setComment] = useState('');
    const [addComment, { loading }] = useMutation(ADD_COMMENT)

    const handleAddComment = async () => {
        try {
            const result = await addComment({
                variables: {
                    postId,
                    content: comment
                }
            })

            Keyboard.dismiss()
            setComment("")
            await fetchPost()
        } catch (error) {
            Alert.alert(error.message)
        }
    }

    return (
        <View style={styles.commentInputContainer}>
            <Image
                source={{ uri: 'https://avatar.iran.liara.run/username?username=ICAN1' }}
                style={styles.commentInputAvatar}
            />
            <TextInput
                style={styles.commentTextInput}
                placeholder="Add a comment..."
                value={comment}
                onChangeText={setComment}
                multiline
            />

            {/* send */}
            {loading ? (
                <ActivityIndicator />
            ) : (
                <TouchableOpacity onPress={handleAddComment}>
                    <Feather name="send" size={24} color="black" />
                </TouchableOpacity>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: "center",
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#E9E9E9',
        backgroundColor: '#FFFFFF',
    },
    commentInputAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    commentTextInput: {
        flex: 1,
        backgroundColor: '#F3F2EF',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        fontSize: 14,
    }
})