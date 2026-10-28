import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";

import InputField from "./InputField";
import PasswordField from "./PasswordField";
import Button from "../ui/Button";

import { loginUser } from "../../services/authService";

export default function LoginForm({
  role,
  title = "Login",
  registerLink,
}) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");

    try {
      const response = await loginUser(data, role);

      // Save JWT Tokens
      localStorage.setItem("access", response.access);
      localStorage.setItem("refresh", response.refresh);

      // Save User Info
      localStorage.setItem(
        "user",
        JSON.stringify(response.user)
      );

      toast.success("Login Successful!");
            // Check Role

      if (response.user.role !== role) {

    toast.error(
        `This account is registered as ${response.user.role}.`
    );

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    return;
}

      // Navigate to Dashboard

      if (role === "DRIVER") {

        navigate("/driver/dashboard");

      } else {

        navigate("/customer/dashboard");

      }

    } catch (error) {

    console.error(error);

    const message =
        error.response?.data?.detail ||
        error.response?.data?.non_field_errors?.[0] ||
        "Invalid email or password.";

    setServerError(message);

    toast.error(message);

}finally {

      setLoading(false);

    }

  };

  return (

    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >

      {/* Email */}

      <InputField
        label="Email Address"
        name="email"
        type="email"
        placeholder="Enter your email"
        register={register}
        required
        icon={<Mail size={18} />}
        error={errors.email}
        rules={{
          required: "Email is required",

          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Enter a valid email",
          },
        }}
      />

      {/* Password */}

      <PasswordField
        label="Password"
        name="password"
        register={register}
        required
        error={errors.password}
        rules={{
          required: "Password is required",
        }}
      />
            {/* Remember Me & Forgot Password */}

      <div className="flex items-center justify-between">

        <label className="flex items-center gap-2 text-sm text-slate-600">

          <input
            type="checkbox"
            className="
              h-4
              w-4
              rounded
              border-slate-300
              text-blue-600
              focus:ring-blue-500
            "
          />

          Remember Me

        </label>

        <Link
          to="/forgot-password"
          className="
            text-sm
            font-medium
            text-blue-600
            hover:text-blue-700
            transition
          "
        >

          Forgot Password?

        </Link>

      </div>

      {/* Login Button */}
      {serverError && (

    <div>

        <p className="text-sm font-medium text-red-600">

            {serverError}

        </p>

    </div>

)}

      <Button
        type="submit"
        fullWidth
        loading={loading}
        variant="primary"
      >

        {loading ? "Signing In..." : title}

      </Button>

      {/* Divider */}

      <div className="relative">

        <div className="absolute inset-0 flex items-center">

          <div className="w-full border-t border-slate-200"></div>

        </div>

        <div className="relative flex justify-center">

          <span className="bg-white px-4 text-sm text-slate-500">

            OR

          </span>

        </div>

      </div>

      {/* Register */}

      <p className="text-center text-slate-600">

        Don't have an account?

        <Link
          to={registerLink}
          className="
            ml-2
            font-semibold
            text-blue-600
            hover:text-blue-700
            transition
          "
        >

          Register

        </Link>

      </p>

    </form>

  );

}