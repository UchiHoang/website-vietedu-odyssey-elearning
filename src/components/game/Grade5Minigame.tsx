import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CutscenePlayer } from "./CutscenePlayer";
import { QuestionCard } from "./QuestionCard";
import { HudXpBar } from "./HudXpBar";
import { BadgeModal } from "./BadgeModal";
import { LevelSelection } from "./LevelSelection";
import { StoryIntro } from "./StoryIntro";
import { loadGrade5Story, 
  loadGrade5Curriculum, 
  findActivityByRef, 
  getBadgeInfo,
StoryData, Activity, Question } from "@/utils/grade5Loader";
import { useGrade5Engine } from "@/hooks/use5Engine";
import { ArrowLeft, RotateCcw, Home } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type GamePhase = "prologue" | "level-selection" | "cutscene" | "questions" | "complete";

export const Grade5MiniGame = () => {
  const [story, setStory] = useState<StoryData | null>(null);
  
  useEffect(() => {
    loadGrade5Story()
      .then(story => {
        console.log("Loaded Grade 5 story:", story);
        setStory(story);
      })
      .catch(error => {
        console.error("Error loading story:", error);
        toast({
          title: "Lỗi tải dữ liệu",
          description: "Không thể tải câu chuyện. Vui lòng thử lại.",
          variant: "destructive"
        });
      });
  }, []);

  const { progress, recordAnswer, nextQuestion, completeNode, resetProgress, selectNode } = useGrade5Engine('1');
  
  const [gamePhase, setGamePhase] = useState<GamePhase>("prologue");
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [levelPerformance, setLevelPerformance] = useState<"excellent" | "good" | "retry">("good");
  const [earnedXpThisLevel, setEarnedXpThisLevel] = useState(0);
  const [completedBadgeId, setCompletedBadgeId] = useState<string | null>(null);
 
  const isGameComplete = progress.currentNodeIndex >= (story?.nodes?.length ?? 0);
  
  const currentNode = story?.nodes?.[progress.currentNodeIndex];
  // sửa loadCurriculum để chỉ load khi vào cutscene
  useEffect(() => {
  if (story) {
    const currentNode = story.nodes[progress.currentNodeIndex];
    if (currentNode && gamePhase === "cutscene") {
      console.log("🎯 Loading curriculum for node:", currentNode.title);
      console.log("🔗 ActivityRef:", currentNode.activityRef);
      
      loadGrade5Curriculum()
        .then(curriculum => {
          console.log("✅ Curriculum loaded FROM DATABASE");
          console.log("📊 Total chapters:", curriculum.chapters?.length);
          console.log("📚 Chapter 1 lessons:", curriculum.chapters?.[0]?.lessons?.length);
          console.log("❓ Lesson 1 questions:", curriculum.chapters?.[0]?.lessons?.[0]?.questions?.length);
          
          const activity = findActivityByRef(currentNode.activityRef, curriculum);
          console.log("✅ Activity found:", activity?.title);
          console.log("📝 Total questions in activity:", activity?.questions?.length);
          setCurrentActivity(activity);
        })
        .catch(error => {
          console.error("❌ Database load failed, using fallback", error);
          
          // Use fallback curriculum
          const fallbackCurriculum = getFullCurriculum(); // Rename to getFullCurriculum
          console.log("🔄 Using FULL curriculum fallback");
          console.log("📊 Fallback chapters:", fallbackCurriculum.chapters?.length);
          console.log("📚 Fallback lessons:", fallbackCurriculum.chapters?.[0]?.lessons?.length);
          
          const activity = findActivityByRef(currentNode.activityRef, fallbackCurriculum);
          console.log("✅ Fallback activity:", activity?.title);
          console.log("📝 Fallback questions count:", activity?.questions?.length);
          setCurrentActivity(activity);
        });
    }
  }
}, [story, progress.currentNodeIndex, gamePhase]);

// Add this function to Grade5Minigame.tsx
const getFallbackCurriculum = () => {
  return {
    grade: "5",
    chapters: [
      {
        id: "c1",
        title: "Số thập phân",
        description: "Nhận biết và làm quen với số thập phân",
        lessons: [
          {
            id: "l1",
            title: "Nhận biết số thập phân",
            duration: 90,
            questions: [
              {
                id: "q1",
                type: "multiple-choice",
                question: "Số nào là số thập phân?",
                options: ["5", "7/2", "3.5", "2 1/4"],
                correctAnswer: 2,
                explanation: "3.5 là số thập phân với phần nguyên là 3 và phần thập phân là 5."
              },
              {
                id: "q2",
                type: "multiple-choice",
                question: "Chữ số 7 trong số 12.75 có giá trị là:",
                options: ["7 đơn vị", "7 phần mười", "7 phần trăm", "7 phần nghìn"],
                correctAnswer: 1,
                explanation: "Chữ số 7 ở hàng phần mười nên có giá trị là 7 phần mười."
              }
            ]
          },
          {
            id: "l2",
            title: "Cộng trừ số thập phân",
            duration: 90,
            questions: [
              {
                id: "q1",
                type: "multiple-choice",
                question: "3.25 + 1.75 = ?",
                options: ["4.5", "5.0", "4.75", "5.25"],
                correctAnswer: 1,
                explanation: "3.25 + 1.75 = 5.00 = 5.0"
              }
            ]
          },
          {
            id: "l3",
            title: "Nhân chia số thập phân",
            duration: 90,
            questions: [
              {
                id: "q1",
                type: "multiple-choice",
                question: "2.5 × 4 = ?",
                options: ["8.5", "9.0", "10.0", "10.5"],
                correctAnswer: 2,
                explanation: "2.5 × 4 = 10.0"
              }
            ]
          },
          {
            id: "l4",
            title: "Đo lường thực tế",
            duration: 120,
            questions: [
              {
                id: "q1",
                type: "interactive-choice",
                question: "Một bức tường dài 12.5m, cần xây thêm 3.75m nữa. Tổng chiều dài bức tường là:",
                options: ["15.25m", "16.0m", "16.25m", "16.5m"],
                correctAnswer: 2,
                explanation: "12.5 + 3.75 = 16.25m"
              }
            ]
          },
          {
            id: "l5",
            title: "Tổng hợp số thập phân",
            duration: 120,
            questions: [
              {
                id: "q1",
                type: "multiple-choice",
                question: "Tính: 3.5 + 2.25 × 2 = ?",
                options: ["7.75", "8.0", "8.5", "9.0"],
                correctAnswer: 1,
                explanation: "2.25 × 2 = 4.5; 3.5 + 4.5 = 8.0"
              }
            ]
          }
        ]
      }
    ]
  };
};

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-primary/5">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="text-xl text-muted-foreground">Đang tải câu chuyện Trạng Nguyên...</p>
        </div>
      </div>
    );
  }

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
    const xpReward = currentActivity?.xpReward || 15;
    recordAnswer(isCorrect, xpReward);
    
    if (isCorrect) {
      setEarnedXpThisLevel(prev => prev + xpReward);
      toast({
        title: "Chính xác! 🎉",
        description: `+${xpReward} XP`,
      });
    } else {
      toast({
        title: "Chưa chính xác",
        description: "Hãy thử lại nhé!",
        variant: "destructive"
      });
    }

    const totalQuestions = currentActivity?.questions.length || 1;
    
    if (progress.currentQuestionIndex + 1 >= totalQuestions) {
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
      // Stay on questions phase for retry
      selectNode(progress.currentNodeIndex);
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
    window.location.href = "/";
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
    return <StoryIntro prologue={story?.prologue} onComplete={handlePrologueComplete} />;
  }

  // Level Selection Phase
  if (gamePhase === "level-selection") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
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
  // Replace getFallbackCurriculum with this FULL curriculum
const getFullCurriculum = () => {
  return {
    grade: "5",
    chapters: [
      {
        id: "c1",
        title: "Số thập phân",
        description: "Nhận biết và làm quen với số thập phân",
        lessons: [
          {
            id: "l1",
            title: "Nhận biết số thập phân",
            duration: 90,
            questions: [
              {
                id: "q1",
                type: "multiple-choice",
                question: "Số nào là số thập phân?",
                options: ["5", "7/2", "3.5", "2 1/4"],
                correctAnswer: 2,
                explanation: "3.5 là số thập phân với phần nguyên là 3 và phần thập phân là 5."
              },
              {
                id: "q2",
                type: "multiple-choice",
                question: "Chữ số 7 trong số 12.75 có giá trị là:",
                options: ["7 đơn vị", "7 phần mười", "7 phần trăm", "7 phần nghìn"],
                correctAnswer: 1,
                explanation: "Chữ số 7 ở hàng phần mười nên có giá trị là 7 phần mười."
              },
              {
                id: "q3",
                type: "multiple-choice",
                question: "Phân số 3/4 viết dưới dạng số thập phân là:",
                options: ["0.25", "0.5", "0.75", "1.25"],
                correctAnswer: 2,
                explanation: "3/4 = 0.75"
              },
              {
                id: "q4",
                type: "multiple-choice",
                question: "Số thập phân 0.08 đọc là:",
                options: ["Không phẩy tám", "Không phẩy không tám", "Không phẩy tám mươi", "Tám phần trăm"],
                correctAnswer: 1,
                explanation: "0.08 đọc là 'không phẩy không tám' hoặc 'tám phần trăm'."
              },
              {
                id: "q5",
                type: "multiple-choice",
                question: "Số thập phân lớn hơn 2.3 và nhỏ hơn 2.4 là:",
                options: ["2.25", "2.35", "2.45", "2.5"],
                correctAnswer: 1,
                explanation: "2.35 nằm giữa 2.3 và 2.4"
              }
            ]
          },
          {
            id: "l2",
            title: "Cộng trừ số thập phân",
            duration: 90,
            questions: [
              {
                id: "q1",
                type: "multiple-choice",
                question: "3.25 + 1.75 = ?",
                options: ["4.5", "5.0", "4.75", "5.25"],
                correctAnswer: 1,
                explanation: "3.25 + 1.75 = 5.00 = 5.0"
              },
              {
                id: "q2",
                type: "multiple-choice",
                question: "7.8 - 2.45 = ?",
                options: ["5.35", "5.45", "5.25", "5.15"],
                correctAnswer: 0,
                explanation: "7.8 - 2.45 = 5.35"
              },
              {
                id: "q3",
                type: "multiple-choice",
                question: "12.5 + 8.75 = ?",
                options: ["20.25", "21.0", "21.25", "20.75"],
                correctAnswer: 2,
                explanation: "12.5 + 8.75 = 21.25"
              },
              {
                id: "q4",
                type: "multiple-choice",
                question: "15.2 - 6.8 = ?",
                options: ["8.4", "8.6", "9.4", "9.6"],
                correctAnswer: 0,
                explanation: "15.2 - 6.8 = 8.4"
              },
              {
                id: "q5",
                type: "multiple-choice",
                question: "Tính: 4.3 + 2.7 - 1.5 = ?",
                options: ["5.0", "5.5", "6.0", "6.5"],
                correctAnswer: 1,
                explanation: "4.3 + 2.7 = 7.0; 7.0 - 1.5 = 5.5"
              }
            ]
          },
          {
            id: "l3",
            title: "Nhân chia số thập phân",
            duration: 90,
            questions: [
              {
                id: "q1",
                type: "multiple-choice",
                question: "2.5 × 4 = ?",
                options: ["8.5", "9.0", "10.0", "10.5"],
                correctAnswer: 2,
                explanation: "2.5 × 4 = 10.0"
              },
              {
                id: "q2",
                type: "multiple-choice",
                question: "7.2 ÷ 0.8 = ?",
                options: ["8.0", "9.0", "8.5", "9.5"],
                correctAnswer: 1,
                explanation: "7.2 ÷ 0.8 = 9.0"
              },
              {
                id: "q3",
                type: "multiple-choice",
                question: "3.6 × 2.5 = ?",
                options: ["8.0", "8.5", "9.0", "9.5"],
                correctAnswer: 2,
                explanation: "3.6 × 2.5 = 9.0"
              },
              {
                id: "q4",
                type: "multiple-choice",
                question: "12.8 ÷ 3.2 = ?",
                options: ["3.5", "4.0", "4.5", "5.0"],
                correctAnswer: 1,
                explanation: "12.8 ÷ 3.2 = 4.0"
              },
              {
                id: "q5",
                type: "multiple-choice",
                question: "Tính: (4.5 × 2) ÷ 1.5 = ?",
                options: ["5.0", "6.0", "5.5", "6.5"],
                correctAnswer: 1,
                explanation: "4.5 × 2 = 9.0; 9.0 ÷ 1.5 = 6.0"
              }
            ]
          },
          {
            id: "l4",
            title: "Đo lường thực tế",
            duration: 120,
            questions: [
              {
                id: "q1",
                type: "interactive-choice",
                question: "Một bức tường dài 12.5m, cần xây thêm 3.75m nữa. Tổng chiều dài bức tường là:",
                options: ["15.25m", "16.0m", "16.25m", "16.5m"],
                correctAnswer: 2,
                explanation: "12.5 + 3.75 = 16.25m"
              },
              {
                id: "q2",
                type: "interactive-choice",
                question: "Một bao gạo nặng 45.5kg, đã dùng hết 12.75kg. Số gạo còn lại là:",
                options: ["31.75kg", "32.25kg", "32.75kg", "33.25kg"],
                correctAnswer: 2,
                explanation: "45.5 - 12.75 = 32.75kg"
              },
              {
                id: "q3",
                type: "interactive-choice",
                question: "Một mảnh đất hình chữ nhật có chiều dài 15.8m, chiều rộng 12.5m. Diện tích mảnh đất là:",
                options: ["187.5m²", "195.5m²", "197.5m²", "200.5m²"],
                correctAnswer: 2,
                explanation: "15.8 × 12.5 = 197.5m²"
              },
              {
                id: "q4",
                type: "interactive-choice",
                question: "Mỗi viên gạch nặng 2.25kg. 12 viên gạch nặng tổng cộng:",
                options: ["25kg", "26kg", "27kg", "28kg"],
                correctAnswer: 2,
                explanation: "2.25 × 12 = 27kg"
              },
              {
                id: "q5",
                type: "interactive-choice",
                question: "Chu vi một khu đất hình vuông là 45.6m. Độ dài mỗi cạnh là:",
                options: ["10.4m", "11.2m", "11.4m", "12.4m"],
                correctAnswer: 2,
                explanation: "45.6 ÷ 4 = 11.4m"
              }
            ]
          },
          {
            id: "l5",
            title: "Tổng hợp số thập phân",
            duration: 120,
            questions: [
              {
                id: "q1",
                type: "multiple-choice",
                question: "Tính: 3.5 + 2.25 × 2 = ?",
                options: ["7.75", "8.0", "8.5", "9.0"],
                correctAnswer: 1,
                explanation: "2.25 × 2 = 4.5; 3.5 + 4.5 = 8.0"
              },
              {
                id: "q2",
                type: "multiple-choice",
                question: "Một đoạn thành dài 45.8m, cần chia thành 4 phần bằng nhau. Mỗi phần dài:",
                options: ["10.45m", "11.45m", "11.95m", "12.45m"],
                correctAnswer: 1,
                explanation: "45.8 ÷ 4 = 11.45m"
              },
              {
                id: "q3",
                type: "multiple-choice",
                question: "Tính diện tích: 12.5m × 8.4m = ?",
                options: ["100m²", "105m²", "110m²", "115m²"],
                correctAnswer: 1,
                explanation: "12.5 × 8.4 = 105m²"
              },
              {
                id: "q4",
                type: "multiple-choice",
                question: "1250 binh sĩ, mỗi người 2.5kg lương thảo/ngày. Tổng lương thảo/ngày:",
                options: ["3125kg", "3125.5kg", "3126kg", "3127kg"],
                correctAnswer: 0,
                explanation: "1250 × 2.5 = 3125kg"
              },
              {
                id: "q5",
                type: "multiple-choice",
                question: "Tổng kết: (3.75 + 2.25) × 4 ÷ 3 = ?",
                options: ["8.0", "8.5", "9.0", "9.5"],
                correctAnswer: 0,
                explanation: "3.75 + 2.25 = 6.0; 6.0 × 4 = 24.0; 24.0 ÷ 3 = 8.0"
              }
            ]
          }
        ]
      }
    ]
  };
};
  // Game Complete Phase
  if (gamePhase === "complete" || isGameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in">
          <div className="space-y-4">
            <div className="text-6xl mb-4">🏆</div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary">
              Chúc mừng!
            </h1>
            <p className="text-xl text-muted-foreground">
              Bạn đã hoàn thành hành trình Trạng Nguyên lớp 5!
            </p>
            <p className="text-lg text-muted-foreground">
              Bạn đã thành thạo các phép tính với số thập phân!
            </p>
          </div>

          <div className="bg-card rounded-xl p-8 shadow-lg space-y-6 border-2 border-primary/20">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-primary/10 rounded-lg p-6">
                <div className="text-4xl font-bold text-primary mb-2">{progress.totalXp}</div>
                <div className="text-sm text-muted-foreground font-medium">Tổng XP đạt được</div>
              </div>
              <div className="bg-primary/10 rounded-lg p-6">
                <div className="text-4xl font-bold text-primary mb-2">{progress.earnedBadges.length}</div>
                <div className="text-sm text-muted-foreground font-medium">Huy hiệu thu thập</div>
              </div>
            </div>

            <div className="bg-primary/5 rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-2">Thành tích</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{progress.correctAnswers}</div>
                  <div className="text-xs text-muted-foreground">Đúng</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{progress.incorrectAnswers}</div>
                  <div className="text-xs text-muted-foreground">Sai</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round((progress.correctAnswers / (progress.correctAnswers + progress.incorrectAnswers || 1)) * 100)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Chính xác</div>
                </div>
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
    const enhancedFrames = currentNode.cutscene.map((frame: any) => {
      let sprite = undefined;
      
      if (frame.speaker === "Trạng Nguyên" || frame.speaker.includes("Nguyên")) {
        const isExcited = frame.text.includes("!") || frame.text.includes("tuyệt");
        sprite = isExcited 
          ? currentNode.assets?.sprite_main_cheer 
          : currentNode.assets?.sprite_main_idle;
      } else if (frame.speaker === "Narrator" || frame.speaker === "Người kể chuyện") {
        sprite = undefined;
      } else {
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
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Đang tải câu hỏi...</p>
          </div>
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
        
        <div className="max-w-7xl mx-auto p-4 md:p-8 pt-24">
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