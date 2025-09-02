import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { LogOut, Languages, Shield } from "lucide-react";
import { motion } from "framer-motion";
import logo from "@/assets/logo.jpg";

interface HeaderProps {
  t: (key: string) => string;
  lang: string;
  setLang: (lang: string) => void;
  user: any;
  onLogout: () => void;
}

export function Header({ t, lang, setLang, user, onLogout }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-header-green/95 backdrop-blur-md border-b border-border/40 shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4 lg:p-6">
        <motion.div
          className="flex items-center gap-3 bg-[#319C82]"
          whileHover={{ scale: 1.02 }}
        >
          <img src={logo} alt="Saxion Logo" width={137} height={67} />
        </motion.div>

        <div className="flex items-center gap-3 bg-[#319C82]">
          <motion.a
            href="https://www.saxion.edu/about-saxion/privacy-policy-intake-meet-and-greet"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-2 text-sm hover:text-primary transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            <Shield className="w-4 h-4" />
            {t("privacy")}
          </motion.a>

          <Select value={lang} onValueChange={setLang}>
            <SelectTrigger className="w-[140px] border-0 bg-muted/50">
              <Languages className="w-4 h-4 mr-2" />
              <SelectValue placeholder={t("language")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="nl">Nederlands</SelectItem>
            </SelectContent>
          </Select>

          {user && (
            <motion.div whileHover={{ scale: 1.02 }}>
              <Button
                variant="outline"
                onClick={onLogout}
                className="gap-2 border-0 bg-muted/50"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{t("logout")}</span>
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
} 