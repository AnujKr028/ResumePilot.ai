# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from reportlab.pdfgen import canvas
# import io
# from flask import send_file

# app = Flask(__name__)
# CORS(app)

# @app.route("/generate-resume", methods=["POST"])
# def generate_resume():
#     data = request.json

#     # Prepare PDF in memory
#     buffer = io.BytesIO()
#     pdf = canvas.Canvas(buffer)
#     pdf.setFont("Helvetica", 12)
#     y = 800

#     # Write data into the PDF
#     for key, value in data.items():
#         pdf.drawString(50, y, f"{key.capitalize()}: {value}")
#         y -= 20

#     pdf.save()
#     buffer.seek(0)

#     return send_file(buffer, as_attachment=True, download_name="resume.pdf", mimetype="application/pdf")

# if __name__ == "__main__":
#     app.run(debug=True)


# this is also running
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem
from datetime import datetime
import io

app = Flask(__name__)
CORS(app)

def generate_resume_pdf(data):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, leftMargin=50, rightMargin=50, topMargin=50, bottomMargin=50)
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
    if isinstance(education_data, str):
        education_data = [{
            "degree": "N/A",
            "school": education_data,
            "year": "N/A",
            "gpa": ""
        }]
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
        experience = [{
            "role": "N/A",
            "company": "N/A",
            "duration": "N/A",
            "description": experience
        }]
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
    buffer.seek(0)
    return buffer

@app.route("/generate-resume", methods=["POST"])
def generate_resume():
    data = request.get_json()
    pdf_buffer = generate_resume_pdf(data)
    return send_file(pdf_buffer, as_attachment=True, download_name="resume.pdf", mimetype="application/pdf")

if __name__ == "__main__":
    app.run(debug=True)
