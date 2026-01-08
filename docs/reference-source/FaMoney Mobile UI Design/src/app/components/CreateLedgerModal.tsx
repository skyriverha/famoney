import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface CreateLedgerModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; currency: string }) => void;
}

export function CreateLedgerModal({ open, onClose, onSubmit }: CreateLedgerModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    currency: 'KRW',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = '원장 이름을 입력해주세요';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
      setFormData({ name: '', description: '', currency: 'KRW' });
      setErrors({});
    }
  };

  const handleClose = () => {
    setFormData({ name: '', description: '', currency: 'KRW' });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[90vw] w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>새 원장 만들기</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              원장 이름 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="예: 우리 가족 가계부"
              className="h-12"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">설명 (선택)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="원장에 대한 간단한 설명"
              rows={3}
            />
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <Label htmlFor="currency">통화</Label>
            <Select
              value={formData.currency}
              onValueChange={(value) => setFormData({ ...formData, currency: value })}
            >
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="KRW">🇰🇷 KRW (원)</SelectItem>
                <SelectItem value="USD">🇺🇸 USD (달러)</SelectItem>
                <SelectItem value="JPY">🇯🇵 JPY (엔)</SelectItem>
                <SelectItem value="EUR">🇪🇺 EUR (유로)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 h-12"
            >
              취소
            </Button>
            <Button type="submit" className="flex-1 h-12">
              만들기
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
