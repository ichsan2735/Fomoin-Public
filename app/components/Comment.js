import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

export default function Comment({ comment }) {
    // console.log(comment);

    return (
        <View style={styles.commentItem}>

            {/* avatar */}
            <Image
                source={{ uri: "https://avatar.iran.liara.run/username?username=ICAN1" }}
                style={styles.commentAvatar}
            />

            {/* content */}
            <View style={styles.commentContent}>

                {/* user header */}
                <View style={styles.commentHeader}>

                    {/* username */}
                    <Text style={styles.commentUserName}>{comment.username}</Text>

                    {/* bio and time container */}
                    <View style={styles.commentBio}>
                        {/* bio */}
                        <Text style={styles.commentUserTitle}>Software Engineer</Text>

                        {/* timestamp */}
                        <Text style={styles.commentTimestamp}>21h ago</Text>
                    </View>
                </View>

                {/* content */}
                <Text style={styles.commentText}>{comment.content}</Text>

                {/* action */}
                <View style={styles.commentActions}>
                    <TouchableOpacity style={styles.commentAction}>
                        <Text style={styles.commentActionText}>Like</Text>
                        <Text style={styles.commentLikes}>{comment.likes}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.commentAction}>
                        <Text style={styles.commentActionText}>Reply</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    commentItem: {
        flexDirection: 'row',
        marginBottom: 16,
        // borderColor: "black",
        // borderWidth: 1,
    },
    commentAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        // borderColor: "black",
        // borderWidth: 1,
    },
    commentContent: {
        marginLeft: 12,
        flex: 1,
        // borderColor: "black",
        // borderWidth: 1,
    },
    commentHeader: {
        marginBottom: 4,
        // borderColor: "black",
        // borderWidth: 1,
    },
    commentBio: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    commentUserName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
    },
    commentUserTitle: {
        fontSize: 12,
        color: '#666666',
    },
    commentTimestamp: {
        fontSize: 12,
        color: '#666666',
        marginLeft: 4,
    },
    commentText: {
        fontSize: 14,
        color: '#000000',
        marginBottom: 4,
    },
    commentActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentAction: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    commentActionText: {
        fontSize: 12,
        color: '#666666',
        marginRight: 4,
    },
    commentLikes: {
        fontSize: 12,
        color: '#666666',
    },
})