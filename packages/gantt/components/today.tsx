import {} from '@repo/shadcn-ui/components/ui/context-menu';
import { formatDate } from 'date-fns';
import type { FC } from 'react';
import { useContext } from 'react';
import { GanttContext } from '../contexts/gantt-context';
import {
  getDifferenceIn,
  getEndOf,
  getInnerDifferenceIn,
  getStartOf,
} from '../lib/range-fns';
import type { Range } from '../types/types';

const calculateInnerOffset = (
  date: Date,
  range: Range,
  columnWidth: number
) => {
  const startOf = getStartOf(range);
  const endOf = getEndOf(range);
  const differenceIn = getInnerDifferenceIn(range);
  const startOfRange = startOf(date);
  const endOfRange = endOf(date);
  const totalRangeDays = differenceIn(endOfRange, startOfRange);
  const dayOfMonth = date.getDate();

  return (dayOfMonth / totalRangeDays) * columnWidth;
};

export const Today: FC = () => {
  const label = 'Today';
  const date = new Date();
  const gantt = useContext(GanttContext);
  const differenceIn = getDifferenceIn(gantt.range);
  const timelineStartDate = new Date(gantt.timelineData[0].year, 0, 1);
  const offset = differenceIn(date, timelineStartDate);
  const innerOffset = calculateInnerOffset(
    date,
    gantt.range,
    (gantt.columnWidth * gantt.zoom) / 100
  );

  return (
    <div
      className="pointer-events-none absolute top-0 left-0 z-20 flex h-full select-none flex-col items-center justify-center overflow-visible"
      style={{
        width: 0,
        transform: `translateX(calc(var(--gantt-column-width) * ${offset} + ${innerOffset}px))`,
      }}
    >
      <div className="group pointer-events-auto sticky top-0 flex select-auto flex-col flex-nowrap items-center justify-center whitespace-nowrap rounded-b-md bg-primary px-2 py-1 text-white text-xs">
        {label}
        <span className="max-h-[0] overflow-hidden text-white/80 transition-all group-hover:max-h-[2rem]">
          {formatDate(date, 'MMM dd, yyyy')}
        </span>
      </div>
      <div className="h-full w-px bg-primary" />
    </div>
  );
};
