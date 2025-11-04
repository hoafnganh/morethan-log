# 🎨 Cách Sửa Code Text Styling trong Morethan-Log

## 📋 Mục lục (Table of Contents)

1. [Tổng quan](#tổng-quan)
2. [Vấn đề cần giải quyết](#vấn-đề-cần-giải-quyết)
3. [Giải pháp](#giải-pháp)
4. [Hướng dẫn chi tiết](#hướng-dẫn-chi-tiết)
5. [Kết quả](#kết-quả)
6. [Tùy chỉnh thêm](#tùy-chỉnh-thêm)

---

## 🎯 Tổng quan

Đây là hướng dẫn về cách thay đổi style của **inline code text** (văn bản code trong câu) trong blog Morethan-Log để giống với Notion.

### Ví dụ Inline Code:
Khi bạn viết trong Notion: "Sử dụng `npm install` để cài đặt package"
- Phần `npm install` là **inline code**
- Nó có màu đỏ/hồng và nền xám nhạt

---

## ❓ Vấn đề cần giải quyết

**Trước khi sửa:**
- Inline code trong blog sử dụng style mặc định của react-notion-x
- Có thể không giống 100% với Notion
- Chưa tối ưu cho dark mode

**Sau khi sửa:**
- ✅ Style giống Notion 100%
- ✅ Hỗ trợ cả Light và Dark mode
- ✅ Màu sắc chuyên nghiệp, dễ đọc

---

## 💡 Giải pháp

### File cần chỉnh sửa:
```
src/routes/Detail/components/NotionRenderer/index.tsx
```

### Các thay đổi chính:

#### 1. Thêm prop scheme vào StyledWrapper
```tsx
// Trước:
<StyledWrapper>

// Sau:
<StyledWrapper scheme={scheme}>
```

#### 2. Thêm TypeScript type cho scheme
```tsx
// Trước:
const StyledWrapper = styled.div`

// Sau:
const StyledWrapper = styled.div<{ scheme: string }>`
```

#### 3. Thêm CSS cho .notion-inline-code
```css
.notion-inline-code {
  color: ${props => props.scheme === "dark" ? "#ff7b72" : "#eb5757"};
  background: ${props => props.scheme === "dark" ? "rgba(110, 118, 129, 0.4)" : "rgba(135, 131, 120, 0.15)"};
  border-radius: 4px;
  font-size: 85%;
  padding: 0.2em 0.4em;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  font-weight: 400;
  line-height: 1.4;
}
```

---

## 📖 Hướng dẫn chi tiết

### Bước 1: Mở file NotionRenderer
```bash
src/routes/Detail/components/NotionRenderer/index.tsx
```

### Bước 2: Tìm dòng code này (khoảng dòng 60)
```tsx
return (
  <StyledWrapper>
```

### Bước 3: Thay đổi thành
```tsx
return (
  <StyledWrapper scheme={scheme}>
```

### Bước 4: Tìm StyledWrapper component (cuối file, khoảng dòng 81)
```tsx
const StyledWrapper = styled.div`
```

### Bước 5: Thay đổi thành
```tsx
const StyledWrapper = styled.div<{ scheme: string }>`
```

### Bước 6: Thêm CSS cho inline code (trước dấu `)
```tsx
const StyledWrapper = styled.div<{ scheme: string }>`
  /* code hiện có ... */
  
  /* Custom inline code styling to match Notion */
  .notion-inline-code {
    color: ${props => props.scheme === "dark" ? "#ff7b72" : "#eb5757"};
    background: ${props => props.scheme === "dark" ? "rgba(110, 118, 129, 0.4)" : "rgba(135, 131, 120, 0.15)"};
    border-radius: 4px;
    font-size: 85%;
    padding: 0.2em 0.4em;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    font-weight: 400;
    line-height: 1.4;
  }
`
```

### Bước 7: Save file và rebuild
```bash
yarn build
# hoặc
npm run build
```

---

## ✨ Kết quả

### Light Mode (Chế độ sáng)
```
Màu chữ:  #eb5757 (đỏ nhạt, giống Notion)
Màu nền:  rgba(135, 131, 120, 0.15) (xám nhạt trong suốt)
```

### Dark Mode (Chế độ tối)
```
Màu chữ:  #ff7b72 (đỏ sáng hơn, dễ đọc)
Màu nền:  rgba(110, 118, 129, 0.4) (xám đậm hơn)
```

### Thuộc tính styling
```
Border radius:  4px (góc bo tròn)
Padding:        0.2em 0.4em (khoảng cách hợp lý)
Font size:      85% (nhỏ hơn text thường)
Font family:    Monospace (chuyên dụng cho code)
Line height:    1.4 (dễ đọc)
```

---

## 🛠️ Tùy chỉnh thêm

### Thay đổi màu sắc

Nếu bạn muốn dùng màu khác, chỉnh sửa trong `.notion-inline-code`:

```tsx
.notion-inline-code {
  // Thay đổi màu chữ
  color: ${props => props.scheme === "dark" ? "#YOUR_DARK_COLOR" : "#YOUR_LIGHT_COLOR"};
  
  // Thay đổi màu nền
  background: ${props => props.scheme === "dark" ? "rgba(R, G, B, A)" : "rgba(R, G, B, A)"};
}
```

### Thay đổi border radius (độ bo góc)
```css
border-radius: 4px; /* Thay đổi giá trị này (2px, 6px, 8px...) */
```

### Thay đổi padding (khoảng cách trong)
```css
padding: 0.2em 0.4em; /* Thay đổi theo ý muốn */
```

### Thay đổi font size
```css
font-size: 85%; /* Có thể thay bằng 80%, 90%, 1em... */
```

---

## 🔍 Giải thích chi tiết

### Tại sao phải pass scheme prop?
```tsx
<StyledWrapper scheme={scheme}>
```
- `scheme` là biến lưu theme hiện tại (light hoặc dark)
- Cần truyền vào để CSS biết đang dùng theme nào
- Từ đó tự động đổi màu phù hợp

### Tại sao dùng template literal `${props => ...}`?
```tsx
color: ${props => props.scheme === "dark" ? "#ff7b72" : "#eb5757"};
```
- Đây là cú pháp của styled-components/emotion
- Cho phép CSS thay đổi động dựa trên props
- Nếu dark mode: dùng màu #ff7b72
- Nếu light mode: dùng màu #eb5757

### Tại sao dùng rgba() cho background?
```tsx
background: rgba(135, 131, 120, 0.15);
```
- rgba cho phép điều chỉnh độ trong suốt (alpha channel)
- 0.15 = 15% opacity → tạo màu nền nhạt, tinh tế
- Giúp inline code nổi bật nhưng không chói mắt

---

## 📚 Tài liệu tham khảo

- **INLINE_CODE_STYLING.md**: Hướng dẫn kỹ thuật chi tiết
- **SUMMARY_CHANGES.md**: Tổng kết các thay đổi
- **src/routes/Detail/components/NotionRenderer/index.tsx**: File chính được chỉnh sửa

---

## ✅ Checklist hoàn thành

- [x] Thêm custom CSS cho `.notion-inline-code`
- [x] Hỗ trợ Light mode với màu sắc Notion
- [x] Hỗ trợ Dark mode với màu sắc tối ưu
- [x] Thêm border-radius, padding, font settings
- [x] Test với linter (PASSED)
- [x] Test bảo mật với CodeQL (PASSED - 0 vulnerabilities)
- [x] Tạo tài liệu hướng dẫn

---

## 🎉 Lời kết

Giờ đây blog Morethan-Log của bạn đã có inline code text giống Notion!

Nếu có thắc mắc hoặc cần hỗ trợ thêm, vui lòng:
1. Xem lại file này (HOW_TO_FIX_CODE_TEXT.md)
2. Đọc INLINE_CODE_STYLING.md để hiểu chi tiết kỹ thuật
3. Mở issue trên GitHub repository

**Chúc bạn thành công! 🚀**

---

*Tài liệu này được tạo tự động khi update inline code styling cho morethan-log*
