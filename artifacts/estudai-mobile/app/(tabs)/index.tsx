import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  getGetStudyAiStatusQueryKey,
  useGetStudyAiStatus,
} from "@workspace/api-client-react";
import { ChatScreen } from "@/components/ChatScreen";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import {
  ChallengesScreen,
  MaterialsScreen,
  PerformanceScreen,
  QuizzesScreen,
  StudyHome,
  SummariesScreen,
} from "@/components/StudySections";
import { StudyProvider, useStudy } from "@/context/StudyContext";
import { useThemeControls } from "@/context/ThemeContext";
import { useChatSession } from "@/hooks/useChatSession";
import { useColors } from "@/hooks/useColors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const sections = [
  { id: "inicio", label: "Início", icon: "home-outline" },
  { id: "chat", label: "Chat", icon: "chatbubbles-outline" },
  { id: "materiais", label: "Meus materiais", icon: "layers-outline" },
  { id: "resumos", label: "Resumos", icon: "book-outline" },
  { id: "quizzes", label: "Quizzes", icon: "help-circle-outline" },
  { id: "desafios", label: "Desafios", icon: "construct-outline" },
  { id: "desempenho", label: "Meu desempenho", icon: "stats-chart-outline" },
] as const;

type SectionId = (typeof sections)[number]["id"];

function StudyAppContent() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { isReady, storageError } = useStudy();
  const { scheme, toggle } = useThemeControls();
  const [activeSection, setActiveSection] = useState<SectionId>("inicio");
  const fade = useRef(new Animated.Value(1)).current;

  // Transição suave: o conteúdo surge devagar, subindo um pouquinho, ao trocar de seção.
  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: 340,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [activeSection, fade]);

  const aiStatus = useGetStudyAiStatus({
    query: {
      queryKey: getGetStudyAiStatusQueryKey(),
      staleTime: 30_000,
      refetchOnWindowFocus: true,
    },
  });

  const chat = useChatSession(aiStatus.data?.configured === true);

  const topInset =
    Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const bottomInset =
    Platform.OS === "web" ? Math.max(insets.bottom, 34) : insets.bottom;

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.page,
        {
          paddingTop: topInset + 12,
          paddingBottom: bottomInset + 18,
          backgroundColor: colors.background,
        },
      ]}
      keyboardShouldPersistTaps="handled"
      bottomOffset={52}
      testID="study-app-scroll"
    >
      <View style={styles.content}>
        <View style={styles.brandRow}>
          <LinearGradient
            colors={
              scheme === "dark" ? ["#D93732", "#B02B27"] : ["#26303A", "#3F5058"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.brandIcon}
          >
            <Ionicons
              name="sparkles-outline"
              size={21}
              color={colors.primaryForeground}
            />
          </LinearGradient>
          <View style={styles.brandCopy}>
            <Text style={[styles.brandTitle, { color: colors.foreground }]}>
              Estud<Text style={{ color: colors.primary }}>AI</Text>
            </Text>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
              style={[styles.brandSubtitle, { color: colors.mutedForeground }]}
            >
              organize • converse • aprenda
            </Text>
          </View>
          {aiStatus.isLoading || aiStatus.data?.configured ? null : (
            <View style={[styles.aiBadge, { backgroundColor: colors.accent }]}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: colors.accentForeground },
                ]}
              />
              <Text style={[styles.aiBadgeText, { color: colors.accentForeground }]}>
                IA indisponível
              </Text>
            </View>
          )}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              scheme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"
            }
            onPress={toggle}
            testID="button-theme-toggle"
            style={({ pressed }) => [
              styles.themeButton,
              { backgroundColor: colors.secondary, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Ionicons
              name={scheme === "dark" ? "sunny-outline" : "moon-outline"}
              size={19}
              color={colors.primary}
            />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.navRow}
          accessibilityLabel="Seções do EstudAI"
        >
          {sections.map((section) => {
            const selected = section.id === activeSection;
            return (
              <Pressable
                key={section.id}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setActiveSection(section.id)}
                testID={`button-section-${section.id}`}
                style={({ pressed }) => [
                  styles.navChip,
                  {
                    backgroundColor: selected ? colors.primary : colors.secondary,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Ionicons
                  name={section.icon}
                  size={16}
                  color={selected ? colors.primaryForeground : colors.primary}
                />
                <Text
                  style={[
                    styles.navText,
                    {
                      color: selected
                        ? colors.primaryForeground
                        : colors.foreground,
                    },
                  ]}
                >
                  {section.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.mainContent}>
          {storageError ? (
            <View
              accessibilityRole="alert"
              style={[
                styles.storageWarning,
                {
                  backgroundColor: colors.accent,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name="alert-circle-outline"
                size={18}
                color={colors.accentForeground}
              />
              <Text style={[styles.storageText, { color: colors.foreground }]}>
                {storageError}
              </Text>
            </View>
          ) : null}

          {!isReady ? (
            <View style={styles.loadingState}>
              <ActivityIndicator color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
                Carregando seus dados locais…
              </Text>
            </View>
          ) : (
            <Animated.View
              style={{
                opacity: fade,
                transform: [
                  {
                    translateY: fade.interpolate({
                      inputRange: [0, 1],
                      outputRange: [14, 0],
                    }),
                  },
                ],
              }}
            >
              {activeSection === "inicio" ? (
                <StudyHome
                  aiStatus={aiStatus}
                  chat={chat}
                  onNavigate={(section) =>
                    setActiveSection(section as SectionId)
                  }
                />
              ) : null}
              {/* O chat fica sempre montado (só escondido) para não perder uma resposta em andamento ao trocar de seção. */}
              <View
                style={{ display: activeSection === "chat" ? "flex" : "none" }}
              >
                <ChatScreen aiStatus={aiStatus} chat={chat} />
              </View>
              {activeSection === "materiais" ? <MaterialsScreen /> : null}
              {activeSection === "resumos" ? (
                <SummariesScreen aiStatus={aiStatus} />
              ) : null}
              {activeSection === "quizzes" ? (
                <QuizzesScreen aiStatus={aiStatus} />
              ) : null}
              {activeSection === "desafios" ? (
                <ChallengesScreen aiStatus={aiStatus} />
              ) : null}
              {activeSection === "desempenho" ? <PerformanceScreen /> : null}
            </Animated.View>
          )}
        </View>
      </View>
    </KeyboardAwareScrollViewCompat>
  );
}

export default function StudyScreen() {
  return (
    <StudyProvider>
      <StudyAppContent />
    </StudyProvider>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  page: { flexGrow: 1, paddingHorizontal: 16 },
  content: { alignSelf: "center", gap: 20, maxWidth: 760, width: "100%" },
  brandRow: { alignItems: "center", flexDirection: "row", gap: 10 },
  brandIcon: {
    alignItems: "center",
    borderRadius: 16,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  themeButton: {
    alignItems: "center",
    borderRadius: 18,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  brandCopy: { flex: 1 },
  brandTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 24,
    lineHeight: 28,
  },
  brandSubtitle: {
    fontFamily: "DMSans_500Medium",
    fontSize: 9,
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },
  aiBadge: {
    alignItems: "center",
    borderRadius: 16,
    flexDirection: "row",
    gap: 6,
    minHeight: 32,
    paddingHorizontal: 9,
  },
  statusDot: { borderRadius: 4, height: 7, width: 7 },
  aiBadgeText: { fontFamily: "DMSans_700Bold", fontSize: 10 },
  navRow: { gap: 8, paddingVertical: 1 },
  navChip: {
    alignItems: "center",
    borderRadius: 22,
    flexDirection: "row",
    gap: 7,
    minHeight: 42,
    paddingHorizontal: 15,
  },
  navText: { fontFamily: "DMSans_600SemiBold", fontSize: 13 },
  mainContent: { gap: 14 },
  storageWarning: {
    alignItems: "flex-start",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    padding: 11,
  },
  storageText: {
    flex: 1,
    fontFamily: "DMSans_500Medium",
    fontSize: 12,
    lineHeight: 18,
  },
  loadingState: { alignItems: "center", gap: 10, paddingVertical: 60 },
  loadingText: { fontFamily: "DMSans_400Regular", fontSize: 13 },
});
