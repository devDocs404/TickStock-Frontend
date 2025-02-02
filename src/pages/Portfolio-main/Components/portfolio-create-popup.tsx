import { zodResolver } from '@hookform/resolvers/zod'
import { BadgeIndianRupee, IdCard, NotepadText, TrendingUp } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { useCallback, useState } from 'react'

import {
  useCreatePortfolioPost,
  useUpdatePortfolioPatch,
} from '@/Queries/portfolio-queries'
// UI Components
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import FormInput from '@/components/ui/forms/form-input-field'
import { Textarea } from '@/components/ui/textarea'
import { createPortfolioSchema } from '@/schema'

type FormValues = z.infer<typeof createPortfolioSchema>

interface PortfolioFormProps {
  editPayload?: {
    id: string
    name: string
    riskLevel: number
    strategy: number
    description: string
  }
  isPortfolioDialogOpen: boolean
  setIsPortfolioDialogOpen: (value: boolean) => void
}

export function PortfolioCreatePopup({
  editPayload,
  isPortfolioDialogOpen,
  setIsPortfolioDialogOpen,
}: PortfolioFormProps) {
  const [pending, setPending] = useState(false)

  const { mutate: createPortfolio } = useCreatePortfolioPost()
  const { mutate: updatePortfolio } = useUpdatePortfolioPatch()

  const form = useForm<FormValues>({
    resolver: zodResolver(createPortfolioSchema),
    defaultValues: {
      name: editPayload?.name || '',
      riskLevel: editPayload?.riskLevel?.toString() || '',
      strategy: editPayload?.strategy?.toString() || '',
      description: editPayload?.description || '',
      type: 'custom',
    },
    mode: 'onBlur',
  })

  const { reset, control, handleSubmit } = form

  const handleClose = useCallback(() => {
    setIsPortfolioDialogOpen(false)
    reset()
  }, [setIsPortfolioDialogOpen, reset])

  const handleCreatePortfolio = useCallback(
    (data: FormValues) => {
      createPortfolio({
        data: {
          name: data.name,
          riskLevel: data.riskLevel ? Number(data.riskLevel) : null,
          strategy: data.strategy ? Number(data.strategy) : null,
          description: data.description || null,
          type: 'custom',
        },
        successTrigger: handleClose,
      })
    },
    [createPortfolio, handleClose],
  )

  const handleUpdatePortfolio = useCallback(
    (data: FormValues) => {
      if (!editPayload?.id) return
      updatePortfolio({
        data: {
          name: data.name,
          riskLevel: data.riskLevel ? Number(data.riskLevel) : null,
          strategy: data.strategy ? Number(data.strategy) : null,
          description: data.description || null,
          type: 'custom',
        },
        params: { id: editPayload.id },
        successTrigger: handleClose,
      })
    },
    [updatePortfolio, handleClose, editPayload?.id],
  )

  const onSubmit = useCallback(
    async (data: FormValues) => {
      try {
        setPending(true)
        if (editPayload) {
          handleUpdatePortfolio(data)
        } else {
          handleCreatePortfolio(data)
        }
      } catch (error) {
        console.error('Form submission error:', error)
        toast.error('Failed to submit form')
      } finally {
        setPending(false)
      }
    },
    [editPayload, handleCreatePortfolio, handleUpdatePortfolio],
  )

  const renderFormFields = () => (
    <>
      <FormInput
        name="name"
        control={control}
        label="Name"
        placeholder="Enter the name of the portfolio"
        type="text"
        required
        icon={
          <IdCard className="absolute left-2 top-[25%] h-6 w-5 text-muted-foreground" />
        }
      />
      <FormInput
        name="riskLevel"
        control={control}
        label="Risk Level"
        placeholder="0 - 5"
        type="number"
        icon={
          <BadgeIndianRupee className="absolute left-2 top-[25%] h-6 w-5 text-muted-foreground" />
        }
      />
      <FormInput
        name="strategy"
        control={control}
        label="Strategy"
        placeholder="Enter the strategy"
        type="text"
        icon={
          <TrendingUp className="absolute left-2 top-[25%] h-6 w-5 text-muted-foreground" />
        }
      />
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <div className="relative">
                <Textarea
                  {...field}
                  value={field.value || ''}
                  placeholder="Add any additional description"
                  className="h-44 pl-8"
                />
                <NotepadText className="absolute top-2.5 left-2.5 h-4 w-4 text-gray-400" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )

  return (
    <Dialog
      open={isPortfolioDialogOpen}
      onOpenChange={setIsPortfolioDialogOpen}
    >
      <DialogContent className="w-[95vw] ">
        <DialogHeader className="space-y-1 flex flex-row items-start justify-center gap-5 bg-blue-600 p-4 rounded-lg">
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center justify-center h-5/6 w-full bg-slate-300 rounded-full p-4 ">
              <TrendingUp
                size={30}
                strokeWidth={4}
                absoluteStrokeWidth
                className="text-green-600"
              />
            </div>
          </div>
          <div className="flex justify-center flex-col space-x-2">
            <DialogTitle className="text-2xl">Create Portfolio</DialogTitle>
            <p className="m-0 text-sm text-gray-300">
              {editPayload
                ? 'Edit portfolio details'
                : 'Enter the details to create a new portfolio.'}
            </p>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 max-h-[80vh] overflow-y-auto w-full p-2"
          >
            {renderFormFields()}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                onClick={handleClose}
                className="text-white text-lg transition-colors duration-300 bg-red-600 hover:bg-red-700 dark:hover:bg-red-800 w-full"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={pending}
                className="text-white text-lg transition-colors duration-300 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-800 w-full"
              >
                {editPayload
                  ? pending
                    ? 'Updating...'
                    : 'Update'
                  : pending
                    ? 'Creating...'
                    : 'Create Portfolio'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default PortfolioCreatePopup
