import os
import re

src_dir = r"C:\Users\lenovo\Documents\AIProjects\ai-alchemist-react\src"

for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith((".ts", ".tsx")):
            filepath = os.path.join(root, file)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            
            original = content
            content = content.replace("process.env.NEXT_PUBLIC_", "import.meta.env.VITE_")
            
            if content != original:
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"Updated env vars in {filepath}")
