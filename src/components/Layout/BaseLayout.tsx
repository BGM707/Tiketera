import React, { ReactNode } from 'react';
import { BaseLayout } from '../../classes/LayoutManager';

interface BaseLayoutProps {
  children: ReactNode;
  layoutManager: BaseLayout;
  className?: string;
}

export function BaseLayoutComponent({ children, layoutManager, className = '' }: BaseLayoutProps) {
  const config = layoutManager.getConfig();
  const layoutClasses = layoutManager.getLayoutClasses();
  const containerClasses = layoutManager.getContainerClasses();

  return (
    <div className={`${layoutClasses} ${className}`}>
      {children}
    </div>
  );
}