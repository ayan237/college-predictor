import pdfplumber
import re

pdf_path = r"Cutoff.pdf"

courses = set()
categories = set()

with pdfplumber.open(pdf_path) as pdf:
    for page in pdf.pages:
        text = page.extract_text()
        if not text:
            continue
        lines = text.split('\n')
        for line in lines:
            if "Course Name" in line:
                match = re.search(r'Course Name\s*:\s*(.+)', line)
                if match:
                    courses.add(match.group(1).strip())

            elif re.match(r'^[A-Z][A-Z\s]{2,}$', line.strip()) and "(" not in line:
                for part in line.strip().split():
                    if part.isalpha():
                        categories.add(part)

print("\nCourses:")
for c in sorted(courses):
    print("-", c)

print("\nCategories:")
for c in sorted(categories):
    print("-", c)
