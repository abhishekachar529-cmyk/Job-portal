// frontend/src/pages/HomePage.jsx
// ✅ PROFESSIONAL VERSION - WITH FLOATING BUBBLES

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMapPin, FiDollarSign, FiClock, FiArrowRight, FiBriefcase, 
  FiUsers, FiAward, FiTrendingUp, FiStar, FiCode, FiBarChart2, 
  FiMail, FiHeart, FiEye,
  FiPenTool, FiBookOpen, FiMonitor, FiPieChart,
  FiChevronRight
} from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

// ===== Category Data with Professional Colors =====
const categoryData = [
  { 
    name: 'IT & Software', 
    icon: <FiCode className="text-3xl" />, 
    jobs: '2,500+', 
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-100',
    hoverBorder: 'border-blue-300',
    hoverBg: 'hover:bg-blue-50',
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Web Dev, AI, Cloud'
  },
  { 
    name: 'Finance', 
    icon: <FiBarChart2 className="text-3xl" />, 
    jobs: '1,200+', 
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-100',
    hoverBorder: 'border-emerald-300',
    hoverBg: 'hover:bg-emerald-50',
    gradient: 'from-emerald-500 to-teal-500',
    description: 'Banking, Investment'
  },
  { 
    name: 'Marketing', 
    icon: <FiTrendingUp className="text-3xl" />, 
    jobs: '800+', 
    color: 'from-rose-500 to-pink-500',
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    border: 'border-rose-100',
    hoverBorder: 'border-rose-300',
    hoverBg: 'hover:bg-rose-50',
    gradient: 'from-rose-500 to-pink-500',
    description: 'Digital, SEO, Content'
  },
  { 
    name: 'Design', 
    icon: <FiPenTool className="text-3xl" />, 
    jobs: '600+', 
    color: 'from-purple-500 to-fuchsia-500',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-100',
    hoverBorder: 'border-purple-300',
    hoverBg: 'hover:bg-purple-50',
    gradient: 'from-purple-500 to-fuchsia-500',
    description: 'UI/UX, Graphic Design'
  },
  { 
    name: 'Healthcare', 
    icon: <FiHeart className="text-3xl" />, 
    jobs: '900+', 
    color: 'from-red-500 to-orange-500',
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-100',
    hoverBorder: 'border-red-300',
    hoverBg: 'hover:bg-red-50',
    gradient: 'from-red-500 to-orange-500',
    description: 'Medical, Nursing'
  },
  { 
    name: 'Education', 
    icon: <FiBookOpen className="text-3xl" />, 
    jobs: '700+', 
    color: 'from-amber-500 to-yellow-500',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-100',
    hoverBorder: 'border-amber-300',
    hoverBg: 'hover:bg-amber-50',
    gradient: 'from-amber-500 to-yellow-500',
    description: 'Teaching, E-Learning'
  },
];

// ===== Bubble Background Component =====
const BubbleBackground = ({ count = 15, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-200/20',
    purple: 'bg-purple-200/20',
    indigo: 'bg-indigo-200/20',
    white: 'bg-white/5'
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(count)].map((_, i) => {
        const size = Math.random() * 80 + 20;
        const duration = 15 + Math.random() * 20;
        const delay = Math.random() * 10;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        return (
          <motion.div
            key={i}
            className={`absolute rounded-full ${colors[color] || colors.blue} backdrop-blur-sm border border-white/10`}
            style={{
              width: size,
              height: size,
              left: `${x}%`,
              top: `${y}%`,
            }}
            animate={{
              y: [0, -30 - Math.random() * 50, 0],
              x: [0, Math.random() * 30 - 15, 0],
              scale: [1, 1.1 + Math.random() * 0.2, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              delay: delay,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
};

// ===== CountUp Component =====
const CountUp = ({ end, duration = 2.5, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    let animationFrame;

    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);

    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
};

// ===== Job Carousel Component =====
const JobCarousel = ({ jobs }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const itemsPerView = 3;
  const totalPages = Math.ceil(jobs.length / itemsPerView);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % totalPages);
    }, 4000);
    return () => clearInterval(interval);
  }, [totalPages]);

  const getVisibleJobs = () => {
    const start = currentIndex * itemsPerView;
    return jobs.slice(start, start + itemsPerView);
  };

  if (jobs.length === 0) return null;

  const visibleJobs = getVisibleJobs();

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="grid md:grid-cols-3 gap-6"
          >
            {visibleJobs.map((job, index) => (
              <motion.div
                key={job._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition">
                        {job.title}
                      </h3>
                      <p className="text-gray-500">{job.company}</p>
                    </div>
                    <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs rounded-full shadow-md">
                      Featured
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-500 text-sm">
                      <FiMapPin className="mr-2 text-indigo-500" /> {job.location || 'Remote'}
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <FiDollarSign className="mr-2 text-emerald-500" /> ${job.salaryMin}k - ${job.salaryMax}k
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <FiClock className="mr-2 text-amber-500" /> {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills?.slice(0, 2).map((skill, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                    {job.skills?.length > 2 && (
                      <span className="text-gray-400 text-xs px-2 py-1">+{job.skills.length - 2}</span>
                    )}
                  </div>
                  <Link to={`/jobs/${job._id}`}>
                    <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-xl hover:shadow-lg transition-all font-medium">
                      Apply Now
                    </button>
                  </Link>
                </div>
                <motion.div 
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                  className="h-1 bg-gradient-to-r from-indigo-500 to-purple-600"
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? 'w-8 bg-gradient-to-r from-indigo-500 to-purple-600' 
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ===== Main HomePage Component =====
const HomePage = () => {
  const navigate = useNavigate();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCompanies: 0,
    totalCandidates: 0
  });
  const [hoveredCategory, setHoveredCategory] = useState(null);

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        console.log('📤 HomePage: Fetching jobs from MongoDB...');
        const response = await axios.get(`${API_URL}/jobs`);
        console.log('📥 HomePage Response:', response.data);

        if (response.data.success) {
          const jobsData = response.data.jobs || [];
          console.log(`✅ HomePage: Loaded ${jobsData.length} jobs`);
          setFeaturedJobs(jobsData);
          setStats({
            totalJobs: jobsData.length,
            totalCompanies: [...new Set(jobsData.map(j => j.company))].length,
            totalCandidates: jobsData.reduce((acc, j) => acc + (j.applicantsCount || 0), 0)
          });
        }
      } catch (error) {
        console.error('❌ HomePage Fetch Error:', error);
        toast.error('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  const heroStats = [
    { icon: <FiBriefcase className="text-3xl" />, value: stats.totalJobs || 10000, label: 'Live Jobs', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { icon: <FiUsers className="text-3xl" />, value: stats.totalCompanies || 5000, label: 'Companies', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { icon: <FiAward className="text-3xl" />, value: stats.totalCandidates || 50000, label: 'Happy Candidates', color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const floatAnimation = {
    y: [0, -10, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/50">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white">
        {/* Hero background bubbles */}
        <BubbleBackground count={25} color="white" />
        
        <div className="absolute inset-0">
          <motion.div 
            animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-pink-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 py-28 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.span 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white/90 mb-6 border border-white/10"
              >
                🚀 10,000+ Jobs Available
              </motion.span>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Find Your Dream{' '}
                <motion.span 
                  animate={{ 
                    color: ['#fcd34d', '#fbbf24', '#fcd34d'],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block text-yellow-300"
                >
                  Job
                </motion.span>
                {' '}
                <span className="text-white">Today</span>
              </h1>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Connect with top employers and discover opportunities that match your skills and aspirations.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Link to="/jobs">
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  animate={floatAnimation}
                  className="bg-white text-indigo-700 px-10 py-4 rounded-xl font-semibold hover:shadow-2xl transition flex items-center gap-2 text-lg"
                >
                  Browse Jobs <FiArrowRight className="animate-pulse" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Animated Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              initial={{ d: "M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" }}
              animate={{ 
                d: [
                  "M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z",
                  "M0,32L80,37.3C160,43,320,53,480,58.7C640,64,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z",
                  "M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              fill="#f0f4ff"
            />
          </svg>
        </div>
      </section>

      {/* ===== STATS SECTION - WITH BLUE BUBBLES ===== */}
      <section className="relative py-16 bg-gradient-to-r from-blue-50 via-indigo-50/50 to-purple-50 overflow-hidden">
        <BubbleBackground count={20} color="blue" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {heroStats.map((stat, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl border border-white/50"
              >
                <motion.div 
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: idx * 0.3 }}
                  className={`${stat.color} flex justify-center mb-4`}
                >
                  {stat.icon}
                </motion.div>
                <div className="text-4xl font-bold text-gray-800 mb-2">
                  <CountUp end={stat.value} duration={2.5} suffix="+" />
                </div>
                <div className="text-gray-500 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== CATEGORIES SECTION ===== */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50/30">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <motion.span 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-4"
            >
              Categories
            </motion.span>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Popular Categories</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Find jobs in your preferred industry</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          >
            {categoryData.map((cat, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                whileHover={{ 
                  y: -12, 
                  scale: 1.03,
                  boxShadow: "0 25px 50px rgba(0,0,0,0.12)" 
                }}
                onHoverStart={() => setHoveredCategory(idx)}
                onHoverEnd={() => setHoveredCategory(null)}
                onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat.name)}`)}
                className={`${cat.bg} ${cat.border} border rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 group cursor-pointer relative overflow-hidden ${cat.hoverBg}`}
              >
                <motion.div
                  animate={hoveredCategory === idx ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <motion.div 
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`w-16 h-16 bg-gradient-to-r ${cat.color} rounded-xl flex items-center justify-center mx-auto mb-4 text-white text-2xl group-hover:scale-110 transition-transform shadow-md`}
                  >
                    {cat.icon}
                  </motion.div>
                  <h3 className={`font-semibold text-gray-800 mb-1`}>{cat.name}</h3>
                  <p className="text-sm text-gray-500">{cat.jobs} jobs</p>
                  <p className="text-xs text-gray-400 mt-1">{cat.description}</p>
                  <motion.div 
                    initial={{ opacity: 0, x: -8 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="mt-2 text-indigo-600 text-sm font-medium flex items-center justify-center gap-1"
                  >
                    View Jobs <FiChevronRight className="text-xs" />
                  </motion.div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredCategory === idx ? 1 : 0 }}
                  className={`absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r ${cat.color} opacity-20 pointer-events-none`}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURED JOBS SECTION ===== */}
      <section className="py-20 bg-gradient-to-b from-blue-50/30 to-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-between items-center mb-10"
          >
            <div>
              <motion.span 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-3"
              >
                Latest Jobs
              </motion.span>
              <h2 className="text-4xl font-bold text-gray-800">Featured Jobs</h2>
              <p className="text-gray-500 mt-2">Latest opportunities for you</p>
            </div>
            <Link to="/jobs" className="text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-2 hover:gap-3 transition-all group">
              View All 
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <FiArrowRight />
              </motion.span>
            </Link>
          </motion.div>

          {featuredJobs.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-50 rounded-2xl shadow-lg p-12 text-center border border-gray-100"
            >
              <FiBriefcase className="mx-auto text-5xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No jobs available yet</h3>
              <p className="text-gray-500">Check back later for new opportunities</p>
            </motion.div>
          ) : (
            <JobCarousel jobs={featuredJobs} />
          )}
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
          {/* CTA bubbles */}
          <BubbleBackground count={20} color="white" />
          
          <motion.div 
            animate={{ x: [0, 200, 0], y: [0, -100, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ x: [0, -200, 0], y: [0, 100, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 12, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-white/5 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.span 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white/90 mb-6 border border-white/10"
            >
              🎯 Join 50,000+ Professionals
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Start Your Career Journey?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Join thousands of professionals who found their dream jobs through our platform.
            </p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Link to="/jobs">
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  animate={floatAnimation}
                  className="bg-white text-indigo-700 px-10 py-4 rounded-xl font-semibold hover:shadow-2xl transition flex items-center gap-2 text-lg"
                >
                  Browse Jobs <FiArrowRight className="animate-pulse" />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;