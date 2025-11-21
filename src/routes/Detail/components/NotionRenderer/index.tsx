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

  // Thêm functionality cho nút copy
  useEffect(() => {
    const addCopyButtons = () => {
      const codeBlocks = document.querySelectorAll('.notion-code')
      
      codeBlocks.forEach((block) => {
        // Kiểm tra đã có nút copy chưa
        if (block.querySelector('.custom-copy-button')) return

        // Tạo nút copy
        const copyButton = document.createElement('button')
        copyButton.className = 'custom-copy-button'
        copyButton.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 4v1h1V4h6v6h-1v1h1.5a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5zM3.5 6A.5.5 0 0 0 3 6.5v7a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5h-7z"/>
          </svg>
        `
        copyButton.setAttribute('aria-label', 'Copy code')
        
        // Xử lý sự kiện copy
        copyButton.addEventListener('click', async () => {
          const codeElement = block.querySelector('code')
          if (!codeElement) return
          
          const textToCopy = codeElement.textContent || ''
          
          try {
            await navigator.clipboard.writeText(textToCopy)
            
            // Thay đổi icon thành checkmark
            copyButton.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
              </svg>
            `
            copyButton.classList.add('copied')
            
            // Đổi lại sau 2 giây
            setTimeout(() => {
              copyButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4 4v1h1V4h6v6h-1v1h1.5a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5zM3.5 6A.5.5 0 0 0 3 6.5v7a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5h-7z"/>
                </svg>
              `
              copyButton.classList.remove('copied')
            }, 2000)
          } catch (err) {
            console.error('Failed to copy:', err)
          }
        })
        
        block.appendChild(copyButton)
      })
    }

    // Chạy sau khi component render
    const timer = setTimeout(addCopyButtons, 100)
    
    return () => clearTimeout(timer)
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
  
  /* Container của code block */
  .notion-code {
    border-radius: 8px;
    overflow: hidden;
    margin: 1.5em 0;
    background: ${props => props.scheme === "dark" ? "#1e1e1e" : "#f6f8fa"} !important;
    border: 1px solid ${props => props.scheme === "dark" ? "#333" : "#e1e4e8"};
    position: relative;
  }

  /* Code pre container - Tăng line-height */
  .notion-code pre {
    background: ${props => props.scheme === "dark" ? "#1e1e1e" : "#f6f8fa"} !important;
    padding: 20px !important;  /* Tăng padding */
    margin: 0 !important;
    border-radius: 0 !important;
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
    font-size: 14px !important;  /* Tăng size lên 14px */
    line-height: 1.8 !important;  /* Tăng line-height lên 1.8 */
    white-space: pre-wrap !important;
    word-wrap: break-word !important;
    word-break: break-all !important;
    display: block !important;
  }

  /* Custom copy button (HOẠT ĐỘNG ĐƯỢC) */
  .custom-copy-button {
    position: absolute;
    top: 12px;
    right: 12px;
    padding: 6px 8px;
    background: ${props => props.scheme === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)"};
    border: 1px solid ${props => props.scheme === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)"};
    border-radius: 6px;
    cursor: pointer;
    color: ${props => props.scheme === "dark" ? "#cccccc" : "#586069"};
    transition: all 0.2s ease;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.7;
  }

  .custom-copy-button:hover {
    opacity: 1;
    background: ${props => props.scheme === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)"};
    transform: translateY(-1px);
  }

  .custom-copy-button:active {
    transform: translateY(0);
  }

  .custom-copy-button.copied {
    color: #10b981;
    border-color: #10b981;
    background: ${props => props.scheme === "dark" ? "rgba(16, 185, 129, 0.1)" : "rgba(16, 185, 129, 0.1)"};
  }

  /* Icon trong button */
  .custom-copy-button svg {
    width: 16px;
    height: 16px;
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