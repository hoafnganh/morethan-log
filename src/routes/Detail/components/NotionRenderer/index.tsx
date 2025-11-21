import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { ExtendedRecordMap } from "notion-types"
import useScheme from "src/hooks/useScheme"
import { FC, useEffect } from "react"
import styled from "@emotion/styled"

// core styles shared by all of react-notion-x (required)
import "react-notion-x/src/styles.css"

// used for code syntax highlighting (optional)
import "prismjs/themes/prism-tomorrow.css"

// used for rendering equations (optional)
import "katex/dist/katex.min.css"

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

  // Click vào code block để copy toàn bộ
  useEffect(() => {
    const handleCodeBlockClick = async (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const codeBlock = target.closest('.notion-code')
      
      if (!codeBlock) return
      
      const codeElement = codeBlock.querySelector('code')
      if (!codeElement) return
      
      const textToCopy = codeElement.textContent || ''
      
      try {
        await navigator.clipboard.writeText(textToCopy)
        
        // Hiển thị thông báo đã copy
        showCopyNotification(codeBlock as HTMLElement)
        
        // Thêm effect khi copy
        codeBlock.classList.add('copied-flash')
        setTimeout(() => {
          codeBlock.classList.remove('copied-flash')
        }, 500)
        
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }

    // Hàm hiển thị thông báo "Copied!"
    const showCopyNotification = (codeBlock: HTMLElement) => {
      // Xóa notification cũ nếu có
      const oldNotification = codeBlock.querySelector('.copy-notification')
      if (oldNotification) {
        oldNotification.remove()
      }

      // Tạo notification mới
      const notification = document.createElement('div')
      notification.className = 'copy-notification'
      notification.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
        </svg>
        <span>Copied!</span>
      `
      
      codeBlock.appendChild(notification)
      
      // Tự động xóa sau 2 giây
      setTimeout(() => {
        notification.classList.add('fade-out')
        setTimeout(() => notification.remove(), 300)
      }, 2000)
    }

    // Thêm event listener
    document.addEventListener('click', handleCodeBlockClick)
    
    return () => {
      document.removeEventListener('click', handleCodeBlockClick)
    }
  }, [recordMap])

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

  /* ===== CUSTOM CODE BLOCK STYLING ===== */
  
  /* Container của code block - Thêm cursor pointer để báo hiệu có thể click */
  .notion-code {
    border-radius: 8px;
    overflow: visible;  /* Thay đổi từ hidden sang visible để hint có thể hiện bên ngoài */
    margin: 1.5em 0;
    background: ${props => props.scheme === "dark" ? "#1e1e1e" : "#f6f8fa"} !important;
    border: 1px solid ${props => props.scheme === "dark" ? "#333" : "#e1e4e8"};
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease;
    padding-top: 32px;  /* Thêm padding top để tạo không gian cho hint */
  }

  /* Hover effect để người dùng biết có thể click */
  .notion-code:hover {
    border-color: ${props => props.scheme === "dark" ? "#4493f8" : "#0969da"};
    box-shadow: 0 0 0 3px ${props => props.scheme === "dark" ? "rgba(68, 147, 248, 0.15)" : "rgba(9, 105, 218, 0.1)"};
  }

  /* Effect khi copy thành công */
  .notion-code.copied-flash {
    animation: flash-border 0.5s ease;
  }

  @keyframes flash-border {
    0%, 100% {
      border-color: ${props => props.scheme === "dark" ? "#333" : "#e1e4e8"};
    }
    50% {
      border-color: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
    }
  }

  /* Notification "Copied!" */
  .copy-notification {
    position: absolute;
    top: -40px;  /* Dịch lên trên cao hơn, ngoài code block */
    right: 12px;
    padding: 8px 12px;
    background: #10b981;
    color: white;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
    z-index: 100;
    animation: slideIn 0.3s ease;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  }

  .copy-notification svg {
    width: 16px;
    height: 16px;
  }

  .copy-notification.fade-out {
    animation: fadeOut 0.3s ease forwards;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-10px);
    }
  }

  /* Hint text "Click to copy" - DỊCH LÊN CAO HƠN */
  .notion-code::before {
    content: "Click to copy";
    position: absolute;
    top: -28px;  /* Dịch lên trên, ngoài code block */
    right: 12px;
    padding: 6px 10px;
    background: ${props => props.scheme === "dark" ? "rgba(30, 30, 30, 0.95)" : "rgba(255, 255, 255, 0.95)"};
    border: 1px solid ${props => props.scheme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.15)"};
    border-radius: 6px;
    font-size: 12px;
    color: ${props => props.scheme === "dark" ? "#aaa" : "#666"};
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    white-space: nowrap;
    box-shadow: 0 2px 8px ${props => props.scheme === "dark" ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.1)"};
    z-index: 10;
  }

  .notion-code:hover::before {
    opacity: 1;
  }

  /* Ẩn hint khi đang hiển thị notification */
  .notion-code:has(.copy-notification)::before {
    display: none;
  }

  /* Code pre container */
  .notion-code pre {
    background: ${props => props.scheme === "dark" ? "#1e1e1e" : "#f6f8fa"} !important;
    padding: 20px !important;
    margin: 0 !important;
    border-radius: 8px !important;  /* Giữ bo góc cho pre */
    overflow-x: auto !important;
    overflow-wrap: break-word !important;
    word-wrap: break-word !important;
    white-space: pre-wrap !important;
    word-break: break-all !important;
    position: relative;
  }

  /* Ẩn nút copy mặc định của notion */
  .notion-code .notion-code-copy-button {
    display: none !important;
  }

  /* Code text - TĂNG LINE HEIGHT */
  .notion-code code {
    color: ${props => props.scheme === "dark" ? "#d4d4d4" : "#24292e"} !important;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace !important;
    font-size: 14px !important;
    line-height: 1.8 !important;
    white-space: pre-wrap !important;
    word-wrap: break-word !important;
    word-break: break-all !important;
    display: block !important;
  }

  /* Scrollbar styling */
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