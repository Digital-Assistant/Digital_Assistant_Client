import svgPaths from "./svg-0ikchrah8d";
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

function Wrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <svg fill="none" preserveAspectRatio="none" viewBox="0 0 16 16" className="block size-full">
      <g id="formkit:radio">{children}</g>
    </svg>
  );
}
type FormkitRadioProps = {
  additionalClassNames?: string;
};

function FormkitRadio({ additionalClassNames = "" }: FormkitRadioProps) {
  return (
    <div className={clsx("absolute left-[10px] size-[16px]", additionalClassNames)}>
      <Wrapper>
        <path d={svgPaths.p25e40e80} fill="var(--fill-0, black)" id="Vector" />
      </Wrapper>
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
      <g clipPath="url(#clip0_4_864)" id="Check circle outline">
        <g id="Vector"></g>
        <path d={svgPaths.p2de1ad00} fill="var(--fill-0, #969696)" id="Vector_2" />
      </g>
      <defs>
        <clipPath id="clip0_4_864">
          <rect fill="white" height="24" width="24" />
        </clipPath>
      </defs>
    </Wrapper1>
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
    <div className="absolute content-stretch flex gap-[4px] h-[23px] items-center justify-center left-1/2 overflow-clip top-[959px] translate-x-[-50%] w-[456px]" data-name="Footer">
      <p className="font-['Raleway:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#a7a7a7] text-[20px] text-nowrap whitespace-pre">Copyrights Reserved 2025</p>
      <Copyright />
    </div>
  );
}

function Component() {
  return (
    <div className="absolute h-[32.211px] left-[401px] top-[74.89px] w-[31.861px]" data-name="Component 1">
      <div className="absolute bottom-[-24.84%] left-[-12.55%] right-[-12.55%] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 41">
          <g id="Component 1">
            <g filter="url(#filter0_d_1_176)" id="Ellipse 9">
              <ellipse cx="19.9306" cy="16.1053" fill="var(--fill-0, white)" rx="15.9306" ry="16.1053" />
            </g>
            <g clipPath="url(#clip0_1_176)" id="Mic none">
              <g id="Vector"></g>
              <path d={svgPaths.p37808b00} fill="var(--fill-0, #1C1C1E)" id="Vector_2" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="40.2105" id="filter0_d_1_176" width="39.8612" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_176" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_176" mode="normal" result="shape" />
            </filter>
            <clipPath id="clip0_1_176">
              <rect fill="white" height="21.4737" transform="translate(9.31023 5.36845)" width="21.2408" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function MaterialSymbolsSearchRounded() {
  return (
    <Wrapper2 additionalClassNames="left-[24px] top-[79px]">
      <g id="material-symbols:search-rounded">
        <path d={svgPaths.pded2700} fill="var(--fill-0, black)" id="Vector" />
      </g>
    </Wrapper2>
  );
}

function Group2() {
  return (
    <div className="absolute left-[436.79px] size-[32.211px] top-[74.89px]">
      <div className="absolute bottom-[-24.84%] left-[-12.42%] right-[-12.42%] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 41 41">
          <g id="Group 1171276047">
            <g filter="url(#filter0_d_4_907)" id="Ellipse 9">
              <circle cx="20.1053" cy="16.1053" fill="var(--fill-0, white)" r="16.1053" />
              <circle cx="20.1053" cy="16.1053" r="15.6053" stroke="var(--stroke-0, black)" />
            </g>
            <path d={svgPaths.p20d9bf60} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="40.2105" id="filter0_d_4_907" width="40.2105" x="1.49012e-07" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4_907" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_4_907" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents left-[12px] top-[70px]">
      <div className="absolute bg-[#d9d9d9] h-[42px] left-[12px] rounded-[30px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[70px] w-[461px]" />
      <Component />
      <div className="absolute flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] left-[53px] text-[16px] text-black text-nowrap top-[91.5px] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre">Search</p>
      </div>
      <MaterialSymbolsSearchRounded />
      <Group2 />
    </div>
  );
}

function Group8() {
  return (
    <Wrapper2 additionalClassNames="left-[12px] top-[calc(50%-465px)] translate-y-[-50%]">
      <g id="Group 1171276058">
        <rect height="22" id="Rectangle 10" rx="3" stroke="var(--stroke-0, #8E8E93)" strokeWidth="2" width="22" x="1" y="1" />
        <path d="M5 18H19" id="Vector 1" stroke="var(--stroke-0, #8E8E93)" strokeLinecap="round" strokeWidth="2" />
      </g>
    </Wrapper2>
  );
}

function BetaTag() {
  return (
    <div className="absolute bg-[#cccccc] h-[14px] left-[256.61px] overflow-clip rounded-[4px] top-[32px] w-[30.199px]" data-name="Beta Tag">
      <p className="absolute font-['Raleway:Regular',sans-serif] font-normal leading-[normal] left-[4px] text-[#1e1e1e] text-[10px] text-nowrap top-px whitespace-pre">Beta</p>
    </div>
  );
}

function Heading() {
  return (
    <div className="absolute contents left-[162.99px] top-[16px]" data-name="Heading">
      <p className="absolute font-['Raleway:Regular',sans-serif] font-normal leading-[normal] left-[162.99px] text-[32px] text-black top-[16px] w-[93.616px]">UDAN</p>
      <BetaTag />
    </div>
  );
}

function Group6() {
  return (
    <Wrapper2 additionalClassNames="left-[443.5px] top-[23px]">
      <g id="Group 1171276056">
        <rect height="22" id="Rectangle 10" rx="3" stroke="var(--stroke-0, #8E8E93)" strokeWidth="2" width="22" x="1" y="1" />
        <path d={svgPaths.p29ed3860} id="Vector" stroke="var(--stroke-0, #8E8E93)" strokeLinecap="round" strokeWidth="2" />
      </g>
    </Wrapper2>
  );
}

function SettingsButton() {
  return (
    <Wrapper2 additionalClassNames="left-[408px] top-[23px]">
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

function Group4() {
  return (
    <div className="absolute contents left-[12px] top-[16px]">
      <Group8 />
      <Heading />
      <Group6 />
      <SettingsButton />
    </div>
  );
}

function Star() {
  return (
    <Wrapper1 additionalClassNames="relative shrink-0 size-[24px]">
      <g id="Star">
        <path d={svgPaths.p195bb400} id="Vector" stroke="var(--stroke-0, #3E3E3E)" strokeWidth="2" />
      </g>
    </Wrapper1>
  );
}

function MaterialSymbolsShare() {
  return (
    <Wrapper1 additionalClassNames="relative shrink-0 size-[24px]">
      <g id="material-symbols:share">
        <path d={svgPaths.p378ed900} fill="var(--fill-0, black)" id="Vector" />
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
      <p className="basis-0 font-['Raleway:SemiBold',sans-serif] font-semibold grow leading-[normal] min-h-px min-w-px relative shrink-0 text-[#1c1c1e] text-[24px]">Recorded Title</p>
      <Star />
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
      <g clipPath="url(#clip0_4_878)" id="Skip next">
        <g id="Vector"></g>
        <path d={svgPaths.p2d9db4e0} fill="var(--fill-0, #CCCCCC)" id="Vector_2" />
      </g>
      <defs>
        <clipPath id="clip0_4_878">
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
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px overflow-clip relative shrink-0" data-name="Video General Actions">
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
    <div className="content-stretch flex gap-[20px] h-full items-center justify-end overflow-clip relative shrink-0">
      <ThumbUp />
      <ThumbDown />
      <ReportProblem />
    </div>
  );
}

function Actions() {
  return (
    <div className="absolute content-stretch flex gap-[10px] items-center left-[12px] px-0 py-[16px] rounded-[4px] top-[192px] w-[456px]" data-name="Actions">
      <VideoGeneralActions />
      <div className="flex flex-row items-center self-stretch">
        <Frame />
      </div>
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

function Group1() {
  return (
    <div className="absolute contents left-[12px] top-[313px]">
      <RecordingStepSuccessText text="Home" additionalClassNames="top-[313px] w-[446px]" />
      <Group />
      <RecordingStepSuccessText text="Reports" additionalClassNames="top-[465px] w-[446px]" />
      <RecordingStepSuccessText text="Log Time" additionalClassNames="top-[521px] w-[446px]" />
      <RecordingStepSuccessText text="Submit Log" additionalClassNames="top-[577px] w-[162px]" />
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents left-[12px] top-[272px]">
      <div className="absolute flex flex-col font-['Raleway:SemiBold',sans-serif] font-semibold h-[33px] justify-center leading-[0] left-[12px] text-[#1c1c1e] text-[20px] top-[288.5px] translate-y-[-50%] w-[456px]">
        <p className="leading-[normal]">Steps</p>
      </div>
      <Group1 />
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents left-[12px] top-[192px]">
      <Actions />
      <Group7 />
    </div>
  );
}

function FormkitRadio1() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[39px]" data-name="formkit:radio">
      <Wrapper>
        <path d={svgPaths.p25e40e80} fill="var(--fill-0, black)" id="Vector" />
        <path d={svgPaths.p245eb100} fill="var(--fill-0, #1E558C)" id="Vector_2" />
      </Wrapper>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute bg-white h-[225px] left-[319px] overflow-clip rounded-[4px] top-[112px] w-[150px]">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[37px] not-italic text-[16px] text-black text-nowrap top-[37px] whitespace-pre">English</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[12px] not-italic text-[16px] text-black text-nowrap top-[9.11px] whitespace-pre">Select Language</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[37px] not-italic text-[16px] text-black text-nowrap top-[133.11px] whitespace-pre">Hindi</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[37px] not-italic text-[16px] text-black text-nowrap top-[165.11px] whitespace-pre">Telugu</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[37px] not-italic text-[16px] text-black text-nowrap top-[197.11px] whitespace-pre">Tamil</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[37px] not-italic text-[16px] text-black text-nowrap top-[69.11px] whitespace-pre">Kannada</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[37px] not-italic text-[16px] text-black text-nowrap top-[101.11px] whitespace-pre">Malayalam</p>
      <FormkitRadio additionalClassNames="top-[71.11px]" />
      <FormkitRadio additionalClassNames="top-[102.11px]" />
      <FormkitRadio additionalClassNames="top-[134.11px]" />
      <FormkitRadio additionalClassNames="top-[166.11px]" />
      <FormkitRadio additionalClassNames="top-[198.11px]" />
      <FormkitRadio1 />
      <div className="absolute bg-[#ececec] h-[67px] right-0 rounded-[8px] top-[73px] w-[8px]" />
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents left-[319px] top-[99px]">
      <div className="absolute h-[18.743px] left-[447px] top-[99px] w-[16px]">
        <div className="absolute bottom-1/4 left-[6.7%] right-[6.7%] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 15">
            <path d={svgPaths.p26d9c00} fill="var(--fill-0, white)" id="Polygon 4" />
          </svg>
        </div>
      </div>
      <Frame1 />
    </div>
  );
}

export default function HomePageUser() {
  return (
    <div className="bg-[#f6f6f6] relative size-full" data-name="Home page - User">
      <Footer />
      <Group3 />
      <Group4 />
      <ViewInfoTitleContent />
      <Group9 />
      <Group5 />
    </div>
  );
}