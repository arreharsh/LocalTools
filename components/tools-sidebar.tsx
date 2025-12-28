"use client";

import { useMemo, useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useAuth, useAuthModal } from "@/providers/AuthProvider";

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Mail, PanelLeftClose, PanelLeft, Search } from "lucide-react";
import { toolCategories } from "@/lib/tools-data";

interface ToolsSidebarProps {
  selectedTool: string | null;
  onSelectTool: (toolId: string) => void;
}

export function ToolsSidebar({
  selectedTool,
  onSelectTool,
}: ToolsSidebarProps) {
  const { state, toggleSidebar } = useSidebar();
  const [query, setQuery] = useState("");

  const { user, loading } = useAuth();
  const { open } = useAuthModal();

  const filteredCategories = useMemo(() => {
    if (!query.trim()) return toolCategories;

    return toolCategories
      .map((category) => ({
        ...category,
        tools: category.tools.filter((tool) =>
          tool.name.toLowerCase().includes(query.toLowerCase())
        ),
      }))
      .filter((category) => category.tools.length > 0);
  }, [query]);

  return (
    <Sidebar side="left" collapsible="icon" className="no-scrollbar">
      {/* HEADER */}
      <SidebarHeader className="border-b p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2">
            <img
              src="/logo.png"
              alt="LocalTools"
              className="size-6 hover:scale-110 shrink-0"
            />

            <h2 className="text-lg font-bold transition-all duration-100 group-data-[collapsible=icon]:hidden scale-100 ease-out group-hover:tracking-wide">
              LocalTools
            </h2>
          </Link>

          <Button
            variant="custom"
            size="icon"
            onClick={toggleSidebar}
            className="size-8  "
          >
            {state === "expanded" ? (
              <PanelLeftClose className="size-4" />
            ) : (
              <PanelLeft className="size-4" />
            )}
          </Button>
        </div>

        {/* SEARCH */}
        <div className="group-data-[collapsible=icon]:hidden">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tools... "
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8 h-9 "
            />
          </div>
        </div>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="no-scrollbar">
        <ScrollArea className="h-full no-scrollbar">
          {filteredCategories.map((category) => {
            const Icon = category.icon;

            return (
              <SidebarGroup key={category.id}>
                <SidebarGroupLabel className="flex items-center gap-2 px-2">
                  <Icon className="size-4 shrink-0" />
                  <span className="group-data-[collapsible=icon]:hidden ">
                    {category.name}
                  </span>
                </SidebarGroupLabel>

                <SidebarGroupContent>
                  <SidebarMenu>
                    {category.tools.map((tool) => {
                      const ToolIcon = tool.icon;

                      return (
                        <SidebarMenuItem key={tool.id}>
                          <SidebarMenuButton
                            asChild
                            isActive={false} // active state route se handle hoga
                            tooltip={tool.name}
                          >
                            <Link
                              href={`/tools/${tool.slug}`}
                              className="flex items-center gap-2 w-full"
                            >
                              <ToolIcon className="size-4 shrink-0" />

                              <span className="flex-1 truncate">
                                {tool.name}
                              </span>

                              {tool.isPro && (
                                <Badge
                                  variant="secondary"
                                  className="ml-auto shrink-0 text-[10px] px-1.5 py-0 h-4 bg-primary/10 text-primary border-primary/20 group-data-[collapsible=icon]:hidden"
                                >
                                  PRO
                                </Badge>
                              )}

                              {tool.isNew && (
                                <Badge
                                  variant="secondary"
                                  className="ml-auto shrink-0 text-[10px] px-1.5 py-0 h-4 bg-green-500/10 text-green-500 border-green-200/20 group-data-[collapsible=icon]:hidden"
                                >
                                  NEW
                                </Badge>
                              )}

                              {tool.isComingSoon && (
                                <Badge
                                  variant="secondary"
                                  className="ml-auto shrink-0 text-[10px] px-1.5 py-0 h-4 bg-yellow-500/10 text-yellow-500 border-yellow-200/20 group-data-[collapsible=icon]:hidden"
                                >
                                  COMING SOON
                                </Badge>
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            );
          })}
        </ScrollArea>
      </SidebarContent>

      {/* FOOTER */}
      {!loading && !user && (
        <SidebarFooter className="border-t p-4 animate-in fade-in-0 duration-200">
          <div className="space-y-3 group-data-[collapsible=icon]:hidden">
            <p className="text-xs text-muted-foreground text-center">
              Sign in to save history & favorites
            </p>

            <div className="space-y-2">
              {/* Google */}
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 bg-transparent"
                onClick={open}
              >
                <svg className="size-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="truncate">Continue with Google</span>
              </Button>

              {/* Email */}
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 bg-transparent"
                onClick={open}
              >
                <Mail className="size-4 shrink-0" />
                <span className="truncate">Sign in with Email</span>
              </Button>
            </div>
          </div>
        </SidebarFooter>
      )}

      {!loading && user && (
        <SidebarFooter className="border-t p-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary font-semibold">
              {(
                user.user_metadata?.full_name ||
                user.email?.split("@")[0] ||
                "U"
              )
                .charAt(0)
                .toUpperCase()}
            </div>

            {/* Name */}
            <div className="min-w-0">
              <p className="text-sm font-medium truncate leading-tight">
                {user.user_metadata?.full_name || user.email?.split("@")[0]}
              </p>
              <p className="text-xs text-muted-foreground">Free plan</p>
            </div>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
