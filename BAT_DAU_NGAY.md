# 🚀 BẮT ĐẦU NGAY - 3 BƯỚC CHÍNH

## ⚡ BƯỚC 1: Chạy SQL Migration (5 phút)

1. Mở **Supabase Dashboard** → **SQL Editor**
2. Copy file: `supabase/migrations/20251208000000_shared_schema_refactor.sql`
3. Paste và **Run**
4. ✅ Done!

---

## ⚡ BƯỚC 2: Cập nhật Code (10 phút)

### File cần sửa: `src/components/game/TrangQuynhMiniGame.tsx`

**Thay đổi 1: Import**
```typescript
// Tìm dòng này:
import { useSupabaseProgress } from "@/hooks/useSupabaseProgress";

// Thay bằng:
import { useGameProgress } from "@/hooks/useGameProgress";
```

**Thay đổi 2: Hook call**
```typescript
// Tìm dòng này (khoảng dòng 98):
const { progress, isLoading, completeStage, ... } = useSupabaseProgress();

// Thay bằng:
const { globals, course, isLoading, completeStage, refetch } = useGameProgress(courseId || "grade2-trangquynh");

// Thêm mapping:
const progress = {
  xp: globals?.total_xp || 0,
  level: globals?.global_level || 1,
  currentNode: course?.current_node || 0,
  completedNodes: course?.completed_nodes || [],
  earnedBadges: globals?.unlocked_badges || [],
};
```

**Thay đổi 3: completeStage call**
```typescript
// Tìm trong hàm handleAnswer (khoảng dòng 321):
const result = await completeStage(...);

// Thay bằng:
const result = await completeStage.mutateAsync({
  nodeIndex: currentNodeIndex,
  score: score,
  stars: Math.floor((newCorrect / totalQuestions) * 3),
  xpReward: earnedXpThisLevel,
  gameSpecificData: { correct: newCorrect, incorrect: newIncorrect }
});

if (result?.success) {
  await refetch();
}
```

---

## ⚡ BƯỚC 3: Test (2 phút)

1. **Reload app** (F5)
2. **Vào game** `/classroom/trangquynh`
3. **Chơi 1 màn** → Kiểm tra điểm lưu được
4. ✅ Done!

---

## 📚 Chi tiết đầy đủ

Xem file: `HUONG_DAN_TRIEN_KHAI.md` hoặc `CHECKLIST_TRIEN_KHAI.md`

---

## ⚠️ Lưu ý

- **Backup database** trước khi chạy migration
- **Test trên staging** trước khi deploy production
- Nếu lỗi, xem `CHECKLIST_TRIEN_KHAI.md` phần Troubleshooting

