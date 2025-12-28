# ✅ CHECKLIST TRIỂN KHAI - Từng bước một

## 📌 BƯỚC 1: CHẠY MIGRATION SQL (5 phút)

### ✅ 1.1. Mở Supabase Dashboard
- [ ] Vào https://supabase.com
- [ ] Login vào account
- [ ] Chọn project của bạn
- [ ] Click **SQL Editor** (menu trái)

### ✅ 1.2. Chạy Migration
- [ ] Mở file: `supabase/migrations/20251208000000_shared_schema_refactor.sql`
- [ ] Copy **TOÀN BỘ** nội dung
- [ ] Paste vào SQL Editor
- [ ] Click nút **Run** (hoặc nhấn Ctrl+Enter)
- [ ] Đợi kết quả: Phải thấy "Success" hoặc "Query executed successfully"

### ✅ 1.3. Verify Tables
Chạy query này để kiểm tra:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('game_globals', 'course_progress', 'level_history');
```
**Kết quả:** Phải thấy 3 bảng

### ✅ 1.4. Verify Functions
Chạy query này:
```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('complete_stage', 'get_full_game_state');
```
**Kết quả:** Phải thấy 2 functions

---

## 📌 BƯỚC 2: KIỂM TRA HOOK MỚI (2 phút)

### ✅ 2.1. File đã được tạo
- [ ] Mở file: `src/hooks/useGameProgress.ts`
- [ ] Kiểm tra file có nội dung (không rỗng)
- [ ] Kiểm tra có export `useGameProgress`

### ✅ 2.2. Dependencies
- [ ] Mở terminal: `npm list @tanstack/react-query`
- [ ] Nếu không có, chạy: `npm install @tanstack/react-query`

---

## 📌 BƯỚC 3: CẬP NHẬT TRANGQUYNMINIGAME (10 phút)

### ✅ 3.1. Backup file cũ
- [ ] Copy file: `src/components/game/TrangQuynhMiniGame.tsx`
- [ ] Đổi tên thành: `TrangQuynhMiniGame.tsx.backup`

### ✅ 3.2. Thay đổi import
Tìm dòng:
```typescript
import { useSupabaseProgress } from "@/hooks/useSupabaseProgress";
```

Thay bằng:
```typescript
import { useGameProgress } from "@/hooks/useGameProgress";
```

### ✅ 3.3. Cập nhật hook call
Tìm dòng khoảng 98-105:
```typescript
const { 
  progress, 
  isLoading, 
  completeStage, 
  unlockBadge, 
  updateCurrentNode, 
  resetProgress,
  fetchProgress 
} = useSupabaseProgress();
```

Thay bằng:
```typescript
const { 
  globals,
  course,
  isLoading,
  completeStage,
  updateCurrentNode,
  refetch
} = useGameProgress(courseId || "grade2-trangquynh");

// Map lại progress để tương thích với code cũ
const progress = {
  xp: globals?.total_xp || 0,
  level: globals?.global_level || 1,
  coins: globals?.coins || 0,
  currentNode: course?.current_node || 0,
  completedNodes: course?.completed_nodes || [],
  earnedBadges: globals?.unlocked_badges || [],
};
```

### ✅ 3.4. Cập nhật completeStage call
Tìm hàm `handleAnswer` (khoảng dòng 287-378), tìm đoạn:
```typescript
const result = await completeStage(
  currentNode?.id || `stage-${currentNodeIndex}`,
  courseId,
  score,
  maxScore,
  newCorrect,
  totalQuestions,
  timeSpent
);
```

Thay bằng:
```typescript
const result = await completeStage.mutateAsync({
  nodeIndex: currentNodeIndex,
  score: score,
  stars: Math.floor((newCorrect / totalQuestions) * 3), // 0-3 sao
  xpReward: earnedXpThisLevel,
  gameSpecificData: {
    correct: newCorrect,
    incorrect: newIncorrect,
    accuracy: (newCorrect / totalQuestions) * 100,
    timeSpent: Math.floor((Date.now() - levelStartTime.current) / 1000),
  }
});

if (result?.success) {
  await refetch(); // Refresh state
}
```

### ✅ 3.5. Cập nhật fetchProgress
Tìm các chỗ gọi `fetchProgress()` và thay bằng `refetch()`

---

## 📌 BƯỚC 4: CẬP NHẬT COURSE IDs (5 phút)

### ✅ 4.1. Kiểm tra courseId trong các file
Mở từng file và đảm bảo có `courseId` prop:

- [ ] `src/pages/PreschoolGame.tsx` → `courseId="preschool-cucuoi"`
- [ ] `src/pages/Grade0Game.tsx` → `courseId="grade0-cuoi"`
- [ ] `src/pages/Grade1Game.tsx` → `courseId="grade1-zodiac"`
- [ ] `src/pages/TrangQuynhGame.tsx` → `courseId="grade2-trangquynh"`
- [ ] `src/pages/Grade3Game.tsx` → `courseId="grade3-sontinh"`
- [ ] `src/pages/SongHongGame.tsx` → `courseId="grade3-songhong"`
- [ ] `src/pages/Grade4Game.tsx` → `courseId="grade4-giong"`
- [ ] `src/pages/Grade5Game.tsx` → `courseId="grade5-trangnguyen"`

---

## 📌 BƯỚC 5: TEST (10 phút)

### ✅ 5.1. Test Database
Chạy trong Supabase SQL Editor:
```sql
-- Test get_full_game_state (phải có user đăng nhập)
SELECT public.get_full_game_state('grade2-trangquynh');
```
**Kết quả:** Phải trả về JSON với `success: true`

### ✅ 5.2. Test Frontend
- [ ] Reload app (F5)
- [ ] Mở Console (F12)
- [ ] Vào game Lớp 2: `/classroom/trangquynh`
- [ ] Kiểm tra Console: Không có lỗi màu đỏ
- [ ] Chơi qua 1 màn
- [ ] Kiểm tra: Điểm số được lưu

### ✅ 5.3. Verify Data
Chạy query trong Supabase:
```sql
-- Xem globals
SELECT * FROM public.game_globals WHERE user_id = auth.uid();

-- Xem course progress
SELECT * FROM public.course_progress WHERE user_id = auth.uid();

-- Xem history
SELECT * FROM public.level_history 
WHERE user_id = auth.uid() 
ORDER BY created_at DESC 
LIMIT 5;
```

---

## 📌 BƯỚC 6: FIX LỖI (nếu có)

### ✅ 6.1. Lỗi TypeScript
- [ ] Chạy: `npm run build` hoặc check linter
- [ ] Fix các lỗi type nếu có

### ✅ 6.2. Lỗi Runtime
- [ ] Mở Console (F12)
- [ ] Xem lỗi cụ thể
- [ ] Check lại các bước trên

---

## 🎯 KẾT QUẢ CUỐI CÙNG

Sau khi hoàn thành, bạn sẽ có:
- ✅ Database schema mới (globals + course_progress)
- ✅ RPC functions mới (complete_stage, get_full_game_state)
- ✅ Hook mới (useGameProgress)
- ✅ Tất cả games hoạt động với courseId riêng
- ✅ Global XP/Level/Coin chung cho tất cả games
- ✅ Course progress riêng cho từng game

---

## 📞 NẾU GẶP LỖI

1. **Lỗi SQL**: Copy error message và gửi
2. **Lỗi Frontend**: Screenshot Console (F12)
3. **Data không lưu**: Check RLS policies đã enable chưa

