import { redirect } from "next/navigation";

export default function ForgotPasswordPage() {
  redirect("/?forgot=1");
}
