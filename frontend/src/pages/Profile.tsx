// src/pages/Profile.tsx
import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/shared/Navbar";
import { motion } from "framer-motion";
import { ChevronDown, Camera } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { adminRenderContent } from "./AdminDashboard/AdminDashboard";
import { employeeRenderContent } from "./EmployeeDashboard/EmployeeDashboard";
import { hrRenderContent } from "./HRDashboard/HRDashboard";
import { trainerRenderContent } from "./TrainerDashboard/TrainerDashboard";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

export default function Profile() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [open, setOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    domain: "",
    designation: "",
    baseSalary: "",
    empid: "",
  });

  const [photo, setPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // ------------------- BACK BUTTON -------------------
  const goBackDashboard = () => {
    if (user?.role === "employee") navigate("/employee");
    else if (user?.role === "admin") navigate("/admin");
    else if (user?.role === "hr") navigate("/hr");
    else if (user?.role === "trainer") navigate("/trainer");
  };

  // ------------------- LOAD PROFILE -------------------
  const loadUser = async () => {
    if (!user?.id) return;

    try {
      const res = await api.get(`/user/${user.id}`);
      const data = res.data;

      setFormData({
        name: data.fullName || "",
        email: data.email || "",
        phone: data.phone || "",
        dob: data.dob || "",
        address1: data.address1 || "",
        address2: data.address2 || "",
        city: data.city || "",
        state: data.state || "",
        country: data.country || "",
        pincode: data.pincode || "",
        domain: data.domain || "",
        designation: data.designation || "",
        baseSalary: data.baseSalary || "",
        empid: data.empid || "",
      });

      if (data.photoUrl) {
        setPhoto(data.photoUrl);
        useAuthStore.getState().updateUser({ photoUrl: data.photoUrl });
      }
    } catch (err) {
      console.error("Failed to load profile", err);
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    loadUser();
  }, [user?.id]);

  // ------------------- UPLOAD PHOTO -------------------
  const uploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    const formData = new FormData();
    formData.append("file", file); // ✅ FIXED (was "photo")

    try {
      const res = await api.post(
        `/user/upload-photo/${user.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // ✅ Backend returns plain string URL
      const url = res.data;

      // Add cache busting
      const updatedUrl = `${url}?t=${new Date().getTime()}`;

      setPhoto(updatedUrl);
      useAuthStore.getState().updateUser({ photoUrl: updatedUrl });

      toast.success("Photo updated!");
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("Upload failed");
    }
  };

  // ------------------- SAVE PROFILE -------------------
  const handleSave = async () => {
    if (!user?.id) return;

    const payload = {
      ...formData,
      fullName: formData.name,
    };

    try {
      const res = await api.put(`/user/update-profile/${user.id}`, payload);

      if (res.status === 200) {
        toast.success("Profile updated!");
        setIsEditing(false);
        loadUser();
      } else {
        toast.error("Failed to update");
      }
    } catch (err) {
      console.error("Failed to update profile", err);
      toast.error("Failed to update");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ------------------- RENDER -------------------
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <button
        onClick={goBackDashboard}
        className="fixed top-24 left-6 bg-gradient-to-r from-[#7A1CAC] to-[#AD49E1] text-white px-5 py-2 rounded-full shadow-lg"
      >
        ← Back to Dashboard
      </button>

      <div className="max-w-5xl mx-auto mt-6">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LEFT CARD */}
          <div className="col-span-1 bg-white rounded-3xl p-8 shadow-lg flex flex-col items-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <img
                src={
                  photo ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`
                }
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-[#AD49E1]"
              />

              <button
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-2 right-2 p-2 bg-purple-600 text-white rounded-full"
              >
                <Camera size={18} />
              </button>

              <input
                ref={fileRef}
                type="file"
                hidden
                accept="image/*"
                onChange={uploadPhoto}
              />
            </div>

            <h2 className="text-xl font-bold">{formData.name}</h2>
            <p>{formData.email}</p>
          </div>

          {/* RIGHT CARD */}
          <div className="col-span-2 bg-white rounded-3xl p-8 shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Object.entries(formData)
                .filter(
                  ([key]) =>
                    !["domain", "designation", "baseSalary", "empid"].includes(
                      key
                    )
                )
                .map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm mb-1 capitalize">
                      {key}
                    </label>

                    <input
                      name={key}
                      value={value}
                      disabled={key === "email" ? true : !isEditing}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                ))}
            </div>

            <div className="flex justify-end gap-4 mt-6">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg"
                >
                  Edit
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg"
                  >
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
