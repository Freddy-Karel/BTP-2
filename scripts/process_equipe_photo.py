"""Zoom léger uniquement — photo nette (original)."""
from pathlib import Path
from PIL import Image, ImageEnhance

backup = Path(r"C:\Users\ACER\Documents\.ALLIANCEBTP\alliance-mobtp\public\images\equipe-chantier-original.jpg")
out = Path(r"C:\Users\ACER\Documents\.ALLIANCEBTP\alliance-mobtp\public\images\equipe-chantier.jpg")

img = Image.open(backup).convert("RGB")
w, h = img.size

# Zoom très léger (coupe un peu bâche + bords)
x0, x1 = int(w * 0.04), int(w * 0.97)
y0, y1 = int(h * 0.03), int(h * 0.90)
result = img.crop((x0, y0, x1, y1))
result = ImageEnhance.Sharpness(result).enhance(1.05)
result.save(out, quality=93, optimize=True)
print("ok", result.size)
