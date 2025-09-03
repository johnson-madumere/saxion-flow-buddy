import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  CheckCircle2,
  ArrowRight,
  ClipboardList,
  Lock,
  Loader2,
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
  const [isReviewing, setIsReviewing] = useState(false);
  const [isApproved, setIsApproved] = useState<boolean>(!!app?.steps?.documents?.approved);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Restore from localStorage on mount if no app exists
  useEffect(() => {
    if (!app) {
      const saved = localStorage.getItem("application");
      if (saved) {
        setApp(JSON.parse(saved));
      }
    }
  }, [app, setApp]);

  // Persist to localStorage whenever app changes
  useEffect(() => {
    if (app) {
      localStorage.setItem("application", JSON.stringify(app));
    }
  }, [app]);

  // keep local state in sync if app changes outside
  useEffect(() => {
    const newApproved = !!app?.steps?.documents?.approved;
    if (newApproved !== isApproved) {
      setIsApproved(newApproved);
    }
    if (newApproved && isReviewing) {
      setIsReviewing(false);
    }
  }, [app?.steps?.documents?.approved, isApproved, isReviewing]);

  // Restore active card based on application state
  useEffect(() => {
    if (app?.steps?.documents?.approved) {
      setActiveCard("appointments");
    } else if (app?.steps?.documents?.submitted) {
      setActiveCard("documents");
    } else if (app?.steps?.assignment?.submittedAt) {
      setActiveCard("documents");
    } else {
      setActiveCard("questionnaire");
    }
  }, [app?.steps?.documents?.approved, app?.steps?.documents?.submitted, app?.steps?.assignment?.submittedAt]);

  // Reset reviewing state if documents are no longer submitted
  useEffect(() => {
    if (!app?.steps?.documents?.submitted && isReviewing) {
      setIsReviewing(false);
    }
  }, [app?.steps?.documents?.submitted, isReviewing]);

  // The three main cards
  const cards = [
    {
      id: "questionnaire",
      label: t("questionnaire"),
      icon: ClipboardList,
      image: "/src/assets/logo.jpg",
      completed: false,
    },
    {
      id: "documents",
      label: t("uploadDocuments"),
      icon: Upload,
      image: "/src/assets/logo.jpg",
      completed: false,
    },
    {
      id: "appointments",
      label: t("scheduleAppointments"),
      icon: Calendar,
      image: "/src/assets/logo.jpg",
      completed: false,
      locked: true,
    },
  ];

  // Start review ONLY after documents have been submitted
  useEffect(() => {
    const docs = app.steps.documents;
    const hasDocs = Array.isArray(docs?.files) && docs.files.length > 0;
    const submitted = !!docs?.submitted;
    const alreadyApproved = !!docs?.approved;

    if (submitted && hasDocs && !alreadyApproved && !isReviewing) {
      setIsReviewing(true);

      const timer = setTimeout(() => {
        setIsReviewing(false);
        setIsApproved(true);

        const next = { ...app };
        if (!next.steps.documents) next.steps.documents = {};
        next.steps.documents.approved = true;
        next.steps.documents.approvedAt = new Date().toISOString();
        next.status = "approved";

        setApp(next);
        updateApp(() => next);

        setForceUpdate(prev => prev + 1);
        setActiveCard("appointments");
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [
    app.steps.documents?.submitted,
    Array.isArray(app.steps.documents?.files) ? app.steps.documents.files.length : 0,
    app.steps.documents?.approved,
  ]);

  // Determine card UI states
  const getCardState = (cardId: string) => {
    if (cardId === activeCard) return "active";
    if (cardId === "questionnaire" && app?.steps?.assignment?.submittedAt) return "completed";
    if (cardId === "documents" && app?.steps?.documents?.approved) return "completed";
    if (cardId === "documents" && !app?.steps?.assignment?.submittedAt) return "disabled";
    if (cardId === "appointments" && !app?.steps?.documents?.approved) return "disabled";
    return "pending";
  };

  const isCardLocked = (cardId: string) => {
    if (cardId === "appointments") return !isApproved;
    return false;
  };

  const setStep = (path: string, value: any) => {
    const next = { ...app };
    const [root, key] = path.split(".");
    if (!next.steps[root]) next.steps[root] = {};
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
    if (!next.steps.documents) next.steps.documents = {};
    if (!Array.isArray(next.steps.documents.files)) next.steps.documents.files = [];
    next.steps.documents.files.push(doc);
    next.status = "inProgress";
    updateApp(() => next);
    setApp(next);
  };

  const submitDocuments = () => {
    const next = { ...app };
    if (!next.steps.documents) next.steps.documents = {};
    if (!Array.isArray(next.steps.documents.files)) next.steps.documents.files = [];
    if (Array.isArray(next.steps.documents)) {
      next.steps.documents.files = [...next.steps.documents];
    }
    next.steps.documents.submitted = true;
    next.steps.documents.submittedAt = new Date().toISOString();
    next.status = "submitted";
    updateApp(() => next);
    setApp(next);
  };

  const nowIso = () => new Date().toISOString();
  
  const CardComponent = ({
    card,
    state,
    onClick,
    isLocked,
  }: {
    card: any;
    state: string;
    onClick: () => void;
    isLocked: boolean;
  }) => {
    const IconComponent = card.icon;
    const isDisabled = state === "disabled" || isLocked;
    const isCompleted = state === "completed";
    const isActive = state === "active";

    return (
      <motion.div
        whileHover={!isDisabled ? { scale: 1.02 } : {}}
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
        className="flex-1 min-w-0"
      >
        <Card
          className={`cursor-pointer transition-all duration-200 h-full ${
            isActive
              ? "ring-2 ring-primary shadow-lg"
              : isCompleted
              ? "bg-green-50 border-green-200"
              : isLocked
              ? "opacity-60 cursor-not-allowed bg-gray-50 border-gray-200"
              : isDisabled
              ? "opacity-50 cursor-not-allowed bg-gray-50"
              : "hover:shadow-md"
          }`}
          onClick={onClick}
        >
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center overflow-hidden border-2 shadow-sm transition-all duration-200 ${
                  isActive
                    ? "border-primary shadow-md scale-105"
                    : isCompleted
                    ? "border-green-300 shadow-md"
                    : isLocked
                    ? "border-gray-300 shadow-sm"
                    : isDisabled
                    ? "border-muted-foreground/30"
                    : "border-primary/20 hover:border-primary/40 hover:shadow-md hover:scale-105"
                }`}
              >
                {isLocked ? (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
                    <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
                  </div>
                ) : (
                  <>
                    <img
                      src={card.image}
                      alt={card.label}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const nextElement =
                          e.currentTarget.nextElementSibling as HTMLElement;
                        if (nextElement) {
                          nextElement.style.display = "flex";
                        }
                      }}
                    />
                    <div
                      className="w-full h-full bg-primary/10 flex items-center justify-center rounded-lg"
                      style={{ display: "none" }}
                    >
                      <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                    </div>
                  </>
                )}
              </div>

              <h3
                className={`font-semibold text-base sm:text-lg transition-colors duration-200 leading-tight ${
                  isLocked
                    ? "text-gray-500"
                    : isDisabled
                    ? "text-muted-foreground"
                    : isActive
                    ? "text-primary"
                    : isCompleted
                    ? "text-green-700"
                    : "text-foreground"
                }`}
              >
                {card.label}
                {isLocked && (
                  <span className="block text-xs mt-1 opacity-70">(Locked)</span>
                )}
              </h3>

              <div className="flex items-center justify-center h-5">
                {isCompleted && (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                )}
                {isActive && !isLocked && (
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                )}
                {isLocked && <Lock className="w-4 h-4 text-gray-500" />}
                {isDisabled && !isLocked && (
                  <Clock className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // Compact arrow
  const ArrowComponent = ({
    isActive,
    isCompleted,
  }: {
    isActive: boolean;
    isCompleted: boolean;
  }) => (
    <div className="hidden md:flex items-center justify-center px-1">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-200 ${
          isCompleted
            ? "bg-green-100 text-green-600"
            : isActive
            ? "bg-primary/20 text-primary"
            : "bg-muted text-muted-foreground"
        }`}
      >
        <ArrowRight
          className={`w-3 h-3 transition-transform duration-300 ${
            isCompleted ? "rotate-0" : isActive ? "translate-x-0.5" : ""
          }`}
        />
      </motion.div>
    </div>
  );

  return (
    <motion.div
      key={`${app?.id}-${app?.steps?.documents?.approved}-${app?.steps?.documents?.submitted}-${forceUpdate}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {/* Header */}
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
            Duration: {app.cycle} • Location: {app.location || "Campus"} • Deadline:{" "}
            {app.deadline || "TBD"} • {t("status")}: {t(app.status)}
          </div>
        </div>
      </div>

      {/* Review / approval banners */}
      {isReviewing && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            <div>
              <div className="font-medium text-blue-900">{t("documentsUnderReview")}</div>
              <div className="text-sm text-blue-700">
                {t("documentsUnderReviewDescription")}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {isApproved && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <div>
              <div className="font-medium text-green-900">{t("documentsApproved")}</div>
              <div className="text-sm text-green-700">
                {t("documentsApprovedDescription")}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step cards */}
      {/* Desktop: full cards */}
      <div className="hidden md:flex items-center gap-0 mb-8">
        {cards.map((card, index) => {
          const state = getCardState(card.id);
          const locked = isCardLocked(card.id);
          const isDisabled = state === "disabled" || locked;
          const isCompleted = state === "completed";

          return (
            <React.Fragment key={card.id}>
              <CardComponent
                card={card}
                state={state}
                onClick={() => !isDisabled && setActiveCard(card.id)}
                isLocked={locked}
              />
              {index < cards.length - 1 && (
                <ArrowComponent
                  isActive={activeCard === card.id || activeCard === cards[index + 1].id}
                  isCompleted={isCompleted}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile: compact stepper */}
      <div className="flex md:hidden items-center justify-center gap-2 mb-8">
        {cards.map((card, index) => {
          const state = getCardState(card.id);
          const isCompleted = state === "completed";
          const isActive = state === "active";
          return (
            <React.Fragment key={card.id}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                isCompleted
                  ? "bg-green-100 border-green-400 text-green-600"
                  : isActive
                  ? "bg-primary/20 border-primary text-primary"
                  : "bg-muted border-muted-foreground text-muted-foreground"
              }`}>
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Clock className="w-5 h-5" />
                )}
              </div>
              {index < cards.length - 1 && (
                <ArrowRight className="w-4 h-4 text-muted-foreground mx-1" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Content */}
      <Card className="academic-card border-0">
        <div className="p-6">
          {/* Questionnaire */}
          {activeCard === "questionnaire" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">{t("questionnaire")}</h3>
                <p className="text-muted-foreground mb-4">{t("completeQuestionnaireToProceed")}</p>
              </div>

              <div className="space-y-4">
                <Textarea
                  rows={8}
                  value={app.steps.assignment?.text || ""}
                  onChange={(e) => setStep("assignment.text", e.target.value)}
                  placeholder={t("writeMotivationLetter")}
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
                      if (!next.steps.assignment) next.steps.assignment = {};
                      next.steps.assignment.file = meta;
                      next.steps.assignment.submittedAt = nowIso().slice(0, 10);
                      updateApp(() => next);
                      setApp(next);
                    }}
                    className="flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => {
                        const next = { ...app };
                        if (!next.steps.assignment) next.steps.assignment = {};
                        next.steps.assignment.submittedAt = nowIso().slice(0, 10);
                        next.status = "questionnaireCompleted";
                        updateApp(() => next);
                        setApp(next);
                        setActiveCard("documents");
                      }}
                      className="gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {t("completeQuestionnaire")}
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
                      {t("questionnaireCompleted")} {app.steps.assignment.submittedAt}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* Upload Documents */}
          {activeCard === "documents" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">{t("uploadDocuments")}</h3>
                <p className="text-muted-foreground mb-4">{t("uploadRequiredDocuments")}</p>
              </div>

              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center bg-muted/10">
                <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                <input
                  type="file"
                  onChange={(e) => e.target.files?.[0] && addDocument(e.target.files[0])}
                  className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
              </div>

              <div>
                <h4 className="font-semibold mb-3">{t("yourDocuments")}</h4>
                {!Array.isArray(app.steps.documents?.files) || app.steps.documents.files.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    {t("noDocumentsUploadedYet")}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {app.steps.documents.files.map((d: any) => (
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

              {/* Submit vs Proceed controls */}
              {Array.isArray(app.steps.documents?.files) &&
                app.steps.documents.files.length > 0 &&
                !app.steps.documents.submitted && (
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button onClick={submitDocuments} className="gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      {t("submitDocuments")}
                    </Button>
                  </motion.div>
                )}

              {app.steps.documents.submitted && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => setActiveCard("appointments")}
                      className="gap-2"
                      disabled={!isApproved}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {isApproved ? t("proceedToAppointments") : t("waitingForApproval")}
                    </Button>
                  </motion.div>
                  
                  {/* Debug button - remove in production */}
                  {!isApproved && (
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsReviewing(false);
                          setIsApproved(true);
                          
                          const next = { ...app };
                          if (!next.steps.documents) next.steps.documents = {};
                          next.steps.documents.approved = true;
                          next.steps.documents.approvedAt = new Date().toISOString();
                          next.status = "approved";
                          
                          setApp(next);
                          updateApp(() => next);
                          setForceUpdate(prev => prev + 1);
                          setActiveCard("appointments");
                        }}
                        className="gap-2"
                      >
                        <Clock className="w-4 h-4" />
                        Debug: Approve Now
                      </Button>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Appointments */}
          {activeCard === "appointments" && (
            <div className="space-y-6">
              {!isApproved ? (
                <div className="text-center py-12">
                  <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">{t("appointmentsLocked")}</h3>
                  <p className="text-muted-foreground mb-4">{t("appointmentsLockedDescription")}</p>
                  <Button variant="outline" onClick={() => setActiveCard("documents")} className="gap-2">
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    {t("backToDocuments")}
                  </Button>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t("scheduleAppointments")}</h3>
                    <p className="text-muted-foreground mb-4">{t("scheduleAppointmentsDescription")}</p>
                  </div>

                  <div className="grid gap-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">{t("selectDate")}</label>
                        <Input
                          type="date"
                          value={app.steps.appointment?.date || ""}
                          onChange={(e) => setStep("appointment.date", e.target.value)}
                          className="h-11"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">{t("selectTime")}</label>
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
                        <label className="text-sm font-medium mb-2 block">{t("meetingType")}</label>
                        <Select
                          value={app.steps.appointment?.type || ""}
                          onValueChange={(v) => setStep("appointment.type", v)}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="intake">{t("intake")}</SelectItem>
                            <SelectItem value="meet&greet">{t("meetGreet")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">{t("notes")}</label>
                        <Input
                          value={app.steps.appointment?.notes || ""}
                          onChange={(e) => setStep("appointment.notes", e.target.value)}
                          placeholder={t("additionalNotes")}
                          className="h-11"
                        />
                      </div>
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="gap-2">
                        <Calendar className="w-4 h-4" />
                        {t("saveAppointment")}
                      </Button>
                    </motion.div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}