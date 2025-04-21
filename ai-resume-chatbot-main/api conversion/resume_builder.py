# from reportlab.lib.pagesizes import letter
# from reportlab.pdfgen import canvas
# from datetime import datetime

# def generate_resume_pdf(data):
#     filename = f"resume_{datetime.now().strftime('%Y%m%d%H%M%S')}.pdf"
#     c = canvas.Canvas(filename, pagesize=letter)

#     width, height = letter
#     margin = 50
#     y = height - margin

#     def draw_line():
#         nonlocal y
#         c.line(margin, y, width - margin, y)
#         y -= 10

#     def draw_text(text, font="Helvetica", size=12, bold=False, spacing=15):
#         nonlocal y
#         if bold:
#             c.setFont("Helvetica-Bold", size)
#         else:
#             c.setFont(font, size)
#         c.drawString(margin, y, text)
#         y -= spacing

#     draw_text(data.get("name", "No Name"), size=18, bold=True)
#     draw_text(data.get("email", "Email") + " | " + data.get("phone", "Phone"))
#     draw_text(data.get("linkedin", "LinkedIn") + " | " + data.get("github", "GitHub"))
#     draw_line()

#     draw_text("Education", bold=True)
#     for edu in data.get("education", []):
#         draw_text(f"{edu['degree']} - {edu['school']} ({edu['year']})", spacing=13)
#         draw_text(f"GPA: {edu.get('gpa', 'N/A')}", spacing=13)

#     draw_line()
#     draw_text("Skills", bold=True)
#     draw_text(", ".join(data.get("skills", [])))

#     draw_line()
#     draw_text("Projects", bold=True)
#     for project in data.get("projects", []):
#         draw_text(f"{project['title']}", bold=True)
#         draw_text(project['description'], spacing=13)

#     draw_line()
#     draw_text("Experience", bold=True)
#     for job in data.get("experience", []):
#         draw_text(f"{job['role']} - {job['company']} ({job['duration']})", bold=True)
#         draw_text(job['description'], spacing=13)



#     # adding this new by anujjjjj
#     draw_line()
#     draw_text("Strength", bold=True)
#     for job in data.get("experience", []):
#         draw_text(f"{job['role']} - {job['company']} ({job['duration']})", bold=True)
#         draw_text(job['description'], spacing=13)


#     draw_line()
#     draw_text("Strength", bold=True)
#     for job in data.get("Certifications", []):
#         draw_text(f"{job['role']} - {job['company']} ({job['duration']})", bold=True)
#         draw_text(job['description'], spacing=13)


#     draw_line()
#     draw_text("Strength", bold=True)
#     for job in data.get("Passions", []):
#         draw_text(f"{job['role']} - {job['company']} ({job['duration']})", bold=True)
#         draw_text(job['description'], spacing=13)

#     c.save()
#     return filename






###above one is runnnignnn


from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem
from datetime import datetime

def generate_resume_pdf(data):
    filename = f"resume_{datetime.now().strftime('%Y%m%d%H%M%S')}.pdf"
    doc = SimpleDocTemplate(filename, pagesize=letter, leftMargin=50, rightMargin=50, topMargin=50, bottomMargin=50)
    styles = getSampleStyleSheet()
    content = []

    heading = styles["Heading1"]
    heading.alignment = TA_LEFT

    subheading = ParagraphStyle(name='SubHeading', fontSize=14, leading=16, spaceAfter=10, spaceBefore=10, fontName='Helvetica-Bold')
    normal = styles["Normal"]
    normal.spaceAfter = 6

    def add_section(title, elements):
        content.append(Paragraph(title, subheading))
        content.extend(elements)
        content.append(Spacer(1, 12))

    # Name and Contact Info
    content.append(Paragraph(f"<b>{data.get('name', 'No Name')}</b>", heading))
    contact = f"{data.get('email', '')} | {data.get('phone', '')}<br/>{data.get('linkedin', '')} | {data.get('github', '')}"
    content.append(Paragraph(contact, normal))
    content.append(Spacer(1, 12))

    # Education
    education_data = data.get("education", [])
    education_elements = []
    for edu in education_data:
        education_elements.append(Paragraph(f"<b>{edu.get('degree', '')}</b> - {edu.get('school', '')} ({edu.get('year', '')})", normal))
        if edu.get("gpa"):
            education_elements.append(Paragraph(f"GPA: {edu['gpa']}", normal))
    add_section("Education", education_elements)

    # Skills
    skills = data.get("skills", [])
    if isinstance(skills, str):
        skills = [s.strip() for s in skills.split(",")]
    if skills:
        skills_list = ListFlowable([ListItem(Paragraph(skill, normal)) for skill in skills], bulletType='bullet')
        add_section("Skills", [skills_list])

    # Projects
    projects = data.get("projects", [])
    if isinstance(projects, str):
        projects = [{"title": "Project", "description": projects}]
    project_elements = [Paragraph(f"<b>{p.get('title', '')}</b>: {p.get('description', '')}", normal) for p in projects]
    add_section("Projects", project_elements)

    # Experience
    experience = data.get("experience", [])
    if isinstance(experience, str):
        experience = [{"role": "Role", "company": "Company", "duration": "Duration", "description": experience}]
    exp_elements = []
    for job in experience:
        exp_elements.append(Paragraph(f"<b>{job.get('role', '')}</b> - {job.get('company', '')} ({job.get('duration', '')})", normal))
        exp_elements.append(Paragraph(job.get('description', ''), normal))
    add_section("Experience", exp_elements)

    # Strengths
    strengths = data.get("Strength", [])
    if isinstance(strengths, str):
        strengths = [s.strip() for s in strengths.split(",")]
    if strengths:
        strengths_list = ListFlowable([ListItem(Paragraph(s, normal)) for s in strengths], bulletType='bullet')
        add_section("Strengths", [strengths_list])

    # Certifications
    certs = data.get("Certifications", [])
    if isinstance(certs, str):
        certs = [c.strip() for c in certs.split(",")]
    cert_elements = [Paragraph(cert, normal) for cert in certs]
    add_section("Certifications", cert_elements)

    # Passions
    passions = data.get("Passions", [])
    if isinstance(passions, str):
        passions = [p.strip() for p in passions.split(",")]
    passion_elements = [Paragraph(p, normal) for p in passions]
    add_section("Passions", passion_elements)

    doc.build(content)
    return filename
