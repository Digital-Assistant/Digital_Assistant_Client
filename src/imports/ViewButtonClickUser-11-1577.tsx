import svgPaths from "./svg-8ezfc2wlzl";
import clsx from "clsx";

function Wrapper2({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="absolute inset-[0_-12.55%_-24.84%_-12.55%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 41">
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
type WrapperProps = {
  additionalClassNames?: string;
};

function Wrapper({ children, additionalClassNames = "" }: React.PropsWithChildren<WrapperProps>) {
  return <Wrapper1 additionalClassNames={clsx("absolute size-[24px]", additionalClassNames)}>{children}</Wrapper1>;
}
type TextProps = {
  text: string;
  additionalClassNames?: string;
};

function Text({ text, additionalClassNames = "" }: TextProps) {
  return (
    <div className={clsx("content-stretch flex items-center justify-center px-[12px] py-[16px] relative", additionalClassNames)}>
      <p className="font-['Raleway:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[20px] text-nowrap text-white whitespace-pre">{text}</p>
    </div>
  );
}
type SubmitButtonTextProps = {
  text: string;
  additionalClassNames?: string;
};

function SubmitButtonText({ text, additionalClassNames = "" }: SubmitButtonTextProps) {
  return (
    <div className={clsx("basis-0 grow min-h-px min-w-px relative rounded-[8px] shrink-0", additionalClassNames)}>
      <div className="flex flex-row items-center justify-center size-full">
        <Text text={text} additionalClassNames="w-full" />
      </div>
    </div>
  );
}

function Helper() {
  return (
    <div className="absolute inset-[46.67%_35.71%_-1.32%_35.71%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
        <g id="Group 1171276087">
          <circle cx="8.19802" cy="8.19802" fill="var(--fill-0, black)" id="Ellipse 13" r="8.19802" />
          <path d={svgPaths.p1e8c400} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Thumb() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center relative rounded-[6px] shrink-0 size-[22px]">
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none rounded-[6px]" />
      <Icon />
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[2px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="icon" opacity="0">
          <path d={svgPaths.p1e0989c0} fill="var(--fill-0, black)" id="color" />
        </g>
      </svg>
    </div>
  );
}

function Group2() {
  return (
    <Wrapper additionalClassNames="left-[12.25px] top-[calc(50%-463px)] translate-y-[-50%]">
      <g id="Group 1171276058">
        <rect height="22" id="Rectangle 10" rx="3" stroke="var(--stroke-0, #8E8E93)" strokeWidth="2" width="22" x="1" y="1" />
        <path d="M5 18H19" id="Vector 1" stroke="var(--stroke-0, #8E8E93)" strokeLinecap="round" strokeWidth="2" />
      </g>
    </Wrapper>
  );
}

function BetaTag() {
  return (
    <div className="absolute bg-[#cccccc] h-[14px] left-[256.86px] overflow-clip rounded-[4px] top-[34px] w-[30.199px]" data-name="Beta Tag">
      <p className="absolute font-['Raleway:Regular',sans-serif] font-normal leading-[normal] left-[4px] text-[#1e1e1e] text-[10px] text-nowrap top-px whitespace-pre">Beta</p>
    </div>
  );
}

function Heading() {
  return (
    <div className="absolute contents left-[163.24px] top-[18px]" data-name="Heading">
      <p className="absolute font-['Raleway:Regular',sans-serif] font-normal leading-[normal] left-[163.24px] text-[32px] text-black top-[18px] w-[93.616px]">UDAN</p>
      <BetaTag />
    </div>
  );
}

function Group() {
  return (
    <Wrapper additionalClassNames="left-[443.75px] top-[25px]">
      <g id="Group 1171276056">
        <rect height="22" id="Rectangle 10" rx="3" stroke="var(--stroke-0, #8E8E93)" strokeWidth="2" width="22" x="1" y="1" />
        <path d={svgPaths.p29ed3860} id="Vector" stroke="var(--stroke-0, #8E8E93)" strokeLinecap="round" strokeWidth="2" />
      </g>
    </Wrapper>
  );
}

function SettingsButton() {
  return (
    <Wrapper additionalClassNames="left-[408.25px] top-[25px]">
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
    <div className="absolute bg-[rgba(251,44,54,0.1)] content-stretch flex gap-[4px] h-[24px] items-center justify-center left-[348.25px] p-[8px] rounded-[1000px] top-[25px] w-[48px]" data-name="Record Button">
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

function Group8() {
  return (
    <div className="absolute contents left-[12.25px] top-[18px]">
      <Group2 />
      <Heading />
      <Group />
      <SettingsButton />
      <RecordButton />
    </div>
  );
}

function RecordingStarted() {
  return (
    <div className="absolute content-stretch flex gap-[10px] items-center left-[13px] top-[128px] w-[456px]" data-name="Recording Started">
      <div className="relative shrink-0 size-[16px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #FB2C36)" id="Ellipse 6" r="8" />
        </svg>
      </div>
      <div className="flex flex-col font-['Raleway:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#1c1c1e] text-[16px] text-center text-nowrap">
        <p className="leading-[normal] whitespace-pre">Recording Sequence</p>
      </div>
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

function MaterialSymbolsCloseRounded() {
  return (
    <Wrapper1 additionalClassNames="relative shrink-0 size-[24px]">
      <g id="material-symbols:close-rounded">
        <path d={svgPaths.p3f2c8580} fill="var(--fill-0, black)" id="Vector" />
      </g>
    </Wrapper1>
  );
}

function Frame4() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-1/2 px-0 py-[8px] top-[16px] translate-x-[-50%] w-[392px]">
      <div className="flex flex-col font-['Roboto:Regular',sans-serif] font-normal h-[23px] justify-center leading-[0] relative shrink-0 text-[#1c1c1e] text-[20px] w-[57px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Step 1</p>
      </div>
      <MaterialSymbolsCloseRounded />
    </div>
  );
}

function MaterialSymbolsEdit() {
  return (
    <Wrapper additionalClassNames="left-[377px] top-[77px]">
      <g id="material-symbols:edit">
        <path d={svgPaths.p157c33f0} fill="var(--fill-0, white)" id="Union" />
      </g>
    </Wrapper>
  );
}

function Group3() {
  return (
    <div className="absolute contents left-1/2 top-[66px] translate-x-[-50%]">
      <div className="absolute bg-[#969696] h-[46px] left-1/2 rounded-[8px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[66px] translate-x-[-50%] w-[392px]" />
      <div className="absolute flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] left-[34px] text-[20px] text-nowrap text-white top-[89px] tracking-[0.25px] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[20px] whitespace-pre">Home</p>
      </div>
      <MaterialSymbolsEdit />
    </div>
  );
}

function BasesCheckbox() {
  return (
    <div className="absolute content-stretch flex inset-[39.47%_90.98%_54.78%_3.22%] items-center justify-center" data-name=".bases / checkbox">
      <Thumb />
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute contents left-[13.64px] top-[165px]">
      <BasesCheckbox />
      <p className="absolute font-['Jost:Regular',sans-serif] font-normal leading-[1.5] left-[46.43px] text-[16px] text-black top-[165px] w-[113.748px]">Skip during play</p>
    </div>
  );
}

function Component2() {
  return (
    <div className="absolute h-[30px] left-[140.78px] top-[155px] w-[57.386px]" data-name="Component 11">
      <Helper />
    </div>
  );
}

function Group14() {
  return (
    <div className="absolute contents left-[13.64px] top-[155px]">
      <Group12 />
      <Component2 />
    </div>
  );
}

function BasesCheckbox1() {
  return (
    <div className="absolute content-stretch flex inset-[39.47%_43.45%_54.78%_50.75%] items-center justify-center" data-name=".bases / checkbox">
      <Thumb />
    </div>
  );
}

function Group13() {
  return (
    <div className="absolute contents left-[215.17px] top-[165px]">
      <BasesCheckbox1 />
      <p className="absolute font-['Jost:Regular',sans-serif] font-normal leading-[1.5] left-[247.96px] text-[16px] text-black top-[165px] w-[142.441px]">Personal information</p>
    </div>
  );
}

function Component4() {
  return (
    <div className="absolute h-[30px] left-[368.98px] top-[155px] w-[57.386px]" data-name="Component 11">
      <Helper />
    </div>
  );
}

function Group15() {
  return (
    <div className="absolute contents left-[215.17px] top-[155px]">
      <Group13 />
      <Component4 />
    </div>
  );
}

function Group16() {
  return (
    <div className="absolute contents left-[calc(50%+8px)] top-[155px] translate-x-[-50%]">
      <Group14 />
      <Group15 />
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents left-[16px] top-[235px]">
      <div className="absolute bg-white border border-neutral-300 border-solid h-[46px] left-[16px] rounded-[8px] top-[235px] w-[392px]" />
      <p className="absolute font-['Raleway:Regular',sans-serif] font-normal leading-[normal] left-[27px] text-[14px] text-black text-nowrap top-[251px] whitespace-pre">Link</p>
    </div>
  );
}

function UilArrow() {
  return (
    <Wrapper additionalClassNames="left-[374px] top-[246px]">
      <g id="uil:arrow">
        <path d={svgPaths.p37cfbaf0} fill="var(--fill-0, black)" id="Vector" />
      </g>
    </Wrapper>
  );
}

function Group7() {
  return (
    <div className="absolute contents left-[16px] top-[205px]">
      <Group4 />
      <p className="absolute font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] left-[16px] text-[16px] text-black text-nowrap top-[205px] whitespace-pre">Type</p>
      <UilArrow />
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents left-[16px] top-[287px]">
      <div className="absolute bg-white border border-[#c8c8c8] border-solid h-[46px] left-[16px] rounded-[8px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[287px] w-[392px]" />
      <p className="absolute font-['Raleway:Regular',sans-serif] font-normal leading-[normal] left-[27px] text-[14px] text-black text-nowrap top-[303px] whitespace-pre">Delay in seconds (optional)</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute bg-[#d5d5d5] h-[418px] left-[29px] overflow-clip rounded-[8px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[188px] w-[424px]">
      <Frame4 />
      <Group3 />
      <div className="absolute flex flex-col font-['Raleway:SemiBold',sans-serif] font-semibold justify-center leading-[0] left-[16px] text-[#1c1c1e] text-[20px] text-nowrap top-[133.5px] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">Properties</p>
      </div>
      <Group16 />
      <Group7 />
      <Group5 />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex gap-[10px] items-center left-[calc(50%+1px)] top-[881px] translate-x-[-50%] w-[456px]">
      <SubmitButtonText text="Cancel" additionalClassNames="bg-[#969696]" />
      <SubmitButtonText text="save" additionalClassNames="bg-black" />
    </div>
  );
}

function SubmitButton() {
  return (
    <div className="basis-0 bg-[#969696] grow h-[50px] min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Submit button">
      <div className="flex flex-row items-center justify-center size-full">
        <Text text="Cancel" additionalClassNames="size-full" />
      </div>
    </div>
  );
}

function SubmitButton1() {
  return (
    <div className="basis-0 bg-black grow h-[50px] min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Submit button">
      <div className="flex flex-row items-center justify-center size-full">
        <Text text="Save step" additionalClassNames="size-full" />
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute content-stretch flex gap-[10px] items-center left-[calc(50%+1px)] top-[545px] translate-x-[-50%] w-[392px]">
      <SubmitButton />
      <SubmitButton1 />
    </div>
  );
}

function ToggleSwitch() {
  return (
    <div className="h-[16px] relative shrink-0 w-[32px]" data-name="Toggle Switch">
      <div className="absolute inset-[-18.75%_-12.5%_-31.25%_-12.5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 24">
          <g filter="url(#filter0_d_11_1349)" id="Toggle Switch">
            <rect fill="var(--fill-0, #969696)" height="16" rx="8" shapeRendering="crispEdges" width="32" x="4" y="3" />
            <circle cx="12" cy="11" fill="var(--fill-0, white)" id="Ellipse 8" r="6" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="24" id="filter0_d_11_1349" width="40" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_11_1349" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_11_1349" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute content-stretch flex gap-[4px] inset-[7.69%_59.43%_79.49%_3.77%] items-center justify-center">
      <ToggleSwitch />
      <div className="flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[14px] text-black text-center text-nowrap tracking-[0.25px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[20px] whitespace-pre">Enable slow replay</p>
      </div>
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents inset-[25.64%_3.77%_44.87%_3.77%]">
      <div className="absolute bg-white border border-neutral-300 border-solid inset-[25.64%_3.77%_44.87%_3.77%] rounded-[8px]" />
      <p className="absolute font-['Raleway:Regular',sans-serif] font-normal inset-[35.9%_76.18%_53.85%_6.37%] leading-[normal] text-[14px] text-black text-nowrap whitespace-pre">Enter Label</p>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents inset-[7.69%_3.77%_44.87%_3.77%]">
      <Frame1 />
      <Group9 />
    </div>
  );
}

function SubmitButton2() {
  return (
    <div className="absolute bg-black content-stretch flex gap-[10px] inset-[60.26%_3.77%_9.62%_3.54%] items-center justify-center px-[12px] py-[16px] rounded-[8px]" data-name="Submit button">
      <div className="relative shrink-0 size-[14px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
          <path d={svgPaths.p11195800} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
      <p className="font-['Raleway:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[20px] text-nowrap text-white whitespace-pre">Add Alias</p>
    </div>
  );
}

function Component3() {
  return (
    <div className="h-[156px] relative shrink-0 w-[424px]" data-name="Component 12">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 424 156">
        <path d={svgPaths.p2d0a9d30} fill="var(--fill-0, #D5D5D5)" id="Rectangle 18" stroke="var(--stroke-0, #D5D5D5)" />
      </svg>
      <Group6 />
      <SubmitButton2 />
    </div>
  );
}

function SubmitButton3() {
  return (
    <div className="bg-black h-[47px] relative rounded-[8px] shrink-0 w-full" data-name="Submit button">
      <div className="flex flex-row items-center justify-center size-full">
        <Text text="Hide Permissions" additionalClassNames="size-full" />
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <Wrapper1 additionalClassNames="relative shrink-0 size-[24px]">
      <g id="icon">
        <path d={svgPaths.p2391de00} fill="var(--fill-0, white)" id="color" />
      </g>
    </Wrapper1>
  );
}

function Thumb1() {
  return (
    <div className="bg-black content-stretch flex items-center justify-center relative rounded-[6px] shrink-0 size-[22px]" data-name="thumb">
      <Icon1 />
    </div>
  );
}

function BasesCheckbox2() {
  return (
    <div className="[grid-area:1_/_1] content-stretch flex items-center justify-center ml-0 mt-px relative size-[24px]" data-name=".bases / checkbox">
      <Thumb1 />
    </div>
  );
}

function Group11() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <BasesCheckbox2 />
      <p className="[grid-area:1_/_1] font-['Jost:Regular',sans-serif] font-normal leading-[1.5] ml-[28px] mt-0 relative text-[16px] text-black text-nowrap whitespace-pre">Doctor</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[218px]">
      <SubmitButton3 />
      <Group11 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] items-end left-[28px] top-[618px] w-[424px]">
      <Component3 />
      <Frame5 />
    </div>
  );
}

function MaterialSymbolsSearchRounded() {
  return (
    <Wrapper additionalClassNames="left-[22.5px] top-[79px]">
      <g id="material-symbols:search-rounded">
        <path d={svgPaths.pded2700} fill="var(--fill-0, black)" id="Vector" />
      </g>
    </Wrapper>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[0_0.23%_87.71%_78.53%]">
      <Wrapper2>
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
      </Wrapper2>
    </div>
  );
}

function Component1() {
  return (
    <div className="absolute h-[262.105px] left-[317.5px] top-[75px] w-[150px]" data-name="Component 4">
      <Group1 />
    </div>
  );
}

function Component() {
  return (
    <div className="absolute h-[32.211px] left-[399.5px] top-[74.89px] w-[31.861px]" data-name="Component 1">
      <Wrapper2>
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
      </Wrapper2>
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute contents left-[10.5px] top-[70px]">
      <div className="absolute bg-[#d9d9d9] h-[42px] left-[10.5px] rounded-[30px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[70px] w-[461px]" />
      <div className="absolute flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] left-[51.5px] text-[16px] text-black text-nowrap top-[91.5px] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
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
      <div className="absolute bg-[#f2f2f2] h-[696px] left-[13px] rounded-[8px] shadow-[0px_-2px_8px_0px_rgba(0,0,0,0.25),0px_4px_12px_0px_rgba(0,0,0,0.25)] top-[172px] w-[456px]" />
      <Group8 />
      <RecordingStarted />
      <Footer />
      <Frame2 />
      <Frame />
      <Frame3 />
      <Frame6 />
      <Group10 />
    </div>
  );
}