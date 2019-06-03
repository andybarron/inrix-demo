import React from 'react';
import Intersection from './Intersection';
import { IMAGE_URL, WIDTH, HEIGHT, LANE_MAP, IEdges } from './constants';

function App() {
  const [edges, setEdges] = React.useState<IEdges>({
    // ['A' + EDGE_SEPARATOR + 'L']: true,
  });
  function onEdgeUpdate(edge: string, connected: boolean) {
    setEdges(prev => ({ ...prev, [edge]: connected }));
  }
  return (
    <React.Fragment>
      <Intersection
        edges={edges}
        height={HEIGHT}
        imageUrl={IMAGE_URL}
        laneMap={LANE_MAP}
        onEdgeUpdate={onEdgeUpdate}
        width={WIDTH}
      />
      <pre>{'DEBUG\n-----\n' + JSON.stringify({ edges }, null, 2)}</pre>
    </React.Fragment>
  );
}

export default App;
