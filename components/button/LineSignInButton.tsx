import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface LineSignInButtonProps {
  children: React.ReactNode;
  callbackUrl: string;
}
const LineSignInButton = ({ children, callbackUrl }: LineSignInButtonProps) => {
  const loginWithLine = async () => {
    await signIn("line", { callbackUrl });
  };

  return (
    <Button onClick={loginWithLine} className="w-full">
      {children}
    </Button>
  );
};

export default LineSignInButton;
