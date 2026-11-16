import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import {
  applySuggestion,
  parseTags,
  splitFragment,
  suggestTags,
  tagKey,
} from "@/utils/tags";

type Props = {
  value: string;
  onChange: (value: string) => void;
  /** Todas as tags que já existem na biblioteca. */
  suggestions: string[];
  testID?: string;
};

/**
 * Campo de tags: digite @prova @biologia ou toque nas tags que já existem.
 * Enquanto você digita, as tags parecidas aparecem logo abaixo (mesmo sem acento).
 */
export function TagInput({ value, onChange, suggestions, testID }: Props) {
  const colors = useColors();
  const options = suggestTags(value, suggestions);
  const typed = splitFragment(value).fragment;
  const known = new Set(suggestions.map(tagKey));
  const fresh = parseTags(value, suggestions).filter(
    (tag) => !known.has(tagKey(tag)),
  );

  return (
    <View style={styles.wrap}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="@prova @biologia"
        placeholderTextColor={colors.subtle}
        autoCapitalize="none"
        autoCorrect={false}
        testID={testID}
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: colors.input,
            color: colors.foreground,
          },
        ]}
      />
      {options.length ? (
        <View style={styles.block}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>
            {typed ? "Tags parecidas" : "Tags que você já usa — toque para adicionar"}
          </Text>
          <View style={styles.row}>
            {options.map((tag) => (
              <Pressable
                key={tag}
                accessibilityRole="button"
                onPress={() => onChange(applySuggestion(value, tag))}
                testID={`tag-suggestion-${tag}`}
                style={({ pressed }) => [
                  styles.chip,
                  { backgroundColor: colors.accent, opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Text style={[styles.chipText, { color: colors.accentForeground }]}>
                  @{tag}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}
      {fresh.length ? (
        <Text style={[styles.label, { color: colors.mutedForeground }]}>
          {fresh.length > 1 ? "Novas" : "Nova"}:{" "}
          {fresh.map((tag) => `@${tag}`).join(" ")}. Vai aparecer na lista da
          próxima vez.
        </Text>
      ) : null}
      {!options.length && !suggestions.length ? (
        <Text style={[styles.label, { color: colors.mutedForeground }]}>
          Separe com espaço. Ex.: @prova @biologia
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    minHeight: 46,
    paddingHorizontal: 14,
  },
  block: { gap: 6 },
  label: { fontFamily: "DMSans_500Medium", fontSize: 11, lineHeight: 16 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: { borderRadius: 14, paddingHorizontal: 11, paddingVertical: 6 },
  chipText: { fontFamily: "DMSans_600SemiBold", fontSize: 12 },
});
