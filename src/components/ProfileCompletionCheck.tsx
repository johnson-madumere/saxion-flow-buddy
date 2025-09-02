import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, User } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileCompletionCheckProps {
  t: (key: string) => string;
  user: any;
  onCompleteProfile: () => void;
}

export function ProfileCompletionCheck({ t, user, onCompleteProfile }: ProfileCompletionCheckProps) {
  // Check if profile is complete
  const isProfileComplete = user.locationOfHome && user.dateOfBirth;
  
  if (isProfileComplete) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-orange-800 mb-2">
                {t("profileIncomplete")}
              </h3>
              <p className="text-orange-700 mb-4">
                {t("completeProfileFirst")}
              </p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={onCompleteProfile}
                  className="bg-orange-600 hover:bg-orange-700 text-white gap-2"
                >
                  <User className="w-4 h-4" />
                  {t("completeProfile")}
                </Button>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 