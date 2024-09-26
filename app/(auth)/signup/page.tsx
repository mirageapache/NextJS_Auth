import SignUpForm from "@/components/form/SignUpForm"
import { signUpWithCredentials } from "@/lib/actions/authAction"

interface SignUpPageProps {
  searchParams: {
    callbackUrl: string
  }
}

const SignUpPage = ({
  searchParams: { callbackUrl }
}: SignUpPageProps) => {
  // console.log(callbackUrl)
  return (
    <div className="w-full">
      <SignUpForm
        callbackUrl={callbackUrl || "/"}
        signUpWithCredentials={signUpWithCredentials}
      />
    </div>
  )
}

export default SignUpPage