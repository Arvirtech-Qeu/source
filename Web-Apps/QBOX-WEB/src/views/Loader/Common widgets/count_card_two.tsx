"use client"
import React, { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import HotBoxImg from '@assets/images/hotbox.png';
import { ThemeProvider, useTheme } from "../Theme Settings/theme_provider";

export interface StatCardTwoProps {
  title: string;
  value: string | number;
  valueFontSize?: string;
  description: string;
  icon: LucideIcon;
  actionText?: string;
  actionHandler?: () => void;
  iconColor?: string;
  valueColor?: string;
  status?: "Active" | "Warning" | "Critical"; // New status prop
  primaryButtonText?: string; // First button text
  secondaryButtonText?: string; // Second button text
  primaryButtonHandler?: () => void;
  secondaryButtonHandler?: () => void;
}

export function StatCardTwo({
  title,
  value,
  valueFontSize = '2xl',
  description,
  icon: Icon,
  actionText,
  actionHandler = () => { },
  status,
  primaryButtonText,
  secondaryButtonText,
  primaryButtonHandler = () => { },
  secondaryButtonHandler = () => { },
}: StatCardTwoProps): React.ReactElement {

  const { theme } = useTheme();

  return (
      <div className= "low-bg-color p-6 rounded-lg">
        <div className="flex justify-between items-start mb-4">
          <div className="low-bg-color p-3 rounded-full">
            <img src={HotBoxImg} alt="" />
          </div>
          {status && (
            <div className={`px-4 py-1 rounded-full text-sm ${status === "Active" ? "bg-white text-green-600 border border-green-700" :
                status === "Warning" ? "bg-white text-yellow-600 border border-yellow-700" :
                  "bg-white text-red-600 border border-red-700"
              }`}>
              {status}
            </div>
          )}
        </div>

        <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
        <p className={`font-bold text-color text-${valueFontSize} mb-1`}>{value}</p>
        <p className="text-gray-600 mb-4">{description}</p>

        {/* Action buttons */}
        <div className="flex gap-2 mt-2">
          {primaryButtonText && (
            <button
              className="w-full bg-color text-white px-4 py-2 rounded-md transition"
              onClick={primaryButtonHandler}
            >
              {primaryButtonText}
            </button>
          )}

          {secondaryButtonText && (
            <button
              className="w-full low-bg-color text-color px-4 py-2 rounded-md transition"
              onClick={secondaryButtonHandler}
            >
              {secondaryButtonText}
            </button>
          )}

          {actionText && !primaryButtonText && !secondaryButtonText && (
            <button
              className="text-blue-500 font-medium hover:underline"
              onClick={actionHandler}
            >
              {actionText}
            </button>
          )}
        </div>
      </div>
  );
}