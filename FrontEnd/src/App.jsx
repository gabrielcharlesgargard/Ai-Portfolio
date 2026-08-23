import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import Register from "./Pages/Register";
import VerifyEmailPage from "./Pages/verifyEmailPage";
import LoginPage from "./Pages/LoginPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import DashboardPage from "./Pages/DashboardPage";
import CommunityPage from "./Pages/CommunityPage";
import PricingPage from "./Pages/PricingPage";
import ProtectedRoute from "./Components/ProtectedRoute";
import SettingsPage from "./Pages/SettingsPage";
import ScrollToTop, { ScrollToTopButton } from "./Components/ScrollToTop";
import { Toaster } from "react-hot-toast";
import BuilderPage from "./Pages/BuilderPage";
import PreviewPage from "./Pages/PreviewPage";
import NotFoundPage from "./Pages/NotFoundPage";

const App = () => {
  return (
    <>
      <ScrollToTop />
      {/* for toasts */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: { borderRadius: "10px", fontSize: "14px" },
          success: { style: { background: "#10b981", color: "#fff" } },
          error: { style: { background: "#ef4444", color: "#fff" } },
        }}
      />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path='/preview/:id' element={<PreviewPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />


        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <BuilderPage />
            </ProtectedRoute>
          }
        />

        <Route path='*' element={<NotFoundPage />} />
      </Routes>
      <ScrollToTopButton />
    </>
  );
};

export default App;
