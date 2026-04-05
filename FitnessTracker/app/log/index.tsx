import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useActivities } from '@/hooks/useActivities';

export default function LogActivityScreen() {
  const router = useRouter();
  const isDark = useColorScheme() === 'dark';
  const { logActivity } = useActivities();

  const [formData, setFormData] = useState({
    type: 'steps' as 'steps' | 'workout' | 'calories' | 'weight' | 'sleep',
    value: '',
    unit: 'steps',
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({
        ...formData,
        date: selectedDate.toISOString().split('T')[0],
      });
    }
  };

  const handleUnitChange = (type: string) => {
    const units: Record<string, string> = {
      steps: 'steps',
      workout: 'minutes',
      calories: 'kcal',
      weight: 'kg',
      sleep: 'hours',
    };
    setFormData({
      ...formData,
      type: type as any,
      unit: units[type] || 'units',
    });
  };

  const handleSubmit = async () => {
    if (!formData.value || isNaN(Number(formData.value))) {
      Alert.alert('Invalid Input', 'Please enter a valid number');
      return;
    }

    try {
      await logActivity({
        type: formData.type,
        value: Number(formData.value),
        unit: formData.unit,
        notes: formData.notes,
        date: formData.date,
      });

      Alert.alert('Success', 'Activity logged successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to log activity. Please try again.');
      console.error('Log activity error:', error);
    }
  };

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
      <ScrollView className="p-4">
        <View className="mb-6">
          <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'
            }`}>
            Log New Activity
          </Text>
        </View>

        {/* Activity Type */}
        <View className={`mb-4 rounded-lg p-4 ${isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
          <Text className={`font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
            Activity Type
          </Text>
          <Picker
            selectedValue={formData.type}
            onValueChange={handleUnitChange}
            style={{
              color: isDark ? '#e2e8f0' : '#1e293b',
            }}
            dropdownIconColor={isDark ? '#94a3b8' : '#64748b'}
          >
            <Picker.Item label="Steps" value="steps" />
            <Picker.Item label="Workout" value="workout" />
            <Picker.Item label="Calories" value="calories" />
            <Picker.Item label="Weight" value="weight" />
            <Picker.Item label="Sleep" value="sleep" />
          </Picker>
        </View>

        {/* Value Input */}
        <View className={`mb-4 rounded-lg p-4 ${isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
          <Text className={`font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
            {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} Count
          </Text>
          <TextInput
            value={formData.value}
            onChangeText={(text) => setFormData({ ...formData, value: text })}
            placeholder={`Enter ${formData.type} count`}
            keyboardType="numeric"
            className={`border rounded-lg px-4 py-3 ${isDark
                ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'
              }`}
          />
        </View>

        {/* Unit Display */}
        <View className={`mb-4 rounded-lg p-4 ${isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
          <Text className={`font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
            Unit
          </Text>
          <Text className={`px-4 py-3 rounded-lg ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
            }`}>
            {formData.unit}
          </Text>
        </View>

        {/* Date Picker */}
        <View className={`mb-4 rounded-lg p-4 ${isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
          <Text className={`font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
            Date
          </Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className={`px-4 py-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}
          >
            <Text className={`${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              {formData.date}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={new Date(formData.date)}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>

        {/* Notes */}
        <View className={`mb-6 rounded-lg p-4 ${isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
          <Text className={`font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
            Notes (Optional)
          </Text>
          <TextInput
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            placeholder="Add any notes about this activity..."
            multiline
            numberOfLines={3}
            className={`border rounded-lg px-4 py-3 h-24 ${isDark
                ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'
              }`}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          className={`py-4 rounded-xl mb-4 ${isDark ? 'bg-blue-600' : 'bg-blue-500'
            }`}
        >
          <Text className="text-white font-medium text-center text-lg">
            Log Activity
          </Text>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className={`py-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`}
        >
          <Text className={`font-medium text-center text-lg ${isDark ? 'text-gray-200' : 'text-gray-800'
            }`}>
            Cancel
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}