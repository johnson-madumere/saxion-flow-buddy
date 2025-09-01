import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Calendar, Upload, FileText, Clock, Video, CheckCircle2, LogOut, Download, Languages, Shield, Archive, ArrowRight, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

// --- Simple i18n dictionary ---
const DICT = {
  en: {
    appTitle: "Saxion Intake – Proof of Concept",
    welcome: "Welcome",
    chooseUser: "Choose a demo user",
    email: "Email",
    password: "Password",
    login: "Login",
    logout: "Logout",
    start: "Start",
    resume: "Resume",
    applications: "Applications",
    archives: "Archives (older than 2 years)",
    runArchival: "Run archival now",
    downloadData: "Download JSON",
    privacy: "Privacy Policy",
    language: "Language",
    local: "Local",
    international: "International",
    program: "Programme",
    cycle: "Cycle",
    status: "Status",
    created: "Created",
    archived: "Archived",
    inProgress: "In progress",
    new: "New",
    submitted: "Submitted",
    resultPublished: "Result published",
    uploadDocuments: "Upload Documents",
    assignment: "Assignment",
    appointment: "Appointment",
    interview: "Interview",
    result: "Result",
    docHint: "Upload study‑related documents (passport, diploma, transcript).",
    upload: "Upload",
    noDocs: "No documents yet.",
    yourDocs: "Your documents",
    submitAssignment: "Submit assignment",
    assignmentHint: "Paste your motivation or upload a PDF.",
    selectDate: "Select date",
    selectTime: "Select time",
    meetingType: "Meeting type",
    intake: "Intake",
    meetGreet: "Meet & Greet",
    notes: "Notes",
    save: "Save",
    interviewMode: "Interview mode",
    online: "Online",
    onCampus: "On campus",
    videoLink: "Video link",
    publishResult: "Publish result",
    unpublishResult: "Unpublish result",
    decision: "Decision",
    admit: "Admit",
    conditional: "Conditional",
    reject: "Reject",
    publishedAt: "Published at",
    noResult: "No published result yet.",
    markAllDone: "Mark steps complete",
    back: "Back",
    startOrResume: "Start / Resume",
    multiApplicationsNote: "You can maintain multiple applications; use Start/Resume to continue.",
  },
  nl: {
    appTitle: "Saxion Intake – Proof of Concept",
    welcome: "Welkom",
    chooseUser: "Kies een demo‑gebruiker",
    email: "E‑mail",
    password: "Wachtwoord",
    login: "Inloggen",
    logout: "Uitloggen",
    start: "Start",
    resume: "Hervatten",
    applications: "Aanvragen",
    archives: "Archief (ouder dan 2 jaar)",
    runArchival: "Archivering uitvoeren",
    downloadData: "JSON downloaden",
    privacy: "Privacyverklaring",
    language: "Taal",
    local: "Nationaal",
    international: "Internationaal",
    program: "Opleiding",
    cycle: "Cohort",
    status: "Status",
    created: "Aangemaakt",
    archived: "Gearchiveerd",
    inProgress: "Bezig",
    new: "Nieuw",
    submitted: "Ingediend",
    resultPublished: "Resultaat gepubliceerd",
    uploadDocuments: "Documenten uploaden",
    assignment: "Opdracht",
    appointment: "Afspraak",
    interview: "Interview",
    result: "Resultaat",
    docHint: "Upload studie‑documenten (paspoort, diploma, cijferlijst).",
    upload: "Uploaden",
    noDocs: "Nog geen documenten.",
    yourDocs: "Jouw documenten",
    submitAssignment: "Opdracht indienen",
    assignmentHint: "Plak je motivatie of upload een PDF.",
    selectDate: "Kies datum",
    selectTime: "Kies tijd",
    meetingType: "Afspraaktype",
    intake: "Intake",
    meetGreet: "Meet & Greet",
    notes: "Notities",
    save: "Opslaan",
    interviewMode: "Interviewmodus",
    online: "Online",
    onCampus: "Op locatie",
    videoLink: "Videolink",
    publishResult: "Resultaat publiceren",
    unpublishResult: "Publicatie ongedaan maken",
    decision: "Beslissing",
    admit: "Toelaten",
    conditional: "Voorwaardelijk",
    reject: "Afwijzen",
    publishedAt: "Gepubliceerd op",
    noResult: "Nog geen gepubliceerd resultaat.",
    markAllDone: "Markeer stappen als voltooid",
    back: "Terug",
    startOrResume: "Start / Hervat",
    multiApplicationsNote: "Je kunt meerdere aanvragen beheren; gebruik Start/Hervat om verder te gaan.",
  }
};

// --- Demo JSON data bootstrap ---
const DEMO_JSON = {
  users: [
    {
      id: "u1",
      name: "Alex Jansen",
      email: "alex@saxion-demo.nl",
      password: "demo",
      role: "student",
      locale: "nl",
      applications: [
        {
          id: "app-nl-2023",
          program: "HBO-ICT",
          cycle: "2023/2024",
          createdAt: "2023-05-20",
          status: "inProgress",
          isInternational: false,
          archived: false,
          steps: {
            documents: [],
            assignment: { text: "", file: null, submittedAt: null },
            appointment: { date: "", time: "", type: "intake", notes: "" },
            interview: { date: "", time: "", mode: "online", link: "" },
            result: { published: false, decision: null, publishedAt: null, notes: "" }
          }
        },
        {
          id: "app-old-2021",
          program: "Creative Media",
          cycle: "2021/2022",
          createdAt: "2021-03-10",
          status: "submitted",
          isInternational: false,
          archived: false,
          steps: {
            documents: [{ id: "d1", label: "Diploma.pdf", filename: "Diploma.pdf", size: 120000, mime: "application/pdf", uploadedAt: "2021-03-12"}],
            assignment: { text: "Portfolio link included.", file: null, submittedAt: "2021-03-15" },
            appointment: { date: "2021-03-20", time: "10:00", type: "intake", notes: "" },
            interview: { date: "2021-03-25", time: "09:30", mode: "online", link: "https://meet.example/abc" },
            result: { published: true, decision: "admit", publishedAt: "2021-04-10", notes: "Congrats!" }
          }
        }
      ]
    },
    {
      id: "u2",
      name: "Chidinma Okoro",
      email: "chidinma@saxion-demo.ng",
      password: "demo",
      role: "student",
      locale: "en",
      applications: [
        {
          id: "app-int-2025",
          program: "Applied Computer Science (English)",
          cycle: "2025/2026",
          createdAt: "2025-06-01",
          status: "new",
          isInternational: true,
          archived: false,
          steps: {
            documents: [],
            assignment: { text: "", file: null, submittedAt: null },
            appointment: { date: "", time: "", type: "meet&greet", notes: "" },
            interview: { date: "", time: "", mode: "online", link: "" },
            result: { published: false, decision: null, publishedAt: null, notes: "" }
          }
        }
      ]
    },
    {
      id: "u3",
      name: "Staff Demo",
      email: "staff@saxion-demo.edu",
      password: "demo",
      role: "staff",
      locale: "en",
      applications: []
    }
  ]
};

// --- Utilities ---
const STORAGE_KEY = "saxion-intake-poc";
const nowIso = () => new Date().toISOString();
const twoYearsAgo = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 2);
  return d;
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEMO_JSON;
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function useI18n(initial) {
  const [lang, setLang] = useState(initial);
  const t = useMemo(() => (key) => (DICT[lang] && DICT[lang][key]) || key, [lang]);
  return { lang, setLang, t };
}

// --- Main App ---
export default function App() {
  const [db, setDb] = useState(loadState());
  const [user, setUser] = useState(null);
  const [activeApp, setActiveApp] = useState(null);
  const defaultLocale = user?.locale || "en";
  const { lang, setLang, t } = useI18n(defaultLocale);

  useEffect(() => {
    saveState(db);
  }, [db]);

  useEffect(() => {
    if (user?.locale && lang !== user.locale) setLang(user.locale);
    // eslint-disable-next-line
  }, [user]);

  const handleLogin = (email, password) => {
    const u = db.users.find((x) => x.email === email && x.password === password);
    if (u) {
      setUser({ ...u });
      setActiveApp(null);
    } else {
      alert("Invalid credentials (use demo/demo)");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setActiveApp(null);
  };

  const updateUser = (updater) => {
    setDb((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const idx = copy.users.findIndex((u) => u.id === user.id);
      copy.users[idx] = updater(copy.users[idx]);
      return copy;
    });
    // refresh user state from db
    setUser((prev) => {
      const fresh = db.users.find((u) => u.id === prev.id) || prev;
      return { ...fresh };
    });
  };

  const runArchival = () => {
    if (!user) return;
    const cutoff = twoYearsAgo();
    updateUser((U) => {
      U.applications.forEach((a) => {
        if (!a.archived) {
          const created = new Date(a.createdAt);
          if (created < cutoff) a.archived = true;
        }
      });
      return U;
    });
    alert("Archival complete: applications older than 2 years flagged as archived.");
  };

  const exportJSON = () => {
    const data = JSON.stringify(db, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "saxion-intake-poc.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header t={t} lang={lang} setLang={setLang} user={user} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {!user ? (
          <LoginCard t={t} onLogin={handleLogin} />
        ) : activeApp ? (
          <ApplicationView
            t={t}
            user={user}
            app={activeApp}
            setApp={setActiveApp}
            updateApp={(updater) =>
              updateUser((U) => {
                const i = U.applications.findIndex((a) => a.id === activeApp.id);
                U.applications[i] = updater({ ...U.applications[i] });
                return U;
              })
            }
          />
        ) : (
          <Dashboard
            t={t}
            user={user}
            onStart={(app) => setActiveApp(app)}
            onRunArchival={runArchival}
            onDownload={exportJSON}
          />
        )}
      </main>
    </div>
  );
}

function Header({ t, lang, setLang, user, onLogout }) {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-header-green/95 backdrop-blur-md border-b border-border/40 shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4 lg:p-6">
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="p-2 bg-gradient-academic rounded-xl text-white shadow-academic">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-xl bg-gradient-academic bg-clip-text text-transparent">
              Saxion
            </span>
            <div className="text-xs text-muted-foreground">Intake Portal</div>
          </div>
        </motion.div>
        
        <div className="flex items-center gap-3">
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
              <Button variant="outline" onClick={onLogout} className="gap-2 border-0 bg-muted/50">
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

function LoginCard({ t, onLogin }) {
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
        <div className="h-2 bg-gradient-academic"></div>
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-academic rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-academic"
            >
              <GraduationCap className="w-8 h-8 text-white" />
            </motion.div>
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
              <div className="text-xs text-muted-foreground mb-2 w-full">Demo accounts:</div>
              <Badge variant="secondary" className="text-xs">alex@saxion-demo.nl (NL)</Badge>
              <Badge variant="secondary" className="text-xs">chidinma@saxion-demo.ng (EN)</Badge>
              <Badge variant="outline" className="text-xs">staff@saxion-demo.edu</Badge>
              <span className="ml-auto text-xs text-muted-foreground">Password: demo</span>
            </div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={() => onLogin(email, password)} 
                className="w-full h-12 academic-button-primary gap-2 text-base font-semibold"
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

function Dashboard({ t, user, onStart, onRunArchival, onDownload }) {
  const appsActive = user.applications.filter((a) => !a.archived);
  const appsArchived = user.applications.filter((a) => a.archived);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {t("welcome")}, {user.name}!
          </h1>
          <p className="text-muted-foreground">{t("multiApplicationsNote")}</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <motion.div whileHover={{ scale: 1.02 }}>
            <Button variant="outline" onClick={onRunArchival} className="gap-2">
              <Archive className="w-4 h-4" />
              {t("runArchival")}
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }}>
            <Button variant="outline" onClick={onDownload} className="gap-2">
              <Download className="w-4 h-4" />
              {t("downloadData")}
            </Button>
          </motion.div>
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
          {appsActive.map((a, index) => (
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
                      <h3 className="font-bold text-lg mb-2 line-clamp-2">{a.program}</h3>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div>{t("cycle")}: {a.cycle}</div>
                        <div>{t("created")}: {a.createdAt}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <Badge 
                      variant={a.status === 'new' ? 'outline' : 'secondary'}
                      className="capitalize"
                    >
                      {t(a.status)}
                    </Badge>
                  </div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
            {appsArchived.map((a, index) => (
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
                          <div>{t("cycle")}: {a.cycle}</div>
                          <div>{t("created")}: {a.createdAt}</div>
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

function ApplicationView({ t, user, app, setApp, updateApp }) {
  const [tab, setTab] = useState("documents");

  const setStep = (path, value) => {
    const next = { ...app };
    const [root, key] = path.split(".");
    next.steps[root][key] = value;
    updateApp(() => next);
    setApp(next);
  };

  const addDocument = (file) => {
    const doc = {
      id: Math.random().toString(36).slice(2),
      label: file.name,
      filename: file.name,
      size: file.size,
      mime: file.type || "application/octet-stream",
      uploadedAt: nowIso().slice(0, 10),
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

  const togglePublish = (publish) => {
    const next = { ...app };
    next.steps.result.published = publish;
    next.steps.result.publishedAt = publish ? nowIso().slice(0, 10) : null;
    if (publish && !next.steps.result.decision) next.steps.result.decision = "conditional";
    next.status = publish ? "resultPublished" : next.status;
    updateApp(() => next);
    setApp(next);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button variant="ghost" onClick={() => setApp(null)} className="gap-2 self-start">
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
            <TabsTrigger value="documents" className="flex-col gap-1 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Upload className="w-4 h-4" />
              <span className="text-xs">{t("uploadDocuments")}</span>
            </TabsTrigger>
            <TabsTrigger value="assignment" className="flex-col gap-1 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <FileText className="w-4 h-4" />
              <span className="text-xs">{t("assignment")}</span>
            </TabsTrigger>
            <TabsTrigger value="appointment" className="flex-col gap-1 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Clock className="w-4 h-4" />
              <span className="text-xs">{t("appointment")}</span>
            </TabsTrigger>
            <TabsTrigger value="interview" className="flex-col gap-1 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Video className="w-4 h-4" />
              <span className="text-xs">{t("interview")}</span>
            </TabsTrigger>
            <TabsTrigger value="result" className="flex-col gap-1 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs">{t("result")}</span>
            </TabsTrigger>
          </TabsList>

          <div className="p-6">
            <TabsContent value="documents" className="mt-0 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">{t("uploadDocuments")}</h3>
                <p className="text-muted-foreground mb-4">{t("docHint")}</p>
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
                <h4 className="font-semibold mb-3">{t("yourDocs")}</h4>
                {app.steps.documents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    {t("noDocs")}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {app.steps.documents.map((d) => (
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
            </TabsContent>

            <TabsContent value="assignment" className="mt-0 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">{t("assignment")}</h3>
                <p className="text-muted-foreground mb-4">{t("assignmentHint")}</p>
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
                      updateApp(() => next); setApp(next);
                    }}
                    className="flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      onClick={() => {
                        const next = { ...app };
                        next.steps.assignment.submittedAt = nowIso().slice(0, 10);
                        updateApp(() => next); setApp(next);
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
                <h3 className="text-lg font-semibold mb-2">{t("appointment")}</h3>
                <p className="text-muted-foreground mb-4">Schedule your intake appointment</p>
              </div>
              
              <div className="grid gap-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">{t("selectDate")}</label>
                    <Input 
                      type="date" 
                      value={app.steps.appointment.date} 
                      onChange={(e) => setStep("appointment.date", e.target.value)}
                      className="h-11"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">{t("selectTime")}</label>
                    <Input 
                      type="time" 
                      value={app.steps.appointment.time} 
                      onChange={(e) => setStep("appointment.time", e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">{t("meetingType")}</label>
                    <Select value={app.steps.appointment.type} onValueChange={(v) => setStep("appointment.type", v)}>
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
                      value={app.steps.appointment.notes} 
                      onChange={(e) => setStep("appointment.notes", e.target.value)} 
                      placeholder="Additional notes..."
                      className="h-11"
                    />
                  </div>
                </div>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
                <p className="text-muted-foreground mb-4">Schedule your final interview</p>
              </div>
              
              <div className="grid gap-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">{t("selectDate")}</label>
                    <Input 
                      type="date" 
                      value={app.steps.interview.date} 
                      onChange={(e) => setStep("interview.date", e.target.value)}
                      className="h-11"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">{t("selectTime")}</label>
                    <Input 
                      type="time" 
                      value={app.steps.interview.time} 
                      onChange={(e) => setStep("interview.time", e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">{t("interviewMode")}</label>
                    <Select value={app.steps.interview.mode} onValueChange={(v) => setStep("interview.mode", v)}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">{t("online")}</SelectItem>
                        <SelectItem value="onCampus">{t("onCampus")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">{t("videoLink")}</label>
                    <Input 
                      value={app.steps.interview.link} 
                      onChange={(e) => setStep("interview.link", e.target.value)} 
                      placeholder="https://teams.microsoft.com/..."
                      className="h-11"
                    />
                  </div>
                </div>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
                <p className="text-muted-foreground mb-4">View your application result</p>
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
                        <h4 className="font-semibold text-lg">{t("resultPublished")}</h4>
                        <p className="text-muted-foreground">{t("publishedAt")}: {app.steps.result.publishedAt}</p>
                      </div>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">{t("decision")}</label>
                        <Select value={app.steps.result.decision} onValueChange={(v) => setStep("result.decision", v)}>
                          <SelectTrigger className="h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admit">{t("admit")}</SelectItem>
                            <SelectItem value="conditional">{t("conditional")}</SelectItem>
                            <SelectItem value="reject">{t("reject")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">{t("publishedAt")}</label>
                        <Input 
                          value={app.steps.result.publishedAt || ""} 
                          onChange={(e) => setStep("result.publishedAt", e.target.value)}
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
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button onClick={() => togglePublish(true)} className="gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        {t("publishResult")}
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button variant="outline" onClick={() => togglePublish(false)} className="gap-2">
                        <Clock className="w-4 h-4" />
                        {t("unpublishResult")}
                      </Button>
                    </motion.div>
                  </>
                )}
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" onClick={markAllDone} className="gap-2">
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