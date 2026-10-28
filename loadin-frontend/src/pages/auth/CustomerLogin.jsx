import AuthLayout from "../../components/auth/AuthLayout";
import LoginForm from "../../components/auth/LoginForm";

export default function CustomerLogin() {
  return (
    <AuthLayout
      title="Customer Login"
      subtitle="Welcome back! Sign in to book and manage your shipments."
    >
      <LoginForm
        role="CUSTOMER"
        title="Login as Customer"
        registerLink="/customer/register"
      />
    </AuthLayout>
  );
}