import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ClientLayoutManager } from '../../classes/LayoutManager';
import { ClientHeader } from './ClientHeader';
import { Footer } from './Footer';
import { BaseLayoutComponent } from './BaseLayout';

export function ClientLayout() {
  const [layoutManager] = useState(() => new ClientLayoutManager());

  return (
    <BaseLayoutComponent layoutManager={layoutManager}>
      <ClientHeader layoutManager={layoutManager} />
      <main className={layoutManager.getContainerClasses()}>
        <Outlet />
      </main>
      <Footer />
    </BaseLayoutComponent>
  );
}