/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useForm } from "react-hook-form"
import { useFormStatus } from 'react-dom'
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useSession } from "next-auth/react"
import { userUpdateValidation } from "@/lib/validations/auth"
import { UpdateUserProfileParams } from "@/lib/actions/authAction"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import UserAvatar from "@/components/shared/UserAvatar"
import { useToast } from "@/hooks/useToast"

interface UpdateFormProps {
  updateUserProfile: (values: UpdateUserProfileParams) => Promise<{success?: boolean}>
}

const UpdateForm = ({
  updateUserProfile
}: UpdateFormProps) => {
  const { data: session, update } = useSession()
  const { pending } = useFormStatus()
  const { toast } = useToast();

  const form = useForm<z.infer<typeof userUpdateValidation>>({
    resolver: zodResolver(userUpdateValidation),
    defaultValues: {
      name: "",
    }
  })

  async function onSubmit(values: z.infer<typeof userUpdateValidation>) {
    update({name: values.name})
    const res = await updateUserProfile(values)
    
    if (res?.success) {
      toast({
        description: "Update successfully."
      })
    }
  }

  return (
    <Form {...form}>
      <UserAvatar />
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="your username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          className="w-full mt-6"
          type="submit"
          disabled={pending}
        >
          {pending ? "Submitting..." : "Update"}
        </Button>
      </form>
    </Form>
  )
}

export default UpdateForm