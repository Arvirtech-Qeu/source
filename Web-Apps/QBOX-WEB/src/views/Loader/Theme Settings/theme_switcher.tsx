import type React from "react"
import { useTheme } from "./theme_provider"
import { Check } from "lucide-react"

interface ThemeOption {
  name: string
  value: "blue" | "red" | "orange" | "purple"
  color: string
}

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme()

  const themeOptions: ThemeOption[] = [
    { name: "Blue", value: "blue", color: "#3b82f6" },
    { name: "Red", value: "red", color: "#ef4444" },
    { name: "Orange", value: "orange", color: "#FFA500" },
    { name: "Purple", value: "purple", color: "#a855f7" },
  ]

  return (
    <div className="theme-radio-group">
      {themeOptions.map((option) => (
        <label
          key={option.value}
          className={`flex items-center w-full px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-50 rounded-md transition-colors ${theme === option.value ? "bg-gray-100" : ""
            }`}
        >
          <div className="flex items-center mr-2">
            <input
              type="radio"
              name="theme"
              value={option.value}
              checked={theme === option.value}
              onChange={() => setTheme(option.value)}
              className="sr-only" // Hide default radio button
            />
            <div className="radio-custom relative">
              <div
                className={`w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center ${theme === option.value ? "border-gray-500" : ""
                  }`}
              >
                {theme === option.value && <div className="w-2 h-2 rounded-full bg-gray-500"></div>}
              </div>
            </div>
          </div>

          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: option.color }} />

          <span className="flex-1">{option.name}</span>

          {theme === option.value && <Check className="h-4 w-4 text-gray-600 ml-auto" />}
        </label>
      ))}
    </div>
  )
}

export default ThemeSwitcher
