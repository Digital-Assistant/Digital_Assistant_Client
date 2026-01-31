import svgPaths from "../imports/svg-s04gq19zek";
import { useState, useEffect, useRef, useCallback } from "react";
import { Tab } from "./Tab";
import { RecordingCard } from "./RecordingCard";
import { RecordingDetail } from "./RecordingDetail";
import { fetchSearchResults, fetchDomain, CONFIG, getRowObject } from "@digital-assistant/core";
import { useAuth } from "../contexts/AuthContext";

// Define interface for recording data
interface Recording {
  _id: string; // Ensure this matches API response
  status: string;
  name: string;
  // Add other properties as needed based on API response
}

// Define props interface
interface SearchResultsProps {
  searchKeyword?: string;
}

export function SearchResults({ searchKeyword = "" }: SearchResultsProps) {
  const { isAuthenticated, isInitialized } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "trending" | "popular" | "latest"
  >("trending");
  const [selectedRecording, setSelectedRecording] = useState<{ id: number; title: string } | null>(null);

  // Data state
  const [searchResults, setSearchResults] = useState<Recording[]>([]);
  const [page, setPage] = useState(0);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Debounce search keyword
  const [debouncedKeyword, setDebouncedKeyword] = useState(searchKeyword);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(searchKeyword);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchKeyword]);

  const loadingRef = useRef(false);

  const getSearchResults = useCallback(async (_page: number = 0, refetch = false) => {
    if (!isInitialized || !isAuthenticated) return;

    // If resetting (page 0 and refetch), or loading a new page
    if (_page === 0 && refetch) {
      setSearchResults([]);
      setHasMorePages(true);
    }

    if (loadingRef.current && !refetch) return;

    loadingRef.current = true;
    setIsLoading(true);

    try {
      let domain = fetchDomain();
      // Assuming fetchSearchResultsSDK signature from App.tsx matches fetchSearchResults here or similar
      // Adjust params as per core package definition
      const response = await fetchSearchResults({
        keyword: debouncedKeyword, // Use debounced keyword
        page: _page,
        domain: encodeURI(domain),
        // Add additional params locally if needed, similar to App.tsx logic
      });

      // App.tsx logic suggests response is an array of recordings
      const newRecordings = response || [];

      if (newRecordings.length > 0) {
        setHasMorePages(newRecordings.length >= CONFIG.enableInfiniteScrollPageLength);

        setSearchResults(prev => {
          if (_page === 0) return newRecordings;
          return [...prev, ...newRecordings];
        });
        setPage(_page);
      } else {
        setHasMorePages(false);
      }
    } catch (error) {
      console.error("Error fetching recordings:", error);
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, [isAuthenticated, isInitialized, debouncedKeyword]); // Depend on debouncedKeyword directly

  // Initial load & Search trigger
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      getSearchResults(0, true);
    }
  }, [getSearchResults, isInitialized, isAuthenticated]); // getSearchResults now depends on debouncedKeyword

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMorePages && !isLoading) {
          getSearchResults(page + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMorePages, isLoading, page, getSearchResults]);


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
      <div className="w-full flex flex-col gap-[10px] pb-4">
        {searchResults.map((recording: any) => {
          const { sequenceName } = getRowObject(recording);
          return (
            <RecordingCard
              key={recording._id} // Assuming _id is unique
              title={sequenceName || "Untitled Recording"}
              onClick={() => setSelectedRecording({ id: recording._id, title: sequenceName })}
            />
          );
        })}

        {/* Loader / Intersection Target */}
        <div ref={observerTarget} className="h-10 w-full flex justify-center items-center">
          {isLoading && <span className="text-gray-500 text-sm">Loading more...</span>}
        </div>

        {!isLoading && searchResults.length === 0 && (
          <div className="text-center text-gray-500 py-8">No recordings found.</div>
        )}
      </div>
    </>
  );
}