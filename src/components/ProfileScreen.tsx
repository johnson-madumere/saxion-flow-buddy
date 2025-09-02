import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, User, Mail, GraduationCap, Globe, LogOut } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileScreenProps {
  t: (key: string) => string;
  user: any;
  onBack: () => void;
  onUpdateProfile: (updatedUser: any) => void;
  onLogout: () => void;
}

export function ProfileScreen({ t, user, onBack, onUpdateProfile, onLogout }: ProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    locale: user.locale || "en",
    role: user.role || "student",
    locationOfHome: user.locationOfHome || "",
    dateOfBirth: user.dateOfBirth || ""
  });

  const handleSave = () => {
    const updatedUser = {
      ...user,
      ...formData
    };
    onUpdateProfile(updatedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      locale: user.locale || "en",
      role: user.role || "student",
      locationOfHome: user.locationOfHome || "",
      dateOfBirth: user.dateOfBirth || ""
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button
            variant="ghost"
            onClick={onBack}
            className="gap-2 self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("back")}
          </Button>
        </motion.div>
        <div>
          <h1 className="text-3xl font-bold">{t("profile")}</h1>
          <p className="text-muted-foreground">{t("manageYourProfile")}</p>
        </div>
      </div>

      {/* Profile Information */}
      <Card className="academic-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {t("personalInformation")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">{t("fullName")}</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder={t("enterFullName")}
                />
              ) : (
                <div className="p-3 bg-muted/30 rounded-md border">
                  <span className="font-medium">{user.name}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder={t("enterEmail")}
                />
              ) : (
                <div className="p-3 bg-muted/30 rounded-md border">
                  <span className="font-medium">{user.email}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="locale">{t("language")}</Label>
              {isEditing ? (
                <Select
                  value={formData.locale}
                  onValueChange={(value) => handleInputChange("locale", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="nl">Nederlands</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-3 bg-muted/30 rounded-md border">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">
                      {formData.locale === "en" ? "English" : "Nederlands"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">{t("role")}</Label>
              <div className="p-3 bg-muted/30 rounded-md border">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-muted-foreground" />
                  <Badge variant="secondary" className="capitalize">
                    {user.role}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="locationOfHome">{t("locationOfHome")}</Label>
              {isEditing ? (
                <Input
                  id="locationOfHome"
                  value={formData.locationOfHome}
                  onChange={(e) => handleInputChange("locationOfHome", e.target.value)}
                  placeholder={t("enterLocationOfHome")}
                />
              ) : (
                <div className="p-3 bg-muted/30 rounded-md border">
                  <span className="font-medium">
                    {user.locationOfHome || t("notSpecified")}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">{t("dateOfBirth")}</Label>
              {isEditing ? (
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  placeholder={t("enterDateOfBirth")}
                />
              ) : (
                <div className="p-3 bg-muted/30 rounded-md border">
                  <span className="font-medium">
                    {user.dateOfBirth || t("notSpecified")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4">
            {isEditing ? (
              <>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="w-4 h-4" />
                    {t("saveChanges")}
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" onClick={handleCancel}>
                    {t("cancel")}
                  </Button>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button onClick={() => setIsEditing(true)} className="gap-2">
                    <User className="w-4 h-4" />
                    {t("editProfile")}
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    variant="outline" 
                    onClick={onLogout}
                    className="gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  >
                    <LogOut className="w-4 h-4" />
                    {t("logout")}
                  </Button>
                </motion.div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Application Statistics */}
      <Card className="academic-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            {t("applicationStatistics")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-muted/20 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {user.applications?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">
                {t("totalApplications")}
              </div>
            </div>
            <div className="text-center p-4 bg-muted/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {user.applications?.filter((app: any) => app.status === "submitted" || app.status === "resultPublished").length || 0}
              </div>
              <div className="text-sm text-muted-foreground">
                {t("completedApplications")}
              </div>
            </div>
            <div className="text-center p-4 bg-muted/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {user.applications?.filter((app: any) => app.status === "inProgress").length || 0}
              </div>
              <div className="text-sm text-muted-foreground">
                {t("inProgressApplications")}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 