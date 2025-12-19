import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CutscenePlayer } from "./CutscenePlayer";
import { QuestionCard } from "./QuestionCard";
import { GameHud } from "./GameHud";
import { BadgeModal } from "./BadgeModal";
import { LevelSelection } from "./LevelSelection";
import { StoryIntro } from "./StoryIntro";
import { loadStory, findActivityByRef, Activity } from "@/utils/storyLoader";
import { useSupabaseProgress } from "@/hooks/useSupabaseProgress";
import { ArrowLeft, RotateCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";

type GamePhase = "prologue" | "level-selection" | "cutscene" | "questions" | "complete";

interface TrangQuynhMiniGameProps {
  grade?: string;
}

export const TrangQuynhMiniGame = ({ grade }: TrangQuynhMiniGameProps) => {
  const navigate = useNavigate();
  const urlParams = useParams();
  // Memoize story to prevent reloading on every render
    // Use the prop if provided, otherwise try to get from URL params
  const gradeFromUrl = urlParams.grade?.replace("grade", "");
  const finalGrade = grade || gradeFromUrl || "2";

  console.log("Final grade:", finalGrade); // Debug log

  const story = useMemo(() => loadStory(), []);
  const { 
    progress, 
    isLoading, 
    completeStage, 
    unlockBadge, 
    updateCurrentNode, 
    resetProgress,
    fetchProgress 
  } = useSupabaseProgress();
  
  const [gamePhase, setGamePhase] = useState<GamePhase>("prologue");
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [levelPerformance, setLevelPerformance] = useState<"excellent" | "good" | "retry">("good");
  const [earnedXpThisLevel, setEarnedXpThisLevel] = useState(0);
  const [completedBadgeId, setCompletedBadgeId] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [correctThisLevel, setCorrectThisLevel] = useState(0);
  const [incorrectThisLevel, setIncorrectThisLevel] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Track time spent on level
  const levelStartTime = useRef<number>(Date.now());

  const currentNode = story.nodes[currentNodeIndex];
  const isGameComplete = currentNodeIndex >= story.nodes.length;

  // Initialize from Supabase progress
  useEffect(() => {
    if (!isLoading && progress.currentNode >= 0) {
      setCurrentNodeIndex(progress.currentNode);
    }
  }, [isLoading, progress.currentNode]);

  // Memoize activity loading to prevent repeated lookups
  const loadedActivity = useMemo(() => {
    if (currentNode?.activityRef) {
      return findActivityByRef(currentNode.activityRef);
    }
    return null;
  }, [currentNode?.activityRef]);

  useEffect(() => {
    if (currentNode && gamePhase === "cutscene") {
      setCurrentActivity(loadedActivity);
      levelStartTime.current = Date.now();
    }
  }, [currentNode, gamePhase, loadedActivity]);

  const handlePrologueComplete = () => {
    setGamePhase("level-selection");
  };

  const handleSelectLevel = async (nodeIndex: number) => {
    setCurrentNodeIndex(nodeIndex);
    setCurrentQuestionIndex(0);
    setCorrectThisLevel(0);
    setIncorrectThisLevel(0);
    setEarnedXpThisLevel(0);
    levelStartTime.current = Date.now();
    await updateCurrentNode(nodeIndex);
    setGamePhase("cutscene");
  };

  const handleTimeUp = useCallback(() => {
    toast.error("Hết giờ! Thời gian đã hết, hãy thử lại nhé!");
    setLevelPerformance("retry");
    setShowBadgeModal(true);
  }, []);

  const handleCutsceneComplete = () => {
    const activity = findActivityByRef(currentNode?.activityRef || "");
    setTimerSeconds(activity?.timerSec || activity?.duration || 120);
    setGamePhase("questions");
  };

  const handleCutsceneSkip = () => {
    const activity = findActivityByRef(currentNode?.activityRef || "");
    setTimerSeconds(activity?.timerSec || activity?.duration || 120);
    setGamePhase("questions");
  };

  const handleAnswer = async (isCorrect: boolean) => {
    if (isSubmitting) return;
    
    const xpReward = currentActivity?.xpReward || 10;
    
    if (isCorrect) {
      setEarnedXpThisLevel(prev => prev + xpReward);
      setCorrectThisLevel(prev => prev + 1);
      toast.success(`Chính xác! +${xpReward} XP`);
    } else {
      setIncorrectThisLevel(prev => prev + 1);
    }

    const totalQuestions = currentActivity?.questions.length || 1;
    const newCorrect = correctThisLevel + (isCorrect ? 1 : 0);
    const newIncorrect = incorrectThisLevel + (isCorrect ? 0 : 1);
    
    if (currentQuestionIndex + 1 >= totalQuestions) {
      // Level complete - submit to backend
      setIsSubmitting(true);
      
      const timeSpent = Math.floor((Date.now() - levelStartTime.current) / 1000);
      const score = newCorrect * xpReward;
      const maxScore = totalQuestions * xpReward;
      
      const result = await completeStage(
        currentNode?.id || `stage-${currentNodeIndex}`,
        'grade2-trangquynh',
        score,
        maxScore,
        newCorrect,
        totalQuestions,
        timeSpent
      );
      
      setIsSubmitting(false);
      
      if (result) {
        let performance: "excellent" | "good" | "retry";
        if (result.accuracy >= 90) {
          performance = "excellent";
        } else if (result.accuracy >= 60) {
          performance = "good";
        } else {
          performance = "retry";
        }
        
        setLevelPerformance(performance);
        setEarnedXpThisLevel(result.xpEarned);
        
        // Award badge if passed
        if (performance !== "retry" && currentNode?.badgeOnComplete) {
          const badgeResult = await unlockBadge(
            currentNode.badgeOnComplete,
            currentNode.title,
            `Hoàn thành: ${currentNode.title}`,
            '🏆'
          );
          setCompletedBadgeId(badgeResult?.success ? currentNode.badgeOnComplete : null);
        } else {
          setCompletedBadgeId(null);
        }
        
        setShowBadgeModal(true);
      } else {
        toast.error("Không thể lưu kết quả. Vui lòng thử lại.");
      }
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleBadgeModalContinue = async () => {
    setShowBadgeModal(false);
    setEarnedXpThisLevel(0);
    setCurrentQuestionIndex(0);
    setCorrectThisLevel(0);
    setIncorrectThisLevel(0);
    
    if (currentNodeIndex + 1 >= story.nodes.length) {
      setGamePhase("complete");
    } else if (levelPerformance !== "retry") {
      const newIndex = currentNodeIndex + 1;
      setCurrentNodeIndex(newIndex);
      await updateCurrentNode(newIndex);
      setGamePhase("level-selection");
    } else {
      // Retry - stay on questions
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
    await resetProgress();
    setCurrentNodeIndex(0);
    setCurrentQuestionIndex(0);
    setGamePhase("level-selection");
    setEarnedXpThisLevel(0);
    await fetchProgress();
  };

  const handleBackToLevelSelection = () => {
    setGamePhase("level-selection");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Đang tải tiến độ...</p>
        </div>
      </div>
    );
  }

  // Prologue Phase
  if (gamePhase === "prologue") {
    return <StoryIntro prologue={story.prologue} onComplete={handlePrologueComplete} />;
  }

  // Level Selection Phase - use progress from Supabase
  if (gamePhase === "level-selection") {
    // Convert Supabase progress to format expected by LevelSelection
    const gameEngineProgress = {
      currentNodeIndex,
      completedNodes: progress.completedNodes,
      totalXp: progress.xp,
      earnedBadges: progress.earnedBadges,
      currentQuestionIndex: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
    };

     return (
      <div className="min-h-screen">
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
          title={story.meta.title}
          description={story.meta.description}
          nodes={story.nodes as any}
          progress={gameEngineProgress}
          onSelectLevel={handleSelectLevel}
        />
      </div>
    );
  }

  // Game Complete Phase
  if (gamePhase === "complete" || isGameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 flex items-center justify-center p-4">
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
    const enhancedFrames = currentNode.cutscene.map((frame: any) => {
      let sprite = undefined;
      
      if (frame.speaker === "Trạng Quỳnh" || frame.speaker.includes("Quỳnh")) {
        const isExcited = frame.text.includes("!") || frame.text.includes("thích");
        sprite = isExcited 
          ? (currentNode.assets?.sprite_main_cheer || "assets/user/trang_cheer.png")
          : (currentNode.assets?.sprite_main_idle || "assets/user/trang_idle.png");
      } else if (frame.speaker !== "Người kể chuyện") {
        sprite = currentNode.assets?.sprite_main_idle || "assets/user/trang_portrait.png";
      }
      
      return {
        ...frame,
        sprite,
        bg: currentNode.assets?.bg
      };
    });

    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 p-4">
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
  if (gamePhase === "questions" && currentNode && currentActivity) {
    const currentQuestion = currentActivity.questions[currentQuestionIndex];
    
    if (!currentQuestion) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Đang tải...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
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
          <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Đang lưu kết quả...</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p>Đang tải...</p>
      </div>
    </div>
  );
};
