import { logger } from "@/packages/logger";

interface Props {
  summaryTemplate: string;
  currentPage: number;
  pageSize: number;
  totalCount: number;
}

const formatString = (str: string, ...args: any[]) => {
  return str.replaceAll(/{(\d+)}/g, (match, number) => {
    return typeof args[number] != 'undefined'
      ? args[number]
      : match;
  });
};
export const PagerSummary = ({ summaryTemplate = '{0}-{1} in {2}', currentPage, pageSize, totalCount }: Props) => {
  logger.debug('pageSize:', pageSize, 'totalCount', totalCount);
  const start = currentPage * pageSize + 1;
  const end = Math.min(start + pageSize - 1, totalCount);
  return (
    <div className={'min-w-full inline-block'}>
      <span className={'mx-1'}>{formatString(summaryTemplate, start, end, totalCount)}</span>
    </div>
  );
};