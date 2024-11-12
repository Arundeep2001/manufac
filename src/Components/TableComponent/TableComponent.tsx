import { Table } from '@mantine/core';
import classes from './TableComponent.module.css'

// Define the type for the table row data (you can extend this based on your needs)
interface TableProps<T> {
  columns: { title: string; accessor: keyof T }[];   // Column headers with accessors as keys of T
  data: T[]; // Row data
}

const TableComponent = <T extends Record<string, any>>({ columns, data }: TableProps<T>) => {
  return (
    <Table highlightOnHover className={classes.table}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={String(column.accessor)} className={classes.heading}>
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {columns.map((column) => {
              const value = row[column.accessor];
              return (
                <td className={classes.data} key={String(column.accessor)}>
                  {typeof value === 'number' ? value.toFixed(3) : value}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TableComponent;

