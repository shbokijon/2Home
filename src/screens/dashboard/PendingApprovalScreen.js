import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import { COLORS } from '../../constants/colors';

export const PendingApprovalScreen = () => {
  const verification = useSelector((state) => state.profile.verification);
  const personalInfo = useSelector((state) => state.profile.personalInfo);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <Text style={styles.icon}>⏳</Text>
          <Text style={styles.title}>Tekshiruvda</Text>
          <Text style={styles.subtitle}>
            Sizning profilingiz tekshirilmoqda
          </Text>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>Hozirgi Holat</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>Pending</Text>
            </View>
          </View>

          <View style={styles.timelineContainer}>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, styles.timelineDotComplete]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>✓ Ma'lumotlar yuborildi</Text>
                <Text style={styles.timelineTime}>Bugun, 14:30</Text>
              </View>
            </View>

            <View style={styles.timelineLine} />

            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, styles.timelineDotActive]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>⏳ ID tekshirilmoqda</Text>
                <Text style={styles.timelineTime}>24-48 soat davom etadi</Text>
              </View>
            </View>

            <View style={styles.timelineLine} />

            <View style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Background check</Text>
                <Text style={styles.timelineTime}>Kutilmoqda</Text>
              </View>
            </View>

            <View style={styles.timelineLine} />

            <View style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Profil tasdiqlanishi</Text>
                <Text style={styles.timelineTime}>Kutilmoqda</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>💡 Keyingi Qadamlar</Text>
          <View style={styles.infoList}>
            <Text style={styles.infoItem}>
              • Email manzilingizni tekshiring (spam folder ham)
            </Text>
            <Text style={styles.infoItem}>
              • SMS xabarlarni kuzatib boring
            </Text>
            <Text style={styles.infoItem}>
              • 24-48 soat ichida natija keladi
            </Text>
            <Text style={styles.infoItem}>
              • Qo'shimcha hujjat kerak bo'lsa, siz bilan bog'lanamiz
            </Text>
          </View>
        </View>

        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>📞 Yordam Kerakmi?</Text>
          <Text style={styles.contactText}>
            Savollaringiz bo'lsa, biz bilan bog'laning:
          </Text>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>
              📧 support@2home.uz
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>
              📱 +998 71 200 00 00
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>
              💬 Telegram: @2home_support
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileCard}>
          <Text style={styles.profileTitle}>Sizning Ma'lumotlaringiz</Text>
          <View style={styles.profileInfo}>
            <Text style={styles.profileLabel}>Ism:</Text>
            <Text style={styles.profileValue}>{personalInfo.fullName}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileLabel}>Telefon:</Text>
            <Text style={styles.profileValue}>{personalInfo.phoneNumber}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileLabel}>Email:</Text>
            <Text style={styles.profileValue}>{personalInfo.email || 'Yo\'q'}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  statusCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: COLORS.warning + '20',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.warning,
  },
  timelineContainer: {
    paddingLeft: 12,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.gray[300],
    backgroundColor: COLORS.white,
    marginRight: 16,
    marginTop: 4,
  },
  timelineDotComplete: {
    borderColor: COLORS.success,
    backgroundColor: COLORS.success,
  },
  timelineDotActive: {
    borderColor: COLORS.warning,
    backgroundColor: COLORS.warning,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 8,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  timelineTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  timelineLine: {
    width: 2,
    height: 24,
    backgroundColor: COLORS.gray[200],
    marginLeft: 7,
  },
  infoCard: {
    backgroundColor: COLORS.accentBlue + '10',
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accentBlue,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  infoList: {
    gap: 8,
  },
  infoItem: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  contactCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  contactButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.gray[50],
    marginBottom: 8,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  profileCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  profileInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  profileLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  profileValue: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
});

export default PendingApprovalScreen;
