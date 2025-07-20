import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';
import { useTheme } from '@mui/material';

interface MermaidProps {
  chart: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const [svg, setSvg] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (chart) {
      mermaid.initialize({
        startOnLoad: false,
        theme: theme.palette.mode === 'dark' ? 'dark' : 'neutral',
        securityLevel: 'loose',
      });

      const renderMermaid = async () => {
        try {
          const id = `mermaid-div-${Math.random().toString(36).substring(2, 9)}`;
          const { svg } = await mermaid.render(id, chart);
          setSvg(svg);
        } catch (error) {
          console.error('Error rendering mermaid chart:', error);
          setSvg(null);
        }
      };

      renderMermaid();
    }
  }, [chart, theme.palette.mode]);

  if (!svg) {
    return <pre><code>{chart}</code></pre>;
  }

  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
};

export default Mermaid;