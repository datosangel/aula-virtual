import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Password123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@aulavirtual.test" },
    update: {},
    create: {
      name: "Administrador General",
      email: "admin@aulavirtual.test",
      passwordHash: password,
      role: "ADMIN",
    },
  });

  const docente = await prisma.user.upsert({
    where: { email: "docente@aulavirtual.test" },
    update: {},
    create: {
      name: "Ana Docente",
      email: "docente@aulavirtual.test",
      passwordHash: password,
      role: "DOCENTE",
    },
  });

  const alumno = await prisma.user.upsert({
    where: { email: "alumno@aulavirtual.test" },
    update: {},
    create: {
      name: "Luis Alumno",
      email: "alumno@aulavirtual.test",
      passwordHash: password,
      role: "ALUMNO",
    },
  });

  const categoryNames = [
    "Marketing Digital",
    "Tecnología",
    "Diseño",
    "Negocios",
    "Idiomas",
  ];
  const categories: Record<string, string> = {};
  for (const name of categoryNames) {
    const c = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categories[name] = c.id;
  }
  const category = { id: categories["Marketing Digital"] };

  // Reset course data so the seed can be re-run cleanly during development.
  await prisma.course.deleteMany({ where: { teacherId: docente.id } });

  const course = await prisma.course.create({
    data: {
      title: "Marketing Digital desde Cero",
      description:
        "Aprende los fundamentos del marketing digital: estrategia, contenidos y publicidad online.",
      level: "BASICO",
      status: "PUBLICADO",
      durationHrs: 20,
      teacherId: docente.id,
      categoryId: category.id,
      modules: {
        create: [
          {
            title: "Introducción",
            order: 1,
            lessons: {
              create: [
                {
                  title: "Bienvenida al curso",
                  type: "VIDEO",
                  order: 1,
                  contentUrl:
                    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
                  body: "Un repaso rápido de lo que aprenderás en este curso y cómo está organizado.",
                },
                {
                  title: "¿Qué es el marketing digital?",
                  type: "VIDEO",
                  order: 2,
                  contentUrl:
                    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
                  body: "Conceptos clave: canales digitales, embudo de conversión y KPIs.",
                },
                {
                  title: "Guía de conceptos (PDF)",
                  type: "PDF",
                  order: 3,
                  contentUrl:
                    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                },
              ],
            },
          },
          {
            title: "Estrategias",
            order: 2,
            lessons: {
              create: [
                {
                  title: "Redes sociales y contenido",
                  type: "VIDEO",
                  order: 1,
                  contentUrl:
                    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
                  body: "Cómo planificar un calendario de contenidos efectivo.",
                },
                {
                  title: "Publicidad paga (SEM)",
                  type: "ACTIVIDAD",
                  order: 2,
                  body: "Lee el material y responde: ¿cuál es la diferencia entre SEO y SEM?",
                },
              ],
            },
          },
          {
            title: "Evaluación final",
            order: 3,
            lessons: {
              create: [
                {
                  title: "Cierre y siguientes pasos",
                  type: "VIDEO",
                  order: 1,
                  contentUrl:
                    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
                  body: "Resumen del curso y recomendaciones para seguir aprendiendo.",
                },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.enrollment.create({
    data: { courseId: course.id, studentId: alumno.id },
  });

  // Catálogo adicional: cursos publicados en los que el alumno aún NO está
  // matriculado, para que el catálogo tenga algo real que mostrar.
  const catalogo = [
    {
      title: "Programación Web con JavaScript",
      description:
        "HTML, CSS y JavaScript desde los fundamentos hasta tu primer proyecto publicado.",
      category: "Tecnología",
      level: "BASICO" as const,
      durationHrs: 40,
      modules: ["Fundamentos de HTML", "Estilos con CSS", "JavaScript básico"],
    },
    {
      title: "Diseño Gráfico Digital",
      description:
        "Composición, teoría del color y tipografía aplicados a piezas de portafolio.",
      category: "Diseño",
      level: "INTERMEDIO" as const,
      durationHrs: 30,
      modules: ["Principios de composición", "Color y tipografía"],
    },
    {
      title: "Finanzas Personales",
      description:
        "Presupuesto, ahorro e inversión explicados con casos prácticos.",
      category: "Negocios",
      level: "BASICO" as const,
      durationHrs: 15,
      modules: ["Tu presupuesto", "Ahorro e inversión"],
    },
    {
      title: "Inglés de Negocios",
      description:
        "Vocabulario y expresiones para reuniones, correos y presentaciones.",
      category: "Idiomas",
      level: "INTERMEDIO" as const,
      durationHrs: 25,
      modules: ["Correos profesionales", "Reuniones y presentaciones"],
    },
    {
      title: "Excel Avanzado",
      description:
        "Tablas dinámicas, funciones de búsqueda y automatización con macros.",
      category: "Negocios",
      level: "AVANZADO" as const,
      durationHrs: 20,
      modules: ["Funciones avanzadas", "Tablas dinámicas", "Macros"],
    },
  ];

  for (const c of catalogo) {
    await prisma.course.create({
      data: {
        title: c.title,
        description: c.description,
        level: c.level,
        status: "PUBLICADO",
        durationHrs: c.durationHrs,
        teacherId: docente.id,
        categoryId: categories[c.category],
        modules: {
          create: c.modules.map((title, i) => ({
            title,
            order: i + 1,
            lessons: {
              create: [
                {
                  title: `Introducción a ${title}`,
                  type: "VIDEO" as const,
                  order: 1,
                  contentUrl:
                    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
                  body: `Primera lección del módulo "${title}".`,
                },
              ],
            },
          })),
        },
      },
    });
  }

  console.log({ admin: admin.email, docente: docente.email, alumno: alumno.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
