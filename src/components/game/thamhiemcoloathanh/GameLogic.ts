import { StoryNode, Activity } from "@/types/game";
import { useState, useEffect, useCallback } from "react";
import { useGameEngine } from "@/hooks/useGameEngine";
import { toast } from "@/hooks/use-toast";

export const useGameLogic = (story: { nodes: StoryNode[] }) => {
  const { progress, recordAnswer, completeNode, resetProgress, selectNode } =
    useGameEngine();

  const [gamePhase, setGamePhase] = useState<
    "level-selection" | "cutscene" | "questions"
  >("level-selection");

  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);

  const [timeLeft, setTimeLeft] = useState(20);

  // Index câu hỏi hiện tại (local, không đụng progress)
  const [questionIndex, setQuestionIndex] = useState(0);

  const currentNode: StoryNode | undefined =
    story.nodes[progress.currentNodeIndex];

  // ------------------------------------------
  // 💥 RANDOM CÂU HỎI KHI SAI HOẶC HẾT GIỜ
  // ------------------------------------------
  const randomQuestion = useCallback(() => {
    if (!currentActivity) return;

    const total = currentActivity.questions.length;
    const randomIndex = Math.floor(Math.random() * total);

    setQuestionIndex(randomIndex);
    setTimeLeft(20);
  }, [currentActivity]);

  // ------------------------------------------
  // ⏳ TIMER 20 GIÂY
  // ------------------------------------------
  useEffect(() => {
    if (gamePhase !== "questions") return;

    if (timeLeft <= 0) {
      toast({
        title: "Hết giờ! ⏰",
        description: "Tự động đổi sang câu khác.",
      });

      randomQuestion();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [gamePhase, timeLeft, randomQuestion]);

  // ------------------------------------------
  // ⭐ CHỌN LEVEL
  // ------------------------------------------
  const handleSelectLevel = (index: number) => {
    selectNode(index);
    setGamePhase("cutscene");

    const node = story.nodes[index];
    setCurrentActivity(node.activity || null);

    setQuestionIndex(0);
    setTimeLeft(20);
  };

  // ------------------------------------------
  // 🎬 HẾT CUTSCENE → VÀO CÂU HỎI
  // ------------------------------------------
  const handleCutsceneComplete = () => {
    setGamePhase("questions");
    setTimeLeft(20);
  };

  // ------------------------------------------
  // 🧠 XỬ LÝ TRẢ LỜI & CHUYỂN CÂU
  // ------------------------------------------
  const handleAnswer = (isCorrect: boolean) => {
    if (!currentActivity) return;

    const xp = currentActivity.xpReward ?? 10;
    recordAnswer(isCorrect, xp);

    // ❌ SAI → RANDOM CÂU KHÁC
    if (!isCorrect) {
      toast({
        title: "Sai rồi! ❌",
        description: "Đổi câu khác nhé.",
      });

      randomQuestion();
      return;
    }

    // ✔ ĐÚNG
    toast({
      title: "Chính xác! 🎉",
      description: `+${xp} XP`,
    });

    // CÒN CÂU → LẤY CÂU TIẾP
    if (questionIndex + 1 < currentActivity.questions.length) {
      setQuestionIndex((prev) => prev + 1);
      setTimeLeft(20);
      return;
    }

    // ------------------------------------------
    // 🎉 HOÀN THÀNH ẢI → VỀ TRANG CHỦ
    // ------------------------------------------
    completeNode(currentNode?.id || "");

    toast({
      title: "Bạn đã hoàn thành ải! 🏆",
      description: "Đang quay về trang chủ...",
    });

    resetProgress();
    setGamePhase("level-selection");
  };

  // ------------------------------------------
  // EXPORT CHO COMPONENT DÙNG
  // ------------------------------------------
  return {
    gamePhase,
    currentNode,
    currentActivity,
    questionIndex,
    timeLeft,

    handleSelectLevel,
    handleCutsceneComplete,
    handleAnswer,
  };
};
