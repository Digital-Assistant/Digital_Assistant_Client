import svgPaths from "../imports/svg-s04gq19zek";
import { useState } from "react";
import { Tab } from "./Tab";
import { RecordingCard } from "./RecordingCard";
import { RecordingDetail } from "./RecordingDetail";

export function SearchResults() {
  const [activeTab, setActiveTab] = useState<
    "trending" | "popular" | "latest"
  >("trending");
  const [selectedRecording, setSelectedRecording] = useState<{ id: number; title: string } | null>(null);

  // Different content for each tab
  const trendingRecordings = [
    { id: 1, title: "Trending Recording 1" },
    { id: 2, title: "Viral Audio Clip" },
    { id: 3, title: "Trending Topic Discussion" },
  ];

  const popularRecordings = [
    { id: 4, title: "Popular Recording 1" },
    { id: 5, title: "Most Liked Audio" },
    { id: 6, title: "Popular Podcast Episode" },
  ];

  const latestRecordings = [
    { id: 7, title: "Latest Recording 1" },
    { id: 8, title: "Just Uploaded Audio" },
    { id: 9, title: "New Release Track" },
  ];

  // Get recordings based on active tab
  const getCurrentRecordings = () => {
    switch (activeTab) {
      case "trending":
        return trendingRecordings;
      case "popular":
        return popularRecordings;
      case "latest":
        return latestRecordings;
      default:
        return trendingRecordings;
    }
  };

  const recordings = getCurrentRecordings();

  // If a recording is selected, show the detail view
  if (selectedRecording) {
    return (
      <RecordingDetail 
        title={selectedRecording.title}
        onBack={() => setSelectedRecording(null)}
      />
    );
  }

  return (
    <>
      {/* Tabs */}
      <nav
        className="w-full h-10 flex gap-0 mb-6"
        aria-label="Recording filters"
      >
        <Tab
          label="Trending"
          iconPath={svgPaths.p1e798d80}
          isSelected={activeTab === "trending"}
          onClick={() => setActiveTab("trending")}
        />
        <Tab
          label="Popular"
          iconPath={svgPaths.p104c9d00}
          isSelected={activeTab === "popular"}
          onClick={() => setActiveTab("popular")}
        />
        <Tab
          label="Latest"
          iconPath={svgPaths.pf69a800}
          isSelected={activeTab === "latest"}
          onClick={() => setActiveTab("latest")}
        />
      </nav>

      {/* Recording Cards */}
      <div className="w-full flex flex-col gap-[10px]">
        {recordings.map((recording) => (
          <RecordingCard
            key={recording.id}
            title={recording.title}
            onClick={() => setSelectedRecording(recording)}
          />
        ))}
      </div>
    </>
  );
}