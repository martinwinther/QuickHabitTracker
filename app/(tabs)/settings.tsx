import React from 'react';
import {
    Alert,
    Linking,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useHabitStorage } from '../../hooks/useHabitStorage';
import { useHaptics } from '../../hooks/useHaptics';

export default function SettingsScreen() {
  const { resetHabit } = useHabitStorage();
  const { success, error } = useHaptics();

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete your habit and all progress. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetHabit();
            error();
            Alert.alert('Data Reset', 'All data has been cleared.');
          },
        },
      ]
    );
  };

  const handleContactSupport = () => {
    const email = 'support@quickhabittracker.com';
    const subject = 'Quick Habit Tracker Support';
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Email Not Available', 'Please contact us at support@quickhabittracker.com');
      }
    });
  };

  const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  const SettingsItem = ({ 
    title, 
    subtitle, 
    onPress, 
    destructive = false 
  }: { 
    title: string; 
    subtitle?: string; 
    onPress: () => void; 
    destructive?: boolean; 
  }) => (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
      <View style={styles.settingsItemContent}>
        <Text style={[styles.settingsItemTitle, destructive && styles.destructiveText]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.settingsItemSubtitle}>{subtitle}</Text>
        )}
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* App Info */}
        <SettingsSection title="About">
          <View style={styles.appInfoContainer}>
            <Text style={styles.appIcon}></Text>
            <View style={styles.appInfoText}>
              <Text style={styles.appName}>Quick Habit Tracker</Text>
              <Text style={styles.appVersion}>Version 1.0.0</Text>
              <Text style={styles.appDescription}>
                A simple, beautiful habit tracker focused on building one habit at a time.
              </Text>
            </View>
          </View>
        </SettingsSection>

        {/* Features */}
        <SettingsSection title="Features">
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}></Text>
              <Text style={styles.featureText}>Focus on one habit at a time</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}></Text>
              <Text style={styles.featureText}>All data stored locally on your device</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}></Text>
              <Text style={styles.featureText}>Track streaks and completion rates</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}></Text>
              <Text style={styles.featureText}>Beautiful, minimalist design</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}></Text>
              <Text style={styles.featureText}>No ads, no analytics, no tracking</Text>
            </View>
          </View>
        </SettingsSection>

        {/* Support */}
        <SettingsSection title="Support">
          <SettingsItem
            title="Contact Support"
            subtitle="Get help or share feedback"
            onPress={handleContactSupport}
          />
        </SettingsSection>

        {/* Privacy */}
        <SettingsSection title="Privacy">
          <View style={styles.privacyContainer}>
            <Text style={styles.privacyTitle}>Your Privacy Matters</Text>
            <Text style={styles.privacyText}>
              Quick Habit Tracker is designed with privacy in mind. All your data stays on your device. 
              We don't collect, store, or share any personal information. No accounts, no cloud sync, 
              no tracking—just you and your habits.
            </Text>
          </View>
        </SettingsSection>

        {/* Data Management */}
        <SettingsSection title="Data">
          <SettingsItem
            title="Reset All Data"
            subtitle="Permanently delete all habits and progress"
            onPress={handleResetData}
            destructive={true}
          />
        </SettingsSection>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with love for building better habits
          </Text>
          <Text style={styles.footerSubtext}>
            © 2025 Quick Habit Tracker
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#1C1C1E',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'System',
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'System',
  },
  sectionContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(142, 142, 147, 0.2)',
  },
  settingsItemContent: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 17,
    fontWeight: '400',
    color: '#1C1C1E',
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },
  settingsItemSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },
  destructiveText: {
    color: '#FF3B30',
  },
  chevron: {
    fontSize: 20,
    color: '#C7C7CC',
    fontWeight: '400',
  },
  appInfoContainer: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  appIcon: {
    fontSize: 48,
    marginRight: 16,
  },
  appInfoText: {
    flex: 1,
  },
  appName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'System',
  },
  appVersion: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },
  appDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },
  featureList: {
    padding: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 28,
  },
  featureText: {
    fontSize: 15,
    color: '#1C1C1E',
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },
  privacyContainer: {
    padding: 20,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },
  privacyText: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#C7C7CC',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },
}); 