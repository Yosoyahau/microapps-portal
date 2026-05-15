const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/app/(dashboard)/page.tsx',
  'src/components/ui/LanguageSwitcher.tsx',
  'src/components/layout/Header.tsx',
  'src/components/layout/Sidebar.tsx',
  'src/components/profile/ProfileModal.tsx',
  'src/components/ui/GlassCard.tsx',
  'src/components/ui/Input.tsx',
];

filesToFix.forEach(relPath => {
  const filePath = path.join(__dirname, relPath);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace text-white with text-base-content
  content = content.replace(/text-white/g, 'text-base-content');
  // Replace border-white with border-base-content
  content = content.replace(/border-white/g, 'border-base-content');
  // Replace bg-white with bg-base-content
  content = content.replace(/bg-white/g, 'bg-base-content');
  // Replace from-white to from-base-content
  content = content.replace(/from-white/g, 'from-base-content');
  // Replace to-white to to-base-content
  content = content.replace(/to-white/g, 'to-base-content');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed ${relPath}`);
});
