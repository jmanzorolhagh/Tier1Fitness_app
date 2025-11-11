import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  toggleContainer: { flexDirection: 'row', marginBottom: 16 },
  toggleButton: { marginRight: 16, fontSize: 16, color: '#888', padding: 4 },
  activeToggle: { color: '#2874F0', fontWeight: 'bold', borderBottomWidth: 2, borderBottomColor: '#2874F0' },
  topThreeContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
  topItem: { alignItems: 'center' },
  topRank: { fontSize: 18, fontWeight: 'bold', color: '#FFA500' },
  topName: { fontSize: 16, fontWeight: 'bold' },
  topSteps: { fontSize: 14, color: '#555' },
  yourEntryContainer: { backgroundColor: '#f2f8fd', padding: 12, borderRadius: 8, marginBottom: 8, alignItems: 'center' },
  yourRank: { fontWeight: 'bold', fontSize: 16 },
  yourSteps: { color: '#2874F0', fontSize: 16 },
  list: { marginTop: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  yourRow: { backgroundColor: '#e6f2ff' },
  rank: { width: 30, fontWeight: 'bold' },
  name: { flex: 1 },
  steps: { width: 80, textAlign: 'right' }
});
