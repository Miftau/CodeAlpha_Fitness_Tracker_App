import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { useAutoTracker } from '@/hooks/useAutoTracker';

interface Props {
  onTrackComplete: (data: { steps: number; pushups: number }) => void;
}

export default function AutoTracker({ onTrackComplete }: Props) {
  const isDark = useColorScheme() === 'dark';
  const { isTracking, counts, startTracking, stopTracking, resetCounts } = useAutoTracker();

  const handleComplete = () => {
    stopTracking();
    onTrackComplete(counts);
  };

  return (
    <View className={`rounded-2xl p-6 ${
      isDark ? 'bg-gray-800' : 'bg-white'
    }`}>
      <Text className={`text-xl font-bold mb-4 ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>
        Auto Tracker
      </Text>

      <View className="flex-row justify-between mb-6">
        <View className="items-center">
          <Text className={`text-2xl font-bold ${
            isDark ? 'text-blue-400' : 'text-blue-600'
          }`}>
            {counts.steps}
          </Text>
          <Text className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Steps
          </Text>
        </View>
        
        <View className="items-center">
          <Text className={`text-2xl font-bold ${
            isDark ? 'text-green-400' : 'text-green-600'
          }`}>
            {counts.pushups}
          </Text>
          <Text className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Pushups
          </Text>
        </View>
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