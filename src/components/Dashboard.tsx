import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Archive, FileText, ArrowRight, Calendar, Clock, Video } from "lucide-react";
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

  // Check if profile is complete using the same logic as ProfileCompletionCheck
  const isProfileComplete = user.locationOfHome && user.dateOfBirth;

  // Get all upcoming appointments from active applications
  const getUpcomingAppointments = () => {
    const appointments: Array<{
      id: string;
      date: string;
      time: string;
      type: string;
      notes: string;
      applicationId: string;
      program: string;
      cycle: string;
    }> = [];

    appsActive.forEach((app: any) => {
      if (app.steps?.appointment?.date && app.steps?.appointment?.time) {
        const appointmentDate = new Date(`${app.steps.appointment.date}T${app.steps.appointment.time}`);
        const now = new Date();

        if (appointmentDate > now) {
          appointments.push({
            id: `${app.id}-appointment`,
            date: app.steps.appointment.date,
            time: app.steps.appointment.time,
            type: app.steps.appointment.type || "intake",
            notes: app.steps.appointment.notes || "",
            applicationId: app.id,
            program: app.program,
            cycle: app.cycle,
          });
        }
      }
    });

    return appointments.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });
  };

  const upcomingAppointments = getUpcomingAppointments();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const formatTime = (timeStr: string) => {
    return timeStr;
  };

  const getMeetingLink = (appointment: any) => {
    // Try to get the Teams link from the application data first
    const application = user.applications.find((a: any) => a.id === appointment.applicationId);
    if (application?.steps?.appointment?.teamsLink) {
      return application.steps.appointment.teamsLink;
    }
    
    // Fallback to generating a link if none exists
    const meetingId = `saxion-${appointment.program.toLowerCase().replace(/\s+/g, '-')}-${appointment.cycle}-${appointment.date}-${appointment.time.replace(':', '')}`;
    const context = {
      program: appointment.program,
      cycle: appointment.cycle,
      applicationId: appointment.applicationId,
      type: appointment.type,
    };
    
    return `https://teams.microsoft.com/l/meetup-join/${meetingId}?context=${encodeURIComponent(JSON.stringify(context))}`;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Popup is always free */}
      {isProfileComplete ? null : (
        <ProfileCompletionCheck t={t} user={user} onCompleteProfile={onCompleteProfile} />
      )}

      {/* Dashboard content that gets greyed out */}
      <div className="relative">
        <div className={isProfileComplete ? "opacity-100" : "opacity-50 pointer-events-none"}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {t("welcome")}, {user.name}!
            </h1>
            <p className="text-muted-foreground">{t("multiApplicationsNote")}</p>
          </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 relative">
            {/* Applications */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#319C82]" />
                </div>
                {t("applications")}
              </h2>

              <div className="grid sm:grid-cols-2 gap-6">
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
                            <Badge variant={a.isInternational ? "default" : "secondary"} className="mb-3">
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
                            variant={a.status === "new" ? "outline" : "secondary"}
                            className="capitalize"
                          >
                            {t(a.status)}
                          </Badge>
                        </div>

                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button onClick={() => onStart(a)} className="w-full bg-[#319C82] gap-2">
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

            {/* Upcoming Appointments - Enhanced Container */}
            <div className="lg:col-span-1">
              {/* Distinctive Container for Appointments */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-blue-900">{t("upcomingAppointments") || "Upcoming Appointments"}</span>
                </h2>

                {upcomingAppointments.length === 0 ? (
                  <Card className="border-blue-200 bg-white/50">
                    <CardContent className="p-6 text-center">
                      <Calendar className="w-12 h-12 text-blue-300 mx-auto mb-3" />
                      <p className="text-blue-600">
                        {t("noUpcomingAppointments") || "No upcoming appointments"}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment, index) => (
                      <motion.div
                        key={appointment.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="border-blue-200 bg-white/70 hover:bg-white hover:shadow-md transition-all duration-200">
                          <CardContent className="p-4">
                            <div className="mb-3">
                              <Badge variant="outline" className="text-xs mb-2 border-blue-300 text-blue-700">
                                {appointment.program}
                              </Badge>
                              <p className="text-xs text-blue-600/70">{appointment.cycle}</p>
                            </div>

                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-blue-900">{formatDate(appointment.date)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-gray-700">{formatTime(appointment.time)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-purple-600" />
                                <span className="text-sm capitalize text-gray-700">
                                  {t(appointment.type) || appointment.type}
                                </span>
                              </div>
                            </div>

                            {appointment.notes && (
                              <p className="text-sm text-blue-600/80 mb-3 italic bg-blue-50/50 p-2 rounded">
                                "{appointment.notes}"
                              </p>
                            )}

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                                onClick={() =>
                                  onStart(user.applications.find((a: any) => a.id === appointment.applicationId))
                                }
                              >
                                <ArrowRight className="w-3 h-3 mr-1" />
                                {t("viewApplication") || "View"}
                              </Button>
                              <Button
                                size="sm"
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                                onClick={() => window.open(getMeetingLink(appointment), "_blank")}
                              >
                                <Video className="w-3 h-3 mr-1" />
                                {t("joinMeeting") || "Join"}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Blur overlay only for applications and appointments section */}
            {!isProfileComplete && (
              <div className="absolute inset-0 bg-gray-200/60 backdrop-blur-[1px] z-10"></div>
            )}
          </div>

          {/* Archives */}
          {appsArchived.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
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
        </div>
      </div>
    </motion.div>
  );
}