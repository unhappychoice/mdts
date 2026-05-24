import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';
import { useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import { RootState } from '../../../../store/store';

interface MermaidProps {
  chart: string;
}

/**
 * Styled container that isolates mermaid SVG from global CSS pollution.
 *
 * Mermaid flowcharts render labels inside SVG <foreignObject> elements,
 * which contain standard HTML (e.g. <p>, <div>). These elements are
 * vulnerable to global typography styles (margins, line-height, etc.).
 *
 * We use scoped CSS via MUI styled() to reset only the elements inside
 * the mermaid wrapper, without affecting the rest of the page.
 */
const MermaidContainer = styled('div')({
  overflow: 'visible',
  maxWidth: '100%',
  // Allow foreignObject content to overflow its boundary when mermaid's
  // size calculation is slightly off.
  '& foreignObject': {
    overflow: 'visible',
  },
  // Reset global CSS pollution inside foreignObject (e.g. MUI CssBaseline,
  // markdown typography) so that text metrics match what mermaid computed.
  '& foreignObject p, & foreignObject div, & foreignObject span': {
    margin: 0,
    padding: 0,
    lineHeight: 1.5,
  },
  // Slightly round the edge-label background rect for visual polish.
  '& .edgeLabel .labelBkg': {
    rx: 4,
    ry: 4,
  },
});

const MermaidRenderer: React.FC<MermaidProps> = ({ chart }) => {
  const [svg, setSvg] = useState<string | null>(null);
  const theme = useTheme();
  const { fontFamily } = useSelector((state: RootState) => state.config);

  useEffect(() => {
    if (!chart) {
      return;
    }

    const renderMermaid = async () => {
      try {
        // Wait for fonts to load before rendering to ensure accurate text measurement
        if (document.fonts) {
          await document.fonts.ready;
        }

        mermaid.initialize({
          startOnLoad: false,
          theme: theme.palette.mode === 'dark' ? 'dark' : 'neutral',
          securityLevel: 'loose',
          fontFamily: fontFamily || 'inherit',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
          },
        });

        const id = `mermaid-div-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        setSvg(svg);
      } catch (error) {
        console.error('Error rendering mermaid chart:', error);
        setSvg(null);
      }
    };

    renderMermaid();
  }, [chart, theme.palette.mode, fontFamily]);

  if (!svg) {
    return <pre><code>{chart}</code></pre>;
  }

  return (
    <MermaidContainer
      className="mermaid-wrapper"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default MermaidRenderer;
