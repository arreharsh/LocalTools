import {
  Type,
  Braces,
  Code,
  FileText,
  Link,
  ShieldCheck,
  Regex,
  Combine,
  Scissors,
  Gauge,
  FileEdit,
} from "lucide-react"

export interface Tool {
  id: string
  slug: string
  name: string
  icon: any
  category: string
  isPro?: boolean
  isNew?: boolean
  isComingSoon?: boolean
}

export interface ToolCategory {
  id: string
  name: string
  icon: any
  tools: Tool[]
}

export const toolCategories: ToolCategory[] = [
  {
    id: "json",
    name: "JSON Tools",
    icon: Braces,
    tools: [
      {
        id: "jsonFormatter",
        slug: "json-formatter",
        name: "Smart JSON Formatter",
        icon: Braces,
        category: "json",
        isNew: true,
      },
    ],
  },
  {
    id: "pdf",
    name: "PDF Tools",
    icon: FileText,
    tools: [
      {
        id: "pdfMerge",
        slug: "pdf-merge",
        name: "PDF Merge",
        icon: Combine,
        category: "pdf",
      },
      {
        id: "pdfSplit",
        slug: "pdf-split",
        name: "PDF Split",
        icon: Scissors,
        category: "pdf",
      },
      {
        id: "pdfCompress",
        slug: "pdf-compress",
        name: "PDF Compress",
        icon: Gauge,
        category: "pdf",
      },
      {
        id: "pdfEditor",
        slug: "pdf-editor",
        name: "PDF Editor",
        icon: FileEdit,
        category: "pdf",
        isComingSoon: true,
      },
    ],
  },
  {
    id: "dev",
    name: "Dev Tools",
    icon: Code,
    tools: [
      {
        id: "apiViewer",
        slug: "api-response-viewer",
        name: "API Response Viewer",
        icon: Code,
        category: "dev",
      },
      {
        id: "curlViewer",
        slug: "curl-to-api-viewer",
        name: "cURL to API Viewer",
        icon: Link,
        category: "dev",
        isNew: true,
      },
      {
        id: "jwtDecoder",
        slug: "jwt-decoder",
        name: "JWT Decoder",
        icon: ShieldCheck,
        category: "dev",
        isPro: true,
      },
      {
        id: "regexTester",
        slug: "regex-tester",
        name: "Regex Tester",
        icon: Regex,
        category: "dev",
      },
      {
        id: "urlTools",
        slug: "url-encode-decode",
        name: "URL Encode / Decode",
        icon: Link,
        category: "dev",
      },
    ],
  },
  {
    id: "text",
    name: "Text Tools",
    icon: Type,
    tools: [
      {
        id: "textCleaner",
        slug: "text-cleaner",
        name: "Text Cleaner",
        icon: Type,
        category: "text",
      },
    ],
  },
]
