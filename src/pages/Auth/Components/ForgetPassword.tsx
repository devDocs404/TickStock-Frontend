import { toast } from 'sonner'
import { z } from 'zod'

import { useState } from 'react'

import { useForgetPasswordPost } from '@/Queries/AuthQueries'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email address.Please try again.' }),
})

export function ForgetPassword() {
  const { mutate } = useForgetPasswordPost()
  const [data, setData] = useState({
    email: '',
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.id]: e.target.value })
  }

  const successTrigger = () => {
    setData({ email: '' })
    setIsDialogOpen(false)
  }

  const handleSubmitForgetPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = schema.safeParse({
      email: data.email,
    })

    if (!result.success) {
      toast.error(result.error.errors.map(error => error.message).join(', '))
    } else {
      mutate({ data: { email: data.email }, successTrigger })
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="p-0 text-blue-600 hover:underline w-full flex justify-end mt-0"
        >
          Forgot your password?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-blue-600 text-2xl font-bold">
            Forgot Password
          </DialogTitle>
          <DialogDescription>
            Enter your email to reset your password.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmitForgetPassword}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-lg">
              Email
            </Label>
            <Input
              id="email"
              value={data.email}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>

          <DialogFooter className="mt-5">
            <Button
              type="submit"
              variant="outline"
              className="bg-blue-600 text-white"
            >
              Send Email
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
