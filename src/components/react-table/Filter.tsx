import { Column } from "@tanstack/react-table";
import { DebouncedInput } from "@/components/react-table/DebounchedInput";

type Props<T> = {
  column: Column<T, unknown>;
  filteredRows: string[];
};

export default function Filter<T>({ column, filteredRows }: Props<T>) {
  const columnFilterValue = column.getFilterValue();

  const uniqueFilteredRows = new Set(filteredRows); // removes duplicates. Sees only the amount of filters available

  const sortedUniqueValues = Array.from(uniqueFilteredRows).sort();

  return (
    <>
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.map((value, i) => (
          <option value={value} key={`${i}-${column.id}`} />
        ))}
      </datalist>

      <DebouncedInput
        type='text'
        value={(columnFilterValue ?? "") as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search... (${uniqueFilteredRows.size}`}
        className='w-full shadow rounded bg-card'
      />
    </>
  );
}
