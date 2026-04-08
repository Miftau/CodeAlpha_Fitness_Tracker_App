import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  title: string;
  value: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  accentColor?: string;
}

export default function StatTile({ title, value, subtitle, icon, accentColor = '#6366f1' }: Props) {
  const isDark = useColorScheme() === 'dark';

  const softBg = accentColor + (isDark ? '22' : '18');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      minWidth: '44%',
      borderRadius: 20,
      padding: 18,
      backgroundColor: isDark ? '#1c2333' : '#ffffff',
      shadowColor: accentColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.25 : 0.12,
      shadowRadius: 12,
      elevation: 5,
    },
    iconBadge: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: softBg,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    title: {
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 0.5,
      textTransform: 'uppercase',
      color: isDark ? '#64748b' : '#94a3b8',
    },
    value: {
      fontSize: 26,
      fontWeight: '800',
      marginTop: 4,
      color: isDark ? '#f1f5f9' : '#0f172a',
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 12,
      marginTop: 3,
      color: accentColor,
      fontWeight: '500',
    },
    accentBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 3,
      backgroundColor: accentColor,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      opacity: 0.6,
    },
  });

  return (
    <View style={styles.container}>
      {icon && (
        <View style={styles.iconBadge}>
          <Ionicons name={icon} size={20} color={accentColor} />
        </View>
      )}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      <View style={styles.accentBar} />
    </View>
  );
}