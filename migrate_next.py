import os
import re

src_dir = r"C:\Users\lenovo\Documents\AIProjects\ai-alchemist-react\src"

def replace_in_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    original = content
    
    # 1. next/link
    content = re.sub(r'import\s+Link\s+from\s+[\'"]next/link[\'"]', "import { Link } from '@tanstack/react-router'", content)
    # <Link href=... -> <Link to=...
    content = re.sub(r'<Link\s+href=', "<Link to=", content)
    
    # 2. next/image
    content = re.sub(r'import\s+Image\s+from\s+[\'"]next/image[\'"]', "", content)
    content = re.sub(r'<Image', "<img", content)
    
    # 3. next/navigation
    if 'next/navigation' in content:
        # replace import
        content = re.sub(r'import\s*\{([^}]*)\}\s*from\s*[\'"]next/navigation[\'"]', "import { useNavigate, useLocation } from '@tanstack/react-router'", content)
        # replace useRouter()
        content = re.sub(r'const\s+router\s*=\s*useRouter\(\)', "const navigate = useNavigate()", content)
        # replace router.push(...)
        content = re.sub(r'router\.push\((.*?)\)', r'navigate({ to: \1 })', content)
        # replace usePathname()
        content = re.sub(r'const\s+pathname\s*=\s*usePathname\(\)', "const { pathname } = useLocation()", content)

    # 4. next/font
    content = re.sub(r'import\s*\{[^}]*\}\s*from\s*[\'"]next/font/google[\'"]\s*;?', "", content)

    if content != original:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith((".tsx", ".ts")):
            replace_in_file(os.path.join(root, file))

print("Done")
