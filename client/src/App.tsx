import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsAndConditionsPage } from './pages/TermsAndConditionsPage';
import { CrownixDifferencePage } from './pages/CrownixDifferencePage';
import { ExpertisePage } from './pages/ExpertisePage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminPricingRequestPage } from './pages/admin/AdminPricingRequestPage';
import { AdminPackageUploadListPage } from './pages/admin/AdminPackageUploadListPage';
import { AdminPackageUploadFormPage } from './pages/admin/AdminPackageUploadFormPage';
import { AdminPackageUploadViewPage } from './pages/admin/AdminPackageUploadViewPage';
import { AdminActiveDealPage } from './pages/admin/AdminActiveDealPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Toaster } from './components/ui/toaster';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleReCaptchaProvider
        reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
        scriptProps={{
          async: true,
          defer: true,
          appendTo: 'head',
        }}
      >
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Admin routes (no header/footer) */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
            <Route path="/admin/pricing-requests/new" element={<AdminLayout><AdminPricingRequestPage /></AdminLayout>} />
            <Route path="/admin/package-uploads" element={<AdminLayout><AdminPackageUploadListPage /></AdminLayout>} />
            <Route path="/admin/package-uploads/new" element={<AdminLayout><AdminPackageUploadFormPage /></AdminLayout>} />
            <Route path="/admin/package-uploads/:id/view" element={<AdminLayout><AdminPackageUploadViewPage /></AdminLayout>} />
            <Route path="/admin/package-uploads/:id/edit" element={<AdminLayout><AdminPackageUploadFormPage /></AdminLayout>} />
            <Route path="/admin/active-deals" element={<AdminLayout><AdminActiveDealPage /></AdminLayout>} />

            {/* Public routes (with header/footer) */}
            <Route path="/*" element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 pt-24">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/crownix-difference" element={<CrownixDifferencePage />} />
                    <Route path="/expertise" element={<ExpertisePage />} />
                    <Route path="/privacy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms" element={<TermsAndConditionsPage />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            } />
          </Routes>
        </Router>
        <Toaster />
      </GoogleReCaptchaProvider>
    </QueryClientProvider>
  );
}
