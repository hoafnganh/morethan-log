# Hướng dẫn chỉnh sửa Inline Code Text Style (Code Text Styling Guide)

## Vấn đề (Problem)
Inline code text trong blog không giống với style của Notion.

## Giải pháp (Solution)
Đã tùy chỉnh CSS cho `.notion-inline-code` trong file `src/routes/Detail/components/NotionRenderer/index.tsx` để có giao diện giống Notion hơn.

## Thay đổi (Changes Made)

### File được chỉnh sửa (Modified File)
- `src/routes/Detail/components/NotionRenderer/index.tsx`

### Chi tiết thay đổi (Details)

#### 1. Light Mode (Chế độ sáng)
- **Text color**: `#eb5757` (màu đỏ nhạt)
- **Background**: `rgba(135, 131, 120, 0.15)` (nền xám nhạt trong suốt)

#### 2. Dark Mode (Chế độ tối)
- **Text color**: `#ff7b72` (màu đỏ sáng hơn)
- **Background**: `rgba(110, 118, 129, 0.4)` (nền xám đậm hơn)

#### 3. Các thuộc tính khác (Other Properties)
- **Border radius**: `4px` (góc bo tròn)
- **Padding**: `0.2em 0.4em` (khoảng cách trong)
- **Font size**: `85%` (kích thước font)
- **Font family**: Monospace fonts (SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier)
- **Font weight**: `400` (độ đậm bình thường)
- **Line height**: `1.4` (chiều cao dòng)

## Cách hoạt động (How It Works)

Component `NotionRenderer` sử dụng hook `useScheme()` để phát hiện theme hiện tại (light/dark). 

Styled component `StyledWrapper` nhận prop `scheme` và tự động điều chỉnh màu sắc cho inline code dựa trên theme:

```tsx
<StyledWrapper scheme={scheme}>
  {/* Notion content */}
</StyledWrapper>
```

CSS được áp dụng:

```css
.notion-inline-code {
  color: /* đỏ nhạt (light) hoặc đỏ sáng (dark) */
  background: /* xám nhạt (light) hoặc xám đậm (dark) */
  border-radius: 4px;
  /* ... các thuộc tính khác */
}
```

## Tùy chỉnh thêm (Further Customization)

Nếu bạn muốn thay đổi màu sắc, chỉnh sửa các giá trị trong `StyledWrapper`:

```tsx
const StyledWrapper = styled.div<{ scheme: string }>`
  .notion-inline-code {
    color: ${props => props.scheme === "dark" ? "#YOUR_DARK_COLOR" : "#YOUR_LIGHT_COLOR"};
    background: ${props => props.scheme === "dark" ? "rgba(R, G, B, ALPHA)" : "rgba(R, G, B, ALPHA)"};
    /* Thay đổi các thuộc tính khác tại đây */
  }
`
```

## Kết quả (Result)

Inline code text giờ đây có giao diện giống Notion với:
- ✅ Màu sắc phù hợp cho cả Light và Dark mode
- ✅ Background mềm mại, dễ nhìn
- ✅ Border radius bo tròn
- ✅ Padding hợp lý
- ✅ Font monospace chuyên nghiệp
