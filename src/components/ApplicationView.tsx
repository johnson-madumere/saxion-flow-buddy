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
  const [tab, setTab] = useState("documents");

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
            {t("cycle")}: {app.cycle} • {t("status")}: {t(app.status)}
          </div>
        </div>
      </div>

      <Card className="academic-card border-0">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full h-auto p-1 bg-muted/30">
            <TabsTrigger
              value="documents"
              className="flex-col gap-1 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Upload className="w-4 h-4" />
              <span className="text-xs">{t("uploadDocuments")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="assignment"
              className="flex-col gap-1 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <FileText className="w-4 h-4" />
              <span className="text-xs">{t("assignment")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="appointment"
              className="flex-col gap-1 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Clock className="w-4 h-4" />
              <span className="text-xs">{t("appointment")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="interview"
              className="flex-col gap-1 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Video className="w-4 h-4" />
              <span className="text-xs">{t("interview")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="result"
              className="flex-col gap-1 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs">{t("result")}</span>
            </TabsTrigger>
          </TabsList>

          <div className="p-6">
            <TabsContent value="documents" className="mt-0 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {t("uploadDocuments")}
                </h3>
                <p className="text-muted-foreground mb-4">{t("docHint")}</p>
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
                <h4 className="font-semibold mb-3">{t("yourDocs")}</h4>
                {app.steps.documents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    {t("noDocs")}
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
                              {d.mime} • {(d.size / 1024).toFixed(1)} KB •{" "}
                              {d.uploadedAt}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="assignment" className="mt-0 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {t("assignment")}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {t("assignmentHint")}
                </p>
              </div>

              <div className="space-y-4">
                <Textarea
                  rows={8}
                  value={app.steps.assignment.text}
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
                        next.steps.assignment.submittedAt = nowIso().slice(
                          0,
                          10
                        );
                        updateApp(() => next);
                        setApp(next);
                      }}
                      className="gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {t("submitAssignment")}
                    </Button>
                  </motion.div>
                </div>

                {app.steps.assignment.submittedAt && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-academic-success/10 border border-academic-success/20 rounded-lg"
                  >
                    <div className="flex items-center gap-2 text-academic-success text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      Submitted on {app.steps.assignment.submittedAt}
                    </div>
                  </motion.div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="appointment" className="mt-0 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {t("appointment")}
                </h3>
                <p className="text-muted-foreground mb-4">
                  Schedule your intake appointment
                </p>
              </div>

              <div className="grid gap-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t("selectDate")}
                    </label>
                    <Input
                      type="date"
                      value={app.steps.appointment.date}
                      onChange={(e) =>
                        setStep("appointment.date", e.target.value)
                      }
                      className="h-11"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t("selectTime")}
                    </label>
                    <Input
                      type="time"
                      value={app.steps.appointment.time}
                      onChange={(e) =>
                        setStep("appointment.time", e.target.value)
                      }
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t("meetingType")}
                    </label>
                    <Select
                      value={app.steps.appointment.type}
                      onValueChange={(v) => setStep("appointment.type", v)}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="intake">{t("intake")}</SelectItem>
                        <SelectItem value="meet&greet">
                          {t("meetGreet")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t("notes")}
                    </label>
                    <Input
                      value={app.steps.appointment.notes}
                      onChange={(e) =>
                        setStep("appointment.notes", e.target.value)
                      }
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
                    {t("save")}
                  </Button>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="interview" className="mt-0 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">{t("interview")}</h3>
                <p className="text-muted-foreground mb-4">
                  Schedule your final interview
                </p>
              </div>

              <div className="grid gap-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t("selectDate")}
                    </label>
                    <Input
                      type="date"
                      value={app.steps.interview.date}
                      onChange={(e) =>
                        setStep("interview.date", e.target.value)
                      }
                      className="h-11"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t("selectTime")}
                    </label>
                    <Input
                      type="time"
                      value={app.steps.interview.time}
                      onChange={(e) =>
                        setStep("interview.time", e.target.value)
                      }
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t("interviewMode")}
                    </label>
                    <Select
                      value={app.steps.interview.mode}
                      onValueChange={(v) => setStep("interview.mode", v)}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">{t("online")}</SelectItem>
                        <SelectItem value="onCampus">
                          {t("onCampus")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t("videoLink")}
                    </label>
                    <Input
                      value={app.steps.interview.link}
                      onChange={(e) =>
                        setStep("interview.link", e.target.value)
                      }
                      placeholder="https://teams.microsoft.com/..."
                      className="h-11"
                    />
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button className="gap-2">
                    <Video className="w-4 h-4" />
                    {t("save")}
                  </Button>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="result" className="mt-0 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">{t("result")}</h3>
                <p className="text-muted-foreground mb-4">
                  View your application result
                </p>
              </div>

              {app.steps.result.published ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="p-6 bg-gradient-secondary rounded-xl border">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-academic-success rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">
                          {t("resultPublished")}
                        </h4>
                        <p className="text-muted-foreground">
                          {t("publishedAt")}: {app.steps.result.publishedAt}
                        </p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          {t("decision")}
                        </label>
                        <Select
                          value={app.steps.result.decision}
                          onValueChange={(v) => setStep("result.decision", v)}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admit">{t("admit")}</SelectItem>
                            <SelectItem value="conditional">
                              {t("conditional")}
                            </SelectItem>
                            <SelectItem value="reject">
                              {t("reject")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          {t("publishedAt")}
                        </label>
                        <Input
                          value={app.steps.result.publishedAt || ""}
                          onChange={(e) =>
                            setStep("result.publishedAt", e.target.value)
                          }
                          className="h-11"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">{t("noResult")}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {user.role === "staff" && (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={() => togglePublish(true)}
                        className="gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {t("publishResult")}
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        onClick={() => togglePublish(false)}
                        className="gap-2"
                      >
                        <Clock className="w-4 h-4" />
                        {t("unpublishResult")}
                      </Button>
                    </motion.div>
                  </>
                )}

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    onClick={markAllDone}
                    className="gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {t("markAllDone")}
                  </Button>
                </motion.div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </motion.div>
  );
} 