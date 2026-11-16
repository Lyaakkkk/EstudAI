import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";
import type {
  StudyChallengeGrade,
  StudyChallengeRequest,
  StudyChallengeSet,
  StudyDifficulty,
  StudyQuiz,
  StudySourceFileMimeType,
  StudySummary,
} from "@workspace/api-client-react";

export type StudyMaterial = {
  id: string;
  title: string;
  sourceType: "texto" | "pdf" | "imagem";
  text?: string;
  file?: {
    name: string;
    mimeType: StudySourceFileMimeType;
    base64: string;
  };
  /** Etiquetas para organizar a biblioteca (sem o @). Materiais antigos não têm. */
  tags?: string[];
  createdAt: string;
};

export type SavedSummary = {
  id: string;
  materialId: string;
  materialTitle: string;
  difficulty: StudyDifficulty;
  data: StudySummary;
  createdAt: string;
};

export type SavedQuiz = {
  id: string;
  materialId: string;
  materialTitle: string;
  difficulty: StudyDifficulty;
  data: StudyQuiz;
  createdAt: string;
};

export type SavedChallengeSet = {
  id: string;
  materialId: string;
  materialTitle: string;
  difficulty: StudyDifficulty;
  challengeType: StudyChallengeRequest["challengeType"];
  data: StudyChallengeSet;
  createdAt: string;
};

export type QuizAttempt = {
  id: string;
  quizId: string;
  quizTitle: string;
  answers: Record<string, string>;
  correct: number;
  total: number;
  topicsToReview: string[];
  completedAt: string;
};

export type ChallengeAttempt = {
  id: string;
  challengeTitle: string;
  answer: string;
  grade: StudyChallengeGrade;
  completedAt: string;
};

export type StudyData = {
  materials: StudyMaterial[];
  summaries: SavedSummary[];
  quizzes: SavedQuiz[];
  challenges: SavedChallengeSet[];
  quizAttempts: QuizAttempt[];
  challengeAttempts: ChallengeAttempt[];
};

type StudyContextValue = {
  state: StudyData;
  setState: Dispatch<SetStateAction<StudyData>>;
  isReady: boolean;
  storageError: string | null;
};

const STORAGE_KEY = "estudai-mobile-v1";
const emptyStudyData: StudyData = {
  materials: [],
  summaries: [],
  quizzes: [],
  challenges: [],
  quizAttempts: [],
  challengeAttempts: [],
};

const StudyContext = createContext<StudyContextValue | null>(null);

function isStudyData(value: unknown): value is StudyData {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return [
    "materials",
    "summaries",
    "quizzes",
    "challenges",
    "quizAttempts",
    "challengeAttempts",
  ].every((key) => Array.isArray(record[key]));
}

export function StudyProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<StudyData>(emptyStudyData);
  const [isReady, setIsReady] = useState(false);
  const [canPersist, setCanPersist] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: unknown = JSON.parse(stored);
          if (!isStudyData(parsed)) {
            throw new Error("Formato local inválido.");
          }
          if (active) setState(parsed);
        }
        if (active) setCanPersist(true);
      } catch {
        if (active) {
          setStorageError(
            "Não foi possível carregar os dados locais. Para evitar substituir seus materiais, o salvamento está pausado.",
          );
        }
      } finally {
        if (active) setIsReady(true);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  const persist = useCallback(async (nextState: StudyData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      setStorageError(null);
    } catch {
      setStorageError(
        "O armazenamento deste dispositivo não conseguiu salvar a alteração. Libere espaço e tente novamente.",
      );
    }
  }, []);

  useEffect(() => {
    if (!isReady || !canPersist) return;
    void persist(state);
  }, [canPersist, isReady, persist, state]);

  const value = useMemo(
    () => ({ state, setState, isReady, storageError }),
    [isReady, state, storageError],
  );

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}

export function useStudy(): StudyContextValue {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error("useStudy precisa estar dentro de StudyProvider.");
  }
  return context;
}
