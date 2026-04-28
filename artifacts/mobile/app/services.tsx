import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useColors } from "@/hooks/useColors";

const SERVICES_GRID = [
  {
    id: "home",
    title: "تنظيف المنزل",
    desc: "تنظيف شامل لجميع أرجاء المنزل",
    image: require("@/assets/images/illustration-sofa.png"),
    color: "#EFF6FF",
    btnColor: "#3B82F6",
  },
  {
    id: "office",
    title: "تنظيف المكاتب",
    desc: "بيئة عمل نظيفة ومنظمة لإنتاجية أعلى",
    image: require("@/assets/images/illustration-office.png"),
    color: "#ECFDF5",
    btnColor: "#10B981",
  },
  {
    id: "deep",
    title: "تنظيف عميق",
    desc: "تنظيف عميق لإزالة الأوساخ المتراكمة",
    image: require("@/assets/images/illustration-vacuum.png"),
    color: "#EFF6FF",
    btnColor: "#3B82F6",
  },
  {
    id: "sofa",
    title: "تنظيف الكنب",
    desc: "إزالة البقع و الروائح لكنب نظيف ومعطر",
    image: require("@/assets/images/illustration-armchair.png"),
    color: "#FFF7ED",
    btnColor: "#F59E0B",
  },
];

export default function ServicesScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: "#F8FAFC" }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.iconCircle} onPress={() => router.back()}>
          <Feather name="chevron-right" size={18} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>اختر الخدمة</Text>
          <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>
            اختر الخدمة التي تناسب احتياجك
          </Text>
        </View>
        <TouchableOpacity style={[styles.iconCircle, { backgroundColor: "#EFF6FF" }]}>
          <Feather name="headphones" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["#DBEAFE", "#EFF6FF"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.introCard}
        >
          <Image
            source={require("@/assets/images/illustration-bucket.png")}
            style={styles.introImage}
            resizeMode="contain"
          />
          <View style={styles.introTextContainer}>
            <Text style={[styles.introTitle, { color: colors.primaryDark }]}>خدمة احترافية</Text>
            <Text style={[styles.introDesc, { color: colors.foreground }]}>
              فريق مدرب بأعلى معايير الجودة لمنزل و مكان أنظف ✨
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>✨ خدمات التنظيف</Text>
        </View>

        <View style={styles.grid}>
          {SERVICES_GRID.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.gridCard}
              onPress={() => router.push("/booking")}
              activeOpacity={0.9}
            >
              <View style={[styles.arcContainer, { backgroundColor: service.color }]}>
                <Image source={service.image} style={styles.cardImage} resizeMode="contain" />
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: colors.foreground }]}>{service.title}</Text>
                <Text style={[styles.cardDesc, { color: colors.mutedForeground }]} numberOfLines={2}>
                  {service.desc}
                </Text>
                <View style={[styles.cardBtn, { backgroundColor: service.btnColor }]}>
                  <Feather name="arrow-left" size={14} color="#FFFFFF" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Feather name="shield" size={16} color={colors.primary} />
            <Text style={[styles.infoTitle, { color: colors.foreground }]}>ضمان الجودة</Text>
            <Text style={[styles.infoDesc, { color: colors.mutedForeground }]}>نضمن رضاك التام</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoItem}>
            <Feather name="clock" size={16} color={colors.primary} />
            <Text style={[styles.infoTitle, { color: colors.foreground }]}>في الوقت المحدد</Text>
            <Text style={[styles.infoDesc, { color: colors.mutedForeground }]}>نصل في الموعد المتفق</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoItem}>
            <Feather name="users" size={16} color={colors.primary} />
            <Text style={[styles.infoTitle, { color: colors.foreground }]}>فريق محترف</Text>
            <Text style={[styles.infoDesc, { color: colors.mutedForeground }]}>مدرب و موثوق</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 14 }]}>
        <LinearGradient
          colors={["#60A5FA", "#3B82F6", "#2563EB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.helpBtn}
        >
          <TouchableOpacity style={styles.helpBtnInner} activeOpacity={0.9}>
            <Text style={styles.sparkle}>✨</Text>
            <Text style={styles.helpBtnText}>ساعدني</Text>
          </TouchableOpacity>
        </LinearGradient>
        <View style={styles.helpTextContainer}>
          <Text style={[styles.helpTextTitle, { color: colors.foreground }]}>غير متأكد؟</Text>
          <Text style={[styles.helpTextSub, { color: colors.mutedForeground }]}>
            ساعدنا في اختيار الخدمة المناسبة لك
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  headerCenter: { alignItems: "center" },
  headerTitle: {
    fontFamily: "Cairo_700Bold",
    fontSize: 15,
  },
  headerSubtitle: {
    fontFamily: "Cairo_400Regular",
    fontSize: 11,
    marginTop: 2,
  },
  introCard: {
    marginHorizontal: 20,
    borderRadius: 22,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
    overflow: "hidden",
  },
  introImage: {
    width: 80,
    height: 80,
  },
  introTextContainer: {
    flex: 1,
    alignItems: "flex-end",
    paddingHorizontal: 12,
  },
  introTitle: {
    fontFamily: "Cairo_700Bold",
    fontSize: 14,
    marginBottom: 4,
  },
  introDesc: {
    fontFamily: "Cairo_400Regular",
    fontSize: 11,
    textAlign: "right",
    lineHeight: 17,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
    alignItems: "flex-end",
  },
  sectionTitle: {
    fontFamily: "Cairo_700Bold",
    fontSize: 14,
  },
  grid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    paddingHorizontal: 14,
    gap: 12,
    marginBottom: 22,
  },
  gridCard: {
    width: "47%",
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  arcContainer: {
    height: 110,
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  cardImage: {
    width: 78,
    height: 78,
  },
  cardContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    alignItems: "flex-end",
  },
  cardTitle: {
    fontFamily: "Cairo_700Bold",
    fontSize: 13,
    marginBottom: 4,
    textAlign: "right",
  },
  cardDesc: {
    fontFamily: "Cairo_400Regular",
    fontSize: 10,
    textAlign: "right",
    marginBottom: 12,
    lineHeight: 15,
    minHeight: 30,
  },
  cardBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  infoRow: {
    flexDirection: "row-reverse",
    marginHorizontal: 20,
    marginBottom: 22,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  infoItem: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 4,
  },
  infoTitle: {
    fontFamily: "Cairo_600SemiBold",
    fontSize: 11,
    marginTop: 6,
    marginBottom: 2,
    textAlign: "center",
  },
  infoDesc: {
    fontFamily: "Cairo_400Regular",
    fontSize: 9,
    textAlign: "center",
  },
  divider: {
    width: 1,
    height: 38,
    backgroundColor: "#EEF1F6",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 14,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  helpBtn: {
    borderRadius: 100,
    overflow: "hidden",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  helpBtnInner: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 22,
    gap: 6,
  },
  sparkle: { fontSize: 14 },
  helpBtnText: {
    fontFamily: "Cairo_700Bold",
    fontSize: 13,
    color: "#FFFFFF",
  },
  helpTextContainer: {
    flex: 1,
    alignItems: "flex-end",
    paddingHorizontal: 12,
  },
  helpTextTitle: {
    fontFamily: "Cairo_700Bold",
    fontSize: 13,
    marginBottom: 2,
  },
  helpTextSub: {
    fontFamily: "Cairo_400Regular",
    fontSize: 10,
    textAlign: "right",
  },
});
