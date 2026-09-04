import { redirect } from "next/navigation";

export default function DashboardSignIn() {
  redirect("/sign-in?next=/dashboard");
}
