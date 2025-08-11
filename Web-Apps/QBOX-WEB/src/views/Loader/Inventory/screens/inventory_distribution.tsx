import HotboxGrid from "@view/Loader/Common widgets/inventory_distribution_grid";
import { useState } from "react";

interface Hotbox {
  id: number;
  title: string;
  location: string;
  itemCount: number;
  isActive: boolean;
  progressPercent: number;
}

const HotboxPage: React.FC = () => {
  const hotboxData: Hotbox[] = [
    {
      id: 103,
      title: "Hotboxes #103",
      location: "Sholinganallur",
      itemCount: 12,
      isActive: true,
      progressPercent: 55
    },
    {
      id: 104,
      title: "Hotboxes #104",
      location: "Sholinganallur",
      itemCount: 87,
      isActive: false,
      progressPercent: 0
    },
    {
      id: 105,
      title: "Hotboxes #105",
      location: "Adyar",
      itemCount: 43,
      isActive: false,
      progressPercent: 25
    },
    {
      id: 106,
      title: "Hotboxes #106",
      location: "T Nagar",
      itemCount: 19,
      isActive: true,
      progressPercent: 78
    },
  ];

  const [selectedHotboxId, setSelectedHotboxId] = useState<number | null>(null);

  const handleHotboxClick = (id: number) => {
    setSelectedHotboxId(id);
    console.log(`Hotbox #${id} selected`);
  };

  return (
    <>
      <div className="p-4">
        <HotboxGrid
          hotboxes={hotboxData}
          onHotboxClick={handleHotboxClick}
          gridColumns={3}
          gap={4}
          containerClassName="mb-8"
        />
      </div>
    </>
  );
};


export default HotboxPage;