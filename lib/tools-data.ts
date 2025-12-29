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
  access?: "free" | "limited" | "pro"
  isNew?: boolean
  isComingSoon?: boolean
}


export interface ToolCategory {
  id: string
  name: string
  icon: any
  tools: Tool[]
}

export interface ToolsbySearch {
  [key: string]: Tool[]
}

export const toolCategories: ToolCategory[] = [
  
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
        access: "limited",
      },
      {

        id: "invoiceGenerator",
        slug: "invoice-generator",
        name: "Invoice Generator",
        icon: FileText,
        category: "pdf",
        isNew: true,
        access: "limited",
        
      },
      {
        id: "pdfPageReorder",
        slug: "pdf-page-reorder",
        name: "PDF Page Reorder",
        icon: FileEdit,
        category: "pdf",
        access: "limited",
      },
      {
        id: "pdfSplit",
        slug: "pdf-split",
        name: "PDF Split",
        icon: Scissors,
        category: "pdf",
        access: "free",
      },
      {
        id:"imgToPdf",
        slug: "image-to-pdf",
        name: "Image to PDF",
        icon: FileText,
        category: "pdf",
        access: "free",
      },
      {
        id: "pdfCompress",
        slug: "pdf-compress",
        name: "PDF Compress",
        icon: Gauge,
        category: "pdf",
        access: "limited",
      },
      {
        id: "pdfEditor",
        slug: "pdf-editor",
        name: "PDF Editor",
        icon: FileEdit,
        category: "pdf",
        isComingSoon: true,
        access: "pro",
      },
    ],
  },
  
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
        access: "free",
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
        access: "limited",
      },
      {
        id: "curlViewer",
        slug: "curl-to-api-viewer",
        name: "cURL to API Viewer",
        icon: Link,
        category: "dev",
        isNew: true,
        access: "limited",
      },
      {
        id: "jwtDecoder",
        slug: "jwt-decoder",
        name: "JWT Decoder",
        icon: ShieldCheck,
        category: "dev",
        access: "free",
      },
      {
        id: "regexTester",
        slug: "regex-tester",
        name: "Regex Tester",
        icon: Regex,
        category: "dev",
        access: "free",
      },
      {
        id: "urlTools",
        slug: "url-encode-decode",
        name: "URL Encode / Decode",
        icon: Link,
        category: "dev",
        access: "free",
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
        access: "free",
      },
    ],
  },
]
