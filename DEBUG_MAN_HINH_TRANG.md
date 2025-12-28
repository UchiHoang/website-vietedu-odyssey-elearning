# 🔍 Debug: Màn hình trắng

## ✅ Đã sửa

1. ✅ Thêm error handling cho `useGameProgress` hook
2. ✅ Thêm null checks cho `progress` object (dùng `useMemo` với try-catch)
3. ✅ Hiển thị error message nếu RPC function chưa tồn tại
4. ✅ Fallback values để tránh crash

## 🔧 Cách kiểm tra

### Bước 1: Mở Console (F12)
- Xem có error nào không
- Copy error message và gửi cho tôi

### Bước 2: Kiểm tra RPC Functions
Nếu thấy error: `function ... does not exist` → **Cần chạy SQL migration**

**Chạy migration:**
1. Mở Supabase Dashboard
2. SQL Editor
3. Copy toàn bộ nội dung từ: `supabase/migrations/20251208000000_shared_schema_refactor.sql`
4. Paste và Run

### Bước 3: Kiểm tra Network Tab
- Xem request đến `get_full_game_state` có fail không
- Response là gì?

## 🐛 Các lỗi thường gặp

### Lỗi 1: "function get_full_game_state does not exist"
**Giải pháp:** Chạy SQL migration (xem Bước 2)

### Lỗi 2: "Not authenticated"
**Giải pháp:** Đăng nhập lại

### Lỗi 3: "Cannot read property 'globals' of undefined"
**Giải pháp:** Đã sửa bằng null checks, nhưng nếu vẫn gặp → gửi error message

## 📋 Checklist

- [ ] Đã chạy SQL migration?
- [ ] Đã đăng nhập?
- [ ] Console có error gì không?
- [ ] Network request có fail không?

## 💡 Nếu vẫn màn hình trắng

1. **Mở Console (F12)**
2. **Copy toàn bộ error message**
3. **Gửi cho tôi** → Tôi sẽ sửa ngay!

