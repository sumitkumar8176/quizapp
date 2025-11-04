"use client";

import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarItem,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { ChevronDown } from "lucide-react";

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

export default function Header() {
  return (
    <header className="w-full bg-card border-b">
      <div className="container mx-auto flex items-center justify-end gap-4 p-2 text-sm">
        <h1 className="text-destructive text-sm font-normal">
          Practice questions for all exams like here
        </h1>
        <Menubar className="border-none bg-transparent shadow-none">
          <MenubarMenu>
            <MenubarTrigger className="p-0 text-muted-foreground hover:text-foreground data-[state=open]:text-foreground">
              <div className="flex items-center gap-1 cursor-pointer">
                <span>All Exams</span>
                <ChevronDown className="h-4 w-4" />
              </div>
            </MenubarTrigger>
            <MenubarContent align="end" className="max-h-96 overflow-y-auto">
              {indianExams.map((exam) => (
                <MenubarItem key={exam}>{exam}</MenubarItem>
              ))}
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </header>
  );
}
