import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session } = useSession();

  const getCurrentWorkerId = () => {
    if (session?.user?.id) {
      return session.user.id;
    }
    return null;
  };

  return { getCurrentWorkerId };
}