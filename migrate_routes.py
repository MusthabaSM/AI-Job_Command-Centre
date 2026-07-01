import os
import re

routes_dir = r"C:\Users\lenovo\Documents\AIProjects\ai-alchemist-react\src\routes"

for filename in os.listdir(routes_dir):
    if filename.endswith(".tsx") and filename != "__root.tsx":
        filepath = os.path.join(routes_dir, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Remove "use client";
        content = content.replace('"use client";\n', '').replace("'use client';\n", '')
        
        # Find export default function XYZ
        match = re.search(r'export default (async )?function ([A-Za-z0-9_]+)\s*\(', content)
        if match:
            func_name = match.group(2)
            is_async = match.group(1) or ""
            
            # Determine route path
            route_path = "/" if filename == "index.tsx" else f"/{filename.replace('.tsx', '')}"
            
            # Remove export default from function
            content = content.replace(f"export default {is_async}function {func_name}", f"function {func_name}")
            
            # Add TanStack import and Route export
            import_statement = f"import {{ createFileRoute }} from '@tanstack/react-router'\n\nexport const Route = createFileRoute('{route_path}')({{\n  component: {func_name},\n}})\n\n"
            
            content = import_statement + content
            
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Migrated {filename}")
        else:
            print(f"Could not find default export in {filename}")
