import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { useAutoTracker } from '@/hooks/useAutoTracker';

interface Props {
  onTrackComplete: (data: { steps: number; pushups: number; distance: number; calories: number }) => void;
}

export default function AutoTracker({ onTrackComplete }: Props) {
  const isDark = useColorScheme() === 'dark';
  const { isTracking, counts, startTracking, stopTracking, resetCounts } = useAutoTracker();

  const handleComplete = () => {
    stopTracking();
    onTrackComplete(counts);
  };

  const formatCalories = (kcal: number) => {
    if (kcal < 1.0) {
      return `${Math.round(kcal * 1000)} cal`;
    }
    return `${kcal.toFixed(1)} kcal`;
  };

  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(2)} km`;
  };

  const MetricTile = ({ label, value, colorClass, darkColorClass }: any) => (
    <View className="items-center flex-1">
      <Text className={`text-2xl font-bold ${isDark ? darkColorClass : colorClass}`}>
        {value}
      </Text>
      <Text className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        {label}
      </Text>
    </View>
  );

  return (
    <View className={`rounded-3xl p-6 ${
      isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white shadow-xl'
    }`}>
      <View className="flex-row justify-between items-center mb-6">
        <Text className={`text-xl font-bold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Live Tracker
        </Text>
        {isTracking && (
          <View className="flex-row items-center gap-2">
            <View className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <Text className="text-red-500 text-xs font-bold uppercase">Live</Text>
          </View>
        )}
      </View>

      <View className="flex-row mb-8">
        <MetricTile label="Steps" value={counts.steps} colorClass="text-blue-600" darkColorClass="text-blue-400" />
        <MetricTile label="Pushups" value={counts.pushups} colorClass="text-green-600" darkColorClass="text-green-400" />
        <MetricTile label="Distance" value={formatDistance(counts.distance)} colorClass="text-purple-600" darkColorClass="text-purple-400" />
        <MetricTile label="Calories" value={formatCalories(counts.calories)} colorClass="text-orange-600" darkColorClass="text-orange-400" />
      </View>

      <View className="flex-row gap-3">
        {!isTracking ? (
          <TouchableOpacity
            onPress={startTracking}
            className={`flex-1 py-3 rounded-xl ${
              isDark ? 'bg-green-600' : 'bg-green-500'
            }`}
          >
            <Text className="text-white font-medium text-center">
              Start Tracking
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              onPress={stopTracking}
              className={`flex-1 py-3 rounded-xl ${
                isDark ? 'bg-red-600' : 'bg-red-500'
              }`}
            >
              <Text className="text-white font-medium text-center">
                Stop Tracking
              </Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          onPress={resetCounts}
          className={`py-3 px-4 rounded-xl ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`}
        >
          <Text className={`font-medium ${
            isDark ? 'text-gray-200' : 'text-gray-800'
          }`}>
            Reset
          </Text>
        </TouchableOpacity>
      </View>

      {isTracking && (
        <TouchableOpacity
          onPress={handleComplete}
          className={`mt-4 py-3 rounded-xl ${
            isDark ? 'bg-blue-600' : 'bg-blue-500'
          }`}
        >
          <Text className="text-white font-medium text-center">
            Save Results
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}