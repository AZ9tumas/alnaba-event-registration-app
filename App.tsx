import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    useColorScheme
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// themes
const Colors = {
    light: {
        background: '#F2F2F7',
        card: '#FFFFFF',
        text: '#000000',
        subText: '#6C6C70',
        primary: '#016461',
        border: '#C6C6C8',
        inputBg: '#E5E5EA',
        disabledInputBg: '#D1D1D6',
        placeholder: '#8E8E93',
        shadow: '#000',
        success: '#34C759',
        danger: '#FF3B30',
    },
    dark: {
        background: '#000000',
        card: '#1C1C1E',
        text: '#FFFFFF',
        subText: '#EBEBF5',
        primary: '#016461',
        border: '#38383A',
        inputBg: '#2C2C2E',
        disabledInputBg: '#3A3A3C',
        placeholder: '#98989D',
        shadow: '#FFF',
        success: '#30D158',
        danger: '#FF453A',
    }
};

const API_URL = 'http://172.16.18.28:8000';

// Admin Dashboard Screen
const AdminDashboardScreen = ({ onLogout }: { onLogout: () => void }) => {
    const theme = useColorScheme() ?? 'light';
    const colors = Colors[theme];

    const [stats, setStats] = useState<any[]>([]);
    const [totalParticipants, setTotalParticipants] = useState(0);
    const [totalRegistered, setTotalRegistered] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchStats = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_URL}/admin-stats`);
            const data = await response.json();

            if (response.ok) {
                setStats(data.stats);
                setTotalParticipants(data.totalParticipants);
                setTotalRegistered(data.totalRegistered);
            } else {
                setError(data.error || 'Failed to fetch stats');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch on mount
    useState(() => {
        fetchStats();
    });

    const renderItem = ({ item }: { item: any }) => (
        <View style={[styles.tableRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.tableCell, { color: colors.text, flex: 2 }]}>{item.company}</Text>
            <Text style={[styles.tableCell, { color: colors.text, flex: 1, textAlign: 'center' }]}>{item.registered}</Text>
            <Text style={[styles.tableCell, { color: colors.text, flex: 1, textAlign: 'center' }]}>{item.participants}</Text>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                <Text style={[styles.title, { fontSize: 24, marginBottom: 0, color: colors.text }]}>Dashboard</Text>
                <TouchableOpacity onPress={onLogout}>
                    <Ionicons name="log-out-outline" size={28} color={colors.danger} />
                </TouchableOpacity>
            </View>

            <View style={{ padding: 20, flex: 1 }}>
                {/* Summary Cards */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                    <View style={[styles.statCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
                        <Text style={[styles.statLabel, { color: colors.subText }]}>Total Registered</Text>
                        <Text style={[styles.statValue, { color: colors.primary }]}>{totalRegistered}</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
                        <Text style={[styles.statLabel, { color: colors.subText }]}>Total Participants</Text>
                        <Text style={[styles.statValue, { color: colors.success }]}>{totalParticipants}</Text>
                    </View>
                </View>

                {/* Table Header */}
                <View style={[styles.tableHeader, { backgroundColor: colors.inputBg }]}>
                    <Text style={[styles.tableHeaderText, { color: colors.text, flex: 2 }]}>Company</Text>
                    <Text style={[styles.tableHeaderText, { color: colors.text, flex: 1, textAlign: 'center' }]}>Reg</Text>
                    <Text style={[styles.tableHeaderText, { color: colors.text, flex: 1, textAlign: 'center' }]}>Participants</Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
                ) : error ? (
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
                        <TouchableOpacity onPress={fetchStats} style={[styles.button, { backgroundColor: colors.primary, height: 40, paddingHorizontal: 20 }]}>
                            <Text style={styles.buttonText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={stats}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </View>
    );
};

// Network Error Screen
const NetworkErrorScreen = ({ onRetry }: { onRetry: () => void }) => {
    const theme = useColorScheme() ?? 'light';
    const colors = Colors[theme];

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
                        onPress={onRetry}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Try Again</Text>
                        <Ionicons name="refresh" size={20} color="#FFF" style={{ marginLeft: 8 }} />
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
};

// welcome screen
const WelcomeScreen = ({ onProceed, onError }: { onProceed: () => void, onError: () => void }) => {
    const theme = useColorScheme() ?? 'light';
    const colors = Colors[theme];
    const [isLoading, setIsLoading] = useState(false);

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
                onProceed();
            } else {
                onError();
            }
        } catch (error) {
            console.error("Network check failed:", error);
            onError();
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
                        source={require('./img/logo.jpg')} 
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
                        {!isLoading && <Ionicons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 8 }} />}
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
};

// Thank You Screen
const ThankYouScreen = ({ rnd, isAlreadyRegistered, onDone }: { rnd: string, isAlreadyRegistered: boolean, onDone: () => void }) => {
    const theme = useColorScheme() ?? 'light';
    const colors = Colors[theme];

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

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.primary, width: '100%' }]}
                        onPress={onDone}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Done</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
};

// register
const RegisterScreen = ({ onBack, onSuccess, onAdminLogin }: { onBack: () => void, onSuccess: (rnd: string, isAlreadyRegistered: boolean) => void, onAdminLogin: () => void }) => {
    const theme = useColorScheme() ?? 'light';
    const colors = Colors[theme];

    const [empId, setEmpId] = useState('');
    const [empIdError, setEmpIdError] = useState('');
    const [empName, setEmpName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [participants, setParticipants] = useState('');
    
    // Admin Mode State
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleEmpIdBlur = async () => {
        if (!empId) {
            setEmpIdError('');
            return;
        }

        // Check for admin mode
        if (empId.toLowerCase() === 'admin') {
            setIsAdminMode(true);
            setEmpIdError('');
            return;
        } else {
            setIsAdminMode(false);
        }

        try {
            const response = await fetch(`${API_URL}/check-employee?empId=${empId}`);
            const data = await response.json();

            if (data.alreadyRegistered) {
                onSuccess(data.rnd, true);
                return;
            }

            if (response.ok) {
                setEmpName(data.empName);
                setCompanyName(data.companyName);
                setEmpIdError('');
            } else {
                setEmpIdError(data.error || 'Error checking Employee ID');
                setEmpName('');
                setCompanyName('');
            }
        } catch (error) {
            console.error(error);
            setEmpIdError('Failed to connect to server');
        }
    };

    const handleRegister = async () => {
        if (empIdError) {
            setEmpIdError(empIdError);
            return;
        }

        if (!empId || !phoneNumber || !participants) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    empId,
                    phoneNumber,
                    participants
                }),
            });

            const data = await response.json();

            if (data.alreadyRegistered) {
                onSuccess(data.rnd, true);
                return;
            }

            if (response.ok) {
                onSuccess(data.rnd, false);
            } else {
                Alert.alert('Error', data.error || 'Registration failed');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to connect to server');
        }
    };

    const handleAdminLogin = async () => {
        if (!password) {
            setLoginError('Password is required');
            return;
        }
        
        setIsLoggingIn(true);
        setLoginError('');

        try {
            const response = await fetch(`${API_URL}/admin-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (response.ok) {
                onAdminLogin();
            } else {
                setLoginError(data.error || 'Invalid password');
            }
        } catch (error) {
            setLoginError('Network error. Please try again.');
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
                    {/* Header with Back Button */}
                    <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
                        <TouchableOpacity onPress={onBack} style={styles.backButton}>
                            <Ionicons name="chevron-back" size={28} color={colors.primary} />
                            <Text style={[styles.backText, { color: colors.primary }]}>Back</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <View style={styles.contentContainer}>
                        <Animated.View
                            entering={FadeInDown.delay(200).springify()}
                            style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}
                        >
                            <Text style={[styles.title, { color: colors.text, marginBottom: 25 }]}>
                                {isAdminMode ? 'Admin Login' : 'Register'}
                            </Text>

                            {/* EmpID - Prominent */}
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.text }]}>
                                    {isAdminMode ? 'Username' : 'Employee ID'}
                                </Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: empIdError ? 'red' : colors.border, fontWeight: 'bold' }]}
                                    placeholder={isAdminMode ? "Username" : "Enter Employee ID"}
                                    placeholderTextColor={colors.placeholder}
                                    value={empId}
                                    onChangeText={(text) => {
                                        setEmpId(text.toUpperCase());
                                        if (empIdError) setEmpIdError('');
                                        // Reset admin mode if user clears "admin"
                                        if (isAdminMode && text.toLowerCase() !== 'admin') {
                                            setIsAdminMode(false);
                                        }
                                    }}
                                    onBlur={handleEmpIdBlur}
                                    autoCapitalize="characters"
                                />
                                {empIdError ? (
                                    <Text style={{ color: 'red', marginTop: 5, fontSize: 12 }}>{empIdError}</Text>
                                ) : null}
                            </View>

                            {isAdminMode ? (
                                // Admin Password Field
                                <View style={styles.inputGroup}>
                                    <Text style={[styles.label, { color: colors.text }]}>Password</Text>
                                    <TextInput
                                        style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: loginError ? 'red' : colors.border }]}
                                        placeholder="Enter Password"
                                        placeholderTextColor={colors.placeholder}
                                        value={password}
                                        onChangeText={(text) => {
                                            setPassword(text);
                                            setLoginError('');
                                        }}
                                        secureTextEntry
                                    />
                                    {loginError ? (
                                        <Text style={{ color: 'red', marginTop: 5, fontSize: 12 }}>{loginError}</Text>
                                    ) : null}
                                    
                                    <TouchableOpacity
                                        style={[styles.button, { backgroundColor: colors.primary, marginTop: 20, opacity: isLoggingIn ? 0.7 : 1 }]}
                                        onPress={handleAdminLogin}
                                        activeOpacity={0.8}
                                        disabled={isLoggingIn}
                                    >
                                        {isLoggingIn ? (
                                            <ActivityIndicator color="#fff" />
                                        ) : (
                                            <Text style={styles.buttonText}>Login</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                // Regular Registration Fields
                                <>
                                    {/* Name and Company - Large Fields */}
                                    <View style={styles.inputGroup}>
                                        <Text style={[styles.label, { color: colors.text }]}>Employee Name</Text>
                                        <TextInput
                                            style={[styles.input, { backgroundColor: colors.disabledInputBg, color: colors.subText, borderColor: colors.border }]}
                                            placeholder="Name"
                                            placeholderTextColor={colors.placeholder}
                                            value={empName}
                                            editable={false}
                                        />
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Text style={[styles.label, { color: colors.text }]}>Company</Text>
                                        <TextInput
                                            style={[styles.input, { backgroundColor: colors.disabledInputBg, color: colors.subText, borderColor: colors.border }]}
                                            placeholder="Company"
                                            placeholderTextColor={colors.placeholder}
                                            value={companyName}
                                            editable={false}
                                        />
                                    </View>

                                    {/* Phone and Participants - Row */}
                                    <View style={styles.row}>
                                        <View style={[styles.inputGroup, { flex: 70, marginRight: 10 }]}>
                                            <Text style={[styles.label, { color: colors.text }]}>Phone Number</Text>
                                            <TextInput
                                                style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
                                                placeholder="Phone"
                                                placeholderTextColor={colors.placeholder}
                                                value={phoneNumber}
                                                onChangeText={(text) => setPhoneNumber(text.replace(/[^0-9]/g, ''))}
                                                keyboardType="numeric"
                                            />
                                        </View>

                                        <View style={[styles.inputGroup, { flex: 30 }]}>
                                            <Text style={[styles.label, { color: colors.text }]}>Participant</Text>
                                            <TextInput
                                                style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border, textAlign: 'center' }]}
                                                placeholder="#"
                                                placeholderTextColor={colors.placeholder}
                                                value={participants}
                                                onChangeText={(text) => setParticipants(text.replace(/[^0-9]/g, ''))}
                                                keyboardType="numeric"
                                                maxLength={3}
                                            />
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        style={[styles.button, { backgroundColor: colors.primary, marginTop: 10 }]}
                                        onPress={handleRegister}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.buttonText}>Register</Text>
                                    </TouchableOpacity>

                                    <View style={{ marginVertical: 20, alignItems: 'center' }}>
                                        <Text style={{ color: colors.subText, fontSize: 16, marginBottom: 5 }}>Call 99885343 for support.</Text>
                                    </View>
                                </>
                            )}
                        </Animated.View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default function App() {
    const [currentScreen, setCurrentScreen] = useState<'welcome' | 'register' | 'thankyou' | 'networkError' | 'adminDashboard'>('welcome');
    const [rndNumber, setRndNumber] = useState('');
    const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
    const theme = useColorScheme() ?? 'light';

    const handleRegistrationSuccess = (rnd: string, alreadyRegistered: boolean) => {
        setRndNumber(rnd);
        setIsAlreadyRegistered(alreadyRegistered);
        setCurrentScreen('thankyou');
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={[styles.safeArea, { backgroundColor: Colors[theme].background }]}>
                {currentScreen === 'welcome' ? (
                    <WelcomeScreen 
                        onProceed={() => setCurrentScreen('register')} 
                        onError={() => setCurrentScreen('networkError')}
                    />
                ) : currentScreen === 'register' ? (
                    <RegisterScreen 
                        onBack={() => setCurrentScreen('welcome')} 
                        onSuccess={handleRegistrationSuccess}
                        onAdminLogin={() => setCurrentScreen('adminDashboard')}
                    />
                ) : currentScreen === 'networkError' ? (
                    <NetworkErrorScreen onRetry={() => setCurrentScreen('welcome')} />
                ) : currentScreen === 'adminDashboard' ? (
                    <AdminDashboardScreen onLogout={() => setCurrentScreen('welcome')} />
                ) : (
                    <ThankYouScreen 
                        rnd={rndNumber} 
                        isAlreadyRegistered={isAlreadyRegistered}
                        onDone={() => setCurrentScreen('welcome')} 
                    />
                )}
                <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
        zIndex: 10,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        fontSize: 17,
        marginLeft: 5,
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
    inputGroup: {
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '600',
        marginLeft: 4,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 16,
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
    // Admin Dashboard Styles
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
        alignItems: 'center',
    },
    tableCell: {
        fontSize: 14,
    },
    statCard: {
        flex: 1,
        padding: 15,
        borderRadius: 12,
        marginHorizontal: 5,
        alignItems: 'center',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statLabel: {
        fontSize: 12,
        marginBottom: 5,
        fontWeight: '600',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    tableHeader: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 8,
        marginBottom: 5,
    },
    tableHeaderText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
});
