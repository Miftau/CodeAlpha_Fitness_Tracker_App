import { View, Text, StyleSheet, useColorScheme } from 'react-native';

interface Props {
  title: string;
  value: string;
  subtitle?: string;
  icon?: string;
}

export default function StatTile({ title, value, subtitle }: Props) {
  const isDark = useColorScheme() === 'dark';

  const styles = StyleSheet.create({
    container: {
      borderRadius: 12,
      padding: 16,
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    title: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#9ca3af' : '#6b7280',
    },
    value: {
      fontSize: 28,
      fontWeight: 'bold',
      marginTop: 4,
      color: isDark ? '#ffffff' : '#111827',
    },
    subtitle: {
      fontSize: 12,
      marginTop: 4,
      color: isDark ? '#6b7280' : '#d1d5db',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title}
      </Text>
      <Text style={styles.value}>
        {value}
      </Text>
      {subtitle && (
        <Text style={styles.subtitle}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}