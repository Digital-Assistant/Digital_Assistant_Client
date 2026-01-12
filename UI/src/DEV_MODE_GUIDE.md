# 🚀 Dev Mode Setup Guide

## ✅ Configuration Complete!

Your Vite setup now works **exactly like webpack** - CSS is automatically injected into Shadow DOM!

---

## 📁 File Structure

```
/
├── index.html              ⭐ Entry HTML (root)
├── vite.config.ts          ⭐ Vite config with Shadow DOM plugin (root)
├── main.tsx                ⭐ Entry point - creates Shadow DOM (root)
├── App.tsx                 ⭐ Imports CSS (root)
├── styles/
│   └── globals.css         Your styles
└── components/             Your components
```

---

## 🔧 How to Run

### Dev Mode:

```bash
npm run dev
```

**What happens:**
1. Vite starts dev server at `http://localhost:3000`
2. `index.html` loads
3. Interceptor script runs (from `vite.config.ts`)
4. `main.tsx` creates Shadow DOM
5. `App.tsx` imports CSS
6. Vite injects CSS → Interceptor redirects to Shadow DOM ✅

### Build Mode:

```bash
npm run build
```

**Output:**
```
build/
└── udan-widget.js  (Single file with CSS)
```

---

## 🔍 Debugging

### 1. Open DevTools Console

You should see these messages:

```
🔧 Shadow DOM CSS Interceptor initialized
✅ Shadow Root created
✅ React container created in Shadow DOM
🎨 <style> detected (append) - Vite dev mode
✅ Injecting <style> into Shadow DOM
✅ UDAN Widget initialized successfully!
✅ Shadow DOM detected and ready!
```

### 2. Check Shadow DOM

**DevTools → Elements:**

```html
<html>
  <body>
    <udan>
      └─ <div id="udan-react-root">
          └─ #shadow-root (open)  ← Click to expand
              ├─ <style>/* Your CSS */</style>  ✅
              └─ <div id="udan-react-app-root">
                  └─ [Your React App]
```

### 3. Run Debug Command

In console:

```javascript
window.__udanDebugStyles__()
```

**Expected output:**
```
📋 Styles in Shadow DOM: 1
  Style 1: :root { ... }
📋 Queued styles: 0
```

### 4. Verify CSS is in Shadow DOM

```javascript
// Check Shadow DOM
window.udanShadowRoot.querySelectorAll('style').length
// → Should be > 0

// Check document head (should NOT have widget styles)
document.head.querySelectorAll('style').length
// → May be 0 or only have host page styles
```

---

## ⚠️ Troubleshooting

### Issue: No styles visible

**Check console for:**
- `🔧 Shadow DOM CSS Interceptor initialized` ✅
- `🎨 <style> detected` ✅
- `✅ Injecting <style> into Shadow DOM` ✅

**If you don't see these:**

1. Make sure `index.html` is at root
2. Make sure `vite.config.ts` is at root
3. Restart dev server: `npm run dev`

### Issue: Styles in wrong place

**Run:**
```javascript
// Check where styles are
console.log('Document styles:', document.querySelectorAll('style').length);
console.log('Shadow styles:', window.udanShadowRoot.querySelectorAll('style').length);
```

**Expected:**
- Document styles: 0 (or only Vite HMR styles)
- Shadow styles: 1+ (your widget CSS)

### Issue: Widget not appearing

**Check:**

1. Shadow DOM exists:
   ```javascript
   window.udanShadowRoot
   // → Should return ShadowRoot object
   ```

2. React rendered:
   ```javascript
   window.udanShadowRoot.getElementById('udan-react-app-root')
   // → Should return <div> with React app
   ```

3. Console for errors:
   - Look for React errors
   - Look for CSS import errors

---

## 📊 Console Messages Explained

### Normal Flow:

```
1. 🔧 Shadow DOM CSS Interceptor initialized
   → Interceptor script loaded and ready

2. ✅ Shadow Root created
   → main.tsx created Shadow DOM

3. ✅ React container created in Shadow DOM
   → main.tsx created React mount point

4. 🎨 <style> detected (append) - Vite dev mode
   → Vite tried to inject CSS

5. ✅ Injecting <style> into Shadow DOM
   → Interceptor redirected to Shadow DOM

6. ✅ UDAN Widget initialized successfully!
   → Everything ready!

7. ✅ Shadow DOM detected and ready!
   → Interceptor confirmed Shadow DOM exists
```

### If you see queuing messages:

```
⏳ Queuing style (Shadow DOM not ready yet)
```

**This is normal!** The interceptor queues styles until Shadow DOM is ready, then processes them.

### After a few seconds:

```
📋 Processing style queue: 1 items
✅ Injecting <style> into Shadow DOM
```

**This means queued styles were successfully injected.**

---

## 🎯 What's Different from Webpack?

### Webpack:
```javascript
// webpack.config.js
const customStyleLoader = {
  loader: 'style-loader',
  options: {
    insert: function (linkTag) {
      const parent = document.querySelector('#udan-react-root').shadowRoot;
      parent.appendChild(linkTag);
    }
  }
}
```

### Vite:
```javascript
// vite.config.ts
function shadowDOMCSSInjector() {
  // Injects interceptor script
  // Overrides document.head.appendChild, etc.
  // Redirects to Shadow DOM
}
```

**Result: Identical!** ✅

Both automatically inject CSS into Shadow DOM without manual code.

---

## ✅ Checklist

Before starting dev:

- [ ] `index.html` exists at root
- [ ] `vite.config.ts` exists at root with `shadowDOMCSSInjector` plugin
- [ ] `main.tsx` creates Shadow DOM (no style injection code)
- [ ] `App.tsx` imports CSS: `import './styles/globals.css'`

When dev server runs:

- [ ] Console shows interceptor initialized
- [ ] Console shows Shadow DOM created
- [ ] Console shows styles injected
- [ ] Widget appears with correct styling
- [ ] DevTools shows styles in Shadow DOM (not document head)

---

## 🚀 You're All Set!

**Just run:**

```bash
npm run dev
```

**Then check:**
1. Open http://localhost:3000
2. Open DevTools console
3. Look for ✅ messages
4. Run `window.__udanDebugStyles__()`
5. Widget should appear with styles!

**If you see all ✅ messages, it's working perfectly!**

---

## 📚 Additional Commands

### Debug Shadow DOM:
```javascript
window.udanShadowRoot
```

### Debug Styles:
```javascript
window.__udanDebugStyles__()
```

### View Style Content:
```javascript
const styles = window.udanShadowRoot.querySelectorAll('style');
styles.forEach((s, i) => {
  console.log(`Style ${i}:`, s.textContent.substring(0, 200));
});
```

### Compare with Document:
```javascript
console.log('Shadow DOM styles:', window.udanShadowRoot.querySelectorAll('style').length);
console.log('Document styles:', document.querySelectorAll('style').length);
```

---

**Happy coding!** 🎉
