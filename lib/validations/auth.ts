import * as z from "zod"

/** 登入驗證 */
export const userSignInValidation = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z.string()
    .min(1, "Password is required")
    .min(8, "Password must be 8+ characters"),
});

/** 註冊驗證 */
export const userSignUpValidation = z.object({
  name: z.string()
    .min(1, "Username is required")
    .max(50, "Username must be less than 50 characters"),
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z.string()
    .min(1, "Password is required")
    .min(8, "Password must be 8+ characters"),
  confirmPassword: z.string()
    .min(1, "Password confirmation is required"),
})
.refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Password do not match",
});

/** 更新使用者資料 */
export const userUpdateValidation = z.object({
  name: z.string()
    .min(1, "Username is required")
    .max(50, "Username must be less than 50 characters"),
})

/** 變更密碼驗證 */
export const changePasswordValidation = z.object({
  oldPassword: z.string()
    .min(1, "Old password is required")
    .min(8, "Password must be 8+ characters"),
  newPassword: z.string()
    .min(1, "New password is required")
    .min(8, "Password must be 8+ characters"),
  confirmPassword: z.string()
    .min(1, "Password confirmation is required"),
})
.refine((data) => data.oldPassword !== data.newPassword, {
  path: ["newPassword"],
  message: "New password must differ from old",
})
.refine((data) => data.newPassword === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Password do not match",
});
