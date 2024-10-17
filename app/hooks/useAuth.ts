import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session } = useSession();

  const getCurrentUserId = () => {
    return session?.user?.id || null;
  };

  const getCurrentWorkerId = () => {
    return session?.user?.id || null;
  };

  return { getCurrentUserId, getCurrentWorkerId };
}
