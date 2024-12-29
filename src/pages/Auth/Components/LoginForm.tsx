import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { useEffect, useState } from 'react'

import { useAuthStore } from '@/Store/AuthStore'
import { useAuthLoginCreate } from '@/api/hooks/useAuthLoginCreate'
import { ModeToggle } from '@/components/Global/ModeToggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { AnimatedText } from './AnimatedText'
import { ForgetPassword } from './ForgetPassword'

const LoginForm = ({
  onToggle,
  setLoadingState,
}: {
  onToggle: () => void
  setLoadingState: (state: boolean) => void
  setIsDark: (state: boolean) => void
  isDark: boolean
}) => {
  // State to store form data and errors
  const [data, setData] = useState({ email: '', password: '' })
  const { setField } = useAuthStore()
  const navigate = useNavigate()
  const { mutate: loginMutate, isPending } = useAuthLoginCreate({
    onSuccess: response => {
      toast.success(`Login successful.`)
      setField('user', response.userInfo)
      setField('refreshToken', response.authorization.refreshToken)
      setField('accessToken', response.authorization.accessToken)
      navigate('/')
    },
  })

  const [passwordType, setPasswordType] = useState('password')
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    })
  }

  const schema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(1, { message: 'Password is mandatory' }),
  })

  // Form submission handler
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = schema.safeParse({
      email: data.email,
      password: data.password,
    })
    if (!result.success) {
      toast.error(result.error.errors.map(error => error.message).join(', '))
    } else {
      console.log('Form submitted:', data)
      // mutate(data)
      loginMutate({ data: data })
    }
  }
  useEffect(() => {
    setLoadingState(isPending)
  }, [isPending, setLoadingState])

  return (
    <>
      {/* {isPending && } */}

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
        className="space-y-4 w-full"
      >
        <AnimatedText>
          <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
          <p className="mb-6">Log in to access your portfolio</p>
        </AnimatedText>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatedText delay={0.1}>
            <Input
              type="text"
              name="email"
              placeholder="Email"
              value={data.email}
              onChange={handleChange}
              className="h-12"
            />
          </AnimatedText>

          <AnimatedText delay={0.2}>
            <div className="relative">
              <Input
                type={passwordType}
                name="password"
                placeholder="Password"
                value={data.password}
                onChange={handleChange}
                className="h-12"
              />
              {passwordType === 'password' ? (
                <Button
                  variant="ghost"
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setPasswordType('text')}
                >
                  <EyeOff />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setPasswordType('password')}
                >
                  <Eye />
                </Button>
              )}
            </div>
          </AnimatedText>

          <AnimatedText delay={0.3}>
            <Button
              type="submit"
              className="h-12 text-xl w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors duration-300 transform hover:scale-[1.01]"
              disabled={isPending}
            >
              Log in
            </Button>
          </AnimatedText>
        </form>
        <ForgetPassword />

        <AnimatedText delay={0.4}>
          <p className="text-center text-sm">
            Don't have an account?{' '}
            <button
              onClick={onToggle}
              className="text-blue-600 hover:underline font-medium"
            >
              Sign up here
            </button>
          </p>
        </AnimatedText>
      </motion.div>
      <div className="absolute bottom-1 left-1">
        <ModeToggle />
      </div>
    </>
  )
}
export default LoginForm
