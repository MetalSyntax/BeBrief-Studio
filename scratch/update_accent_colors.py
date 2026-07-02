import os

sections_dir = "/Users/metalsyntax/Downloads/Behance Brief Builder/src/components/sections"

for filename in os.listdir(sections_dir):
    if not filename.endswith(".tsx") or filename == "index.tsx":
        continue
    
    filepath = os.path.join(sections_dir, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    new_content = content.replace(
        "        '--section-accent': style.accentColor || 'var(--accent)',\n      }}",
        "        '--section-accent': style.accentColor || 'var(--accent)',\n      } as React.CSSProperties}"
    )
        
    if new_content != content:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated {filename}")
