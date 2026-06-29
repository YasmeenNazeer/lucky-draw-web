"use client";

import { useState } from 'react';
import AmountCard from '@/components/AmountCard';
import PaymentCard from '@/components/PaymentCard';
import { AMOUNT_OPTIONS, WHATSAPP_PHONE } from '@/lib/config';

export default function Home() {
  const [selectedAmount, setSelectedAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [returnAccount, setReturnAccount] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>(
    { type: null, message: '' }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Countdown timer for next draw (example: 7 days from now)
  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hours: 12,
    minutes: 30,
    seconds: 45
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Simple validation
    if (!name.trim()) {
      setErrors({ name: 'Name is required' });
      setIsSubmitting(false);
      return;
    }

    if (!phoneNumber.trim()) {
      setErrors({ phone: 'Phone number is required' });
      setIsSubmitting(false);
      return;
    }

    if (!selectedAmount) {
      setErrors({ selectedAmount: 'Please select an amount first' });
      setIsSubmitting(false);
      return;
    }

    if (!paymentMethod) {
      setErrors({ paymentMethod: 'Please select a payment method' });
      setIsSubmitting(false);
      return;
    }

    if (!returnAccount.trim()) {
      setErrors({ returnAccount: 'Return account number is required' });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phoneNumber.trim(),
          amount: selectedAmount,
          returnNumber: returnAccount.trim(),
          paymentMethod,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit');
      }

      setSubmitStatus({ type: 'success', message: 'Entry submitted successfully! Good luck!' });
      // Reset form
      setSelectedAmount('');
      setPaymentMethod('');
      setReturnAccount('');
      setPhoneNumber('');
      setName('');
    } catch (error: any) {
      setSubmitStatus({ type: 'error', message: error.message || 'Failed to submit. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#f8f5ff] to-[#fff7ed] relative overflow-hidden">
      {/* Background blur blobs - REMOVED blur effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-500/10 to-purple-500/10 -translate-x-16 -translate-y-16"></div>
      </div>

      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 bg-white/70 border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              {/* Gift icon */}
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 rounded-xl flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m0-3H9a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 002-2z"></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Lucky Draw</h1>
            </div>
            <div className="hidden md:flex space-x-4">
              <a href="/admin" className="relative flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white font-medium rounded-xl hover:from-purple-500 hover:via-pink-400 hover:to-orange-300 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg">
                Admin Panel
                <svg className="ml-2 h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500">
              Random Lucky Draw Every Month 🎉
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Enter now for a chance to win. Every month, a winner is randomly chosen through a fair lucky draw system.
            </p>
          </div>

          {/* Decorative elements */}
          <div className="absolute inset-0 -z-10 pointer-events-none">
            {/* Floating sparkles */}
            <div className="absolute top-1/4 left-1/6 animate-float">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 rounded-full animate-pulse"></div>
            </div>
            <div className="absolute top-1/3 right-1/5 animate-float-reverse">
              <div className="w-5 h-5 bg-gradient-to-r from-pink-400 via-purple-500 to-orange-300 rounded-full animate-pulse"></div>
            </div>
            <div className="absolute bottom-1/3 left-1/4 animate-float-slow">
              <div className="w-3 h-3 bg-gradient-to-r from-orange-400 via-purple-500 to-pink-400 rounded-full animate-pulse"></div>
            </div>
            <div className="absolute bottom-1/4 right-1/6 animate-float-reverse-slow">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-300 via-pink-400 to-orange-500 rounded-full animate-pulse"></div>
            </div>

            {/* Gift icons */}
            <div className="absolute top-10 left-10">
              <svg className="w-8 h-8 text-purple-500/30 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m0-3H9a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 002-2z"></path>
              </svg>
            </div>
            <div className="absolute bottom-10 right-10">
              <svg className="w-8 h-8 text-pink-500/30 animate-spin-slow reverse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m0-3H9a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 002-2z"></path>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Entry Amount Section */}
      <section className="mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Select Your Entry Amount
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {AMOUNT_OPTIONS.map((amount) => (
              <AmountCard
                key={amount}
                amount={amount}
                description={amount.replace(/\s*PKR\s*/i, '') + ' PKR'}
                isSelected={selectedAmount === amount}
                onSelect={() => setSelectedAmount(amount)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Payment Method Section */}
      <section className="mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Choose Payment Method
          </h3>
          <div className="space-y-6">
            <PaymentCard
              name="JazzCash"
              phone="0300-1234567"
              className="border-l-4 border-orange-400 bg-white/70"
            />
            <PaymentCard
              name="Easypaisa"
              phone="0321-1234567"
              className="border-l-4 border-emerald-400 bg-white/70"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h2>
          <div className="relative">
            {/* Step Cards */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-x-4">
              {/* Step 1: Select Amount */}
              <div className="flex flex-col items-center w-full sm:w-auto">
                <div className="w-14 h-14 mb-4 flex-shrink-0 rounded-xl border-2 border-purple-200 bg-purple-50 flex items-center justify-center">
                  <span className="text-purple-600 text-xl font-bold">1</span>
                </div>
                <h3 className="font-medium text-gray-800 mb-2 text-center sm:text-left">Select Amount</h3>
                <p className="text-sm text-gray-500 text-center max-w-sm">
                  Choose your entry amount from the options below.
                </p>
              </div>

              {/* Arrow 1 */}
              <div className="w-4 h-4 mt-10 hidden sm:block">
                <svg className="w-full h-full text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l6 6-6 6"></path>
                </svg>
              </div>

              {/* Step 2: Make Payment */}
              <div className="flex flex-col items-center w-full sm:w-auto">
                <div className="w-14 h-14 mb-4 flex-shrink-0 rounded-xl border-2 border-pink-200 bg-pink-50 flex items-center justify-center">
                  <span className="text-pink-600 text-xl font-bold">2</span>
                </div>
                <h3 className="font-medium text-gray-800 mb-2 text-center sm:text-left">Make Payment</h3>
                <p className="text-sm text-gray-500 text-center max-w-sm">
                  Pay securely via JazzCash or Easypaisa.
                </p>
              </div>

              {/* Arrow 2 */}
              <div className="w-4 h-4 mt-10 hidden sm:block">
                <svg className="w-full h-full text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l6 6-6 6"></path>
                </svg>
              </div>

              {/* Step 3: Submit Details */}
              <div className="flex flex-col items-center w-full sm:w-auto">
                <div className="w-14 h-14 mb-4 flex-shrink-0 rounded-xl border-2 border-orange-200 bg-orange-50 flex items-center justify-center">
                  <span className="text-orange-600 text-xl font-bold">3</span>
                </div>
                <h3 className="font-medium text-gray-800 mb-2 text-center sm:text-left">Submit Details</h3>
                <p className="text-sm text-gray-500 text-center max-w-sm">
                  Fill in your information to complete your entry.
                </p>
              </div>

              {/* Arrow 3 */}
              <div className="w-4 h-4 mt-10 hidden sm:block">
                <svg className="w-full h-full text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l6 6-6 6"></path>
                </svg>
              </div>

              {/* Step 4: Wait for Draw */}
              <div className="flex flex-col items-center w-full sm:w-auto">
                <div className="w-14 h-14 mb-4 flex-shrink-0 rounded-xl border-2 border-purple-200 bg-purple-50 flex items-center justify-center">
                  <span className="text-purple-600 text-xl font-bold">4</span>
                </div>
                <h3 className="font-medium text-gray-800 mb-2 text-center sm:text-left">Wait for Draw</h3>
                <p className="text-sm text-gray-500 text-center max-w-sm">
                  Sit back and wait for the monthly draw announcement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/90 rounded-3xl shadow-lg border border-gray-100/50 p-10 border-l-4 border-r-4 bg-gradient-to-t from-purple-50 via-pink-50 to-orange-50/10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">
              Enter Your Details
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Please fill in your information to complete your entry.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8" id="dynamic-form">
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded-2xl border border-gray-300 px-5 py-3 shadow-md focus:border-transparent focus:ring-2 focus:ring-gradient-to-r from-purple-400 via-pink-500 to-orange-400 focus:bg-white text-gray-900 placeholder-gray-400 sm:text-sm"
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mt-1 block w-full rounded-2xl border border-gray-300 px-5 py-3 shadow-md focus:border-transparent focus:ring-2 focus:ring-gradient-to-r from-purple-400 via-pink-500 to-orange-400 focus:bg-white text-gray-900 placeholder-gray-400 sm:text-sm"
                    placeholder="Enter your mobile number"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Return Account Number
                  </label>
                  <input
                    type="text"
                    value={returnAccount}
                    onChange={(e) => setReturnAccount(e.target.value)}
                    className="mt-1 block w-full rounded-2xl border border-gray-300 px-5 py-3 shadow-md focus:border-transparent focus:ring-2 focus:ring-gradient-to-r from-purple-400 via-pink-500 to-orange-400 focus:bg-white text-gray-900 placeholder-gray-400 sm:text-sm"
                    placeholder="Enter your bank/account number for returns"
                  />
                  {errors.returnAccount && <p className="mt-1 text-sm text-red-600">{errors.returnAccount}</p>}
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 block w-full rounded-2xl border border-gray-300 px-5 py-3 shadow-md focus:border-transparent focus:ring-2 focus:ring-gradient-to-r from-purple-400 via-pink-500 to-orange-400 focus:bg-white text-gray-900 placeholder-gray-400 sm:text-sm"
                  >
                    <option value="">Select Payment Method</option>
                    <option value="JazzCash">JazzCash</option>
                    <option value="Easypaisa">Easypaisa</option>
                  </select>
                  {errors.paymentMethod && <p className="mt-1 text-sm text-red-600">{errors.paymentMethod}</p>}
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Selected Amount
                  </label>
                  <input
                    type="text"
                    value={selectedAmount || 'Not selected'}
                    readOnly
                    className="mt-1 block w-full rounded-2xl border border-gray-300 px-5 py-3 shadow-md bg-gray-50 text-gray-900"
                  />
                  {errors.selectedAmount && <p className="mt-1 text-sm text-red-600">{errors.selectedAmount}</p>}
                </div>
              </div>

              {/* Submit Status Messages */}
              <div className="mt-4">
                {submitStatus.type === 'success' && (
                  <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-xl" role="alert">
                    <p className="font-medium">{submitStatus.message}</p>
                  </div>
                )}
                {submitStatus.type === 'error' && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl" role="alert">
                    <p className="font-medium">{submitStatus.message}</p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedAmount || !paymentMethod || !name || !phoneNumber || !returnAccount}
                  className="w-full flex justify-center items-center px-8 py-4 text-lg font-bold text-white rounded-3xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 hover:from-purple-500 hover:via-pink-400 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-gradient-to-r from-purple-400 via-pink-500 to-orange-400 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <span className="mr-3">Submitting...</span>
                      <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                    </>
                  ) : (
                    'Submit & Confirm Entry'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Bottom Trust Banner */}
      <section className="mt-20 bg-white/70 rounded-3xl shadow-xl border border-gray-100/50 mx-8 mb-16">
        <div className="flex flex-col items-center p-10 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Trusted by Thousands of Participants
          </h3>
          <div className="flex space-x-10">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 mb-3 flex-shrink-0">
                <div className="w-full h-full rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                  <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Secure Payment
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 mb-3 flex-shrink-0">
                <div className="w-full h-full rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                  <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m2 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Monthly Winners
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 mb-3 flex-shrink-0">
                <div className="w-full h-full rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                  <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Transparent Draw
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            Join our growing community of winners and experience the excitement of our monthly draws.
          </p>
        </div>
      </section>

      {/* Footer */}
      <section className="mb-8 mx-auto max-w-xl">
        <div className="relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-xl border border-green-200/50 shadow-inner-lg hover:shadow-xl transition-shadow duration-300">
          <div className="absolute inset-0 -z-0 bg-gradient-to-r from-green-50 via-green-100 to-emerald-50 opacity-20 pointer-events-none"></div>
          <div className="relative z-0 flex flex-col items-center p-6 text-center space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 flex-shrink-0">
                <div className="w-full h-full rounded-xl flex items-center justify-center bg-gradient-to-r from-green-400 via-green-500 to-emerald-500">
                  <span className="text-2xl text-green-600">📞</span>
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                WhatsApp Verification & Support
              </h2>
            </div>
            <p className="text-sm text-gray-600 max-w-md">
              After completing payment, send your payment screenshot on WhatsApp for verification. If you face any issue or have questions, contact us on WhatsApp.
            </p>
            <button
              onClick={() => window.open(`https://wa.me/${WHATSAPP_PHONE}`, '_blank')}
              className="w-full flex justify-center items-center px-4 py-2 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-400 hover:via-green-500 hover:to-emerald-500 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
            >
              Send Screenshot on WhatsApp
            </button>
          </div>
        </div>
      </section>
      <footer className="bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Verification Notice */}
          <div className="mb-6 p-4 bg-white/80 rounded-xl border-l-4 border-purple-500">
            <p className="text-sm text-gray-700">
              After completing payment, please send your payment screenshot on WhatsApp for verification. Only verified payments will be eligible for the lucky draw.
            </p>
          </div>


          {/* Stats and Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-300">
            {/* 100% Secure */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-3">
                <div className="w-full h-full rounded-xl flex items-center justify-center bg-blue-100">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-5a2 2 0 00-2-2h-5.586a1 1 0 00-.707-.293l-2.414-2.414a1 1 0 00-1.415 0l-.293-.293a1 1 0 00-1.415 0l-.293-.293A1 1 0 005 11V9a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V15a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-center text-sm font-medium">100% Secure</p>
            </div>
            {/* Transparent Draw */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-3">
                <div className="w-full h-full rounded-xl flex items-center justify-center bg-purple-100">
                  <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <p className="text-center text-sm font-medium">Transparent Draw</p>
            </div>
            {/* Monthly Winners */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-3">
                <div className="w-full h-full rounded-xl flex items-center justify-center bg-yellow-100">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.504-.133-2.948-.382-4.286z" />
                  </svg>
                </div>
              </div>
              <p className="text-center text-sm font-medium">Monthly Winners</p>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-800/50 text-center text-sm">
            <p>&copy; 2024 Lucky Draw. All rights reserved.</p>
            <div className="mt-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors mx-2">Terms & Conditions</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors mx-2">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}