import React from 'react';

interface SidebarProps {
  children: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="w-80 bg-gray-900/80 backdrop-blur-sm border-r border-gray-700 p-6 space-y-6 overflow-y-auto">
      {children}
    </aside>
  );
}

