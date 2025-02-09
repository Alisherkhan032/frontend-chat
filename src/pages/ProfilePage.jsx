import { useState } from "react";
import { Camera, Mail, User } from "lucide-react";
import { setAuthUser, selectAuthUser } from "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { DEFAULT_PROFILE_PICTURE } from "../lib/utils";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const authUser = useSelector(selectAuthUser);
  const [selectedImg, setSelectedImg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Add client-side validations
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    const MAX_SIZE = 990 * 1024; // 990KB
    if (file.size > MAX_SIZE) {
      toast.error("Choose a file smaller than 1MB ");
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image); // For preview image

      try {
        setLoading(true);
        const res = await axiosInstance.put("/auth/update-profile", {
          profilePic: base64Image,
        });

        dispatch(setAuthUser(res.data));
        toast.success("Profile Updated Successfully");
      } catch (error) {
        setSelectedImg(null);
        if (error.response?.status === 413) {
          toast.error("File size too large. Please choose a smaller image.");
        } else if (error.response?.status === 400) {
          toast.error(error.response?.data?.message || "Invalid image format");
        } else {
          toast.error("Error uploading image");
          console.error("Upload error:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      toast.error("Error reading file");
      setLoading(false);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${loading ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={loading}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {loading
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.fullName}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.email}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
