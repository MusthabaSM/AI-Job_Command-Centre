import re

# Fix queries.ts
with open('src/lib/firebase/queries.ts', 'r', encoding='utf-8') as f:
    q_content = f.read()

q_content = q_content.replace("file_path: fileRes?.path,", "file_path: fileRes?.ref.fullPath,")

with open('src/lib/firebase/queries.ts', 'w', encoding='utf-8') as f:
    f.write(q_content)

# Fix admin.ts
with open('src/lib/firebase/admin.ts', 'r', encoding='utf-8') as f:
    a_content = f.read()

if "reference types" not in a_content:
    a_content = '/// <reference types="node" />\n' + a_content

# Firebase admin import fix
a_content = a_content.replace("import * as admin from 'firebase-admin';", "import admin from 'firebase-admin';")

with open('src/lib/firebase/admin.ts', 'w', encoding='utf-8') as f:
    f.write(a_content)

print("fixed queries and admin")
