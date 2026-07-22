import { cn } from "@/utils/cn";

type Props = {
  label: React.ReactNode;
  value: React.ReactNode;

  direction?: "row" | "column";
  justify?: "start" | "between";
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
};

const ItemField = ({
  label,
  value,
  direction = "row",
  justify = "start",
  className,
  labelClassName,
  valueClassName,
}: Props) => {
  return (
    <div
      className={cn(
        "flex gap-2",
        direction === "row" ? "flex-row items-center" : "flex-col",
        justify === "between" && "justify-between",
        className,
      )}
    >
      <span className={cn("font-semibold", labelClassName)}>{label}</span>
      <span className={cn(valueClassName)}>{value}</span>
    </div>
  );
};

export default ItemField;
