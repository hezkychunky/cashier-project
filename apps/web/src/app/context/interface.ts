interface Shift {
  id: number;
  userId: number;
  shiftType: 'OPENING' | 'CLOSING';
  startTime: string;
  startCash: number;
  isActive: boolean;
}
