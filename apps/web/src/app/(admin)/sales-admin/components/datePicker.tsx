import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerComponentProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

export const DatePickerComponent = ({
  selectedDate,
  onChange,
}: DatePickerComponentProps) => {
  return (
    <div className="flex items-center gap-4 p-2 bg-gray-800 rounded-2xl">
      <span className="font-medium text-orange-500">Selected Date:</span>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => date && onChange(date)}
        dateFormat="yyyy-MM-dd"
        className="px-2 py-1 border rounded-md text-center w-28 z-0"
      />
    </div>
  );
};
