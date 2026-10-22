import svgPaths from "./svg-hfh3cd2q4z";
import clsx from "clsx";
type Wrapper3Props = {
  additionalClassNames?: string;
};

function Wrapper3({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper3Props>) {
  return (
    <div className={clsx("relative size-[36px]", additionalClassNames)}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
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
    <div className={additionalClassNames}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        {children}
      </svg>
    </div>
  );
}
type Wrapper2Props = {
  additionalClassNames?: string;
};

function Wrapper2({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper2Props>) {
  return <Wrapper1 additionalClassNames={clsx("absolute size-[24px]", additionalClassNames)}>{children}</Wrapper1>;
}
type WrapperProps = {
  additionalClassNames?: string;
};

function Wrapper({ children, additionalClassNames = "" }: React.PropsWithChildren<WrapperProps>) {
  return (
    <div className={clsx("absolute size-[32.211px] top-[74.89px]", additionalClassNames)}>
      <div className="absolute bottom-[-24.84%] left-[-12.42%] right-[-12.42%] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 41 41">
          {children}
        </svg>
      </div>
    </div>
  );
}
type TextProps = {
  text: string;
};

function Text({ text }: TextProps) {
  return (
    <div className="flex flex-row items-center justify-center size-full">
      <div className="content-stretch flex items-center justify-center p-[10px] relative size-full">
        <p className="font-['Raleway:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[10px] text-nowrap text-white whitespace-pre">{text}</p>
      </div>
    </div>
  );
}
type RecordingStepSuccessTextProps = {
  text: string;
  additionalClassNames?: string;
};

function RecordingStepSuccessText({ text, additionalClassNames = "" }: RecordingStepSuccessTextProps) {
  return (
    <div className={clsx("absolute content-stretch flex gap-[10px] h-[44px] items-center left-[12px] p-[10px]", additionalClassNames)}>
      <CheckCircleOutline />
      <div className="flex flex-col font-['Raleway:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#1c1c1e] text-[20px] text-center text-nowrap">
        <p className="leading-[normal] whitespace-pre">{text}</p>
      </div>
    </div>
  );
}

function CheckCircleOutline() {
  return (
    <Wrapper1 additionalClassNames="relative shrink-0 size-[24px]">
      <g clipPath="url(#clip0_5_1253)" id="Check circle outline">
        <g id="Vector"></g>
        <path d={svgPaths.p2de1ad00} fill="var(--fill-0, #22BB33)" id="Vector_2" />
      </g>
      <defs>
        <clipPath id="clip0_5_1253">
          <rect fill="white" height="24" width="24" />
        </clipPath>
      </defs>
    </Wrapper1>
  );
}

function MaterialSymbolsEdit() {
  return (
    <Wrapper1 additionalClassNames="relative shrink-0 size-[24px]">
      <g id="material-symbols:edit">
        <path d={svgPaths.p157c33f0} fill="var(--fill-0, black)" id="Union" />
      </g>
    </Wrapper1>
  );
}

function Delete() {
  return (
    <Wrapper1 additionalClassNames="relative shrink-0 size-[24px]">
      <g id="Delete">
        <g clipPath="url(#clip0_5_1271)">
          <g id="Vector"></g>
          <path d={svgPaths.p2eacd800} fill="var(--fill-0, black)" id="Vector_2" />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_5_1271">
          <rect fill="white" height="24" rx="4" width="24" />
        </clipPath>
      </defs>
    </Wrapper1>
  );
}

function MaterialSymbolsShare() {
  return (
    <Wrapper1 additionalClassNames="relative shrink-0 size-[24px]">
      <g id="material-symbols:share">
        <path d={svgPaths.p378ed900} fill="var(--fill-0, #1C1C1E)" id="Vector" />
      </g>
    </Wrapper1>
  );
}

function ViewInfoTitleContent() {
  return (
    <div className="absolute content-stretch flex gap-[10px] h-[44px] items-center left-1/2 px-0 py-[8px] top-[128px] translate-x-[-50%] w-[456px]" data-name="View Info Title Content">
      <Wrapper1 additionalClassNames="relative shrink-0 size-[24px]">
        <path d={svgPaths.p3b54f780} fill="var(--fill-0, #1C1C1E)" id="Vector" />
      </Wrapper1>
      <p className="basis-0 font-['Raleway:SemiBold',sans-serif] font-semibold grow leading-[normal] min-h-px min-w-px relative shrink-0 text-[#1c1c1e] text-[24px]">{`Recorded Title `}</p>
      <MaterialSymbolsEdit />
      <Delete />
      <MaterialSymbolsShare />
    </div>
  );
}

function SkipPrevious() {
  return (
    <Wrapper3 additionalClassNames="shrink-0">
      <g clipPath="url(#clip0_4_888)" id="Skip previous">
        <g id="Vector"></g>
        <path d={svgPaths.p1e9080} fill="var(--fill-0, #CCCCCC)" id="Vector_2" />
      </g>
      <defs>
        <clipPath id="clip0_4_888">
          <rect fill="white" height="36" width="36" />
        </clipPath>
      </defs>
    </Wrapper3>
  );
}

function PlayCircleFilled() {
  return (
    <div className="[grid-area:1_/_1] ml-0 mt-0 relative size-[38px]" data-name="Play circle filled">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 38 38">
        <g clipPath="url(#clip0_4_882)" id="Play circle filled">
          <g id="Vector"></g>
          <path d={svgPaths.pb92c900} fill="var(--fill-0, black)" id="Vector_2" />
        </g>
        <defs>
          <clipPath id="clip0_4_882">
            <rect fill="white" height="38" width="38" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function SkipNext() {
  return (
    <Wrapper3 additionalClassNames="[grid-area:1_/_1] ml-[46px] mt-0">
      <g clipPath="url(#clip0_5_1259)" id="Skip next">
        <g id="Vector"></g>
        <path d={svgPaths.p2d9db4e0} fill="var(--fill-0, #1C1C1E)" id="Vector_2" />
      </g>
      <defs>
        <clipPath id="clip0_5_1259">
          <rect fill="white" height="36" width="36" />
        </clipPath>
      </defs>
    </Wrapper3>
  );
}

function NextAndPrevSteps() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Next And Prev Steps">
      <PlayCircleFilled />
      <SkipNext />
    </div>
  );
}

function VideoGeneralActions() {
  return (
    <div className="absolute content-stretch flex gap-[10px] items-center left-[12px] overflow-clip top-[208px] w-[334px]" data-name="Video General Actions">
      <SkipPrevious />
      <NextAndPrevSteps />
    </div>
  );
}

function ThumbUp() {
  return (
    <Wrapper1 additionalClassNames="relative shrink-0 size-[24px]">
      <g clipPath="url(#clip0_4_874)" id="Thumb up">
        <g id="Vector"></g>
        <path d={svgPaths.p11b5d400} id="Vector_2" stroke="var(--stroke-0, #1C1C1E)" strokeWidth="2" />
      </g>
      <defs>
        <clipPath id="clip0_4_874">
          <rect fill="white" height="24" width="24" />
        </clipPath>
      </defs>
    </Wrapper1>
  );
}

function ThumbDown() {
  return (
    <Wrapper1 additionalClassNames="relative shrink-0 size-[24px]">
      <g clipPath="url(#clip0_4_868)" id="Thumb down">
        <g id="Vector"></g>
        <path d={svgPaths.pe9ecb00} id="Vector_2" stroke="var(--stroke-0, #1C1C1E)" strokeWidth="2" />
      </g>
      <defs>
        <clipPath id="clip0_4_868">
          <rect fill="white" height="24" width="24" />
        </clipPath>
      </defs>
    </Wrapper1>
  );
}

function ReportProblem() {
  return (
    <Wrapper1 additionalClassNames="relative shrink-0 size-[24px]">
      <g clipPath="url(#clip0_4_900)" id="Report problem">
        <g id="Vector"></g>
        <path d={svgPaths.p3889b800} fill="var(--fill-0, black)" id="Vector_2" />
      </g>
      <defs>
        <clipPath id="clip0_4_900">
          <rect fill="white" height="24" width="24" />
        </clipPath>
      </defs>
    </Wrapper1>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex gap-[20px] h-[38px] items-center justify-end left-[356px] overflow-clip top-[208px]">
      <ThumbUp />
      <ThumbDown />
      <ReportProblem />
    </div>
  );
}

function Alarm() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Alarm">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g clipPath="url(#clip0_4_856)" id="Alarm">
          <g id="Vector"></g>
          <path d={svgPaths.p1655fa80} fill="var(--fill-0, #969696)" id="Vector_2" />
        </g>
        <defs>
          <clipPath id="clip0_4_856">
            <rect fill="white" height="28" width="28" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function DelayDefault() {
  return (
    <div className="absolute content-stretch flex gap-[10px] h-[28px] items-center left-[22px] top-[423px] w-[201px]" data-name="Delay/Default">
      <Alarm />
      <div className="flex flex-col font-['Raleway:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#969696] text-[20px] text-center text-nowrap">
        <p className="leading-[normal] whitespace-pre">3 seconds delay</p>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[12px] top-[369px]">
      <DelayDefault />
      <RecordingStepSuccessText text="Projects" additionalClassNames="top-[369px] w-[173px]" />
    </div>
  );
}

function Cancel() {
  return (
    <Wrapper1 additionalClassNames="relative shrink-0 size-[24px]">
      <g clipPath="url(#clip0_5_1246)" id="Cancel">
        <g id="Vector" opacity="0.87"></g>
        <path d={svgPaths.p2511d980} fill="var(--fill-0, #FF6467)" id="Vector_2" />
      </g>
      <defs>
        <clipPath id="clip0_5_1246">
          <rect fill="white" height="24" width="24" />
        </clipPath>
      </defs>
    </Wrapper1>
  );
}

function RecordingStepFail() {
  return (
    <div className="absolute bottom-[29.03%] content-stretch flex gap-[10px] items-center left-0 p-[10px] right-[24.66%] top-0" data-name="Recording Step Fail">
      <Cancel />
      <div className="flex flex-col font-['Raleway:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[20px] text-black text-center text-nowrap">
        <p className="leading-[normal] whitespace-pre">Submit Log</p>
      </div>
    </div>
  );
}

function Component() {
  return (
    <div className="absolute h-[62px] left-[12px] top-[577px] w-[219px]" data-name="Component 5">
      <RecordingStepFail />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-[12px] top-[313px]">
      <RecordingStepSuccessText text="Home" additionalClassNames="top-[313px] w-[446px]" />
      <Group />
      <RecordingStepSuccessText text="Reports" additionalClassNames="top-[465px] w-[446px]" />
      <RecordingStepSuccessText text="Log Time" additionalClassNames="top-[521px] w-[446px]" />
      <Component />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[12px] top-[272px]">
      <div className="absolute flex flex-col font-['Raleway:SemiBold',sans-serif] font-semibold h-[33px] justify-center leading-[0] left-[12px] text-[#1c1c1e] text-[20px] top-[288.5px] translate-y-[-50%] w-[456px]">
        <p className="leading-[normal]">Steps</p>
      </div>
      <Group2 />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents left-[12px] top-[208px]">
      <VideoGeneralActions />
      <Frame />
      <Group1 />
    </div>
  );
}

function Copyright() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Copyright">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_1_204)" id="Copyright">
          <g id="Vector"></g>
          <path d={svgPaths.p2f395080} fill="var(--fill-0, #A7A7A7)" id="Vector_2" />
        </g>
        <defs>
          <clipPath id="clip0_1_204">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Footer() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[23px] items-center justify-center left-1/2 overflow-clip top-[961px] translate-x-[-50%] w-[456px]" data-name="Footer">
      <p className="font-['Raleway:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#a7a7a7] text-[20px] text-nowrap whitespace-pre">Copyrights Reserved 2025</p>
      <Copyright />
    </div>
  );
}

function Group5() {
  return (
    <Wrapper additionalClassNames="left-[398.5px]">
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
    </Wrapper>
  );
}

function MaterialSymbolsSearchRounded() {
  return (
    <Wrapper2 additionalClassNames="left-[21.5px] top-[79px]">
      <g id="material-symbols:search-rounded">
        <path d={svgPaths.pded2700} fill="var(--fill-0, black)" id="Vector" />
      </g>
    </Wrapper2>
  );
}

function Group4() {
  return (
    <Wrapper additionalClassNames="left-[434.29px]">
      <g id="Group 1171276047">
        <g filter="url(#filter0_d_5_1263)" id="Ellipse 9">
          <circle cx="20.1053" cy="16.1053" fill="var(--fill-0, white)" r="16.1053" />
        </g>
        <path d={svgPaths.p20d9bf60} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </g>
      <defs>
        <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="40.2105" id="filter0_d_5_1263" width="40.2105" x="1.49012e-07" y="0">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_5_1263" />
          <feBlend in="SourceGraphic" in2="effect1_dropShadow_5_1263" mode="normal" result="shape" />
        </filter>
      </defs>
    </Wrapper>
  );
}

function Group6() {
  return (
    <div className="absolute contents left-[9.5px] top-[70px]">
      <div className="absolute bg-[#d9d9d9] h-[42px] left-[9.5px] rounded-[30px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[70px] w-[461px]" />
      <Group5 />
      <div className="absolute flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] left-[50.5px] text-[16px] text-black text-nowrap top-[91.5px] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre">Search</p>
      </div>
      <MaterialSymbolsSearchRounded />
      <Group4 />
    </div>
  );
}

function Group12() {
  return (
    <Wrapper2 additionalClassNames="left-[17px] top-[calc(50%-465px)] translate-y-[-50%]">
      <g id="Group 1171276058">
        <rect height="22" id="Rectangle 10" rx="3" stroke="var(--stroke-0, #8E8E93)" strokeWidth="2" width="22" x="1" y="1" />
        <path d="M5 18H19" id="Vector 1" stroke="var(--stroke-0, #8E8E93)" strokeLinecap="round" strokeWidth="2" />
      </g>
    </Wrapper2>
  );
}

function BetaTag() {
  return (
    <div className="absolute bg-[#cccccc] h-[14px] left-[261.61px] overflow-clip rounded-[4px] top-[32px] w-[30.199px]" data-name="Beta Tag">
      <p className="absolute font-['Raleway:Regular',sans-serif] font-normal leading-[normal] left-[4px] text-[#1e1e1e] text-[10px] text-nowrap top-px whitespace-pre">Beta</p>
    </div>
  );
}

function Heading() {
  return (
    <div className="absolute contents left-[167.99px] top-[16px]" data-name="Heading">
      <p className="absolute font-['Raleway:Regular',sans-serif] font-normal leading-[normal] left-[167.99px] text-[32px] text-black top-[16px] w-[93.616px]">UDAN</p>
      <BetaTag />
    </div>
  );
}

function Group10() {
  return (
    <Wrapper2 additionalClassNames="left-[448.5px] top-[23px]">
      <g id="Group 1171276056">
        <rect height="22" id="Rectangle 10" rx="3" stroke="var(--stroke-0, #8E8E93)" strokeWidth="2" width="22" x="1" y="1" />
        <path d={svgPaths.p29ed3860} id="Vector" stroke="var(--stroke-0, #8E8E93)" strokeLinecap="round" strokeWidth="2" />
      </g>
    </Wrapper2>
  );
}

function SettingsButton() {
  return (
    <Wrapper2 additionalClassNames="left-[413px] top-[23px]">
      <g clipPath="url(#clip0_1_200)" id="Settings Button">
        <g id="Vector"></g>
        <path d={svgPaths.p3a43e300} fill="var(--fill-0, #8E8E93)" id="Vector_2" />
      </g>
      <defs>
        <clipPath id="clip0_1_200">
          <rect fill="white" height="24" width="24" />
        </clipPath>
      </defs>
    </Wrapper2>
  );
}

function Group8() {
  return (
    <div className="absolute contents left-[17px] top-[16px]">
      <Group12 />
      <Heading />
      <Group10 />
      <SettingsButton />
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute contents left-[8px] top-[23.63px]">
      <div className="absolute bg-neutral-50 border border-[#dbdbdb] border-solid h-[16px] left-[8px] rounded-[2px] top-[23.63px] w-[192px]" />
      <div className="absolute flex flex-col font-['Raleway:SemiBold',sans-serif] font-semibold justify-center leading-[0] left-[14.96px] text-[#8b8b8b] text-[8px] text-nowrap top-[32.13px] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">Select Issue Type</p>
      </div>
      <div className="absolute h-[5px] left-[184px] top-[28.63px] w-[10px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 5">
          <path d="M0 0L5 5L10 0H0Z" fill="var(--fill-0, #B4B4B4)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents left-[8px] top-[42.63px]">
      <div className="absolute bg-neutral-50 border border-[#dbdbdb] border-solid h-[36px] left-[8px] rounded-[2px] top-[42.63px] w-[192px]" />
      <div className="absolute flex flex-col font-['Raleway:SemiBold',sans-serif] font-semibold justify-center leading-[0] left-[15.07px] text-[#8b8b8b] text-[8px] text-nowrap top-[51.13px] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">Description</p>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute bg-black h-[18px] left-[129px] rounded-[2px] top-[82.63px] w-[71px]">
      <Text text="submit" />
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute bg-[#969696] h-[16px] left-[8px] rounded-[2px] top-[84.63px] w-[71px]">
      <Text text="Cancel" />
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute bg-white h-[104.63px] left-[261px] overflow-clip rounded-[4px] top-[238.37px] w-[208px]">
      <p className="absolute font-['Raleway:SemiBold',sans-serif] font-semibold leading-[normal] left-[8px] text-[10px] text-black text-nowrap top-[6px] whitespace-pre">Report Recording Issue</p>
      <Group11 />
      <Group9 />
      <Frame2 />
      <Frame3 />
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents left-[261px] top-[230px]">
      <Frame1 />
      <div className="absolute h-[12.556px] left-[449.25px] top-[230px] w-[10.458px]">
        <div className="absolute bottom-1/4 left-[6.7%] right-[6.7%] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <path d={svgPaths.p310a4f00} fill="var(--fill-0, white)" id="Polygon 3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function ViewButtonClickUser() {
  return (
    <div className="bg-[#f6f6f6] relative size-full" data-name="View Button Click - User">
      <ViewInfoTitleContent />
      <Group3 />
      <Footer />
      <Group6 />
      <Group8 />
      <Group7 />
    </div>
  );
}