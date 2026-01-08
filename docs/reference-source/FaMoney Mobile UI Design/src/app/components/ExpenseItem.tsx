import { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { toast } from 'sonner';
import type { Expense } from '../App';

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const CATEGORY_ICONS = {
  '식비': '🍔',
  '교통비': '🚗',
  '생활용품': '🏠',
  '공과금': '💡',
  '의료비': '💊',
  '문화/여가': '🎬',
  '기타': '📦',
};

const CATEGORY_COLORS = {
  '식비': 'bg-blue-100',
  '교통비': 'bg-green-100',
  '생활용품': 'bg-yellow-100',
  '공과금': 'bg-red-100',
  '의료비': 'bg-purple-100',
  '문화/여가': 'bg-pink-100',
  '기타': 'bg-gray-100',
};

export function ExpenseItem({ expense, onEdit, onDelete }: ExpenseItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleDelete = () => {
    onDelete(expense.id);
    toast.success('지출이 삭제되었습니다');
    setShowDeleteDialog(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swiped left - show actions
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <>
      <div
        className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Category Icon */}
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
            CATEGORY_COLORS[expense.category]
          }`}
        >
          <span className="text-2xl">{CATEGORY_ICONS[expense.category]}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold truncate">{expense.description}</h4>
          <div className="flex items-center gap-2 mt-1">
            <Avatar className="w-5 h-5">
              <AvatarImage src={expense.createdByAvatar} />
              <AvatarFallback className="text-xs">
                {expense.createdByName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-600">{expense.createdByName}</span>
            <span className="text-xs text-gray-400">
              {new Date(expense.date).toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>

        {/* Amount */}
        <div className="text-right flex-shrink-0">
          <p className="text-lg font-bold text-blue-600">
            {expense.amount.toLocaleString()}원
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={() => onEdit(expense)}
            className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="w-9 h-9 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>지출 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 지출을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
