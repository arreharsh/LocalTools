import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://localtools.app",
      lastModified: new Date(),
    },
    {
      url: "https://localtools.app/tools/pdf-compress",
      lastModified: new Date(),
    },
    {
      url: "https://localtools.app/tools/pdf-merge",
      lastModified: new Date(),
    },
    {
      url: "https://localtools.app/tools/invoice-generator",
      lastModified: new Date(),
    },
    {
      url: "https://localtools.app/tools/api-response-viewer",
      lastModified: new Date(),
    },
    {
      url: "https://localtools.app/tools/jwt-decoder",
      lastModified: new Date(), 
    
    },
    
  ];
}
