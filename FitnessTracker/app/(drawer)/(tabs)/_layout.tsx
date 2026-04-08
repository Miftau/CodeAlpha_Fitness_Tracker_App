import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface TabConfig {
  name: string;
  title: string;
  icon: IoniconsName;
  iconFocused: IoniconsName;
}

const TABS: TabConfig[] = [
  { name: 'index',    title: 'Home',     icon: 'home-outline',     iconFocused: 'home'      },
  { name: 'log',      title: 'Log',      icon: 'create-outline',   iconFocused: 'create'    },
  { name: 'timer',    title: 'Timer',    icon: 'timer-outline',    iconFocused: 'timer'     },
  { name: 'schedule', title: 'Schedule', icon: 'calendar-outline', iconFocused: 'calendar'  },
  { name: 'goals',    title: 'Goals',    icon: 'trophy-outline',   iconFocused: 'trophy'    },
];

export default function TabLayout() {
  const isDark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  // Extra clearance above the device navigation bar
  const tabPaddingBottom = insets.bottom + 16;

  const activeTint   = '#6366f1';
  const inactiveTint = isDark ? '#4b5563' : '#94a3b8';
  const tabBarBg     = isDark ? '#0d1117' : '#ffffff';
  const borderColor  = isDark ? '#1e293b' : '#e2e8f0';

  return (
    <Tabs
      screenOptions={({ route }) => {
        const tab = TABS.find(t => t.name === route.name);
        return {
          headerShown: false,
          tabBarActiveTintColor: activeTint,
          tabBarInactiveTintColor: inactiveTint,
          tabBarStyle: {
            backgroundColor: tabBarBg,
            borderTopColor: borderColor,
            borderTopWidth: 1,
            paddingTop: 6,
            paddingBottom: tabPaddingBottom,
            height: 64 + tabPaddingBottom,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 2,
          },
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? (tab?.iconFocused ?? 'home') : (tab?.icon ?? 'home-outline')}
              size={size}
              color={color}
            />
          ),
        };
      }}
    >
      {TABS.map(tab => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{ title: tab.title }}
        />
      ))}
    </Tabs>
  );
}
