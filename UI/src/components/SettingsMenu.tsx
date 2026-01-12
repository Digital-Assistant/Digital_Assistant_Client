import { useAuth } from '../contexts/AuthContext';

interface SettingsMenuProps {
  onClose: () => void;
}

export function SettingsMenu({ onClose }: SettingsMenuProps) {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Menu Dropdown */}
      <div className="absolute right-0 top-10 z-50 w-48 bg-white rounded-lg shadow-lg border border-[#d9d9d9] overflow-hidden">
        <div className="py-1">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left text-[14px] font-['Roboto',sans-serif] text-[#1e1e1e] hover:bg-[#f6f6f6] transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
              <path
                d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}