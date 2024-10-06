"use server";
import { getServerSession } from "next-auth/next";
import { nextauthOptions } from "@/lib/nextauthOptions";
// import { Account, Profile } from "next-auth"
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
