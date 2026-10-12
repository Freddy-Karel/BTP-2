# -*- coding: utf-8 -*-
import zipfile
import re
import json
import shutil
from pathlib import Path
from xml.etree import ElementTree as ET

rapport = Path(r"C:\Users\ACER\Documents\.ALLIANCEBTP\rapport")
out = Path(r"C:\Users\ACER\Documents\.ALLIANCEBTP\alliance-mobtp\public\rapports")
if out.exists():
    shutil.rmtree(out)
out.mkdir(parents=True, exist_ok=True)

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

# Order by filename keywords — process double-evier before single-evier
META = [
    {
        "key": "fenetre",
        "slug": "fenetre-salle-it",
        "title": "Amenagement d'une fenetre — salle IT",
        "title_fr": "Aménagement d'une fenêtre — salle IT",
        "location": "Bureau / salle IT",
        "category": "batiments",
        "before_count": 1,
    },
    {
        "key": "conteneur",
        "slug": "conteneur-archives-drh",
        "title_fr": "Aménagement conteneur archives DRH",
        "location": "Conteneur archives DRH",
        "category": "batiments",
        "before_count": 2,
    },
    {
        "key": "abri bus",
        "slug": "abri-bus-zone-u",
        "title_fr": "Aménagement d'un abri bus",
        "location": "Zone U — conteneur transformé",
        "category": "travaux",
        "before_count": 1,
    },
    {
        "key": "grilles",
        "slug": "grilles-bordures-caniveaux-t1",
        "title_fr": "Installation de grilles et bordures de caniveaux",
        "location": "Terminal 1 — zone frigo",
        "category": "travaux",
        "before_count": 3,
        "refs": ["BDC OCT N°4291", "BDC OCT N°4292"],
    },
    {
        "key": "double",
        "slug": "double-evier-industriel-t1",
        "title_fr": "Installation d'un double évier industriel — T1",
        "location": "Terminal 1 — près de l'infirmerie",
        "category": "batiments",
        "before_count": 2,
    },
    {
        "key": "evier",
        "slug": "evier-industriel-t1",
        "title_fr": "Installation d'un évier industriel — T1",
        "location": "Terminal 1 — zone frigo",
        "category": "batiments",
        "before_count": 2,
        # note: Word file title wrongly says abri bus; objective is sink
    },
]


def pick_meta(filename: str):
    n = filename.lower()
    # normalize accents roughly
    n = (
        n.replace("é", "e")
        .replace("è", "e")
        .replace("ê", "e")
        .replace("à", "a")
        .replace("â", "a")
        .replace("ù", "u")
        .replace("ô", "o")
        .replace("î", "i")
        .replace("ï", "i")
        .replace("ç", "c")
    )
    if "double" in n:
        return next(m for m in META if m["slug"] == "double-evier-industriel-t1")
    if "evier" in n or "vier" in n:
        return next(m for m in META if m["slug"] == "evier-industriel-t1")
    for m in META:
        key = m["key"]
        if key in n:
            return m
    return None


def extract_text(docx: Path):
    with zipfile.ZipFile(docx) as z:
        root = ET.fromstring(z.read("word/document.xml"))
        lines = []
        for p in root.iter(W + "p"):
            parts = []
            for t in p.iter(W + "t"):
                if t.text:
                    parts.append(t.text)
            line = "".join(parts).strip()
            if line:
                lines.append(line)
        return lines


def extract_images(docx: Path, dest: Path):
    dest.mkdir(parents=True, exist_ok=True)
    names = []
    with zipfile.ZipFile(docx) as z:
        media = sorted(n for n in z.namelist() if n.startswith("word/media/"))
        for i, name in enumerate(media, 1):
            ext = Path(name).suffix.lower() or ".bin"
            fname = f"{i:02d}{ext}"
            (dest / fname).write_bytes(z.read(name))
            names.append(fname)
    return names


def parse_dates(lines):
    start = end = None
    obj = None
    for line in lines:
        if line.lower().startswith("objectif"):
            obj = re.sub(r"^Objectif\s*:\s*", "", line, flags=re.I).strip()
        m = re.search(r"travaux\s*:\s*(\d{2}/\d{2}/\d{4})", line, re.I)
        if m:
            if "fin" in line.lower():
                end = m.group(1)
            elif "but" in line.lower() or "début" in line.lower() or "debut" in line.lower():
                start = m.group(1)
            elif start is None:
                start = m.group(1)
            else:
                end = m.group(1)
    return obj, start, end


def dmy_to_iso(d):
    if not d:
        return None
    dd, mm, yy = d.split("/")
    return f"{yy}-{mm}-{dd}"


reports = []
for docx in sorted(rapport.glob("*.docx")):
    meta = pick_meta(docx.name)
    if not meta:
        print("SKIP", docx.name)
        continue
    lines = extract_text(docx)
    obj, start, end = parse_dates(lines)
    dest = out / meta["slug"]
    imgs = extract_images(docx, dest)
    split = meta["before_count"]
    before = imgs[:split]
    after = imgs[split:]
    cover = after[0] if after else before[0]
    item = {
        "id": meta["slug"],
        "slug": meta["slug"],
        "title": meta["title_fr"],
        "client": "OCT",
        "clientSlug": "oct",
        "location": meta["location"],
        "category": meta["category"],
        "objective": obj,
        "startDate": dmy_to_iso(start),
        "endDate": dmy_to_iso(end),
        "startLabel": start,
        "endLabel": end,
        "refs": meta.get("refs", []),
        "before": [f"/rapports/{meta['slug']}/{f}" for f in before],
        "after": [f"/rapports/{meta['slug']}/{f}" for f in after],
        "cover": f"/rapports/{meta['slug']}/{cover}",
        "sourceFile": docx.name,
    }
    reports.append(item)
    print(f"{meta['slug']}: {start}->{end} | {len(before)} avant / {len(after)} apres | {len(imgs)} imgs")
    print(" ", (obj or "")[:110])

# sort by end date desc
reports.sort(key=lambda r: r["endDate"] or "", reverse=True)
(out / "index.json").write_text(json.dumps(reports, ensure_ascii=False, indent=2), encoding="utf-8")
print("DONE", len(reports))
