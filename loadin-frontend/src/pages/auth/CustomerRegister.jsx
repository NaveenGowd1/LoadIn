import AuthLayout from "../../components/auth/AuthLayout";
import AuthForm from "../../components/auth/AuthForm";

export default function CustomerRegister() {
  return (
    <AuthLayout
      title="Need Transportation?"
      subtitle="Create your customer account to book trucks instantly."
    >
      <AuthForm
        role="CUSTOMER"
        title="Create Customer Account"
        loginLink="/customer/login"
      />
    </AuthLayout>
  );
}