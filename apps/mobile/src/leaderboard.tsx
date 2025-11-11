import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import data from './lbData.json';
import styles from './lbStyles';

const Leaderboard = () => {
  const [tab, setTab] = useState<'weekly' | 'monthly'>('weekly');
  const ranks = data[tab] || [];

  const topThree = ranks.slice(0, 3);
  const yourEntry = ranks.find(entry => entry.name === 'You');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <View style={styles.toggleContainer}>
        <TouchableOpacity onPress={() => setTab('weekly')}>
          <Text style={[styles.toggleButton, tab === 'weekly' && styles.activeToggle]}>Weekly</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('monthly')}>
          <Text style={[styles.toggleButton, tab === 'monthly' && styles.activeToggle]}>Monthly</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.topThreeContainer}>
        {topThree.map((entry, idx) => (
          <View key={entry.id} style={styles.topItem}>
            <Text style={styles.topRank}>{idx + 1}</Text>
            <Text style={styles.topName}>{entry.name}</Text>
            <Text style={styles.topSteps}>{entry.steps.toLocaleString()} steps</Text>
          </View>
        ))}
      </View>
      <View style={styles.yourEntryContainer}>
        <Text style={styles.yourRank}>
          Your Rank: #{ranks.findIndex(e => e.name === 'You') + 1}
        </Text>
        <Text style={styles.yourSteps}>
          {yourEntry?.steps.toLocaleString()} steps
        </Text>
      </View>
      <FlatList
        data={ranks}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <View style={[styles.row, item.name === 'You' && styles.yourRow]}>
            <Text style={styles.rank}>{index + 1}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.steps}>{item.steps.toLocaleString()}</Text>
          </View>
        )}
        style={styles.list}
      />
    </View>
  );
};

export default Leaderboard;
