import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface VictoryChartProps {
  data: { label: string; steps: number }[];
  color: string; 
}

export const VictoryChart: React.FC<VictoryChartProps> = ({ data, color }) => {
  if (!data || data.length === 0) return null;

  const chartData = {
    labels: data.map(d => d.label),
    datasets: [{ data: data.map(d => d.steps) }]
  };

  return (
    <View style={[styles.container, { borderTopColor: color + '40' }]}>
      <Text style={[styles.title, { color: color }]}>WEEKLY MOMENTUM 📈</Text>
      
      <BarChart
        data={chartData}
        width={SCREEN_WIDTH - 64} 
        height={180}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: 'transparent',
          backgroundGradientFrom: '#fff', 
          backgroundGradientFromOpacity: 0,
          backgroundGradientTo: '#fff',
          backgroundGradientToOpacity: 0,
          
          fillShadowGradient: color,
          fillShadowGradientOpacity: 1,
          fillShadowGradientFrom: color,
          fillShadowGradientFromOpacity: 1,

          decimalPlaces: 0,
          color: (opacity = 1) => color,
          labelColor: () => '#FFFFFF',
          
          barPercentage: 0.6,
          propsForBackgroundLines: {
            strokeDasharray: "", 
            stroke: "rgba(255,255,255,0.1)", 
            strokeWidth: 1
          }
        }}
        verticalLabelRotation={0}
        showValuesOnTopOfBars
        fromZero
        withInnerLines={true}
        style={{ 
          paddingRight: 0,
          marginTop: 10,
          backgroundColor: 'transparent' 
        }}
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
    width: '100%',
  },
  title: {
    fontWeight: '800',
    fontSize: 12,
    marginBottom: 5,
    letterSpacing: 1.5,
    textTransform: 'uppercase'
  }
});