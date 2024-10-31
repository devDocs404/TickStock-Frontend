import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createStockSchema } from '@/schema';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  useCreateStockPost,
  useFetchTickersData,
} from '@/Queries/portfolio-queries';
import { StocksType } from '../portfolio-utils/types';
import { stockBrokers } from '@/lib/utils';
import { usePortfolioStore } from '@/Store/PortfolioStore';
import dayjs from 'dayjs';
import { Textarea } from '@/components/ui/textarea';
import FormSelectField from '@/components/ui/forms/form-select-field';
import FormInput from '@/components/ui/forms/form-input-field';
import FormFieldCalendar from '@/components/ui/forms/form-datepicker-field';

type OptionType = {
  label: string;
  value: string;
};

const StocksForm = ({
  editPayload,
  isStocksDialogOpen,
  setIsStocksDialogOpen,
}: {
  editPayload?: StocksType;
  isStocksDialogOpen: boolean;
  setIsStocksDialogOpen: (value: boolean) => void;
}) => {
  const [pending, setPending] = useState(false);
  const { mutate: createBasket } = useCreateStockPost();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { data: tickersData } = useFetchTickersData(searchTerm, '1', '10');
  const [options, setOptions] = useState<OptionType[]>([]);
  const { selectedBasketOption } = usePortfolioStore();
  const form = useForm({
    resolver: zodResolver(createStockSchema),
    defaultValues: {
      basketId: '',
      tickerId: editPayload?.tickerId || '',
      buyDate: dayjs(editPayload?.buyDate).toDate() || new Date(),
      buyPrice: editPayload?.buyPrice || '',
      quantity: editPayload?.quantity || '',
      investedAmount: editPayload?.investedAmount || '',
      brokerName: editPayload?.brokerName || '',

      notes: editPayload?.notes || '',
    },
    mode: 'onBlur',
  });
  const { handleSubmit, setValue, watch, reset } = form;
  // useEffect(() => {
  //   if (editPayload) {
  //     setValue("basketId", editPayload.basketId);
  //     setValue("tickerId", editPayload.tickerId);
  //     setValue("buyDate", dayjs(editPayload.buyDate));
  //     setValue("buyPrice", editPayload.buyPrice);
  //     setValue("quantity", editPayload.quantity);
  //     setValue("brokerName", editPayload.brokerName);
  //     setValue("investedAmount", editPayload.investedAmount);
  //     setValue("basketId", editPayload.basketId);
  //   }
  // }, [editPayload]);

  useEffect(() => {
    if (tickersData) {
      const result = tickersData.data.map(item => ({
        label: `${item.tickerName} (${item.symbolId})`,
        value: item.symbolId,
      }));
      setOptions(result);
    }
  }, [tickersData]);

  const buyPrice = watch('buyPrice');
  const quantity = watch('quantity');
  const investedAmount = watch('investedAmount');
  const buyDate = watch('buyDate');

  useEffect(() => {
    if (buyPrice && quantity) {
      setValue(
        'investedAmount',
        (Number(buyPrice) * Number(quantity)).toString(),
      );
    }
  }, [buyPrice, quantity, setValue]);

  const onSubmit = async (data: z.infer<typeof createStockSchema>) => {
    console.log(data, 'data');
    setPending(true);
    if (editPayload) {
      // updateBasket({
      //   data: { basketId: data.basketId },
      //   params: { id: editPayload.id },
      //   successTrigger: () => {
      //     setIsStocksDialogOpen(false);
      //     reset({ basketId: "" });
      //   },
      // });
    } else {
      createBasket({
        data: {
          tickerId: data.tickerId,
          basketId: selectedBasketOption.value,
          buyDate: dayjs(data.buyDate).format('YYYY-MM-DD'),
          buyPrice: data.buyPrice,
          quantity: data.quantity,
          brokerName: data.brokerName,
          investedAmount: investedAmount,
          sellDate: null,
          sellPrice: null,
          totalReturn: null,
          totalInvestedDays: null,
          tradeType: null,
          notes: data.notes,
          sellQuantity: null,
        },
        successTrigger: () => {
          setIsStocksDialogOpen(false);
          reset();
        },
      });
      console.log(
        {
          tickerId: data.tickerId,
          basketId: data.basketId,
          buyDate: dayjs(buyDate).format('YYYY-MM-DD'),
          buyPrice: data.buyPrice,
          quantity: data.quantity,
          brokerName: data.brokerName,
          investedAmount: investedAmount,
          sellDate: data.sellDate
            ? dayjs(data.sellDate).format('YYYY-MM-DD')
            : null,
          sellPrice: data.sellPrice || null,
          totalReturn: data.totalReturn || null,
          totalInvestedDays: data.totalInvestedDays || null,
        },
        'datadddddd',
      );
    }
    setPending(false);
  };

  return (
    <Dialog open={isStocksDialogOpen} onOpenChange={setIsStocksDialogOpen}>
      <DialogContent style={{ width: '95vw' }}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {editPayload ? 'Edit Stock' : 'Create Stock'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 max-h-[80vh] overflow-y-auto px-3 w-full"
          >
            <FormSelectField
              control={form.control}
              name="tickerId"
              label="Ticker Name"
              options={options}
              placeholder="Select a ticker"
              setSearchTerm={setSearchTerm}
            />
            <div className="flex gap-4">
              <FormInput
                name="buyPrice"
                control={form.control}
                label="Buy Price (₹)"
                placeholder="Enter buy price"
                type="number"
                convertToString
              />
              <FormInput
                name="quantity"
                control={form.control}
                label="Quantity"
                placeholder="Enter quantity"
                type="number"
                convertToString
              />
            </div>
            <FormInput
              name="investedAmount"
              control={form.control}
              label="Invested Amount"
              placeholder="Enter Invested Amount"
              type="number"
              disabled
            />
            <FormFieldCalendar
              name="buyDate"
              label="Buy Date"
              placeholder="Select buy date"
              control={form.control}
            />
            <FormSelectField
              control={form.control}
              name="brokerName"
              label="Broker Name"
              options={stockBrokers}
              placeholder="Select a broker"
              setSearchTerm={() => {}}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <div className="flex items-start rounded-md border p-1 flex-col">
              <CheckboxField
                className="p-0"
                labelClassName="text-base font-medium"
                control={form.control}
                name="sellDetails"
                label="Add selling details"
              />
              {watch("sellDetails") && (
                <div className="flex flex-col gap-2">
                  <FormFieldCalendar
                    name="sellDate"
                    label="Sell Date"
                    placeholder="Select sell date"
                    control={form.control}
                  />
                  <div className="flex gap-4">
                    <FormInput
                      name="sellPrice"
                      control={form.control}
                      label="Sell Price (₹)"
                      placeholder="Enter sell price"
                      type="number"
                    />
                    <FormInput
                      name="sellQuantity"
                      control={form.control}
                      label="Sell Quantity"
                      placeholder="Enter Sell Quantity"
                      type="number"
                    />
                  </div>
                  <FormInput
                    name="totalReturn"
                    control={form.control}
                    label="Total Return"
                    placeholder="Total Return"
                    type="number"
                    disabled
                  />
                </div>
              )}
            </div> */}

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={pending}
                className="text-white text-lg transition-colors duration-300 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-800"
              >
                {editPayload
                  ? pending
                    ? 'Updating...'
                    : 'Update'
                  : pending
                    ? 'Creating...'
                    : 'Create Stock'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default StocksForm;
