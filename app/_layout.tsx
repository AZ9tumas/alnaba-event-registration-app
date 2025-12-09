import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// themes
const Colors = {
    light: {
        background: '#F2F2F7',
    },
    dark: {
        background: '#000000',
    }
};

export default function RootLayout() {
    const theme = useColorScheme() ?? 'light';
    const colors = Colors[theme];

    return (
        <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="register" />
                <Stack.Screen name="thankyou" />
                <Stack.Screen name="network-error" />
                <Stack.Screen name="admin-dashboard" />
            </Stack>
            <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        </SafeAreaProvider>
    );
}
