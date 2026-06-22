import { redirect } from "next/navigation"
import GirisClient from "./GirisClient"

export default function GirisPage() {
  if (process.env.PANEL_ENABLED !== "true") {
    redirect("/anasayfa")
  }
  return <GirisClient />
}
