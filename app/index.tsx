import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Colors } from '../constants/Colors';
import { API_URL } from '../constants/Config';

export default function WelcomeScreen() {
    const theme = useColorScheme() ?? 'light';
    const colors = Colors[theme];
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleGetStarted = async () => {
        setIsLoading(true);
        try {
            // Try to connect to the health endpoint with a timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

            const response = await fetch(`${API_URL}/health`, { 
                method: 'GET',
                signal: controller.signal 
            });
            
            clearTimeout(timeoutId);

            if (response.ok) {
                router.push('/register');
            } else {
                router.push('/network-error');
            }
        } catch (error) {
            console.error("Network check failed:", error);
            router.push('/network-error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Animated.View
                entering={FadeInUp.delay(200).springify()}
                style={styles.contentContainer}
            >
                <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
                    <Image 
                        source={require('../img/logo.jpg')} 
                        style={{ width: 200, height: 100, alignSelf: 'center', marginBottom: 20 }} 
                        resizeMode="contain"
                    />
                    <Text style={[styles.title, { color: colors.text }]}>Welcome</Text>
                    <Text style={[styles.subtitle, { color: colors.subText }]}>To the Al Nab'a Event Registration</Text>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.primary, opacity: isLoading ? 0.7 : 1 }]}
                        onPress={handleGetStarted}
                        activeOpacity={0.8}
                        disabled={isLoading}
                    >
                        <Text style={styles.buttonText}>{isLoading ? "Connecting..." : "Proceed"}</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    card: {
        borderRadius: 20,
        padding: 25,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 30,
        textAlign: 'center',
        fontWeight: '500',
    },
    button: {
        height: 54,
        borderRadius: 14,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4.65,
        elevation: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
});
