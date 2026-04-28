import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import AppMap from "@/components/AppMap";
import { useColors } from "@/hooks/useColors";

const SERVICES = [
  { id: "1", title: "تنظيف السجاد", icon: "rug", color: "#FCE7F3", iconColor: "#EC4899" },
  { id: "2", title: "تنظيف بعد البناء", icon: "broom", color: "#FEF3C7", iconColor: "#F59E0B" },
  { id: "3", title: "تنظيف المجالس", icon: "sofa", color: "#EDE9FE", iconColor: "#8B5CF6" },
  { id: "4", title: "تنظيف المكاتب", icon: "office-building", color: "#D1FAE5", iconColor: "#10B981" },
  { id: "5", title: "تنظيف المنازل", icon: "home-variant", color: "#DBEAFE", iconColor: "#3B82F6" },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();

  const handleBookPress = () => {
    router.push("/services");
  };

  return (
    <View style={[styles.container, { backgroundColor: "#F8FAFC" }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity style={[styles.iconCircle, { backgroundColor: "#FFFFFF" }]}>
            <Feather name="bell" size={18} color={colors.foreground} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.greeting, { color: colors.foreground }]}>👋 مرحبا بك</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>أين نرسل فريق التنظيف؟</Text>
          </View>
          <TouchableOpacity style={[styles.iconCircle, { backgroundColor: "#FFFFFF" }]}>
            <Feather name="menu" size={18} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        <View style={styles.mapWrap}>
          <View style={styles.mapContainer}>
            <AppMap
              style={StyleSheet.absoluteFill}
              region={{
                latitude: 24.7136,
                longitude: 46.6753,
                latitudeDelta: 0.018,
                longitudeDelta: 0.018,
              }}
              markers={[{ id: "me", coordinate: { latitude: 24.7136, longitude: 46.6753 } }]}
              scrollEnabled={false}
              zoomEnabled={false}
            />
            <View pointerEvents="none" style={styles.mapPinOverlay}>
              <View style={styles.pinShadow} />
              <View style={[styles.pinDot, { backgroundColor: colors.primary }]}>
                <View style={styles.pinDotInner} />
              </View>
            </View>

            <View style={styles.locationPill}>
              <Feather name="navigation" size={11} color={colors.primary} />
              <Text style={styles.locationPillText}>موقعك الحالي</Text>
            </View>

            <TouchableOpacity style={styles.gpsButton}>
              <MaterialCommunityIcons name="crosshairs-gps" size={16} color={colors.foreground} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.92} onPress={handleBookPress} style={styles.ctaContainer}>
          <LinearGradient
            colors={["#60A5FA", "#3B82F6", "#2563EB"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaGradient}
          >
            <View style={styles.ctaArrowContainer}>
              <Feather name="arrow-left" size={16} color={colors.primary} />
            </View>
            <View style={styles.ctaTextContainer}>
              <Text style={styles.ctaTitle}>احجز تنظيف الآن</Text>
            </View>
            <Image
              source={require("@/assets/images/illustration-bucket.png")}
              style={styles.ctaImage}
              resizeMode="contain"
            />
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>خدماتنا</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.servicesScroll}
          inverted
        >
          {SERVICES.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={[styles.serviceCard, { backgroundColor: "#FFFFFF" }]}
              onPress={() => router.push("/services")}
              activeOpacity={0.85}
            >
              <View style={[styles.serviceIconBox, { backgroundColor: service.color }]}>
                <MaterialCommunityIcons name={service.icon as any} size={20} color={service.iconColor} />
              </View>
              <Text style={[styles.serviceTitle, { color: colors.foreground }]} numberOfLines={1}>
                {service.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.promoCard}>
          <Image
            source={require("@/assets/images/illustration-bucket.png")}
            style={styles.promoImage}
            resizeMode="contain"
          />
          <View style={styles.promoTextContainer}>
            <View style={styles.promoTitleRow}>
              <Text style={[styles.promoTitle, { color: colors.foreground }]}>نظافة أكثر.. حياة أفضل</Text>
              <Text style={styles.promoSparkle}>✨</Text>
            </View>
            <Text style={[styles.promoSubtitle, { color: colors.mutedForeground }]}>
              فريقنا المحترف جاهز لخدمتك بأعلى معايير الجودة
            </Text>
          </View>
        </View>
      </ScrollView>
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
    marginBottom: 18,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  notifDot: {
    position: "absolute",
    top: 9,
    right: 11,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  headerCenter: { alignItems: "center" },
  greeting: {
    fontFamily: "Cairo_600SemiBold",
    fontSize: 13,
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: "Cairo_700Bold",
    fontSize: 14,
    color: "#1A2138",
  },
  mapWrap: {
    paddingHorizontal: 20,
    marginBottom: 18,
  },
  mapContainer: {
    height: 195,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#E8F0F5",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  mapPinOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  pinShadow: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(59,130,246,0.18)",
  },
  pinDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  pinDotInner: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#FFFFFF" },
  locationPill: {
    position: "absolute",
    top: 14,
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  locationPillText: {
    fontFamily: "Cairo_600SemiBold",
    fontSize: 11,
    color: "#1A2138",
  },
  gpsButton: {
    position: "absolute",
    bottom: 12,
    left: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  ctaContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 22,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 6,
  },
  ctaGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 22,
  },
  ctaImage: {
    width: 60,
    height: 60,
  },
  ctaTextContainer: {
    flex: 1,
    alignItems: "flex-end",
    paddingHorizontal: 12,
  },
  ctaTitle: {
    fontFamily: "Cairo_700Bold",
    fontSize: 15,
    color: "#FFFFFF",
  },
  ctaArrowContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
    alignItems: "flex-end",
  },
  sectionTitle: {
    fontFamily: "Cairo_700Bold",
    fontSize: 15,
  },
  servicesScroll: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 10,
    flexDirection: "row-reverse",
  },
  serviceCard: {
    width: 78,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  serviceIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  serviceTitle: {
    fontFamily: "Cairo_500Medium",
    fontSize: 10,
    textAlign: "center",
  },
  promoCard: {
    marginHorizontal: 20,
    marginTop: 22,
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    overflow: "hidden",
  },
  promoImage: {
    width: 72,
    height: 72,
  },
  promoTextContainer: {
    flex: 1,
    alignItems: "flex-end",
    paddingHorizontal: 12,
  },
  promoTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  promoTitle: {
    fontFamily: "Cairo_700Bold",
    fontSize: 13,
    textAlign: "right",
  },
  promoSparkle: { fontSize: 14 },
  promoSubtitle: {
    fontFamily: "Cairo_400Regular",
    fontSize: 11,
    textAlign: "right",
    lineHeight: 17,
  },
});
