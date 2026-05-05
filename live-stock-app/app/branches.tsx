import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function BranchesRoot() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/(admin)/branches" as any);
  }, []);

  return null;
}
