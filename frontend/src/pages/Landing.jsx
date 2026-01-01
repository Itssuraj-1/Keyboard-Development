// frontend/src/pages/Landing.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import { BookOpen, PenTool, Users, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import CursorTrail from '../components/effects/CursorTrail';
import ClickRipple from '../components/effects/ClickRipple';

/**
 * Landing page with beautiful animations - first page users see
 */
const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/home');
    return null;
  }

  const handleStartReading = () => {
    navigate('/home');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Custom Cursor Trail Effect */}
      <CursorTrail />
      
      {/* Custom Click Ripple Effect */}
      <ClickRipple />

      {/* Navigation */}
      <motion.nav 
        className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.h1 
              className="text-3xl font-bold text-black cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Haerin
            </motion.h1>
            <div className="flex space-x-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" onClick={handleLogin}>
                  Login
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="primary" onClick={handleRegister}>
                  Get Started
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with Animations */}
      <motion.div 
        className="relative overflow-hidden bg-white text-black py-20 sm:py-28 lg:py-36 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 -left-20 w-72 h-72 bg-black/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 -right-20 w-96 h-96 bg-black/5 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <motion.div 
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Floating Badge */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center mb-8"
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 backdrop-blur-sm border border-black/10 rounded-full text-sm text-black"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles size={16} className="text-black" />
              <span>Welcome to Haerin - Share Your Voice</span>
            </motion.div>
          </motion.div>

          {/* Main Heading */}
          <motion.h2 
            variants={itemVariants}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-center mb-6 leading-tight text-black"
          >
            Share Your Stories
            <br />
            <span className="bg-linear-to-r from-gray-600 via-gray-800 to-gray-600 bg-clip-text text-transparent">
              With the World
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-700 text-center max-w-3xl mx-auto mb-12"
          >
            Haerin is a minimalist blogging platform where writers share their ideas,
            stories, and expertise with readers everywhere.
          </motion.p>

          {/* CTA Buttons - Fixed Alignment and Responsive Sizes */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 sm:flex-initial">
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartReading}
                className="w-full sm:w-auto bg-black text-white hover:bg-gray-800 px-4 sm:px-8 py-4 flex items-center justify-center text-xs sm:text-base whitespace-nowrap" 
              >
                <BookOpen size={20} className="mr-2 shrink-0" />
                Start Reading
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 sm:flex-initial">
              <Button
                variant="secondary"
                size="lg"
                onClick={handleRegister}
                className="w-full sm:w-auto bg-white text-black border-2 border-black hover:bg-gray-100 px-4 sm:px-8 py-4 flex items-center justify-center text-xs sm:text-base whitespace-nowrap"
              >
                <PenTool size={20} className="mr-2 shrink-0" />
                Start Writing
              </Button>
            </motion.div>
          </motion.div>

          {/* Floating Icons - Desktop Only */}
          <div className="hidden lg:block">
            <motion.div
              variants={floatingVariants}
              animate="animate"
              className="absolute top-10 left-10"
            >
              <div className="w-16 h-16 bg-black/5 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-black/10">
                <PenTool size={28} className="text-black" />
              </div>
            </motion.div>

            <motion.div
              variants={floatingVariants}
              animate="animate"
              style={{ animationDelay: "1s" }}
              className="absolute top-32 right-20"
            >
              <div className="w-20 h-20 bg-black/5 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-black/10">
                <BookOpen size={32} className="text-black" />
              </div>
            </motion.div>

            <motion.div
              variants={floatingVariants}
              animate="animate"
              style={{ animationDelay: "2s" }}
              className="absolute bottom-10 left-32"
            >
              <div className="w-14 h-14 bg-black/5 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-black/10">
                <Sparkles size={24} className="text-black" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <div className="py-20 sm:py-32 relative z-10">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <div className="grid md:grid-cols-3 gap-12">
            <motion.div 
              className="text-center space-y-4 p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300"
              variants={featureVariants}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <BookOpen size={32} className="text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900">Read Stories</h3>
              <p className="text-gray-600">
                Discover insightful articles and engaging stories from writers around the world.
              </p>
            </motion.div>

            <motion.div 
              className="text-center space-y-4 p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300"
              variants={featureVariants}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <PenTool size={32} className="text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900">Write & Publish</h3>
              <p className="text-gray-600">
                Share your thoughts and ideas with a beautiful, distraction-free editor.
              </p>
            </motion.div>

            <motion.div 
              className="text-center space-y-4 p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300"
              variants={featureVariants}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Users size={32} className="text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900">Build Community</h3>
              <p className="text-gray-600">
                Engage with readers through comments and build a following around your work.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <motion.div 
        className="bg-black text-white py-20 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="max-w-4xl mx-auto text-center px-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 
            variants={itemVariants}
            className="text-4xl font-bold mb-6"
          >
            Join Thousands of Writers and Readers
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-300 mb-8"
          >
            Start your blogging journey today. It's free and takes less than a minute.
          </motion.p>
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="secondary"
              size="lg"
              onClick={handleRegister}
              className="bg-white text-black hover:bg-gray-100"
            >
              Create Your Account
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Landing;