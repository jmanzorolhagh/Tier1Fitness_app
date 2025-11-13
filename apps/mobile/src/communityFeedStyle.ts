import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    feedContainer: {
        padding: 16,
        backgroundColor: '#f2f4f7',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12,
    },
    username: {
        fontWeight: '600',
        fontSize: 16,
        color: '#111',
    },
    postSubtitle: {
        color: '#777',
        fontSize: 12,
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        backgroundColor: '#eee',
        marginBottom: 10,
    },
    imagePlaceholder: {
        width: '100%',
        height: 180,
        borderRadius: 8,
        backgroundColor: '#eef1f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    placeholderIcon: {
        fontSize: 30,
        color: '#bbb',
    },
    caption: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default styles;
