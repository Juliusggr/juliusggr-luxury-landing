from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "public"


def pdf_escape(text: str) -> str:
    parts: list[str] = []
    for ch in text:
        encoded = ch.encode("cp1252")
        for byte in encoded:
            if byte in (0x28, 0x29, 0x5C):
                parts.append("\\" + chr(byte))
            elif byte < 32 or byte > 126:
                parts.append(f"\\{byte:03o}")
            else:
                parts.append(chr(byte))
    return "".join(parts)


def build(path: Path, lines: list[tuple[str, int, str]]) -> None:
    commands = ["BT"]
    for font, size, text in lines:
        commands.append(f"/{font} {size} Tf")
        commands.append(f"({pdf_escape(text)}) Tj")
        commands.append("0 -22 Td")
    commands.append("ET")
    stream = "\n".join(commands).encode("latin1")

    objects = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>",
        b"<< /Length %d >>\nstream\n" % len(stream) + stream + b"\nendstream",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >>",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>",
    ]

    blob = bytearray(b"%PDF-1.4\n")
    offsets = [0]
    for index, obj in enumerate(objects, start=1):
        offsets.append(len(blob))
        blob.extend(f"{index} 0 obj\n".encode("ascii"))
        blob.extend(obj)
        blob.extend(b"\nendobj\n")
    xref = len(blob)
    blob.extend(f"xref\n0 {len(objects) + 1}\n".encode("ascii"))
    blob.extend(b"0000000000 65535 f \n")
    for offset in offsets[1:]:
        blob.extend(f"{offset:010d} 00000 n \n".encode("ascii"))
    blob.extend(
        f"trailer << /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF".encode("ascii")
    )
    path.write_bytes(blob)


def positioned(blocks: list[tuple[str, int, int, int, str]]) -> list[tuple[str, int, str]]:
    # The simple builder always steps -22. Use explicit Tm instead.
    return []


def build_positioned(path: Path, rows: list[tuple[int, int, str, int, str]]) -> None:
    commands = ["BT"]
    for x, y, font, size, text in rows:
        commands.append(f"/{font} {size} Tf")
        commands.append(f"1 0 0 1 {x} {y} Tm")
        commands.append(f"({pdf_escape(text)}) Tj")
    commands.append("ET")
    # terracotta rule
    commands.insert(0, "0.784 0.294 0.067 RG")
    commands.insert(1, "72 700 m 540 700 l S")
    stream = "\n".join(commands).encode("latin1")

    objects = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>",
        b"<< /Length %d >>\nstream\n" % len(stream) + stream + b"\nendstream",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >>",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>",
    ]

    blob = bytearray(b"%PDF-1.4\n")
    offsets = [0]
    for index, obj in enumerate(objects, start=1):
        offsets.append(len(blob))
        blob.extend(f"{index} 0 obj\n".encode("ascii"))
        blob.extend(obj)
        blob.extend(b"\nendobj\n")
    xref = len(blob)
    blob.extend(f"xref\n0 {len(objects) + 1}\n".encode("ascii"))
    blob.extend(b"0000000000 65535 f \n")
    for offset in offsets[1:]:
        blob.extend(f"{offset:010d} 00000 n \n".encode("ascii"))
    blob.extend(
        f"trailer << /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF".encode("ascii")
    )
    path.write_bytes(blob)


spanish = [
    (72, 740, "F1", 28, "Julio Cesar"),
    (72, 708, "F2", 13, "Desarrollador Web y Software"),
    (72, 674, "F2", 11, "Juliusggrdev@proton.me"),
    (72, 658, "F2", 11, "github.com/Juliusggr"),
    (72, 620, "F1", 14, "Práctica"),
    (72, 596, "F2", 12, "Desarrollo aplicaciones web y de escritorio de extremo a extremo,"),
    (72, 580, "F2", 12, "desde interfaces reactivas con TypeScript, React y Astro hasta"),
    (72, 564, "F2", 12, "herramientas de alto rendimiento con Rust y Node.js."),
    (72, 540, "F2", 12, "Formación autodidacta guiada por arquitectura limpia y código"),
    (72, 524, "F2", 12, "en producción. Disponible para oportunidades laborales."),
    (72, 486, "F1", 14, "Proyecto"),
    (72, 462, "F2", 12, "Fablecraft — sandbox de vóxeles en el navegador, desde cero,"),
    (72, 446, "F2", 12, "sin librerías y sin assets externos."),
    (72, 428, "F2", 12, "https://github.com/Juliusggr/fablecraft"),
    (72, 390, "F1", 14, "Stack"),
    (72, 366, "F2", 12, "TypeScript, React, Astro, Tailwind CSS, Rust, Node.js, Git."),
]

english = [
    (72, 740, "F1", 28, "Julio Cesar"),
    (72, 708, "F2", 13, "Web & Software Developer"),
    (72, 674, "F2", 11, "Juliusggrdev@proton.me"),
    (72, 658, "F2", 11, "github.com/Juliusggr"),
    (72, 620, "F1", 14, "Practice"),
    (72, 596, "F2", 12, "I build web and desktop applications end to end, from reactive"),
    (72, 580, "F2", 12, "interfaces with TypeScript, React, and Astro to high-performance"),
    (72, 564, "F2", 12, "tools with Rust and Node.js."),
    (72, 540, "F2", 12, "A self-directed practice grounded in clean architecture and"),
    (72, 524, "F2", 12, "code that ships. Open to roles."),
    (72, 486, "F1", 14, "Project"),
    (72, 462, "F2", 12, "Fablecraft — a voxel sandbox in the browser, built from scratch,"),
    (72, 446, "F2", 12, "with no libraries and no external assets."),
    (72, 428, "F2", 12, "https://github.com/Juliusggr/fablecraft"),
    (72, 390, "F1", 14, "Stack"),
    (72, 366, "F2", 12, "TypeScript, React, Astro, Tailwind CSS, Rust, Node.js, Git."),
]

ROOT.mkdir(parents=True, exist_ok=True)
build_positioned(ROOT / "cv-es.pdf", spanish)
build_positioned(ROOT / "cv-en.pdf", english)
print("wrote", ROOT / "cv-es.pdf")
