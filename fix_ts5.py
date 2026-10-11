import re

with open('src/lib/firebase/queries.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix types by casting data() to any
content = content.replace("...d.data()", "...(d.data() as any)")
content = content.replace("snap.data()", "snap.data() as any")

# Fix missing await for IIFE
content = content.replace("const record = (async () =>", "const record = await (async () =>")

# Fix missing await for getDoc where we didn't cast to any
content = re.sub(r"\.\.\.\(await getDoc\(doc\(db, '([^']+)', ([^)]+)\)\)\)\.data\(\)", r"...(await getDoc(doc(db, '\1', \2))).data() as any", content)

# Fix supabase storage
if "import { storage } from './client';" not in content:
    content = content.replace("import { db, demoState } from './client';", "import { db, storage, demoState } from './client';")
if "import { ref, uploadBytes } from 'firebase/storage';" not in content:
    content = content.replace("import { collection, doc", "import { ref, uploadBytes } from 'firebase/storage';\nimport { collection, doc")

content = re.sub(
    r"\(await supabase\.storage\.from\('([^']+)'\)\.upload\([^,]+,\s*([^)]+)\)\)\.data",
    r"await uploadBytes(ref(storage, '\1/' + uniqueName), \2)",
    content
)

# And fix record.id where record might still be a promise... Wait, adding await to const record fixed that.
# Let's save
with open('src/lib/firebase/queries.ts', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/lib/firebase/mutations.ts', 'r', encoding='utf-8') as f:
    m_content = f.read()
m_content = m_content.replace("snap.data()", "snap.data() as any")
m_content = m_content.replace("const record = (async () =>", "const record = await (async () =>")
with open('src/lib/firebase/mutations.ts', 'w', encoding='utf-8') as f:
    f.write(m_content)

print("fixed queries and mutations")
