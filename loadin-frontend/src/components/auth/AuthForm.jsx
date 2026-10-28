import { useState } from "react";
import { Link , useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { User, Mail, Phone, AtSign } from "lucide-react";
import toast from "react-hot-toast";

import {
    registerCustomer,
    registerDriver,
} from "../../services/authService";

import InputField from "./InputField";
import PasswordField from "./PasswordField";
import Button from "../ui/Button";


// Temporary API (we'll replace this later)


export default function AuthForm({
  role,
  title = "Create Account",
  loginLink,
}) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      password: "",
      confirm_password: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data) => {

    console.log("Form Submitted");
    console.log(data);

    setLoading(true);

    try {

        let response;

        if (role === "CUSTOMER") {

            response = await registerCustomer(data);

        } else {

            response = await registerDriver(data);

        }

        toast.success("Registration Successful!");

        reset();

        if (role === "DRIVER") {

            navigate("/driver/login");

        } else {

            navigate("/customer/login");

        }

} catch (error) {

    console.error(error);

    toast.error(
        error.response?.data?.detail ||
        "Registration Failed"
    );

} finally {

    setLoading(false);

}
};
    return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >

      {/* ================= Full Name ================= */}

      <InputField
        label="First Name"
        name="first_name"
        placeholder="Enter your first name"
        icon={<User size={18} />}
        register={register}
        required
        error={errors.first_name}
        disabled={loading}
      />

      {/* ================= Username ================= */}

      <InputField
        label="last_name"
        name="last_name"
        placeholder="Enter your last name"
        icon={<User size={18} />}
        register={register}
        required
        error={errors.last_name}
        disabled={loading}
      />

      {/* ================= Email ================= */}

      <InputField
        label="Email Address"
        name="email"
        type="email"
        placeholder="Enter your email"
        icon={<Mail size={18} />}
        register={register}
        required
        error={errors.email}
        disabled={loading}
      />

      {/* ================= Phone ================= */}

      <InputField
        label="Phone Number"
        name="phone_number"
        type="tel"
        placeholder="Enter your mobile number"
        icon={<Phone size={18} />}
        register={register}
        required
        error={errors.phone_number}
        disabled={loading}
      />

      {/* ================= Password ================= */}

      <PasswordField
        label="Password"
        name="password"
        placeholder="Create a password"
        register={register}
        required
        error={errors.password}
        disabled={loading}
      />

      {/* ================= Confirm Password ================= */}

      <PasswordField
        label="Confirm Password"
        name="confirm_password"
        placeholder="Confirm your password"
        register={register}
        required
        error={errors.confirm_password}
        disabled={loading}
      />
            {/* ================= Submit Button ================= */}

      <Button
        type="submit"
        fullWidth
        loading={loading}
        variant="primary"
      >
        {loading ? "Creating Account..." : title}
      </Button>

      {/* Divider */}

      <div className="relative">

        <div className="absolute inset-0 flex items-center">

          <div className="w-full border-t border-slate-200" />

        </div>

        <div className="relative flex justify-center">

          <span className="bg-white px-4 text-sm text-slate-500">

            OR

          </span>

        </div>

      </div>

      {/* Login Link */}

      <p className="text-center text-slate-600">

        Already have an account?

        <Link
          to={loginLink}
          className="
          ml-2
          font-semibold
          text-blue-600
          hover:text-blue-700
          transition
          "
        >

          Login

        </Link>

      </p>

    </form>
  );
}