
"use client";

import { Button } from "./ui/button";
import { Github, Instagram, Linkedin, Phone } from "lucide-react";
import { translations } from "@/lib/translations";
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "./icons";
import { ScrollArea } from "./ui/scroll-area";

const examSubjects = {
  "UPSC Civil Services": ["History", "Geography", "Polity & Governance", "Economy", "Environment & Ecology", "Science & Technology", "Current Affairs"],
  "SSC CGL": ["Quantitative Aptitude", "General Intelligence & Reasoning", "English Language", "General Awareness"],
  "IBPS PO": ["Reasoning Ability", "Quantitative Aptitude", "English Language", "General Awareness", "Computer Aptitude"],
  "SBI PO": ["Reasoning Ability", "Quantitative Aptitude", "English Language", "General/Economy/Banking Awareness", "Computer Aptitude"],
  "RRB NTPC": ["Mathematics", "General Intelligence and Reasoning", "General Awareness"],
  "NEET": ["Physics", "Chemistry", "Biology"],
  "JEE Main": ["Physics", "Chemistry", "Mathematics"],
  "JEE Advanced": ["Physics", "Chemistry", "Mathematics"],
  "CAT": ["Verbal Ability & Reading Comprehension", "Data Interpretation & Logical Reasoning", "Quantitative Ability"],
  "GATE": ["Aerospace Engineering", "Chemical Engineering", "Civil Engineering", "Computer Science & Information Technology", "Electrical Engineering", "Electronics & Communication Engineering", "Mechanical Engineering"],
  "CLAT": ["English Language", "Current Affairs, including General Knowledge", "Legal Reasoning", "Logical Reasoning", "Quantitative Techniques"],
  "NDA": ["Mathematics", "General Ability Test"],
  "CDS": ["English", "General Knowledge", "Elementary Mathematics"],
};

const indianExams = Object.keys(examSubjects);

type SidebarProps = {
  onExamSelect: (exam: string) => void;
  language: "english" | "hindi";
};

export default function Sidebar({ onExamSelect, language }: SidebarProps) {
  const t = translations[language];
  const { setOpenMobile } = useSidebar();

  const handleExamClick = (exam: string) => {
    onExamSelect(exam);
    setOpenMobile(false); // Close sidebar on mobile after selection
  };

  return (
    <SidebarPrimitive collapsible="offcanvas" className="hidden bg-destructive text-destructive-foreground md:block">
        <SidebarHeader>
            <div className="flex items-center gap-2">
                <Logo className="h-8 w-8" />
                <h1 className="text-xl font-bold">{t.sidebarTitle}</h1>
            </div>
        </SidebarHeader>
        <ScrollArea className="flex-1">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {indianExams.map((exam) => (
                            <SidebarMenuItem key={exam}>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start hover:bg-destructive/80 hover:text-destructive-foreground"
                                    onClick={() => handleExamClick(exam)}
                                >
                                    {exam}
                                </Button>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </ScrollArea>
        <SidebarFooter>
            <div className="border-t border-destructive-foreground/20 pt-4">
                <h2 className="text-lg font-semibold mb-4">{t.connectWithMe}</h2>
                <div className="space-y-3">
                    <a href="https://github.com/sumitkumar8176" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <Github className="h-5 w-5" />
                        <span>GitHub</span>
                    </a>
                    <a href="http://linkedin.com/in/sumit-kumar-3737392b0" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <Linkedin className="h-5 w-5" />
                        <span>LinkedIn</span>
                    </a>
                    <a href="https://www.instagram.com/fearless_fighter_0420" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <Instagram className="h-5 w-5" />
                        <span>Instagram</span>
                    </a>
                    <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5" />
                        <span>8126718957</span>
                    </div>
                </div>
            </div>
        </SidebarFooter>
    </SidebarPrimitive>
  );
}

    