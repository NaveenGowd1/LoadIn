import AuthLayout from "../../components/auth/AuthLayout";
import AuthForm from "../../components/auth/AuthForm";

export default function DriverRegister() {
  return (
    <AuthLayout
      title="Become a Driver"
      subtitle="Create your driver account to start earning with LoadIn."
    >
      <AuthForm
        role="DRIVER"
        title="Create Driver Account"
        loginLink="/driver/login"
      />
    </AuthLayout>
  );
}