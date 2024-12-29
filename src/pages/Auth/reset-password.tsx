import { CheckCircle2, Eye, EyeOff } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Toaster, toast } from 'sonner'
import { z } from 'zod'

import { useEffect, useState } from 'react'

// import { useResetPasswordPatch } from '@/Queries/AuthQueries'
import { useAuthStore } from '@/Store/AuthStore'
import { useGlobalStore } from '@/Store/GlobalSore'
import { useAuthPasswordResetUpdate } from '@/api'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function StockPasswordReset() {
  const [isSuccess, setIsSuccess] = useState(false)
  const { id } = useParams()
  const [data, setData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  })
  const navigate = useNavigate()
  const { toggleTheme } = useGlobalStore()
  const { setField } = useAuthStore()
  // const { mutate: resetPassword } = useResetPasswordPatch()
  const { mutate } = useAuthPasswordResetUpdate({
    onSuccess: () => {
      setIsSuccess(true)
      toast.success(`Password reset successfully.`)
    },
  })

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/

  const payloadSchema = z
    .object({
      password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters long' })
        .regex(passwordRegex, {
          message:
            'Password must contain at least 1 uppercase letter, 1 number, and 1 special character',
        }),
      confirmPassword: z.string(),
    })
    .refine(data => data.password === data.confirmPassword, {
      message: 'Passwords must match',
      path: ['confirmPassword'], // Error will be shown for confirmPassword
    })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Assuming you have data state with both password and confirmPassword
    const result = payloadSchema.safeParse({
      password: data.password,
      confirmPassword: data.confirmPassword, // Include confirmPassword in validation
    })

    if (!result.success) {
      // Display validation error messages in toast
      console.log(
        result.error.errors.map(error => error.message).join(', '),
        'result.error',
      )
      toast.error(result.error.errors.map(error => error.message).join(', '))
    } else {
      // Reset password logic after successful validation
      // resetPassword({
      //   data: { password: data.password },
      //   params: { id: id || '' }, // Make sure 'id' is passed as needed
      //   successTrigger: () => {
      //     setIsSuccess(true) // Assuming setIsSuccess updates the state
      //   },
      // })
      mutate({
        data: { data: { password: data.password } },
        params: { id: id || '' },
      })
    }
  }

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword({ ...showPassword, password: !showPassword.password })
    } else {
      setShowPassword({
        ...showPassword,
        confirmPassword: !showPassword.confirmPassword,
      })
    }
  }
  useEffect(() => {
    console.log(toggleTheme, 'toggleTheme')
  }, [toggleTheme])

  return (
    <>
      <Toaster richColors />
      <div
        className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-br ${
          toggleTheme === 'dark'
            ? 'from-blue-950 to-black'
            : // : "from-blue-50 to-blue-100"
              ''
        } p-4`}
      >
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <span className="text-blue-600 text-6xl">Stock</span>
            <span className="text-6xl ">Folio</span>
          </div>

          <Card className="w-full backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-blue-200 dark:border-blue-900">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-center text-blue-800 dark:text-blue-300">
                {isSuccess ? 'Reset Successful' : 'Reset Your Password'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isSuccess ? (
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <CheckCircle2 className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-lg text-blue-800 dark:text-blue-300">
                    Your password has been successfully reset.
                  </p>
                  <p className="text-blue-600 dark:text-blue-400">
                    You can now log in with your new credentials.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-blue-800 dark:text-blue-300"
                    >
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={data.password}
                        onChange={e =>
                          setData({ ...data, password: e.target.value })
                        }
                        className="pr-10 border-blue-300 focus:border-blue-500 focus:ring-blue-500 dark:border-blue-700 dark:focus:border-blue-600 dark:focus:ring-blue-600"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('password')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 dark:text-blue-500"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirm-password"
                      className="text-blue-800 dark:text-blue-300"
                    >
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={
                          showPassword.confirmPassword ? 'text' : 'password'
                        }
                        value={data.confirmPassword}
                        onChange={e =>
                          setData({ ...data, confirmPassword: e.target.value })
                        }
                        required
                        className="pr-10 border-blue-300 focus:border-blue-500 focus:ring-blue-500 dark:border-blue-700 dark:focus:border-blue-600 dark:focus:ring-blue-600"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          togglePasswordVisibility('confirmPassword')
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 dark:text-blue-500"
                      >
                        {showPassword.confirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Please choose a strong password that includes uppercase and
                    lowercase letters, numbers, and special characters.
                  </p>
                </form>
              )}
            </CardContent>
            <CardFooter>
              {isSuccess ? (
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-300"
                  onClick={() => {
                    navigate('/login')
                    setField('user', [])
                    setField('refreshToken', '')
                    setField('accessToken', '')
                  }}
                >
                  Return to Login
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-300"
                  onClick={handleSubmit}
                >
                  Reset Password
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* <div className="mt-6 text-center text-blue-800 dark:text-blue-300">
          <p>
            Need help? Contact our{" "}
            <a
              href="#"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              support team
            </a>
          </p>
        </div> */}
        </div>

        {/* Background Pattern */}
        <div className="fixed inset-0 z-[-1] opacity-20">
          <svg
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
          >
            <path
              d="M0 100 L20 80 L40 95 L60 70 L80 85 L100 60"
              stroke="currentColor"
              className="text-blue-600 dark:text-blue-400"
              strokeWidth="0.5"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>
    </>
  )
}
