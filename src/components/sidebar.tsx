
"use client";

import { Button } from "./ui/button";
import { Github, Instagram, Linkedin, Phone, ChevronDown } from "lucide-react";
import { translations } from "@/lib/translations";
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "./icons";
import { ScrollArea } from "./ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { cn } from "@/lib/utils";

const nationalExams = {
  "National Level": {
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
  }
};

const stateWiseExams = {
    "Andhra Pradesh": ["APPSC", "EAMCET", "AP-PGECET"],
    "Uttar Pradesh": ["UPPSC", "UPTET", "UPSEE"],
    "Maharashtra": ["MPSC", "MHT-CET", "MAH-CET"],
    "Bihar": ["BPSC", "BTET", "BCECE"],
    "West Bengal": ["WBPSC", "WBJEE", "WB-SET"],
    "Tamil Nadu": ["TNPSC", "TANCET", "TNEA"],
    "Madhya Pradesh": ["MPPSC", "MP-PAT", "MP-TET"],
    "Rajasthan": ["RPSC", "REET", "RPET"],
    "Karnataka": ["KPSC", "KCET", "K-SET"],
    "Gujarat": ["GPSC", "GUJCET", "G-SET"],
    "Kerala": ["Kerala PSC", "KEAM", "K-TET"]
};


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

  const renderExamButtons = (exams: string[] | Record<string, any>) => {
    return Object.keys(exams).map((exam) => (
         <Button
            key={exam}
            variant="ghost"
            className="w-full justify-start hover:bg-destructive/80 hover:text-destructive-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:w-auto"
            onClick={() => handleExamClick(exam)}
        >
            <span className="group-data-[collapsible=icon]:hidden">{exam}</span>
            <span className="hidden group-data-[collapsible=icon]:inline">{exam.substring(0,2)}</span>
        </Button>
    ))
  }

  return (
    <SidebarPrimitive collapsible="icon" className="hidden bg-destructive text-destructive-foreground md:flex">
        <SidebarHeader>
            <div className="flex items-center gap-2">
                <Logo className="h-8 w-8" />
                <h1 className="text-xl font-bold group-data-[collapsible=icon]:hidden">{t.sidebarTitle}</h1>
            </div>
        </SidebarHeader>
        <ScrollArea className="flex-1">
            <SidebarContent>
                <div className="flex flex-col gap-2 px-2">
                    {Object.entries(nationalExams).map(([groupName, exams]) => (
                        <Collapsible key={groupName} defaultOpen>
                            <CollapsibleTrigger className="group-data-[collapsible=icon]:hidden flex justify-between items-center w-full p-2 font-semibold text-lg">
                                <span>{groupName}</span>
                                <ChevronDown className="h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-2">
                                <div className="flex flex-col gap-1 pl-4 border-l border-destructive-foreground/20 ml-2 group-data-[collapsible=icon]:border-none group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:m-0">
                                  {renderExamButtons(exams)}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    ))}
                    <Collapsible>
                      <CollapsibleTrigger className="group-data-[collapsible=icon]:hidden flex justify-between items-center w-full p-2 font-semibold text-lg">
                          <span>State-wise Exams</span>
                          <ChevronDown className="h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-2">
                          <div className="pl-4 border-l border-destructive-foreground/20 ml-2 group-data-[collapsible=icon]:border-none group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:m-0">
                            {Object.entries(stateWiseExams).map(([state, exams]) => (
                                <Collapsible key={state}>
                                    <CollapsibleTrigger className="group-data-[collapsible=icon]:hidden flex justify-between items-center w-full py-2 font-medium">
                                      <span>{state}</span>
                                      <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="group-data-[collapsible=icon]:hidden">
                                        <div className="flex flex-col gap-1 pl-4 border-l border-destructive-foreground/20 ml-2">
                                          {renderExamButtons(exams)}
                                        </div>
                                    </CollapsibleContent>
                                     <div className="hidden group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
                                       {renderExamButtons(exams)}
                                    </div>
                                </Collapsible>
                            ))}
                          </div>
                      </CollapsibleContent>
                    </Collapsible>
                </div>
            </SidebarContent>
        </ScrollArea>
        <div className="border-t border-destructive-foreground/20 pt-4 group-data-[collapsible=icon]:hidden px-2">
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
    </SidebarPrimitive>
  );
}
