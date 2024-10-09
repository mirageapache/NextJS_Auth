"use server";
import { getServerSession } from "next-auth/next";
import { nextauthOptions } from "@/lib/nextauthOptions";
import { Account, Profile } from "next-auth";
import bcrypt from "bcrypt";
import connectDB from "@/lib/mongoDB";
import User from "@/lib/models/userModal";
import { redirect } from "next/navigation";

/** 取得User Session */
export async function getUserSession() {
  const session = await getServerSession(nextauthOptions);
  return { session };
}

/** 註冊參數型別 */
export interface SignUpWithCredentialsParams {
  name: string;
  email: string;
  password: string;
}

/** 註冊 */
export async function signUpWithCredentials({
  name,
  email,
  password,
}: SignUpWithCredentialsParams) {
  await connectDB();

  try {
    const user = await User.findOne({ email });

    if (user) return { code: "USER_EXIST", message: "User already exists." };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 將 Mongoose 模型轉換為普通對象
    // const userObject = newUser.toObject();
    // console.log(userObject);

    return { success: true };
  } catch (error) {
    // return { error: error };
    redirect(`/error?error=${(error as Error).message}`);
  }
}

/** 登入參數型別 */
interface SignInWithCredentialsParams {
  email: string;
  password: string;
}

/** 登入 */
export async function signInWithCredentials({
  email,
  password,
}: SignInWithCredentialsParams) {
  await connectDB();

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password!");
  }

  const passwordIsValid = await bcrypt.compare(password, user.password);

  if (!passwordIsValid) {
    throw new Error("Invalid email or password");
  }

  return { ...user._doc, _id: user._id.toString() };
}

interface ExtendedProfile extends Profile {
  picture?: string;
}

/** OAuth登入參數型別 */
interface SignInWithOauthParams {
  account: Account;
  profile: ExtendedProfile;
}

/** OAuth登入 */
export async function signInWithOauth({
  account,
  profile,
}: SignInWithOauthParams) {
  await connectDB();
  try {
    const user = await User.findOne({ email: profile.email });
    if (user) return true;

    await User.create({
      name: profile.name,
      email: profile.email,
      image: profile.picture,
      provider: account.provider,
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

interface GetUserByEmailParams {
  email: string;
}
/** 取得User資料 */
export async function getUserByEmail({ email }: GetUserByEmailParams) {
  connectDB();

  const user = await User.findOne({ email }).select("-password");

  if (!user) {
    throw new Error("User does not exist!");
  }

  // console.log({user})
  return { ...user._doc, _id: user._id.toString() };
}

export interface UpdateUserProfileParams {
  name: string
}

/** 更新使用者資料 */
export async function updateUserProfile({
  name
}: UpdateUserProfileParams) {
  const session = await getServerSession(nextauthOptions)
  // console.log(session)

  connectDB()

  try {
    if (!session) {
      throw new Error("Unauthorization!")
    }

    const user = await User.findByIdAndUpdate(session?.user?._id, {
      name
    }, { new: true }).select("-password")

    if (!user) {
      throw new Error ("User does not exist!")
    }

    return { success: true }
  } catch (error) {
    redirect(`/error?error=${(error as Error).message}`)
  }
}

export interface ChangeUserPasswordParams {
  oldPassword: string,
  newPassword: string
}

/** 變更密碼 */
export async function changeUserPassword ({
  oldPassword,
  newPassword
}: ChangeUserPasswordParams) {
  "use server"
  const session = await getServerSession(nextauthOptions)
  // console.log(session)

  connectDB()

  try {
    if (!session) {
      throw new Error("Unauthorization!")
    }

    if (session.user.provider !== "credentials") {
      throw new Error(`Signed in via ${session?.user?.provider}. Changes not allowed with this method.`)
    }

    const user = await User.findById(session.user._id)

    if (!user) {
      throw new Error("User does not exist!")
    }

    const passwordIsValid = await bcrypt.compare(
      oldPassword,
      user.password
    )

    if (!passwordIsValid) {
      throw new Error("Incorrect old password.")
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword
    })

    return { success: true }
  } catch (error) {
    redirect(`/error?error=${(error as Error).message}`)
  }
}