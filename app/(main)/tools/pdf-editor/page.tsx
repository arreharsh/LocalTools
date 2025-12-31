'use client';

import { Trash2, FileText } from "lucide-react";

export default function PDFEditorPage() {
  return (
    <div className="h-full flex items-center justify-center bg-background-to-br from-accent-50 to-primary-100">
      <div className="text-center px-6">
        <div className="mb-8 flex justify-center">
         
            <FileText className="w-16 h-16 text-primary" />
          
        </div>
            
        <div className="mb-6">
          
        </div>
        <h1 className="text-4xl font-bold text-primary mb-4">
          PDF Editor
        </h1>
        <p className="text-xl text-primary mb-8">
          Coming Soon
        </p>
        <p className="text-muted-foreground max-w-md mx-auto mb-12">
          We're working on an amazing PDF editor tool. Stay tuned for advanced editing capabilities, seamless document management, and powerful features coming your way.
        </p>
        <div className="flex justify-center items-center space-x-2">
          <span className="w-3 h-3 bg-primary rounded-full animate-bounce"></span>
          <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
          <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
        </div>
      </div>
    </div>
  );
}
