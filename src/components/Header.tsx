import React from "react";
import { Button } from "@/components/ui/button";
import { Shield, Globe } from "lucide-react";
import { motion } from "framer-motion";
import logo from "@/assets/logo.jpg";
import { ProfileIcon } from "./ProfileIcon";

interface HeaderProps {
  t: (key: string) => string;
  lang: string;
  setLang: (lang: string) => void;
  user: any;
  onProfileClick: () => void;
}

export function Header({ t, lang, setLang, user, onProfileClick }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-[#319C82] shadow-lg"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <motion.div
          className="flex items-center"
          whileHover={{ scale: 1.02 }}
        >
          <img src={logo} alt="Saxion Logo" width={137} height={67} />
        </motion.div>

        {/* Right side navigation */}
        <div className="flex items-center gap-4">
          {/* Privacy Policy Link */}
          <motion.a
            href="https://www.saxion.edu/about-saxion/privacy-policy-intake-meet-and-greet"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-2 text-sm text-white/90 hover:text-white transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
          >
            <Shield className="w-4 h-4" />
            {t("privacy")}
          </motion.a>

          {/* Language Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/70 font-medium">EN</span>
            <motion.button
              onClick={() => setLang(lang === "en" ? "nl" : "en")}
              className="relative w-12 h-6 bg-white/20 rounded-full p-1 cursor-pointer transition-all duration-300 hover:bg-white/30"
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-4 h-4 bg-white rounded-full shadow-md"
                animate={{
                  x: lang === "en" ? 0 : 24,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
            <span className="text-xs text-white/70 font-medium">NL</span>
          </div>

          {/* User Actions */}
          {user && (
            <ProfileIcon user={user} onClick={onProfileClick} />
          )}
        </div>
      </div>
    </motion.header>
  );
} 