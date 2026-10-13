import { redirect } from "next/navigation";

// /profile redirects to /account — the full account hub
export default function ProfilePage() {
  redirect("/account");
}
