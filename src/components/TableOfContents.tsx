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
              id: key,
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

      // Tìm heading bằng class pattern
      const headingElements: Array<{ id: string; top: number }> = [];
      
      toc.forEach(item => {
        // Tìm heading element bằng class chứa block ID
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
    
    console.log('Scrolling to block ID:', id);
    
    // Tìm heading element bằng class chứa block ID
    const heading = document.querySelector(`.notion-block-${id}`) as HTMLElement;
    
    console.log('Found element:', heading);
    
    if (heading) {
      const yOffset = -100;
      const y = heading.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({ top: y, behavior: 'smooth' });
      
      // Visual feedback
      heading.classList.add('toc-flash');
      setTimeout(() => {
        heading.classList.remove('toc-flash');
      }, 1500);
      
      console.log('Scrolled successfully!');
    } else {
      console.error('Heading element not found for ID:', id);
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
                width: item.level === 1 ? '20px' : item.level === 2 ? '16px' : '12px'
              }}
              title={item.text}
            />
          ))}
          {toc.length > 15 && <div className="notion-toc-bar-more">•••</div>}
        </div>

        <div className="notion-toc-panel">
          <div className="notion-toc-header">
            <span>Mục lục</span>
          </div>
          <div className="notion-toc-content">
            {toc.map((item) => (
              <button
                key={item.id}
                className={`notion-toc-item ${activeId === item.id ? 'active' : ''} level-${item.level}`}
                onClick={(e) => scrollToHeading(e, item.id)}
                type="button"
                style={{
                  paddingLeft: `${(item.level - 1) * 16 + 12}px`
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
          50% { background-color: rgba(59, 130, 246, 0.3); }
        }

        .toc-flash {
          animation: toc-flash 1.5s ease;
          border-radius: 4px;
        }

        .notion-toc-container {
          position: fixed;
          top: 50%;
          right: 20px;
          transform: translateY(-50%);
          z-index: 1000;
        }

        .notion-toc-bars {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 10px 6px;
          align-items: flex-end;
          transition: opacity 0.2s ease;
          background: rgba(0, 0, 0, 0.08);
          border-radius: 6px;
        }

        .notion-toc-container.hovered .notion-toc-bars {
          opacity: 0;
          pointer-events: none;
        }

        .notion-toc-bar {
          height: 3px;
          background: rgba(100, 100, 100, 0.6);
          border-radius: 2px;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .notion-toc-bar.active {
          background: rgb(35, 131, 226);
          height: 4px;
          box-shadow: 0 0 4px rgba(35, 131, 226, 0.4);
        }

        .notion-toc-bar.level-1 {
          background: rgba(100, 100, 100, 0.7);
        }

        .notion-toc-bar.level-2 {
          background: rgba(100, 100, 100, 0.5);
        }

        .notion-toc-bar.level-3 {
          background: rgba(100, 100, 100, 0.4);
        }

        .notion-toc-bar-more {
          font-size: 12px;
          font-weight: bold;
          color: rgba(100, 100, 100, 0.6);
          text-align: right;
          padding-right: 2px;
        }

        .notion-toc-panel {
          position: absolute;
          top: 0;
          right: 0;
          width: 300px;
          max-height: calc(100vh - 100px);
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          opacity: 0;
          visibility: hidden;
          transform: translateX(20px);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
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
          padding: 14px 18px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
          flex-shrink: 0;
          background: rgba(248, 249, 250, 0.8);
        }

        .notion-toc-content {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 8px 0;
        }

        .notion-toc-item {
          display: block;
          width: 100%;
          padding: 8px 18px 8px 12px;
          font-size: 13px;
          color: #4a5568;
          background: none;
          border: none;
          border-left: 3px solid transparent;
          cursor: pointer;
          transition: all 0.15s ease;
          line-height: 1.6;
          text-align: left;
          font-family: inherit;
        }

        .notion-toc-item:hover {
          background: rgba(59, 130, 246, 0.08);
          color: #1a202c;
        }

        .notion-toc-item:active {
          background: rgba(59, 130, 246, 0.15);
        }

        .notion-toc-item.active {
          color: rgb(35, 131, 226);
          background: rgba(35, 131, 226, 0.12);
          border-left-color: rgb(35, 131, 226);
          font-weight: 600;
        }

        .notion-toc-item.level-1 {
          font-weight: 600;
          color: #2d3748;
        }

        .notion-toc-item.level-2 {
          font-size: 12.5px;
          color: #4a5568;
        }

        .notion-toc-item.level-3 {
          font-size: 12px;
          color: #718096;
        }

        .notion-toc-text {
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .notion-toc-content::-webkit-scrollbar {
          width: 8px;
        }

        .notion-toc-content::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.02);
          border-radius: 4px;
        }

        .notion-toc-content::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }

        .notion-toc-content::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }

        @media (prefers-color-scheme: dark) {
          .notion-toc-bars {
            background: rgba(255, 255, 255, 0.1);
          }

          .notion-toc-bar {
            background: rgba(200, 200, 200, 0.6);
          }

          .notion-toc-bar.active {
            background: rgb(96, 165, 250);
            box-shadow: 0 0 6px rgba(96, 165, 250, 0.5);
          }

          .notion-toc-panel {
            background: rgba(30, 35, 40, 0.98);
            border-color: rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
          }

          .notion-toc-header {
            color: #f7fafc;
            border-bottom-color: rgba(255, 255, 255, 0.1);
            background: rgba(40, 45, 50, 0.8);
          }

          .notion-toc-item {
            color: #cbd5e0;
          }

          .notion-toc-item:hover {
            background: rgba(96, 165, 250, 0.15);
            color: #f7fafc;
          }

          .notion-toc-item.active {
            color: rgb(96, 165, 250);
            background: rgba(96, 165, 250, 0.2);
            border-left-color: rgb(96, 165, 250);
          }

          .notion-toc-item.level-1 {
            color: #e2e8f0;
          }

          .notion-toc-item.level-2 {
            color: #cbd5e0;
          }

          .notion-toc-item.level-3 {
            color: #a0aec0;
          }
        }

        [data-theme='dark'] .notion-toc-bars {
          background: rgba(255, 255, 255, 0.1);
        }

        [data-theme='dark'] .notion-toc-bar {
          background: rgba(200, 200, 200, 0.6);
        }

        [data-theme='dark'] .notion-toc-bar.active {
          background: rgb(96, 165, 250);
        }

        [data-theme='dark'] .notion-toc-panel {
          background: rgba(30, 35, 40, 0.98);
          border-color: rgba(255, 255, 255, 0.1);
        }

        [data-theme='dark'] .notion-toc-header {
          color: #f7fafc;
          background: rgba(40, 45, 50, 0.8);
        }

        [data-theme='dark'] .notion-toc-item {
          color: #cbd5e0;
        }

        [data-theme='dark'] .notion-toc-item:hover {
          background: rgba(96, 165, 250, 0.15);
          color: #f7fafc;
        }

        [data-theme='dark'] .notion-toc-item.active {
          color: rgb(96, 165, 250);
          background: rgba(96, 165, 250, 0.2);
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