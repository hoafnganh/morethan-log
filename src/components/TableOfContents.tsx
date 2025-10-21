import React, { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  recordMap: any; // ĐỔI TÊN TỪ blockMap THÀNH recordMap
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ recordMap }) => { // ĐỔI TÊN
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => {
    const extractHeadings = () => {
      const headings: TocItem[] = [];
      
      if (!recordMap?.block) return headings; // ĐỔI TÊN

      Object.keys(recordMap.block).forEach((key) => { // ĐỔI TÊN
        const block = recordMap.block[key]?.value; // ĐỔI TÊN
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
  }, [recordMap]); // ĐỔI TÊN

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = toc.map(item => {
        return document.getElementById(item.id);
      }).filter(el => el !== null);

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i];
        if (element && element.getBoundingClientRect().top <= 100) {
          setActiveId(toc[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [toc]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
          max-height: 80vh;
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
          width: 280px;
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
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
          padding: 16px 0;
          max-height: 100%;
          overflow-y: auto;
        }

        .toc-sidebar.expanded .toc-content {
          opacity: 1;
          visibility: visible;
        }

        .toc-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 16px 12px;
          border-bottom: 1px solid var(--border-color, #e0e0e0);
          margin-bottom: 8px;
        }

        .toc-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-color, #111827);
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
          line-height: 1.4;
          padding: 6px 16px 6px 8px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
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
        }

        /* Custom scrollbar */
        .toc-content::-webkit-scrollbar {
          width: 4px;
        }

        .toc-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .toc-content::-webkit-scrollbar-thumb {
          background: var(--border-color, #e0e0e0);
          border-radius: 4px;
        }

        .toc-content::-webkit-scrollbar-thumb:hover {
          background: var(--text-secondary, #6b7280);
        }

        /* Dark mode */
        @media (prefers-color-scheme: dark) {
          .toc-sidebar {
            --bg-color: #1f2937;
            --border-color: #374151;
            --text-color: #f9fafb;
            --text-secondary: #9ca3af;
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
      `}</style>
    </div>
  );
};

export default TableOfContents;