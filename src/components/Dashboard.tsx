import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Archive, Download, FileText, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ProfileCompletionCheck } from "./ProfileCompletionCheck";

interface DashboardProps {
  t: (key: string) => string;
  user: any;
  onStart: (app: any) => void;
  onRunArchival: () => void;
  onDownload: () => void;
  onCompleteProfile: () => void;
}

export function Dashboard({ t, user, onStart, onRunArchival, onDownload, onCompleteProfile }: DashboardProps) {
  const appsActive = user.applications.filter((a: any) => !a.archived);
  const appsArchived = user.applications.filter((a: any) => a.archived);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <ProfileCompletionCheck 
        t={t} 
        user={user} 
        onCompleteProfile={onCompleteProfile} 
      />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {t("welcome")}, {user.name}!
          </h1>
          <p className="text-muted-foreground">{t("multiApplicationsNote")}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-academic rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          {t("applications")}
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {appsActive.map((a: any, index: number) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="academic-card h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <Badge
                        variant={a.isInternational ? "default" : "secondary"}
                        className="mb-3"
                      >
                        {a.isInternational ? t("international") : t("local")}
                      </Badge>
                      <h3 className="font-bold text-lg mb-2 line-clamp-2">
                        {a.program}
                      </h3>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div>
                          {t("cycle")}: {a.cycle}
                        </div>
                        <div>
                          {t("created")}: {a.createdAt}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <Badge
                      variant={a.status === "new" ? "outline" : "secondary"}
                      className="capitalize"
                    >
                      {t(a.status)}
                    </Badge>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => onStart(a)}
                      className="w-full academic-button-primary gap-2"
                    >
                      <ArrowRight className="w-4 h-4" />
                      {a.status === "new" ? t("start") : t("resume")}
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {appsArchived.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Archive className="w-5 h-5 text-muted-foreground" />
            {t("archives")}
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {appsArchived.map((a: any, index: number) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="opacity-75 hover:opacity-90 transition-opacity">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <Badge variant="outline" className="mb-3">
                          {t("archived")}
                        </Badge>
                        <h3 className="font-semibold mb-2">{a.program}</h3>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div>
                            {t("cycle")}: {a.cycle}
                          </div>
                          <div>
                            {t("created")}: {a.createdAt}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
} 