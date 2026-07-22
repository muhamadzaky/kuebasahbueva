import useMenuStore from "@/app/(customer)/menus/store";

const useCountTotalPackageItems = () => {
  const packageCart = useMenuStore((state) => state.packageCart);
  return packageCart.reduce((sum, item) => sum + item.quantity, 0);
};

export default useCountTotalPackageItems;
