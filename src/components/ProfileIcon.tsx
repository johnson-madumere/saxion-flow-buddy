import React from "react";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileIconProps {
  user: any;
  onClick: () => void;
}

export function ProfileIcon({ user, onClick }: ProfileIconProps) {
  if (!user) return null;

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClick}
        className="h-10 w-10 rounded-full p-0 border-0 bg-white/10 hover:bg-white/20 text-white"
        title="Profile"
      >
        <User className="h-5 w-5" />
      </Button>
    </motion.div>
  );
} 