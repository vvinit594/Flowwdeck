'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Briefcase, 
  Award, 
  Code, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Globe, 
  Clock, 
  MapPin,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Upload,
  X,
  Check
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userAPI } from '@/lib/api';

export default function ProfileSetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState({ name: '', email: '', userType: 'freelancer' });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [profileData, setProfileData] = useState({
    category: '',
    professionalTitle: '',
    experienceLevel: '',
    skills: [],
    bio: '',
    portfolioLinks: {
      behance: '',
      dribbble: '',
      github: '',
      youtube: '',
      website: ''
    },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    country: ''
  });

  const totalSteps = 6;

  // Get signup data on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const signupData = sessionStorage.getItem('signupData');
      if (signupData) {
        setUserData(JSON.parse(signupData));
      } else {
        // No signup data, redirect to signup
        router.push('/signup');
      }
    }
  }, [router]);

  const categories = [
    { id: 'web-dev', name: 'Web Development', icon: Code },
    { id: 'app-dev', name: 'App Development', icon: Code },
    { id: 'graphic-design', name: 'Graphic Design', icon: ImageIcon },
    { id: 'video-editing', name: 'Video Editing', icon: ImageIcon },
    { id: 'content-writing', name: 'Content Writing', icon: User },
    { id: 'ui-ux', name: 'UI/UX Design', icon: Briefcase },
    { id: 'digital-marketing', name: 'Digital Marketing', icon: Globe },
    { id: 'other', name: 'Other', icon: Award }
  ];

  const experienceLevels = [
    { id: '0-1', label: '0-1 year', description: 'Just starting out' },
    { id: '1-3', label: '1-3 years', description: 'Building experience' },
    { id: '3-5', label: '3-5 years', description: 'Mid-level professional' },
    { id: '5+', label: '5+ years', description: 'Senior expert' }
  ];

  const popularSkills = [
    'HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Python',
    'Figma', 'Adobe Photoshop', 'Adobe Illustrator', 'Adobe Premiere',
    'WordPress', 'Shopify', 'SEO', 'Content Writing', 'Social Media',
    'Video Editing', 'UI/UX Design', 'TypeScript', 'Next.js', 'Tailwind CSS'
  ];

  const handleSkillToggle = (skill) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    setError('');
    setLoading(true);

    try {
      // Prepare profile data for API
      const apiProfileData = {
        fullName: userData.name,
        displayName: userData.name.split(' ')[0], // Use first name as display name
        professionalTitle: profileData.professionalTitle,
        category: profileData.category,
        experienceLevel: profileData.experienceLevel,
        skills: profileData.skills,
        bio: profileData.bio,
        timezone: profileData.timezone,
        country: profileData.country,
        avatarUrl: profileImagePreview || '', // Use preview URL or empty string
        portfolioLinks: profileData.portfolioLinks
      };

      let response;
      
      try {
        // Try to create profile first
        response = await userAPI.createProfile(apiProfileData);
        console.log('Profile created successfully');
      } catch (createError) {
        // If profile already exists (409 conflict), update it instead
        if (createError.message.includes('already exists')) {
          console.log('Profile exists, updating instead...');
          response = await userAPI.updateProfile(apiProfileData);
          console.log('Profile updated successfully');
        } else {
          throw createError;
        }
      }

      // Clean up session storage
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('signupData');
      }
      
      // Small delay to ensure state updates, then redirect
      setTimeout(() => {
        router.push('/dashboard');
      }, 100);
      
    } catch (err) {
      console.error('Profile setup error:', err);
      setError(err.message || 'Failed to complete profile setup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return profileData.category !== '';
      case 2: return profileData.professionalTitle.trim() !== '';
      case 3: return profileData.experienceLevel !== '';
      case 4: return profileData.skills.length > 0;
      case 5: return true; // Optional step
      case 6: return true; // Optional step
      default: return false;
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              FlowDeck
            </h1>
          </Link>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-indigo-500/50 mb-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm">Complete Your Profile</span>
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Welcome, {userData.name}! 👋</h2>
          <p className="text-gray-400 text-sm">Let's set up your freelancer profile in a few simple steps</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-indigo-400 font-semibold">{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-linear-to-r from-indigo-600 to-purple-600"
              style={{ boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)' }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8 border border-white/10 min-h-[500px] flex flex-col">
          <AnimatePresence mode="wait">
            {/* Step 1: Category */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1"
              >
                <h3 className="text-xl font-bold mb-2">What's your primary expertise?</h3>
                <p className="text-sm text-gray-400 mb-6">This helps us personalize your workspace</p>
                
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <motion.button
                        key={category.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setProfileData({ ...profileData, category: category.id })}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          profileData.category === category.id
                            ? 'bg-indigo-500/20 border-indigo-500/50'
                            : 'bg-white/5 border-white/10 hover:border-indigo-500/30'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mb-2 ${
                          profileData.category === category.id ? 'text-indigo-400' : 'text-gray-400'
                        }`} />
                        <span className="text-sm font-medium">{category.name}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 2: Professional Title */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1"
              >
                <h3 className="text-xl font-bold mb-2">What's your professional title?</h3>
                <p className="text-sm text-gray-400 mb-6">This appears on your profile and projects</p>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Professional Title</label>
                  <input
                    type="text"
                    value={profileData.professionalTitle}
                    onChange={(e) => setProfileData({ ...profileData, professionalTitle: e.target.value })}
                    placeholder="e.g., Frontend Developer (React + Tailwind)"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 transition"
                  />
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-gray-500">Examples:</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Full Stack Developer',
                        'UI/UX Designer',
                        'Motion Graphics Artist',
                        'Content Writer & SEO Specialist',
                        'Digital Marketing Expert'
                      ].map((example) => (
                        <button
                          key={example}
                          onClick={() => setProfileData({ ...profileData, professionalTitle: example })}
                          className="px-3 py-1 text-xs bg-white/5 hover:bg-indigo-500/20 border border-white/10 hover:border-indigo-500/30 rounded-full transition"
                        >
                          {example}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Experience Level */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1"
              >
                <h3 className="text-xl font-bold mb-2">What's your experience level?</h3>
                <p className="text-sm text-gray-400 mb-6">Help clients understand your expertise</p>
                
                <div className="space-y-3">
                  {experienceLevels.map((level) => (
                    <motion.button
                      key={level.id}
                      whileHover={{ scale: 1.01, x: 4 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setProfileData({ ...profileData, experienceLevel: level.id })}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                        profileData.experienceLevel === level.id
                          ? 'bg-indigo-500/20 border-indigo-500/50'
                          : 'bg-white/5 border-white/10 hover:border-indigo-500/30'
                      }`}
                    >
                      <div>
                        <div className="font-semibold mb-1">{level.label}</div>
                        <div className="text-sm text-gray-400">{level.description}</div>
                      </div>
                      {profileData.experienceLevel === level.id && (
                        <Check className="w-5 h-5 text-indigo-400" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: Skills */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1"
              >
                <h3 className="text-xl font-bold mb-2">What are your key skills?</h3>
                <p className="text-sm text-gray-400 mb-6">Select at least 3-5 skills (you can add more later)</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {popularSkills.map((skill) => (
                    <motion.button
                      key={skill}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSkillToggle(skill)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        profileData.skills.includes(skill)
                          ? 'bg-indigo-500/30 border-2 border-indigo-500 text-white'
                          : 'bg-white/5 border border-white/10 hover:border-indigo-500/30 text-gray-300'
                      }`}
                    >
                      {skill}
                      {profileData.skills.includes(skill) && (
                        <span className="ml-1">✓</span>
                      )}
                    </motion.button>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                  <p className="text-sm text-indigo-300">
                    <strong>{profileData.skills.length}</strong> skills selected
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 5: Bio & Profile Image */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1"
              >
                <h3 className="text-xl font-bold mb-2">Tell us about yourself</h3>
                <p className="text-sm text-gray-400 mb-6">Add a bio and profile image (optional but recommended)</p>
                
                {/* Profile Image Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">Profile Image</label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden">
                      {profileImagePreview ? (
                        <img src={profileImagePreview} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <Upload className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <label className="px-4 py-2 bg-indigo-600/80 hover:bg-indigo-600 rounded-lg text-sm font-medium cursor-pointer transition inline-block">
                        Choose Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      {profileImagePreview && (
                        <button
                          onClick={() => {
                            setProfileImage(null);
                            setProfileImagePreview(null);
                          }}
                          className="ml-2 text-sm text-gray-400 hover:text-white transition"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium mb-2">Professional Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Write a brief introduction about your experience, expertise, and what makes you unique..."
                    rows={5}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 transition resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">{profileData.bio.length} / 500 characters</p>
                </div>
              </motion.div>
            )}

            {/* Step 6: Portfolio & Additional Info */}
            {currentStep === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 overflow-y-auto"
              >
                <h3 className="text-xl font-bold mb-2">Portfolio & Additional Info</h3>
                <p className="text-sm text-gray-400 mb-6">Optional but helps showcase your work</p>
                
                <div className="space-y-4">
                  {/* Portfolio Links */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Portfolio Links</label>
                    <div className="space-y-3">
                      {[
                        { key: 'behance', label: 'Behance', placeholder: 'https://behance.net/yourusername' },
                        { key: 'dribbble', label: 'Dribbble', placeholder: 'https://dribbble.com/yourusername' },
                        { key: 'github', label: 'GitHub', placeholder: 'https://github.com/yourusername' },
                        { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@yourchannel' },
                        { key: 'website', label: 'Personal Website', placeholder: 'https://yourwebsite.com' }
                      ].map((link) => (
                        <div key={link.key}>
                          <label className="block text-xs text-gray-400 mb-1">{link.label}</label>
                          <input
                            type="url"
                            value={profileData.portfolioLinks[link.key]}
                            onChange={(e) => setProfileData({
                              ...profileData,
                              portfolioLinks: {
                                ...profileData.portfolioLinks,
                                [link.key]: e.target.value
                              }
                            })}
                            placeholder={link.placeholder}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-indigo-500 transition text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timezone & Country */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Timezone</label>
                      <input
                        type="text"
                        value={profileData.timezone}
                        onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-indigo-500 transition text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Country</label>
                      <input
                        type="text"
                        value={profileData.country}
                        onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                        placeholder="e.g., United States"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-indigo-500 transition text-sm"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${
                currentStep === 1
                  ? 'opacity-50 cursor-not-allowed bg-white/5'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </motion.button>

            {currentStep < totalSteps ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${
                  isStepValid()
                    ? 'bg-linear-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/50'
                    : 'opacity-50 cursor-not-allowed bg-gray-600'
                }`}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                onClick={handleFinish}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-green-600 to-emerald-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating Profile...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Complete Setup
                  </>
                )}
              </motion.button>
            )}
          </div>

          {/* Skip Option */}
          {currentStep > 4 && !loading && (
            <div className="text-center mt-4">
              <button
                onClick={handleFinish}
                className="text-sm text-gray-400 hover:text-white transition"
              >
                Skip for now
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
