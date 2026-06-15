import { createPageMetadata } from "@/lib/seo";
import SubmitClientPage from "./submit-client";

export const metadata = createPageMetadata({
  title: "推荐工具",
  description: "向知享推荐值得收录的 AI 工具、在线工具与开源项目。",
  path: "/submit",
});

export default function SubmitPage() {
  return <SubmitClientPage />;
}
