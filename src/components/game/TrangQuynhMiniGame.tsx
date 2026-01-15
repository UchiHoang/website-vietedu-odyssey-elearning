import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CutscenePlayer } from "./CutscenePlayer";
import { QuestionCard } from "./QuestionCard";
import { GameHud } from "./GameHud";
import { BadgeModal } from "./BadgeModal";
import { LevelSelection } from "./LevelSelection";
import { StoryIntro } from "./StoryIntro";
import { findActivityByRef as findActivityByRefLegacy, loadStory as loadStoryLegacy } from "@/utils/storyLoader";
import { useGameProgress, type CourseState, type GlobalState } from "@/hooks/useGameProgress";
import { ArrowLeft, RotateCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";

type GamePhase = "prologue" | "level-selection" | "cutscene" | "questions" | "complete";

type StoryFrame = {
  speaker?: string;
  text?: string;
  [key: string]: unknown;
  sprite?: string;
};

type SimpleQuestion = {
  id?: string;
  prompt?: string;
  question?: string;
  choices?: string[];
  options?: string[]; // Legacy format (grade2)
  answer?: string;
  correctAnswer?: number;
  explanation?: string;
  type?: string;
  // Special game types
  pairs?: Array<{ left: string; right: string; leftImage?: string; rightImage?: string }>;
  dragItems?: Array<{ id: string; content: string; image?: string; correctSlot: string }>;
  dropSlots?: Array<{ id: string; label: string; image?: string }>;
  blanks?: Array<{ position: number; answer: string; placeholder?: string }>;
  countingItems?: Array<{ image: string; count: number }>;
  countingAnswer?: number;
  [key: string]: unknown; // Allow other fields
};

type SimpleActivity = {
  id: string;
  xpReward?: number;
  timerSec?: number;
  duration?: number;
  questions: SimpleQuestion[];
};

type SimpleStory = {
  meta?: { title?: string; description?: string };
  prologue?: StoryFrame[];
  nodes: Array<{
    id: string;
    title: string;
    badgeOnComplete?: string | null;
    activityRef: string;
    cutscene?: StoryFrame[];
    assets?: Record<string, unknown>;
  }>;
  activities?: SimpleActivity[];
};

type ThemeConfig = {
  primary?: string;
  secondary?: string;
  bg?: string;
  bannerUrl?: string;
  fontClass?: string;
};

interface TrangQuynhMiniGameProps {
  grade?: string;
  courseId?: string;
  storyLoader?: () => SimpleStory;
  theme?: ThemeConfig;
}

export const TrangQuynhMiniGame = ({ grade, courseId = "grade2-trangquynh", storyLoader, theme }: TrangQuynhMiniGameProps) => {
  // ========== HOOKS - Phải gọi theo thứ tự cố định ==========
  
  // 1. useNavigate, useParams (React Router hooks)
  const navigate = useNavigate();
  const urlParams = useParams();
  
  // 2. useState hooks (tất cả state phải gọi trước)
  const [lastCourseState, setLastCourseState] = useState<CourseState | null>(null);
  const [lastGlobals, setLastGlobals] = useState<GlobalState | null>(null);
  const [gamePhase, setGamePhase] = useState<GamePhase>("prologue");
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentActivity, setCurrentActivity] = useState<SimpleActivity | null>(null);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [levelPerformance, setLevelPerformance] = useState<"excellent" | "good" | "retry">("good");
  const [earnedXpThisLevel, setEarnedXpThisLevel] = useState(0);
  const [completedBadgeId, setCompletedBadgeId] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [correctThisLevel, setCorrectThisLevel] = useState(0);
  const [incorrectThisLevel, setIncorrectThisLevel] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 3. useRef
  const levelStartTime = useRef<number>(Date.now());
  
  // 4. Custom hooks (useGameProgress)
  const { 
    globals,
    course,
    isLoading,
    error: queryError,
    completeStage: completeStageMutation,
    refetch,
    updateCurrentNode: updateCurrentNodeMutation
  } = useGameProgress(courseId || "grade2-trangquynh");

  // 5. Tính toán derived values (sau khi có hooks)
  const gradeFromUrl = urlParams.grade?.replace("grade", "");
  const finalGrade = grade || gradeFromUrl || "2";
  console.log("Final grade:", finalGrade); // Debug log

  // 6. useMemo (sau khi có data từ hooks)
  const rootStyle = theme?.bg ? { background: theme.bg } : undefined;
  const bannerStyle = theme?.bannerUrl ? { backgroundImage: `url(${theme.bannerUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : {};
  const story = useMemo<SimpleStory>(() => {
    if (storyLoader) return storyLoader();
    return loadStoryLegacy();
  }, [storyLoader]);
  const prologueSlides = useMemo(() => (story.prologue ?? []) as StoryFrame[], [story.prologue]);

  // Safe progress với null checks để tránh crash
  // Ưu tiên lastGlobals (từ mutation result) để XP được cập nhật ngay lập tức
  const effectiveGlobals = lastGlobals ?? globals;
  const progress = useMemo(() => {
    try {
      return {
        // XP là global (từ game_globals.total_xp), không phải course-specific
        // vì XP được tích lũy từ tất cả các course/game
        // Ưu tiên lastGlobals để XP được cập nhật ngay sau khi complete stage
        xp: (effectiveGlobals?.total_xp ?? 0),
        level: (effectiveGlobals?.global_level ?? 1),
        coins: (effectiveGlobals?.coins ?? 0),
        currentNode: (lastCourseState?.current_node ?? course?.current_node ?? 0),
        completedNodes: (lastCourseState?.completed_nodes ?? course?.completed_nodes ?? []) as string[],
        earnedBadges: (effectiveGlobals?.unlocked_badges ?? []) as string[],
        // Course-specific: total_stars để hiển thị sao, total_xp để hiển thị XP của course này
        totalStars: (lastCourseState?.total_stars ?? course?.total_stars ?? 0),
        courseXp: (lastCourseState?.total_xp ?? (course as any)?.total_xp ?? 0), // XP riêng của course này
        points: 0, // Legacy field
        streak: { current: 0, longest: 0, totalDays: 0 }, // Legacy field
        leaderboardPoints: 0, // Legacy field
        leaderboardRank: null, // Legacy field
      };
    } catch (error) {
      console.error("Error building progress object:", error);
      // Fallback to default để tránh crash
      return {
        xp: 0,
        level: 1,
        coins: 0,
        currentNode: 0,
        completedNodes: [],
        earnedBadges: [],
        totalStars: 0,
        courseXp: 0,
        points: 0,
        streak: { current: 0, longest: 0, totalDays: 0 },
        leaderboardPoints: 0,
        leaderboardRank: null,
      };
    }
  }, [lastCourseState, course, effectiveGlobals]);
  
  const currentNode = story.nodes[currentNodeIndex];
  const isGameComplete = currentNodeIndex >= story.nodes.length;

  const normalizeQuestion = useCallback(
    (q: SimpleQuestion, idx: number) => {
      // Support both formats:
      // New format: { prompt, choices, answer }
      // Legacy format (grade2): { question, options, correctAnswer }
      
      const questionText = q.question ?? q.prompt ?? "";
      const questionType = q.type || "multiple-choice";
      
      // For legacy format (grade2) - if it has options and correctAnswer as number, preserve as-is
      if (q.options && Array.isArray(q.options) && q.options.length > 0 && typeof q.correctAnswer === 'number') {
        // Legacy format - preserve all fields
        const normalized: Record<string, unknown> = {
          id: q.id ?? `${currentNode?.id || "q"}-${idx}`,
          question: questionText || q.question || "",
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation ?? "Hãy thử lại lần nữa nhé!",
          type: questionType as "multiple-choice" | "matching-pairs" | "drag-drop" | "fill-blank" | "counting",
        };
        
        // Preserve all other fields from original question
        Object.keys(q).forEach(key => {
          if (!normalized[key]) {
            normalized[key] = (q as Record<string, unknown>)[key];
          }
        });
        
        return normalized as SimpleQuestion & Record<string, unknown>;
      }
      
      // New format processing
      const choices = q.choices ?? q.options ?? [];
      
      // Determine correctAnswer index for multiple-choice
      let correctAnswerIndex = 0;
      if (typeof q.correctAnswer === 'number') {
        correctAnswerIndex = q.correctAnswer;
      } else if (q.answer && choices.length > 0) {
        correctAnswerIndex = choices.findIndex(c => c === q.answer);
        if (correctAnswerIndex === -1) correctAnswerIndex = 0;
      }
      
      // Base question object with proper typing
      const normalized: Record<string, unknown> = {
        id: q.id ?? `${currentNode?.id || "q"}-${idx}`,
        prompt: q.prompt ?? questionText,
        question: questionText,
        options: choices, // QuestionCard expects 'options'
        choices: choices,
        answer: q.answer ?? (choices[correctAnswerIndex] || ""),
        correctAnswer: correctAnswerIndex,
        explanation: q.explanation ?? "Hãy thử lại lần nữa nhé!",
        type: questionType as "multiple-choice" | "matching-pairs" | "drag-drop" | "fill-blank" | "counting",
      };
      
      // Preserve special fields for different game types
      if (questionType === "matching-pairs" && q.pairs) {
        normalized.pairs = q.pairs;
      }
      
      if (questionType === "drag-drop" && q.dragItems && q.dropSlots) {
        normalized.dragItems = q.dragItems;
        normalized.dropSlots = q.dropSlots;
      }
      
      if (questionType === "fill-blank" && q.blanks) {
        normalized.blanks = q.blanks;
      }
      
      if (questionType === "counting" && q.countingItems && q.countingAnswer !== undefined) {
        normalized.countingItems = q.countingItems;
        normalized.countingAnswer = q.countingAnswer;
      }
      
      return normalized as SimpleQuestion & Record<string, unknown>;
    },
    [currentNode?.id]
  );

  const getActivity = useCallback((activityRef?: string | null) => {
    if (!activityRef) {
      console.warn("No activityRef provided");
      return null;
    }
    
    if (story.activities && story.activities.length > 0) {
      const found = story.activities.find((a) => a.id === activityRef);
      if (found) {
        console.log("Activity found:", activityRef, "Questions:", found.questions?.length);
        return found;
      }
      console.warn("Activity not found in story.activities:", activityRef, "Available:", story.activities.map(a => a.id));
    }
    
    console.log("Trying legacy loader for:", activityRef);
    return findActivityByRefLegacy(activityRef);
  }, [story.activities]);

  // Initialize from Supabase progress (ưu tiên state trả về từ mutation)
  useEffect(() => {
    if (isLoading) return;
    const serverNode = lastCourseState?.current_node ?? course?.current_node;
    if (serverNode !== undefined && serverNode >= 0) {
      setCurrentNodeIndex(serverNode);
    }
  }, [isLoading, course?.current_node, lastCourseState?.current_node]);

  // Sync globals từ query (khi refetch hoặc load lần đầu)
  // Chỉ sync khi không có lastGlobals hoặc khi query trả về giá trị mới hơn
  useEffect(() => {
    if (!isLoading && globals && (!lastGlobals || globals.total_xp >= lastGlobals.total_xp)) {
      setLastGlobals(globals);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, globals?.total_xp, globals?.global_level]);

  // Memoize activity loading to prevent repeated lookups
  const loadedActivity = useMemo(() => {
    if (currentNode?.activityRef) {
      return getActivity(currentNode.activityRef);
    }
    return null;
}, [currentNode?.activityRef, getActivity]);

  useEffect(() => {
    if (currentNode && gamePhase === "cutscene") {
      setCurrentActivity(loadedActivity as SimpleActivity);
      levelStartTime.current = Date.now();
    }
  }, [currentNode, gamePhase, loadedActivity]);

  // Ensure currentActivity is preserved when moving to next question
  useEffect(() => {
    if (gamePhase === "questions" && currentNode && !currentActivity) {
      console.warn("Activity lost, reloading...");
      const activity = getActivity(currentNode.activityRef);
      if (activity) {
        setCurrentActivity(activity as SimpleActivity);
      }
    }
  }, [gamePhase, currentNode, currentActivity, getActivity]);

  // Error handling - hiển thị warning nhưng vẫn cho chơi (không block UI)
  useEffect(() => {
    if (queryError) {
      console.warn("Query error (continuing with default state):", queryError);
      const errorMessage = queryError instanceof Error ? queryError.message : String(queryError);
      if (errorMessage.includes("function") || errorMessage.includes("does not exist")) {
        toast.error("Lỗi: RPC function chưa được tạo. Vui lòng chạy SQL migration trước!");
      } else {
        toast.error("Không thể tải tiến độ từ server. Bạn vẫn có thể chơi nhưng tiến độ có thể không được lưu.");
      }
    }
  }, [queryError]);

  const handlePrologueComplete = () => {
    setGamePhase("level-selection");
  };

  const handleSelectLevel = async (nodeIndex: number) => {
    console.log("Selected level:", nodeIndex, "Node:", story.nodes[nodeIndex]);
    setCurrentNodeIndex(nodeIndex);
    setCurrentQuestionIndex(0);
    setCorrectThisLevel(0);
    setIncorrectThisLevel(0);
    setEarnedXpThisLevel(0);
    levelStartTime.current = Date.now();
    
    // Pre-load activity
    const node = story.nodes[nodeIndex];
    if (node?.activityRef) {
      const activity = getActivity(node.activityRef);
      if (activity) {
        console.log("Pre-loaded activity:", activity.id, "Questions:", activity.questions?.length);
        setCurrentActivity(activity as SimpleActivity);
      }
    }
    
    // Update current node (local state only, will be saved when complete stage)
    setGamePhase("cutscene");
  };

  const handleTimeUp = useCallback(() => {
    toast.error("Hết giờ! Thời gian đã hết, hãy thử lại nhé!");
    setLevelPerformance("retry");
    setShowBadgeModal(true);
  }, []);

  const handleCutsceneComplete = () => {
    const activity = getActivity(currentNode?.activityRef || "");
    setCurrentActivity(activity as SimpleActivity);
    setTimerSeconds(activity?.timerSec || activity?.duration || 120);
    setGamePhase("questions");
  };

  const handleCutsceneSkip = () => {
    const activity = getActivity(currentNode?.activityRef || "");
    setCurrentActivity(activity as SimpleActivity);
    setTimerSeconds(activity?.timerSec || activity?.duration || 120);
    setGamePhase("questions");
  };

  const handleAnswer = async (isCorrect: boolean) => {
    if (isSubmitting) return;
    
    const xpReward = currentActivity?.xpReward || 10;
    const totalQuestions = currentActivity?.questions.length || 1;
    
    // Tính toán chính xác số câu đúng/sai sau khi trả lời câu này
    let newCorrect: number;
    let newIncorrect: number;
    
    if (isCorrect) {
      newCorrect = correctThisLevel + 1;
      newIncorrect = incorrectThisLevel;
      setEarnedXpThisLevel(prev => prev + xpReward);
      setCorrectThisLevel(newCorrect);
      toast.success(`Chính xác! +${xpReward} XP`);
    } else {
      newCorrect = correctThisLevel;
      newIncorrect = incorrectThisLevel + 1;
      setIncorrectThisLevel(newIncorrect);
    }

    // Kiểm tra xem đã hoàn thành tất cả câu hỏi chưa
    const isLastQuestion = currentQuestionIndex + 1 >= totalQuestions;
    
    if (isLastQuestion) {
      // Level complete - submit to backend
      setIsSubmitting(true);
      
      try {
      const timeSpent = Math.floor((Date.now() - levelStartTime.current) / 1000);
      const score = newCorrect * xpReward;
      const maxScore = totalQuestions * xpReward;
        const accuracy = (newCorrect / totalQuestions) * 100;
        
        // Tính số sao (0-3)
        const stars = Math.floor((newCorrect / totalQuestions) * 3);
        
        // Tính XP reward dựa trên số câu đúng
        const calculatedXpReward = newCorrect * xpReward;
        
        // Gọi RPC mới
        const result = await completeStageMutation.mutateAsync({
          nodeIndex: currentNodeIndex,
          score: score,
          stars: stars,
          xpReward: calculatedXpReward,
          gameSpecificData: {
            correct: newCorrect,
            incorrect: newIncorrect,
            accuracy: accuracy,
            timeSpent: timeSpent,
            nodeId: currentNode?.id || `stage-${currentNodeIndex}`,
          }
        });
        
        if (result?.success) {
        let performance: "excellent" | "good" | "retry";
          if (accuracy >= 90) {
          performance = "excellent";
          } else if (accuracy >= 60) {
          performance = "good";
        } else {
          performance = "retry";
        }
        
        setLevelPerformance(performance);
          
          // Lưu course state và globals từ server để dùng ngay (tránh chờ refetch)
          if ((result as any).course) {
            setLastCourseState((result as any).course as CourseState);
          }
          
          // Lưu globals từ server để XP được cập nhật ngay lập tức
          if ((result as any).globals) {
            const resultGlobals = (result as any).globals;
            setLastGlobals({
              user_id: globals?.user_id || "",
              total_xp: resultGlobals.total_xp || 0,
              global_level: resultGlobals.global_level || 1,
              coins: resultGlobals.coins || 0,
              avatar_config: globals?.avatar_config || {},
              unlocked_badges: globals?.unlocked_badges || [],
              created_at: globals?.created_at || new Date().toISOString(),
              updated_at: globals?.updated_at || new Date().toISOString(),
            } as GlobalState);
          }

          // Cập nhật earnedXpThisLevel để hiển thị trong modal
          setEarnedXpThisLevel(calculatedXpReward);
          
          // Award badge if passed (TODO: Implement unlock badge RPC later)
        if (performance !== "retry" && currentNode?.badgeOnComplete) {
            setCompletedBadgeId(currentNode.badgeOnComplete);
        } else {
          setCompletedBadgeId(null);
        }
        
          // Set submitting false TRƯỚC khi show modal để không block UI
          setIsSubmitting(false);
          
          console.log("Stage completed successfully", {
            performance,
            earnedXp: calculatedXpReward,
            badgeId: currentNode?.badgeOnComplete,
          });
          
          // Show badge modal
        setShowBadgeModal(true);
          
          // Refresh progress in background (không await để không block UI)
          refetch().catch(err => {
            console.error("Error refetching progress:", err);
          });
      } else {
          setIsSubmitting(false);
          toast.error("Không thể lưu kết quả (chưa ghi vào tài khoản). Vui lòng thử lại.");
        }
      } catch (error) {
        console.error('Error completing stage:', error);
        setIsSubmitting(false);
        toast.error("Đã xảy ra lỗi khi lưu kết quả. Vui lòng thử lại.");
      }
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleBadgeModalContinue = async () => {
    console.log("BadgeModal Continue clicked", {
      currentNodeIndex,
      totalNodes: story.nodes.length,
      levelPerformance,
      serverNode: lastCourseState?.current_node,
      completedNodes: lastCourseState?.completed_nodes
    });
    
    setShowBadgeModal(false);
    setEarnedXpThisLevel(0);
    setCurrentQuestionIndex(0);
    setCorrectThisLevel(0);
    setIncorrectThisLevel(0);
    
    // Ưu tiên current_node từ server (lastCourseState), fallback +1
    const nextIndexFromServer = lastCourseState?.current_node ?? currentNodeIndex + 1;
    const nextIndex = levelPerformance !== "retry" ? nextIndexFromServer : currentNodeIndex;

    if (nextIndex >= story.nodes.length) {
      console.log("Game complete, moving to complete phase");
      setGamePhase("complete");
    } else if (levelPerformance !== "retry") {
      console.log("Moving to next node:", nextIndex);
      setCurrentNodeIndex(nextIndex);
      setGamePhase("level-selection");
    } else {
      // Retry - stay on questions
      console.log("Retry - staying on questions");
      levelStartTime.current = Date.now();
      setGamePhase("questions");
    }
  };

  const handleRetry = () => {
    setShowBadgeModal(false);
    setEarnedXpThisLevel(0);
    setCurrentQuestionIndex(0);
    setCorrectThisLevel(0);
    setIncorrectThisLevel(0);
    levelStartTime.current = Date.now();
    setGamePhase("cutscene");
  };

  const handleExit = () => {
    navigate("/");
  };

  const handleRestart = async () => {
    // TODO: Implement reset course progress RPC if needed
    // For now, just reset local state
    setCurrentNodeIndex(0);
    setCurrentQuestionIndex(0);
    setGamePhase("level-selection");
    setEarnedXpThisLevel(0);
    await refetch();
  };

  const handleBackToLevelSelection = () => {
    setGamePhase("level-selection");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" style={rootStyle}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Đang tải tiến độ...</p>
          {queryError && (
            <p className="text-sm text-orange-500">Lưu ý: Không thể tải tiến độ từ server</p>
          )}
        </div>
      </div>
    );
  }

  // Prologue Phase
  if (gamePhase === "prologue") {
    return <StoryIntro prologue={prologueSlides as unknown as []} onComplete={handlePrologueComplete} />;
  }

  // Level Selection Phase - use progress from Supabase
  if (gamePhase === "level-selection") {
    // Convert Supabase progress to format expected by LevelSelection
    // Hiển thị course XP (XP riêng của course này) trong LevelSelection, không phải global XP
    const gameEngineProgress = {
      currentNodeIndex,
      completedNodes: progress.completedNodes,
      totalXp: progress.courseXp, // Dùng course XP (riêng của course này) thay vì global XP
      earnedBadges: progress.earnedBadges,
      currentQuestionIndex: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
    };

     return (
      <div className="min-h-screen" style={rootStyle}>
        <div className="fixed top-24 right-6 z-50">
          <Button 
            onClick={handleExit} 
            size="sm"
            variant="outline"
            className="gap-2 bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200 backdrop-blur-sm shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay về
          </Button>
        </div>
        <LevelSelection
          title={story.meta?.title}
          description={story.meta?.description}
          nodes={story.nodes as unknown as []}
          progress={gameEngineProgress}
          onSelectLevel={handleSelectLevel}
        />
      </div>
    );
  }

  // Game Complete Phase
  if (gamePhase === "complete" || isGameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 flex items-center justify-center p-4" style={rootStyle}>
        <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary">
              🎉 Chúc mừng!
            </h1>
             <p className="text-xl text-muted-foreground">
              {finalGrade === "5"
                ? "Bạn đã hoàn thành bảo vệ đất nước cùng Trạng Nguyên!"
                : finalGrade === "1"
                ? "Bạn đã hoàn thành cuộc đua cùng 12 con giáp!"
                : "Bạn đã hoàn thành hành trình đếm bánh chưng cùng chú Cuội!"}
            </p>
          </div>

          <div className="bg-card rounded-xl p-8 shadow-lg space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-primary/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-primary">{progress.xp}</div>
                <div className="text-sm text-muted-foreground">Tổng XP</div>
              </div>
              <div className="bg-primary/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-primary">{progress.level}</div>
                <div className="text-sm text-muted-foreground">Cấp độ</div>
              </div>
              <div className="bg-primary/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-primary">{progress.earnedBadges.length}</div>
                <div className="text-sm text-muted-foreground">Huy hiệu</div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={handleRestart} variant="outline" className="flex-1 gap-2">
                <RotateCcw className="w-4 h-4" />
                Chơi lại
              </Button>
              <Button onClick={handleExit} className="flex-1 gap-2">
                <ArrowLeft className="w-4 h-4" />
                Quay về
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Cutscene Phase
  if (gamePhase === "cutscene" && currentNode) {
    const enhancedFrames = currentNode.cutscene?.map((frame: StoryFrame, idx) => {
      let sprite = undefined;
      
      if (frame.sprite) {
        sprite = frame.sprite;
      }
      else if (frame.speaker === "Trạng Quỳnh" || frame.speaker.includes("Quỳnh")) {
        const isExcited = frame.text.includes("!") || frame.text.includes("thích");
        sprite = isExcited 
          ? (currentNode.assets?.sprite_main_cheer || "assets/user/trang_cheer.png")
          : (currentNode.assets?.sprite_main_idle || "assets/user/trang_idle.png");
      } else if (frame.speaker !== "Người kể chuyện") {
        sprite = currentNode.assets?.sprite_main_idle || "assets/user/trang_portrait.png";
      }
      
      return {
        id: typeof frame.id === "string" ? frame.id : `${currentNode.id}-frame-${idx}`,
        ...frame,
        speaker: frame.speaker ?? "",
        text: frame.text ?? "",
        sprite,
        bg: typeof currentNode.assets?.bg === "string" ? currentNode.assets.bg : undefined
      };
    }) || [];

    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 p-4" style={rootStyle}>
        <div className="max-w-6xl mx-auto py-8">
          <div className="flex gap-2 mb-4">
            <Button
              onClick={handleBackToLevelSelection}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              ← Chọn màn
            </Button>
            <Button
              onClick={handleExit}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay về
            </Button>
          </div>
          
          <CutscenePlayer
            frames={enhancedFrames}
            onComplete={handleCutsceneComplete}
            onSkip={handleCutsceneSkip}
          />
        </div>
      </div>
    );
  }

  // Questions Phase
  if (gamePhase === "questions" && currentNode) {
    // Ensure activity is loaded
    if (!currentActivity) {
      console.warn("Activity not loaded, loading now...");
      const activity = getActivity(currentNode.activityRef);
      if (activity) {
        setCurrentActivity(activity as SimpleActivity);
      }
      return (
        <div className="min-h-screen flex items-center justify-center bg-background" style={rootStyle}>
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Đang tải câu hỏi...</p>
          </div>
        </div>
      );
    }
    
    // Nếu đang show badge modal, vẫn render questions phase nhưng modal sẽ overlay
    // Điều này đảm bảo không bị màn hình trắng
    
    const currentQuestionRaw = currentActivity.questions?.[currentQuestionIndex];
    
    if (!currentQuestionRaw) {
      console.error("No question found at index:", currentQuestionIndex);
      return (
        <div className="min-h-screen flex items-center justify-center bg-background" style={rootStyle}>
          <div className="flex flex-col items-center gap-4">
            <p className="text-red-500">Không tìm thấy câu hỏi!</p>
            <Button onClick={handleBackToLevelSelection}>Quay về chọn màn</Button>
          </div>
        </div>
      );
    }
    
    const currentQuestion = normalizeQuestion(currentQuestionRaw, currentQuestionIndex) as unknown as { 
      id: string; 
      question: string; 
      options: string[]; 
      correctAnswer: number; 
      type: "multiple-choice" | "matching-pairs" | "drag-drop" | "fill-blank" | "counting"; 
      [key: string]: unknown;
    };
    
    // Check if question is valid - support both legacy and new formats
    const hasOptions = currentQuestion.options && currentQuestion.options.length > 0;
    const hasSpecialType = currentQuestion.type && 
      (currentQuestion.type === "matching-pairs" || 
       currentQuestion.type === "drag-drop" || 
       currentQuestion.type === "fill-blank" || 
       currentQuestion.type === "counting");
    
    if (!currentQuestion || (!hasOptions && !hasSpecialType)) {
      console.error("Invalid question format:", currentQuestion, "Index:", currentQuestionIndex, "Total:", currentActivity.questions.length);
      return (
        <div className="min-h-screen flex items-center justify-center bg-background" style={rootStyle}>
          <div className="flex flex-col items-center gap-4">
            <p className="text-red-500">Lỗi: Không thể tải câu hỏi {currentQuestionIndex + 1}</p>
            <Button onClick={handleBackToLevelSelection}>Quay về chọn màn</Button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-primary/5" style={rootStyle}>
        <GameHud
          levelTitle={currentNode.title}
          totalXp={earnedXpThisLevel}
          maxXp={currentActivity.questions.length * (currentActivity.xpReward || 10)}
          correctCount={correctThisLevel}
          incorrectCount={incorrectThisLevel}
          timerSeconds={timerSeconds}
          onTimeUp={handleTimeUp}
          onBack={handleBackToLevelSelection}
        />
        
        <div className="max-w-7xl mx-auto p-4 md:p-8 pt-4">
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={currentActivity.questions.length}
            onAnswer={handleAnswer}
          />
        </div>

        <BadgeModal
          isOpen={showBadgeModal}
          badgeId={completedBadgeId}
          earnedXp={earnedXpThisLevel}
          performance={levelPerformance}
          onContinue={handleBadgeModalContinue}
          onRetry={levelPerformance === "retry" ? handleRetry : undefined}
        />
        
        {isSubmitting && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-4 bg-card p-8 rounded-lg shadow-lg border">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-lg font-medium">Đang lưu kết quả...</p>
              <p className="text-sm text-muted-foreground">Vui lòng đợi trong giây lát</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={rootStyle}>
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p>Đang tải...</p>
      </div>
    </div>
  );
};
