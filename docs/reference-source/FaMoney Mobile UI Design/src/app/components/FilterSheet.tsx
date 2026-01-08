import { useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import type { Category } from '../App';

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
  filters: {
    categories: Category[];
    dateRange: { start: string; end: string };
    sortBy: 'date' | 'amount';
  };
  onApply: (filters: any) => void;
}

const CATEGORIES: Category[] = [
  '식비',
  '교통비',
  '생활용품',
  '공과금',
  '의료비',
  '문화/여가',
  '기타',
];

export function FilterSheet({ open, onClose, filters, onApply }: FilterSheetProps) {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(filters.categories);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>(filters.sortBy);

  const handleCategoryToggle = (category: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleApply = () => {
    onApply({
      categories: selectedCategories,
      dateRange: filters.dateRange,
      sortBy,
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setSortBy('date');
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>필터</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 pt-6">
          {/* Categories */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">카테고리</Label>
            <div className="space-y-2">
              {CATEGORIES.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  />
                  <label
                    htmlFor={`category-${category}`}
                    className="flex-1 cursor-pointer select-none"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">정렬</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sort-date"
                  checked={sortBy === 'date'}
                  onCheckedChange={() => setSortBy('date')}
                />
                <label htmlFor="sort-date" className="flex-1 cursor-pointer select-none">
                  날짜순
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sort-amount"
                  checked={sortBy === 'amount'}
                  onCheckedChange={() => setSortBy('amount')}
                />
                <label htmlFor="sort-amount" className="flex-1 cursor-pointer select-none">
                  금액순
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 sticky bottom-0 bg-white pb-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="flex-1 h-12"
            >
              초기화
            </Button>
            <Button onClick={handleApply} className="flex-1 h-12">
              적용
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
