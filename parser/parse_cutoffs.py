import pdfplumber
import re
import json

def extract_cutoff_data(pdf_path):
    data = []
    current_college = None
    current_course = None
    current_categories = []

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            lines = text.split('\n')

            for i, line in enumerate(lines):
                # College name line (starts with 4-digit code)
                if re.match(r'^\d{4} .*?[A-Za-z]', line):
                    current_college = line.strip()

                # Course name line
                elif "Course Name" in line:
                    match = re.search(r'Course Name\s*:\s*(.+)', line)
                    if match:
                        current_course = match.group(1).strip()

                # Category line (before the cutoffs)
                elif re.match(r'^[A-Z\s-]{3,}$', line.strip()) and "(" not in line:
                    current_categories = line.strip().split()

                # Cutoff values (Stage-I line or just cutoff numbers in %)
                elif any("%" in l for l in line.split()):
                    percents = re.findall(r'\((\d{2}\.\d{2})%\)', line)
                    if len(percents) == len(current_categories):
                        for cat, cutoff in zip(current_categories, percents):
                            data.append({
                                "college": current_college,
                                "course": current_course,
                                "category": cat,
                                "cutoff": float(cutoff),
                                "location": infer_location(current_college)
                            })
    return data

def infer_location(college_name: str):
    # Example: extract city from "XYZ College, Amravati (Govt)"
    parts = college_name.split(',')
    if len(parts) >= 2:
        return parts[-1].split('(')[0].strip()
    return "Unknown"

if __name__ == "__main__":
    import sys
    pdf_file = sys.argv[1] if len(sys.argv) > 1 else "Cutoff.pdf"
    result = extract_cutoff_data(pdf_file)
    with open("cutoff_data.json", "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    print(f"Parsed {len(result)} rows.")

