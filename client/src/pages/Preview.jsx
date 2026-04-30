import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ResumePreview from "../components/ResumePreview";
import Loader from "../components/Loader";
import { ArrowLeftIcon, DownloadIcon } from "lucide-react";
import api from "../configs/api";
import toast from "react-hot-toast";

const Preview = () => {
  const { resumeId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [resumeData, setResumeData] = useState(null);

  // ✅ Fetch Resume
  const loadResume = async () => {
    try {
      const { data } = await api.get(`/api/resumes/public/${resumeId}`);
      setResumeData(data.resume);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (resumeId) loadResume();
  }, [resumeId]);

  // ✅ Download (Print to PDF)
  const handleDownload = () => {
    window.print();
  };

  // ✅ Loading State
  if (isLoading) {
    return <Loader />;
  }

  // ❌ Resume Not Found
  if (!resumeData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-center text-5xl text-slate-400 font-medium">
          Resume not found
        </p>

        <a
          href="/"
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 h-10 flex items-center transition-colors"
        >
          <ArrowLeftIcon className="mr-2 size-4" />
          Go to home page
        </a>
      </div>
    );
  }

  // ✅ Main UI
  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="max-w-3xl mx-auto py-10 px-4">
        {/* 🔽 Top Bar */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <a
            href="/"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800"
          >
            <ArrowLeftIcon className="size-4" />
            Back
          </a>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
          >
            <DownloadIcon className="size-4" />
            Download
          </button>
        </div>

        {/* 📄 Resume Preview */}
        <div className="bg-white shadow-sm print:shadow-none">
          <ResumePreview
            data={resumeData}
            template={resumeData.template}
            accentColor={resumeData.accent_color}
            className="py-4"
          />
        </div>
      </div>
    </div>
  );
};

export default Preview;
