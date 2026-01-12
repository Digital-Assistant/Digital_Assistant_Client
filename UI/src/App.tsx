import "./index.css";
import "./styles/globals.css";

import HomePageUser from './components/HomePageUser';
import { PanelPositionProvider } from './contexts/PanelPositionContext';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <PanelPositionProvider>
        <HomePageUser />
      </PanelPositionProvider>
    </AuthProvider>
  );
}