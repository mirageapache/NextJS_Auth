import SignUpForm from "@/components/form/SignUpForm"

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
      <SignUpForm callbackUrl={callbackUrl || "/"} />
    </div>
  )
}

export default SignUpPage