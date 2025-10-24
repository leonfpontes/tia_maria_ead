const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export type DashboardCourse = {
  id: string;
  nome: string;
  descricao?: string | null;
  liberado_em: string;
  expira_em?: string | null;
  ativo?: boolean | null;
};

export type DashboardCertificate = {
  id: string;
  curso_id: string;
  curso_nome: string;
  url_certificado?: string | null;
  conquistado_em: string;
};

export type DashboardResponse = {
  nome?: string;
  email?: string;
  tipo?: "admin" | "aluno";
  cursos?: DashboardCourse[];
  certificados?: DashboardCertificate[];
};

export async function fetchDashboard(token: string): Promise<DashboardResponse> {
  const response = await fetch(`${API_BASE}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    const error = new Error("UNAUTHORIZED");
    throw error;
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const message = typeof data?.detail === "string" ? data.detail : "Não foi possível carregar seus dados.";
    throw new Error(message);
  }

  return (await response.json()) as DashboardResponse;
}
