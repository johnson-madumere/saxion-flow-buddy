import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Calendar,
  Upload,
  FileText,
  Clock,
  Video,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Calendar as CalendarIcon,
  ClipboardList,
} from "lucide-react";
import { motion } from "framer-motion";

interface ApplicationViewProps {
  t: (key: string) => string;
  user: any;
  app: any;
  setApp: (app: any) => void;
  updateApp: (updater: (app: any) => any) => void;
}

export function ApplicationView({ t, user, app, setApp, updateApp }: ApplicationViewProps) {
  const [activeCard, setActiveCard] = useState("questionnaire");
  
  // Define the three main cards with their properties
  const cards = [
    {
      id: "questionnaire",
      label: "Questionnaire",
      icon: ClipboardList,
      image: "/src/assets/logo.jpg", // Saxion logo for questionnaire
      completed: false,
    },
    {
      id: "documents",
      label: "Upload Documents", 
      icon: Upload,
      image: "/src/assets/logo.jpg", // Saxion logo for documents
      completed: false,
    },
    {
      id: "appointments",
      label: "Appointments",
      icon: Calendar,
      image: "/src/assets/logo.jpg", // Saxion logo for appointments
      completed: false,
    },
  ];

  // Determine card states based on active card
  const getCardState = (cardId: string) => {
    if (cardId === activeCard) return "active";
    if (cardId === "questionnaire" && activeCard === "documents") return "completed";
    if (cardId === "questionnaire" && activeCard === "appointments") return "completed";
    if (cardId === "documents" && activeCard === "appointments") return "completed";
    if (cardId === "documents" && activeCard === "questionnaire") return "disabled";
    if (cardId === "appointments" && activeCard !== "appointments") return "disabled";
    return "pending";
  };

  const setStep = (path: string, value: any) => {
    const next = { ...app };
    const [root, key] = path.split(".");
    next.steps[root][key] = value;
    updateApp(() => next);
    setApp(next);
  };

  const addDocument = (file: File) => {
    const doc = {
      id: Math.random().toString(36).slice(2),
      label: file.name,
      filename: file.name,
      size: file.size,
      mime: file.type || "application/octet-stream",
      uploadedAt: new Date().toISOString().slice(0, 10),
    };
    const next = { ...app };
    next.steps.documents = [...next.steps.documents, doc];
    next.status = "inProgress";
    updateApp(() => next);
    setApp(next);
  };

  const markAllDone = () => {
    const next = { ...app, status: "submitted" };
    updateApp(() => next);
    setApp(next);
  };

  const togglePublish = (publish: boolean) => {
    const next = { ...app };
    next.steps.result.published = publish;
    next.steps.result.publishedAt = publish ? new Date().toISOString().slice(0, 10) : null;
    if (publish && !next.steps.result.decision)
      next.steps.result.decision = "conditional";
    next.status = publish ? "resultPublished" : next.status;
    updateApp(() => next);
    setApp(next);
  };

  const nowIso = () => new Date().toISOString();

  // Reusable Card Component
  const CardComponent = ({ card, state, onClick }: { card: any, state: string, onClick: () => void }) => {
    const IconComponent = card.icon;
    const isDisabled = state === "disabled";
    const isCompleted = state === "completed";
    const isActive = state === "active";
    
    return (
      <motion.div
        whileHover={!isDisabled ? { scale: 1.02 } : {}}
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
      >
        <Card 
          className={`cursor-pointer transition-all duration-200 ${
            isActive 
              ? "ring-2 ring-primary shadow-lg" 
              : isCompleted 
              ? "bg-green-50 border-green-200" 
              : isDisabled 
              ? "opacity-50 cursor-not-allowed bg-gray-50" 
              : "hover:shadow-md"
          }`}
          onClick={onClick}
        >
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Image Container */}
              <div className={`w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center overflow-hidden border-2 shadow-sm transition-all duration-200 ${
                isActive 
                  ? "border-primary shadow-md scale-105" 
                  : isCompleted 
                  ? "border-green-300 shadow-md" 
                  : isDisabled 
                  ? "border-muted-foreground/30" 
                  : "border-primary/20 hover:border-primary/40 hover:shadow-md hover:scale-105"
              }`}>
                <img 
                  src={card.image} 
                  alt={card.label}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'flex';
                    }
                  }}
                />
                <div className="w-full h-full bg-primary/10 flex items-center justify-center rounded-lg" style={{display: 'none'}}>
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>
              </div>
              
              {/* Card Label */}
              <h3 className={`font-semibold text-lg transition-colors duration-200 ${
                isDisabled 
                  ? "text-muted-foreground" 
                  : isActive 
                  ? "text-primary" 
                  : isCompleted 
                  ? "text-green-700" 
                  : "text-foreground"
              }`}>
                {card.label}
              </h3>
              
              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                {isCompleted && (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                )}
                {isActive && (
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                )}
                {isDisabled && (
                  <Clock className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button
            variant="ghost"
            onClick={() => setApp(null)}
            className="gap-2 self-start"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            {t("back")}
          </Button>
        </motion.div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">{app.program}</h1>
            <Badge variant={app.isInternational ? "default" : "secondary"}>
              {app.isInternational ? t("international") : t("local")}
            </Badge>
            {app.archived && <Badge variant="outline">{t("archived")}</Badge>}
          </div>
          <div className="text-muted-foreground">
            Duration: {app.cycle} • Location: {app.location || "Campus"} • Deadline: {app.deadline || "TBD"} • {t("status")}: {t(app.status)}
          </div>
        </div>
      </div>

      {/* Three Card Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card) => {
          const state = getCardState(card.id);
          const isDisabled = state === "disabled";
          
          return (
            <CardComponent
              key={card.id}
              card={card}
              state={state}
              onClick={() => !isDisabled && setActiveCard(card.id)}
            />
          );
        })}
      </div>

      {/* Content Area */}
      <Card className="academic-card border-0">
        <div className="p-6">
          {/* Questionnaire Content */}
          {activeCard === "questionnaire" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Questionnaire</h3>
                <p className="text-muted-foreground mb-4">Complete the application questionnaire to proceed</p>
              </div>
              
              <div className="space-y-4">
                <Textarea
                  rows={8}
                  value={app.steps.assignment?.text || ""}
                  onChange={(e) => setStep("assignment.text", e.target.value)}
                  placeholder="Write your motivation letter here..."
                  className="resize-none"
                />

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="file"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      const meta = { name: f.name, size: f.size, type: f.type };
                      const next = { ...app };
                      next.steps.assignment.file = meta;
                      next.steps.assignment.submittedAt = nowIso().slice(0, 10);
                      updateApp(() => next);
                      setApp(next);
                    }}
                    className="flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => {
                        const next = { ...app };
                        next.steps.assignment.submittedAt = nowIso().slice(0, 10);
                        updateApp(() => next);
                        setApp(next);
                        setActiveCard("documents");
                      }}
                      className="gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Complete Questionnaire
                    </Button>
                  </motion.div>
                </div>

                {app.steps.assignment?.submittedAt && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-academic-success/10 border border-academic-success/20 rounded-lg"
                  >
                    <div className="flex items-center gap-2 text-academic-success text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      Questionnaire completed on {app.steps.assignment.submittedAt}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* Upload Documents Content */}
          {activeCard === "documents" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Upload Documents</h3>
                <p className="text-muted-foreground mb-4">Upload your required documents</p>
              </div>

              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center bg-muted/10">
                <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                <input
                  type="file"
                  onChange={(e) =>
                    e.target.files?.[0] && addDocument(e.target.files[0])
                  }
                  className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
              </div>

              <div>
                <h4 className="font-semibold mb-3">Your Documents</h4>
                {app.steps.documents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    No documents uploaded yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {app.steps.documents.map((d: any) => (
                      <motion.div
                        key={d.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-4 border rounded-xl bg-card hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{d.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {d.mime} • {(d.size / 1024).toFixed(1)} KB • {d.uploadedAt}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {app.steps.documents.length > 0 && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => setActiveCard("appointments")}
                    className="gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Proceed to Appointments
                  </Button>
                </motion.div>
              )}
            </div>
          )}

          {/* Appointments Content */}
          {activeCard === "appointments" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Schedule Appointments</h3>
                <p className="text-muted-foreground mb-4">Schedule your intake appointment and interview</p>
              </div>

              <div className="grid gap-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Date</label>
                    <Input
                      type="date"
                      value={app.steps.appointment?.date || ""}
                      onChange={(e) => setStep("appointment.date", e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Time</label>
                    <Input
                      type="time"
                      value={app.steps.appointment?.time || ""}
                      onChange={(e) => setStep("appointment.time", e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Meeting Type</label>
                    <Select
                      value={app.steps.appointment?.type || ""}
                      onValueChange={(v) => setStep("appointment.type", v)}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="intake">Intake</SelectItem>
                        <SelectItem value="meet&greet">Meet & Greet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Notes</label>
                    <Input
                      value={app.steps.appointment?.notes || ""}
                      onChange={(e) => setStep("appointment.notes", e.target.value)}
                      placeholder="Additional notes..."
                      className="h-11"
                    />
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button className="gap-2">
                    <Calendar className="w-4 h-4" />
                    Save Appointment
                  </Button>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
} 