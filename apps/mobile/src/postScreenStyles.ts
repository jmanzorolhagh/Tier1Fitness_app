import { StyleSheet } from 'react-native';

const CreatePostStyles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: '#fff' },
  header: { fontSize: 26, fontWeight: 'bold', marginBottom: 18, color: '#161B22' },
  label: { marginTop: 16, marginBottom: 6, fontWeight: '600', fontSize: 15 },
  tabRow: { flexDirection: 'row', marginBottom: 8, gap: 12 },
  tab: { 
    borderWidth: 1, borderColor: '#dedede', borderRadius: 8,
    paddingVertical: 12, paddingHorizontal: 18, backgroundColor: '#f7f7f7'
  },
  tabSelected: { 
    borderColor: '#2874F0', backgroundColor: '#E6F1FC'
  },
  tabText: { color: '#444', fontWeight: '600' },
  tabTextSelected: { color: '#2874F0', fontWeight: '700' },
  input: { 
    borderWidth: 1, borderColor: '#dedede', borderRadius: 8, backgroundColor: '#F6F7FB',
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, minHeight: 45, marginBottom: 8,
  },
  shareButton: { 
    marginTop: 20, borderRadius: 8, backgroundColor: '#2874F0', paddingVertical: 14, alignItems: 'center'
  },
  shareButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});

export default CreatePostStyles;
