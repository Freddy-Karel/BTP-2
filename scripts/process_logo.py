from PIL import Image
from pathlib import Path
import shutil

base = Path(r"C:\Users\ACER\Documents\.ALLIANCEBTP\alliance-mobtp\public\brand")
app_dir = Path(r"C:\Users\ACER\Documents\.ALLIANCEBTP\alliance-mobtp\app")

src = Image.open(base / "logo-alliance-mo-btp.png").convert("RGBA")
pixels = src.load()
w, h = src.size

for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        if r > 245 and g > 245 and b > 245:
            pixels[x, y] = (r, g, b, 0)

src.save(base / "logo-full.png", "PNG")
# 2x already is source resolution — save as @2x alias
src.save(base / "logo-full@2x.png", "PNG")

bbox = src.getbbox()
print("bbox", bbox, "size", w, h)

left, top, right, bottom = bbox
content_w = right - left
# Pictogram only (road + house) — left ~27% of artwork
pic_right = left + int(content_w * 0.275)
pictogram = src.crop((left - 4, top - 4, pic_right + 8, bottom + 4))

pw, ph = pictogram.size
side = max(pw, ph) + 16
square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
square.paste(pictogram, ((side - pw) // 2, (side - ph) // 2), pictogram)
square.save(base / "logo-mark.png", "PNG")

for size, name in [
    (32, "favicon-32.png"),
    (180, "apple-touch-icon.png"),
    (192, "icon-192.png"),
]:
    square.resize((size, size), Image.Resampling.LANCZOS).save(base / name, "PNG")

icos = [square.resize((s, s), Image.Resampling.LANCZOS) for s in (16, 32, 48)]
icos[0].save(base / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
shutil.copy(base / "favicon.ico", app_dir / "favicon.ico")
shutil.copy(base / "apple-touch-icon.png", app_dir / "apple-icon.png")

light = square.copy()
lp = light.load()
for y in range(light.size[1]):
    for x in range(light.size[0]):
        r, g, b, a = lp[x, y]
        if a < 20:
            continue
        db = abs(r - 11) + abs(g - 67) + abs(b - 114)
        dg = abs(r - 25) + abs(g - 134) + abs(b - 43)
        if db < dg and db < 120:
            lp[x, y] = (255, 255, 255, a)
        elif dg < 120:
            lp[x, y] = (90, 200, 110, a)

light.save(base / "logo-mark-light.png", "PNG")

full_light = src.copy()
fp = full_light.load()
for y in range(full_light.size[1]):
    for x in range(full_light.size[0]):
        r, g, b, a = fp[x, y]
        if a < 20:
            continue
        db = abs(r - 11) + abs(g - 67) + abs(b - 114)
        dg = abs(r - 25) + abs(g - 134) + abs(b - 43)
        if db < dg and db < 130:
            fp[x, y] = (255, 255, 255, a)
        elif dg < 100:
            fp[x, y] = (min(255, r + 20), min(255, g + 25), min(255, b + 15), a)

full_light.save(base / "logo-full-light.png", "PNG")
print("OK", sorted(p.name for p in base.glob("*")))
