import { prisma } from "@/lib/prisma";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin caracteres ambiguos

/** Genera un código legible del tipo AV-7K3M-9QX2. */
function generateCode() {
  const block = (n: number) =>
    Array.from(
      { length: n },
      () => CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]
    ).join("");
  return `AV-${block(4)}-${block(4)}`;
}

/**
 * Emite el certificado de un curso terminado. Es idempotente: si el alumno ya
 * tiene uno para ese curso, lo devuelve sin crear otro.
 */
export async function issueCertificate(courseId: string, studentId: string) {
  const existing = await prisma.certificate.findUnique({
    where: { courseId_studentId: { courseId, studentId } },
  });
  if (existing) return existing;

  // Reintenta si el código sorteado ya existiera.
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateCode();
    const clash = await prisma.certificate.findUnique({ where: { code } });
    if (clash) continue;

    return prisma.certificate.create({
      data: { courseId, studentId, code },
    });
  }

  throw new Error("No se pudo generar un código de certificado único");
}

/**
 * Emite los certificados que falten para todos los cursos que el alumno ya
 * completó. Cubre matrículas terminadas antes de que existiera esta función.
 */
export async function syncCertificates(studentId: string) {
  const completed = await prisma.enrollment.findMany({
    where: { studentId, progressPct: 100 },
    select: { courseId: true },
  });

  for (const { courseId } of completed) {
    await issueCertificate(courseId, studentId);
  }
}
