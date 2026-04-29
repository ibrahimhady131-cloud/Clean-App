import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useColors } from "@/hooks/useColors";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/lib/auth";
import GuestEmpty from "@/components/GuestEmpty";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";

const MENU_KEYS = [
  { id: "1", titleKey: "my_orders",       subKey: "my_orders_sub",       icon: "shopping-bag", color: "#16C47F", path: "/(tabs)/bookings" },
  { id: "2", titleKey: "favorites",       subKey: "favorites_sub",       icon: "heart",        color: "#EC4899", path: "/favorites" },
  { id: "3", titleKey: "offers_disc",     subKey: "offers_disc_sub",     icon: "tag",          color: "#F59E0B", path: "/(tabs)/offers" },
  { id: "4", titleKey: "invite_friends",  subKey: "invite_friends_sub",  icon: "users",        color: "#8B5CF6", path: "/referrals" },
  { id: "5", titleKey: "settings",        subKey: "settings_sub",        icon: "settings",     color: "#6B7280", path: "/settings" },
  { id: "6", titleKey: "help_support",    subKey: "help_support_sub",    icon: "headphones",   color: "#FB923C", path: "/help" },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { t } = useI18n();
  const { session, profile, signOut } = useAuth();
  const MENU_ITEMS = MENU_KEYS.map((m) => ({ ...m, title: t(m.titleKey), subtitle: t(m.subKey) }));
  const [addresses, setAddresses] = useState<any[]>([]);
  const [bookingsCount, setBookingsCount] = useState(0);

  const loadData = useCallback(async () => {
    if (!session?.user) return;
    const uid = session.user.id;
    const [{ data: addrs }, { count }] = await Promise.all([
      supabase.from("addresses").select("*").eq("user_id", uid).order("is_default", { ascending: false }),
      supabase.from("bookings").select("id", { count: "exact", head: true }).eq("user_id", uid),
    ]);
    if (addrs) setAddresses(addrs);
    if (count !== null) setBookingsCount(count);
  }, [session]);

  useEffect(() => { loadData(); }, [loadData]);

  const onSignOut = () => {
    Alert.alert(t("signout"), t("signout_q"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("exit"),
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/login");
        },
      },
    ]);
  };

  if (!session) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <GuestEmpty title={t("profile_title")} subtitle={t("profile_sub")} icon="account-circle-outline" />
      </View>
    );
  }

  const initials = (profile?.full_name || t("the_user")).trim().split(" ").map((s) => s[0]).slice(0, 2).join("");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerActions}>
           <TouchableOpacity style={styles.iconCircle} onPress={() => router.push("/settings")}>
             <Feather name="settings" size={20} color={colors.foreground} />
           </TouchableOpacity>
           <TouchableOpacity style={styles.iconCircle} onPress={() => router.push("/notifications")}>
             <Feather name="bell" size={20} color={colors.foreground} />
             <View style={[styles.notifDot, { backgroundColor: colors.primary }]} />
           </TouchableOpacity>
        </View>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>{t("profile_title")}</Text>
          <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>{t("profile_sub")}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <LinearGradient
            colors={[colors.primaryLight + "40", "transparent"]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.profileTop}>
            <TouchableOpacity style={styles.chevron} onPress={onSignOut}>
              <Feather name="log-out" size={20} color={colors.danger} />
            </TouchableOpacity>
            
            <View style={styles.profileInfo}>
               <Text style={[styles.userName, { color: colors.foreground }]}>{profile?.full_name || t("the_user")}</Text>
               {!!profile?.phone && <Text style={[styles.userContact, { color: colors.mutedForeground }]}>{profile.phone}</Text>}
               {!!profile?.email && <Text style={[styles.userContact, { color: colors.mutedForeground }]}>{profile.email}</Text>}
               
               <View style={[styles.premiumPill, { backgroundColor: colors.successLight }]}>
                  <MaterialCommunityIcons name="shopping-outline" size={14} color={colors.success} />
                  <Text style={[styles.premiumText, { color: colors.success }]}>{bookingsCount} {t("bookings_completed")}</Text>
               </View>
            </View>

            <TouchableOpacity style={styles.avatarWrap} onPress={() => router.push("/edit-profile")}>
              {profile?.avatar_url ? (
                <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, { backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" }]}>
                  <Text style={{ fontFamily: "Tajawal_700Bold", fontSize: 28, color: colors.primary }}>{initials}</Text>
                </View>
              )}
              <TouchableOpacity style={[styles.cameraBadge, { backgroundColor: colors.primary }]} onPress={() => router.push("/edit-profile")}>
                <Feather name="camera" size={12} color="#FFFFFF" />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <TouchableOpacity onPress={() => router.push("/address-form")}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>إضافة</Text>
          </TouchableOpacity>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>العناوين المحفوظة</Text>
        </View>

        <View style={styles.sectionContent}>
          {addresses.length === 0 ? (
            <TouchableOpacity style={[styles.addBtn, { borderColor: colors.primary }]} onPress={() => router.push("/address-form")}>
               <Text style={[styles.addBtnText, { color: colors.primary }]}>+ إضافة عنوان جديد</Text>
            </TouchableOpacity>
          ) : (
            <>
              {addresses.map((item) => (
                <View key={item.id} style={[styles.addressItem, { backgroundColor: colors.card }]}>
                  <TouchableOpacity>
                    <Feather name="more-vertical" size={20} color={colors.mutedForeground} />
                  </TouchableOpacity>
                  <View style={styles.itemTextWrap}>
                    <View style={styles.itemTitleRow}>
                      {item.is_default && (
                        <View style={[styles.defaultBadge, { backgroundColor: colors.successLight }]}>
                          <Text style={[styles.defaultBadgeText, { color: colors.success }]}>{t("default")}</Text>
                        </View>
                      )}
                      <Text style={[styles.itemTitle, { color: colors.foreground }]}>{item.title || "عنوان"}</Text>
                    </View>
                    <Text style={[styles.itemSubtitle, { color: colors.mutedForeground }]} numberOfLines={1}>
                      {item.address || item.street || ""}
                    </Text>
                  </View>
                  <View style={[styles.itemIconBox, { backgroundColor: "#16C47F20" }]}>
                     <Feather name="map-pin" size={20} color="#16C47F" />
                  </View>
                </View>
              ))}
              <TouchableOpacity style={[styles.addBtn, { borderColor: colors.primary }]} onPress={() => router.push("/address-form")}>
                 <Text style={[styles.addBtnText, { color: colors.primary }]}>+ إضافة عنوان جديد</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={[styles.menuContainer, { backgroundColor: colors.card }]}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity 
              key={item.id} 
              onPress={() => router.push(item.path as any)}
              style={[
                styles.menuItem, 
                index !== MENU_ITEMS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }
              ]}
            >
              <Feather name="chevron-left" size={20} color={colors.mutedForeground} />
              <View style={styles.menuTextWrap}>
                <Text style={[styles.menuTitle, { color: colors.foreground }]}>{item.title}</Text>
                <Text style={[styles.menuSubtitle, { color: colors.mutedForeground }]}>{item.subtitle}</Text>
              </View>
              <View style={[styles.menuIconBox, { backgroundColor: item.color + "20" }]}>
                 <Feather name={item.icon as any} size={20} color={item.color} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.signOutBtn, { backgroundColor: "#FEE2E2" }]}
          onPress={onSignOut}
        >
          <Feather name="log-out" size={18} color="#EF4444" />
          <Text style={[styles.signOutText, { color: "#EF4444" }]}>{t("signout")}</Text>
        </TouchableOpacity>

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
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  notifDot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  headerTitleContainer: {
    alignItems: "flex-end",
  },
  headerTitle: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 18,
  },
  headerSubtitle: {
    fontFamily: "Tajawal_400Regular",
    fontSize: 13,
  },
  profileCard: {
    marginHorizontal: 24,
    borderRadius: 32,
    padding: 24,
    marginBottom: 18,
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
  },
  profileTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  chevron: {
    padding: 4,
  },
  profileInfo: {
    flex: 1,
    alignItems: "flex-end",
    marginHorizontal: 16,
  },
  userName: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 20,
    marginBottom: 4,
  },
  userContact: {
    fontFamily: "Tajawal_500Medium",
    fontSize: 13,
    marginBottom: 2,
  },
  premiumPill: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    gap: 6,
    marginTop: 12,
  },
  premiumText: {
    fontFamily: "Tajawal_600SemiBold",
    fontSize: 11,
  },
  avatarWrap: {
    position: "relative",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 18,
  },
  seeAll: {
    fontFamily: "Tajawal_600SemiBold",
    fontSize: 14,
  },
  sectionContent: {
    paddingHorizontal: 16,
    marginBottom: 18,
    gap: 12,
  },
  addressItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  itemTextWrap: {
    flex: 1,
    alignItems: "flex-end",
    marginHorizontal: 16,
  },
  itemTitleRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  itemTitle: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 15,
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
  },
  defaultBadgeText: {
    fontFamily: "Tajawal_600SemiBold",
    fontSize: 10,
  },
  itemSubtitle: {
    fontFamily: "Tajawal_400Regular",
    fontSize: 13,
  },
  itemIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtn: {
    height: 56,
    borderRadius: 18,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  addBtnText: {
    fontFamily: "Tajawal_600SemiBold",
    fontSize: 14,
  },
  menuContainer: {
    marginHorizontal: 24,
    borderRadius: 24,
    paddingHorizontal: 20,
    marginBottom: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  menuTextWrap: {
    flex: 1,
    alignItems: "flex-end",
    marginHorizontal: 16,
  },
  menuTitle: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 15,
    marginBottom: 4,
  },
  menuSubtitle: {
    fontFamily: "Tajawal_400Regular",
    fontSize: 12,
  },
  menuIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  signOutBtn: {
    marginHorizontal: 24,
    marginTop: 4,
    marginBottom: 16,
    height: 52,
    borderRadius: 18,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  signOutText: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 14,
  },
});
