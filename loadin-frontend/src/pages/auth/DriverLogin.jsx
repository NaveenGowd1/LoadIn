import AuthLayout from "../../components/auth/AuthLayout";
import LoginForm from "../../components/auth/LoginForm";

export default function DriverLogin() {
  return (
    <AuthLayout
      title="Driver Login"
      subtitle="Welcome back! Sign in to manage your loads and trips."
    >
      <LoginForm
        role="DRIVER"
        title="Login as Driver"
        registerLink="/driver/register"
      />
    </AuthLayout>
  );
}