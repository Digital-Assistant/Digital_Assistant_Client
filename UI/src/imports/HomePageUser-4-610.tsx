import svgPaths from "./svg-fzgblyt5s7";
import clsx from "clsx";
type Wrapper2Props = {
  additionalClassNames?: string;
};

function Wrapper2({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper2Props>) {
  return (
    <div className={clsx("relative shrink-0 size-[20px]", additionalClassNames)}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        {children}
      </svg>
    </div>
  );
}
type Wrapper1Props = {
  additionalClassNames?: string;
};

function Wrapper1({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper1Props>) {
  return (
    <div className={clsx("absolute size-[24px]", additionalClassNames)}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        {children}
      </svg>
    </div>
  );
}

function Wrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[32px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        {children}
      </svg>
    </div>
  );
}

function TabDefault2({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative rounded-[4px] shrink-0">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[10px] isolate items-center justify-center p-[8px] relative size-full">{children}</div>
      </div>
    </div>
  );
}

function MaterialSymbolsShare() {
  return (
    <Wrapper>
      <g id="material-symbols:share">
        <path d={svgPaths.p909ba00} fill="var(--fill-0, #A6A6A6)" id="Vector" />
      </g>
    </Wrapper>
  );
}

function View() {
  return (
    <Wrapper>
      <g id="view">
        <path clipRule="evenodd" d={svgPaths.p324ae600} fill="var(--fill-0, #A6A6A6)" fillRule="evenodd" id="Vector" />
      </g>
    </Wrapper>
  );
}
type RecordingInfoTextProps = {
  text: string;
};

function RecordingInfoText({ text }: RecordingInfoTextProps) {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <p className="[grid-area:1_/_1] font-['Roboto:Regular',sans-serif] font-normal leading-[normal] ml-0 mt-0 relative text-[#3e3e3e] text-[20px] text-justify text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </div>
  );
}

function PlayCircleOutline() {
  return (
    <div className="h-[48.898px] relative shrink-0 w-[48px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 49">
        <g clipPath="url(#clip0_1_208)" id="Play circle outline">
          <g id="Vector"></g>
          <path d={svgPaths.p1763cfc0} fill="var(--fill-0, black)" id="Vector_2" />
        </g>
        <defs>
          <clipPath id="clip0_1_208">
            <rect fill="white" height="48.8985" width="48" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function MaterialSymbolsSearchRounded() {
  return (
    <Wrapper1 additionalClassNames="left-[21px] top-[79px]">
      <g id="material-symbols:search-rounded">
        <path d={svgPaths.pded2700} fill="var(--fill-0, black)" id="Vector" />
      </g>
    </Wrapper1>
  );
}

function Group2() {
  return (
    <div className="absolute bottom-[87.71%] left-[78.53%] right-[0.23%] top-0">
      <div className="absolute bottom-[-24.84%] left-[-12.55%] right-[-12.55%] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 41">
          <g id="Group 1171276056">
            <g filter="url(#filter0_d_1_182)" id="Ellipse 9">
              <ellipse cx="19.9306" cy="16.1053" fill="var(--fill-0, white)" rx="15.9306" ry="16.1053" />
            </g>
            <path d={svgPaths.p32398380} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="40.2105" id="filter0_d_1_182" width="39.8612" x="1.49012e-07" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_182" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_182" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Component() {
  return (
    <div className="absolute h-[262.105px] left-[316px] top-[75px] w-[150px]" data-name="Component 4">
      <Group2 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute left-[398px] size-[32.211px] top-[74.89px]">
      <div className="absolute bottom-[-24.84%] left-[-12.42%] right-[-12.42%] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 41 41">
          <g id="Group 1171276049">
            <g filter="url(#filter0_d_4_619)" id="Ellipse 9">
              <circle cx="20.1053" cy="16.1053" fill="var(--fill-0, white)" r="16.1053" />
            </g>
            <g clipPath="url(#clip0_4_619)" id="Mic none">
              <g id="Vector"></g>
              <path d={svgPaths.p2d33f100} fill="var(--fill-0, #1C1C1E)" id="Vector_2" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="40.2105" id="filter0_d_4_619" width="40.2105" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4_619" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_4_619" mode="normal" result="shape" />
            </filter>
            <clipPath id="clip0_4_619">
              <rect fill="white" height="21.4737" transform="translate(9.36842 5.36842)" width="21.4737" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents left-[9px] top-[70px]">
      <div className="absolute bg-[#d9d9d9] h-[42px] left-[9px] rounded-[30px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[70px] w-[461px]" />
      <div className="absolute flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] left-[50px] text-[16px] text-black text-nowrap top-[91.5px] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre">Search</p>
      </div>
      <MaterialSymbolsSearchRounded />
      <Component />
      <Group />
    </div>
  );
}

function StarBorder() {
  return (
    <Wrapper2 additionalClassNames="z-[2]">
      <g clipPath="url(#clip0_1_222)" id="Star border">
        <g id="Vector"></g>
        <path d={svgPaths.p1e798d80} fill="var(--fill-0, white)" id="Vector_2" />
      </g>
      <defs>
        <clipPath id="clip0_1_222">
          <rect fill="white" height="20" width="20" />
        </clipPath>
      </defs>
    </Wrapper2>
  );
}

function TabSelected() {
  return (
    <div className="basis-0 bg-[#0c0c0c] grow h-full min-h-px min-w-px relative rounded-[4px] shrink-0" data-name="Tab - Selected">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[8px] isolate items-center justify-center p-[8px] relative size-full">
          <StarBorder />
          <div className="flex flex-col font-['Raleway:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#f6f6f6] text-[16px] text-center text-nowrap z-[1]">
            <p className="leading-[normal] whitespace-pre">Trending</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrendingUp() {
  return (
    <Wrapper2 additionalClassNames="z-[2]">
      <g clipPath="url(#clip0_1_215)" id="Trending up">
        <g id="Vector"></g>
        <path d={svgPaths.p104c9d00} fill="var(--fill-0, #3E3E3E)" id="Vector_2" />
      </g>
      <defs>
        <clipPath id="clip0_1_215">
          <rect fill="white" height="20" width="20" />
        </clipPath>
      </defs>
    </Wrapper2>
  );
}

function TabDefault() {
  return (
    <TabDefault2>
      <TrendingUp />
      <div className="flex flex-col font-['Raleway:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#3e3e3e] text-[16px] text-center text-nowrap z-[1]">
        <p className="leading-[normal] whitespace-pre">Popular</p>
      </div>
    </TabDefault2>
  );
}

function NewReleases() {
  return (
    <Wrapper2 additionalClassNames="z-[2]">
      <g clipPath="url(#clip0_1_212)" id="New releases">
        <path d={svgPaths.pf69a800} fill="var(--fill-0, #3E3E3E)" id="Vector" />
      </g>
      <defs>
        <clipPath id="clip0_1_212">
          <rect fill="white" height="20" width="20" />
        </clipPath>
      </defs>
    </Wrapper2>
  );
}

function TabDefault1() {
  return (
    <TabDefault2>
      <NewReleases />
      <div className="flex flex-col font-['Raleway:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#3e3e3e] text-[16px] text-center text-nowrap z-[1]">
        <p className="leading-[normal] whitespace-pre">Latest</p>
      </div>
    </TabDefault2>
  );
}

function TabsForRecording() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[12px] overflow-clip top-[131px] w-[456px]" data-name="Tabs for recording">
      <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
        <TabSelected />
      </div>
      <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
        <TabDefault />
      </div>
      <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
        <TabDefault1 />
      </div>
    </div>
  );
}

function Information() {
  return (
    <div className="basis-0 content-stretch flex gap-[8px] grow h-full items-center min-h-px min-w-px relative shrink-0" data-name="Information">
      <PlayCircleOutline />
      <RecordingInfoText text="Recording Title" />
    </div>
  );
}

function Actions() {
  return (
    <div className="content-stretch flex gap-[8px] h-full items-center justify-center relative shrink-0" data-name="Actions">
      <View />
      <MaterialSymbolsShare />
    </div>
  );
}

function MyRecordingCard() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[8px] h-[83px] items-center left-[12px] p-[24px] rounded-[4px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[183px] w-[456px]" data-name="My Recording Card">
      <Information />
      <Actions />
    </div>
  );
}

function Information1() {
  return (
    <div className="basis-0 content-stretch flex gap-[8px] grow h-full items-center min-h-px min-w-px relative shrink-0" data-name="Information">
      <PlayCircleOutline />
      <RecordingInfoText text="Recording Title" />
    </div>
  );
}

function Actions1() {
  return (
    <div className="content-stretch flex gap-[8px] h-full items-center justify-center relative shrink-0" data-name="Actions">
      <View />
      <MaterialSymbolsShare />
    </div>
  );
}

function MyRecordingCard1() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[8px] h-[83px] items-center left-[12px] p-[24px] rounded-[4px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[276px] w-[456px]" data-name="My Recording Card">
      <Information1 />
      <Actions1 />
    </div>
  );
}

function Information2() {
  return (
    <div className="basis-0 content-stretch flex gap-[8px] grow h-full items-center min-h-px min-w-px relative shrink-0" data-name="Information">
      <PlayCircleOutline />
      <RecordingInfoText text="Recording Title" />
    </div>
  );
}

function Actions2() {
  return (
    <div className="content-stretch flex gap-[8px] h-full items-center justify-center relative shrink-0" data-name="Actions">
      <View />
      <MaterialSymbolsShare />
    </div>
  );
}

function MyRecordingCard2() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[8px] h-[83px] items-center left-[12px] p-[24px] rounded-[4px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[369px] w-[456px]" data-name="My Recording Card">
      <Information2 />
      <Actions2 />
    </div>
  );
}

function Copyright() {
  return (
    <Wrapper2>
      <g clipPath="url(#clip0_1_204)" id="Copyright">
        <g id="Vector"></g>
        <path d={svgPaths.p2f395080} fill="var(--fill-0, #A7A7A7)" id="Vector_2" />
      </g>
      <defs>
        <clipPath id="clip0_1_204">
          <rect fill="white" height="20" width="20" />
        </clipPath>
      </defs>
    </Wrapper2>
  );
}

function Footer() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[23px] items-center justify-center left-1/2 overflow-clip top-[959px] translate-x-[-50%] w-[456px]" data-name="Footer">
      <p className="font-['Raleway:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#a7a7a7] text-[20px] text-nowrap whitespace-pre">Copyrights Reserved 2025</p>
      <Copyright />
    </div>
  );
}

function Group4() {
  return (
    <Wrapper1 additionalClassNames="left-[16.5px] top-[calc(50%-465px)] translate-y-[-50%]">
      <g id="Group 1171276058">
        <rect height="22" id="Rectangle 10" rx="3" stroke="var(--stroke-0, #8E8E93)" strokeWidth="2" width="22" x="1" y="1" />
        <path d="M5 18H19" id="Vector 1" stroke="var(--stroke-0, #8E8E93)" strokeLinecap="round" strokeWidth="2" />
      </g>
    </Wrapper1>
  );
}

function BetaTag() {
  return (
    <div className="absolute bg-[#cccccc] h-[14px] left-[261.11px] overflow-clip rounded-[4px] top-[32px] w-[30.199px]" data-name="Beta Tag">
      <p className="absolute font-['Raleway:Regular',sans-serif] font-normal leading-[normal] left-[4px] text-[#1e1e1e] text-[10px] text-nowrap top-px whitespace-pre">Beta</p>
    </div>
  );
}

function Heading() {
  return (
    <div className="absolute contents left-[167.49px] top-[16px]" data-name="Heading">
      <p className="absolute font-['Raleway:Regular',sans-serif] font-normal leading-[normal] left-[167.49px] text-[32px] text-black top-[16px] w-[93.616px]">UDAN</p>
      <BetaTag />
    </div>
  );
}

function Group5() {
  return (
    <Wrapper1 additionalClassNames="left-[448px] top-[23px]">
      <g id="Group 1171276056">
        <rect height="22" id="Rectangle 10" rx="3" stroke="var(--stroke-0, #8E8E93)" strokeWidth="2" width="22" x="1" y="1" />
        <path d={svgPaths.p29ed3860} id="Vector" stroke="var(--stroke-0, #8E8E93)" strokeLinecap="round" strokeWidth="2" />
      </g>
    </Wrapper1>
  );
}

function SettingsButton() {
  return (
    <Wrapper1 additionalClassNames="left-[412.5px] top-[23px]">
      <g clipPath="url(#clip0_1_200)" id="Settings Button">
        <g id="Vector"></g>
        <path d={svgPaths.p3a43e300} fill="var(--fill-0, #8E8E93)" id="Vector_2" />
      </g>
      <defs>
        <clipPath id="clip0_1_200">
          <rect fill="white" height="24" width="24" />
        </clipPath>
      </defs>
    </Wrapper1>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[16.5px] top-[16px]">
      <Group4 />
      <Heading />
      <Group5 />
      <SettingsButton />
    </div>
  );
}

function SolarCopyOutline() {
  return (
    <div className="absolute left-[262px] size-[25px] top-[6px]" data-name="solar:copy-outline">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 25">
        <g id="solar:copy-outline">
          <rect fill="var(--fill-0, #F3F3F3)" height="25" rx="4" width="25" />
          <path clipRule="evenodd" d={svgPaths.pb929380} fill="var(--fill-0, black)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute bg-white h-[37px] left-[142px] overflow-clip rounded-[3px] top-[438px] w-[294px]">
      <p className="absolute font-['Raleway:SemiBold',sans-serif] font-semibold leading-[normal] left-[7px] text-[14px] text-black text-nowrap top-[11px] whitespace-pre">Copy the link</p>
      <div className="absolute bg-[#d9d9d9] h-[25px] left-[100px] rounded-[4px] top-[6px] w-[187px]" />
      <p className="absolute font-['Raleway:SemiBold',sans-serif] font-semibold leading-[normal] left-[106px] text-[14px] text-black text-nowrap top-[10px] whitespace-pre">https://recording.com</p>
      <SolarCopyOutline />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents left-[142px] top-[424px]">
      <Frame />
      <div className="absolute left-[416px] size-[19px] top-[424px]">
        <div className="absolute bottom-1/4 left-[6.7%] right-[6.7%] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 15">
            <path d={svgPaths.p2623e3b0} fill="var(--fill-0, white)" id="Polygon 2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function HomePageUser() {
  return (
    <div className="bg-[#f6f6f6] relative size-full" data-name="Home page - User">
      <Group6 />
      <TabsForRecording />
      <MyRecordingCard />
      <MyRecordingCard1 />
      <MyRecordingCard2 />
      <Footer />
      <Group1 />
      <Group3 />
    </div>
  );
}