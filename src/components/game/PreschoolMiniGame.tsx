import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CutscenePlayer } from "./CutscenePlayer";
import { QuestionCard } from "./QuestionCard";
import { HudXpBar } from "./HudXpBar";
import { BadgeModal } from "./BadgeModal";
import { LevelSelection } from "./LevelSelection";
import { StoryIntro } from "./StoryIntro";
import { loadStory, findActivityByRef, Activity, getBadgeInfo} from "@/utils/grade0Loader";
import { useGameEngine } from "@/hooks/useGameEngine";
import { ArrowLeft, RotateCcw, Home } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type GamePhase = "prologue" | "level-selection" | "cutscene" | "questions" | "complete";

export const PreschoolMiniGame = () => {
  const navigate = useNavigate();
  const story = loadStory();
  const { progress, recordAnswer, nextQuestion, completeNode, resetProgress, selectNode } = useGameEngine();
  
  const [gamePhase, setGamePhase] = useState<GamePhase>("prologue");
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [levelPerformance, setLevelPerformance] = useState<"excellent" | "good" | "retry">("good");
  const [earnedXpThisLevel, setEarnedXpThisLevel] = useState(0);
  const [completedBadgeId, setCompletedBadgeId] = useState<string | null>(null);

  const currentNode = story.nodes[progress.currentNodeIndex];
  const isGameComplete = progress.currentNodeIndex >= story.nodes.length;

  useEffect(() => {
    if (currentNode && gamePhase === "cutscene") {
      const activity = findActivityByRef(currentNode.activityRef);
      setCurrentActivity(activity);
    }
  }, [currentNode, gamePhase]);

  const handlePrologueComplete = () => {
    setGamePhase("level-selection");
  };

  const handleSelectLevel = (nodeIndex: number) => {
    selectNode(nodeIndex);
    setGamePhase("cutscene");
  };

  const handleCutsceneComplete = () => {
    setGamePhase("questions");
  };

  const handleCutsceneSkip = () => {
    setGamePhase("questions");
  };

  const handleAnswer = (isCorrect: boolean) => {
    const xpReward = currentActivity?.xpReward || 10;
    recordAnswer(isCorrect, xpReward);
    
    if (isCorrect) {
      setEarnedXpThisLevel(prev => prev + xpReward);
      toast({
        title: "Chính xác! 🎉",
        description: `+${xpReward} XP`,
      });
    }

    const totalQuestions = currentActivity?.questions.length || 1;
    
    if (progress.currentQuestionIndex + 1 >= totalQuestions) {
      // Level complete - evaluate performance
      const correctRate = ((progress.correctAnswers + (isCorrect ? 1 : 0)) / totalQuestions) * 100;
      
      let performance: "excellent" | "good" | "retry";
      if (correctRate >= 90) {
        performance = "excellent";
      } else if (correctRate >= 70) {
        performance = "good";
      } else {
        performance = "retry";
      }
      
      setLevelPerformance(performance);
      setCompletedBadgeId(performance !== "retry" ? currentNode?.badgeOnComplete || "default-badge" : null);
      setShowBadgeModal(true);
    } else {
      nextQuestion();
    }
  };

  const handleBadgeModalContinue = () => {
    setShowBadgeModal(false);
    
    if (levelPerformance !== "retry" && currentNode) {
      completeNode(currentNode.id, completedBadgeId || undefined);
    }
    
    setEarnedXpThisLevel(0);
    
    if (progress.currentNodeIndex + 1 >= story.nodes.length) {
      setGamePhase("complete");
    } else if (levelPerformance !== "retry") {
      setGamePhase("level-selection");
    } else {
      setGamePhase("questions");
    }
  };

  const handleRetry = () => {
    setShowBadgeModal(false);
    setEarnedXpThisLevel(0);
    selectNode(progress.currentNodeIndex);
    setGamePhase("cutscene");
  };

  const handleExit = () => {
    navigate("/");
  };

  const handleRestart = () => {
    resetProgress();
    setGamePhase("level-selection");
    setEarnedXpThisLevel(0);
  };

  const handleBackToLevelSelection = () => {
    setGamePhase("level-selection");
  };

  // Prologue Phase
  if (gamePhase === "prologue") {
    return <StoryIntro prologue={story.prologue} onComplete={handlePrologueComplete} />;
  }

  // Level Selection Phase
  if (gamePhase === "level-selection") {
    return (
      <div className="min-h-screen">
        <div className="fixed top-20 right-8 z-50">
          <Button 
            onClick={handleExit} 
            className="gap-2 shadow-lg hover:shadow-xl transition-all bg-blue-500 hover:bg-blue-600 text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>
        </div>
        <LevelSelection
            title={story.meta.title}
            description={story.meta.description}
            nodes={story.nodes as any}
            progress={progress}
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
              Bạn đã hoàn thành hành trình của Trạng Quỳnh!
            </p>
          </div>

          <div className="bg-card rounded-xl p-8 shadow-lg space-y-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-primary/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-primary">{progress.totalXp}</div>
                <div className="text-sm text-muted-foreground">Tổng XP</div>
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
                <Home className="w-4 h-4" />
                Về trang chủ
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Cutscene Phase
  if (gamePhase === "cutscene" && currentNode) {
    // Enhance cutscene frames with sprites from node assets
    const enhancedFrames = currentNode.cutscene.map((frame: any) => {
      let sprite = undefined;
      
      // Map speaker to appropriate sprite
      if (frame.speaker === "Trạng Quỳnh" || frame.speaker.includes("Quỳnh")) {
        // Use idle or cheer sprite based on text sentiment
        const isExcited = frame.text.includes("!") || frame.text.includes("thích");
        sprite = isExcited 
          ? currentNode.assets?.sprite_main_cheer 
          : currentNode.assets?.sprite_main_idle;
      } else if (frame.speaker === "Narrator" || frame.speaker === "Người kể chuyện") {
        // Narrator doesn't need a sprite
        sprite = undefined;
      } else {
        // Other characters use idle sprite by default
        sprite = currentNode.assets?.sprite_main_idle;
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
              <Home className="w-4 h-4" />
              Thoát
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
    const currentQuestion = currentActivity.questions[progress.currentQuestionIndex];
    
    if (!currentQuestion) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p>Đang tải...</p>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
        <HudXpBar
          totalXp={progress.totalXp}
          currentQuestion={progress.currentQuestionIndex + 1}
          totalQuestions={currentActivity.questions.length}
          levelTitle={currentNode.title}
        />
        
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <div className="flex gap-2 mb-8">
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
              <Home className="w-4 h-4" />
              Thoát
            </Button>
          </div>

          <QuestionCard
            question={currentQuestion}
            questionNumber={progress.currentQuestionIndex + 1}
            totalQuestions={currentActivity.questions.length}
            onAnswer={handleAnswer}
          />
        </div>

        <BadgeModal
          isOpen={showBadgeModal}
          badgeId={completedBadgeId}
          badgeInfo={getBadgeInfo}
          earnedXp={earnedXpThisLevel}
          performance={levelPerformance}
          onContinue={handleBadgeModalContinue}
          onRetry={levelPerformance === "retry" ? handleRetry : undefined}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Đang tải...</p>
    </div>
  );
};
