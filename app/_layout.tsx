import Ionicons from '@expo/vector-icons/Ionicons';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

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

    const [loaded, error] = useFonts({
        ...Ionicons.font,
    });

    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

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
