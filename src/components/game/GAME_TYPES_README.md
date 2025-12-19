# Các loại trò chơi tương tác - Lớp 2

Hệ thống game cho lớp 2 bao gồm 5 loại trò chơi đa dạng, được thiết kế theo logic từ dễ đến khó phù hợp với từng màn chơi.

## 1. Multiple Choice (Trắc nghiệm nhiều đáp án)

**Mô tả**: Trò chơi truyền thống với 4 đáp án để lựa chọn.

**Sử dụng cho**:
- Phép tính cơ bản (cộng, trừ)
- Câu hỏi lý thuyết
- So sánh số

**Cấu trúc JSON**:
```json
{
  "id": "q1",
  "type": "multiple-choice",
  "question": "37 + 28 = ?",
  "options": ["55", "65", "75", "85"],
  "correctAnswer": 1,
  "explanation": "37 + 28 = 65..."
}
```

---

## 2. Matching Pairs (Nối cặp)

**Mô tả**: Người chơi nối các mục bên trái với mục tương ứng bên phải.

**Sử dụng cho**:
- Số ↔ Kết quả phép tính
- Hình học ↔ Tên hình
- Đơn vị đo lường tương đương
- Đồng hồ ↔ Giờ

**Tính năng**:
- Trộn ngẫu nhiên cột bên phải
- Hiệu ứng phản hồi trực quan
- Tự động kiểm tra khi hoàn thành

**Cấu trúc JSON**:
```json
{
  "id": "matching-1",
  "type": "matching-pairs",
  "question": "Nối các phép tính với kết quả đúng",
  "pairs": [
    {
      "id": "pair1",
      "left": "15 + 8",
      "right": "23"
    },
    {
      "id": "pair2",
      "left": "27 + 16",
      "right": "43"
    }
  ]
}
```

**Có thể thêm hình ảnh**:
```json
{
  "pairs": [
    {
      "id": "pair1",
      "left": "Hình tròn",
      "right": "⭕",
      "leftImage": "/path/to/image.png",
      "rightImage": "/path/to/shape.png"
    }
  ]
}
```

---

## 3. Drag & Drop (Kéo thả)

**Mô tả**: Kéo các mục vào ô đúng.

**Sử dụng cho**:
- So sánh số (lớn hơn/nhỏ hơn)
- Phân loại hình học
- Sắp xếp theo thứ tự
- Ghép cặp hình - số - kết quả

**Tính năng**:
- Kéo thả tương tác
- Có thể xóa và kéo lại
- Hiển thị đúng/sai khi kiểm tra
- Hỗ trợ hình ảnh

**Cấu trúc JSON**:
```json
{
  "id": "drag-1",
  "type": "drag-drop",
  "question": "Kéo các số vào ô phù hợp",
  "dragItems": [
    {
      "id": "num1",
      "content": "23",
      "image": "/optional/image.png",
      "correctSlot": "less50"
    }
  ],
  "dropSlots": [
    {
      "id": "less50",
      "label": "Nhỏ hơn 50",
      "image": "/optional/hint-image.png"
    }
  ]
}
```

---

## 4. Fill in the Blank (Điền vào chỗ trống)

**Mô tả**: Điền từ/số vào các chỗ trống trong câu.

**Sử dụng cho**:
- Tìm số hạng còn thiếu
- Hoàn thành công thức
- Bài toán có lời văn
- Đổi đơn vị

**Tính năng**:
- Nhiều chỗ trống trong một câu
- Kiểm tra chính xác (không phân biệt hoa/thường)
- Hiển thị đáp án đúng nếu sai

**Cấu trúc JSON**:
```json
{
  "id": "fill-1",
  "type": "fill-blank",
  "question": "25 + ___ = 48",
  "blanks": [
    {
      "position": 5,
      "answer": "23",
      "placeholder": "?"
    }
  ],
  "explanation": "Để tìm số hạng còn thiếu..."
}
```

**Lưu ý**: `position` là vị trí ký tự trong chuỗi `question` nơi chỗ trống xuất hiện (bắt đầu từ 0).

---

## 5. Counting Game (Đếm vật thể)

**Mô tả**: Đếm số lượng vật thể hiển thị và chọn đáp án đúng.

**Sử dụng cho**:
- Đếm số cơ bản
- Nhận dạng nhóm
- Phép cộng/trừ bằng hình
- Đếm theo nhóm

**Tính năng**:
- Hiển thị vật thể trực quan với hiệu ứng
- Tạo đáp án gần đúng tự động
- Hỗ trợ nhiều nhóm vật thể
- Animation xuất hiện từng vật

**Cấu trúc JSON**:
```json
{
  "id": "count-1",
  "type": "counting",
  "question": "Đếm xem có bao nhiêu quả táo?",
  "countingItems": [
    {
      "image": "/src/assets/game/counting-apple.png",
      "count": 7
    }
  ],
  "countingAnswer": 7,
  "explanation": "Đếm từng quả: 1, 2, 3..."
}
```

**Đếm nhiều nhóm** (phép cộng):
```json
{
  "countingItems": [
    {
      "image": "/src/assets/game/counting-apple.png",
      "count": 5
    },
    {
      "image": "/src/assets/game/counting-banana.png",
      "count": 4
    }
  ],
  "countingAnswer": 9
}
```

---

## Hình ảnh AI có sẵn

Hệ thống đã tạo sẵn các hình ảnh AI trong thư mục `src/assets/game/`:

- `counting-apple.png` - Quả táo dễ thương
- `counting-banana.png` - Quả chuối đáng yêu
- `counting-star.png` - Ngôi sao lấp lánh
- `counting-flower.png` - Bông hoa màu sắc
- `counting-dots.png` - Các chấm tròn đa màu
- `shapes-basic.png` - Các hình học cơ bản
- `number-cards.png` - Thẻ số 0-9
- `measurement-tools.png` - Các dụng cụ đo

## Logic độ khó

### Dễ (Màn 1-2):
- Multiple Choice với 4 đáp án rõ ràng
- Counting với số lượng 1-10
- Matching Pairs với 3-4 cặp

### Trung bình (Màn 3-5):
- Fill in the Blank với 1-2 chỗ trống
- Drag & Drop với 4-6 mục
- Counting với nhiều nhóm
- Matching Pairs với 5-6 cặp

### Khó (Màn 6+):
- Fill in the Blank với nhiều bước logic
- Drag & Drop phức tạp với phân loại
- Counting kết hợp phép tính
- Các game kết hợp

## Cách sử dụng

1. **Thêm câu hỏi mới** vào `src/data/curriculum.grade2.json`
2. **Chọn type** phù hợp: `multiple-choice`, `matching-pairs`, `drag-drop`, `fill-blank`, `counting`
3. **Cung cấp dữ liệu** theo cấu trúc của từng loại
4. **Test** trong game để đảm bảo hoạt động tốt

## Component được sử dụng

- `QuestionCard.tsx` - Component chính, tự động render loại game phù hợp
- `MatchingPairsGame.tsx` - Xử lý nối cặp
- `DragDropGame.tsx` - Xử lý kéo thả
- `FillInTheBlankGame.tsx` - Xử lý điền chỗ trống
- `CountingGame.tsx` - Xử lý đếm vật thể

## Tính năng chung

✅ Responsive design - Hoạt động tốt trên mọi thiết bị  
✅ Animations mượt mà với Framer Motion  
✅ Phản hồi trực quan (đúng/sai)  
✅ Giải thích chi tiết sau mỗi câu  
✅ Hỗ trợ hình ảnh cho mọi loại game  
✅ Accessibility support (keyboard navigation, ARIA labels)  
✅ Tự động lưu tiến độ vào localStorage

## Tips thiết kế câu hỏi

1. **Sử dụng hình ảnh AI** để tăng tính trực quan
2. **Kết hợp nhiều loại game** trong cùng một bài học
3. **Tăng độ khó dần** theo tiến độ của người chơi
4. **Viết explanation rõ ràng** để học sinh hiểu logic
5. **Test với học sinh thật** để đảm bảo phù hợp độ tuổi
