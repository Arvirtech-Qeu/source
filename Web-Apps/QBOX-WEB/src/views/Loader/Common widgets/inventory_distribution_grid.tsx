import { Box } from "lucide-react";
import ProgressContainer from "./inventory_distribution_progress";

interface Hotbox {
    id: number;
    title: string;
    location: string;
    itemCount: number;
    isActive: boolean;
    progressPercent: number;
  }
  
  // Props for the HotboxGrid component
  interface HotboxGridProps {
    hotboxes: Hotbox[];
    onHotboxClick?: (id: number) => void;
    gridColumns?: number;
    gap?: number;
    containerClassName?: string;
  }
  
  // The main HotboxGrid component
  const HotboxGrid: React.FC<HotboxGridProps> = ({
    hotboxes,
    onHotboxClick,
    gridColumns = 3,
    gap = 4,
    containerClassName = ''
  }) => {
    // Dynamically set the grid columns based on the prop
    const gridClass = `grid-cols-1 md:grid-cols-2 lg:grid-cols-${gridColumns}`;
    const gapClass = `gap-${gap}`;
    
    return (
      <div className={`grid ${gridClass} ${gapClass} ${containerClassName}`}>
        {hotboxes.map(hotbox => (
          <ProgressContainer
            key={hotbox.id}
            title={hotbox.title}
            location={hotbox.location}
            itemCount={hotbox.itemCount}
            isActive={hotbox.isActive}
            progressPercent={hotbox.progressPercent}
            progressLabel="Capacity"
            icon={<Box size={20} />}
            onClick={() => onHotboxClick && onHotboxClick(hotbox.id)}
          />
        ))}
      </div>
    );
  };

  export default HotboxGrid;
  