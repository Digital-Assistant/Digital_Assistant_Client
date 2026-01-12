import { useAuth } from '../contexts/AuthContext';
import svgPaths from "../imports/svg-s04gq19zek";

export function LoginScreen() {
  const { login } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-8 py-12">
      {/* Logo/Brand Section */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h1 className="font-['Raleway',sans-serif] text-[48px] text-black">
            UDAN
          </h1>
          <span className="bg-[#cccccc] text-[#1e1e1e] text-[12px] font-['Raleway',sans-serif] px-2 py-0.5 rounded h-[18px] flex items-center">
            Beta
          </span>
        </div>
        <p className="text-[#666666] text-[16px] font-['Roboto',sans-serif] max-w-[320px] mx-auto">
          Sign in to access your personalized digital assistant
        </p>
      </div>

      {/* Login Button - Google Style */}
      <button
        onClick={login}
        className="flex items-center gap-3 bg-white border-2 border-[#d9d9d9] rounded-lg px-6 py-3 hover:bg-[#f8f8f8] hover:border-[#8e8e93] transition-all duration-200 shadow-sm hover:shadow-md group"
        aria-label="Sign in with UDAN"
      >
        {/* UDAN Icon */}
        <div className="w-6 h-6 flex-shrink-0">
          <svg
            className="w-full h-full"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" fill="#007AFF" />
            <text
              x="12"
              y="17"
              fontSize="14"
              fontWeight="bold"
              fill="white"
              textAnchor="middle"
              fontFamily="Raleway, sans-serif"
            >
              U
            </text>
          </svg>
        </div>
        
        {/* Button Text */}
        <span className="text-[#1e1e1e] text-[16px] font-['Roboto',sans-serif] font-medium">
          Sign in with UDAN
        </span>
      </button>

      {/* Additional Info */}
      <div className="mt-8 text-center">
        <p className="text-[#999999] text-[12px] font-['Roboto',sans-serif] max-w-[300px]">
          By signing in, you agree to UDAN's Terms of Service and Privacy Policy
        </p>
      </div>

      {/* Decorative Element */}
      <div className="mt-12 flex items-center gap-4 opacity-30">
        <div className="w-16 h-[1px] bg-[#d9d9d9]"></div>
        <div className="w-2 h-2 rounded-full bg-[#d9d9d9]"></div>
        <div className="w-16 h-[1px] bg-[#d9d9d9]"></div>
      </div>
    </div>
  );
}
