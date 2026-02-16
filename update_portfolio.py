import re

# Read the HTML file
with open(r'E:\Academic Sessions\Level 4\Semester I\Level 4 Semester 1-20251227T102445Z-3-001\Level 4 Semester 1\A.B.D. Anandakumara - Portfolio\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Update name
content = content.replace('A.B.D. Anandakumara', 'Buddhika Darshan')

# Update about section description
content = re.sub(
    r'<p>Write a short introduction about who you are.*?</p>',
    '<p>Full-Stack Developer and BICT Undergraduate passionate about building impactful software.</p>',
    content,
    flags=re.DOTALL
)

# Update footer name
content = re.sub(
    r'© <span id="year"></span> A\.B\.D\. Anandakumara',
    '© <span id="year"></span> Buddhika Darshan',
    content
)

# Update contact links
content = re.sub(
    r'<a class="text-link" href="https://github.com/" target="_blank" rel="noreferrer">github.com/your-username</a>',
    '<a class="text-link" href="https://github.com/BuddhikaBICT-UoR-FoT-6" target="_blank" rel="noreferrer">github.com/BuddhikaBICT-UoR-FoT-6</a>',
    content
)

content = re.sub(
    r'<a class="text-link" href="https://www.linkedin.com/" target="_blank" rel="noreferrer"\s*>linkedin.com/in/your-handle</a>',
    '<a class="text-link" href="https://www.linkedin.com/in/buddhika-darshan-9b9168252/" target="_blank" rel="noreferrer">linkedin.com/in/buddhika-darshan</a>',
    content
)

# Write back
with open(r'E:\Academic Sessions\Level 4\Semester I\Level 4 Semester 1-20251227T102445Z-3-001\Level 4 Semester 1\A.B.D. Anandakumara - Portfolio\index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Portfolio personalization complete!")
print("Updated: Name, About section, Contact links")
