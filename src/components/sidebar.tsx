"use client";

import { Button } from "./ui/button";

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
};

export default function Sidebar({ onExamSelect }: SidebarProps) {
  return (
    <aside className="w-64 bg-destructive p-6 flex flex-col space-y-6 border-r text-destructive-foreground">
        <h1 className="text-xl font-bold">Practice quiz for any exams given below</h1>
        <nav className="flex flex-col space-y-2">
            {indianExams.map((exam) => (
                <Button key={exam} variant="ghost" className="justify-start hover:bg-destructive/90 hover:text-destructive-foreground" onClick={() => onExamSelect(exam)}>{exam}</Button>
            ))}
        </nav>
    </aside>
  );
}
