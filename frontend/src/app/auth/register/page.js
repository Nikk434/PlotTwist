'use client'
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, EyeIcon, EyeSlashIcon, UserIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    gender: '',
    level: '',
    total_industry_experience: '',
    valid_documents: '',
    recent_work: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) newErrors.username = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.level) newErrors.level = 'Experience level is required';

    if (formData.level === 'professional') {
      if (!formData.total_industry_experience) {
        newErrors.total_industry_experience = 'Industry experience is required for professionals';
      }
      if (!formData.valid_documents) {
        newErrors.valid_documents = 'Valid documents are required for professionals';
      }
      if (!formData.recent_work) {
        newErrors.recent_work = 'Recent work is required for professionals';
      }
    }

    if (formData.level === 'film_school_student' && !formData.valid_documents) {
      newErrors.valid_documents = 'Valid documents are required for film school students';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const submitData = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        dob: new Date(formData.dob).toISOString(),
        gender: formData.gender,
        level: formData.level,
        // friends: []
      };

      if (formData.level === 'professional') {
        submitData.total_industry_experience = parseInt(formData.total_industry_experience);
        submitData.valid_documents = formData.valid_documents.trim();
        submitData.recent_work = formData.recent_work.trim();
      }

      if (formData.level === 'film_school_student') {
        submitData.valid_documents = formData.valid_documents.trim();
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful! You can now login.');
        window.location.href = '/auth/login';
      } else {
        setErrors({ submit: data.detail || 'Registration failed' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderConditionalFields = () => {
    if (formData.level === 'professional') {
      return (
        <>
          <div className="space-y-2">
            <Label>Years of Industry Experience *</Label>
            <Input
              type="number"
              min="0"
              placeholder="e.g., 5"
              value={formData.total_industry_experience}
              onChange={(e) => handleInputChange('total_industry_experience', e.target.value)}
              className={errors.total_industry_experience ? 'border-red-500' : ''}
            />
            {errors.total_industry_experience && (
              <p className="text-sm text-red-600">{errors.total_industry_experience}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Valid Documents (URL) *</Label>
            <Input
              type="url"
              placeholder="https://example.com/your-credentials.pdf"
              value={formData.valid_documents}
              onChange={(e) => handleInputChange('valid_documents', e.target.value)}
              className={errors.valid_documents ? 'border-red-500' : ''}
            />
            {errors.valid_documents && (
              <p className="text-sm text-red-600">{errors.valid_documents}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Recent Work Portfolio (URL) *</Label>
            <Input
              type="url"
              placeholder="https://example.com/your-portfolio"
              value={formData.recent_work}
              onChange={(e) => handleInputChange('recent_work', e.target.value)}
              className={errors.recent_work ? 'border-red-500' : ''}
            />
            {errors.recent_work && (
              <p className="text-sm text-red-600">{errors.recent_work}</p>
            )}
          </div>
        </>
      );
    }

    if (formData.level === 'film_school_student') {
      return (
        <div className="space-y-2">
          <Label>Valid Student Documents (URL) *</Label>
          <Input
            type="url"
            placeholder="https://example.com/student-id.pdf"
            value={formData.valid_documents}
            onChange={(e) => handleInputChange('valid_documents', e.target.value)}
            className={errors.valid_documents ? 'border-red-500' : ''}
          />
          {errors.valid_documents && (
            <p className="text-sm text-red-600">{errors.valid_documents}</p>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-purple-700">Join PlotTwist</CardTitle>
          <CardDescription className="text-gray-600">
            Create your account and start battling with creative minds
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {errors.submit && (
              <Alert className="border-red-500 bg-red-50">
                <AlertDescription className="text-red-700">
                  {errors.submit}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Username *</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter a unique username"
                    className={`pl-10 ${errors.username ? 'border-red-500' : ''}`}
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                  />
                </div>
                {errors.username && <p className="text-sm text-red-600">{errors.username}</p>}
              </div>

              <div className="space-y-2">
                <Label>Email Address *</Label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Password *</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ?
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" /> :
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    }
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label>Confirm Password *</Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className={`pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showConfirmPassword ?
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" /> :
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    }
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date of Birth *</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="date"
                    className={`pl-10 ${errors.dob ? 'border-red-500' : ''}`}
                    value={formData.dob}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                  />
                </div>
                {errors.dob && <p className="text-sm text-red-600">{errors.dob}</p>}
              </div>

              <div className="space-y-2">
                <Label>Gender *</Label>
                <Select onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-sm text-red-600">{errors.gender}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Experience Level *</Label>
              <Select onValueChange={(value) => handleInputChange('level', value)}>
                <SelectTrigger className={errors.level ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enthusiast">Enthusiast</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="film_school_student">Film School Student</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                </SelectContent>
              </Select>
              {errors.level && <p className="text-sm text-red-600">{errors.level}</p>}
            </div>

            {renderConditionalFields()}

            <Button
              onClick={handleSubmit}
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                Sign in here
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}