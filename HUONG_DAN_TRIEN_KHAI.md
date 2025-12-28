# 🚀 HƯỚNG DẪN TRIỂN KHAI - Shared Schema Refactor

## 📋 Tổng quan

Hệ thống mới tách biệt:
- **Global Progress**: XP, Level, Coin, Badges (chung cho tất cả game)
- **Course Progress**: Nodes, Stars, Extra Data (riêng cho từng game)

---

## 🔧 BƯỚC 1: Chạy Migration SQL trên Supabase

### 1.1. Mở Supabase Dashboard
1. Vào https://supabase.com
2. Chọn project của bạn
3. Vào **SQL Editor** (menu bên trái)

### 1.2. Chạy Migration
1. Copy toàn bộ nội dung file: `supabase/migrations/20251208000000_shared_schema_refactor.sql`
2. Paste vào SQL Editor
3. Click **Run** (hoặc Ctrl+Enter)
4. Đợi kết quả: ✅ Success

### 1.3. Kiểm tra
Chạy query này để verify:
```sql
SELECT 
  (SELECT COUNT(*) FROM public.game_globals) as globals_count,
  (SELECT COUNT(*) FROM public.course_progress) as course_count,
  (SELECT COUNT(*) FROM public.level_history) as history_count;
```

---

## 🔧 BƯỚC 2: Cập nhật Frontend Hook

### 2.1. File mới đã được tạo
- ✅ `src/hooks/useGameProgress.ts` (hook mới)
- ⚠️ `src/hooks/useSupabaseProgress.ts` (giữ lại để backup)

### 2.2. Cài đặt dependencies (nếu chưa có)
```bash
npm install @tanstack/react-query
```

---

## 🔧 BƯỚC 3: Cập nhật TrangQuynhMiniGame Component

### 3.1. Thay đổi import
Mở file: `src/components/game/TrangQuynhMiniGame.tsx`

**Tìm:**
```typescript
import { useSupabaseProgress } from "@/hooks/useSupabaseProgress";
```

**Thay bằng:**
```typescript
import { useGameProgress } from "@/hooks/useGameProgress";
```

### 3.2. Cập nhật hook usage
**Tìm:**
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

**Thay bằng:**
```typescript
const { 
  globals,
  course,
  isLoading,
  completeStage,
  updateCurrentNode,
  refetch
} = useGameProgress(courseId || "grade2-trangquynh");
```

### 3.3. Cập nhật progress mapping
**Tìm các chỗ dùng `progress.xp`, `progress.currentNode`, etc.**

**Thay bằng:**
```typescript
// Old
progress.xp → globals?.total_xp || 0
progress.currentNode → course?.current_node || 0
progress.completedNodes → course?.completed_nodes || []
progress.level → globals?.global_level || 1

// New structure
const progress = {
  xp: globals?.total_xp || 0,
  level: globals?.global_level || 1,
  coins: globals?.coins || 0,
  currentNode: course?.current_node || 0,
  completedNodes: course?.completed_nodes || [],
  earnedBadges: globals?.unlocked_badges || [],
};
```

### 3.4. Cập nhật completeStage call
**Tìm:**
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

**Thay bằng:**
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
  }
});

if (result?.success) {
  // Success!
  await refetch(); // Refresh state
}
```

---

## 🔧 BƯỚC 4: Cập nhật Course IDs cho tất cả games

### 4.1. Mapping Course IDs
Cập nhật các file game pages:

**`src/pages/PreschoolGame.tsx`:**
```typescript
courseId="preschool-cucuoi"
```

**`src/pages/Grade0Game.tsx`:**
```typescript
courseId="grade0-cuoi"
```

**`src/pages/Grade1Game.tsx`:**
```typescript
courseId="grade1-zodiac"
```

**`src/pages/TrangQuynhGame.tsx`:**
```typescript
courseId="grade2-trangquynh"
```

**`src/pages/Grade3Game.tsx`:**
```typescript
courseId="grade3-sontinh"
```

**`src/pages/SongHongGame.tsx`:**
```typescript
courseId="grade3-songhong"
```

**`src/pages/Grade4Game.tsx`:**
```typescript
courseId="grade4-giong"
```

**`src/pages/Grade5Game.tsx`:**
```typescript
courseId="grade5-trangnguyen"
```

---

## 🔧 BƯỚC 5: Test từng bước

### 5.1. Test Database
Chạy query trong Supabase SQL Editor:
```sql
-- Test get_full_game_state
SELECT public.get_full_game_state('grade2-trangquynh');

-- Test complete_stage
SELECT public.complete_stage(
  'grade2-trangquynh',
  1,
  100,
  3,
  50,
  '{"test": true}'::jsonb
);
```

### 5.2. Test Frontend
1. **Reload app** (F5)
2. **Vào game bất kỳ** (ví dụ: Lớp 2)
3. **Chơi qua 1 màn**
4. **Kiểm tra Console** (F12) - không có lỗi
5. **Kiểm tra Supabase** - data đã được lưu

### 5.3. Verify Data
```sql
-- Xem globals
SELECT * FROM public.game_globals WHERE user_id = auth.uid();

-- Xem course progress
SELECT * FROM public.course_progress WHERE user_id = auth.uid();

-- Xem history
SELECT * FROM public.level_history WHERE user_id = auth.uid() ORDER BY created_at DESC LIMIT 5;
```

---

## 🔧 BƯỚC 6: Migration dữ liệu cũ (nếu có)

Nếu bạn đã có data cũ trong bảng `game_progress`, cần migrate:

```sql
-- Script migrate (chạy 1 lần)
INSERT INTO public.game_globals (user_id, total_xp, global_level, coins)
SELECT 
  user_id,
  COALESCE(total_xp, 0),
  COALESCE(level, 1),
  0
FROM public.game_progress
ON CONFLICT (user_id) DO UPDATE
SET 
  total_xp = EXCLUDED.total_xp,
  global_level = EXCLUDED.global_level;

-- Migrate course progress (nếu có course_id trong data cũ)
-- TODO: Tùy chỉnh theo schema cũ của bạn
```

---

## ⚠️ LƯU Ý QUAN TRỌNG

1. **Backup database** trước khi chạy migration
2. **Test trên staging** trước khi deploy production
3. **Course IDs phải nhất quán** - dùng format: `grade{number}-{name}`
4. **RLS Policies** đã được setup - user chỉ thấy data của mình
5. **Lần đầu chơi game** - RPC tự động tạo default data

---

## 🐛 Troubleshooting

### Lỗi: "Not authenticated"
→ Kiểm tra user đã đăng nhập chưa

### Lỗi: "function does not exist"
→ Migration chưa chạy xong, kiểm tra lại SQL Editor

### Lỗi: "permission denied"
→ Kiểm tra RLS policies đã được tạo chưa

### Data không hiển thị
→ Kiểm tra `courseId` có đúng không, check Console logs

---

## ✅ Checklist hoàn thành

- [ ] Bước 1: Chạy migration SQL
- [ ] Bước 2: Hook mới đã được tạo
- [ ] Bước 3: Cập nhật TrangQuynhMiniGame
- [ ] Bước 4: Cập nhật Course IDs
- [ ] Bước 5: Test thành công
- [ ] Bước 6: Migrate data cũ (nếu có)

---

## 📞 Hỗ trợ

Nếu gặp lỗi, gửi:
1. Screenshot lỗi
2. Console logs (F12)
3. SQL query result (nếu có)

