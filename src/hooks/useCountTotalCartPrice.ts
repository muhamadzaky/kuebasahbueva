import useMenuStore from "@/app/(customer)/menus/store";

const useCountTotalCartPrice = () => {
  const cart = useMenuStore((state) => state.cart);

  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

export default useCountTotalCartPrice;
