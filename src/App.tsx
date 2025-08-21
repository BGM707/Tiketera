import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryProvider } from './components/Providers/QueryProvider';
import { SupabaseAuthProvider } from './hooks/useSupabaseAuth';
import { CartProvider } from './hooks/useCart';
import { NotificationProvider } from './hooks/useNotifications';
import { AdminLayout } from './components/Admin/AdminLayout';
import { ClientLayout } from './components/Layout/ClientLayout';
import Dashboard from './components/Admin/Dashboard';
import { EventManagement } from './components/Admin/EventManagement';
import { Home } from './pages/Home';
import { MyAccount } from './pages/MyAccount';
import { HelpCenter } from './pages/HelpCenter';
import { Contact } from './pages/Contact';
import { RefundPolicy } from './pages/RefundPolicy';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsConditions } from './pages/TermsConditions';
import { QRScanner } from './pages/QRScanner';
import { EventDetail } from './components/Events/EventDetail';
import { SupabaseAuth } from './components/Auth/SupabaseAuth';
import { useSupabaseAuth } from './hooks/useSupabaseAuth';

function App() {
  return (
    <Router>
      <QueryProvider>
        <NotificationProvider>
          <SupabaseAuthProvider>
            <CartProvider>
              <Routes>
                {/* Admin Routes */}
                <Route path="/admin/*" element={
                  <AdminLayout />
                }>
                  <Route index element={<Dashboard />} />
                  <Route path="events" element={<EventManagement />} />
                  <Route path="users" element={<div className="p-6">Gestión de Usuarios - En desarrollo</div>} />
                  <Route path="analytics" element={<div className="p-6">Analytics Avanzados - En desarrollo</div>} />
                  <Route path="finances" element={<div className="p-6">Reportes Financieros - En desarrollo</div>} />
                  <Route path="venues" element={<div className="p-6">Gestión de Venues - En desarrollo</div>} />
                  <Route path="security" element={<div className="p-6">Logs de Seguridad - En desarrollo</div>} />
                  <Route path="settings" element={<div className="p-6">Configuración del Sistema - En desarrollo</div>} />
                  <Route path="scanner" element={<QRScanner />} />
                </Route>

                {/* Public Routes */}
                <Route path="/*" element={
                  <ClientLayout>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/event/:id" element={<EventDetail />} />
                      <Route path="/my-account" element={<MyAccount />} />
                      <Route path="/my-tickets" element={<MyAccount />} />
                      <Route path="/my-orders" element={<MyAccount />} />
                      <Route path="/help" element={<HelpCenter />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/refunds" element={<RefundPolicy />} />
                      <Route path="/privacy" element={<PrivacyPolicy />} />
                      <Route path="/terms" element={<TermsConditions />} />
                      <Route path="/login" element={<SupabaseAuth mode="signin" />} />
                      <Route path="/register" element={<SupabaseAuth mode="signup" />} />
                    </Routes>
                  </ClientLayout>
                } />
              </Routes>
            </CartProvider>
          </SupabaseAuthProvider>
        </NotificationProvider>
      </QueryProvider>
    </Router>
  );
}

export default App;