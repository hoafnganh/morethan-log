import React, { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  recordMap: any;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ recordMap }) => {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => {
    const extractHeadings = () => {
      const headings: TocItem[] = [];
      
      if (!recordMap?.block) return headings;

      Object.keys(recordMap.block).forEach((key) => {
        const block = recordMap.block[key]?.value;
        if (!block) return;

        const type = block.type;
        
        if (['header', 'sub_header', 'sub_sub_header'].includes(type)) {
          const level = type === 'header' ? 1 : type === 'sub_header' ? 2 : 3;
          const text = block.properties?.title?.[0]?.[0] || '';
          
          headings.push({
            id: key,
            text,
            level
          });
        }
      });

      return headings;
    };

    setToc(extractHeadings());
  }, [recordMap]);

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = toc.map(item => {
        // Thử nhiều cách tìm element
        return document.querySelector(`[data-block-id="${item.id}"]`) ||
               document.getElementById(item.id) ||
               document.querySelector(`#block-${item.id}`);
      }).filter(el => el !== null);

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i];
        if (element && element.getBoundingClientRect().top <= 150) {
          setActiveId(toc[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [toc]);

  const scrollToHeading = (id: string) => {
    // Thử nhiều cách tìm element
    const element = document.querySelector(`[data-block-id="${id}"]`) ||
                   document.getElementById(id) ||
                   document.querySelector(`#block-${id}`) ||
                   document.querySelector(`.notion-block-${id}`);
    
    if (element) {
      const yOffset = -80; // Offset để không bị che bởi header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      console.log('Element not found for ID:', id);
    }
  };

  if (toc.length === 0) return null;

  return (
    <div 
      className={`toc-sidebar ${isExpanded ? 'expanded' : ''}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="toc-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 4h18M3 12h18M3 20h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      
      <div className="toc-content">
        <div className="toc-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 4h18M3 12h18M3 20h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="toc-title">Mục lục</span>
        </div>
        <nav className="toc-nav">
          <ul className="toc-list">
            {toc.map((item) => (
              <li
                key={item.id}
                className={`toc-item toc-level-${item.level} ${
                  activeId === item.id ? 'active' : ''
                }`}
                style={{ paddingLeft: `${(item.level - 1) * 12 + 8}px` }}
              >
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToHeading(item.id);
                  }}
                  href={`#${item.id}`}
                  title={item.text}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <style jsx>{`
        .toc-sidebar {
          position: fixed;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          width: 48px;
          max-height: calc(100vh - 120px);
          background: var(--bg-color, #ffffff);
          border: 1px solid var(--border-color, #e0e0e0);
          border-right: none;
          border-radius: 8px 0 0 8px;
          box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
          transition: width 0.3s ease, box-shadow 0.3s ease;
          z-index: 1000;
          overflow: hidden;
        }

        .toc-sidebar.expanded {
          width: 300px;
          box-shadow: -4px 0 16px rgba(0, 0, 0, 0.15);
        }

        .toc-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          color: var(--text-color, #374151);
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .toc-sidebar.expanded .toc-icon {
          display: none;
        }

        .toc-icon:hover {
          color: var(--primary-color, #0066cc);
        }

        .toc-content {
          display: flex;
          flex-direction: column;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
          height: 100%;
        }

        .toc-sidebar.expanded .toc-content {
          opacity: 1;
          visibility: visible;
        }

        .toc-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px;
          border-bottom: 1px solid var(--border-color, #e0e0e0);
          flex-shrink: 0;
        }

        .toc-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-color, #111827);
        }

        .toc-nav {
          flex: 1;
          overflow-y: auto;
          padding: 8px 0 16px;
        }

        .toc-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .toc-item {
          margin: 2px 0;
          transition: all 0.2s ease;
        }

        .toc-item a {
          display: block;
          color: var(--text-secondary, #6b7280);
          text-decoration: none;
          font-size: 13px;
          line-height: 1.5;
          padding: 6px 16px 6px 8px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          overflow: hidden;
          text-overflow: ellipsis;
          word-wrap: break-word;
          white-space: normal;
          max-width: 100%;
        }

        .toc-item a:hover {
          background: var(--hover-bg, #f3f4f6);
          color: var(--text-color, #111827);
        }

        .toc-item.active a {
          color: var(--primary-color, #0066cc);
          font-weight: 500;
          background: var(--active-bg, #eff6ff);
          border-left: 3px solid var(--primary-color, #0066cc);
          padding-left: 5px;
        }

        .toc-level-1 a {
          font-weight: 500;
        }

        .toc-level-2 a {
          font-size: 12px;
        }

        .toc-level-3 a {
          font-size: 11px;
          color: var(--text-light, #9ca3af);
        }

        /* Custom scrollbar */
        .toc-nav::-webkit-scrollbar {
          width: 6px;
        }

        .toc-nav::-webkit-scrollbar-track {
          background: transparent;
          margin: 4px 0;
        }

        .toc-nav::-webkit-scrollbar-thumb {
          background: var(--border-color, #e0e0e0);
          border-radius: 3px;
        }

        .toc-nav::-webkit-scrollbar-thumb:hover {
          background: var(--text-secondary, #6b7280);
        }

        /* Dark mode */
        @media (prefers-color-scheme: dark) {
          .toc-sidebar {
            --bg-color: #1f2937;
            --border-color: #374151;
            --text-color: #f9fafb;
            --text-secondary: #9ca3af;
            --text-light: #6b7280;
            --hover-bg: #374151;
            --active-bg: #1e3a5f;
            --primary-color: #60a5fa;
          }
        }

        [data-theme='dark'] .toc-sidebar {
          --bg-color: #1f2937;
          --border-color: #374151;
          --text-color: #f9fafb;
          --text-secondary: #9ca3af;
          --text-light: #6b7280;
          --hover-bg: #374151;
          --active-bg: #1e3a5f;
          --primary-color: #60a5fa;
        }

        /* Mobile: Ẩn sidebar */
        @media (max-width: 1024px) {
          .toc-sidebar {
            display: none;
          }
        }

        /* Tablet/Desktop: Hiển thị */
        @media (min-width: 1024px) {
          .toc-sidebar {
            display: block;
          }
        }

        /* Đảm bảo không bị che bởi footer */
        @media (min-width: 1024px) {
          .toc-sidebar {
            margin-bottom: 60px;
          }
        }
      `}</style>
    </div>
  );
};

export default TableOfContents;