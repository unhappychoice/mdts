export const isStaleRequest = (
  state: { latestRequestId: string | null },
  action: { meta: { requestId: string; aborted?: boolean } },
): boolean => (
  state.latestRequestId !== action.meta.requestId || Boolean(action.meta.aborted)
);
