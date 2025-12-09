import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Colors } from '../constants/Colors';

export default function ThankYouScreen() {
    const theme = useColorScheme() ?? 'light';
    const colors = Colors[theme];
    const router = useRouter();
    const params = useLocalSearchParams();
    
    const rnd = params.rnd as string;
    const isAlreadyRegistered = params.isAlreadyRegistered === 'true';
    const empName = params.empName as string;
    const companyName = params.companyName as string;
    const phoneNumber = params.phoneNumber as string;
    const participants = params.participants as string;
    const empId = params.empId as string;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Animated.View
                entering={FadeInUp.delay(200).springify()}
                style={styles.contentContainer}
            >
                <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow, alignItems: 'center' }]}>
                    <Ionicons 
                        name={isAlreadyRegistered ? "information-circle" : "checkmark-circle"} 
                        size={100} 
                        color={isAlreadyRegistered ? colors.primary : colors.success} 
                        style={{ marginBottom: 20 }} 
                    />
                    <Text style={[styles.title, { color: colors.text }]}>
                        {isAlreadyRegistered ? "Already Registered" : "Thank You!"}
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.subText }]}>
                        {isAlreadyRegistered ? "You have already registered for this event." : "Registration Successful"}
                    </Text>
                    
                    <View style={{ marginVertical: 20, alignItems: 'center' }}>
                        <Text style={{ color: colors.subText, fontSize: 16, marginBottom: 5 }}>Your Registration Number</Text>
                        <Text style={{ color: colors.primary, fontSize: 36, fontWeight: 'bold', letterSpacing: 2 }}>{rnd}</Text>
                        <Text style={{ color: 'red', fontSize: 14, marginTop: 10, fontWeight: '600' }}>Take a screenshot for reference.</Text>
                    </View>

                    {/* Registration Details */}
                    <View style={{ width: '100%', marginBottom: 20, padding: 15, backgroundColor: colors.inputBg, borderRadius: 10 }}>
                        <Text style={{ color: colors.text, fontWeight: 'bold', marginBottom: 10, fontSize: 16 }}>Registration Details:</Text>
                        
                        <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: colors.subText }]}>Emp ID:</Text>
                            <Text style={[styles.detailValue, { color: colors.text }]}>{empId}</Text>
                        </View>
                        
                        <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: colors.subText }]}>Name:</Text>
                            <Text style={[styles.detailValue, { color: colors.text }]}>{empName}</Text>
                        </View>
                        
                        <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: colors.subText }]}>Company:</Text>
                            <Text style={[styles.detailValue, { color: colors.text }]}>{companyName}</Text>
                        </View>
                        
                        <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: colors.subText }]}>Phone:</Text>
                            <Text style={[styles.detailValue, { color: colors.text }]}>{phoneNumber}</Text>
                        </View>
                        
                        <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: colors.subText }]}>Participants:</Text>
                            <Text style={[styles.detailValue, { color: colors.text }]}>{participants}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.primary, width: '100%' }]}
                        onPress={() => router.navigate('/')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Done</Text>
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
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'right',
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
