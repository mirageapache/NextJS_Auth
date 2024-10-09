import UpdateForm from "@/components/form/UpdateForm"
import { updateUserProfile } from "@/lib/actions/authAction"

const ProfilePage = async () => {
  return (
    <div className="w-full">
      <UpdateForm updateUserProfile={updateUserProfile} />
    </div>
  )
}


export default ProfilePage