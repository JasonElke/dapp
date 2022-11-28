import { Pagination, Table, TableProps } from 'antd';
import { useEffect } from 'react';

interface TableCustomProps<T extends object> extends TableProps<T> {
  isHideIndex?: boolean;
  isHidePagination?: boolean;
  page?: number;
  limit?: number;
  columns: any[];
  dataSource: any;
  totalRecord?: number;
  onPaginationChange?: (page: number, limit: number) => void;
}

const TableCustom = <T extends object = object>(props: TableCustomProps<T>) => {
  const { isHideIndex, totalRecord, page = 1, limit = 20, onPaginationChange, isHidePagination, ...rest } = props;
  let LIST_COLUMN: any[] = [
    {
      title: 'No.',
      dataIndex: 'index_item',
      align: 'center',
      key: 'index_item',
      // fixed: 'left',
      width: 70,
    },
    ...props.columns,
  ];

  if (isHideIndex) {
    LIST_COLUMN = LIST_COLUMN.slice(1);
  }

  useEffect(() => {
    // alert(page);
  });

  return (
    <div>
      <Table
        {...rest}
        columns={LIST_COLUMN as any}
        dataSource={props.dataSource.map((item: any, index: number) => {
          return {
            key: index,
            index_item: (page - 1) * limit + index + 1,
            ...item,
          };
        })}
        pagination={false}
      />
      {!isHidePagination && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
          <Pagination total={totalRecord || 0} pageSize={+limit} current={+page} onChange={onPaginationChange} />
        </div>
      )}
    </div>
  );
};

export default TableCustom;
