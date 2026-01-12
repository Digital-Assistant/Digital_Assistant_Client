# 🔐 Login Implementation Guide

## Overview

The UDAN widget now includes a complete authentication flow with a "Sign in with UDAN" button, similar to "Sign in with Google". When users are not logged in, they see only the login screen without the search bar or list page.

---

## 🎯 Features

✅ **Login Screen** - Clean, Google-style login interface  
✅ **Conditional Rendering** - Show login screen when not authenticated  
✅ **Hide Search Bar** - Search bar hidden on login screen  
✅ **Settings Menu** - Logout option in settings (gear icon)  
✅ **Auth Context** - Global authentication state management  
✅ **Shadow DOM Compatible** - Works with portal-based dropdowns  

---

## 📁 File Structure

```
/
├── App.tsx                           ⭐ Wraps app with AuthProvider
├── contexts/
│   └── AuthContext.tsx              ⭐ Authentication state management
├── components/
│   ├── HomePageUser.tsx             ⭐ Conditional login/main view
│   ├── LoginScreen.tsx              ⭐ "Sign in with UDAN" screen
│   ├── SettingsMenu.tsx             ⭐ Dropdown menu with logout
│   ├── Header.tsx                   ⭐ Settings button + conditional search
│   └── Layout.tsx                   ⭐ Accepts showSearchBar prop
```

---

## 🔧 How It Works

### 1. **Authentication Flow**

```
┌─────────────────────────────────────────────────────────┐
│ 1. User Opens Widget                                    │
│    ↓                                                     │
│ 2. AuthContext checks: isAuthenticated?                │
│    ↓                                                     │
│ 3. If NO → Show LoginScreen                            │
│    If YES → Show Main Interface                         │
└─────────────────────────────────────────────────────────┘
```

### 2. **Login Process**

```
LoginScreen
    ↓
  Click "Sign in with UDAN"
    ↓
  AuthContext.login() called
    ↓
  isAuthenticated = true
    ↓
  HomePageUser re-renders
    ↓
  Show SearchResults + full interface
```

### 3. **Logout Process**

```
Click Settings (Gear Icon)
    ↓
  SettingsMenu appears
    ↓
  Click "Sign Out"
    ↓
  AuthContext.logout() called
    ↓
  isAuthenticated = false
    ↓
  HomePageUser re-renders
    ↓
  Show LoginScreen
```

---

## 📝 Component Details

### **App.tsx**

Wraps the entire app with `AuthProvider`:

```typescript
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
```

**Key Points:**
- `AuthProvider` must wrap everything
- Provides global auth state to all components

---

### **AuthContext.tsx**

Manages authentication state:

```typescript
interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    // In real app: call API, get token, etc.
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**Key Points:**
- Simple boolean state for demo
- In production: integrate with actual auth API
- Could add user data, tokens, etc.

**Usage:**
```typescript
const { isAuthenticated, login, logout } = useAuth();
```

---

### **LoginScreen.tsx**

The login interface:

```typescript
export function LoginScreen() {
  const { login } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      {/* Logo/Brand */}
      <div className="mb-8 text-center">
        <h1>UDAN</h1>
        <span>Beta</span>
        <p>Sign in to access your personalized digital assistant</p>
      </div>

      {/* Login Button */}
      <button onClick={login}>
        <svg><!-- UDAN icon --></svg>
        <span>Sign in with UDAN</span>
      </button>

      {/* Terms */}
      <div className="mt-8">
        <p>By signing in, you agree to UDAN's Terms...</p>
      </div>
    </div>
  );
}
```

**Key Features:**
- Google-style button design
- UDAN brand icon (blue circle with "U")
- Clean, centered layout
- Terms acceptance text

---

### **HomePageUser.tsx**

Conditionally shows login or main interface:

```typescript
export default function HomePageUser() {
  const { isAuthenticated } = useAuth();
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  
  // ... recording logic ...

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <Layout showSearchBar={false}>
        <LoginScreen />
      </Layout>
    );
  }

  // Show main interface when authenticated
  return (
    <Layout onRecClick={handleRecClick}>
      {recordingState === 'idle' && <SearchResults />}
      {/* ... other states ... */}
    </Layout>
  );
}
```

**Key Points:**
- Early return for login screen
- `showSearchBar={false}` hides search bar
- All recording functionality only available when authenticated

---

### **Header.tsx**

Shows settings menu and conditional search bar:

```typescript
export function Header({ onRecClick, showSearchBar = true }: HeaderProps) {
  const { isAuthenticated } = useAuth();
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  return (
    <div>
      <header>
        {/* ... controls ... */}
        
        {/* Settings Button */}
        <button onClick={() => setShowSettingsMenu(!showSettingsMenu)}>
          <svg><!-- Settings icon --></svg>
        </button>
      </header>

      {/* Search Bar - Only when showSearchBar=true */}
      {showSearchBar && !isScrolled && (
        <div><!-- Search bar UI --></div>
      )}

      {/* Settings Menu - Only when authenticated */}
      {isAuthenticated && showSettingsMenu && (
        <SettingsMenu onClose={() => setShowSettingsMenu(false)} />
      )}
    </div>
  );
}
```

**Key Points:**
- Settings menu only shows when authenticated
- Search bar respects `showSearchBar` prop
- Settings button always visible (for future non-auth settings)

---

### **SettingsMenu.tsx**

Dropdown menu with logout:

```typescript
export function SettingsMenu({ onClose }: SettingsMenuProps) {
  const { logout } = useAuth();
  const shadowRoot = useShadowRoot();

  const handleLogout = () => {
    logout();
    onClose();
  };

  const menuContent = (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      {/* Menu */}
      <div className="absolute right-0 top-10 z-50">
        <button onClick={handleLogout}>
          <svg><!-- Logout icon --></svg>
          Sign Out
        </button>
      </div>
    </>
  );

  return shadowRoot ? createPortal(menuContent, shadowRoot) : menuContent;
}
```

**Key Features:**
- Uses portal for proper Shadow DOM rendering
- Backdrop closes menu on click
- Clean dropdown design
- Logout icon (door with arrow)

---

## 🎨 UI/UX Design

### **Login Screen:**

```
┌────────────────────────────────────────┐
│                                        │
│              UDAN [Beta]               │
│   Sign in to access your personalized │
│         digital assistant              │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │  [U]  Sign in with UDAN          │ │
│  └──────────────────────────────────┘ │
│                                        │
│    By signing in, you agree to...     │
│                                        │
│         ─  ●  ─                        │
│                                        │
└────────────────────────────────────────┘
```

### **Settings Menu:**

```
┌────────────────┐
│  [🚪] Sign Out │
└────────────────┘
```

**Design Principles:**
- Clean, minimal interface
- Google-style button (white bg, border, hover effects)
- Centered layout for login
- Professional color scheme

---

## 🔍 Testing

### **Test Login Flow:**

1. **Initial State** (Not Logged In):
   ```javascript
   // Widget should show:
   ✅ Login screen
   ✅ No search bar
   ✅ No REC button
   ✅ No search results
   ```

2. **Click "Sign in with UDAN"**:
   ```javascript
   // Widget should show:
   ✅ Search bar appears
   ✅ REC button appears
   ✅ Search results list
   ✅ All functionality available
   ```

3. **Click Settings → Sign Out**:
   ```javascript
   // Widget should show:
   ✅ Back to login screen
   ✅ Search bar hidden
   ✅ Settings menu closed
   ```

### **Debug Commands:**

```javascript
// Check auth state
const { isAuthenticated } = useAuth();
console.log('Authenticated:', isAuthenticated);

// Manually login
const { login } = useAuth();
login();

// Manually logout
const { logout } = useAuth();
logout();
```

---

## 🚀 Production Integration

### **To Add Real Authentication:**

1. **Update AuthContext.tsx**:

```typescript
const login = async () => {
  try {
    // Call your auth API
    const response = await fetch('https://api.udan.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ /* credentials */ })
    });
    
    const data = await response.json();
    
    // Store token
    localStorage.setItem('udan_token', data.token);
    
    // Update state
    setIsAuthenticated(true);
    setUser(data.user);
  } catch (error) {
    console.error('Login failed:', error);
  }
};

const logout = () => {
  // Clear token
  localStorage.removeItem('udan_token');
  
  // Update state
  setIsAuthenticated(false);
  setUser(null);
};
```

2. **Add Token Persistence**:

```typescript
// Check for existing token on mount
useEffect(() => {
  const token = localStorage.getItem('udan_token');
  if (token) {
    // Validate token with API
    validateToken(token).then(valid => {
      setIsAuthenticated(valid);
    });
  }
}, []);
```

3. **Add OAuth/SSO**:

```typescript
const loginWithGoogle = () => {
  // Redirect to Google OAuth
  window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?...';
};

const loginWithUDAN = () => {
  // Your UDAN OAuth flow
  window.location.href = 'https://auth.udan.com/oauth?...';
};
```

---

## 📋 Checklist

**Before Deploying:**

- [ ] Replace mock login with real auth API
- [ ] Add token persistence (localStorage/cookies)
- [ ] Implement token refresh logic
- [ ] Add error handling for failed login
- [ ] Add loading state during login
- [ ] Implement "Remember Me" functionality
- [ ] Add password reset flow (if using email/password)
- [ ] Test logout clears all user data
- [ ] Ensure tokens are securely stored
- [ ] Add session timeout handling

---

## 🎯 Next Steps

**Potential Enhancements:**

1. **Multi-provider Login**:
   - Sign in with Google
   - Sign in with Microsoft
   - Sign in with Apple
   - Sign in with Email

2. **User Profile**:
   - Show user avatar in header
   - Display user name
   - Account settings page

3. **Session Management**:
   - Auto-logout on inactivity
   - "Keep me logged in" option
   - Multiple device sessions

4. **Security**:
   - 2FA support
   - Email verification
   - Security notifications

---

## 🐛 Troubleshooting

### Issue: Login button doesn't work

**Check:**
```typescript
// AuthContext properly imported?
import { useAuth } from '../contexts/AuthContext';

// login function called?
const { login } = useAuth();
<button onClick={login}>Sign in</button>
```

### Issue: Still showing login after clicking button

**Check:**
```typescript
// State updating?
console.log('Before login:', isAuthenticated); // false
login();
console.log('After login:', isAuthenticated); // true
```

### Issue: Settings menu not appearing

**Check:**
```typescript
// Authenticated?
{isAuthenticated && showSettingsMenu && (
  <SettingsMenu onClose={...} />
)}
```

---

## 📚 Summary

**What We Built:**

✅ Complete login/logout flow  
✅ "Sign in with UDAN" button (Google style)  
✅ Conditional rendering based on auth state  
✅ Settings menu with logout option  
✅ Hidden search bar when not logged in  
✅ Clean, professional UI  
✅ Shadow DOM compatible  

**Files Modified/Created:**

- ✅ `/App.tsx` - Added AuthProvider
- ✅ `/contexts/AuthContext.tsx` - Auth state management
- ✅ `/components/LoginScreen.tsx` - Login UI
- ✅ `/components/HomePageUser.tsx` - Conditional rendering
- ✅ `/components/Header.tsx` - Settings menu + search control
- ✅ `/components/SettingsMenu.tsx` - Logout dropdown
- ✅ `/components/Layout.tsx` - showSearchBar prop

**Ready to use!** 🎉

Just integrate with your real authentication API and you're all set!
