# 🔧 FIX LỖI MIGRATION - Function name not unique

## ✅ Đã sửa xong!

File migration đã được cập nhật để **DROP tất cả các function cũ** trước khi tạo mới.

---

## 🚀 Chạy lại Migration

### Bước 1: Mở Supabase SQL Editor
1. Vào **Supabase Dashboard**
2. Click **SQL Editor**

### Bước 2: Chạy lại Migration
1. Mở file: `supabase/migrations/20251208000000_shared_schema_refactor.sql`
2. Copy **TOÀN BỘ** nội dung (file đã được sửa)
3. Paste vào SQL Editor
4. Click **Run** (hoặc Ctrl+Enter)

### Bước 3: Kiểm tra kết quả
Phải thấy: ✅ **Success** hoặc **Query executed successfully**

---

## 🔍 Nếu vẫn gặp lỗi

### Lỗi: "function does not exist"
→ Bình thường, migration đang drop function cũ

### Lỗi: "permission denied"
→ Kiểm tra bạn đang dùng role **postgres** hoặc có quyền admin

### Lỗi: "table already exists"
→ Bình thường, migration dùng `IF NOT EXISTS`

---

## ✅ Verify sau khi chạy

Chạy query này để kiểm tra:
```sql
-- Kiểm tra tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('game_globals', 'course_progress', 'level_history');

-- Kiểm tra functions
SELECT routine_name, routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('complete_stage', 'get_full_game_state');
```

**Kết quả mong đợi:**
- 3 tables: `game_globals`, `course_progress`, `level_history`
- 2 functions: `complete_stage`, `get_full_game_state`

---

## 📝 Thay đổi đã thực hiện

Migration đã được sửa để:
1. ✅ **DROP tất cả version cũ** của `complete_stage` (dùng DO block)
2. ✅ **DROP function cũ** của `get_full_game_state`
3. ✅ Tạo function mới với signature mới

Giờ migration sẽ chạy được! 🎉

