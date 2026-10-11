import os
import re

def migrate_imports(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(('.ts', '.tsx')):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()

                new_content = content.replace("lib/supabase", "lib/firebase")
                
                if new_content != content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                        print(f"Updated imports in {path}")

def migrate_queries():
    path = 'src/lib/firebase/queries.ts'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add Firestore imports
    if "from 'firebase/firestore'" not in content:
        content = content.replace(
            "import { supabase } from './client';",
            "import { db } from './client';\nimport { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';"
        )

    # supabase.from('...').select('*') -> (await getDocs(collection(db, '...'))).docs.map(d => ({ id: d.id, ...d.data() }))
    content = re.sub(
        r"\(await supabase\.from\('([^']+)'\)\.select\('\*'\)\)\.data",
        r"(await getDocs(collection(db, '\1'))).docs.map(d => ({ id: d.id, ...d.data() }))",
        content
    )
    
    # supabase.from('...').select('*').eq('id', ID).single() -> (await getDoc(doc(db, '...', ID))).data()
    # Wait, we need the ID in the returned object, so let's format it properly:
    content = re.sub(
        r"\(await supabase\.from\('([^']+)'\)\.select\('\*'\)\.eq\('id', ([^)]+)\)\.single\(\)\)\.data",
        r"({ id: \2, ...(await getDoc(doc(db, '\1', \2))).data() })",
        content
    )
    
    # supabase.from('...').insert(DATA).select().single() -> await addDoc(collection(db, '...'), DATA)
    # wait, insert doesn't return the data in exactly the same way, but let's mock it
    content = re.sub(
        r"\(await supabase\.from\('([^']+)'\)\.insert\(([^)]+)\)\.select\(\)\.single\(\)\)\.data",
        r"(async () => { const ref = await addDoc(collection(db, '\1'), \2); const snap = await getDoc(ref); return { id: ref.id, ...snap.data() }; })()",
        content
    )

    # supabase.from('...').update(DATA).eq('id', ID).select().single() -> await updateDoc...
    content = re.sub(
        r"\(await supabase\.from\('([^']+)'\)\.update\(([^)]+)\)\.eq\('id', ([^)]+)\)\.select\(\)\.single\(\)\)\.data",
        r"(async () => { const r = doc(db, '\1', \3); await updateDoc(r, \2); const snap = await getDoc(r); return { id: r.id, ...snap.data() }; })()",
        content
    )

    # supabase.from('...').delete().eq('id', ID) -> await deleteDoc(doc(db, '...', ID))
    content = re.sub(
        r"supabase\.from\('([^']+)'\)\.delete\(\)\.eq\('id', ([^)]+)\)",
        r"deleteDoc(doc(db, '\1', \2))",
        content
    )

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
        print(f"Migrated queries in {path}")

def migrate_mutations():
    path = 'src/lib/firebase/mutations.ts'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add Firestore imports
    if "from 'firebase/firestore'" not in content:
        content = content.replace(
            "import { supabase } from './client';",
            "import { db } from './client';\nimport { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';"
        )

    content = re.sub(
        r"await supabase\.from\('([^']+)'\)\.insert\(([^)]+)\)\.select\(\)\.single\(\)",
        r"await (async () => { const ref = await addDoc(collection(db, '\1'), \2); const snap = await getDoc(ref); return { id: ref.id, ...snap.data() }; })()",
        content
    )
    
    content = re.sub(
        r"\(await supabase\.from\('([^']+)'\)\.update\(([^)]+)\)\.eq\('id', ([^)]+)\)\.select\(\)\.single\(\)\)\.data",
        r"await (async () => { const r = doc(db, '\1', \3); await updateDoc(r, \2); const snap = await getDoc(r); return { id: r.id, ...snap.data() }; })()",
        content
    )

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
        print(f"Migrated mutations in {path}")

def migrate_agents():
    path = 'src/lib/firebase/agents.ts'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # agents doesn't use firestore usually, just check if it imports supabase
    content = content.replace("import { supabase } from './client';", "import { auth } from './client';")
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
        print(f"Migrated agents in {path}")

migrate_imports('src')
migrate_queries()
migrate_mutations()
migrate_agents()
