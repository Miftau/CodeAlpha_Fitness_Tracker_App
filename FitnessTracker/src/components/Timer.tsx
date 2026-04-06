import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { useTimer } from '@/hooks/useTimer';

interface Props {
    onComplete: (duration: number) => void;
}

export default function Timer({ onComplete }: Props) {
    const isDark = useColorScheme() === 'dark';
    const { time, isRunning, startTimer, pauseTimer, resetTimer, formatTime } = useTimer();

    const handleComplete = () => {
        pauseTimer();
        onComplete(time);
    };

    return (
        <View className={`rounded-2xl p isDark ? 'bg-gray-800' : 'bg-white'
    }`}>
            <Text className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'
                }`}>
                Workout Timer
            </Text>

            <View className="items-center mb-6">
                <Text className={`text-4xl font-mono ${isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                    {formatTime(time)}
                </Text>
            </View>

            <View className="flex-row gap-3">
                {!isRunning ? (
                    <TouchableOpacity
                        onPress={startTimer}
                        className={`flex-1 py-3 rounded-xl ${isDark ? 'bg-green-600' : 'bg-green-500'
                            }`}
                    >
                        <Text className="text-white font-medium text-center">
                            Start
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={pauseTimer}
                        className={`flex-1 py-3 rounded-xl ${isDark ? 'bg-yellow-600' : 'bg-yellow-500'
                            }`}
                    >
                        <Text className="text-white font-medium text-center">
                            Pause
                        </Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    onPress={resetTimer}
                    className={`py-3 px-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-200'
                        }`}
                >
                    <Text className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'
                        }`}>
                        Reset
                    </Text>
                </TouchableOpacity>
            </View>

            {time > 0 && (
                <TouchableOpacity
                    onPress={handleComplete}
                    className={`mt-4 py-3 rounded-xl ${isDark ? 'bg-blue-600' : 'bg-blue-500'
                        }`}
                >
                    <Text className="text-white font-medium text-center">
                        Save Workout
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}