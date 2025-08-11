#!/bin/bash

# Create base src folder structure
mkdir -p src/{assets/{images,fonts,styles},components/{icons},containers,config,hooks,services,state/context,i18n/locales,tests/{unit,integration,e2e},types,utils,views}

# Create TypeScript and React files
touch src/App.tsx
touch src/index.tsx
touch src/routes.tsx
touch src/globalState.tsx
touch src/serviceWorker.ts
touch src/theme.tsx
touch src/history.tsx

# Create config files
touch src/config/config.ts
touch src/config/apiConfig.ts
touch src/config/featureFlags.ts

# Create hooks files
touch src/hooks/useAuth.ts
touch src/hooks/useFetch.ts
touch src/hooks/useLocalStorage.ts

# Create services files
touch src/services/authService.ts
touch src/services/apiService.ts
touch src/services/userService.ts
touch src/services/themeService.ts

# Create state management files
touch src/state/store.ts
touch src/state/userSlice.ts
touch src/state/themeSlice.ts

# Create context files
touch src/context/AuthContext.tsx
touch src/context/ThemeContext.tsx
touch src/context/ModalContext.tsx

# Create i18n configuration files
touch src/i18n/i18n.ts
touch src/i18n/locales/en.json
touch src/i18n/locales/fr.json

# Create utils files
touch src/utils/validators.ts
touch src/utils/formatters.ts
touch src/utils/storage.ts

# Create test files
touch src/tests/unit/Button.test.tsx
touch src/tests/unit/Input.test.tsx
touch src/tests/integration/Dashboard.test.tsx
touch src/tests/integration/HomePage.test.tsx
touch src/tests/e2e/login.spec.ts
touch src/tests/e2e/profile.spec.ts

# Create views files
touch src/views/Login.tsx
touch src/views/Register.tsx
touch src/views/NotFound.tsx

# Create components files
touch src/components/Button.tsx
touch src/components/Modal.tsx
touch src/components/Input.tsx
touch src/components/icons/CloseIcon.tsx

# Create the tailwind config file
touch src/assets/styles/tailwind.config.ts

# Create global styles file
touch src/assets/styles/global.css

# Create .env and .gitignore files in the root directory
touch .env
touch .gitignore

# Add content to .gitignore
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
echo "dist/" >> .gitignore

# Output to let user know script is done
echo "Project structure created successfully in the 'src' directory!"

