import React from "react";
import { BookOpen, Award, Layers, Sparkles } from "lucide-react";

export interface LessonData {
  grade: string;
  unit: string;
  lesson: string;
  scenario: string;
  vocabulary: string[];
}

export const LESSONS_DATABASE: LessonData[] = [
  {
    grade: "6th Grade",
    unit: "Unit 1: Welcome to School",
    lesson: "Lesson 1: Greeting Friends & Numbers",
    scenario: "Greet YoChat and introduce yourself. Tell YoChat your name and age (numbers 1-15).",
    vocabulary: ["Hello", "Goodbye", "Fine", "Thanks", "Friend", "Name", "Years old"]
  },
  {
    grade: "6th Grade",
    unit: "Unit 1: Welcome to School",
    lesson: "Lesson 2: My Schoolbag",
    scenario: "Describe what is inside your schoolbag to YoChat. Practice school items.",
    vocabulary: ["Book", "Pen", "Pencil", "Ruler", "Bag", "Notebook", "What is this?"]
  },
  {
    grade: "6th Grade",
    unit: "Unit 2: My Family & Pets",
    lesson: "Lesson 1: Family Members",
    scenario: "Introduce your family members to YoChat. Tell YoChat if you have brothers or sisters.",
    vocabulary: ["Mother", "Father", "Brother", "Sister", "Baby", "Love", "Family"]
  },
  {
    grade: "6th Grade",
    unit: "Unit 2: My Family & Pets",
    lesson: "Lesson 2: My Cute Pet",
    scenario: "Tell YoChat about your favorite animal or pet (cat, dog, bird, rabbit) and describe its color.",
    vocabulary: ["Cat", "Dog", "Bird", "Rabbit", "Small", "White", "Black", "Cute"]
  },
  {
    grade: "7th Grade",
    unit: "Unit 1: Free Time & Hobbies",
    lesson: "Lesson 1: Sports I Play",
    scenario: "Tell YoChat about your favorite sports. Talk about what sports you do at school.",
    vocabulary: ["Football", "Tennis", "Basketball", "Run", "Play", "Every Sunday", "Love"]
  },
  {
    grade: "7th Grade",
    unit: "Unit 1: Free Time & Hobbies",
    lesson: "Lesson 2: Weekends",
    scenario: "Talk to YoChat about what you do on Saturday and Sunday. Share your hobbies.",
    vocabulary: ["Play games", "Watch TV", "Help mother", "Read", "Fun", "Happy", "Friends"]
  },
  {
    grade: "7th Grade",
    unit: "Unit 2: Healthy Living",
    lesson: "Lesson 1: Fruit and Vegetables",
    scenario: "Discuss healthy food with YoChat. Describe your favorite fruits and why they are good for you.",
    vocabulary: ["Apple", "Banana", "Orange", "Date", "Healthy", "Fruit", "Delicious", "Eat"]
  },
  {
    grade: "7th Grade",
    unit: "Unit 2: Healthy Living",
    lesson: "Lesson 2: Daily Routines",
    scenario: "Walk YoChat through your morning routine. What time do you wake up and brush your teeth?",
    vocabulary: ["Wake up", "Wash face", "Brush teeth", "Breakfast", "O'clock", "School"]
  }
];

interface LessonPanelProps {
  selectedLesson: LessonData;
  onLessonSelect: (lesson: LessonData) => void;
  disabled?: boolean;
}

export default function LessonPanel({ selectedLesson, onLessonSelect, disabled }: LessonPanelProps) {
  const [activeGrade, setActiveGrade] = React.useState<string>("6th Grade");

  const filteredLessons = LESSONS_DATABASE.filter(l => l.grade === activeGrade);

  return (
    <div className="bg-white rounded-[32px] card-shadow border border-[#e5e5df] p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3.5 border-b border-[#e5e5df]">
        <BookOpen className="w-5 h-5 text-[#5A5A40]" />
        <h2 className="serif text-xl font-bold text-[#2d2d2a] tracking-tight">Tunisian Curriculum Plan</h2>
      </div>

      {/* Grade Selector Tabs */}
      <div className="flex bg-[#f9f9f6] p-1 rounded-full border border-[#e5e5df]">
        {["6th Grade", "7th Grade"].map((grade) => {
          const isActive = activeGrade === grade;
          return (
            <button
              key={grade}
              id={`tab-grade-${grade.replace(" ", "-")}`}
              onClick={() => {
                if (!disabled) {
                  setActiveGrade(grade);
                  // Auto-select first lesson of that grade
                  const first = LESSONS_DATABASE.find(l => l.grade === grade);
                  if (first) onLessonSelect(first);
                }
              }}
              disabled={disabled}
              className={`flex-1 py-2 text-center font-sans font-bold text-xs uppercase tracking-wider rounded-full transition-all ${
                isActive
                  ? "bg-[#5A5A40] text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-700 hover:bg-[#f5f5f0]"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {grade}
            </button>
          );
        })}
      </div>

      {/* Lessons List */}
      <div className="flex flex-col gap-2 max-h-[190px] overflow-y-auto pr-1">
        <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1">
          Select a Lesson
        </label>
        {filteredLessons.map((item, index) => {
          const isSelected = selectedLesson.lesson === item.lesson;
          return (
            <button
              key={index}
              id={`lesson-item-${index}`}
              onClick={() => {
                if (!disabled) onLessonSelect(item);
              }}
              disabled={disabled}
              className={`text-left p-3 rounded-xl transition-all font-sans text-xs border flex flex-col gap-1 ${
                isSelected
                  ? "bg-[#f5efe6] border-[#5A5A40]/30 text-[#2d2d2a] shadow-2xs font-semibold"
                  : "bg-white hover:bg-[#f9f9f6] border-[#e5e5df] text-slate-600 hover:text-slate-800"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div className="font-bold flex items-center gap-1.5 text-xs text-[#2d2d2a]">
                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-[#5A5A40]" : "bg-slate-300"}`}></span>
                {item.lesson}
              </div>
              <div className="text-[10px] text-slate-400 ml-3 font-normal truncate uppercase tracking-wider">
                {item.unit}
              </div>
            </button>
          );
        })}
      </div>

      {/* Role-play Scenario Display */}
      <div className="bg-[#f9f9f6] p-4 rounded-2xl border border-[#e5e5df] flex flex-col gap-3">
        <div className="flex items-start gap-2.5">
          <Award className="w-5 h-5 text-[#A67C52] shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-widest text-[#A67C52] font-bold">Role-play Scenario</span>
            <p className="text-[#2d2d2a] text-xs font-sans leading-relaxed italic">
              "{selectedLesson.scenario}"
            </p>
          </div>
        </div>

        {/* Vocabulary Section */}
        <div className="border-t border-[#e5e5df] pt-3.5">
          <label className="text-[10px] uppercase tracking-widest text-[#2d2d2a]/50 font-bold block mb-2">
            Vocabulary
          </label>
          <div className="flex flex-wrap gap-1.5">
            {selectedLesson.vocabulary.map((vocab, i) => (
              <span
                key={i}
                className="bg-white border border-[#e5e5df] px-2.5 py-1 rounded text-[10px] font-bold text-[#5A5A40] transition-colors hover:border-[#5A5A40]/40"
              >
                {vocab}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
