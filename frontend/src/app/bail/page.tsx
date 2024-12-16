"use client";
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
// import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { BACKEND_URL } from "../config";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const BailApplicationPage = () => {

  const [formData, setFormData] = useState({
    applicantName: '',
    caseNumber: '',
    email: '',
    address: '',
    additionalInfo: '',
    file: null,
  });
  const [theme, setTheme] = useState('dark');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Ensure the "isSubmitting" state is reset when form submission starts
    setIsSubmitting(true);
  
    // Form validation
    if (!formData.applicantName || !formData.caseNumber || !formData.email || !formData.address || !formData.additionalInfo) {
      alert('Please fill out all required fields.');
      setIsSubmitting(false); // Reset submitting state if validation fails
      return;
    }
    const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
   
    try {
        const res = await axios.post(
          `${BACKEND_URL}/api/v1/bail`,
          {
            applicantName: formData.applicantName,
            caseNumber: formData.caseNumber,
            email: formData.email,
            address: formData.address,
            additionalInfo: formData.additionalInfo,
            file: formData.file,
          },
          {
            headers: {
              "Content-Type": "application/json",
               Authorization: `Bearer ${token}`, 
            },
          },
        );
        if (res.status === 201) {
            setProgress(25);
            await generatePDF();
            await toast.success("Application submitted successfully!...");
          
        } else {
          toast.error("Unable to submit application. Please try again.");
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          "Error during Applicatiopn. Please try again.";
        toast.error(errorMessage);
        toast.error("Error during signup:", error);
      } finally {
        setIsSubmitting(false); 
      }
  
  };
  



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      file: e.target.files[0],
    }));
  };

  const getBase64FromUrl = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  
  const generatePDF = async () => {
    const doc = new jsPDF();
    try {
   
      doc.setFillColor(255, 255, 255);
      doc.circle(20, 20, 15, 'F');

      doc.setFontSize(18);
      doc.text('Ministry of Law & Justice', 40, 15);
      doc.text('Department of Justice', 40, 25);
      doc.text('Bail Application', 40, 35);
  
      // Body content
      doc.setFontSize(12);
      doc.text(`To,`, 20, 50);
      doc.text(`The Honorable Court`, 20, 60);
      doc.text(`Subject: Bail Application for the case No. ${formData.caseNumber}`, 20, 70);
      doc.text(`Respected Sir/Madam,`, 20, 80);
  
      // Application content in letter format
      const letterContent = `I, ${formData.applicantName}, respectfully submit this application requesting bail in the case registered against me, bearing case number ${formData.caseNumber}. 
  
  I am currently residing at ${formData.address}. I am a law-abiding citizen, and I have no intentions to evade the law. I fully intend to cooperate with the judicial process and ensure that I attend all court hearings and fulfill any obligations placed upon me during this legal proceeding.
  
  ${formData.additionalInfo ? `Additional Information: ${formData.additionalInfo}` : ''}
  
  I humbly request the court to consider granting me bail as I am willing to abide by all conditions that the court may impose upon me. I assure the court that I will not misuse the bail in any manner, nor will I attempt to leave the jurisdiction.
  
  Thank you for considering my application. I look forward to your kind and just decision in this matter.
  
  Sincerely,
  ${formData.applicantName}
  Contact: ${formData.email}`;
  
      // Split letterContent into lines for fitting in PDF
      const lines = doc.splitTextToSize(letterContent, 170);
  
      doc.text(lines, 20, 90);
  
      // Footer with page numbers
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
      }
  
      // Save the PDF
      doc.save('BailApplicationForm.pdf');
    } catch (error) {
      console.error('Error generating PDF: ', error);
      alert('Error generating PDF.');
    }
  };
  

  return (
    
    <div className={`min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-gray-900 text-gray-400' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`max-w-4xl w-full space-y-8 p-10 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <form onSubmit={handleSubmit}>
          <motion.div className="space-y-12" initial="initial" animate="animate">
            <motion.div className="border-b border-gray-900/10 pb-12" {...fadeInUp}>
              <h2 className={`text-base font-semibold leading-7 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                Bail Application Form
              </h2>
              <p className={`mt-1 text-sm leading-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Please fill out the form below accurately. All fields are required, and a valid document is compulsory for verification.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                {/* Applicant Name */}
                <motion.div className="sm:col-span-4" {...fadeInUp}>
                  <label htmlFor="applicantName" className={`block text-sm font-medium leading-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                    Applicant Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="applicantName"
                      name="applicantName"
                      type="text"
                      placeholder="John Doe"
                      autoComplete="name"
                      value={formData.applicantName}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ${theme === 'dark' ? 'bg-gray-700 text-gray-300 ring-gray-600 focus:ring-indigo-500' : 'bg-white text-gray-900 ring-gray-300 focus:ring-indigo-600'} sm:text-sm sm:leading-6`}
                    />
                  </div>
                </motion.div>

                {/* Case Number */}
                <motion.div className="sm:col-span-4" {...fadeInUp}>
                  <label htmlFor="caseNumber" className={`block text-sm font-medium leading-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                    Case Number
                  </label>
                  <div className="mt-2">
                    <input
                      id="caseNumber"
                      name="caseNumber"
                      type="text"
                      placeholder="1234-5678"
                      value={formData.caseNumber}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ${theme === 'dark' ? 'bg-gray-700 text-gray-300 ring-gray-600 focus:ring-indigo-500' : 'bg-white text-gray-900 ring-gray-300 focus:ring-indigo-600'} sm:text-sm sm:leading-6`}
                    />
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div className="sm:col-span-4" {...fadeInUp}>
                  <label htmlFor="email" className={`block text-sm font-medium leading-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ${theme === 'dark' ? 'bg-gray-700 text-gray-300 ring-gray-600 focus:ring-indigo-500' : 'bg-white text-gray-900 ring-gray-300 focus:ring-indigo-600'} sm:text-sm sm:leading-6`}
                    />
                  </div>
                </motion.div>

                {/* Address */}
                <motion.div className="sm:col-span-4" {...fadeInUp}>
                  <label htmlFor="address" className={`block text-sm font-medium leading-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                    Address
                  </label>
                  <div className="mt-2">
                    <input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="123 Main St, City, Country"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ${theme === 'dark' ? 'bg-gray-700 text-gray-300 ring-gray-600 focus:ring-indigo-500' : 'bg-white text-gray-900 ring-gray-300 focus:ring-indigo-600'} sm:text-sm sm:leading-6`}
                    />
                  </div>
                </motion.div>

                {/* Additional Information */}
                <motion.div className="sm:col-span-6" {...fadeInUp}>
                  <label htmlFor="additionalInfo" className={`block text-sm font-medium leading-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                    Additional Information
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      placeholder="Provide any other relevant details..."
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ${theme === 'dark' ? 'bg-gray-700 text-gray-300 ring-gray-600 focus:ring-indigo-500' : 'bg-white text-gray-900 ring-gray-300 focus:ring-indigo-600'} sm:text-sm sm:leading-6`}
                    />
                  </div>
                </motion.div>

                {/* File Upload */}
                <motion.div className="sm:col-span-6" {...fadeInUp}>
                  <label htmlFor="file" className={`block text-sm font-medium leading-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                    Upload Document
                  </label>
                  <div className="mt-2">
                    <input
                      id="file"
                      name="file"
                      type="file"
                      onChange={handleFileChange}
                      className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700`}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>

           
<motion.div className="mt-6" {...fadeInUp}>
  <button
    type="submit"
    disabled={isSubmitting}
    className={`w-full flex justify-center rounded-md border border-transparent ${isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-600'} py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
  >
    {isSubmitting ? 'Submitting...' : 'Submit Application'}
  </button>
</motion.div>

          </motion.div>
        </form>
      </div>

    </div>
  );
};

export default BailApplicationPage;
