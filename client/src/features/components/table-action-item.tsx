import { ReactNode } from "react";

const TableActionItem = ({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) => (
  <div className="group relative flex justify-center">
    {children}
    <span className="absolute top-5 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100 z-50">
      {label}
    </span>
  </div>
);

export default TableActionItem;
