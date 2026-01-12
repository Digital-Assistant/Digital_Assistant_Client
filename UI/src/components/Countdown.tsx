interface CountdownProps {
  count: number;
}

export function Countdown({ count }: CountdownProps) {
  return (
    <div className="relative shrink-0 w-full" data-name="Starting Recording Container">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col font-['Raleway',sans-serif] font-semibold gap-[10px] items-center justify-center leading-[0] p-[16px] relative text-[#1c1c1e] text-center w-full">
          <div className="flex flex-col justify-center min-w-full relative shrink-0 text-[24px] w-[min-content]">
            <p className="leading-[normal]">Starting Recording in</p>
          </div>
          <div className="flex flex-col justify-center relative shrink-0 text-[96px] text-nowrap">
            <p className="leading-[normal] whitespace-pre">{count}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
