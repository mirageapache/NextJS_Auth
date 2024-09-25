import SignInForm from '@/components/form/SignInForm'

interface SignInPageProps {
  searchParams: {
    callbackUrl: string
  }
}

const SignInPage = ({
  searchParams: { callbackUrl }
}: SignInPageProps) => {
  // console.log(callbackUrl)
  return (
    <div className="w-full">
      <SignInForm callbackUrl={callbackUrl || "/"} />
    </div>
  )
}

export default SignInPage