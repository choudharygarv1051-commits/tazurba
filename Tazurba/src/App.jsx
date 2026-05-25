import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from './supabaseClient';

// Custom designed Inline SVGs
const Icons = {
  Search: () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  ShieldCheck: ({ className = "w-5 h-5 text-[#C84B31]" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Star: () => (
    <svg className="w-4 h-4 text-amber-500 fill-current animate-pulse" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
  MicOn: () => (
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  ),
  MicOff: () => (
    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3M3 3l18 18" />
    </svg>
  ),
  VideoOn: () => (
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  VideoOff: () => (
    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
  ),
  Help: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  ),
  Upload: () => (
    <svg className="w-10 h-10 text-gray-400 mx-auto mb-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  ),
  AlertCircle: () => (
    <svg className="w-5 h-5 text-red-600 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  Briefcase: () => (
    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Workspace: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
    </svg>
  )
};

// UNIFIED DYNAMIC SLAB COMMISSION ENGINE
const calculateCommissionSlab = (price) => {
  const p = parseFloat(price) || 0;
  if (p <= 1000) {
    return {
      percent: 20,
      rate: 20,
      cut: Math.round(p * 0.20),
      fee: Math.round(p * 0.20),
      payout: Math.round(p * 0.80),
      net: Math.round(p * 0.80),
      slab: "Slab A (Hourly Spot Call)",
      label: "Slab A (Hourly Spot Call)"
    };
  } else if (p <= 10000) {
    return {
      percent: 18,
      rate: 18,
      cut: Math.round(p * 0.18),
      fee: Math.round(p * 0.18),
      payout: Math.round(p * 0.82),
      net: Math.round(p * 0.82),
      slab: "Slab B (2-Month Short Program)",
      label: "Slab B (2-Month Short Program)"
    };
  } else {
    return {
      percent: 15,
      rate: 15,
      cut: Math.round(p * 0.15),
      fee: Math.round(p * 0.15),
      payout: Math.round(p * 0.85),
      net: Math.round(p * 0.85),
      slab: "Slab C (6-Month Complete Cohort)",
      label: "Slab C (6-Month Complete Cohort)"
    };
  }
};

// INITIAL MENTOR MOCK DATABASE
const INITIAL_MENTORS = [
  {
    id: 1,
    name: "Dr. Rakesh Sharma",
    field: "Banking",
    subField: "Corporate Debt & Financial Compliance",
    exp: "35 Years",
    age: 61,
    bio: "Retired Managing Director of State Bank of India (SBI). Helps youth master complex commercial lending, cash flow strategies, and banking career roadmaps.",
    rating: "4.9",
    sessionsCount: "820+",
    avatarColor: "bg-[#1E293B]",
    pricing: { hourly: 499, "2month": 7999, "6month": 19999 },
    verified: true,
    programDetails: "2 Months: Direct banking framework simulations. 6 Months: Master-level financial leadership board prep."
  },
  {
    id: 2,
    name: "Mr. Ramesh Kamath",
    field: "Finance & Business",
    subField: "Value Investing & Business Scaling Laws",
    exp: "38 Years",
    age: 62,
    bio: "Former CFO of Aditya Birla Group & Advisor to NITI Aayog. Desh ke youth ko real-world business unit economics, fundraising, aur debt management ki basic se lekar advance knowledge dekar scale-up sikhate hain.",
    rating: "5.0",
    sessionsCount: "1,420+",
    avatarColor: "bg-amber-950",
    pricing: { hourly: 499, "2month": 9999, "6month": 24999 },
    verified: true,
    programDetails: "2 Months: Cash flow optimization and corporate growth playbook. 6 Months: Full venture incubation blueprint & debt-syndication consulting."
  },
  {
    id: 3,
    name: "Mr. Ramesh Damani",
    field: "Stock Trading",
    subField: "Intraday Systems & Option Volatility Trading",
    exp: "31 Years",
    age: 56,
    bio: "Ex-Head of Treasury & Commodities Trading at HDFC Securities. Guides passionate beginners on systematic risk mitigation, live trading templates, and emotional control.",
    rating: "5.0",
    sessionsCount: "940+",
    avatarColor: "bg-[#C84B31]",
    pricing: { hourly: 450, "2month": 8499, "6month": 21999 },
    verified: true,
    programDetails: "2 Months: Risk-management audits and hedge plans. 6 Months: Pro-level proprietary model deployment trading setup."
  },
  {
    id: 4,
    name: "CA Anil Singhal",
    field: "C.A & Audit",
    subField: "Indirect Taxation & GST Appellate Litigation",
    exp: "32 Years",
    age: 58,
    bio: "Senior Audit Partner at Singhal & Associates. Trained over 400+ junior Chartered Accountants on corporate mergers, tax filings, and forensic audit pipelines.",
    rating: "4.8",
    sessionsCount: "710+",
    avatarColor: "bg-teal-900",
    pricing: { hourly: 399, "2month": 6999, "6month": 16999 },
    verified: true,
    programDetails: "2 Months: Tax assessment audit mock practices. 6 Months: Strategic corporate CFO compliance advisor path."
  },
  {
    id: 5,
    name: "Adv. Vineet Chawla",
    field: "Corporate Law",
    subField: "Cross-Border Mergers & NCLT Disputes",
    exp: "29 Years",
    age: 55,
    bio: "Former General Counsel at Reliance Industries & Supreme Court Counsel. Demystifies legal contract structures, intellectual property protection, and business compliance disputes.",
    rating: "4.9",
    sessionsCount: "530+",
    avatarColor: "bg-indigo-900",
    pricing: { hourly: 499, "2month": 8999, "6month": 24999 },
    verified: true,
    programDetails: "2 Months: Shareholders agreements draft review workshops. 6 Months: Complete Corporate Legal Director transition modules."
  },
  {
    id: 6,
    name: "Mr. Sunil Alagh",
    field: "Entrepreneurship",
    subField: "Brand Building & Offline FMCG Distributions",
    exp: "36 Years",
    age: 63,
    bio: "Ex-CEO of Britannia Industries & active seed-investor. Teaches how to build high-scale brand positioning, offline distributors network, and product-market fit.",
    rating: "5.0",
    sessionsCount: "1,120+",
    avatarColor: "bg-emerald-900",
    pricing: { hourly: 499, "2month": 9999, "6month": 24999 },
    verified: true,
    programDetails: "2 Months: Mass market distribution blueprint. 6 Months: Seed fundraising pitch-deck structure & Boardroom mentorship."
  },
  {
    id: 7,
    name: "Mrs. Anjali Gupta",
    field: "Leadership & HR",
    subField: "Executive Presence & Boardroom Communication",
    exp: "28 Years",
    age: 54,
    bio: "Former Global Chief Human Resource Officer (CHRO) at Tata Group. Helps young executives polish high EQ communications, leadership, and team management frameworks.",
    rating: "4.9",
    sessionsCount: "640+",
    avatarColor: "bg-[#7c2d12]",
    pricing: { hourly: 399, "2month": 6499, "6month": 16999 },
    verified: true,
    programDetails: "2 Months: Strategic team coordination hacks. 6 Months: Global corporate Fast-Track promotion roadmap."
  }
];

export default function App() {
  const [view, setView] = useState('home');

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDuration, setSelectedDuration] = useState("all");
  const [budgetLimit, setBudgetLimit] = useState(25000);
  const [searchQuery, setSearchQuery] = useState("");

  const [mentorsList, setMentorsList] = useState(INITIAL_MENTORS);
  const [isFetchingMentors, setIsFetchingMentors] = useState(false);
  const [selectedBookingMentor, setSelectedBookingMentor] = useState(null);

  useEffect(() => {
    const fetchMentors = async () => {
      if (!supabase) return; // Fallback to INITIAL_MENTORS
      setIsFetchingMentors(true);
      const { data, error } = await supabase.from('mentors').select('*');
      
      if (error) {
        console.error("Error fetching mentors from Supabase:", error);
      } else if (data && data.length > 0) {
        setMentorsList(data);
      }
      setIsFetchingMentors(false);
    };

    fetchMentors();
  }, []);
  const [bookingType, setBookingType] = useState('hourly');
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [enquiryInput, setEnquiryInput] = useState({ name: "", email: "", text: "" });

  const [onboardStep, setOnboardStep] = useState(1);
  const [onboardAgeError, setOnboardAgeError] = useState("");
  const [onboardForm, setOnboardForm] = useState({
    name: "",
    age: "",
    bio: "",
    field: "Finance & Business",
    subField: "",
    exp: "25 Years",
    legacyDetails: "",
    priceHourly: "499",
    price2Month: "9999",
    price6Month: "24999",
    agreeToConduct: false
  });
  const [onboardSuccess, setOnboardSuccess] = useState(false);

  const [classroomSession, setClassroomSession] = useState(null);
  const [classroomTimer, setClassroomTimer] = useState(3600);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: "System", text: "Secure classroom initiated. Introvert-friendly modes active! Camera & Mic open rakhna compulsory nahi hai, aap chat par bhi pure sawaal pooch sakte hain.", time: "10:12 PM" },
    { id: 2, sender: "Mentor", text: "Welcome beta! Ghabraiye mat, agar camera open nahi karna toh koi baat nahi. Let's analyze your queries first.", time: "10:13 PM" }
  ]);
  const [chatInput, setChatInput] = useState("");

  const [authRole, setAuthRole] = useState('student');
  const [activePolicyTab, setActivePolicyTab] = useState('terms');
  const [authForm, setAuthForm] = useState({ email: '', password: '', fullName: '' });
  const [calcInput, setCalcInput] = useState("5000");
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);

  const platformLedger = useMemo(() => {
    let totalGross = 248000;
    let netPlatformCommission = 45200;
    return { gross: totalGross, profit: netPlatformCommission, escrow: 52500 };
  }, []);

  const filteredMentors = useMemo(() => {
    return mentorsList.filter(m => {
      const matchesCategory = selectedCategory === "All" || m.field === selectedCategory;
      const matchesSearch = searchQuery === "" || 
                            m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            m.bio.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            m.subField.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesDurationAndBudget = false;
      if (selectedDuration === "all") {
        matchesDurationAndBudget = m.pricing.hourly <= budgetLimit || 
                                   m.pricing["2month"] <= budgetLimit || 
                                   m.pricing["6month"] <= budgetLimit;
      } else if (selectedDuration === "hourly") {
        matchesDurationAndBudget = m.pricing.hourly <= budgetLimit;
      } else if (selectedDuration === "2month") {
        matchesDurationAndBudget = m.pricing["2month"] <= budgetLimit;
      } else if (selectedDuration === "6month") {
        matchesDurationAndBudget = m.pricing["6month"] <= budgetLimit;
      }

      return matchesCategory && matchesSearch && matchesDurationAndBudget;
    });
  }, [mentorsList, selectedCategory, selectedDuration, budgetLimit, searchQuery]);

  useEffect(() => {
    let interval = null;
    if (view === 'classroom' && classroomTimer > 0) {
      interval = setInterval(() => {
        setClassroomTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [view, classroomTimer]);

  const formattedTime = useMemo(() => {
    const mins = Math.floor(classroomTimer / 60);
    const secs = classroomTimer % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [classroomTimer]);

  const handleOnboardChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOnboardForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (name === 'age') setOnboardAgeError("");
  };

  const submitOnboardingStep = (e) => {
    e.preventDefault();
    if (onboardStep === 1) {
      const ageNum = parseInt(onboardForm.age);
      if (isNaN(ageNum) || ageNum < 30) {
        setOnboardAgeError("Bhai, Tajurba requires a minimum expert age of 30 years to preserve platform trust and professional mature standards.");
        return;
      }
      setOnboardStep(2);
    } else if (onboardStep === 2) {
      setOnboardStep(3);
    } else if (onboardStep === 3) {
      setOnboardStep(4);
    } else if (onboardStep === 4) {
      if (!onboardForm.agreeToConduct) {
        alert("Please agree to Tajurba's Ethical Code of Conduct first.");
        return;
      }

      const newExpert = {
        id: mentorsList.length + 1,
        name: onboardForm.name || "Senior Specialist",
        field: onboardForm.field,
        subField: onboardForm.subField || "General Strategy & Leadership",
        exp: onboardForm.exp,
        age: parseInt(onboardForm.age),
        bio: onboardForm.legacyDetails || "Highly seasoned expert offering decades of battle-tested industry wisdom.",
        rating: "5.0",
        sessionsCount: "New",
        avatarColor: "bg-[#1E293B]",
        pricing: {
          hourly: parseInt(onboardForm.priceHourly) || 399,
          "2month": parseInt(onboardForm.price2Month) || 7999,
          "6month": parseInt(onboardForm.price6Month) || 19999
        },
        verified: true,
        programDetails: `Custom plan drafted by ${onboardForm.name}. All documentation verified.`
      };

      const pushToSupabase = async () => {
        if (supabase) {
          const { error } = await supabase.from('mentors').insert([newExpert]);
          if (error) console.error("Error inserting mentor to Supabase:", error);
        }
      };
      
      pushToSupabase();

      setMentorsList(prev => [newExpert, ...prev]);
      setOnboardSuccess(true);
    }
  };

  const handleStartOnboardOver = () => {
    setOnboardForm({
      name: "",
      age: "",
      bio: "",
      field: "Finance & Business",
      subField: "",
      exp: "25 Years",
      legacyDetails: "",
      priceHourly: "499",
      price2Month: "9999",
      price6Month: "24999",
      agreeToConduct: false
    });
    setOnboardStep(1);
    setOnboardSuccess(false);
    setView('find-mentors');
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setView('home');
  };

  const handleConfirmBooking = () => {
    setShowCheckoutSuccess(true);
    setTimeout(() => {
      setClassroomSession({
        mentor: selectedBookingMentor,
        type: bookingType,
        price: bookingType === 'hourly' ? selectedBookingMentor.pricing.hourly :
               bookingType === '2month' ? selectedBookingMentor.pricing["2month"] :
               selectedBookingMentor.pricing["6month"]
      });
      setShowCheckoutSuccess(false);
      setSelectedBookingMentor(null);
      setClassroomTimer(3600);
      setView('classroom');
    }, 1800);
  };

  const sendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages(prev => [
      ...prev,
      { id: Date.now(), sender: "Student", text: chatInput, time: "Now" }
    ]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { id: Date.now() + 1, sender: "Mentor", text: "Beta, precise structural planning is indeed the best way to handle this.", time: "Now" }
      ]);
    }, 1500);
  };

  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    if (!enquiryInput.name || !enquiryInput.email) return;
    setEnquirySuccess(true);
    setTimeout(() => {
      setEnquiryInput({ name: "", email: "", text: "" });
      setShowEnquiry(false);
      setEnquirySuccess(false);
    }, 2000);
  };

  const onboardHourlyCalculations = useMemo(() => calculateCommissionSlab(onboardForm.priceHourly), [onboardForm.priceHourly]);
  const onboard2MonthCalculations = useMemo(() => calculateCommissionSlab(onboardForm.price2Month), [onboardForm.price2Month]);
  const onboard6MonthCalculations = useMemo(() => calculateCommissionSlab(onboardForm.price6Month), [onboardForm.price6Month]);

  const calculatorResult = useMemo(() => calculateCommissionSlab(calcInput), [calcInput]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111827] flex flex-col font-sans selection:bg-[#C84B31] selection:text-white">
      
      {/* BRAND HEADER NAVIGATION */}
      <nav className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#111827]/5 px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div onClick={() => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-3 cursor-pointer select-none">
            <div className="w-10 h-10 bg-[#C84B31] rounded-xl flex items-center justify-center text-white font-serif font-bold text-xl shadow-md transform hover:rotate-3 transition-transform">
              त
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#111827] font-serif leading-none">TAJURBA</span>
              <span className="text-[10px] tracking-widest text-[#C84B31] font-semibold mt-1">तजुर्बा</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-gray-500">
            <button onClick={() => setView('home')} className={`hover:text-[#C84B31] transition-colors ${view === 'home' ? 'text-[#C84B31]' : ''}`}>Home</button>
            <button onClick={() => setView('find-mentors')} className={`hover:text-[#C84B31] transition-colors ${view === 'find-mentors' ? 'text-[#C84B31]' : ''}`}>Find Mentors</button>
            <button onClick={() => setView('onboard')} className={`hover:text-[#C84B31] transition-colors ${view === 'onboard' ? 'text-[#C84B31]' : ''}`}>Join as Mentor</button>
            <button onClick={() => setView('dashboard')} className={`hover:text-[#C84B31] transition-colors ${view === 'dashboard' ? 'text-[#C84B31]' : ''}`}>Earning Dashboard</button>
            <button onClick={() => setView('legal')} className={`hover:text-[#C84B31] transition-colors ${view === 'legal' ? 'text-[#C84B31]' : ''}`}>Policies</button>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setView('auth')} className="text-xs font-bold uppercase tracking-wider text-[#111827] hover:text-[#C84B31] transition-colors">Login</button>
            <button onClick={() => setView('find-mentors')} className="px-6 py-2.5 bg-[#C84B31] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#A63D28] transition-all transform active:scale-95">Get Started</button>
          </div>
        </div>
      </nav>

      {/* 1. LANDING PAGE VIEW */}
      {view === 'home' && (
        <div className="flex-grow animate-in fade-in duration-300">
          <div className="max-w-7xl mx-auto px-4 pt-12 pb-20 md:px-8 grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C84B31]/10 text-[#C84B31] rounded-full text-xs font-bold tracking-wide">
                <span>✦</span> India ka pehla Wisdom-Led Mentorship Platform
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tight leading-none text-[#111827]">
                Kitaabon se aage, <br />
                <span className="text-[#C84B31] italic">tajurbe</span> ki baat.
              </h1>
              <p className="text-lg text-gray-600 font-medium max-w-xl leading-relaxed">
                Live, one-on-one video sessions desh ke sabse anubhavi retired professionals ke sath. Hamare mentors SBI ke purane MDs, CHROs, General Counsel, aur Senior CFOs hain.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <button onClick={() => setView('find-mentors')} className="bg-[#C84B31] text-white hover:bg-[#A63D28] transition-all px-8 py-4 rounded-xl font-bold shadow-lg flex items-center gap-2 transform active:scale-95">
                  Find a Mentor <Icons.ArrowRight />
                </button>
                <button onClick={() => { setOnboardStep(1); setView('onboard'); }} className="bg-[#FAF8F5] text-[#111827] border-2 border-[#111827] hover:bg-[#111827] hover:text-white transition-all px-8 py-4 rounded-xl font-bold transform active:scale-95">
                  Join as a Mentor
                </button>
              </div>

              <div className="flex flex-wrap gap-6 pt-4 text-xs font-bold text-gray-500">
                <span className="flex items-center gap-1.5"><Icons.ShieldCheck className="w-4 h-4 text-[#C84B31]" /> KYC-verified mentors</span>
                <span className="flex items-center gap-1.5"><Icons.ShieldCheck className="w-4 h-4 text-[#C84B31]" /> SSL-encrypted calls</span>
                <span className="flex items-center gap-1.5"><Icons.ShieldCheck className="w-4 h-4 text-[#C84B31]" /> 25+ saal ka average experience</span>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="w-full aspect-[4/3] bg-amber-50 rounded-[40px] overflow-hidden shadow-2xl border-4 border-white relative group">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" alt="Senior expert aur young professional hand-shake mockup" className="w-full h-full object-cover opacity-95 transition-all duration-750 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/75 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-4 rounded-2xl flex items-center justify-between shadow-xl">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Expertise verification metrics</p>
                    <p className="text-xs text-gray-850 font-bold mt-0.5">Highly experienced Boardroom leaders</p>
                  </div>
                  <div className="flex items-center gap-1 bg-[#C84B31]/10 px-3 py-1.5 rounded-xl">
                    <Icons.Star />
                    <span className="text-xs font-bold text-[#C84B31]">4.9 / 5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#111827] py-6 text-white text-center">
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-wrap justify-center md:justify-between items-center gap-4 text-xs font-bold tracking-wider uppercase text-neutral-400">
              <span className="text-[#C84B31]">EXPERTISE BADGES:</span>
              <span>Finance & Business</span>
              <span>Banking</span>
              <span>Stock Trading</span>
              <span>C.A & Audit</span>
              <span>Corporate Law</span>
              <span>Entrepreneurship</span>
              <span>Leadership & HR</span>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-20 md:px-8">
            <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
              <span className="text-xs font-bold uppercase text-[#C84B31] tracking-widest">HOW IT WORKS</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#111827]">Kaise Kaam Karta Hai Tajurba?</h2>
              <p className="text-sm text-gray-500 font-bold">Humne poochne aur seekhne ke beech ki doori ko bilkul khatam kar diya hai.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-3xl border border-neutral-200/60 shadow-sm relative space-y-4">
                <span className="text-3xl font-serif text-[#C84B31]/40 font-bold block">01</span>
                <h3 className="text-lg font-bold">Mentors ko filter karein</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-semibold">Budget slider aur package duration (1 hour se 6 months) ke hisab se verified list check karein.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-neutral-200/60 shadow-sm relative space-y-4">
                <span className="text-3xl font-serif text-[#C84B31]/40 font-bold block">02</span>
                <h3 className="text-lg font-bold">Apna secure slot book karein</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-semibold">Booking amount Tajurba Escrow vault me lock rahega jab tak aapka session poora nahi ho jata.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-neutral-200/60 shadow-sm relative space-y-4">
                <span className="text-3xl font-serif text-[#C84B31]/40 font-bold block">03</span>
                <h3 className="text-lg font-bold">Live classroom join karein</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-semibold">Bina kisi zoom call link ke direct browser me safe video session, chat, aur shared roadmaps payen.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. DISCOVERY HUB */}
      {view === 'find-mentors' && (
        <div className="flex-grow max-w-7xl mx-auto w-full px-4 py-8 md:px-8 animate-in fade-in duration-300">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 border-b pb-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#C84B31] uppercase tracking-widest">Find custom wisdom plans</span>
              <h1 className="text-3xl font-serif font-bold text-[#111827]">Verified Mentors & Programs</h1>
              <p className="text-xs text-gray-500 font-bold">Apne budget aur commitment months ke hisab se expert list filter karein.</p>
            </div>
            <div className="bg-[#C84B31]/10 text-[#C84B31] px-4 py-2 rounded-xl text-xs font-bold border border-[#C84B31]/20">
              Showing {filteredMentors.length} Verified Senior Mentors
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="space-y-6 lg:border-r pr-0 lg:pr-8">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Search Keywords</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.Search />
                  </span>
                  <input type="text" placeholder="Search banking, CA, trading..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#C84B31]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Industry Focus</label>
                <div className="flex flex-col gap-1">
                  {["All", "Finance & Business", "Banking", "Stock Trading", "C.A & Audit", "Corporate Law", "Entrepreneurship", "Leadership & HR", "Technology"].map((cat) => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-[#C84B31] text-white shadow-sm' : 'hover:bg-neutral-100 text-gray-600'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Program Duration</label>
                <div className="flex flex-col gap-1">
                  <button onClick={() => setSelectedDuration("all")} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${selectedDuration === "all" ? 'bg-[#111827] text-white shadow-sm' : 'hover:bg-neutral-100 text-gray-600'}`}>All Formats</button>
                  <button onClick={() => setSelectedDuration("hourly")} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${selectedDuration === "hourly" ? 'bg-[#111827] text-white shadow-sm' : 'hover:bg-neutral-100 text-gray-600'}`}>1-Hour Spot Call</button>
                  <button onClick={() => setSelectedDuration("2month")} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${selectedDuration === "2month" ? 'bg-[#111827] text-white shadow-sm' : 'hover:bg-neutral-100 text-gray-600'}`}>2-Month Short Program</button>
                  <button onClick={() => setSelectedDuration("6month")} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${selectedDuration === "6month" ? 'bg-[#111827] text-white shadow-sm' : 'hover:bg-neutral-100 text-gray-600'}`}>6-Month Legacy Cohort</button>
                </div>
              </div>

              <div className="space-y-3 bg-[#FAF8F5] p-4 rounded-2xl border">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-500 uppercase">Max Budget limit</span>
                  <span className="text-[#C84B31]">₹{budgetLimit.toLocaleString()}</span>
                </div>
                <input type="range" min="300" max="25000" step="100" value={budgetLimit} onChange={(e) => setBudgetLimit(parseInt(e.target.value))} className="w-full accent-[#C84B31] cursor-pointer" />
              </div>
            </div>

            <div className="lg:col-span-3">
              {filteredMentors.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border text-center space-y-4 animate-fade-in">
                  <span className="text-3xl block">🔍</span>
                  <h3 className="font-bold text-lg">Bhai, no matching mentors found!</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">Selected filter par abhi koi mentor available nahi hai. Budget range adjust karein ya direct Enquiry helpdesk se help mangen.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
                  {filteredMentors.map(m => (
                    <div key={m.id} className="bg-white rounded-3xl border hover:border-[#C84B31]/35 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
                      <div className="p-6 space-y-4">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-serif font-black text-lg ${m.avatarColor}`}>
                            {m.name[0]}
                          </div>
                          <div>
                            <h3 className="font-serif font-bold text-md text-[#111827] flex items-center gap-1">
                              {m.name} <Icons.ShieldCheck />
                            </h3>
                            <span className="inline-block px-2.5 py-0.5 bg-neutral-100 text-gray-500 rounded text-[9px] font-bold uppercase mt-1">
                              {m.field}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 border-t border-b py-2">
                          <span>⏱ Experience: <strong className="text-gray-800">{m.exp}</strong></span>
                          <span className="flex items-center gap-0.5"><Icons.Star /> {m.rating} ({m.sessionsCount})</span>
                        </div>

                        <p className="text-xs text-gray-500 leading-relaxed font-semibold line-clamp-3">{m.bio}</p>

                        <div className="bg-neutral-50 p-3 rounded-xl border space-y-1.5">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Available Packages:</p>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="bg-white p-2 rounded border text-center">
                              <span className="block text-[8px] text-gray-400 font-bold uppercase">1 Hour</span>
                              <strong className="text-xs">₹{m.pricing.hourly}</strong>
                            </div>
                            <div className="bg-white p-2 rounded border text-center">
                              <span className="block text-[8px] text-gray-400 font-bold uppercase">2 Months</span>
                              <strong className="text-xs text-[#C84B31]">₹{m.pricing["2month"].toLocaleString()}</strong>
                            </div>
                            <div className="bg-white p-2 rounded border text-center">
                              <span className="block text-[8px] text-gray-400 font-bold uppercase">6 Months</span>
                              <strong className="text-xs">₹{m.pricing["6month"].toLocaleString()}</strong>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-neutral-50 px-6 py-4 border-t flex justify-between items-center">
                        <div>
                          <span className="text-[8px] text-gray-400 font-bold block uppercase">Spot Payout</span>
                          <strong className="text-xs font-black">₹{m.pricing.hourly}/hr</strong>
                        </div>
                        <button onClick={() => { setSelectedBookingMentor(m); setBookingType('hourly'); handleConfirmBooking(); }} className="bg-[#C84B31] text-white hover:bg-[#A63D28] px-5 py-2 rounded-xl text-xs font-bold transition-all">
                          Book Session
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. ONBOARD VIEW */}
      {view === 'onboard' && (
        <div className="flex-grow max-w-3xl mx-auto w-full px-4 py-12 md:px-8">
          <div className="bg-white rounded-3xl border shadow-xl overflow-hidden">
            <div className="bg-[#111827] text-white p-8 relative">
              <span className="text-[9px] font-bold text-[#C84B31] tracking-widest uppercase block mb-1">Verify Professional Age & Legacy</span>
              <h1 className="text-2xl md:text-3xl font-serif font-black">Join Tajurba Expert Council</h1>
              <p className="text-xs text-gray-400 mt-1">Platform trust banaye rakhne ke liye mentors ki age kam se kam 30 saal honi chahiye.</p>

              <div className="flex items-center gap-4 mt-6">
                {[1, 2, 3, 4].map(step => (
                  <div key={step} className="flex-1 flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${onboardStep >= step ? 'bg-[#C84B31] text-white' : 'bg-white/10 text-gray-400'}`}>
                      {step}
                    </div>
                    {step < 4 && <div className={`flex-grow h-0.5 ${onboardStep > step ? 'bg-[#C84B31]' : 'bg-white/10'}`}></div>}
                  </div>
                ))}
              </div>
            </div>

            {onboardSuccess ? (
              <div className="p-12 text-center space-y-6">
                <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-800 text-3xl mx-auto">✓</div>
                <h2 className="text-2xl font-serif font-bold">Onboarding Wizard Completed!</h2>
                <p className="text-xs text-gray-500 max-w-sm mx-auto font-bold">Bhai, aapka profile verification pipeline me chala gaya hai. Demo check karne ke liye humne aapka profile temporarily Mentors Hub me live show kar diya hai!</p>
                <button onClick={handleStartOnboardOver} className="bg-[#C84B31] text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider">Go To Mentors Hub</button>
              </div>
            ) : (
              <form onSubmit={submitOnboardingStep} className="p-8 space-y-6">
                {onboardStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-md font-bold text-[#111827] border-b pb-2">Step 1: Focus Domain & Age Credentials</h3>
                    {onboardAgeError && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-xl border border-red-100 text-xs font-bold">
                        <Icons.AlertCircle />
                        <span>{onboardAgeError}</span>
                      </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 font-bold uppercase">Full Name</label>
                        <input type="text" required name="name" value={onboardForm.name} onChange={handleOnboardChange} placeholder="Prof. Devender Mukherjee" className="w-full px-4 py-2.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#C84B31]" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 font-bold uppercase flex justify-between">
                          <span>Your Age (Years)</span>
                          <span className="text-[#C84B31] lowercase font-bold">(Minimum 30+)</span>
                        </label>
                        <input type="number" required name="age" value={onboardForm.age} onChange={handleOnboardChange} placeholder="e.g., 54" className="w-full px-4 py-2.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#C84B31]" />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 font-bold uppercase">Industry Domain</label>
                        <select name="field" value={onboardForm.field} onChange={handleOnboardChange} className="w-full px-4 py-2.5 border rounded-xl text-xs font-semibold focus:outline-none bg-white font-bold">
                          <option>Finance & Business</option>
                          <option>Banking</option>
                          <option>Stock Trading</option>
                          <option>C.A & Audit</option>
                          <option>Corporate Law</option>
                          <option>Entrepreneurship</option>
                          <option>Leadership & HR</option>
                          <option>Technology</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 font-bold uppercase">Sub specialty focus</label>
                        <input type="text" name="subField" value={onboardForm.subField} onChange={handleOnboardChange} placeholder="e.g., Portfolio Hedge Planning" className="w-full px-4 py-2.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#C84B31]" />
                      </div>
                    </div>
                  </div>
                )}

                {onboardStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-md font-bold text-[#111827] border-b pb-2">Step 2: Narrative of Past Corporate Battles</h3>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase">Apne corporate safar ke bare me likhein</label>
                      <textarea rows={5} required name="legacyDetails" value={onboardForm.legacyDetails} onChange={handleOnboardChange} placeholder="Aapne kaun-kaun se corporate roles handle kiye hain, aur kin-kin major problems ko solve kiya hai..." className="w-full px-4 py-3 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#C84B31]" />
                    </div>
                  </div>
                )}

                {onboardStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-md font-bold text-[#111827] border-b pb-2">Step 3: Verification Credentials Upload</h3>
                    <p className="text-xs text-gray-500 font-bold">Trust banaye rakhne ke liye retirement certificates, business license copies, ya experience letters upload karein.</p>
                    <div className="border-2 border-dashed rounded-2xl p-8 bg-neutral-50 border-neutral-300 text-center cursor-pointer hover:bg-neutral-100 transition-colors">
                      <Icons.Upload />
                      <p className="text-xs font-bold text-gray-600">Drag & drop verification files here</p>
                    </div>
                  </div>
                )}

                {onboardStep === 4 && (
                  <div className="space-y-4">
                    <h3 className="text-md font-bold text-[#111827] border-b pb-2">Step 4: Configure Pricing & Dynamic Slabs</h3>
                    <p className="text-xs text-gray-500 font-bold">Set your pricing for different mentorship formats. Our dynamic engine will calculate the platform fee and your net payout automatically.</p>
                    <div className="space-y-6 mt-4">
                      <div className="bg-neutral-50 p-4 rounded-2xl border">
                        <label className="text-[10px] text-gray-500 font-bold uppercase block mb-2">1-Hour Spot Call Pricing (₹)</label>
                        <input type="number" name="priceHourly" value={onboardForm.priceHourly} onChange={handleOnboardChange} className="w-full px-4 py-2 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#C84B31] bg-white mb-3" />
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-gray-500">Platform Fee ({onboardHourlyCalculations.percent}%): <span className="text-red-500">-₹{onboardHourlyCalculations.fee}</span></span>
                          <span className="text-emerald-700">Your Net Payout: ₹{onboardHourlyCalculations.net}</span>
                        </div>
                      </div>
                      <div className="bg-neutral-50 p-4 rounded-2xl border">
                        <label className="text-[10px] text-gray-500 font-bold uppercase block mb-2">2-Month Short Program Pricing (₹)</label>
                        <input type="number" name="price2Month" value={onboardForm.price2Month} onChange={handleOnboardChange} className="w-full px-4 py-2 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#C84B31] bg-white mb-3" />
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-gray-500">Platform Fee ({onboard2MonthCalculations.percent}%): <span className="text-red-500">-₹{onboard2MonthCalculations.fee}</span></span>
                          <span className="text-emerald-700">Your Net Payout: ₹{onboard2MonthCalculations.net}</span>
                        </div>
                      </div>
                      <div className="bg-neutral-50 p-4 rounded-2xl border">
                        <label className="text-[10px] text-gray-500 font-bold uppercase block mb-2">6-Month Complete Cohort Pricing (₹)</label>
                        <input type="number" name="price6Month" value={onboardForm.price6Month} onChange={handleOnboardChange} className="w-full px-4 py-2 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#C84B31] bg-white mb-3" />
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-gray-500">Platform Fee ({onboard6MonthCalculations.percent}%): <span className="text-red-500">-₹{onboard6MonthCalculations.fee}</span></span>
                          <span className="text-emerald-700">Your Net Payout: ₹{onboard6MonthCalculations.net}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 mt-4 bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                        <input type="checkbox" name="agreeToConduct" checked={onboardForm.agreeToConduct} onChange={handleOnboardChange} className="mt-1 accent-[#C84B31] w-4 h-4 cursor-pointer" />
                        <p className="text-[10px] text-gray-600 font-bold leading-relaxed">
                          I agree to Tajurba's Ethical Code of Conduct. I confirm that all credentials provided are accurate and that I will maintain professionalism and confidentiality during all mentorship sessions.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-6 border-t mt-8">
                  {onboardStep > 1 ? (
                    <button type="button" onClick={() => setOnboardStep(prev => prev - 1)} className="px-6 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-neutral-100 transition-colors">Back</button>
                  ) : <div></div>}
                  <button type="submit" className="bg-[#C84B31] text-white px-8 py-2.5 rounded-xl text-xs font-bold hover:bg-[#A63D28] transition-all shadow-sm">
                    {onboardStep === 4 ? 'Submit Application' : 'Next Step'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 4. CLASSROOM VIEW */}
      {view === 'classroom' && classroomSession && (
        <div className="flex-grow flex flex-col md:flex-row bg-[#111827] text-white overflow-hidden h-[calc(100vh-76px)]">
          <div className="flex-grow flex flex-col p-4 relative">
            <div className="flex justify-between items-center bg-black/40 p-4 rounded-2xl backdrop-blur-md mb-4 absolute top-8 left-8 right-8 z-10 border border-white/10">
              <div>
                <h3 className="font-bold text-lg">{classroomSession.mentor.name}</h3>
                <span className="text-[10px] uppercase font-bold text-gray-400">{classroomSession.type} Mentorship Session</span>
              </div>
              <div className="flex items-center gap-3 bg-red-500/20 text-red-400 px-4 py-2 rounded-xl text-xs font-bold font-mono border border-red-500/30">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                {formattedTime}
              </div>
            </div>

            <div className="flex-grow flex flex-col md:flex-row gap-4">
              <div className="flex-1 bg-neutral-900 rounded-3xl relative overflow-hidden border border-neutral-800 shadow-2xl">
                {!isVideoOff ? (
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800" alt="Mentor" className="w-full h-full object-cover opacity-80" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-neutral-800">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl font-serif text-white shadow-inner ${classroomSession.mentor.avatarColor || 'bg-neutral-700'}`}>
                      {classroomSession.mentor.name[0]}
                    </div>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-sm border border-white/10">
                  {classroomSession.mentor.name} (Mentor)
                </div>
              </div>
              
              <div className="w-full md:w-1/3 h-64 md:h-auto bg-neutral-900 rounded-3xl relative overflow-hidden border border-neutral-800 shadow-xl">
                <div className="w-full h-full flex items-center justify-center bg-neutral-800">
                  <div className="w-20 h-20 rounded-full bg-[#C84B31] flex items-center justify-center text-3xl font-serif text-white shadow-inner">S</div>
                </div>
                <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-sm border border-white/10">
                  You (Student)
                </div>
              </div>
            </div>

            <div className="mt-4 bg-neutral-900 border border-neutral-800 p-4 rounded-3xl flex justify-center items-center gap-6 shadow-xl">
              <button onClick={() => setIsMuted(!isMuted)} className={`p-4 rounded-full transition-all border ${isMuted ? 'bg-red-500/20 border-red-500/30' : 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700'}`}>
                {isMuted ? <Icons.MicOff /> : <Icons.MicOn />}
              </button>
              <button onClick={() => setIsVideoOff(!isVideoOff)} className={`p-4 rounded-full transition-all border ${isVideoOff ? 'bg-red-500/20 border-red-500/30' : 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700'}`}>
                {isVideoOff ? <Icons.VideoOff /> : <Icons.VideoOn />}
              </button>
              <button onClick={() => setView('dashboard')} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-lg active:scale-95">
                Leave Session
              </button>
            </div>
          </div>

          <div className="w-full md:w-96 bg-neutral-900 border-l border-neutral-800 flex flex-col z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
            <div className="p-6 border-b border-neutral-800 bg-neutral-950">
              <h3 className="font-bold flex items-center gap-2"><Icons.Workspace /> Session Chat</h3>
              <p className="text-[10px] text-gray-500 font-bold mt-1">Camera/Mic off rakhna allowed hai. Aap yahan freely baat kar sakte hain.</p>
            </div>
            
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'Student' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[9px] text-gray-500 font-bold mb-1 uppercase tracking-wider">{msg.sender} • {msg.time}</span>
                  <div className={`p-3 rounded-2xl text-xs font-medium max-w-[85%] leading-relaxed shadow-sm ${
                    msg.sender === 'Student' ? 'bg-[#C84B31] text-white rounded-tr-sm' : msg.sender === 'System' ? 'bg-amber-900/30 text-amber-200 border border-amber-900/50 w-full rounded-tl-sm' : 'bg-neutral-800 text-neutral-200 rounded-tl-sm border border-neutral-700'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={sendChatMessage} className="p-4 border-t border-neutral-800 bg-neutral-950">
              <div className="relative flex items-center">
                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type your question..." className="w-full bg-neutral-800 border border-neutral-700 text-white pl-4 pr-12 py-3 rounded-xl text-xs focus:outline-none focus:border-[#C84B31] transition-colors" />
                <button type="submit" className="absolute right-2 top-2 bottom-2 bg-[#C84B31] text-white p-2 rounded-lg hover:bg-[#A63D28] transition-colors"><Icons.ArrowRight /></button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. DASHBOARD VIEW */}
      {view === 'dashboard' && (
        <div className="flex-grow max-w-7xl mx-auto w-full px-4 py-12 md:px-8 animate-in fade-in duration-300">
          <div className="mb-8 border-b pb-6">
            <h1 className="text-3xl font-serif font-bold text-[#111827]">Financial Dashboard</h1>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Platform Analytics & Commission Simulator</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1 bg-white p-6 rounded-3xl border shadow-sm flex flex-col justify-center">
                <span className="text-[10px] text-gray-500 font-bold uppercase block mb-2 tracking-wider">Gross Session Volume</span>
                <span className="text-3xl font-bold block mb-1 text-[#111827]">₹{platformLedger.gross.toLocaleString()}</span>
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-2 bg-emerald-50 w-max px-2 py-1 rounded">↑ +12.4% from last month</span>
              </div>
              <div className="col-span-2 md:col-span-1 bg-white p-6 rounded-3xl border shadow-sm flex flex-col justify-center">
                <span className="text-[10px] text-gray-500 font-bold uppercase block mb-2 tracking-wider">Tajurba Escrow Vault</span>
                <span className="text-3xl font-bold block mb-1 text-[#111827]">₹{platformLedger.escrow.toLocaleString()}</span>
                <span className="text-xs text-amber-600 font-bold flex items-center gap-1 mt-2 bg-amber-50 w-max px-2 py-1 rounded">Awaiting session completion</span>
              </div>
              <div className="col-span-2 bg-[#111827] text-white p-8 md:p-10 rounded-3xl shadow-lg relative overflow-hidden flex flex-col justify-center min-h-[200px]">
                <div className="relative z-10">
                  <span className="text-[10px] text-[#C84B31] font-bold uppercase tracking-widest block mb-3">Net Platform Revenue</span>
                  <span className="text-5xl font-serif font-black block mb-4">₹{platformLedger.profit.toLocaleString()}</span>
                  <p className="text-xs text-gray-400 font-semibold max-w-sm leading-relaxed border-t border-white/10 pt-4">Revenue generated through dynamic commission slabs. Slab A (20%), Slab B (18%), Slab C (15%).</p>
                </div>
                <div className="absolute -right-8 -bottom-8 opacity-5 transform scale-150 text-white"><Icons.Briefcase /></div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border shadow-sm flex flex-col">
              <h3 className="font-bold text-lg mb-1 text-[#111827]">Commission Simulator</h3>
              <p className="text-[10px] text-gray-500 font-bold mb-6 uppercase tracking-wider">Enter package price to see dynamic split.</p>
              <div className="space-y-4 flex-grow flex flex-col justify-center">
                <div>
                  <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1.5">Package Price (₹)</label>
                  <input type="number" value={calcInput} onChange={(e) => setCalcInput(e.target.value)} className="w-full px-4 py-3 border rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#C84B31] transition-shadow bg-neutral-50" />
                </div>
                <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200/60 space-y-4">
                  <div className="flex justify-between items-center text-xs border-b pb-3">
                    <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Active Slab</span>
                    <span className="font-bold text-right text-[#C84B31] bg-[#C84B31]/10 px-2 py-1 rounded-md">{calculatorResult.label}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-500">Platform Cut ({calculatorResult.percent}%)</span>
                    <span className="font-bold text-red-500">-₹{calculatorResult.fee.toLocaleString()}</span>
                  </div>
                  <div className="pt-4 border-t border-dashed flex justify-between items-center mt-2">
                    <span className="font-bold text-gray-800 uppercase text-[10px] tracking-wider">Mentor Payout</span>
                    <span className="font-black text-emerald-600 text-xl">₹{calculatorResult.net.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. AUTH VIEW */}
      {view === 'auth' && (
        <div className="flex-grow flex items-center justify-center p-4 md:p-8 bg-neutral-100/50">
          <div className="bg-white w-full max-w-md rounded-3xl border shadow-xl p-8 animate-in slide-in-from-bottom-4 duration-300">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-[#C84B31] rounded-2xl flex items-center justify-center text-white font-serif font-bold text-3xl shadow-lg mx-auto mb-5 transform -rotate-3 hover:rotate-0 transition-transform">त</div>
              <h2 className="text-2xl font-serif font-bold text-[#111827]">Welcome to Tajurba</h2>
              <p className="text-xs text-gray-500 font-bold mt-1">Login to access your mentorship sessions</p>
            </div>
            <div className="flex bg-neutral-100 p-1 rounded-xl mb-8 border">
              <button onClick={() => setAuthRole('student')} className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${authRole === 'student' ? 'bg-white shadow-sm text-[#111827]' : 'text-gray-500 hover:text-gray-700'}`}>I am a Student</button>
              <button onClick={() => setAuthRole('mentor')} className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${authRole === 'mentor' ? 'bg-[#111827] shadow-md text-white' : 'text-gray-500 hover:text-gray-700'}`}>I am a Mentor</button>
            </div>
            <form onSubmit={handleAuthSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Email Address</label>
                <input type="email" required value={authForm.email} onChange={(e) => setAuthForm({...authForm, email: e.target.value})} className="w-full px-4 py-3 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C84B31]/50 bg-neutral-50 focus:bg-white transition-all" placeholder="name@example.com" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex justify-between">
                  <span>Password</span>
                  <span className="text-[#C84B31] cursor-pointer hover:underline">Forgot?</span>
                </label>
                <input type="password" required value={authForm.password} onChange={(e) => setAuthForm({...authForm, password: e.target.value})} className="w-full px-4 py-3 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C84B31]/50 bg-neutral-50 focus:bg-white transition-all" placeholder="••••••••" />
              </div>
              <button type="submit" className="w-full bg-[#C84B31] text-white py-3.5 rounded-xl text-xs font-bold hover:bg-[#A63D28] transition-all transform active:scale-95 shadow-md mt-6 uppercase tracking-wider">Secure Login</button>
            </form>
            <p className="text-center text-[10px] text-gray-400 font-bold mt-8">By logging in, you agree to our <span onClick={() => setView('legal')} className="text-[#C84B31] cursor-pointer hover:underline">Terms & Conditions</span>.</p>
          </div>
        </div>
      )}

      {/* 7. LEGAL VIEW */}
      {view === 'legal' && (
        <div className="flex-grow max-w-5xl mx-auto w-full px-4 py-12 md:px-8 animate-in fade-in duration-300">
          <div className="mb-10 border-b pb-6">
            <h1 className="text-3xl font-serif font-bold text-[#111827]">Platform Policies</h1>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Tajurba Escrow and Code of Conduct Guidelines</p>
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-64 space-y-2 shrink-0">
              <button onClick={() => setActivePolicyTab('terms')} className={`w-full text-left px-5 py-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${activePolicyTab === 'terms' ? 'bg-[#C84B31] text-white shadow-md' : 'bg-white border text-gray-600 hover:bg-neutral-50'}`}>Escrow & Payment Terms {activePolicyTab === 'terms' && <Icons.ArrowRight />}</button>
              <button onClick={() => setActivePolicyTab('conduct')} className={`w-full text-left px-5 py-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${activePolicyTab === 'conduct' ? 'bg-[#111827] text-white shadow-md' : 'bg-white border text-gray-600 hover:bg-neutral-50'}`}>Mentor Code of Conduct {activePolicyTab === 'conduct' && <Icons.ArrowRight />}</button>
              <button onClick={() => setActivePolicyTab('privacy')} className={`w-full text-left px-5 py-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${activePolicyTab === 'privacy' ? 'bg-[#111827] text-white shadow-md' : 'bg-white border text-gray-600 hover:bg-neutral-50'}`}>Privacy Policy {activePolicyTab === 'privacy' && <Icons.ArrowRight />}</button>
            </div>
            <div className="flex-grow bg-white p-8 md:p-10 rounded-3xl border shadow-sm">
              {activePolicyTab === 'terms' && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-3 border-b pb-4">
                    <div className="bg-[#C84B31]/10 p-2 rounded-lg text-[#C84B31]"><Icons.Briefcase /></div>
                    <h2 className="text-xl font-serif font-bold text-[#111827]">Escrow & Payment Terms</h2>
                  </div>
                  <div className="space-y-5">
                    <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                      <h4 className="text-sm font-bold text-[#111827] mb-1">1. Escrow Vault Protection</h4>
                      <p className="text-xs text-gray-600 leading-relaxed font-semibold">100% of the student's booking fee is held securely in the Tajurba Escrow Vault until the session is successfully completed. This ensures zero risk for both parties.</p>
                    </div>
                    <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                      <h4 className="text-sm font-bold text-[#111827] mb-1">2. Commission Slabs</h4>
                      <p className="text-xs text-gray-600 leading-relaxed font-semibold">Platform fees are dynamically deducted based on the total transaction size according to our unified engine (Slab A: 20%, Slab B: 18%, Slab C: 15%).</p>
                    </div>
                    <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                      <h4 className="text-sm font-bold text-[#111827] mb-1">3. Payout Timeline</h4>
                      <p className="text-xs text-gray-600 leading-relaxed font-semibold">Net mentor payouts are cleared to verified bank accounts within T+2 business days after a session concludes without dispute.</p>
                    </div>
                  </div>
                </div>
              )}
              {activePolicyTab === 'conduct' && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-3 border-b pb-4">
                    <div className="bg-[#111827]/10 p-2 rounded-lg text-[#111827]"><Icons.ShieldCheck /></div>
                    <h2 className="text-xl font-serif font-bold text-[#111827]">Mentor Code of Conduct</h2>
                  </div>
                  <div className="space-y-5">
                    <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                      <h4 className="text-sm font-bold text-[#111827] mb-1">1. Age Requirement</h4>
                      <p className="text-xs text-gray-600 leading-relaxed font-semibold">Strict enforcement of the 30+ years age limit to ensure deep legacy experience and mature industry guidance.</p>
                    </div>
                    <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                      <h4 className="text-sm font-bold text-[#111827] mb-1">2. Respect & Empathy</h4>
                      <p className="text-xs text-gray-600 leading-relaxed font-semibold">We serve young professionals. Mentors must approach naive questions with patience and structural guidance, keeping introvert-friendly modes (camera/mic off) fully supported.</p>
                    </div>
                    <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                      <h4 className="text-sm font-bold text-[#111827] mb-1">3. No Unverified Promises</h4>
                      <p className="text-xs text-gray-600 leading-relaxed font-semibold">Mentors cannot promise guaranteed job placements, stock tips, or absolute financial returns under any circumstances.</p>
                    </div>
                  </div>
                </div>
              )}
              {activePolicyTab === 'privacy' && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-3 border-b pb-4">
                    <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-600"><Icons.ShieldCheck /></div>
                    <h2 className="text-xl font-serif font-bold text-[#111827]">Privacy Policy</h2>
                  </div>
                  <div className="space-y-5">
                    <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                      <h4 className="text-sm font-bold text-[#111827] mb-1">1. Data Encryption</h4>
                      <p className="text-xs text-gray-600 leading-relaxed font-semibold">All video streams and chat logs are peer-to-peer encrypted during live WebRTC sessions. We do not store raw video recordings on our servers.</p>
                    </div>
                    <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                      <h4 className="text-sm font-bold text-[#111827] mb-1">2. Identity Protection</h4>
                      <p className="text-xs text-gray-600 leading-relaxed font-semibold">Students have the right to remain completely anonymous using our text-only introvert mode during sessions. Mentors must respect this boundary.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FULL-SCREEN SUCCESS MODAL OVERLAY */}
      {showCheckoutSuccess && (
        <div className="fixed inset-0 bg-[#111827]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-3xl mx-auto border-4 border-emerald-100">
              <Icons.ShieldCheck className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#111827]">Session Confirmed!</h3>
            <p className="text-xs text-gray-500 font-bold leading-relaxed">Amount placed in Escrow Vault. Routing you to the secure classroom...</p>
          </div>
        </div>
      )}
      
    </div>
  );
}
