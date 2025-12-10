import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
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
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { API_URL } from '../constants/Config';

const DismissKeyboard = ({ children }: { children: any }) => {
    if (Platform.OS === 'web') return <>{children}</>;
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {children}
        </TouchableWithoutFeedback>
    );
};

export default function RegisterScreen() {
    const theme = useColorScheme() ?? 'light';
    const colors = Colors[theme];
    const router = useRouter();
    const insets = useSafeAreaInsets();

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

    // Loading state for ID check
    const [isCheckingId, setIsCheckingId] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

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

        setIsCheckingId(true);
        setEmpIdError('');

        try {
            const response = await fetch(`${API_URL}/check-employee?empId=${empId}`);
            const data = await response.json();

            if (data.alreadyRegistered) {
                router.push({ 
                    pathname: '/thankyou', 
                    params: { 
                        rnd: data.rnd, 
                        isAlreadyRegistered: 'true',
                        empName: data.empName,
                        companyName: data.companyName,
                        phoneNumber: data.phoneNumber,
                        participants: data.participants,
                        empId: empId
                    } 
                });
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
        } finally {
            setIsCheckingId(false);
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

        // Prevent double submission or submission while checking
        if (isCheckingId || isRegistering) return;

        setIsRegistering(true);

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
                router.push({ 
                    pathname: '/thankyou', 
                    params: { 
                        rnd: data.rnd, 
                        isAlreadyRegistered: 'true',
                        empName: empName,
                        companyName: companyName,
                        phoneNumber: phoneNumber,
                        participants: participants,
                        empId: empId
                    } 
                });
                return;
            }

            if (response.ok) {
                router.push({ 
                    pathname: '/thankyou', 
                    params: { 
                        rnd: data.rnd, 
                        isAlreadyRegistered: 'false',
                        empName: empName,
                        companyName: companyName,
                        phoneNumber: phoneNumber,
                        participants: participants,
                        empId: empId
                    } 
                });
            } else {
                Alert.alert('Error', data.error || 'Registration failed');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to connect to server');
        } finally {
            setIsRegistering(false);
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
                router.push('/admin-dashboard');
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
            <DismissKeyboard>
                <View style={{ flex: 1 }}>
                    {/* Header with Back Button */}
                    <Animated.View entering={FadeInDown.duration(400)} style={[styles.header, { paddingTop: insets.top + 10 }]}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Text style={[styles.backText, { color: colors.primary, fontSize: 18, fontWeight: '600' }]}>Back</Text>
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
                                {isCheckingId && (
                                    <ActivityIndicator 
                                        size="small" 
                                        color={colors.primary} 
                                        style={{ position: 'absolute', right: 15, top: 45 }} 
                                    />
                                )}
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
                                        <View style={[styles.inputGroup, { flex: 65, marginRight: 10 }]}>
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

                                        <View style={[styles.inputGroup, { flex: 35 }]}>
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
                                        style={[styles.button, { backgroundColor: colors.primary, marginTop: 10, opacity: (isCheckingId || isRegistering) ? 0.7 : 1 }]}
                                        onPress={handleRegister}
                                        activeOpacity={0.8}
                                        disabled={isCheckingId || isRegistering}
                                    >
                                        {isRegistering ? (
                                            <ActivityIndicator color="#fff" />
                                        ) : (
                                            <Text style={styles.buttonText}>Register</Text>
                                        )}
                                    </TouchableOpacity>

                                    <View style={{ marginVertical: 20, alignItems: 'center' }}>
                                        <Text style={{ color: colors.subText, fontSize: 16, marginBottom: 5 }}>Call 99885343 for support.</Text>
                                    </View>
                                </>
                            )}
                        </Animated.View>
                    </View>
                </View>
            </DismissKeyboard>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
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
});
