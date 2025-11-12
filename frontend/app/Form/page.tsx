"use client";


import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";


export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    doorNumber: "",
    postCode: "",
    howHeard: "",
    deviceType: "",
    deviceBrand: "",
    issue: "",
    password: "",
    appleId: "",
    dataSave: 0,
    termsAccepted: 0,
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const jobIDParam = searchParams.get("jobID");
  const jobID = jobIDParam ? Number(jobIDParam) : null;
  


  useEffect(() => {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      setFormData(JSON.parse(savedData)); // Populate form with saved data
    }
  }, []);

  useEffect(() => {
    if (!jobID) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!formSubmitted) {
        try {
          // Best-effort cancel on tab close; keepalive works in modern browsers
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cancel-job`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobID }),
            keepalive: true,
          });
        } catch {
          // ignore
        }
      }
    };

  window.addEventListener("beforeunload", handleBeforeUnload);

  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
    // ❌ no cancelReservation() here anymore
  };
}, [jobID, formSubmitted]);

  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedData = {
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    };
    setFormData(updatedData);
    localStorage.setItem('formData', JSON.stringify(updatedData)); // Save data to localStorage
  };
  

const handleSubmit = async (e) => {
  e.preventDefault();

  if (loading) return;

  setLoading(true);
  setErrorMessage("");

  if (!formData.termsAccepted) {
    setErrorMessage("You must accept the Terms and Conditions / Privacy Policy.");
    setLoading(false);
    return;
  }

  if (!jobID) {
    setErrorMessage("No Job ID found. Please go back and start the booking again.");
    setLoading(false);
    return;
  }

  try {
    const payload = {
      ...formData,
      jobID, // 👈 use the jobID from the URL
    };

    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/submit`, payload);
    localStorage.removeItem("formData");
    setFormSubmitted(true);  
    router.push("/success");
  } catch (error) {
    console.error("Axios Error:", error.response ? error.response.data : error.message);
    setErrorMessage(
      error.response ? error.response.data.error : "An error occurred. Check console."
    );
    setLoading(false);
  }
};

const cancelReservation = async () => {
  if (!jobID) return;
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cancel-job`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobID }),
    });
  } catch (err) {
    console.error("Error cancelling job:", err);
  }
};

  

  const handleResetForm = () => {
    // Reset the form data state
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      doorNumber: "",
      postCode: "",
      howHeard: "",
      deviceType: "",
      deviceBrand: "",
      issue: "",
      password: "",
      appleId: "",
      dataSave: 0,
      termsAccepted: 0,
    });
  
    // Remove the saved form data from localStorage
    localStorage.removeItem('formData'); // Clear the saved data in localStorage
  
    // Reset the form submitted state
    setFormSubmitted(false);
  };
  

return (
  <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200">
      <h2 className="text-5xl font-extrabold text-center text-gray-800 mb-8 tracking-tight">
        <span className="bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text">
          Booking In Form
        </span>
      </h2>

      {errorMessage && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mt-4 text-center border border-red-200">
          {errorMessage}
        </div>
      )}

      {jobID !== null && (
        <div className="text-right text-gray-600 font-bold text-lg">
          Job ID: {jobID}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="p-3 border rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="p-3 border rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="p-3 border rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="p-3 border rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="doorNumber"
            value={formData.doorNumber}
            onChange={handleChange}
            placeholder="House Number"
            className="p-3 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <input
            name="postCode"
            value={formData.postCode}
            onChange={handleChange}
            placeholder="Post Code"
            className="p-3 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <select
          name="howHeard"
          value={formData.howHeard}
          onChange={handleChange}
          className="p-3 border rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        >
          <option value="">How did you hear about us?</option>
          <option value="Passing Door">Passing Door</option>
          <option value="Internet">Internet</option>
          <option value="Previous Customer">Previous Customer</option>
          <option value="Board/Leaflet">Board/Leaflet</option>
          <option value="Social Media">Social Media</option>
          <option value="Recommendation">Recommendation</option>
        </select>

        <select
          name="deviceType"
          value={formData.deviceType}
          onChange={handleChange}
          className="p-3 border rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        >
          <option value="">Select Device Type</option>
          <option value="Desktop">Desktop</option>
          <option value="Gaming Desktop">Gaming Desktop</option>
          <option value="Laptop">Laptop</option>
          <option value="Gaming Laptop">Gaming Laptop</option>
          <option value="All-in-one">All-in-one</option>
          <option value="Console">Console</option>
          <option value="Phone">Phone</option>
          <option value="Tablet">Tablet</option>
          <option value="Printer">Printer</option>
          <option value="USB">USB</option>
          <option value="HDD">HDD</option>
          <option value="SSD">SSD</option>
          <option value="Other">Other</option>
        </select>

        <select
          name="deviceBrand"
          value={formData.deviceBrand}
          onChange={handleChange}
          className="p-3 border rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        >
          <option value="" disabled>
            Select Device Brand
          </option>
          <option value="Acer">Acer</option>
          <option value="Advent">Advent</option>
          <option value="Alienware">Alienware</option>
          <option value="Apple">Apple</option>
          <option value="Asus">Asus</option>
          <option value="Corsair">Corsair</option>
          <option value="Crucial">Crucial</option>
          <option value="Dell">Dell</option>
          <option value="Google">Google</option>
          <option value="Hitachi">Hitachi</option>
          <option value="HP">HP</option>
          <option value="Intel">Intel</option>
          <option value="Kingston">Kingston</option>
          <option value="LaCie">LaCie</option>
          <option value="Lenovo">Lenovo</option>
          <option value="LG">LG</option>
          <option value="Maxtor">Maxtor</option>
          <option value="Medion">Medion</option>
          <option value="Microsoft">Microsoft</option>
          <option value="Motorola">Motorola</option>
          <option value="MSI">MSI</option>
          <option value="Nintendo">Nintendo</option>
          <option value="Oppo">Oppo</option>
          <option value="PNY">PNY</option>
          <option value="Patriot">Patriot</option>
          <option value="Razer">Razer</option>
          <option value="Samsung">Samsung</option>
          <option value="SanDisk">SanDisk</option>
          <option value="Seagate">Seagate</option>
          <option value="Sony">Sony</option>
          <option value="Toshiba">Toshiba</option>
          <option value="Western Digital">Western Digital</option>
          <option value="Xiaomi">Xiaomi</option>
          <option value="Other">Other</option>
        </select>

        {formData.deviceBrand === "Apple" && (
          <div className="flex flex-col space-y-1">
            <input
              name="appleId"
              type="email"
              value={formData.appleId}
              onChange={handleChange}
              placeholder="Apple ID (optional)"
              className="p-3 border rounded-lg w-full text-gray-800 placeholder-gray-400 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              autoComplete="off"
              inputMode="email"
            />
            <p className="text-sm text-gray-500">
              Optional. Your Apple ID helps with diagnostics (iCloud, Find My, etc.). Do not include your password here.
            </p>
          </div>
        )}

        <textarea
          name="issue"
          value={formData.issue}
          onChange={handleChange}
          placeholder="Describe the Issue"
          className="p-3 border rounded-lg w-full text-gray-800 h-24 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />

        <input
          name="password"
          type="text"
          value={formData.password}
          onChange={handleChange}
          placeholder="Device Password (Optional)"
          className="p-3 border rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <div className="flex flex-col items-start space-y-1">
          <div className="flex items-center space-x-2">
            <input
              name="dataSave"
              type="checkbox"
              checked={formData.dataSave === 1}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600"
            />
            <span className="text-gray-800">Save my data</span>
          </div>
          <p className="text-sm text-gray-600">
            Selecting this option means we will prioritize preserving your data during the repair process, ensuring that
            your files are not deleted. If you do not select this option, your device may be wiped to expedite repairs by
            starting with a clean slate. Only select this option if it is important to keep your existing files and data.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <input
            name="termsAccepted"
            type="checkbox"
            checked={formData.termsAccepted === 1}
            onChange={handleChange}
            className="h-5 w-5 text-blue-600"
            required
          />
          <span className="text-gray-800">
            I have read and agree to the{" "}
            <Link href="/terms" className="text-blue-600 underline">
              Terms and Conditions / Privacy Policy
            </Link>
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`p-3 rounded-lg w-full shadow-md transition-all ${
            loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              <span>Submitting...</span>
            </div>
          ) : (
            "Submit Request"
          )}
        </button>
      </form>
    </div>
  </div>
);

}