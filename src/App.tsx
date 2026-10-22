import "./index.css";
import "./styles/globals.css";

import HomePageUser from './components/HomePageUser';
import { PanelPositionProvider } from './contexts/PanelPositionContext';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';
import { NotificationObserver } from './components/NotificationObserver';

export default function App() {
  return (
    <AuthProvider>
      <PanelPositionProvider>
        <NotificationObserver />
        <HomePageUser />
        <Toaster position="top-right" richColors />
      </PanelPositionProvider>
    </AuthProvider>
  );
}