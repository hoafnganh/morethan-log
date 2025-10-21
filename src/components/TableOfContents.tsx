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
  const [isHovered, setIsHovered] = useState<boolean>(false);

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
          
          let text = '';
          if (block.properties?.title) {
            text = block.properties.title
              .map((item: any) => {
                if (Array.isArray(item)) {
                  return item[0];
                }
                return '';
              })
              .join('');
          }
          
          if (text) {
            headings.push({
              id: key.replace(/-/g, ''),
              text,
              level
            });
          }
        }
      });

      return headings;
    };

    setToc(extractHeadings());
  }, [recordMap]);

  useEffect(() => {
    const handleScroll = () => {
      if (toc.length === 0) return;

      const headingElements: Array<{ id: string; top: number }> = [];
      
      toc.forEach(item => {
        const heading = document.querySelector(`.notion-block-${item.id}`);
        
        if (heading) {
          const rect = heading.getBoundingClientRect();
          headingElements.push({
            id: item.id,
            top: rect.top + window.scrollY
          });
        }
      });

      const scrollPosition = window.scrollY + 120;
      
      for (let i = headingElements.length - 1; i >= 0; i--) {
        if (scrollPosition >= headingElements[i].top) {
          setActiveId(headingElements[i].id);
          return;
        }
      }
      
      if (headingElements.length > 0) {
        setActiveId(headingElements[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [toc]);

  const scrollToHeading = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const heading = document.querySelector(`.notion-block-${id}`) as HTMLElement;
    
    if (heading) {
      const yOffset = -100;
      const y = heading.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({ top: y, behavior: 'smooth' });
      
      heading.classList.add('toc-flash');
      setTimeout(() => {
        heading.classList.remove('toc-flash');
      }, 1500);
    }
  };

  if (toc.length === 0) return null;

  return (
    <>
      <div 
        className={`notion-toc-container ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="notion-toc-bars">
          {toc.slice(0, 15).map((item) => (
            <div 
              key={item.id}
              className={`notion-toc-bar ${activeId === item.id ? 'active' : ''} level-${item.level}`}
              style={{
                width: item.level === 1 ? '24px' : item.level === 2 ? '18px' : '14px'
              }}
              title={item.text}
            />
          ))}
          {toc.length > 15 && <div className="notion-toc-bar-more">•••</div>}
        </div>

        <div className="notion-toc-panel">
          <div className="notion-toc-header">
            <span>📖 Mục lục</span>
          </div>
          <div className="notion-toc-content">
            {toc.map((item) => (
              <button
                key={item.id}
                className={`notion-toc-item ${activeId === item.id ? 'active' : ''} level-${item.level}`}
                onClick={(e) => scrollToHeading(e, item.id)}
                type="button"
                style={{
                  paddingLeft: `${(item.level - 1) * 18 + 16}px`
                }}
              >
                <span className="notion-toc-text">{item.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes toc-flash {
          0%, 100% { background-color: transparent; }
          50% { background-color: rgba(59, 130, 246, 0.25); }
        }

        .toc-flash {
          animation: toc-flash 1.5s ease;
          border-radius: 6px;
        }

        .notion-toc-container {
          position: fixed;
          top: 50%;
          right: 24px;
          transform: translateY(-50%);
          z-index: 1000;
        }

        /* Bars - đẹp hơn */
        .notion-toc-bars {
          display: flex;
          flex-direction: column;
          gap: 9px;
          padding: 12px 8px;
          align-items: flex-end;
          transition: opacity 0.25s ease;
          background: rgba(0, 0, 0, 0.06);
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .notion-toc-container.hovered .notion-toc-bars {
          opacity: 0;
          pointer-events: none;
        }

        .notion-toc-bar {
          height: 3px;
          background: linear-gradient(90deg, rgba(100, 100, 100, 0.5), rgba(100, 100, 100, 0.7));
          border-radius: 2px;
          transition: all 0.25s ease;
          cursor: pointer;
        }

        .notion-toc-bar.active {
          background: linear-gradient(90deg, rgb(59, 130, 246), rgb(37, 99, 235));
          height: 4px;
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
        }

        .notion-toc-bar:hover {
          transform: scaleX(1.1);
          opacity: 0.9;
        }

        .notion-toc-bar-more {
          font-size: 13px;
          font-weight: 600;
          color: rgba(100, 100, 100, 0.7);
          text-align: right;
          padding-right: 3px;
          letter-spacing: 2px;
        }

        /* Panel - CAO HƠN + ĐẸP HƠN */
        .notion-toc-panel {
          position: absolute;
          top: 0;
          right: 0;
          width: 320px;
          max-height: calc(100vh - 60px);
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 12px;
          box-shadow: 
            0 10px 40px rgba(0, 0, 0, 0.12),
            0 4px 12px rgba(0, 0, 0, 0.08);
          opacity: 0;
          visibility: hidden;
          transform: translateX(20px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .notion-toc-container.hovered .notion-toc-panel {
          opacity: 1;
          visibility: visible;
          transform: translateX(0);
        }

        .notion-toc-header {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          font-size: 15px;
          font-weight: 600;
          color: #1a202c;
          flex-shrink: 0;
          background: linear-gradient(180deg, rgba(248, 250, 252, 0.9), rgba(241, 245, 249, 0.8));
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "SF Pro Display", 
                       Roboto, "Helvetica Neue", Arial, sans-serif;
          letter-spacing: -0.02em;
        }

        .notion-toc-content {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 10px 0;
        }

        .notion-toc-item {
          display: block;
          width: 100%;
          padding: 10px 20px 10px 16px;
          font-size: 14px;
          color: #475569;
          background: none;
          border: none;
          border-left: 3px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          line-height: 1.6;
          text-align: left;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "SF Pro Text",
                       Roboto, "Helvetica Neue", Arial, sans-serif;
          letter-spacing: -0.01em;
        }

        .notion-toc-item:hover {
          background: linear-gradient(90deg, rgba(59, 130, 246, 0.06), rgba(59, 130, 246, 0.03));
          color: #1e293b;
          transform: translateX(2px);
        }

        .notion-toc-item:active {
          background: linear-gradient(90deg, rgba(59, 130, 246, 0.12), rgba(59, 130, 246, 0.06));
          transform: translateX(3px);
        }

        .notion-toc-item.active {
          color: rgb(37, 99, 235);
          background: linear-gradient(90deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.08));
          border-left-color: rgb(59, 130, 246);
          font-weight: 600;
        }

        .notion-toc-item.level-1 {
          font-weight: 600;
          color: #1e293b;
          font-size: 14.5px;
        }

        .notion-toc-item.level-2 {
          font-size: 13.5px;
          color: #475569;
          font-weight: 500;
        }

        .notion-toc-item.level-3 {
          font-size: 13px;
          color: #64748b;
          font-weight: 400;
        }

        .notion-toc-text {
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Custom scrollbar - ĐẸP HƠN */
        .notion-toc-content::-webkit-scrollbar {
          width: 8px;
        }

        .notion-toc-content::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.03);
          border-radius: 4px;
          margin: 8px 0;
        }

        .notion-toc-content::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(100, 116, 139, 0.3), rgba(100, 116, 139, 0.4));
          border-radius: 4px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        .notion-toc-content::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(100, 116, 139, 0.5), rgba(100, 116, 139, 0.6));
          background-clip: padding-box;
        }

        /* Dark mode - ĐẸP HƠN */
        @media (prefers-color-scheme: dark) {
          .notion-toc-bars {
            background: rgba(255, 255, 255, 0.08);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
          }

          .notion-toc-bar {
            background: linear-gradient(90deg, rgba(200, 200, 200, 0.5), rgba(220, 220, 220, 0.7));
          }

          .notion-toc-bar.active {
            background: linear-gradient(90deg, rgb(96, 165, 250), rgb(59, 130, 246));
            box-shadow: 0 0 10px rgba(96, 165, 250, 0.6);
          }

          .notion-toc-panel {
            background: rgba(30, 35, 42, 0.98);
            border-color: rgba(255, 255, 255, 0.1);
            box-shadow: 
              0 10px 40px rgba(0, 0, 0, 0.6),
              0 4px 12px rgba(0, 0, 0, 0.4);
          }

          .notion-toc-header {
            color: #f1f5f9;
            border-bottom-color: rgba(255, 255, 255, 0.08);
            background: linear-gradient(180deg, rgba(45, 52, 64, 0.9), rgba(38, 45, 56, 0.8));
          }

          .notion-toc-item {
            color: #cbd5e0;
          }

          .notion-toc-item:hover {
            background: linear-gradient(90deg, rgba(96, 165, 250, 0.12), rgba(96, 165, 250, 0.06));
            color: #f1f5f9;
          }

          .notion-toc-item.active {
            color: rgb(125, 211, 252);
            background: linear-gradient(90deg, rgba(96, 165, 250, 0.2), rgba(96, 165, 250, 0.12));
            border-left-color: rgb(96, 165, 250);
          }

          .notion-toc-item.level-1 {
            color: #f1f5f9;
          }

          .notion-toc-item.level-2 {
            color: #cbd5e0;
          }

          .notion-toc-item.level-3 {
            color: #94a3b8;
          }

          .notion-toc-content::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
          }

          .notion-toc-content::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, rgba(148, 163, 184, 0.3), rgba(148, 163, 184, 0.4));
          }

          .notion-toc-content::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, rgba(148, 163, 184, 0.5), rgba(148, 163, 184, 0.6));
          }
        }

        [data-theme='dark'] .notion-toc-bars {
          background: rgba(255, 255, 255, 0.08);
        }

        [data-theme='dark'] .notion-toc-bar {
          background: linear-gradient(90deg, rgba(200, 200, 200, 0.5), rgba(220, 220, 220, 0.7));
        }

        [data-theme='dark'] .notion-toc-bar.active {
          background: linear-gradient(90deg, rgb(96, 165, 250), rgb(59, 130, 246));
        }

        [data-theme='dark'] .notion-toc-panel {
          background: rgba(30, 35, 42, 0.98);
          border-color: rgba(255, 255, 255, 0.1);
        }

        [data-theme='dark'] .notion-toc-header {
          color: #f1f5f9;
          background: linear-gradient(180deg, rgba(45, 52, 64, 0.9), rgba(38, 45, 56, 0.8));
        }

        [data-theme='dark'] .notion-toc-item {
          color: #cbd5e0;
        }

        [data-theme='dark'] .notion-toc-item:hover {
          background: linear-gradient(90deg, rgba(96, 165, 250, 0.12), rgba(96, 165, 250, 0.06));
          color: #f1f5f9;
        }

        [data-theme='dark'] .notion-toc-item.active {
          color: rgb(125, 211, 252);
          background: linear-gradient(90deg, rgba(96, 165, 250, 0.2), rgba(96, 165, 250, 0.12));
          border-left-color: rgb(96, 165, 250);
        }

        @media (max-width: 1024px) {
          .notion-toc-container {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default TableOfContents;