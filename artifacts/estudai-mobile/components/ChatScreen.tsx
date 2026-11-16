import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import type { StudyAiStatus } from "@workspace/api-client-react";
import { useColors } from "@/hooks/useColors";
import { useStudy } from "@/context/StudyContext";
import type { ChatSession } from "@/hooks/useChatSession";

type AiStatusState = {
  data: StudyAiStatus | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<unknown>;
};

const freePrompts = [
  "Explique um assunto com um exemplo simples",
  "Me ajude a montar um plano de estudos",
  "Me faça perguntas para testar meu entendimento",
];

const materialPrompts = [
  "Resuma os pontos principais do material",
  "Explique o conceito mais difícil com um exemplo",
  "Me faça 3 perguntas sobre o material",
];

/** Três pontinhos que pulsam enquanto a IA escreve. */
function TypingDots({ color }: { color: string }) {
  const dots = useRef([0, 1, 2].map(() => new Animated.Value(0.3))).current;

  useEffect(() => {
    const loops = dots.map((dot, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 160),
          Animated.timing(dot, {
            toValue: 1,
            duration: 380,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.3,
            duration: 380,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ),
    );
    loops.forEach((loop) => loop.start());
    return () => loops.forEach((loop) => loop.stop());
  }, [dots]);

  return (
    <View style={styles.typingRow} accessibilityLabel="A IA está escrevendo">
      {dots.map((dot, index) => (
        <Animated.View
          key={index}
          style={[styles.typingDot, { backgroundColor: color, opacity: dot }]}
        />
      ))}
    </View>
  );
}

export function ChatScreen({
  aiStatus,
  chat,
}: {
  aiStatus: AiStatusState;
  chat: ChatSession;
}) {
  const colors = useColors();
  const { state } = useStudy();
  const scrollRef = useRef<ScrollView>(null);

  const [draft, setDraft] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);

  const { messages, materialId, material, error, pending } = chat;
  const setMaterialId = chat.setMaterialId;
  const retry = chat.retry;
  const configured = aiStatus.data?.configured === true;
  const lastIsUser = messages[messages.length - 1]?.role === "user";

  const send = () => {
    if (chat.send(draft)) {
      void Haptics.selectionAsync();
      setDraft("");
    }
  };

  const clear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    chat.clear();
    setConfirmClear(false);
  };

  const canSend = Boolean(draft.trim()) && configured && !pending;
  const prompts = material ? materialPrompts : freePrompts;

  return (
    <View style={styles.sectionContent}>
      <View style={styles.heading}>
        <Text style={[styles.screenTitle, { color: colors.foreground }]}>
          Chat
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Tire dúvidas e treine com a IA. Escolha um material para ela se basear
          nele.
        </Text>
      </View>

      {!configured ? (
        <View
          accessibilityRole="summary"
          style={[styles.notice, { backgroundColor: colors.accent }]}
        >
          {aiStatus.isLoading ? (
            <ActivityIndicator color={colors.accentForeground} size="small" />
          ) : (
            <Ionicons
              name="alert-circle-outline"
              size={20}
              color={colors.accentForeground}
            />
          )}
          <View style={styles.flex}>
            <Text style={[styles.noticeTitle, { color: colors.accentForeground }]}>
              {aiStatus.isLoading ? "Verificando a IA" : "IA indisponível"}
            </Text>
            <Text style={[styles.noticeText, { color: colors.accentForeground }]}>
              {aiStatus.isLoading
                ? "A configuração do serviço está sendo consultada."
                : aiStatus.isError
                  ? "Não foi possível consultar a configuração. Tente novamente."
                  : (aiStatus.data?.message ??
                    "Configure GEMINI_API_KEY nos segredos do servidor para conversar com a IA.")}
            </Text>
          </View>
          {aiStatus.isError ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Tentar verificar novamente"
              onPress={() => void aiStatus.refetch()}
              testID="button-chat-retry-status"
              hitSlop={8}
            >
              <Ionicons
                name="refresh-outline"
                size={20}
                color={colors.accentForeground}
              />
            </Pressable>
          ) : null}
        </View>
      ) : null}

      <View
        style={[
          styles.chatCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            shadowColor: colors.shadow,
          },
        ]}
      >
        {/* Topo: quem está conversando e sobre o quê */}
        <View style={styles.topBar}>
          <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
            <Ionicons
              name="sparkles"
              size={18}
              color={colors.accentForeground}
            />
          </View>
          <View style={styles.flex}>
            <Text style={[styles.assistantName, { color: colors.foreground }]}>
              Assistente EstudAI
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.assistantHint, { color: colors.mutedForeground }]}
            >
              {material ? `Sobre: ${material.title}` : "Conversa livre"}
            </Text>
          </View>
          {messages.length > 0 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                confirmClear
                  ? "Confirmar: apagar a conversa"
                  : "Limpar conversa"
              }
              onPress={clear}
              testID="button-chat-clear"
              hitSlop={8}
              style={[
                styles.clearButton,
                {
                  backgroundColor: confirmClear
                    ? colors.destructive + "22"
                    : colors.secondary,
                },
              ]}
            >
              <Ionicons
                name="trash-outline"
                size={16}
                color={confirmClear ? colors.destructive : colors.primary}
              />
              {confirmClear ? (
                <Text style={[styles.clearText, { color: colors.destructive }]}>
                  Apagar?
                </Text>
              ) : null}
            </Pressable>
          ) : null}
        </View>

        {/* Base da conversa */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {[{ id: "", title: "Conversa livre" }, ...state.materials].map(
            (item) => {
              const selected = item.id === materialId;
              return (
                <Pressable
                  key={item.id || "livre"}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setMaterialId(item.id)}
                  testID={`button-chat-material-${item.id || "livre"}`}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: selected
                        ? colors.primary
                        : colors.secondary,
                    },
                  ]}
                >
                  <Ionicons
                    name={item.id ? "document-text-outline" : "chatbubble-outline"}
                    size={13}
                    color={selected ? colors.primaryForeground : colors.primary}
                  />
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.chipText,
                      {
                        color: selected
                          ? colors.primaryForeground
                          : colors.secondaryForeground,
                      },
                    ]}
                  >
                    {item.title}
                  </Text>
                </Pressable>
              );
            },
          )}
        </ScrollView>
        {state.materials.length === 0 ? (
          <Text style={[styles.smallCopy, { color: colors.mutedForeground }]}>
            Dica: adicione um material em “Meus materiais” para a IA responder
            com base nele.
          </Text>
        ) : null}

        {/* Mensagens */}
        <ScrollView
          ref={scrollRef}
          style={styles.messages}
          contentContainerStyle={styles.messagesContent}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
          testID="chat-messages"
        >
          {messages.length === 0 ? (
            <View style={styles.emptyChat}>
              <View style={[styles.emptyOrb, { backgroundColor: colors.accent }]}>
                <Ionicons
                  name="sparkles"
                  size={26}
                  color={colors.accentForeground}
                />
              </View>
              <Text style={[styles.greeting, { color: colors.foreground }]}>
                Olá! O que vamos estudar hoje?
              </Text>
              <Text style={[styles.bodyCopy, { color: colors.mutedForeground }]}>
                {configured
                  ? "Escolha uma sugestão ou escreva sua dúvida."
                  : "A conversa fica disponível quando a IA estiver configurada."}
              </Text>
              {configured ? (
                <View style={styles.starters}>
                  {prompts.map((prompt) => (
                    <Pressable
                      key={prompt}
                      accessibilityRole="button"
                      onPress={() => setDraft(prompt)}
                      testID="button-chat-starter"
                      style={({ pressed }) => [
                        styles.starter,
                        {
                          backgroundColor: colors.secondary,
                          opacity: pressed ? 0.75 : 1,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.starterText,
                          { color: colors.secondaryForeground },
                        ]}
                      >
                        {prompt}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </View>
          ) : (
            messages.map((message) => {
              const mine = message.role === "user";
              return (
                <View
                  key={message.id}
                  style={[
                    styles.bubbleRow,
                    { justifyContent: mine ? "flex-end" : "flex-start" },
                  ]}
                >
                  {!mine ? (
                    <View
                      style={[styles.miniAvatar, { backgroundColor: colors.accent }]}
                    >
                      <Ionicons
                        name="sparkles"
                        size={11}
                        color={colors.accentForeground}
                      />
                    </View>
                  ) : null}
                  <View
                    style={[
                      styles.bubble,
                      mine
                        ? {
                            backgroundColor: colors.primary,
                            borderTopRightRadius: 6,
                          }
                        : {
                            backgroundColor: colors.secondary,
                            borderTopLeftRadius: 6,
                          },
                    ]}
                  >
                    <Text
                      selectable
                      style={[
                        styles.bubbleText,
                        {
                          color: mine
                            ? colors.primaryForeground
                            : colors.secondaryForeground,
                        },
                      ]}
                    >
                      {message.content}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
          {pending ? (
            <View style={styles.bubbleRow}>
              <View
                style={[styles.miniAvatar, { backgroundColor: colors.accent }]}
              >
                <Ionicons
                  name="sparkles"
                  size={11}
                  color={colors.accentForeground}
                />
              </View>
              <View
                style={[
                  styles.bubble,
                  { backgroundColor: colors.secondary, borderTopLeftRadius: 6 },
                ]}
              >
                <TypingDots color={colors.subtle} />
              </View>
            </View>
          ) : null}
        </ScrollView>

        {error ? (
          <View
            accessibilityRole="alert"
            style={[
              styles.errorBox,
              { backgroundColor: colors.destructive + "14" },
            ]}
          >
            <Ionicons
              name="alert-circle-outline"
              size={18}
              color={colors.destructive}
            />
            <View style={styles.flex}>
              <Text style={[styles.errorText, { color: colors.destructive }]}>
                {error}
              </Text>
              {lastIsUser && !pending && configured ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={retry}
                  testID="button-chat-retry"
                  hitSlop={8}
                >
                  <Text style={[styles.retryText, { color: colors.destructive }]}>
                    Tentar novamente
                  </Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        ) : null}

        {/* Caixa de mensagem */}
        <View
          style={[
            styles.composer,
            { backgroundColor: colors.background, borderColor: colors.input },
          ]}
        >
          <TextInput
            accessibilityLabel="Mensagem para a IA"
            editable={configured}
            maxLength={maxMessageChars}
            multiline
            onChangeText={setDraft}
            placeholder={
              configured ? "Escreva sua dúvida…" : "IA indisponível no momento"
            }
            placeholderTextColor={colors.subtle}
            testID="chat-input"
            value={draft}
            style={[styles.input, { color: colors.foreground }]}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Enviar mensagem"
            accessibilityState={{ disabled: !canSend }}
            disabled={!canSend}
            onPress={send}
            testID="button-chat-send"
            style={({ pressed }) => [
              styles.sendButton,
              {
                backgroundColor: colors.primary,
                opacity: !canSend ? 0.4 : pressed ? 0.8 : 1,
              },
            ]}
          >
            <Ionicons name="arrow-up" size={20} color={colors.primaryForeground} />
          </Pressable>
        </View>

        <Text style={[styles.smallCopy, { color: colors.mutedForeground }]}>
          A conversa fica salva somente neste dispositivo. A IA pode errar:
          confira informações importantes.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  sectionContent: { gap: 16 },
  heading: { gap: 6 },
  eyebrow: {
    fontFamily: "DMSans_700Bold",
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  screenTitle: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 26,
    lineHeight: 31,
  },
  subtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    lineHeight: 19,
  },
  notice: {
    alignItems: "flex-start",
    borderRadius: 18,
    flexDirection: "row",
    gap: 10,
    padding: 14,
  },
  noticeTitle: { fontFamily: "DMSans_700Bold", fontSize: 13 },
  noticeText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  chatCard: {
    borderRadius: 28,
    borderWidth: 1,
    elevation: 2,
    gap: 14,
    padding: 16,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
  },
  topBar: { alignItems: "center", flexDirection: "row", gap: 12 },
  avatar: {
    alignItems: "center",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  assistantName: { fontFamily: "Fraunces_600SemiBold", fontSize: 17 },
  assistantHint: { fontFamily: "DMSans_500Medium", fontSize: 12, marginTop: 1 },
  clearButton: {
    alignItems: "center",
    borderRadius: 16,
    flexDirection: "row",
    gap: 5,
    height: 32,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  clearText: { fontFamily: "DMSans_700Bold", fontSize: 12 },
  chipRow: { gap: 8 },
  chip: {
    alignItems: "center",
    borderRadius: 18,
    flexDirection: "row",
    gap: 6,
    maxWidth: 220,
    minHeight: 34,
    paddingHorizontal: 12,
  },
  chipText: { fontFamily: "DMSans_600SemiBold", fontSize: 12 },
  smallCopy: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    lineHeight: 16,
  },
  messages: { height: 400 },
  messagesContent: { flexGrow: 1, gap: 12, paddingVertical: 4 },
  emptyChat: { alignItems: "center", gap: 10, paddingVertical: 20 },
  emptyOrb: {
    alignItems: "center",
    borderRadius: 32,
    height: 64,
    justifyContent: "center",
    width: 64,
  },
  greeting: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 21,
    lineHeight: 27,
    textAlign: "center",
  },
  bodyCopy: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
  starters: { alignSelf: "stretch", gap: 8, marginTop: 6 },
  starter: {
    alignSelf: "center",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  starterText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    textAlign: "center",
  },
  bubbleRow: { alignItems: "flex-end", flexDirection: "row", gap: 8 },
  miniAvatar: {
    alignItems: "center",
    borderRadius: 12,
    height: 24,
    justifyContent: "center",
    width: 24,
  },
  bubble: {
    borderRadius: 22,
    maxWidth: "84%",
    paddingHorizontal: 15,
    paddingVertical: 11,
  },
  bubbleText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 15,
    lineHeight: 22,
  },
  typingRow: { alignItems: "center", flexDirection: "row", gap: 5, height: 22 },
  typingDot: { borderRadius: 4, height: 8, width: 8 },
  errorBox: {
    alignItems: "flex-start",
    borderRadius: 16,
    flexDirection: "row",
    gap: 8,
    padding: 12,
  },
  errorText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 12,
    lineHeight: 17,
  },
  retryText: {
    fontFamily: "DMSans_700Bold",
    fontSize: 12,
    marginTop: 6,
    textDecorationLine: "underline",
  },
  composer: {
    alignItems: "flex-end",
    borderRadius: 26,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    paddingBottom: 6,
    paddingLeft: 16,
    paddingRight: 6,
    paddingTop: 6,
  },
  input: {
    flex: 1,
    fontFamily: "DMSans_400Regular",
    fontSize: 15,
    maxHeight: 120,
    minHeight: 40,
    paddingBottom: 10,
    paddingTop: 10,
  },
  sendButton: {
    alignItems: "center",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
});
