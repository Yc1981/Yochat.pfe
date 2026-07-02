import React from "react";
import { BookOpen, Award } from "lucide-react";

export interface LessonData {
  grade: string;
  unit: string;
  lesson: string;
  scenario: string;
  vocabulary: string[];
}

export const LESSONS_DATABASE: LessonData[] = [
  // ================= 6th GRADE =================
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
    unit: "Unit 1: Welcome to School",
    lesson: "Lesson 3: My Classroom",
    scenario: "Tell YoChat about your classroom. Practice showing where things are using in, on, and under.",
    vocabulary: ["Desk", "Chair", "Board", "Table", "In", "On", "Under", "Teacher"]
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
    grade: "6th Grade",
    unit: "Unit 2: My Family & Pets",
    lesson: "Lesson 3: My Grandparents",
    scenario: "Talk to YoChat about your grandparents. Describe their hobbies and say how much you love them.",
    vocabulary: ["Grandmother", "Grandfather", "Old", "Happy", "Tell stories", "Garden"]
  },
  {
    grade: "6th Grade",
    unit: "Unit 3: My Home",
    lesson: "Lesson 1: Parts of the House",
    scenario: "Describe the different rooms in your house to YoChat and mention which is your favorite.",
    vocabulary: ["House", "Bedroom", "Living room", "Kitchen", "Bathroom", "Big", "Beautiful"]
  },
  {
    grade: "6th Grade",
    unit: "Unit 3: My Home",
    lesson: "Lesson 2: In My Room",
    scenario: "Describe the furniture in your bedroom. Tell YoChat what you like to do in your room.",
    vocabulary: ["Bed", "Wardrobe", "Computer", "Toy", "Shelf", "Sleep", "Play"]
  },
  {
    grade: "6th Grade",
    unit: "Unit 4: My Daily Life",
    lesson: "Lesson 1: Morning Routines",
    scenario: "Describe your morning routine before coming to school to YoChat.",
    vocabulary: ["Get up", "Wash", "Eat breakfast", "Go to school", "Morning", "Early"]
  },
  {
    grade: "6th Grade",
    unit: "Unit 4: My Daily Life",
    lesson: "Lesson 2: What Time Is It?",
    scenario: "Practice telling the time with YoChat. Share what time you do your daily activities.",
    vocabulary: ["Time", "Clock", "Hour", "Half past", "O'clock", "Late"]
  },
  {
    grade: "6th Grade",
    unit: "Unit 5: Clothes & Weather",
    lesson: "Lesson 1: My Clothes",
    scenario: "Tell YoChat what clothes you are wearing today and describe their colors.",
    vocabulary: ["T-shirt", "Trousers", "Shoes", "Coat", "Dress", "Wear", "New"]
  },
  {
    grade: "6th Grade",
    unit: "Unit 5: Clothes & Weather",
    lesson: "Lesson 2: Four Seasons & Weather",
    scenario: "Discuss the weather in Tunisia across the four seasons with YoChat.",
    vocabulary: ["Spring", "Summer", "Autumn", "Winter", "Hot", "Cold", "Sunny", "Rainy"]
  },
  {
    grade: "6th Grade",
    unit: "Unit 6: Food & Health",
    lesson: "Lesson 1: Delicious Meals",
    scenario: "Talk to YoChat about what you usually eat for breakfast, lunch, and dinner.",
    vocabulary: ["Breakfast", "Lunch", "Dinner", "Milk", "Bread", "Cheese", "Water"]
  },
  {
    grade: "6th Grade",
    unit: "Unit 6: Food & Health",
    lesson: "Lesson 2: I Like Fruits!",
    scenario: "Tell YoChat about your favorite sweet fruits and explain why they are healthy.",
    vocabulary: ["Apple", "Banana", "Orange", "Dates", "Sweet", "Like", "Yummy"]
  },
  {
    grade: "6th Grade",
    unit: "Unit 7: Sports & Hobbies",
    lesson: "Lesson 1: Let's Play Sports!",
    scenario: "Discuss your favorite sports and physical activities with YoChat.",
    vocabulary: ["Football", "Tennis", "Swim", "Run", "Jump", "Game", "Win"]
  },
  {
    grade: "6th Grade",
    unit: "Unit 7: Sports & Hobbies",
    lesson: "Lesson 2: My Favorite Hobby",
    scenario: "Tell YoChat what hobbies you enjoy doing on weekends, like drawing or reading.",
    vocabulary: ["Drawing", "Music", "Reading", "Sing", "Song", "Weekend", "Fun"]
  },

  // ================= 7th GRADE =================
  {
    grade: "7th Grade",
    unit: "Unit 1: Family Life",
    lesson: "Lesson 1: Meet My Family",
    scenario: "Tell YoChat about your parents' professions, where they work, and what they do.",
    vocabulary: ["Teacher", "Doctor", "Farmer", "Housewife", "Work", "Hospital", "School"]
  },
  {
    grade: "7th Grade",
    unit: "Unit 1: Family Life",
    lesson: "Lesson 2: Our Cozy House",
    scenario: "Describe the garden and surroundings of your house. Talk about trees and flowers.",
    vocabulary: ["Garden", "Garage", "Flowers", "Tree", "Next to", "Behind", "In front of"]
  },
  {
    grade: "7th Grade",
    unit: "Unit 1: Family Life",
    lesson: "Lesson 3: Helping My Parents",
    scenario: "Talk about how you help your parents at home by doing simple household chores.",
    vocabulary: ["Clean", "Wash the dishes", "Water flowers", "Make the bed", "Help", "Good child"]
  },
  {
    grade: "7th Grade",
    unit: "Unit 2: School Life",
    lesson: "Lesson 1: My School Subjects",
    scenario: "Discuss your school timetable and favorite school subjects with YoChat.",
    vocabulary: ["English", "Arabic", "Maths", "Science", "History", "Timetable", "Subject"]
  },
  {
    grade: "7th Grade",
    unit: "Unit 2: School Life",
    lesson: "Lesson 2: School Rules & Uniform",
    scenario: "Talk to YoChat about your school rules and what you must wear to school.",
    vocabulary: ["Uniform", "Rules", "Listen", "Be quiet", "Respect", "Classmates", "Do homework"]
  },
  {
    grade: "7th Grade",
    unit: "Unit 2: School Life",
    lesson: "Lesson 3: My Favourite Teacher",
    scenario: "Describe your favorite teacher's personality and how they help you learn.",
    vocabulary: ["Kind", "Patient", "Smart", "Funny", "Helpful", "Teach", "Explain"]
  },
  {
    grade: "7th Grade",
    unit: "Unit 3: Free Time & Hobbies",
    lesson: "Lesson 1: Hobbies and Collections",
    scenario: "Tell YoChat about things you collect (stamps, coins, cards) or your favorite leisure activities.",
    vocabulary: ["Stamps", "Coins", "Collect", "Video games", "Chess", "Interesting", "Spare time"]
  },
  {
    grade: "7th Grade",
    unit: "Unit 3: Free Time & Hobbies",
    lesson: "Lesson 2: Weekends at the Club",
    scenario: "Describe your activities at a local sports or youth club with YoChat.",
    vocabulary: ["Youth Club", "Team", "Practice", "Coach", "Friendship", "Exercise", "Match"]
  },
  {
    grade: "7th Grade",
    unit: "Unit 4: Food & Health",
    lesson: "Lesson 1: Eating Healthy",
    scenario: "Discuss healthy eating choices and tell YoChat which foods to eat and which to avoid.",
    vocabulary: ["Salad", "Fish", "Vegetables", "Sweets", "Fast food", "Healthy body", "Avoid"]
  },
  {
    grade: "7th Grade",
    unit: "Unit 4: Food & Health",
    lesson: "Lesson 2: At the Restaurant",
    scenario: "Role-play ordering typical Tunisian dishes in English with YoChat at a restaurant.",
    vocabulary: ["Menu", "Couscous", "Soup", "Drink", "Waiter", "Bill", "Order"]
  },
  {
    grade: "7th Grade",
    unit: "Unit 4: Food & Health",
    lesson: "Lesson 3: Keeping Fit",
    scenario: "Talk to YoChat about how to keep fit and healthy through exercise, water, and sleep.",
    vocabulary: ["Fit", "Strong", "Gym", "Water", "Sleep", "Healthy mind", "Daily walk"]
  },
  {
    grade: "7th Grade",
    unit: "Unit 5: Shopping & Clothes",
    lesson: "Lesson 1: At the Clothes Shop",
    scenario: "Role-play buying a new outfit. Ask YoChat about sizes, colors, and prices.",
    vocabulary: ["How much?", "Size", "Try on", "Cheap", "Expensive", "Jacket", "Jeans"]
  },
  {
    grade: "7th Grade",
    unit: "Unit 5: Shopping & Clothes",
    lesson: "Lesson 2: Market Day",
    scenario: "Describe visiting the local souk (market) to buy fresh produce.",
    vocabulary: ["Souk", "Market", "Kilo", "Fresh", "Tomatoes", "Potatoes", "Seller", "Buy"]
  },
  {
    grade: "7th Grade",
    unit: "Unit 6: Holidays & Travel",
    lesson: "Lesson 1: Plans for Summer",
    scenario: "Share your exciting summer holiday plans and travel destinations with YoChat.",
    vocabulary: ["Holiday", "Travel", "Beach", "Hotel", "Luggage", "Ticket", "Summer camp"]
  },
  {
    grade: "7th Grade",
    unit: "Unit 6: Holidays & Travel",
    lesson: "Lesson 2: Visiting Kairouan / Djerba",
    scenario: "Describe a visit to a historic Tunisian city like Kairouan or beautiful Djerba island.",
    vocabulary: ["Visit", "Mosque", "Beautiful island", "Souvenirs", "Tourist", "History", "Tradition"]
  }
];

interface LessonPanelProps {
  selectedLesson: LessonData;
  onLessonSelect: (lesson: LessonData) => void;
  disabled?: boolean;
}

export default function LessonPanel({ selectedLesson, onLessonSelect, disabled }: LessonPanelProps) {
  const [activeGrade, setActiveGrade] = React.useState<string>("6th Grade");

  const filteredLessons = React.useMemo(() => {
    return LESSONS_DATABASE.filter(l => l.grade === activeGrade);
  }, [activeGrade]);

  // Group lessons by Unit
  const unitsMap = React.useMemo(() => {
    const map: { [key: string]: LessonData[] } = {};
    filteredLessons.forEach(l => {
      if (!map[l.unit]) {
        map[l.unit] = [];
      }
      map[l.unit].push(l);
    });
    return map;
  }, [filteredLessons]);

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

      {/* Lessons List Grouped by Unit */}
      <div className="flex flex-col gap-4 max-h-[220px] overflow-y-auto pr-1">
        <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">
          Select a Lesson
        </label>
        {(Object.entries(unitsMap) as [string, LessonData[]][]).map(([unitName, lessons]) => (
          <div key={unitName} className="flex flex-col gap-2">
            <div className="text-[10px] font-bold text-[#A67C52] bg-[#FAF6F0]/80 px-2 py-1 rounded-lg border border-[#FAF6F0] uppercase tracking-wider sticky top-0 z-10 backdrop-blur-xs">
              {unitName}
            </div>
            <div className="flex flex-col gap-1.5 pl-1">
              {lessons.map((item, index) => {
                const isSelected = selectedLesson.lesson === item.lesson && selectedLesson.grade === item.grade;
                return (
                  <button
                    key={index}
                    id={`lesson-item-${item.grade.replace(/\s+/g, "-")}-${item.lesson.replace(/\s+/g, "-")}`}
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
                  </button>
                );
              })}
            </div>
          </div>
        ))}
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
