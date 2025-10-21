import React, { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  blockMap: any; // Notion block map từ react-notion-x
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ blockMap }) => {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Trích xuất headings từ blockMap
    const extractHeadings = () => {
      const headings: TocItem[] = [];
      
      if (!blockMap?.block) return headings;

      Object.keys(blockMap.block).forEach((key) => {
        const block = blockMap.block[key]?.value;
        if (!block) return;

        const type = block.type;
        
        // Lấy H1, H2, H3
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
  }, [blockMap]);

  useEffect(() => {
    // Theo dõi scroll để highlight heading hiện tại
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
    <div className="table-of-contents">
      <h3 className="toc-title">Mục lục</h3>
      <nav className="toc-nav">
        <ul className="toc-list">
          {toc.map((item) => (
            <li
              key={item.id}
              className={`toc-item toc-level-${item.level} ${
                activeId === item.id ? 'active' : ''
              }`}
              style={{ paddingLeft: `${(item.level - 1) * 16}px` }}
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

      <style jsx>{`
        .table-of-contents {
          background: var(--bg-color, #f7f7f7);
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 32px;
          border: 1px solid var(--border-color, #e0e0e0);
        }

        .toc-title {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 12px 0;
          color: var(--text-color, #000);
        }

        .toc-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .toc-item {
          margin: 8px 0;
          transition: all 0.2s ease;
        }

        .toc-item a {
          color: var(--text-secondary, #666);
          text-decoration: none;
          cursor: pointer;
          display: block;
          padding: 4px 8px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .toc-item a:hover {
          background: var(--hover-bg, #e8e8e8);
          color: var(--text-color, #000);
        }

        .toc-item.active a {
          color: var(--primary-color, #0066cc);
          font-weight: 500;
          background: var(--active-bg, #e3f2fd);
        }

        .toc-level-1 {
          font-weight: 500;
        }

        .toc-level-2 {
          font-size: 14px;
        }

        .toc-level-3 {
          font-size: 13px;
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .table-of-contents {
            --bg-color: #1a1a1a;
            --border-color: #333;
            --text-color: #fff;
            --text-secondary: #aaa;
            --hover-bg: #2a2a2a;
            --active-bg: #1e3a5f;
            --primary-color: #4d9fff;
          }
        }

        [data-theme='dark'] .table-of-contents {
          --bg-color: #1a1a1a;
          --border-color: #333;
          --text-color: #fff;
          --text-secondary: #aaa;
          --hover-bg: #2a2a2a;
          --active-bg: #1e3a5f;
          --primary-color: #4d9fff;
        }
      `}</style>
    </div>
  );
};

export default TableOfContents;