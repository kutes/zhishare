import { createPageMetadata } from "@/lib/seo";
import CopyrightClientPage from "./copyright-client";

export const metadata = createPageMetadata({
  title: "版权与权益反馈",
  description: "提交版权、商标、授权、链接错误或信息错误反馈，我们会在核实后及时处理。",
  path: "/copyright",
});

export default function CopyrightPage() {
  return <CopyrightClientPage />;
}
