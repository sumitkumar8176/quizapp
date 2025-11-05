
"use client";

import { Button } from "./ui/button";
import { Github, Instagram, Linkedin, Phone } from "lucide-react";
import { translations } from "@/lib/translations";

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
  return (
    <aside className="w-64 bg-destructive p-6 flex flex-col justify-between border-r text-destructive-foreground">
        <div>
          <h1 className="text-xl font-bold">{t.sidebarTitle}</h1>
          <nav className="flex flex-col space-y-2 mt-6">
              {indianExams.map((exam) => (
                  <Button key={exam} variant="ghost" className="justify-start hover:bg-destructive/90 hover:text-destructive-foreground" onClick={() => onExamSelect(exam)}>{exam}</Button>
              ))}
          </nav>
        </div>
        <div className="mt-8">
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
    </aside>
  );
}
