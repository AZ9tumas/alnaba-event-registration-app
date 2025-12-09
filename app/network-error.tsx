import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Colors } from '../constants/Colors';

export default function NetworkErrorScreen() {
    const theme = useColorScheme() ?? 'light';
    const colors = Colors[theme];
    const router = useRouter();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Animated.View
                entering={FadeInUp.delay(200).springify()}
                style={styles.contentContainer}
            >
                <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow, alignItems: 'center' }]}>
                    <Ionicons name="cloud-offline" size={80} color="red" style={{ marginBottom: 20 }} />
                    <Text style={[styles.title, { color: colors.text }]}>Network Error</Text>
                    <Text style={[styles.subtitle, { color: colors.subText }]}>
                        Unable to connect to the server. Please check your connection and try again later.
                    </Text>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.primary, width: '100%' }]}
                        onPress={() => router.replace('/')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Try Again</Text>
                        <Ionicons name="refresh" size={20} color="#FFF" style={{ marginLeft: 8 }} />
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
