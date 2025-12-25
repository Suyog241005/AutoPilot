import { useSubscription } from "./use-subscription";

export const useHasActiveSubscription = () => {
  const { data: customerState, isLoading, ...rest } = useSubscription();

  const hasActiveSubscription =
    customerState?.activeSubscriptions &&
    customerState.activeSubscriptions.length > 0;

  return {
    hasActiveSubscription,
    isLoading,
    subscription: customerState?.activeSubscriptions?.[0],
    ...rest,
  };
};
