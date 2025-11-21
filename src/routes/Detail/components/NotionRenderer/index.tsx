import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { ExtendedRecordMap } from "notion-types"
import useScheme from "src/hooks/useScheme"

// core styles shared by all of react-notion-x (required)
import "react-notion-x/src/styles.css"

// used for code syntax highlighting (optional)
import "prismjs/themes/prism-tomorrow.css"

// used for rendering equations (optional)

import "katex/dist/katex.min.css"
import { FC } from "react"
import styled from "@emotion/styled"

const _NotionRenderer = dynamic(
  () => import("react-notion-x").then((m) => m.NotionRenderer),
  { ssr: false }
)

const Code = dynamic(() =>
  import("react-notion-x/build/third-party/code").then(async (m) => m.Code)
)

const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then(
    (m) => m.Collection
  )
)
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
)
const Pdf = dynamic(
  () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
  {
    ssr: false,
  }
)
const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  {
    ssr: false,
  }
)

const mapPageUrl = (id: string) => {
  return "https://www.notion.so/" + id.replace(/-/g, "")
}

type Props = {
  recordMap: ExtendedRecordMap
}

const NotionRenderer: FC<Props> = ({ recordMap }) => {
  const [scheme] = useScheme()
  return (
    <StyledWrapper scheme={scheme}>
      <_NotionRenderer
        darkMode={scheme === "dark"}
        recordMap={recordMap}
        components={{
          Code,
          Collection,
          Equation,
          Modal,
          Pdf,
          nextImage: Image,
          nextLink: Link,
        }}
        mapPageUrl={mapPageUrl}
      />
    </StyledWrapper>
  )
}

export default NotionRenderer

const StyledWrapper = styled.div<{ scheme: string }>`
  /* // TODO: why render? */
  .notion-collection-page-properties {
    display: none !important;
  }
  .notion-page {
    padding: 0;
  }
  .notion-list {
    width: 100%;
  }

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

  /* ===== CUSTOM CODE BLOCK STYLING (giống VS Code) ===== */
  
  /* Container của code block */
  .notion-code {
    border-radius: 8px;
    overflow: hidden;
    margin: 1.5em 0;
    background: ${props => props.scheme === "dark" ? "#1e1e1e" : "#f6f8fa"} !important;
    border: 1px solid ${props => props.scheme === "dark" ? "#333" : "#e1e4e8"};
  }

  /* Language label (dropdown fake) */
  pre[class*="language-"]::before {
    content: "";
    position: absolute;
    top: 12px;
    right: 12px;
    padding: 4px 10px 4px 8px;
    background: ${props => props.scheme === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)"};
    border: 1px solid ${props => props.scheme === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)"};
    border-radius: 4px;
    font-size: 12px;
    color: ${props => props.scheme === "dark" ? "#cccccc" : "#586069"};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    z-index: 10;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: all 0.2s ease;
  }

  /* Hiển thị tên ngôn ngữ */
  pre[class*="language-bash"]::before { content: "Bash ▾"; }
  pre[class*="language-javascript"]::before { content: "JavaScript ▾"; }
  pre[class*="language-typescript"]::before { content: "TypeScript ▾"; }
  pre[class*="language-python"]::before { content: "Python ▾"; }
  pre[class*="language-java"]::before { content: "Java ▾"; }
  pre[class*="language-cpp"]::before { content: "C++ ▾"; }
  pre[class*="language-css"]::before { content: "CSS ▾"; }
  pre[class*="language-html"]::before { content: "HTML ▾"; }
  pre[class*="language-json"]::before { content: "JSON ▾"; }
  pre[class*="language-markdown"]::before { content: "Markdown ▾"; }
  pre[class*="language-sql"]::before { content: "SQL ▾"; }
  pre[class*="language-jsx"]::before { content: "JSX ▾"; }
  pre[class*="language-tsx"]::before { content: "TSX ▾"; }

  pre[class*="language-"]::before:hover {
    background: ${props => props.scheme === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)"};
  }

  /* Code pre container - TỰ ĐỘNG XUỐNG DÒNG */
  .notion-code pre {
    background: ${props => props.scheme === "dark" ? "#1e1e1e" : "#f6f8fa"} !important;
    padding: 16px 16px 16px 50px !important;
    margin: 0 !important;
    border-radius: 0 !important;
    overflow-x: auto !important;  /* Giữ lại để phòng trường hợp */
    overflow-wrap: break-word !important;  /* Tự động xuống dòng */
    word-wrap: break-word !important;  /* Hỗ trợ trình duyệt cũ */
    white-space: pre-wrap !important;  /* Giữ format nhưng cho phép wrap */
    word-break: break-all !important;  /* Break từ dài nếu cần */
    position: relative;
  }

  /* Ẩn nút copy mặc định của notion */
  .notion-code .notion-code-copy-button {
    display: none;
  }

  /* Code text color và word wrap */
  .notion-code code {
    color: ${props => props.scheme === "dark" ? "#d4d4d4" : "#24292e"} !important;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace !important;
    font-size: 13px !important;
    line-height: 1.6 !important;
    white-space: pre-wrap !important;  /* Cho phép xuống dòng */
    word-wrap: break-word !important;
    word-break: break-all !important;
  }

  /* Custom copy button (giống VS Code) */
  .notion-code {
    position: relative;
  }

  .notion-code::after {
    content: "";
    position: absolute;
    top: 12px;
    right: 80px;
    width: 18px;
    height: 18px;
    cursor: pointer;
    opacity: 0.5;
    transition: opacity 0.2s;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='%23cccccc'%3E%3Cpath d='M4 4v1h1V4h6v6h-1v1h1.5a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5zM3.5 6A.5.5 0 0 0 3 6.5v7a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5h-7z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-size: contain;
    z-index: 10;
  }

  .notion-code::after:hover {
    opacity: 1;
  }

  /* Scrollbar styling (chỉ xuất hiện khi thực sự cần) */
  .notion-code pre::-webkit-scrollbar {
    height: 10px;
  }

  .notion-code pre::-webkit-scrollbar-track {
    background: ${props => props.scheme === "dark" ? "#1e1e1e" : "#f6f8fa"};
  }

  .notion-code pre::-webkit-scrollbar-thumb {
    background: ${props => props.scheme === "dark" ? "#424242" : "#d1d5da"};
    border-radius: 5px;
  }

  .notion-code pre::-webkit-scrollbar-thumb:hover {
    background: ${props => props.scheme === "dark" ? "#4e4e4e" : "#a8adb3"};
  }
`