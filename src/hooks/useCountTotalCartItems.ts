import useMenuStore from "@/app/(customer)/menus/store";

const useCountTotalCartItems = () => {
  const { cart } = useMenuStore((state) => state);
  return cart.reduce((total, item) => total + item.quantity, 0);
};

export default useCountTotalCartItems;
