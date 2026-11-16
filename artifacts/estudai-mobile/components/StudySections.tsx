import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import type { PropsWithChildren } from "react";
import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import {
  useGenerateStudyChallenges,
  useGenerateStudyQuiz,
  useGenerateStudySummary,
  useGradeStudyChallenge,
} from "@workspace/api-client-react";
import type {
  StudyAiStatus,
  StudyChallenge,
  StudyChallengeGrade,
  StudyChallengeRequest,
  StudyDifficulty,
  StudyGenerationRequest,
  StudyQuiz,
  StudyQuizRequest,
} from "@workspace/api-client-react";
import { useColors } from "@/hooks/useColors";
import { MaterialViewer } from "@/components/MaterialViewer";
import { TagInput } from "@/components/TagInput";
import type { ChatSession } from "@/hooks/useChatSession";
import { parseTags } from "@/utils/tags";
import {
  type ChallengeAttempt,
  type QuizAttempt,
  type SavedChallengeSet,
  type SavedQuiz,
  type SavedSummary,
  type StudyMaterial,
  useStudy,
} from "@/context/StudyContext";

type AiStatusState = {
  data: StudyAiStatus | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<unknown>;
};

type ScreenProps = {
  aiStatus: AiStatusState;
};

type SectionIcon = keyof typeof Ionicons.glyphMap;

const difficultyOptions: { value: StudyDifficulty; label: string }[] = [
  { value: "iniciante", label: "Iniciante" },
  { value: "intermediario", label: "Intermediário" },
  { value: "avancado", label: "Avançado" },
];

const challengeOptions: {
  value: StudyChallengeRequest["challengeType"];
  label: string;
}[] = [
  { value: "logica", label: "Lógica" },
  { value: "programacao", label: "Programação" },
  { value: "resolucao-de-problemas", label: "Problemas" },
];

const allowedMimeTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
const maxFileBytes = 2 * 1024 * 1024;
const maxStoredAttachmentChars = 3 * 1024 * 1024;

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeAnswer(value: string): string {
  return value.trim().toLocaleLowerCase("pt-BR").replace(/\s+/g, " ");
}

function errorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null) {
    const data = (error as { data?: { message?: unknown } }).data;
    if (typeof data?.message === "string") return data.message;
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return "A ação não foi concluída. Nenhum resultado foi salvo.";
}

function sourceFromMaterial(material: StudyMaterial) {
  return {
    title: material.title,
    ...(material.text ? { text: material.text } : {}),
    ...(material.file ? { file: material.file } : {}),
  };
}

function Button({
  title,
  icon,
  onPress,
  disabled = false,
  secondary = false,
  testID,
}: {
  title: string;
  icon?: SectionIcon;
  onPress: () => void;
  disabled?: boolean;
  secondary?: boolean;
  testID: string;
}) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => {
        void Haptics.selectionAsync();
        onPress();
      }}
      testID={testID}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: secondary ? colors.secondary : colors.primary,
          borderColor: secondary ? colors.border : colors.primary,
          opacity: disabled ? 0.48 : pressed ? 0.8 : 1,
        },
      ]}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={17}
          color={secondary ? colors.secondaryForeground : colors.primaryForeground}
        />
      ) : null}
      <Text
        style={[
          styles.buttonText,
          {
            color: secondary ? colors.secondaryForeground : colors.primaryForeground,
          },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

function Panel({
  children,
  style,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.panel,
        { backgroundColor: colors.card, borderColor: colors.border },
        style,
      ]}
    >
      {children}
    </View>
  );
}

function ScreenHeading({
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
}) {
  const colors = useColors();
  return (
    <View style={styles.heading}>
      <Text style={[styles.screenTitle, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
        {subtitle}
      </Text>
    </View>
  );
}

function AiStatusPanel({ aiStatus }: ScreenProps) {
  const colors = useColors();
  const configured = aiStatus.data?.configured === true;
  // Quando tudo está funcionando, não mostra nenhum aviso.
  if (configured && !aiStatus.isLoading && !aiStatus.isError) return null;
  const title = aiStatus.isLoading
    ? "Verificando a IA"
    : configured
      ? "Gemini disponível"
      : "IA indisponível";
  const message = aiStatus.isLoading
    ? "A configuração do serviço está sendo consultada."
    : aiStatus.isError
      ? "Não foi possível consultar a configuração. Tente novamente antes de gerar conteúdo."
      : aiStatus.data?.message ??
        "Configure GEMINI_API_KEY nos segredos do servidor para habilitar resumos, quizzes e desafios.";
  const color = configured ? colors.primary : colors.accentForeground;

  return (
    <View
      accessibilityRole="summary"
      style={[
        styles.statusPanel,
        {
          backgroundColor: configured ? colors.secondary : colors.accent,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.statusIcon}>
        {aiStatus.isLoading ? (
          <ActivityIndicator color={color} size="small" />
        ) : (
          <Ionicons
            name={configured ? "checkmark-circle-outline" : "alert-circle-outline"}
            size={20}
            color={color}
          />
        )}
      </View>
      <View style={styles.statusCopy}>
        <Text style={[styles.statusTitle, { color: colors.foreground }]}>{title}</Text>
        <Text style={[styles.statusMessage, { color: colors.mutedForeground }]}>
          {message}
        </Text>
      </View>
      {aiStatus.isError ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tentar verificar novamente"
          onPress={() => void aiStatus.refetch()}
          testID="button-retry-ai-status"
          style={styles.iconButton}
        >
          <Ionicons name="refresh-outline" size={20} color={colors.primary} />
        </Pressable>
      ) : null}
    </View>
  );
}

function EmptyState({
  icon,
  title,
  message,
}: {
  icon: SectionIcon;
  title: string;
  message: string;
}) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.emptyState,
        { borderColor: colors.border, backgroundColor: colors.card },
      ]}
    >
      <View
        style={[
          styles.emptyIcon,
          { backgroundColor: colors.secondary },
        ]}
      >
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <Text style={[styles.cardTitle, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.bodyCopy, { color: colors.mutedForeground }]}>
        {message}
      </Text>
    </View>
  );
}

function MaterialPicker({
  materials,
  selectedId,
  onSelect,
}: {
  materials: StudyMaterial[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const colors = useColors();
  if (materials.length === 0) {
    return (
      <Text style={[styles.bodyCopy, { color: colors.mutedForeground }]}>
        Adicione um material antes de criar esta atividade.
      </Text>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipRow}
    >
      {materials.map((material) => {
        const selected = material.id === selectedId;
        return (
          <Pressable
            key={material.id}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onSelect(material.id)}
            testID={`button-select-material-${material.id}`}
            style={[
              styles.choiceChip,
              {
                backgroundColor: selected ? colors.primary : colors.card,
                borderColor: selected ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.choiceText,
                {
                  color: selected
                    ? colors.primaryForeground
                    : colors.foreground,
                },
              ]}
            >
              {material.title}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function DifficultyPicker({
  value,
  onChange,
}: {
  value: StudyDifficulty;
  onChange: (value: StudyDifficulty) => void;
}) {
  const colors = useColors();
  return (
    <View style={styles.choiceRow}>
      {difficultyOptions.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            testID={`button-difficulty-${option.value}`}
            style={[
              styles.choiceChip,
              {
                backgroundColor: selected ? colors.primary : colors.card,
                borderColor: selected ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.choiceText,
                {
                  color: selected
                    ? colors.primaryForeground
                    : colors.foreground,
                },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function FormLabel({ children }: PropsWithChildren) {
  const colors = useColors();
  return (
    <Text style={[styles.formLabel, { color: colors.foreground }]}>
      {children}
    </Text>
  );
}

function AppTextInput({
  value,
  onChangeText,
  placeholder,
  multiline = false,
  maxLength,
  testID,
  autoCapitalize = "sentences",
}: {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
  maxLength?: number;
  testID: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}) {
  const colors = useColors();
  return (
    <TextInput
      accessibilityLabel={placeholder}
      autoCapitalize={autoCapitalize}
      maxLength={maxLength}
      multiline={multiline}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.mutedForeground}
      testID={testID}
      value={value}
      style={[
        styles.textInput,
        multiline ? styles.multilineInput : null,
        {
          backgroundColor: colors.background,
          borderColor: colors.input,
          color: colors.foreground,
        },
      ]}
    />
  );
}

function ErrorMessage({ children }: PropsWithChildren) {
  const colors = useColors();
  if (!children) return null;
  return (
    <View
      accessibilityRole="alert"
      style={[
        styles.errorBox,
        {
          backgroundColor: colors.destructive + "12",
          borderColor: colors.destructive + "44",
        },
      ]}
    >
      <Ionicons name="alert-circle-outline" size={18} color={colors.destructive} />
      <Text style={[styles.errorText, { color: colors.destructive }]}>
        {children}
      </Text>
    </View>
  );
}

export function StudyHome({
  aiStatus,
  onNavigate,
  chat,
}: ScreenProps & { onNavigate: (section: string) => void; chat: ChatSession }) {
  const { state } = useStudy();
  const colors = useColors();
  const [draft, setDraft] = useState("");
  const configured = aiStatus.data?.configured === true;

  // A primeira mensagem sai daqui e a conversa continua na aba Chat.
  const ask = (text: string) => {
    if (!chat.send(text)) return;
    setDraft("");
    onNavigate("chat");
  };
  const attempts = state.quizAttempts.length + state.challengeAttempts.length;
  const topicsToReview = new Set([
    ...state.quizAttempts.flatMap((attempt) => attempt.topicsToReview),
    ...state.challengeAttempts.flatMap((attempt) => attempt.grade.topicsToReview),
  ]).size;
  const recentActivities = [
    ...state.quizAttempts.map((attempt) => ({
      id: attempt.id,
      title: attempt.quizTitle,
      note: `${attempt.correct} de ${attempt.total} respostas corretas`,
      date: attempt.completedAt,
    })),
    ...state.challengeAttempts.map((attempt) => ({
      id: attempt.id,
      title: attempt.challengeTitle,
      note: `${attempt.grade.score} / 100 · avaliação recebida`,
      date: attempt.completedAt,
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  const actions: [string, string, string, SectionIcon][] = [
    ["materiais", "Meus materiais", "Anotações, PDFs e imagens", "document-text-outline"],
    ["resumos", "Resumos", "Leituras organizadas", "book-outline"],
    ["quizzes", "Quizzes", "Teste o que você sabe", "help-circle-outline"],
  ];

  return (
    <View style={styles.sectionContent}>
      <View style={styles.heading}>
        <Text style={[styles.heroTitle, { color: colors.foreground }]}>
          Olá! O que vamos estudar hoje?
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Pergunte algo à IA ou escolha por onde começar.
        </Text>
      </View>

      <AiStatusPanel aiStatus={aiStatus} />

      <View
        style={[
          styles.homeComposer,
          {
            backgroundColor: colors.card,
            borderColor: colors.input,
            shadowColor: colors.shadow,
          },
        ]}
      >
        <TextInput
          accessibilityLabel="Pergunte algo à IA"
          editable={configured}
          maxLength={4000}
          multiline
          onChangeText={setDraft}
          placeholder={
            configured ? "Pergunte algo à IA…" : "IA indisponível no momento"
          }
          placeholderTextColor={colors.subtle}
          testID="home-chat-input"
          value={draft}
          style={[styles.homeComposerInput, { color: colors.foreground }]}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Enviar para o Chat"
          accessibilityState={{ disabled: !configured || !draft.trim() }}
          disabled={!configured || !draft.trim()}
          onPress={() => ask(draft)}
          testID="home-chat-send"
          style={({ pressed }) => [
            styles.homeComposerSend,
            {
              backgroundColor: colors.primary,
              opacity: !configured || !draft.trim() ? 0.4 : pressed ? 0.8 : 1,
            },
          ]}
        >
          <Ionicons name="arrow-up" size={20} color={colors.primaryForeground} />
        </Pressable>
      </View>

      {configured ? (
        <View style={styles.homeStarters}>
          {[
            "Explique um assunto com um exemplo simples",
            "Me ajude a montar um plano de estudos",
          ].map((prompt) => (
            <Pressable
              key={prompt}
              accessibilityRole="button"
              onPress={() => ask(prompt)}
              testID="home-chat-starter"
              style={({ pressed }) => [
                styles.homeStarter,
                { backgroundColor: colors.secondary, opacity: pressed ? 0.75 : 1 },
              ]}
            >
              <Text
                style={[styles.homeStarterText, { color: colors.secondaryForeground }]}
              >
                {prompt}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <View style={styles.homeActions}>
        {actions.map(([id, title, hint, icon]) => {
          const strong = false;
          return (
            <Pressable
              key={id}
              accessibilityRole="button"
              onPress={() => onNavigate(id)}
              testID={`button-home-${id}`}
              style={({ pressed }) => [
                styles.homeCard,
                {
                  backgroundColor: strong ? colors.primary : colors.card,
                  borderColor: strong ? colors.primary : colors.border,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <View
                style={[
                  styles.homeCardIcon,
                  {
                    backgroundColor: strong
                      ? "rgba(255,255,255,0.18)"
                      : colors.secondary,
                  },
                ]}
              >
                <Ionicons
                  name={icon}
                  size={22}
                  color={strong ? colors.primaryForeground : colors.primary}
                />
              </View>
              <View style={styles.flex}>
                <Text
                  style={[
                    styles.homeCardTitle,
                    { color: strong ? colors.primaryForeground : colors.foreground },
                  ]}
                >
                  {title}
                </Text>
                <Text
                  style={[
                    styles.smallCopy,
                    {
                      color: strong
                        ? colors.primaryForeground
                        : colors.mutedForeground,
                      opacity: strong ? 0.8 : 1,
                    },
                  ]}
                >
                  {hint}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={strong ? colors.primaryForeground : colors.subtle}
              />
            </Pressable>
          );
        })}
      </View>

      <View style={[styles.homeStats, { backgroundColor: colors.secondary }]}>
        <Text style={[styles.homeStat, { color: colors.secondaryForeground }]}>
          <Text style={styles.homeStatNumber}>{state.materials.length}</Text>{" "}
          <Text style={{ color: colors.mutedForeground }}>
            {state.materials.length === 1 ? "material" : "materiais"}
          </Text>
        </Text>
        <Text style={[styles.homeStat, { color: colors.secondaryForeground }]}>
          <Text style={styles.homeStatNumber}>{attempts}</Text>{" "}
          <Text style={{ color: colors.mutedForeground }}>
            {attempts === 1 ? "atividade" : "atividades"}
          </Text>
        </Text>
        <Text style={[styles.homeStat, { color: colors.secondaryForeground }]}>
          <Text style={styles.homeStatNumber}>{topicsToReview}</Text>{" "}
          <Text style={{ color: colors.mutedForeground }}>para revisar</Text>
        </Text>
      </View>

      {recentActivities.length ? (
        <View style={styles.homeRecent}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>
            Atividade recente
          </Text>
          {recentActivities.map((activity) => (
            <View
              key={activity.id}
              style={[
                styles.activityRow,
                {
                  backgroundColor: colors.card,
                  borderRadius: 18,
                  borderTopWidth: 0,
                  paddingHorizontal: 14,
                },
              ]}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color={colors.primary}
              />
              <View style={styles.flex}>
                <Text style={[styles.linkTitle, { color: colors.foreground }]}>
                  {activity.title}
                </Text>
                <Text style={[styles.smallCopy, { color: colors.mutedForeground }]}>
                  {activity.note}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: SectionIcon;
}) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.statCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Ionicons name={icon} size={18} color={colors.primary} />
      <Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text>
      <Text style={[styles.smallCopy, { color: colors.mutedForeground }]}>
        {label}
      </Text>
    </View>
  );
}

export function MaterialsScreen() {
  const { state, setState } = useStudy();
  const colors = useColors();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [viewingId, setViewingId] = useState<string | null>(null);

  const tagCounts = state.materials.reduce<Record<string, number>>(
    (counts, item) => {
      (item.tags ?? []).forEach((tag) => {
        counts[tag] = (counts[tag] ?? 0) + 1;
      });
      return counts;
    },
    {},
  );
  const allTags = Object.keys(tagCounts).sort(
    (a, b) => tagCounts[b] - tagCounts[a] || a.localeCompare(b, "pt-BR"),
  );
  const viewing = state.materials.find((item) => item.id === viewingId) ?? null;

  const updateTags = (materialId: string, tags: string[]) => {
    setState((current) => ({
      ...current,
      materials: current.materials.map((item) =>
        item.id === materialId ? { ...item, tags } : item,
      ),
    }));
  };

  const saveText = () => {
    if (!title.trim() || !text.trim()) {
      setError("Preencha o título e o conteúdo antes de salvar.");
      return;
    }
    const material: StudyMaterial = {
      id: createId(),
      title: title.trim(),
      sourceType: "texto",
      text: text.trim(),
      tags: parseTags(tagsInput, allTags),
      createdAt: new Date().toISOString(),
    };
    setState((current) => ({
      ...current,
      materials: [material, ...current.materials],
    }));
    setTitle("");
    setText("");
    setTagsInput("");
    setError("");
  };

  const addFile = async () => {
    setError("");
    try {
      const selection = await DocumentPicker.getDocumentAsync({
        type: [...allowedMimeTypes],
        copyToCacheDirectory: true,
        multiple: false,
        base64: true,
      });
      if (selection.canceled) return;
      const asset = selection.assets[0];
      const mimeType = asset.mimeType;
      if (!mimeType || !allowedMimeTypes.includes(mimeType as (typeof allowedMimeTypes)[number])) {
        setError("Formato não aceito. Escolha PDF, JPG, PNG ou WebP.");
        return;
      }
      if (asset.size !== undefined && asset.size > maxFileBytes) {
        setError("O arquivo deve ter até 2 MB para ser salvo neste dispositivo.");
        return;
      }

      setBusy(true);
      const base64 = asset.base64 ?? (await new File(asset.uri).base64());
      if (!base64) {
        setError("Não foi possível ler o arquivo selecionado.");
        return;
      }
      if (base64.length > maxStoredAttachmentChars) {
        setError("O arquivo excede o espaço disponível para armazenamento local.");
        return;
      }
      const usedAttachmentSpace = state.materials.reduce(
        (total, material) => total + (material.file?.base64.length ?? 0),
        0,
      );
      if (usedAttachmentSpace + base64.length > maxStoredAttachmentChars) {
        setError("Remova um arquivo antigo antes de adicionar outro.");
        return;
      }

      const validMimeType = mimeType as StudyMaterial["file"] extends
        | { mimeType: infer T }
        | undefined
        ? T
        : never;
      const material: StudyMaterial = {
        id: createId(),
        title: asset.name.replace(/\.[^.]+$/, "") || "Material",
        sourceType: mimeType === "application/pdf" ? "pdf" : "imagem",
        file: { name: asset.name, mimeType: validMimeType, base64 },
        tags: parseTags(tagsInput, allTags),
        createdAt: new Date().toISOString(),
      };
      setState((current) => ({
        ...current,
        materials: [material, ...current.materials],
      }));
      setTagsInput("");
    } catch {
      setError("Não foi possível adicionar este arquivo. Tente novamente.");
    } finally {
      setBusy(false);
    }
  };

  const removeMaterial = (materialId: string) => {
    setState((current) => ({
      ...current,
      materials: current.materials.filter((item) => item.id !== materialId),
    }));
  };

  const term = search.trim().toLocaleLowerCase("pt-BR").replace(/^@/, "");
  const filteredMaterials = state.materials.filter(
    (material) =>
      (!activeTag || (material.tags ?? []).includes(activeTag)) &&
      (!term ||
        material.title.toLocaleLowerCase("pt-BR").includes(term) ||
        (material.tags ?? []).some((tag) => tag.includes(term))),
  );

  return (
    <View style={styles.sectionContent}>
      <ScreenHeading
        eyebrow="Sua biblioteca"
        title="Meus materiais"
        subtitle="Suas anotações, PDFs e imagens, salvos neste aparelho."
      />

      <Panel>
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>
          Colar anotações
        </Text>
        <FormLabel>Título</FormLabel>
        <AppTextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Nome do material"
          maxLength={200}
          testID="input-material-title"
        />
        <FormLabel>Conteúdo</FormLabel>
        <AppTextInput
          value={text}
          onChangeText={setText}
          placeholder="Cole aqui suas anotações ou o texto de estudo."
          multiline
          maxLength={100000}
          testID="input-material-text"
        />
        <Text style={[styles.characterCount, { color: colors.mutedForeground }]}>
          {text.length.toLocaleString("pt-BR")} / 100.000
        </Text>
        <FormLabel>Tags (opcional)</FormLabel>
        <TagInput
          value={tagsInput}
          onChange={setTagsInput}
          suggestions={allTags}
          testID="input-material-tags"
        />
        <Text style={[styles.smallCopy, { color: colors.mutedForeground }]}>
          As tags valem para o texto e para o arquivo que você enviar em seguida.
        </Text>
        <Button
          title="Salvar texto"
          icon="save-outline"
          onPress={saveText}
          testID="button-save-material"
        />
        <View style={styles.separator} />
        <Button
          title={busy ? "Lendo arquivo…" : "Selecionar PDF ou imagem"}
          icon="cloud-upload-outline"
          onPress={() => void addFile()}
          disabled={busy}
          secondary
          testID="button-upload-material"
        />
        <Text style={[styles.smallCopy, { color: colors.mutedForeground }]}>
          PDF, JPG, PNG ou WebP · até 2 MB por arquivo
        </Text>
        <ErrorMessage>{error}</ErrorMessage>
      </Panel>

      <Panel>
        <View style={styles.rowBetween}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>
            Materiais salvos ({state.materials.length})
          </Text>
        </View>
        {state.materials.length > 0 ? (
          <AppTextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar por nome ou @tag"
            testID="input-search-materials"
            autoCapitalize="none"
          />
        ) : null}
        {allTags.length ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagFilterRow}
          >
            {["", ...allTags].map((tag) => {
              const selected = activeTag === tag;
              return (
                <Pressable
                  key={tag || "todas"}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setActiveTag(selected && tag ? "" : tag)}
                  testID={`tag-filter-${tag || "todas"}`}
                  style={[
                    styles.tagChip,
                    {
                      backgroundColor: selected
                        ? colors.primary
                        : colors.secondary,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tagChipText,
                      {
                        color: selected
                          ? colors.primaryForeground
                          : colors.secondaryForeground,
                      },
                    ]}
                  >
                    {tag ? `@${tag} ${tagCounts[tag]}` : "Todas"}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        ) : null}
        {filteredMaterials.length ? (
          filteredMaterials.map((material) => (
            <View
              key={material.id}
              style={[styles.materialRow, { borderTopColor: colors.border }]}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Abrir ${material.title}`}
                onPress={() => setViewingId(material.id)}
                testID={`button-open-material-${material.id}`}
                style={styles.materialMain}
              >
                <View
                  style={[
                    styles.materialIcon,
                    { backgroundColor: colors.secondary },
                  ]}
                >
                  <Ionicons
                    name={
                      material.sourceType === "texto"
                        ? "document-text-outline"
                        : material.sourceType === "pdf"
                          ? "document-outline"
                          : "image-outline"
                    }
                    size={19}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.flex}>
                  <Text style={[styles.linkTitle, { color: colors.foreground }]}>
                    {material.title}
                  </Text>
                  <Text style={[styles.smallCopy, { color: colors.mutedForeground }]}>
                    {material.file?.name ??
                      `${(material.text?.length ?? 0).toLocaleString("pt-BR")} caracteres`}
                  </Text>
                  {material.tags?.length ? (
                    <View style={styles.tagWrap}>
                      {material.tags.map((tag) => (
                        <View
                          key={tag}
                          style={[
                            styles.tagChip,
                            { backgroundColor: colors.accent + "80" },
                          ]}
                        >
                          <Text
                            style={[
                              styles.tagChipText,
                              { color: colors.accentForeground },
                            ]}
                          >
                            @{tag}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : null}
                </View>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Remover ${material.title}`}
                onPress={() => removeMaterial(material.id)}
                testID={`button-remove-material-${material.id}`}
                style={styles.iconButton}
              >
                <Ionicons name="trash-outline" size={18} color={colors.destructive} />
              </Pressable>
            </View>
          ))
        ) : (
          <Text style={[styles.bodyCopy, { color: colors.mutedForeground }]}>
            {state.materials.length
              ? "Nenhum material corresponde à busca."
              : "Ainda não há materiais salvos."}
          </Text>
        )}
      </Panel>

      <MaterialViewer
        material={viewing}
        allTags={allTags}
        onClose={() => setViewingId(null)}
        onSaveTags={updateTags}
      />
    </View>
  );
}

export function SummariesScreen({ aiStatus }: ScreenProps) {
  const { state, setState } = useStudy();
  const colors = useColors();
  const mutation = useGenerateStudySummary();
  const [materialId, setMaterialId] = useState("");
  const [difficulty, setDifficulty] = useState<StudyDifficulty>("iniciante");
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<SavedSummary | null>(null);
  const material = state.materials.find((item) => item.id === materialId);

  const generate = () => {
    if (!material || !aiStatus.data?.configured) return;
    setError("");
    const data: StudyGenerationRequest = {
      ...sourceFromMaterial(material),
      difficulty,
    };
    mutation.mutate(
      { data },
      {
        onSuccess: (summary) => {
          const saved: SavedSummary = {
            id: createId(),
            materialId: material.id,
            materialTitle: material.title,
            difficulty,
            data: summary,
            createdAt: new Date().toISOString(),
          };
          setState((current) => ({
            ...current,
            summaries: [saved, ...current.summaries],
          }));
          setSelected(saved);
        },
        onError: (reason) => setError(errorMessage(reason)),
      },
    );
  };

  return (
    <View style={styles.sectionContent}>
      <ScreenHeading
        eyebrow="Aprenda com suas fontes"
        title="Resumos"
        subtitle="Transforme um material seu em uma leitura organizada."
      />
      <AiStatusPanel aiStatus={aiStatus} />
      <Panel>
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>
          Criar resumo
        </Text>
        <MaterialPicker
          materials={state.materials}
          selectedId={materialId}
          onSelect={setMaterialId}
        />
        <FormLabel>Nível de dificuldade</FormLabel>
        <DifficultyPicker value={difficulty} onChange={setDifficulty} />
        <Button
          title={mutation.isPending ? "Gerando…" : "Gerar resumo"}
          icon={mutation.isPending ? undefined : "sparkles-outline"}
          onPress={generate}
          disabled={!material || !aiStatus.data?.configured || mutation.isPending}
          testID="button-generate-summary"
        />
        {mutation.isPending ? (
          <ActivityIndicator color={colors.primary} />
        ) : null}
        <ErrorMessage>{error}</ErrorMessage>
      </Panel>

      {selected ? (
        <SummaryDetail summary={selected} onClose={() => setSelected(null)} />
      ) : null}

      <Panel>
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>
          Resumos salvos ({state.summaries.length})
        </Text>
        {state.summaries.length ? (
          state.summaries.map((summary) => (
            <Pressable
              key={summary.id}
              accessibilityRole="button"
              onPress={() => setSelected(summary)}
              testID={`button-open-summary-${summary.id}`}
              style={[styles.savedRow, { borderTopColor: colors.border }]}
            >
              <Ionicons name="book-outline" size={20} color={colors.primary} />
              <View style={styles.flex}>
                <Text style={[styles.linkTitle, { color: colors.foreground }]}>
                  {summary.data.title}
                </Text>
                <Text style={[styles.smallCopy, { color: colors.mutedForeground }]}>
                  {summary.materialTitle}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.mutedForeground}
              />
            </Pressable>
          ))
        ) : (
          <Text style={[styles.bodyCopy, { color: colors.mutedForeground }]}>
            {aiStatus.data?.configured
              ? "Nenhum resumo foi gerado ainda."
              : "A geração está indisponível até configurar o Gemini. Nenhum resumo de exemplo é exibido."}
          </Text>
        )}
      </Panel>
    </View>
  );
}

function SummaryDetail({
  summary,
  onClose,
}: {
  summary: SavedSummary;
  onClose: () => void;
}) {
  const colors = useColors();
  return (
    <Panel>
      <View style={styles.rowBetween}>
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>
          {summary.data.title}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fechar resumo"
          onPress={onClose}
          testID="button-close-summary"
          style={styles.iconButton}
        >
          <Ionicons name="close-outline" size={22} color={colors.mutedForeground} />
        </Pressable>
      </View>
      <Text style={[styles.bodyCopy, { color: colors.foreground }]}>
        {summary.data.overview}
      </Text>
      {summary.data.sections.map((section, index) => (
        <View
          key={`${section.heading}-${index}`}
          style={[styles.detailSection, { borderTopColor: colors.border }]}
        >
          <Text style={[styles.linkTitle, { color: colors.foreground }]}>
            {section.heading}
          </Text>
          <Text style={[styles.bodyCopy, { color: colors.mutedForeground }]}>
            {section.explanation}
          </Text>
        </View>
      ))}
      {summary.data.keyTerms.map((term, index) => (
        <View key={`${term.term}-${index}`} style={styles.termRow}>
          <Text style={[styles.linkTitle, { color: colors.foreground }]}>
            {term.term}
          </Text>
          <Text style={[styles.bodyCopy, { color: colors.mutedForeground }]}>
            {term.definition}
          </Text>
        </View>
      ))}
      {summary.data.reviewTopics.length ? (
        <View>
          <Text style={[styles.formLabel, { color: colors.foreground }]}>
            Para revisar
          </Text>
          {summary.data.reviewTopics.map((topic, index) => (
            <Text
              key={`${topic}-${index}`}
              style={[styles.bodyCopy, { color: colors.mutedForeground }]}
            >
              • {topic}
            </Text>
          ))}
        </View>
      ) : null}
    </Panel>
  );
}

export function QuizzesScreen({ aiStatus }: ScreenProps) {
  const { state, setState } = useStudy();
  const colors = useColors();
  const mutation = useGenerateStudyQuiz();
  const [materialId, setMaterialId] = useState("");
  const [difficulty, setDifficulty] = useState<StudyDifficulty>("iniciante");
  const [error, setError] = useState("");
  const [activeQuiz, setActiveQuiz] = useState<SavedQuiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const material = state.materials.find((item) => item.id === materialId);

  const generate = () => {
    if (!material || !aiStatus.data?.configured) return;
    setError("");
    const data: StudyQuizRequest = {
      ...sourceFromMaterial(material),
      difficulty,
      questionCount: 5,
    };
    mutation.mutate(
      { data },
      {
        onSuccess: (quiz) => {
          const saved: SavedQuiz = {
            id: createId(),
            materialId: material.id,
            materialTitle: material.title,
            difficulty,
            data: quiz,
            createdAt: new Date().toISOString(),
          };
          setState((current) => ({
            ...current,
            quizzes: [saved, ...current.quizzes],
          }));
        },
        onError: (reason) => setError(errorMessage(reason)),
      },
    );
  };

  const finishQuiz = () => {
    if (!activeQuiz) return;
    const missedTopics = activeQuiz.data.questions
      .filter(
        (question) =>
          normalizeAnswer(answers[question.id] ?? "") !==
          normalizeAnswer(question.correctAnswer),
      )
      .map((question) => question.topic);
    const correct = activeQuiz.data.questions.filter(
      (question) =>
        normalizeAnswer(answers[question.id] ?? "") ===
        normalizeAnswer(question.correctAnswer),
    ).length;
    const completed: QuizAttempt = {
      id: createId(),
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.data.title,
      answers: { ...answers },
      correct,
      total: activeQuiz.data.questions.length,
      topicsToReview: [...new Set(missedTopics)],
      completedAt: new Date().toISOString(),
    };
    setState((current) => ({
      ...current,
      quizAttempts: [completed, ...current.quizAttempts],
    }));
    setAttempt(completed);
  };

  const startQuiz = (quiz: SavedQuiz) => {
    setActiveQuiz(quiz);
    setAnswers({});
    setAttempt(null);
  };

  const closeQuiz = () => {
    setActiveQuiz(null);
    setAttempt(null);
    setAnswers({});
  };

  return (
    <View style={styles.sectionContent}>
      <ScreenHeading
        eyebrow="Prática ativa"
        title="Quizzes"
        subtitle="Questões criadas a partir dos seus materiais."
      />
      <AiStatusPanel aiStatus={aiStatus} />
      <Panel>
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>
          Montar um quiz
        </Text>
        <MaterialPicker
          materials={state.materials}
          selectedId={materialId}
          onSelect={setMaterialId}
        />
        <FormLabel>Nível de dificuldade</FormLabel>
        <DifficultyPicker value={difficulty} onChange={setDifficulty} />
        <Button
          title={mutation.isPending ? "Criando…" : "Gerar quiz"}
          icon={mutation.isPending ? undefined : "sparkles-outline"}
          onPress={generate}
          disabled={!material || !aiStatus.data?.configured || mutation.isPending}
          testID="button-generate-quiz"
        />
        {mutation.isPending ? (
          <ActivityIndicator color={colors.primary} />
        ) : null}
        <ErrorMessage>{error}</ErrorMessage>
      </Panel>

      {activeQuiz ? (
        <Panel>
          <View style={styles.rowBetween}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>
              {attempt ? "Resultado da tentativa" : activeQuiz.data.title}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fechar quiz"
              onPress={closeQuiz}
              testID="button-close-quiz"
              style={styles.iconButton}
            >
              <Ionicons name="close-outline" size={22} color={colors.mutedForeground} />
            </Pressable>
          </View>
          {attempt ? (
            <QuizResults quiz={activeQuiz.data} attempt={attempt} />
          ) : (
            <>
              {activeQuiz.data.questions.map((question, index) => (
                <QuizQuestion
                  key={question.id}
                  question={question}
                  index={index}
                  selected={answers[question.id] ?? ""}
                  onSelect={(option) =>
                    setAnswers((current) => ({
                      ...current,
                      [question.id]: option,
                    }))
                  }
                />
              ))}
              <Text style={[styles.smallCopy, { color: colors.mutedForeground }]}>
                {Object.keys(answers).length} de {activeQuiz.data.questions.length}{" "}
                respondidas
              </Text>
              <Button
                title="Finalizar tentativa"
                icon="checkmark-outline"
                onPress={finishQuiz}
                disabled={
                  Object.keys(answers).length !== activeQuiz.data.questions.length
                }
                testID="button-finish-quiz"
              />
            </>
          )}
        </Panel>
      ) : null}

      <Panel>
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>
          Quizzes salvos ({state.quizzes.length})
        </Text>
        {state.quizzes.length ? (
          state.quizzes.map((quiz) => (
            <View
              key={quiz.id}
              style={[styles.savedRow, { borderTopColor: colors.border }]}
            >
              <Ionicons name="help-circle-outline" size={20} color={colors.primary} />
              <View style={styles.flex}>
                <Text style={[styles.linkTitle, { color: colors.foreground }]}>
                  {quiz.data.title}
                </Text>
                <Text style={[styles.smallCopy, { color: colors.mutedForeground }]}>
                  {quiz.data.questions.length} questões · {quiz.materialTitle}
                </Text>
              </View>
              <Button
                title="Responder"
                onPress={() => startQuiz(quiz)}
                secondary
                testID={`button-start-quiz-${quiz.id}`}
              />
            </View>
          ))
        ) : (
          <Text style={[styles.bodyCopy, { color: colors.mutedForeground }]}>
            {aiStatus.data?.configured
              ? "Nenhum quiz foi gerado ainda."
              : "Os quizzes ficam indisponíveis até configurar o Gemini. Nenhuma questão fictícia é exibida."}
          </Text>
        )}
      </Panel>
    </View>
  );
}

function QuizQuestion({
  question,
  index,
  selected,
  onSelect,
}: {
  question: StudyQuiz["questions"][number];
  index: number;
  selected: string;
  onSelect: (option: string) => void;
}) {
  const colors = useColors();
  return (
    <View style={styles.questionBlock}>
      <Text style={[styles.formLabel, { color: colors.foreground }]}>
        {index + 1}. {question.prompt}
      </Text>
      {question.options.map((option, optionIndex) => (
        <Pressable
          key={`${question.id}-${optionIndex}`}
          accessibilityRole="radio"
          accessibilityState={{ checked: selected === option }}
          onPress={() => onSelect(option)}
          testID={`button-answer-${index}-${optionIndex}`}
          style={[
            styles.answerChoice,
            {
              backgroundColor:
                selected === option ? colors.secondary : colors.background,
              borderColor: selected === option ? colors.primary : colors.border,
            },
          ]}
        >
          <Ionicons
            name={selected === option ? "radio-button-on" : "radio-button-off"}
            size={18}
            color={selected === option ? colors.primary : colors.mutedForeground}
          />
          <Text style={[styles.bodyCopy, { color: colors.foreground }]}>{option}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function QuizResults({
  quiz,
  attempt,
}: {
  quiz: StudyQuiz;
  attempt: QuizAttempt;
}) {
  const colors = useColors();
  return (
    <View>
      <Text style={[styles.scoreText, { color: colors.primary }]}>
        {attempt.correct} / {attempt.total}
      </Text>
      <Text style={[styles.smallCopy, { color: colors.mutedForeground }]}>
        Respostas corretas nesta tentativa
      </Text>
      {quiz.questions.map((question, index) => {
        const isCorrect =
          normalizeAnswer(attempt.answers[question.id] ?? "") ===
          normalizeAnswer(question.correctAnswer);
        return (
          <View
            key={question.id}
            style={[styles.detailSection, { borderTopColor: colors.border }]}
          >
            <View style={styles.answerReviewHeading}>
              <Ionicons
                name={isCorrect ? "checkmark-circle" : "close-circle"}
                size={19}
                color={isCorrect ? colors.success : colors.destructive}
              />
              <Text style={[styles.formLabel, styles.flex, { color: colors.foreground }]}>
                {index + 1}. {question.prompt}
              </Text>
            </View>
            <Text style={[styles.smallCopy, { color: colors.mutedForeground }]}>
              Sua resposta: {attempt.answers[question.id]}
            </Text>
            {!isCorrect ? (
              <Text style={[styles.smallCopy, { color: colors.primary }]}>
                Correta: {question.correctAnswer}
              </Text>
            ) : null}
            <Text style={[styles.bodyCopy, { color: colors.mutedForeground }]}>
              {question.explanation}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export function ChallengesScreen({ aiStatus }: ScreenProps) {
  const { state, setState } = useStudy();
  const colors = useColors();
  const createMutation = useGenerateStudyChallenges();
  const gradeMutation = useGradeStudyChallenge();
  const [materialId, setMaterialId] = useState("");
  const [difficulty, setDifficulty] = useState<StudyDifficulty>("iniciante");
  const [challengeType, setChallengeType] =
    useState<StudyChallengeRequest["challengeType"]>("resolucao-de-problemas");
  const [error, setError] = useState("");
  const [active, setActive] = useState<{
    set: SavedChallengeSet;
    challenge: StudyChallenge;
  } | null>(null);
  const [answer, setAnswer] = useState("");
  const [grade, setGrade] = useState<StudyChallengeGrade | null>(null);
  const material = state.materials.find((item) => item.id === materialId);
  const activeMaterial = active
    ? state.materials.find((item) => item.id === active.set.materialId)
    : undefined;

  const generate = () => {
    if (!material || !aiStatus.data?.configured) return;
    setError("");
    createMutation.mutate(
      {
        data: {
          ...sourceFromMaterial(material),
          difficulty,
          challengeType,
        },
      },
      {
        onSuccess: (data) => {
          const saved: SavedChallengeSet = {
            id: createId(),
            materialId: material.id,
            materialTitle: material.title,
            difficulty,
            challengeType,
            data,
            createdAt: new Date().toISOString(),
          };
          setState((current) => ({
            ...current,
            challenges: [saved, ...current.challenges],
          }));
        },
        onError: (reason) => setError(errorMessage(reason)),
      },
    );
  };

  const openChallenge = (set: SavedChallengeSet, challenge: StudyChallenge) => {
    setActive({ set, challenge });
    setAnswer("");
    setGrade(null);
    setError("");
  };

  const submitAnswer = () => {
    if (!active || !activeMaterial || !answer.trim() || !aiStatus.data?.configured) {
      return;
    }
    setError("");
    gradeMutation.mutate(
      {
        data: {
          ...sourceFromMaterial(activeMaterial),
          difficulty: active.set.difficulty,
          challenge: active.challenge,
          answer: answer.trim(),
        },
      },
      {
        onSuccess: (result) => {
          const completedAt = new Date().toISOString();
          const attempt: ChallengeAttempt = {
            id: createId(),
            challengeTitle: active.challenge.title,
            answer: answer.trim(),
            grade: result,
            completedAt,
          };
          setState((current) => ({
            ...current,
            challengeAttempts: [attempt, ...current.challengeAttempts],
          }));
          setGrade(result);
        },
        onError: (reason) => setError(errorMessage(reason)),
      },
    );
  };

  return (
    <View style={styles.sectionContent}>
      <ScreenHeading
        eyebrow="Aprender fazendo"
        title="Desafios"
        subtitle="Aplique o que você estudou e receba uma correção."
      />
      <AiStatusPanel aiStatus={aiStatus} />
      <Panel>
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>
          Criar desafio prático
        </Text>
        <MaterialPicker
          materials={state.materials}
          selectedId={materialId}
          onSelect={setMaterialId}
        />
        <FormLabel>Nível de dificuldade</FormLabel>
        <DifficultyPicker value={difficulty} onChange={setDifficulty} />
        <FormLabel>Tipo de desafio</FormLabel>
        <View style={styles.choiceRow}>
          {challengeOptions.map((option) => {
            const selected = challengeType === option.value;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setChallengeType(option.value)}
                testID={`button-challenge-type-${option.value}`}
                style={[
                  styles.choiceChip,
                  {
                    backgroundColor: selected ? colors.primary : colors.card,
                    borderColor: selected ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.choiceText,
                    {
                      color: selected
                        ? colors.primaryForeground
                        : colors.foreground,
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Button
          title={createMutation.isPending ? "Criando…" : "Gerar desafios"}
          icon={createMutation.isPending ? undefined : "sparkles-outline"}
          onPress={generate}
          disabled={
            !material || !aiStatus.data?.configured || createMutation.isPending
          }
          testID="button-generate-challenges"
        />
        {createMutation.isPending ? (
          <ActivityIndicator color={colors.primary} />
        ) : null}
        <ErrorMessage>{error && !active ? error : ""}</ErrorMessage>
      </Panel>

      {active ? (
        <Panel>
          <View style={styles.rowBetween}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>
              {grade ? "Avaliação recebida" : active.challenge.title}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fechar desafio"
              onPress={() => {
                setActive(null);
                setGrade(null);
                setError("");
              }}
              testID="button-close-challenge"
              style={styles.iconButton}
            >
              <Ionicons name="close-outline" size={22} color={colors.mutedForeground} />
            </Pressable>
          </View>
          {grade ? (
            <ChallengeGrade grade={grade} />
          ) : (
            <>
              <Text style={[styles.bodyCopy, { color: colors.foreground }]}>
                {active.challenge.prompt}
              </Text>
              <Text style={[styles.formLabel, { color: colors.foreground }]}>
                Critérios da atividade
              </Text>
              {active.challenge.rubric.map((item, index) => (
                <Text
                  key={`${item}-${index}`}
                  style={[styles.bodyCopy, { color: colors.mutedForeground }]}
                >
                  • {item}
                </Text>
              ))}
              <FormLabel>Sua resposta</FormLabel>
              <AppTextInput
                value={answer}
                onChangeText={setAnswer}
                placeholder="Escreva sua tentativa."
                multiline
                maxLength={12000}
                testID="input-challenge-answer"
              />
              <ErrorMessage>{error}</ErrorMessage>
              {!activeMaterial ? (
                <Text style={[styles.smallCopy, { color: colors.destructive }]}>
                  O material associado não está salvo neste dispositivo. Salve-o
                  novamente para avaliar a resposta.
                </Text>
              ) : null}
              <Button
                title={gradeMutation.isPending ? "Avaliando…" : "Enviar para avaliação"}
                icon={gradeMutation.isPending ? undefined : "send-outline"}
                onPress={submitAnswer}
                disabled={
                  !answer.trim() ||
                  !activeMaterial ||
                  !aiStatus.data?.configured ||
                  gradeMutation.isPending
                }
                testID="button-submit-challenge"
              />
              {gradeMutation.isPending ? (
                <ActivityIndicator color={colors.primary} />
              ) : null}
            </>
          )}
        </Panel>
      ) : null}

      <Panel>
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>
          Desafios salvos ({state.challenges.length})
        </Text>
        {state.challenges.length ? (
          state.challenges.map((set) => (
            <View
              key={set.id}
              style={[styles.challengeSet, { borderTopColor: colors.border }]}
            >
              <Text style={[styles.linkTitle, { color: colors.foreground }]}>
                {set.data.title}
              </Text>
              <Text style={[styles.smallCopy, { color: colors.mutedForeground }]}>
                {set.materialTitle} · {set.data.challenges.length} desafios
              </Text>
              {set.data.challenges.map((challenge) => (
                <Pressable
                  key={challenge.id}
                  accessibilityRole="button"
                  onPress={() => openChallenge(set, challenge)}
                  testID={`button-open-challenge-${challenge.id}`}
                  style={[
                    styles.linkRow,
                    { borderBottomColor: colors.border },
                  ]}
                >
                  <Ionicons name="construct-outline" size={19} color={colors.primary} />
                  <View style={styles.flex}>
                    <Text style={[styles.linkTitle, { color: colors.foreground }]}>
                      {challenge.title}
                    </Text>
                    <Text style={[styles.smallCopy, { color: colors.mutedForeground }]}>
                      {challenge.topic}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={colors.mutedForeground}
                  />
                </Pressable>
              ))}
            </View>
          ))
        ) : (
          <Text style={[styles.bodyCopy, { color: colors.mutedForeground }]}>
            {aiStatus.data?.configured
              ? "Nenhum desafio foi gerado ainda."
              : "Os desafios ficam indisponíveis até configurar o Gemini. Nenhum enunciado de exemplo é exibido."}
          </Text>
        )}
      </Panel>
    </View>
  );
}

function ChallengeGrade({ grade }: { grade: StudyChallengeGrade }) {
  const colors = useColors();
  return (
    <View>
      <Text style={[styles.scoreText, { color: colors.primary }]}>
        {grade.score} / 100
      </Text>
      <Text style={[styles.bodyCopy, { color: colors.foreground }]}>
        {grade.evaluation}
      </Text>
      <Text style={[styles.formLabel, { color: colors.foreground }]}>
        Pontos fortes
      </Text>
      {grade.strengths.length ? (
        grade.strengths.map((item, index) => (
          <Text
            key={`${item}-${index}`}
            style={[styles.bodyCopy, { color: colors.mutedForeground }]}
          >
            • {item}
          </Text>
        ))
      ) : (
        <Text style={[styles.bodyCopy, { color: colors.mutedForeground }]}>
          Nenhum ponto forte foi registrado pela avaliação.
        </Text>
      )}
      <Text style={[styles.formLabel, { color: colors.foreground }]}>
        O que melhorar
      </Text>
      {grade.improvements.length ? (
        grade.improvements.map((item, index) => (
          <Text
            key={`${item}-${index}`}
            style={[styles.bodyCopy, { color: colors.mutedForeground }]}
          >
            • {item}
          </Text>
        ))
      ) : (
        <Text style={[styles.bodyCopy, { color: colors.mutedForeground }]}>
          Nenhuma sugestão de melhoria foi registrada.
        </Text>
      )}
      {grade.topicsToReview.length ? (
        <>
          <Text style={[styles.formLabel, { color: colors.foreground }]}>
            Tópicos para revisar
          </Text>
          <Text style={[styles.bodyCopy, { color: colors.mutedForeground }]}>
            {grade.topicsToReview.join(" · ")}
          </Text>
        </>
      ) : null}
      <Text style={[styles.formLabel, { color: colors.foreground }]}>
        Resposta esperada
      </Text>
      <Text style={[styles.bodyCopy, { color: colors.mutedForeground }]}>
        {grade.expectedAnswer}
      </Text>
    </View>
  );
}

export function PerformanceScreen() {
  const { state } = useStudy();
  const colors = useColors();
  const totalAnswers = state.quizAttempts.reduce(
    (total, attempt) => total + attempt.total,
    0,
  );
  const correctAnswers = state.quizAttempts.reduce(
    (total, attempt) => total + attempt.correct,
    0,
  );
  const quizRate = totalAnswers
    ? Math.round((correctAnswers / totalAnswers) * 100)
    : null;
  const challengeAverage = state.challengeAttempts.length
    ? Math.round(
        state.challengeAttempts.reduce(
          (total, attempt) => total + attempt.grade.score,
          0,
        ) / state.challengeAttempts.length,
      )
    : null;
  const reviewTopics = [
    ...new Set([
      ...state.quizAttempts.flatMap((attempt) => attempt.topicsToReview),
      ...state.challengeAttempts.flatMap(
        (attempt) => attempt.grade.topicsToReview,
      ),
    ]),
  ];

  return (
    <View style={styles.sectionContent}>
      <ScreenHeading
        eyebrow="Seu percurso real"
        title="Desempenho"
        subtitle="Seu progresso, com base no que você já concluiu."
      />
      {state.quizAttempts.length || state.challengeAttempts.length ? (
        <>
          <View style={styles.statRow}>
            <StatCard
              label="Tentativas concluídas"
              value={(state.quizAttempts.length + state.challengeAttempts.length).toString()}
              icon="checkmark-circle-outline"
            />
            <StatCard
              label="Acerto em quizzes"
              value={quizRate === null ? "—" : `${quizRate}%`}
              icon="help-circle-outline"
            />
            <StatCard
              label="Média dos desafios"
              value={challengeAverage === null ? "—" : `${challengeAverage}`}
              icon="construct-outline"
            />
          </View>
          <Panel>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>
              Assuntos para revisar
            </Text>
            {reviewTopics.length ? (
              reviewTopics.map((topic) => (
                <View key={topic} style={styles.topicRow}>
                  <Ionicons
                    name="time-outline"
                    size={18}
                    color={colors.accentForeground}
                  />
                  <Text style={[styles.bodyCopy, { color: colors.foreground }]}>
                    {topic}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={[styles.bodyCopy, { color: colors.mutedForeground }]}>
                Nenhum assunto para revisar foi identificado nas tentativas salvas.
              </Text>
            )}
          </Panel>
          <Panel>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>
              Histórico de atividades
            </Text>
            {state.quizAttempts
              .map((attempt) => (
                <ActivityItem
                  key={attempt.id}
                  title={attempt.quizTitle}
                  detail={`${attempt.correct} de ${attempt.total} respostas corretas`}
                  date={attempt.completedAt}
                />
              ))
              .concat(
                state.challengeAttempts.map((attempt) => (
                  <ActivityItem
                    key={attempt.id}
                    title={attempt.challengeTitle}
                    detail={`${attempt.grade.score} / 100 · avaliação recebida`}
                    date={attempt.completedAt}
                  />
                )),
              )
              .sort((a, b) => b.props.date.localeCompare(a.props.date))}
          </Panel>
        </>
      ) : (
        <EmptyState
          icon="stats-chart-outline"
          title="Ainda não há desempenho para mostrar"
          message="Conclua um quiz real ou receba a avaliação de um desafio. Nenhuma pontuação de exemplo é exibida."
        />
      )}
    </View>
  );
}

function ActivityItem({
  title,
  detail,
  date,
}: {
  title: string;
  detail: string;
  date: string;
}) {
  const colors = useColors();
  return (
    <View style={[styles.activityRow, { borderTopColor: colors.border }]}>
      <Ionicons
        name="checkmark-circle-outline"
        size={19}
        color={colors.primary}
      />
      <View style={styles.flex}>
        <Text style={[styles.linkTitle, { color: colors.foreground }]}>{title}</Text>
        <Text style={[styles.smallCopy, { color: colors.mutedForeground }]}>
          {detail} · {new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(date))}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContent: { gap: 14 },
  heading: { gap: 6, marginBottom: 4 },
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
  materialMain: { alignItems: "center", flex: 1, flexDirection: "row", gap: 12 },
  tagWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 6 },
  tagFilterRow: { gap: 8 },
  tagChip: { borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5 },
  tagChipText: { fontFamily: "DMSans_600SemiBold", fontSize: 11 },
  homeComposer: {
    alignItems: "flex-end",
    borderRadius: 28,
    borderWidth: 1,
    elevation: 2,
    flexDirection: "row",
    gap: 8,
    paddingBottom: 7,
    paddingLeft: 18,
    paddingRight: 7,
    paddingTop: 7,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  homeComposerInput: {
    flex: 1,
    fontFamily: "DMSans_400Regular",
    fontSize: 15,
    maxHeight: 120,
    minHeight: 42,
    paddingBottom: 10,
    paddingTop: 10,
  },
  homeComposerSend: {
    alignItems: "center",
    borderRadius: 21,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  homeStarters: { gap: 8 },
  homeStarter: {
    alignSelf: "flex-start",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  homeStarterText: { fontFamily: "DMSans_500Medium", fontSize: 12 },
  homeActions: { gap: 10 },
  homeCard: {
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: "row",
    gap: 14,
    padding: 16,
  },
  homeCardIcon: {
    alignItems: "center",
    borderRadius: 18,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  homeCardTitle: { fontFamily: "Fraunces_600SemiBold", fontSize: 17, marginBottom: 2 },
  homeStats: {
    borderRadius: 20,
    columnGap: 22,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 18,
    paddingVertical: 14,
    rowGap: 6,
  },
  homeStat: { fontFamily: "DMSans_500Medium", fontSize: 13 },
  homeStatNumber: { fontFamily: "Fraunces_600SemiBold", fontSize: 18 },
  homeRecent: { gap: 8 },
  welcomeCard: {
    borderRadius: 28,
    borderWidth: 1,
    elevation: 1,
    gap: 12,
    padding: 22,
    shadowColor: "#26303A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 22,
  },
  heroTitle: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 28,
    lineHeight: 34,
  },
  heroCopy: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 4,
  },
  panel: {
    borderRadius: 24,
    borderWidth: 1,
    elevation: 1,
    gap: 12,
    padding: 18,
    shadowColor: "#26303A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
  },
  cardTitle: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 18,
    lineHeight: 24,
  },
  bodyCopy: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    lineHeight: 21,
  },
  smallCopy: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    lineHeight: 18,
  },
  statusPanel: {
    alignItems: "flex-start",
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    padding: 14,
  },
  statusIcon: { height: 22, justifyContent: "center", width: 22 },
  statusCopy: { flex: 1, gap: 3 },
  statusTitle: { fontFamily: "DMSans_700Bold", fontSize: 13 },
  statusMessage: { fontFamily: "DMSans_400Regular", fontSize: 12, lineHeight: 18 },
  button: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  buttonText: { fontFamily: "DMSans_700Bold", fontSize: 13 },
  iconButton: {
    alignItems: "center",
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  formLabel: {
    fontFamily: "DMSans_700Bold",
    fontSize: 13,
    marginTop: 4,
  },
  textInput: {
    borderRadius: 12,
    borderWidth: 1,
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    minHeight: 46,
    paddingHorizontal: 13,
    paddingVertical: 11,
    textAlignVertical: "top",
  },
  multilineInput: { minHeight: 120 },
  characterCount: {
    alignSelf: "flex-end",
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    marginTop: -8,
  },
  separator: { height: 1, marginVertical: 2 },
  emptyState: {
    alignItems: "center",
    borderRadius: 22,
    borderStyle: "dashed",
    borderWidth: 1,
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  emptyIcon: {
    alignItems: "center",
    borderRadius: 16,
    height: 46,
    justifyContent: "center",
    marginBottom: 4,
    width: 46,
  },
  statRow: { flexDirection: "row", gap: 9 },
  statCard: {
    alignItems: "flex-start",
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
    gap: 6,
    minWidth: 0,
    padding: 12,
  },
  statValue: { fontFamily: "Fraunces_600SemiBold", fontSize: 23 },
  linkRow: {
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 11,
    minHeight: 58,
    paddingVertical: 10,
  },
  linkTitle: { fontFamily: "DMSans_700Bold", fontSize: 13 },
  flex: { flex: 1 },
  activityRow: {
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 10,
    paddingVertical: 10,
  },
  rowBetween: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chipRow: { gap: 8, paddingVertical: 2 },
  choiceRow: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  choiceChip: {
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    minHeight: 36,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  choiceText: { fontFamily: "DMSans_600SemiBold", fontSize: 12 },
  materialRow: {
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 10,
    paddingVertical: 10,
  },
  materialIcon: {
    alignItems: "center",
    borderRadius: 12,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  savedRow: {
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 10,
    paddingVertical: 11,
  },
  detailSection: {
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 5,
    paddingTop: 12,
  },
  termRow: { gap: 3 },
  questionBlock: { gap: 8, paddingTop: 6 },
  answerChoice: {
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    minHeight: 44,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  scoreText: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 38,
    lineHeight: 44,
  },
  answerReviewHeading: { alignItems: "flex-start", flexDirection: "row", gap: 8 },
  challengeSet: { borderTopWidth: StyleSheet.hairlineWidth, gap: 6, paddingTop: 12 },
  topicRow: { alignItems: "center", flexDirection: "row", gap: 9 },
  errorBox: {
    alignItems: "flex-start",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    padding: 10,
  },
  errorText: { flex: 1, fontFamily: "DMSans_500Medium", fontSize: 12, lineHeight: 18 },
});
