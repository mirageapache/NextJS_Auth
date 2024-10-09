import ChangePasswordForm from "@/components/form/ChangePasswordForm"
import { changeUserPassword } from "@/lib/actions/authAction"

const ChangePasswordPage = async () => {
  return (
    <div className="w-full">
      <ChangePasswordForm changeUserPassword={changeUserPassword} />
    </div>
  )
}


export default ChangePasswordPage