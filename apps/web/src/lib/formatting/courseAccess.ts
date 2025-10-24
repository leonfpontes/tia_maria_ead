import type { DashboardCourse } from "../api/dashboard";

export function formatDateLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(date);
}

export function isCourseActive(course: DashboardCourse) {
  if (!course.expira_em) {
    return true;
  }
  const expiry = new Date(course.expira_em);
  return expiry.getTime() >= Date.now();
}

export function buildAccessWindow(course: DashboardCourse) {
  const released = formatDateLabel(course.liberado_em);
  if (course.expira_em) {
    const expires = formatDateLabel(course.expira_em);
    return `Acesso: ${released} → ${expires}`;
  }
  return `Liberado em ${released}`;
}
