'use client';

import { User } from "@/types/user.type";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { BookOpen, ChevronDown, LogOut, Settings, User2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Role } from "@/types/enum";
import { ROLE_CONFIG } from "@/constants/role";

interface AvatarDropdownProps {
  user: User;
  logout: () => Promise<void>;
}

export function AvatarDropdown({ user, logout }: AvatarDropdownProps) {
  const roleConfig = ROLE_CONFIG[user.role];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 pr-2 rounded-full transition-all border border-transparent hover:border-gray-100">
          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
            <AvatarImage src={user.avatarUrl || undefined} alt={user.fullName} />
            <AvatarFallback className="bg-galaxy text-white text-xs">
              {user.fullName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:flex flex-col items-start text-left">
            <span className="text-xs font-bold text-gray-900 leading-none">{user.fullName}</span>
            <span className="text-[10px] text-gray-500 capitalize">{user.role}</span>
          </div>
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 mt-2 p-2 bg-white border border-gray-100 shadow-xl">
        <DropdownMenuLabel className="font-normal p-2">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatarUrl || undefined} alt={user.fullName} />
                <AvatarFallback className="bg-galaxy text-white">
                  {user.fullName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-bold leading-none">{user.fullName}</p>
                <p className="text-xs leading-none text-muted-foreground mt-1">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className={cn(
                "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter",
                roleConfig.className,
              )}>{roleConfig.label}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem className="cursor-pointer rounded-lg p-2 hover:bg-gray-50">
          <User2 className="mr-2 h-4 w-4 text-gray-500" />
          <span className="font-medium">Thông tin cá nhân</span>
        </DropdownMenuItem>

        {user.role === Role.teacher && (
          <DropdownMenuItem className="cursor-pointer rounded-lg p-2 hover:bg-gray-50">
            <BookOpen className="mr-2 h-4 w-4 text-gray-500" />
            <span className="font-medium">Quản lý lớp học</span>
          </DropdownMenuItem>
        )}

        {user.role === Role.admin && (
          <DropdownMenuItem className="cursor-pointer rounded-lg p-2 hover:bg-gray-50">
            <Settings className="mr-2 h-4 w-4 text-gray-500" />
            <span className="font-medium">Quản lý hệ thống</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem
          className="cursor-pointer rounded-lg p-2 text-red-600 focus:text-red-600 focus:bg-red-50"
          onClick={() => logout()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span className="font-bold">Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
