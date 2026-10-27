import { useEffect, useState } from "react";

const currentEnvironment = (): string =>
  String((window as any).UDAGlobalConfig?.environment ?? "PROD").toUpperCase();

/** "TEST" tag next to the "Beta" tag. Renders nothing for PROD. Follows UDAConfigUpdated. */
export function EnvironmentBadge({ className = "" }: { className?: string }) {
  const [environment, setEnvironment] = useState(currentEnvironment);

  useEffect(() => {
    const update = () => setEnvironment(currentEnvironment());
    window.addEventListener("UDAConfigUpdated", update);
    window.addEventListener("UDASdkReady", update);
    update();
    return () => {
      window.removeEventListener("UDAConfigUpdated", update);
      window.removeEventListener("UDASdkReady", update);
    };
  }, []);

  if (environment !== "TEST") return null;
  return (
    <span
      data-testid="udan-env-badge"
      className={`bg-[#f59e0b] text-[#1e1e1e] text-[10px] font-['Raleway',sans-serif] px-1 rounded h-[14px] flex items-center ${className}`}
    >
      TEST
    </span>
  );
}
