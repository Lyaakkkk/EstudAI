import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { File, Paths } from "expo-file-system";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import type { StudyMaterial } from "@/context/StudyContext";
import { TagInput } from "@/components/TagInput";
import { formatTags, parseTags } from "@/utils/tags";

type Props = {
  material: StudyMaterial | null;
  allTags: string[];
  onClose: () => void;
  onSaveTags: (materialId: string, tags: string[]) => void;
};

type SharingModule = {
  isAvailableAsync: () => Promise<boolean>;
  shareAsync: (uri: string, options?: Record<string, unknown>) => Promise<void>;
};

/** Carrega o expo-sharing só quando precisa. Se o pacote não estiver instalado, o app continua funcionando. */
function loadSharing(): SharingModule | null {
  try {
    // @ts-ignore - pacote opcional
    return require("expo-sharing") as SharingModule;
  } catch {
    return null;
  }
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

export function MaterialViewer({ material, allTags, onClose, onSaveTags }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [tagsText, setTagsText] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const materialId = material?.id;
  useEffect(() => {
    setTagsText(formatTags(material?.tags));
    setSaved(false);
    setNotice("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materialId]);

  const saveTags = () => {
    if (!material) return;
    const tags = parseTags(tagsText, allTags);
    onSaveTags(material.id, tags);
    setTagsText(formatTags(tags));
    setSaved(true);
  };

  const openPdf = async () => {
    if (!material?.file) return;
    setNotice("");
    setBusy(true);
    try {
      if (Platform.OS === "web") {
        const blob = new Blob([base64ToBytes(material.file.base64)], {
          type: "application/pdf",
        });
        window.open(URL.createObjectURL(blob), "_blank");
        return;
      }

      const sharing = loadSharing();
      if (!sharing || !(await sharing.isAvailableAsync())) {
        setNotice(
          "Não foi possível abrir o PDF neste aparelho. Instale o pacote expo-sharing (veja as instruções) ou abra o PDF pelo site.",
        );
        return;
      }

      const file = new File(Paths.cache, `material-${material.id}.pdf`);
      if (file.exists) file.delete();
      file.create();
      file.write(base64ToBytes(material.file.base64));
      await sharing.shareAsync(file.uri, {
        mimeType: "application/pdf",
        UTI: "com.adobe.pdf",
        dialogTitle: material.title,
      });
    } catch {
      setNotice("Não foi possível abrir este PDF. Tente novamente.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      visible={Boolean(material)}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.sheet,
          {
            backgroundColor: colors.background,
            paddingTop: Platform.OS === "android" ? insets.top + 12 : 18,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.flex}>
            <Text numberOfLines={2} style={[styles.title, { color: colors.foreground }]}>
              {material?.title}
            </Text>
            <Text style={[styles.meta, { color: colors.mutedForeground }]}>
              {material?.file?.name ??
                `${(material?.text?.length ?? 0).toLocaleString("pt-BR")} caracteres`}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Fechar"
            onPress={onClose}
            testID="button-close-viewer"
            style={[styles.closeButton, { backgroundColor: colors.secondary }]}
          >
            <Ionicons name="close" size={20} color={colors.primary} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.body,
            { paddingBottom: insets.bottom + 28 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Conteúdo */}
          {material?.sourceType === "texto" ? (
            <View style={[styles.textBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text selectable style={[styles.textContent, { color: colors.foreground }]}>
                {material.text}
              </Text>
            </View>
          ) : null}

          {material?.sourceType === "imagem" && material.file ? (
            <View style={[styles.imageBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Image
                source={{
                  uri: `data:${material.file.mimeType};base64,${material.file.base64}`,
                }}
                contentFit="contain"
                style={styles.image}
                accessibilityLabel={material.title}
              />
            </View>
          ) : null}

          {material?.sourceType === "pdf" ? (
            <View style={[styles.pdfBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.pdfIcon, { backgroundColor: colors.accent }]}>
                <Ionicons name="document-text" size={30} color={colors.accentForeground} />
              </View>
              <Text style={[styles.pdfName, { color: colors.foreground }]} numberOfLines={2}>
                {material.file?.name}
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => void openPdf()}
                disabled={busy}
                testID="button-open-pdf"
                style={({ pressed }) => [
                  styles.primaryButton,
                  { backgroundColor: colors.primary, opacity: busy ? 0.6 : pressed ? 0.85 : 1 },
                ]}
              >
                {busy ? (
                  <ActivityIndicator color={colors.primaryForeground} size="small" />
                ) : (
                  <Ionicons name="open-outline" size={18} color={colors.primaryForeground} />
                )}
                <Text style={[styles.primaryButtonText, { color: colors.primaryForeground }]}>
                  Abrir PDF
                </Text>
              </Pressable>
              {notice ? (
                <Text style={[styles.notice, { color: colors.destructive }]}>{notice}</Text>
              ) : null}
            </View>
          ) : null}

          {/* Tags */}
          <View style={styles.tagsBlock}>
            <Text style={[styles.label, { color: colors.foreground }]}>Tags</Text>
            <TagInput
              value={tagsText}
              onChange={(value) => {
                setTagsText(value);
                setSaved(false);
              }}
              suggestions={allTags}
              testID="input-viewer-tags"
            />
            <Pressable
              accessibilityRole="button"
              onPress={saveTags}
              testID="button-save-tags"
              style={({ pressed }) => [
                styles.saveTags,
                { backgroundColor: colors.secondary, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={[styles.saveTagsText, { color: colors.foreground }]}>
                {saved ? "Tags salvas ✓" : "Salvar tags"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  sheet: { flex: 1, paddingHorizontal: 18 },
  header: { alignItems: "flex-start", flexDirection: "row", gap: 12, marginBottom: 16 },
  title: { fontFamily: "Fraunces_600SemiBold", fontSize: 24, lineHeight: 30 },
  meta: { fontFamily: "DMSans_500Medium", fontSize: 12, marginTop: 3 },
  closeButton: {
    alignItems: "center",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  body: { gap: 20 },
  textBox: { borderRadius: 22, borderWidth: 1, padding: 16 },
  textContent: { fontFamily: "DMSans_400Regular", fontSize: 15, lineHeight: 23 },
  imageBox: { borderRadius: 22, borderWidth: 1, overflow: "hidden", padding: 8 },
  image: { height: 420, width: "100%" },
  pdfBox: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    gap: 14,
    padding: 24,
  },
  pdfIcon: {
    alignItems: "center",
    borderRadius: 32,
    height: 64,
    justifyContent: "center",
    width: 64,
  },
  pdfName: { fontFamily: "DMSans_600SemiBold", fontSize: 14, textAlign: "center" },
  primaryButton: {
    alignItems: "center",
    borderRadius: 18,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 46,
    paddingHorizontal: 22,
  },
  primaryButtonText: { fontFamily: "DMSans_700Bold", fontSize: 14 },
  notice: { fontFamily: "DMSans_500Medium", fontSize: 12, lineHeight: 18, textAlign: "center" },
  tagsBlock: { gap: 8 },
  label: { fontFamily: "DMSans_700Bold", fontSize: 12 },
  tagRow: { alignItems: "center", flexDirection: "row", gap: 8 },
  tagInput: {
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    minHeight: 46,
    paddingHorizontal: 14,
  },
  saveTags: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 16,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 18,
  },
  saveTagsText: { fontFamily: "DMSans_700Bold", fontSize: 13 },
  hint: { fontFamily: "DMSans_400Regular", fontSize: 11 },
});
