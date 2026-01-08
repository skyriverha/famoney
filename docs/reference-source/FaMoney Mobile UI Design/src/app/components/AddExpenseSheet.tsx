import { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { toast } from 'sonner';
import type { Expense, Category } from '../App';

interface AddExpenseSheetProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Expense, 'id' | 'createdBy' | 'createdByName' | 'createdByAvatar'>) => void;
  expense?: Expense | null;
  currency: string;
}

const CATEGORIES: { value: Category; label: string; icon: string }[] = [
  { value: '식비', label: '식비', icon: '🍔' },
  { value: '교통비', label: '교통비', icon: '🚗' },
  { value: '생활용품', label: '생활용품', icon: '🏠' },
  { value: '공과금', label: '공과금', icon: '💡' },
  { value: '의료비', label: '의료비', icon: '💊' },
  { value: '문화/여가', label: '문화/여가', icon: '🎬' },
  { value: '기타', label: '기타', icon: '📦' },
];

const PAYMENT_METHODS = ['현금', '신용카드', '체크카드', '계좌이체'];

export function AddExpenseSheet({ open, onClose, onSubmit, expense, currency }: AddExpenseSheetProps) {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: '기타' as Category,
    paymentMethod: '',
    receipt: '',
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense.amount.toString(),
        description: expense.description,
        date: expense.date.split('T')[0],
        category: expense.category,
        paymentMethod: expense.paymentMethod || '',
        receipt: expense.receipt || '',
      });
    } else {
      setFormData({
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        category: '기타',
        paymentMethod: '',
        receipt: '',
      });
    }
  }, [expense, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.description) {
      toast.error('금액과 설명을 입력해주세요');
      return;
    }

    const amount = parseFloat(formData.amount.replace(/,/g, ''));
    if (isNaN(amount) || amount <= 0) {
      toast.error('올바른 금액을 입력해주세요');
      return;
    }

    onSubmit({
      amount,
      description: formData.description,
      date: formData.date,
      category: formData.category,
      paymentMethod: formData.paymentMethod || undefined,
      receipt: formData.receipt || undefined,
    });

    toast.success(expense ? '지출이 수정되었습니다' : '지출이 기록되었습니다');
  };

  const handleAmountChange = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');
    // Format with commas
    const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    setFormData({ ...formData, amount: formatted });
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, receipt: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{expense ? '지출 수정' : '지출 기록'}</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-6">
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-lg">금액</Label>
            <div className="relative">
              <Input
                id="amount"
                type="text"
                inputMode="numeric"
                value={formData.amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="h-16 text-3xl font-bold pr-16"
                placeholder="0"
                autoFocus
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">
                원
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="h-12"
              placeholder="무엇을 구매했나요?"
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">날짜</Label>
            <div className="relative">
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="h-12 pr-12"
              />
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>카테고리</Label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.value })}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                    formData.category === cat.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <span className="text-2xl mb-1">{cat.icon}</span>
                  <span className="text-xs font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label>결제 수단 (선택)</Label>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: method })}
                  className={`h-12 rounded-lg border-2 transition-all ${
                    formData.paymentMethod === method
                      ? 'border-blue-600 bg-blue-50 font-medium'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Receipt */}
          <div className="space-y-2">
            <Label>영수증 (선택)</Label>
            {formData.receipt ? (
              <div className="relative">
                <img
                  src={formData.receipt}
                  alt="Receipt"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, receipt: '' })}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <div className="text-center">
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <span className="text-sm text-gray-600">영수증 추가</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleReceiptUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full h-14 text-lg sticky bottom-0">
            저장
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
