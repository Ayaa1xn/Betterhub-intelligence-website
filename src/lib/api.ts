import type {
  CareerRole,
  CareerSubmission,
  ContactSubmission,
  SiteContent,
  SiteSubmissions,
} from '../types';

const JSON_HEADERS = {
  'Content-Type': 'application/json',
};

export interface AdminSession {
  user: {
    email: string;
    role: 'admin';
  };
}

export async function fetchSiteContent() {
  return request<SiteContent>('/api/content');
}

export async function submitContactInquiry(
  payload: Omit<ContactSubmission, 'id' | 'type' | 'createdAt'> & { website?: string },
) {
  return request<{ ok: true }>('/api/contact', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
}

export async function submitCareerApplication(
  payload: Omit<CareerSubmission, 'id' | 'type' | 'createdAt'> & { website?: string },
) {
  return request<{ ok: true }>('/api/careers/apply', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
}

export async function loginAdmin(email: string, password: string) {
  return request<AdminSession>('/api/admin/login', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ email, password }),
  });
}

export async function getAdminSession() {
  return request<AdminSession>('/api/admin/me');
}

export async function getAdminContent() {
  return request<SiteContent>('/api/admin/content', {
    headers: JSON_HEADERS,
  });
}

export async function saveAdminContent(content: SiteContent) {
  return request<SiteContent>('/api/admin/content', {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify({ content }),
  });
}

export async function getAdminSubmissions() {
  return request<SiteSubmissions>('/api/admin/submissions', {
    headers: JSON_HEADERS,
  });
}

export async function uploadAdminAsset(file: File) {
  const dataUrl = await fileToDataUrl(file);
  return request<{ url: string; fileName: string }>('/api/admin/uploads', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({
      fileName: file.name,
      dataUrl,
    }),
  });
}

export async function logoutAdmin() {
  return request<{ ok: true }>('/api/admin/logout', {
    method: 'POST',
    headers: JSON_HEADERS,
  });
}

export function createCareerDraft(): CareerRole {
  return {
    id: `role-${Date.now()}`,
    title: 'New role',
    department: 'Department',
    location: 'Dubai, UAE',
    type: 'Full-Time',
    experience: '3+ years',
    summary: '',
    requirements: [''],
    benefits: [''],
    isOpen: true,
  };
}

async function request<T>(input: string, init?: RequestInit) {
  const response = await fetch(input, {
    credentials: 'same-origin',
    ...init,
  });
  if (!response.ok) {
    const errorBody = (await safeJson(response)) as { message?: string } | null;
    throw new Error(errorBody?.message || 'Request failed.');
  }

  return (await response.json()) as T;
}

async function safeJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read file.'));
    reader.readAsDataURL(file);
  });
}
