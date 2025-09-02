import React, { useEffect, useState } from "react";
import { Header, LoginCard, Dashboard, ApplicationView, ProfileScreen } from "@/components";
import { useI18n } from "@/hooks/useI18n";
import { loadState, saveState, twoYearsAgo } from "@/lib/utils";

// --- Main App ---
export default function App() {
  const [db, setDb] = useState(loadState());
  const [user, setUser] = useState(null);
  const [activeApp, setActiveApp] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const { lang, setLang, t } = useI18n("en"); // English as default

  useEffect(() => {
    saveState(db);
  }, [db]);

  useEffect(() => {
    if (user?.locale && lang !== user.locale) {
      setLang(user.locale);
    }
  }, [user, lang, setLang]);

  const handleLogin = (email: string, password: string) => {
    const u = db.users.find(
      (x: any) => x.email === email && x.password === password
    );
    if (u) {
      setUser({ ...u });
      setActiveApp(null);
      // Set language immediately when user logs in
      if (u.locale && u.locale !== lang) {
        setLang(u.locale);
      }
    } else {
      alert("Invalid credentials (use demo/demo)");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setActiveApp(null);
    setShowProfile(false);
  };

  const handleProfileClick = () => {
    setShowProfile(true);
    setActiveApp(null);
  };

  const handleProfileBack = () => {
    setShowProfile(false);
  };

  const handleUpdateProfile = (updatedUser: any) => {
    setDb((prev: any) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const idx = copy.users.findIndex((u: any) => u.id === updatedUser.id);
      copy.users[idx] = updatedUser;
      return copy;
    });
    setUser(updatedUser);
    
    // Update language if it changed
    if (updatedUser.locale && updatedUser.locale !== lang) {
      setLang(updatedUser.locale);
    }
  };

  const handleLanguageChange = (newLang: string) => {
    setLang(newLang);
    // Update user's language preference in the database
    if (user && user.locale !== newLang) {
      const updatedUser = { ...user, locale: newLang };
      setDb((prev: any) => {
        const copy = JSON.parse(JSON.stringify(prev));
        const idx = copy.users.findIndex((u: any) => u.id === user.id);
        copy.users[idx] = updatedUser;
        return copy;
      });
      setUser(updatedUser);
    }
  };

  const updateUser = (updater: (user: any) => any) => {
    setDb((prev: any) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const idx = copy.users.findIndex((u: any) => u.id === user.id);
      copy.users[idx] = updater(copy.users[idx]);
      return copy;
    });
    // refresh user state from db
    setUser((prev: any) => {
      const fresh = db.users.find((u: any) => u.id === prev.id) || prev;
      return { ...fresh };
    });
  };

  const runArchival = () => {
    if (!user) return;
    const cutoff = twoYearsAgo();
    updateUser((U: any) => {
      U.applications.forEach((a: any) => {
        if (!a.archived) {
          const created = new Date(a.createdAt);
          if (created < cutoff) a.archived = true;
        }
      });
      return U;
    });
    alert(
      "Archival complete: applications older than 2 years flagged as archived."
    );
  };

  const exportJSON = () => {
    const data = JSON.stringify(db, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "saxion-intake-poc.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header
        t={t}
        lang={lang}
        setLang={handleLanguageChange}
        user={user}
        onProfileClick={handleProfileClick}
      />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {!user ? (
          <LoginCard t={t} onLogin={handleLogin} />
        ) : showProfile ? (
          <ProfileScreen
            t={t}
            user={user}
            onBack={handleProfileBack}
            onUpdateProfile={handleUpdateProfile}
            onLogout={handleLogout}
          />
        ) : activeApp ? (
          <ApplicationView
            t={t}
            user={user}
            app={activeApp}
            setApp={setActiveApp}
            updateApp={(updater) =>
              updateUser((U: any) => {
                const i = U.applications.findIndex(
                  (a: any) => a.id === activeApp.id
                );
                U.applications[i] = updater({ ...U.applications[i] });
                return U;
              })
            }
          />
        ) : (
          <Dashboard
            t={t}
            user={user}
            onStart={(app) => setActiveApp(app)}
            onRunArchival={runArchival}
            onDownload={exportJSON}
            onCompleteProfile={handleProfileClick}
          />
        )}
      </main>
    </div>
  );
}
