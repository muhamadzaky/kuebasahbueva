import useMenuStore from "@/app/(customer)/menus/store";

const useCountTotalPackagePrice = () => {
  const packageCart = useMenuStore((state) => state.packageCart);
  return packageCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export default useCountTotalPackagePrice;
