import ApiResponseViewer from "./ApiResponseViewer";

export const metadata = {
  title: "API Response Viewer",
  description: "Send API requests and inspect responses with a clean, readable interface.",
};

export default function Page() {
  return <ApiResponseViewer />;
}
