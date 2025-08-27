import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../../store/store';
import { generatePlantUMLSvg, selectPlantUMLData } from '../../../../store/slices/plantUMLSlice';

interface PlantUMLProps {
  chart: string;
}


const PlantUMLRenderer: React.FC<PlantUMLProps> = ({ chart }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { svg, isLoading, error } = useSelector((state: RootState) => 
    selectPlantUMLData(state, chart)
  );

  useEffect(() => {
    if (chart && !svg && !isLoading) {
      dispatch(generatePlantUMLSvg(chart));
    }
  }, [chart, svg, isLoading, dispatch]);

  if (error) {
    return (
      <div style={{ color: 'red', padding: '8px', border: '1px solid red', borderRadius: '4px' }}>
        <strong>PlantUML Error:</strong> {error}
        <pre><code>{chart}</code></pre>
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading PlantUML diagram...</div>;
  }

  if (!svg) {
    return <pre><code>{chart}</code></pre>;
  }

  return <div dangerouslySetInnerHTML={{ __html: svg }} style={{ maxWidth: '100%' }} />;
};

export default PlantUMLRenderer;
