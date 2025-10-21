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
      const headingElements: Array<{ id: string; top: number }> = [];
      
      toc.forEach(item => {
        const element = document.querySelector(`.notion-block-${item.id}`);
        if (element) {
          const rect = element.getBoundingClientRect();
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

  const scrollToHeading = (id: string) => {
    const element = document.querySelector(`.notion-block-${id}`);
    
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({ top: y, behavior: 'smooth' });
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
        {/* Icon bars - hiển thị khi không hover */}
        <div className="notion-toc-bars">
          {toc.slice(0, 15).map((item, index) => (
            <div 
              key={item.id}
              className={`notion-toc-bar ${activeId === item.id ? 'active' : ''} level-${item.level}`}
              style={{
                width: item.level === 1 ? '16px' : item.level === 2 ? '12px' : '8px'
              }}
            />
          ))}
          {toc.length > 15 && <div className="notion-toc-bar-more">...</div>}
        </div>

        {/* Panel mục lục - hiển thị khi hover */}
        <div className="notion-toc-panel">
          <div className="notion-toc-header">
            <span>Mục lục</span>
          </div>
          <div className="notion-toc-content">
            {toc.map((item) => (
              <div
                key={item.id}
                className={`notion-toc-item ${activeId === item.id ? 'active' : ''} level-${item.level}`}
                onClick={() => scrollToHeading(item.id)}
                style={{
                  paddingLeft: `${(item.level - 1) * 16 + 12}px`
                }}
              >
                <span className="notion-toc-text">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .notion-toc-container {
          position: fixed;
          top: 50%;
          right: 16px;
          transform: translateY(-50%);
          z-index: 1000;
          pointer-events: auto;
        }

        /* Bars - mặc định */
        .notion-toc-bars {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 8px 4px;
          align-items: flex-end;
          transition: opacity 0.2s ease;
        }

        .notion-toc-container.hovered .notion-toc-bars {
          opacity: 0;
          pointer-events: none;
        }

        .notion-toc-bar {
          height: 2px;
          background: rgba(55, 53, 47, 0.3);
          border-radius: 1px;
          transition: all 0.2s ease;
        }

        .notion-toc-bar.active {
          background: rgba(35, 131, 226, 0.8);
          height: 3px;
        }

        .notion-toc-bar.level-1 {
          background: rgba(55, 53, 47, 0.4);
        }

        .notion-toc-bar.level-2 {
          background: rgba(55, 53, 47, 0.3);
        }

        .notion-toc-bar.level-3 {
          background: rgba(55, 53, 47, 0.2);
        }

        .notion-toc-bar-more {
          font-size: 10px;
          color: rgba(55, 53, 47, 0.4);
          text-align: right;
          padding-right: 2px;
        }

        /* Panel - khi hover */
        .notion-toc-panel {
          position: absolute;
          top: 0;
          right: 0;
          width: 280px;
          max-height: calc(100vh - 100px);
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          opacity: 0;
          visibility: hidden;
          transform: translateX(20px);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
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
          padding: 12px 16px;
          border-bottom: 1px solid rgba(55, 53, 47, 0.09);
          font-size: 14px;
          font-weight: 600;
          color: rgba(55, 53, 47, 0.8);
          flex-shrink: 0;
        }

        .notion-toc-content {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 4px 0;
        }

        .notion-toc-item {
          padding: 6px 16px 6px 12px;
          font-size: 13px;
          color: rgba(55, 53, 47, 0.65);
          cursor: pointer;
          transition: all 0.15s ease;
          line-height: 1.5;
          border-left: 2px solid transparent;
        }

        .notion-toc-item:hover {
          background: rgba(55, 53, 47, 0.04);
          color: rgba(55, 53, 47, 0.9);
        }

        .notion-toc-item.active {
          color: rgb(35, 131, 226);
          background: rgba(35, 131, 226, 0.08);
          border-left-color: rgb(35, 131, 226);
          font-weight: 500;
        }

        .notion-toc-item.level-1 {
          font-weight: 500;
        }

        .notion-toc-item.level-2 {
          font-size: 12.5px;
        }

        .notion-toc-item.level-3 {
          font-size: 12px;
          color: rgba(55, 53, 47, 0.5);
        }

        .notion-toc-text {
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Custom scrollbar cho panel */
        .notion-toc-content::-webkit-scrollbar {
          width: 6px;
        }

        .notion-toc-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .notion-toc-content::-webkit-scrollbar-thumb {
          background: rgba(55, 53, 47, 0.2);
          border-radius: 3px;
        }

        .notion-toc-content::-webkit-scrollbar-thumb:hover {
          background: rgba(55, 53, 47, 0.3);
        }

        /* Dark mode */
        @media (prefers-color-scheme: dark) {
          .notion-toc-bar {
            background: rgba(255, 255, 255, 0.3);
          }

          .notion-toc-bar.active {
            background: rgba(82, 156, 202, 0.9);
          }

          .notion-toc-panel {
            background: #2f3437;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
          }

          .notion-toc-header {
            color: rgba(255, 255, 255, 0.9);
            border-bottom-color: rgba(255, 255, 255, 0.09);
          }

          .notion-toc-item {
            color: rgba(255, 255, 255, 0.65);
          }

          .notion-toc-item:hover {
            background: rgba(255, 255, 255, 0.05);
            color: rgba(255, 255, 255, 0.9);
          }

          .notion-toc-item.active {
            color: rgb(82, 156, 202);
            background: rgba(82, 156, 202, 0.15);
            border-left-color: rgb(82, 156, 202);
          }

          .notion-toc-content::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
          }

          .notion-toc-content::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        }

        [data-theme='dark'] .notion-toc-bar {
          background: rgba(255, 255, 255, 0.3);
        }

        [data-theme='dark'] .notion-toc-bar.active {
          background: rgba(82, 156, 202, 0.9);
        }

        [data-theme='dark'] .notion-toc-panel {
          background: #2f3437;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }

        [data-theme='dark'] .notion-toc-header {
          color: rgba(255, 255, 255, 0.9);
          border-bottom-color: rgba(255, 255, 255, 0.09);
        }

        [data-theme='dark'] .notion-toc-item {
          color: rgba(255, 255, 255, 0.65);
        }

        [data-theme='dark'] .notion-toc-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.9);
        }

        [data-theme='dark'] .notion-toc-item.active {
          color: rgb(82, 156, 202);
          background: rgba(82, 156, 202, 0.15);
          border-left-color: rgb(82, 156, 202);
        }

        /* Mobile: Ẩn hoàn toàn */
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