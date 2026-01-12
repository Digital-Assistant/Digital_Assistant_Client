import svgPaths from "./svg-utj0auj5kn";
import clsx from "clsx";

function Wrapper1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="absolute inset-[0_-12.55%_-24.84%_-12.55%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 41">
        {children}
      </svg>
    </div>
  );
}
type WrapperProps = {
  additionalClassNames?: string;
};

function Wrapper({ children, additionalClassNames = "" }: React.PropsWithChildren<WrapperProps>) {
  return (
    <div className={clsx("absolute size-[24px]", additionalClassNames)}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        {children}
      </svg>
    </div>
  );
}

function Group3() {
  return (
    <Wrapper additionalClassNames="left-[12.25px] top-[calc(50%-465px)] translate-y-[-50%]">
      <g id="Group 1171276058">
        <rect height="22" id="Rectangle 10" rx="3" stroke="var(--stroke-0, #8E8E93)" strokeWidth="2" width="22" x="1" y="1" />
        <path d="M5 18H19" id="Vector 1" stroke="var(--stroke-0, #8E8E93)" strokeLinecap="round" strokeWidth="2" />
      </g>
    </Wrapper>
  );
}

function BetaTag() {
  return (
    <div className="absolute bg-[#cccccc] h-[14px] left-[256.86px] overflow-clip rounded-[4px] top-[32px] w-[30.199px]" data-name="Beta Tag">
      <p className="absolute font-['Raleway:Regular',sans-serif] font-normal leading-[normal] left-[4px] text-[#1e1e1e] text-[10px] text-nowrap top-px whitespace-pre">Beta</p>
    </div>
  );
}

function Heading() {
  return (
    <div className="absolute contents left-[163.24px] top-[16px]" data-name="Heading">
      <p className="absolute font-['Raleway:Regular',sans-serif] font-normal leading-[normal] left-[163.24px] text-[32px] text-black top-[16px] w-[93.616px]">UDAN</p>
      <BetaTag />
    </div>
  );
}

function Group1() {
  return (
    <Wrapper additionalClassNames="left-[443.75px] top-[23px]">
      <g id="Group 1171276056">
        <rect height="22" id="Rectangle 10" rx="3" stroke="var(--stroke-0, #8E8E93)" strokeWidth="2" width="22" x="1" y="1" />
        <path d={svgPaths.p29ed3860} id="Vector" stroke="var(--stroke-0, #8E8E93)" strokeLinecap="round" strokeWidth="2" />
      </g>
    </Wrapper>
  );
}

function SettingsButton() {
  return (
    <Wrapper additionalClassNames="left-[408.25px] top-[23px]">
      <g clipPath="url(#clip0_1_200)" id="Settings Button">
        <g id="Vector"></g>
        <path d={svgPaths.p3a43e300} fill="var(--fill-0, #8E8E93)" id="Vector_2" />
      </g>
      <defs>
        <clipPath id="clip0_1_200">
          <rect fill="white" height="24" width="24" />
        </clipPath>
      </defs>
    </Wrapper>
  );
}

function RecordButton() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[24px] items-center justify-center left-[348.25px] p-[8px] rounded-[1000px] top-[23px] w-[48px]" data-name="Record Button">
      <div aria-hidden="true" className="absolute border border-[#fb2c36] border-solid inset-0 pointer-events-none rounded-[1000px]" />
      <div className="relative shrink-0 size-[8px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
          <circle cx="4" cy="4" fill="var(--fill-0, #FB2C36)" id="Ellipse 7" r="4" />
        </svg>
      </div>
      <div className="flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#fb2c36] text-[12px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre">REC</p>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[12.25px] top-[16px]">
      <Group3 />
      <Heading />
      <Group1 />
      <SettingsButton />
      <RecordButton />
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

function Frame() {
  return (
    <div className="bg-[#fb2c36] content-stretch flex items-center justify-center p-[16px] relative rounded-[1000px] shrink-0 size-[182px]">
      <div className="flex flex-col font-['Raleway:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[24px] text-center text-nowrap text-white">
        <p className="leading-[normal] whitespace-pre">Start</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[20px] grow items-center justify-center min-h-px min-w-px relative shrink-0 w-full">
      <div className="flex flex-col font-['Raleway:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#1c1c1e] text-[24px] text-center text-nowrap">
        <p className="leading-[normal] whitespace-pre">Click here to start recording</p>
      </div>
      <Frame />
    </div>
  );
}

function BodyContent() {
  return (
    <div className="absolute content-stretch flex flex-col h-[799px] items-start left-1/2 top-[calc(50%+19.5px)] translate-x-[-50%] translate-y-[-50%] w-[456px]" data-name="Body Content">
      <Frame1 />
    </div>
  );
}

function MaterialSymbolsSearchRounded() {
  return (
    <Wrapper additionalClassNames="left-[21.5px] top-[79px]">
      <g id="material-symbols:search-rounded">
        <path d={svgPaths.pded2700} fill="var(--fill-0, black)" id="Vector" />
      </g>
    </Wrapper>
  );
}

function Group2() {
  return (
    <div className="absolute inset-[0_0.23%_87.71%_78.53%]">
      <Wrapper1>
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
      </Wrapper1>
    </div>
  );
}

function Component1() {
  return (
    <div className="absolute h-[262.105px] left-[316.5px] top-[75px] w-[150px]" data-name="Component 4">
      <Group2 />
    </div>
  );
}

function Component() {
  return (
    <div className="absolute h-[32.211px] left-[398.5px] top-[74.89px] w-[31.861px]" data-name="Component 1">
      <Wrapper1>
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
      </Wrapper1>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents left-[9.5px] top-[70px]">
      <div className="absolute bg-[#d9d9d9] h-[42px] left-[9.5px] rounded-[30px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[70px] w-[461px]" />
      <div className="absolute flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] left-[50.5px] text-[16px] text-black text-nowrap top-[91.5px] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre">Search</p>
      </div>
      <MaterialSymbolsSearchRounded />
      <Component1 />
      <Component />
    </div>
  );
}

export default function ViewButtonClickUser() {
  return (
    <div className="bg-[#f6f6f6] relative size-full" data-name="View Button Click - User">
      <Group />
      <Footer />
      <BodyContent />
      <Group4 />
    </div>
  );
}