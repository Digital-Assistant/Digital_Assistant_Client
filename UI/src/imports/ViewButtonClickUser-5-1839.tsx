import svgPaths from "./svg-75kxzvv6r8";
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
type Wrapper2Props = {
  additionalClassNames?: string;
};

function Wrapper2({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper2Props>) {
  return (
    <div className={additionalClassNames}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        {children}
      </svg>
    </div>
  );
}
type Wrapper1Props = {
  additionalClassNames?: string;
};

function Wrapper1({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper1Props>) {
  return <Wrapper2 additionalClassNames={clsx("absolute size-[24px]", additionalClassNames)}>{children}</Wrapper2>;
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
    <Wrapper2 additionalClassNames="relative shrink-0 size-[24px]">
      <g clipPath="url(#clip0_5_1253)" id="Check circle outline">
        <g id="Vector"></g>
        <path d={svgPaths.p2de1ad00} fill="var(--fill-0, #22BB33)" id="Vector_2" />
      </g>
      <defs>
        <clipPath id="clip0_5_1253">
          <rect fill="white" height="24" width="24" />
        </clipPath>
      </defs>
    </Wrapper2>
  );
}

function Group9() {
  return (
    <div className="absolute h-[24px] left-[377.6px] top-[138px] w-[22.4px]">
      <div className="absolute inset-[-16.67%_-17.86%_-33.33%_-17.86%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31 36">
          <g filter="url(#filter0_dd_5_1852)" id="Group 1171276069">
            <rect fill="var(--fill-0, black)" height="24" id="Rectangle 22" rx="4" width="22.4" x="4" y="4" />
            <g id="Vector">
              <path d="M8.8 16L13 20.2L21.4 11.2" fill="var(--fill-0, black)" />
              <path d="M8.8 16L13 20.2L21.4 11.2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="36" id="filter0_dd_5_1852" width="30.4" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_5_1852" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="-2" />
              <feGaussianBlur stdDeviation="1" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="effect1_dropShadow_5_1852" mode="normal" result="effect2_dropShadow_5_1852" />
              <feBlend in="SourceGraphic" in2="effect2_dropShadow_5_1852" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Delete() {
  return (
    <Wrapper1 additionalClassNames="left-[410px] top-[138px]">
      <g id="Delete">
        <g clipPath="url(#clip0_5_1848)">
          <g id="Vector"></g>
          <path d={svgPaths.p2eacd800} fill="var(--fill-0, black)" id="Vector_2" />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_5_1848">
          <rect fill="white" height="24" rx="4" width="24" />
        </clipPath>
      </defs>
    </Wrapper1>
  );
}

function MaterialSymbolsShare() {
  return (
    <Wrapper1 additionalClassNames="left-[444px] top-[138px]">
      <g id="material-symbols:share">
        <path d={svgPaths.p378ed900} fill="var(--fill-0, #1C1C1E)" id="Vector" />
      </g>
    </Wrapper1>
  );
}

function ReportProblem() {
  return (
    <div className="absolute aspect-[48/48] left-[87.98%] overflow-clip right-[0.48%] top-0" data-name="Report problem">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Vector"></g>
      </svg>
      <div className="absolute inset-[8.33%_4.17%_12.5%_4.17%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 19">
          <path d={svgPaths.p6027970} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Component() {
  return (
    <div className="absolute h-[134px] left-[257px] top-[206px] w-[208px]" data-name="Component 2">
      <ReportProblem />
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
    <div className="absolute content-stretch flex gap-[10px] items-center left-[12px] overflow-clip top-[202px] w-[334px]" data-name="Video General Actions">
      <SkipPrevious />
      <NextAndPrevSteps />
    </div>
  );
}

function ThumbUp() {
  return (
    <Wrapper1 additionalClassNames="left-[356px] top-[209px]">
      <g clipPath="url(#clip0_5_1486)" id="Thumb up">
        <g id="Vector"></g>
        <path d={svgPaths.p11b5d400} id="Vector_2" stroke="var(--stroke-0, #1C1C1E)" strokeWidth="2" />
      </g>
      <defs>
        <clipPath id="clip0_5_1486">
          <rect fill="white" height="24" width="24" />
        </clipPath>
      </defs>
    </Wrapper1>
  );
}

function ThumbDown() {
  return (
    <Wrapper1 additionalClassNames="left-[400px] top-[209px]">
      <g clipPath="url(#clip0_5_1480)" id="Thumb down">
        <g id="Vector"></g>
        <path d={svgPaths.pe9ecb00} id="Vector_2" stroke="var(--stroke-0, #1C1C1E)" strokeWidth="2" />
      </g>
      <defs>
        <clipPath id="clip0_5_1480">
          <rect fill="white" height="24" width="24" />
        </clipPath>
      </defs>
    </Wrapper1>
  );
}

function Group10() {
  return (
    <div className="absolute contents left-[12px] top-[202px]">
      <Component />
      <VideoGeneralActions />
      <ThumbUp />
      <ThumbDown />
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
    <Wrapper2 additionalClassNames="relative shrink-0 size-[24px]">
      <g clipPath="url(#clip0_5_1246)" id="Cancel">
        <g id="Vector" opacity="0.87"></g>
        <path d={svgPaths.p2511d980} fill="var(--fill-0, #FF6467)" id="Vector_2" />
      </g>
      <defs>
        <clipPath id="clip0_5_1246">
          <rect fill="white" height="24" width="24" />
        </clipPath>
      </defs>
    </Wrapper2>
  );
}

function RecordingStepFail() {
  return (
    <div className="absolute content-stretch flex gap-[10px] items-center left-[12px] p-[10px] top-[577px] w-[453px]" data-name="Recording Step Fail">
      <Cancel />
      <div className="flex flex-col font-['Raleway:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[20px] text-black text-center text-nowrap">
        <p className="leading-[normal] whitespace-pre">Submit Log</p>
      </div>
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
      <RecordingStepFail />
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

function Group11() {
  return (
    <div className="absolute contents left-[12px] top-[202px]">
      <Group10 />
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

function Group4() {
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
    <Wrapper1 additionalClassNames="left-[21.5px] top-[79px]">
      <g id="material-symbols:search-rounded">
        <path d={svgPaths.pded2700} fill="var(--fill-0, black)" id="Vector" />
      </g>
    </Wrapper1>
  );
}

function Group3() {
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

function Group5() {
  return (
    <div className="absolute contents left-[9.5px] top-[70px]">
      <div className="absolute bg-[#d9d9d9] h-[42px] left-[9.5px] rounded-[30px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[70px] w-[461px]" />
      <Group4 />
      <div className="absolute flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] left-[50.5px] text-[16px] text-black text-nowrap top-[91.5px] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre">Search</p>
      </div>
      <MaterialSymbolsSearchRounded />
      <Group3 />
    </div>
  );
}

function Group8() {
  return (
    <Wrapper1 additionalClassNames="left-[17px] top-[calc(50%-465px)] translate-y-[-50%]">
      <g id="Group 1171276058">
        <rect height="22" id="Rectangle 10" rx="3" stroke="var(--stroke-0, #8E8E93)" strokeWidth="2" width="22" x="1" y="1" />
        <path d="M5 18H19" id="Vector 1" stroke="var(--stroke-0, #8E8E93)" strokeLinecap="round" strokeWidth="2" />
      </g>
    </Wrapper1>
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

function Group7() {
  return (
    <Wrapper1 additionalClassNames="left-[448.5px] top-[23px]">
      <g id="Group 1171276056">
        <rect height="22" id="Rectangle 10" rx="3" stroke="var(--stroke-0, #8E8E93)" strokeWidth="2" width="22" x="1" y="1" />
        <path d={svgPaths.p29ed3860} id="Vector" stroke="var(--stroke-0, #8E8E93)" strokeLinecap="round" strokeWidth="2" />
      </g>
    </Wrapper1>
  );
}

function SettingsButton() {
  return (
    <Wrapper1 additionalClassNames="left-[413px] top-[23px]">
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

function Group6() {
  return (
    <div className="absolute contents left-[17px] top-[16px]">
      <Group8 />
      <Heading />
      <Group7 />
      <SettingsButton />
    </div>
  );
}

export default function ViewButtonClickUser() {
  return (
    <div className="bg-[#f6f6f6] relative size-full" data-name="View Button Click - User">
      <div className="absolute bg-[#d9d9d9] border border-[#d2d2d2] border-solid h-[39px] left-[41px] rounded-[4px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] top-[131px] w-[367px]" />
      <Wrapper1 additionalClassNames="left-[12px] top-[138px]">
        <path d={svgPaths.p3b54f780} fill="var(--fill-0, #1C1C1E)" id="Vector" />
      </Wrapper1>
      <p className="absolute font-['Raleway:SemiBold',sans-serif] font-semibold leading-[normal] left-[46px] text-[#1c1c1e] text-[24px] top-[136px] w-[321.6px]">Recorded Title |</p>
      <Group9 />
      <Delete />
      <MaterialSymbolsShare />
      <Group11 />
      <Footer />
      <Group5 />
      <Group6 />
    </div>
  );
}