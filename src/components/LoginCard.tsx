import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface LoginCardProps {
  t: (key: string) => string;
  onLogin: (email: string, password: string) => void;
}

export function LoginCard({ t, onLogin }: LoginCardProps) {
  const [email, setEmail] = useState("alex@saxion-demo.nl");
  const [password, setPassword] = useState("demo");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto mt-12"
    >
      <Card className="academic-card border-0 shadow-elevated overflow-hidden">
        <div className="h-2 bg-[#319C82]"></div>
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">{t("welcome")}</h2>
            <p className="text-muted-foreground">{t("chooseUser")}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                {t("email")}
              </label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("email")}
                className="h-12"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                {t("password")}
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("password")}
                className="h-12"
              />
            </div>

            <div className="flex flex-wrap gap-2 p-4 bg-muted/30 rounded-xl">
              <div className="text-xs text-muted-foreground mb-2 w-full">
                Demo accounts:
              </div>
              <Badge variant="secondary" className="text-xs">
                alex@saxion-demo.nl (NL)
              </Badge>
              <Badge variant="secondary" className="text-xs">
                chidinma@saxion-demo.ng (EN)
              </Badge>
              <Badge variant="outline" className="text-xs">
                staff@saxion-demo.edu
              </Badge>
              <span className="ml-auto text-xs text-muted-foreground">
                Password: demo
              </span>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => onLogin(email, password)}
                className="w-full h-12 bg-[#319C82] gap-2 text-base font-semibold"
              >
                <ArrowRight className="w-5 h-5" />
                {t("login")}
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 