import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { API_URL } from '../constants/Config';

export default function AdminDashboardScreen() {
    const theme = useColorScheme() ?? 'light';
    const colors = Colors[theme];
    const router = useRouter();
    const insets = useSafeAreaInsets();

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
    useEffect(() => {
        fetchStats();
    }, []);

    const renderItem = ({ item }: { item: any }) => (
        <View style={[styles.tableRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.tableCell, { color: colors.text, flex: 2 }]}>{item.company}</Text>
            <Text style={[styles.tableCell, { color: colors.text, flex: 1, textAlign: 'center' }]}>{item.registered}</Text>
            <Text style={[styles.tableCell, { color: colors.text, flex: 1, textAlign: 'center' }]}>{item.participants}</Text>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: insets.top + 10 }]}>
                <Text style={[styles.title, { fontSize: 24, marginBottom: 0, color: colors.text }]}>Dashboard</Text>
                <TouchableOpacity onPress={() => router.replace('/')}>
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
    title: {
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 10,
        textAlign: 'center',
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
