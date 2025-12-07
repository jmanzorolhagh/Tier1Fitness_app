import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { colors } from '../theme/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface VictoryChartProps {
  data: { label: string; steps: number }[];
  color: string; // Dynamic color (Blue or Green)
}

export const VictoryChart: React.FC<VictoryChartProps> = ({ data, color }) => {
  if (!data || data.length === 0) return null;

  // Prepare data for chart library
  const chartData = {
    labels: data.map(d => d.label),
    datasets: [{ data: data.map(d => d.steps) }]
  };

  return (
    <View style={[styles.container, { borderTopColor: color + '40' }]}>
      <Text style={[styles.title, { color: color }]}>WEEKLY MOMENTUM 📈</Text>
      
      <BarChart
        data={chartData}
        width={SCREEN_WIDTH - 80} // Card width minus padding
        height={180}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: 'transparent',
          backgroundGradientFrom: 'transparent',
          backgroundGradientTo: 'transparent',
          decimalPlaces: 0,
          // Use the prop color for the bars
          color: (opacity = 1) => {
            // Convert hex to rgb for opacity handling if needed, 
            // or just return the hex if opacity is 1
            return color; 
          },
          labelColor: (opacity = 1) => colors.textSecondary,
          barPercentage: 0.6,
        }}
        verticalLabelRotation={0}
        showValuesOnTopOfBars
        fromZero
        withInnerLines={false} // Cleaner look
        style={{ paddingRight: 0 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 5,
    letterSpacing: 1,
    textTransform: 'uppercase'
  }
});