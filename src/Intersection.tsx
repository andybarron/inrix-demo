import React from 'react';
import styled from 'styled-components';
import { EDGE_SEPARATOR, LANE_CLICK_RADIUS, ILane, ILaneMap, IEdges } from './constants';

interface IIntersectionProps {
  edges: IEdges,
  height: number,
  imageUrl: string,
  laneMap: ILaneMap,
  onEdgeUpdate: (edge: string, connected: boolean) => void;
  width: number,
}

const Container = styled.div`
  position: relative;
`;

const Canvas = styled.canvas`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
`;

export default function Intersection({
  edges,
  height,
  imageUrl,
  laneMap,
  onEdgeUpdate,
  width,
}: IIntersectionProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [selectedLane, setSelectedLane] = React.useState<ILane | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    canvas.width = canvas.width; // hack to fully clear & reset canvas & context
    const ctx = canvas.getContext('2d')!;
    ctx.save();
    ctx.font = '12px arial';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'magenta';
    ctx.fillStyle = 'magenta';
    for (const edge of Object.keys(edges)) {
      if (!edges[edge]) {
        continue;
      }
      const [start, end] = edge.split(EDGE_SEPARATOR);
      const a = laneMap[start];
      const b = laneMap[end];
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.fillRect(b.x - 5, b.y - 5, 10, 10);
    }
    for (const lane of Object.values(laneMap)) {
      const selected = selectedLane && lane.name === selectedLane.name;
      ctx.fillStyle = selected ? 'red' : 'black';
      ctx.fillText(lane.name, lane.x - 12, lane.y - 6);
    }
    ctx.restore();
    console.log('rendered');
  });

  const onCanvasClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const bounds = canvas.getBoundingClientRect();
  	const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    const sortedLanes = Object.values(laneMap)
    	.map(lane => {
        const dx = x - lane.x;
        const dy = y - lane.y;
        return {
          lane,
          distance: Math.sqrt(dx ** 2 + dy ** 2),
        };
      })
      .sort((a, b) => a.distance - b.distance);
    const closest = sortedLanes[0];
    if (closest.distance > LANE_CLICK_RADIUS) {
      return;
    }
    const { lane } = closest;
    if (selectedLane) {
      // TODO: Link!
      if (selectedLane.name !== lane.name) {
        const edge = selectedLane.name + EDGE_SEPARATOR + lane.name;
        onEdgeUpdate(edge, !edges[edge])
      }
      setSelectedLane(null);
    } else {
      setSelectedLane(lane);
    }
  };

  return (
    <Container>
      <img src={imageUrl} width={width} height={height} />
      <Canvas ref={canvasRef} width={width} height={height} onClick={onCanvasClick} />
    </Container>
  );
}
