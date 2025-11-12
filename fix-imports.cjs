const fs = require('fs');
const path = require('path');

const uiDir = path.join(__dirname, 'client/src/components/ui');
const files = fs.readdirSync(uiDir);

const replacements = [
  [/@radix-ui\/react-accordion@[\d.]+/g, '@radix-ui/react-accordion'],
  [/@radix-ui\/react-alert-dialog@[\d.]+/g, '@radix-ui/react-alert-dialog'],
  [/@radix-ui\/react-aspect-ratio@[\d.]+/g, '@radix-ui/react-aspect-ratio'],
  [/@radix-ui\/react-avatar@[\d.]+/g, '@radix-ui/react-avatar'],
  [/@radix-ui\/react-checkbox@[\d.]+/g, '@radix-ui/react-checkbox'],
  [/@radix-ui\/react-collapsible@[\d.]+/g, '@radix-ui/react-collapsible'],
  [/@radix-ui\/react-context-menu@[\d.]+/g, '@radix-ui/react-context-menu'],
  [/@radix-ui\/react-dialog@[\d.]+/g, '@radix-ui/react-dialog'],
  [/@radix-ui\/react-dropdown-menu@[\d.]+/g, '@radix-ui/react-dropdown-menu'],
  [/@radix-ui\/react-hover-card@[\d.]+/g, '@radix-ui/react-hover-card'],
  [/@radix-ui\/react-label@[\d.]+/g, '@radix-ui/react-label'],
  [/@radix-ui\/react-menubar@[\d.]+/g, '@radix-ui/react-menubar'],
  [/@radix-ui\/react-navigation-menu@[\d.]+/g, '@radix-ui/react-navigation-menu'],
  [/@radix-ui\/react-popover@[\d.]+/g, '@radix-ui/react-popover'],
  [/@radix-ui\/react-progress@[\d.]+/g, '@radix-ui/react-progress'],
  [/@radix-ui\/react-radio-group@[\d.]+/g, '@radix-ui/react-radio-group'],
  [/@radix-ui\/react-scroll-area@[\d.]+/g, '@radix-ui/react-scroll-area'],
  [/@radix-ui\/react-select@[\d.]+/g, '@radix-ui/react-select'],
  [/@radix-ui\/react-separator@[\d.]+/g, '@radix-ui/react-separator'],
  [/@radix-ui\/react-slider@[\d.]+/g, '@radix-ui/react-slider'],
  [/@radix-ui\/react-slot@[\d.]+/g, '@radix-ui/react-slot'],
  [/@radix-ui\/react-switch@[\d.]+/g, '@radix-ui/react-switch'],
  [/@radix-ui\/react-tabs@[\d.]+/g, '@radix-ui/react-tabs'],
  [/@radix-ui\/react-toggle@[\d.]+/g, '@radix-ui/react-toggle'],
  [/@radix-ui\/react-toggle-group@[\d.]+/g, '@radix-ui/react-toggle-group'],
  [/@radix-ui\/react-tooltip@[\d.]+/g, '@radix-ui/react-tooltip'],
  [/class-variance-authority@[\d.]+/g, 'class-variance-authority'],
  [/cmdk@[\d.]+/g, 'cmdk'],
  [/embla-carousel-react@[\d.]+/g, 'embla-carousel-react'],
  [/input-otp@[\d.]+/g, 'input-otp'],
  [/lucide-react@[\d.]+/g, 'lucide-react'],
  [/next-themes@[\d.]+/g, 'next-themes'],
  [/react-day-picker@[\d.]+/g, 'react-day-picker'],
  [/react-hook-form@[\d.]+/g, 'react-hook-form'],
  [/react-resizable-panels@[\d.]+/g, 'react-resizable-panels'],
  [/recharts@[\d.]+/g, 'recharts'],
  [/sonner@[\d.]+/g, 'sonner'],
  [/vaul@[\d.]+/g, 'vaul'],
];

files.forEach(file => {
  const filePath = path.join(uiDir, file);
  if (!fs.statSync(filePath).isFile()) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  replacements.forEach(([pattern, replacement]) => {
    content = content.replace(pattern, replacement);
  });
  fs.writeFileSync(filePath, content);
});

console.log(`Fixed imports in ${files.length} files`);
