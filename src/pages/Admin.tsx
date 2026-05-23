import {
  Briefcase,
  ExternalLink,
  FileText,
  FolderKanban,
  Globe2,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  Mail,
  Save,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  Wrench,
} from 'lucide-react';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from 'react';
import {
  getAdminSession,
  getAdminContent,
  getAdminSubmissions,
  loginAdmin,
  logoutAdmin,
  saveAdminContent,
  uploadAdminAsset,
} from '../lib/api';
import { calculateReadTimeFromHtml, formatLongDate, sanitizeRichText } from '../lib/richText';
import { useSiteContent } from '../context/SiteContentContext';
import Logo from '../components/Logo';
import SmartMedia from '../components/SmartMedia';
import { getMediaSlots, updateMediaSlot, type MediaSlotDescriptor } from '../lib/mediaSlots';
import type {
  BlogPost,
  CareerRole,
  MediaFields,
  ProductDetailItem,
  ServiceDetailItem,
  SiteContent,
  SiteSubmissions,
} from '../types';

type AdminTab =
  | 'dashboard'
  | 'blogs'
  | 'products'
  | 'services'
  | 'careers'
  | 'media'
  | 'settings'
  | 'submissions';

export default function Admin() {
  const { refreshContent } = useSiteContent();
  const adminLoadRequestRef = useRef(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminContent, setAdminContent] = useState<SiteContent | null>(null);
  const [submissions, setSubmissions] = useState<SiteSubmissions>({ contacts: [], careers: [] });
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [selectedBlogId, setSelectedBlogId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedCareerId, setSelectedCareerId] = useState('');
  const [selectedMediaSlotId, setSelectedMediaSlotId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loginState, setLoginState] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    void restoreAdminSession();
  }, []);

  const blogPosts = adminContent?.blogPosts || [];
  const products = adminContent?.products || [];
  const services = adminContent?.services || [];
  const careerRoles = adminContent?.careerRoles || [];

  useEffect(() => {
    if (!blogPosts.length) {
      setSelectedBlogId('');
      return;
    }

    if (!blogPosts.some((item) => item.id === selectedBlogId)) {
      setSelectedBlogId(blogPosts[0].id);
    }
  }, [blogPosts, selectedBlogId]);

  useEffect(() => {
    if (!products.length) {
      setSelectedProductId('');
      return;
    }

    if (!products.some((item) => item.id === selectedProductId)) {
      setSelectedProductId(products[0].id);
    }
  }, [products, selectedProductId]);

  useEffect(() => {
    if (!services.length) {
      setSelectedServiceId('');
      return;
    }

    if (!services.some((item) => item.id === selectedServiceId)) {
      setSelectedServiceId(services[0].id);
    }
  }, [services, selectedServiceId]);

  useEffect(() => {
    if (!careerRoles.length) {
      setSelectedCareerId('');
      return;
    }

    if (!careerRoles.some((item) => item.id === selectedCareerId)) {
      setSelectedCareerId(careerRoles[0].id);
    }
  }, [careerRoles, selectedCareerId]);

  const selectedBlog = useMemo(
    () => blogPosts.find((item) => item.id === selectedBlogId) || null,
    [blogPosts, selectedBlogId],
  );
  const selectedProduct = useMemo(
    () => products.find((item) => item.id === selectedProductId) || null,
    [products, selectedProductId],
  );
  const selectedService = useMemo(
    () => services.find((item) => item.id === selectedServiceId) || null,
    [services, selectedServiceId],
  );
  const selectedCareer = useMemo(
    () => careerRoles.find((item) => item.id === selectedCareerId) || null,
    [careerRoles, selectedCareerId],
  );
  const mediaSlots = useMemo(
    () => (adminContent ? getMediaSlots(adminContent) : []),
    [adminContent],
  );
  const selectedMediaSlot = useMemo(
    () => mediaSlots.find((slot) => slot.id === selectedMediaSlotId) || null,
    [mediaSlots, selectedMediaSlotId],
  );

  useEffect(() => {
    if (!mediaSlots.length) {
      setSelectedMediaSlotId('');
      return;
    }

    if (!mediaSlots.some((slot) => slot.id === selectedMediaSlotId)) {
      setSelectedMediaSlotId(mediaSlots[0].id);
    }
  }, [mediaSlots, selectedMediaSlotId]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setIsLoading(true);

    try {
      await loginAdmin(loginState.email, loginState.password);
      setIsAuthenticated(true);
      setLoginState((current) => ({ ...current, password: '' }));
      setActiveTab('dashboard');
      const portalReady = await loadAdminData('login');
      setNotice(
        portalReady
          ? 'Admin access granted.'
          : 'Admin access granted. Some management data still needs to be reloaded.',
      );
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Could not sign in.');
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch {
      // Ignore logout failures and clear local session regardless.
    }

    setIsAuthenticated(false);
    setAdminContent(null);
    setSubmissions({ contacts: [], careers: [] });
    setNotice('Signed out successfully.');
  };

  const handleSave = async () => {
    if (!adminContent) {
      return;
    }

    setIsSaving(true);
    setError('');
    setNotice('');

    try {
      const saved = await saveAdminContent(adminContent);
      setAdminContent(saved);
      await refreshContent();
      setNotice('Changes saved successfully.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAssetUpload = async (file: File) => {
    if (!isAuthenticated) {
      throw new Error('You need to be signed in to upload files.');
    }

    const upload = await uploadAdminAsset(file);
    return upload.url;
  };

  const openWebsite = () => {
    window.open(`${window.location.origin}/`, '_blank', 'noopener,noreferrer');
  };

  if (!isAuthenticated) {
    return (
        <div className="min-h-screen bg-slate-950 px-4 py-16 text-white">
        <div className="mx-auto max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur">
          <div className="mb-6">
            <Logo size="md" taglineClassName="text-slate-300 dark:text-slate-300" />
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-blue-500/15 p-3 text-blue-300">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-300">
                BetterHub Management
              </p>
              <h1 className="mt-1 text-2xl font-black">Admin Login</h1>
            </div>
          </div>

          <p className="mt-6 text-sm leading-7 text-slate-300">
            Sign in to manage blogs, hiring, products, services, settings, uploads, and incoming
            website submissions.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <Field
              label="Email"
              value={loginState.email}
              onChange={(value) => setLoginState((current) => ({ ...current, email: value }))}
              placeholder="Enter your admin email"
              type="email"
              dark
            />
            <Field
              label="Password"
              value={loginState.password}
              onChange={(value) => setLoginState((current) => ({ ...current, password: value }))}
              placeholder="Password"
              type="password"
              dark
            />

            {error && <p className="text-sm text-rose-300">{error}</p>}
            {notice && <p className="text-sm text-emerald-300">{notice}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {isLoading ? 'Checking session...' : 'Enter Management'}
              {!isLoading && <Sparkles className="h-4 w-4" />}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col xl:flex-row">
        <aside className="border-b border-white/10 bg-slate-950/95 px-4 py-6 xl:min-h-screen xl:w-80 xl:border-b-0 xl:border-r">
          <div className="mb-6">
            <Logo size="md" taglineClassName="text-slate-300 dark:text-slate-300" />
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-blue-500/15 p-3 text-blue-300">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-300">
                BetterHub Management
              </p>
              <h2 className="mt-1 text-xl font-black">Admin Console</h2>
            </div>
            <button
              type="button"
              onClick={openWebsite}
              className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 hover:text-white"
              aria-label="Open website in a new tab"
              title="Open website"
            >
              <Globe2 className="h-4.5 w-4.5" />
            </button>
          </div>

          <nav className="mt-8 grid grid-cols-2 gap-3 xl:grid-cols-1" aria-label="Admin sections">
            <AdminTabButton
              icon={<LayoutDashboard className="h-4 w-4" />}
              label="Dashboard"
              active={activeTab === 'dashboard'}
              onClick={() => setActiveTab('dashboard')}
            />
            <AdminTabButton
              icon={<FileText className="h-4 w-4" />}
              label="Blogs"
              active={activeTab === 'blogs'}
              onClick={() => setActiveTab('blogs')}
            />
            <AdminTabButton
              icon={<FolderKanban className="h-4 w-4" />}
              label="Products"
              active={activeTab === 'products'}
              onClick={() => setActiveTab('products')}
            />
            <AdminTabButton
              icon={<Wrench className="h-4 w-4" />}
              label="Services"
              active={activeTab === 'services'}
              onClick={() => setActiveTab('services')}
            />
            <AdminTabButton
              icon={<Briefcase className="h-4 w-4" />}
              label="Careers"
              active={activeTab === 'careers'}
              onClick={() => setActiveTab('careers')}
            />
            <AdminTabButton
              icon={<ImagePlus className="h-4 w-4" />}
              label="Media"
              active={activeTab === 'media'}
              onClick={() => setActiveTab('media')}
            />
            <AdminTabButton
              icon={<Settings className="h-4 w-4" />}
              label="Settings"
              active={activeTab === 'settings'}
              onClick={() => setActiveTab('settings')}
            />
            <AdminTabButton
              icon={<Mail className="h-4 w-4" />}
              label="Submissions"
              active={activeTab === 'submissions'}
              onClick={() => setActiveTab('submissions')}
            />
          </nav>

          <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-300">
            This console manages public content, section media, hiring, contact details, uploads,
            and the inquiry inbox that comes from the live site.
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-slate-200 transition hover:bg-white/5"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </aside>

        <main className="flex-1 px-4 py-6 sm:px-6 xl:px-8">
          <div className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h1 className="text-2xl font-black">Website Management</h1>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Edit content, manage section media, publish blog entries, manage openings, and
                track submissions.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={openWebsite}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-100 transition hover:bg-white/5"
              >
                <ExternalLink className="h-4 w-4" />
                Open website
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !adminContent}
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </div>

          {error && <p className="mb-4 text-sm text-rose-300">{error}</p>}
          {notice && <p className="mb-4 text-sm text-emerald-300">{notice}</p>}

          {isLoading ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-sm text-slate-300">
              Loading management data...
            </div>
          ) : !adminContent ? (
            <AdminCard title="Management data unavailable">
              <EmptyEditorState
                title="The admin session is active, but the dashboard data did not load."
                description="Use retry to fetch the latest content and submissions again. If this keeps happening, restart the local API server so the updated admin account and session settings are applied."
                actionLabel="Retry loading"
                onAction={() => {
                  void loadAdminData('refresh');
                }}
              />
            </AdminCard>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardSection content={adminContent} submissions={submissions} />
              )}

              {activeTab === 'blogs' && (
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_1fr_1fr]">
                  <SelectionPanel
                    title="Blog posts"
                    description="Publish, revise, and preview articles."
                    items={blogPosts.map((post) => ({
                      id: post.id,
                      title: post.title,
                      meta: post.status,
                    }))}
                    selectedId={selectedBlogId}
                    onSelect={setSelectedBlogId}
                    onCreate={() => {
                      const next = createBlogDraft();
                      setAdminContent((current) =>
                        current
                          ? { ...current, blogPosts: [next, ...current.blogPosts] }
                          : current,
                      );
                      setSelectedBlogId(next.id);
                    }}
                    onDelete={() => {
                      if (!selectedBlog) {
                        return;
                      }
                      setAdminContent((current) =>
                        current
                          ? {
                              ...current,
                              blogPosts: current.blogPosts.filter((post) => post.id !== selectedBlog.id),
                            }
                          : current,
                      );
                    }}
                    canDelete={Boolean(selectedBlog)}
                  />

                  {selectedBlog ? (
                    <>
                      <AdminCard title="Blog editor">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <Field
                            label="Title"
                            value={selectedBlog.title}
                            onChange={(value) =>
                              updateBlog(selectedBlog.id, (post) => ({
                                ...post,
                                title: value,
                                id: selectedBlog.id.startsWith('blog-') ? slugify(value) : post.id,
                              }))
                            }
                            placeholder="Article title"
                          />
                          <Field
                            label="Category"
                            value={selectedBlog.category}
                            onChange={(value) =>
                              updateBlog(selectedBlog.id, (post) => ({ ...post, category: value }))
                            }
                            placeholder="Category"
                          />
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                          <Field
                            label="Author"
                            value={selectedBlog.author}
                            onChange={(value) =>
                              updateBlog(selectedBlog.id, (post) => ({ ...post, author: value }))
                            }
                            placeholder="Author name"
                          />
                          <Field
                            label="Publish date"
                            value={selectedBlog.publishedAt}
                            onChange={(value) =>
                              updateBlog(selectedBlog.id, (post) => ({ ...post, publishedAt: value }))
                            }
                            placeholder="2026-05-20"
                            type="date"
                          />
                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                              Status
                            </label>
                            <select
                              value={selectedBlog.status}
                              onChange={(event) =>
                                updateBlog(selectedBlog.id, (post) => ({
                                  ...post,
                                  status: event.target.value as BlogPost['status'],
                                }))
                              }
                              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
                            >
                              <option value="draft">Draft</option>
                              <option value="published">Published</option>
                            </select>
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                            Summary
                          </label>
                          <textarea
                            rows={3}
                            value={selectedBlog.summary}
                            onChange={(event) =>
                              updateBlog(selectedBlog.id, (post) => ({
                                ...post,
                                summary: event.target.value,
                              }))
                            }
                            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
                            placeholder="Short summary shown on the public blog listing."
                          />
                        </div>

                        <MediaFieldsEditor
                          value={selectedBlog}
                          onChange={(patch) =>
                            updateBlog(selectedBlog.id, (post) => ({ ...post, ...patch }))
                          }
                          onUpload={handleAssetUpload}
                        />

                        <div className="mt-4">
                          <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                            Article body
                          </label>
                          <RichTextEditor
                            value={selectedBlog.content}
                            onChange={(value) =>
                              updateBlog(selectedBlog.id, (post) => ({
                                ...post,
                                content: value,
                                readTime: calculateReadTimeFromHtml(value),
                              }))
                            }
                            onUploadImage={handleAssetUpload}
                          />
                        </div>
                      </AdminCard>

                      <AdminCard title="Live preview">
                        <BlogPreviewCard post={selectedBlog} />
                      </AdminCard>
                    </>
                  ) : (
                    <>
                      <AdminCard title="Blog editor">
                        <EmptyEditorState
                          title="No blog post selected"
                          description="Create a new article to start writing, formatting, and previewing it here."
                          actionLabel="Add first blog"
                          onAction={() => {
                            const next = createBlogDraft();
                            setAdminContent((current) =>
                              current
                                ? { ...current, blogPosts: [next, ...current.blogPosts] }
                                : current,
                            );
                            setSelectedBlogId(next.id);
                          }}
                        />
                      </AdminCard>
                      <AdminCard title="Live preview">
                        <EmptyEditorState
                          title="Preview unavailable"
                          description="Once you create or select a blog post, the live preview will appear here."
                        />
                      </AdminCard>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'products' && (
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_1fr]">
                  <SelectionPanel
                    title="Products"
                    description="Add, update, or remove public product entries."
                    items={products.map((item) => ({
                      id: item.id,
                      title: item.title,
                      meta: item.category,
                    }))}
                    selectedId={selectedProductId}
                    onSelect={setSelectedProductId}
                    onCreate={() => {
                      const next = createProductDraft();
                      setAdminContent((current) =>
                        current ? { ...current, products: [...current.products, next] } : current,
                      );
                      setSelectedProductId(next.id);
                    }}
                    onDelete={() => {
                      if (!selectedProduct) {
                        return;
                      }
                      setAdminContent((current) =>
                        current
                          ? {
                              ...current,
                              products: current.products.filter((item) => item.id !== selectedProduct.id),
                            }
                          : current,
                      );
                    }}
                    canDelete={Boolean(selectedProduct)}
                  />

                  {selectedProduct ? (
                    <AdminCard title="Product editor">
                      <ProductEditor
                        item={selectedProduct}
                        onChange={(next) =>
                          setAdminContent((current) =>
                            current
                              ? {
                                  ...current,
                                  products: current.products.map((item) =>
                                    item.id === next.id ? next : item,
                                  ),
                                }
                              : current,
                          )
                        }
                        onUpload={handleAssetUpload}
                      />
                    </AdminCard>
                  ) : (
                    <AdminCard title="Product editor">
                      <EmptyEditorState
                        title="No product selected"
                        description="Add a new product entry to edit its content, image, features, and rollout details."
                        actionLabel="Add first product"
                        onAction={() => {
                          const next = createProductDraft();
                          setAdminContent((current) =>
                            current ? { ...current, products: [...current.products, next] } : current,
                          );
                          setSelectedProductId(next.id);
                        }}
                      />
                    </AdminCard>
                  )}
                </div>
              )}

              {activeTab === 'services' && (
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_1fr]">
                  <SelectionPanel
                    title="Services"
                    description="Manage service cards and detail page content."
                    items={services.map((item) => ({
                      id: item.id,
                      title: item.title,
                      meta: item.tagline,
                    }))}
                    selectedId={selectedServiceId}
                    onSelect={setSelectedServiceId}
                    onCreate={() => {
                      const next = createServiceDraft();
                      setAdminContent((current) =>
                        current ? { ...current, services: [...current.services, next] } : current,
                      );
                      setSelectedServiceId(next.id);
                    }}
                    onDelete={() => {
                      if (!selectedService) {
                        return;
                      }
                      setAdminContent((current) =>
                        current
                          ? {
                              ...current,
                              services: current.services.filter((item) => item.id !== selectedService.id),
                            }
                          : current,
                      );
                    }}
                    canDelete={Boolean(selectedService)}
                  />

                  {selectedService ? (
                    <AdminCard title="Service editor">
                      <ServiceEditor
                        item={selectedService}
                        onChange={(next) =>
                          setAdminContent((current) =>
                            current
                              ? {
                                  ...current,
                                  services: current.services.map((item) =>
                                    item.id === next.id ? next : item,
                                  ),
                                }
                              : current,
                          )
                        }
                        onUpload={handleAssetUpload}
                      />
                    </AdminCard>
                  ) : (
                    <AdminCard title="Service editor">
                      <EmptyEditorState
                        title="No service selected"
                        description="Add a service to manage its detail-page copy, capabilities, technologies, and visuals."
                        actionLabel="Add first service"
                        onAction={() => {
                          const next = createServiceDraft();
                          setAdminContent((current) =>
                            current ? { ...current, services: [...current.services, next] } : current,
                          );
                          setSelectedServiceId(next.id);
                        }}
                      />
                    </AdminCard>
                  )}
                </div>
              )}

              {activeTab === 'careers' && (
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_1fr]">
                  <SelectionPanel
                    title="Career roles"
                    description="Manage live openings and talent pipeline roles."
                    items={careerRoles.map((item) => ({
                      id: item.id,
                      title: item.title,
                      meta: item.isOpen ? 'Open' : 'Closed',
                    }))}
                    selectedId={selectedCareerId}
                    onSelect={setSelectedCareerId}
                    onCreate={() => {
                      const next = createCareerDraft();
                      setAdminContent((current) =>
                        current
                          ? { ...current, careerRoles: [...current.careerRoles, next] }
                          : current,
                      );
                      setSelectedCareerId(next.id);
                    }}
                    onDelete={() => {
                      if (!selectedCareer) {
                        return;
                      }
                      setAdminContent((current) =>
                        current
                          ? {
                              ...current,
                              careerRoles: current.careerRoles.filter((item) => item.id !== selectedCareer.id),
                            }
                          : current,
                      );
                    }}
                    canDelete={Boolean(selectedCareer)}
                  />

                  {selectedCareer ? (
                    <AdminCard title="Career editor">
                      <CareerEditor
                        role={selectedCareer}
                        onChange={(next) =>
                          setAdminContent((current) =>
                            current
                              ? {
                                  ...current,
                                  careerRoles: current.careerRoles.map((item) =>
                                    item.id === next.id ? next : item,
                                  ),
                                }
                              : current,
                          )
                        }
                      />
                    </AdminCard>
                  ) : (
                    <AdminCard title="Career editor">
                      <EmptyEditorState
                        title="No role selected"
                        description="Add a role to manage openings, requirements, benefits, and hiring visibility."
                        actionLabel="Add first role"
                        onAction={() => {
                          const next = createCareerDraft();
                          setAdminContent((current) =>
                            current
                              ? { ...current, careerRoles: [...current.careerRoles, next] }
                              : current,
                          );
                          setSelectedCareerId(next.id);
                        }}
                      />
                    </AdminCard>
                  )}
                </div>
              )}

              {activeTab === 'media' && (
                <MediaManagementPanel
                  slots={mediaSlots}
                  selectedSlot={selectedMediaSlot}
                  selectedSlotId={selectedMediaSlotId}
                  onSelectSlot={setSelectedMediaSlotId}
                  onChange={(patch) =>
                    setAdminContent((current) =>
                      current && selectedMediaSlotId
                        ? updateMediaSlot(current, selectedMediaSlotId, patch)
                        : current,
                    )
                  }
                  onUpload={handleAssetUpload}
                />
              )}

              {activeTab === 'settings' && (
                <AdminCard title="Website settings">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field
                      label="Company name"
                      value={adminContent.siteSettings.companyName}
                      onChange={(value) =>
                        setAdminContent((current) =>
                          current
                            ? {
                                ...current,
                                siteSettings: { ...current.siteSettings, companyName: value },
                              }
                            : current,
                        )
                      }
                      placeholder="BetterHub Intelligence"
                    />
                    <Field
                      label="Contact email"
                      value={adminContent.siteSettings.contactEmail}
                      onChange={(value) =>
                        setAdminContent((current) =>
                          current
                            ? {
                                ...current,
                                siteSettings: { ...current.siteSettings, contactEmail: value },
                              }
                            : current,
                        )
                      }
                      placeholder="sales@betterhubai.com"
                    />
                    <Field
                      label="Phone"
                      value={adminContent.siteSettings.phone}
                      onChange={(value) =>
                        setAdminContent((current) =>
                          current
                            ? { ...current, siteSettings: { ...current.siteSettings, phone: value } }
                            : current,
                        )
                      }
                      placeholder="+971 4 324 9406"
                    />
                    <Field
                      label="WhatsApp"
                      value={adminContent.siteSettings.whatsapp}
                      onChange={(value) =>
                        setAdminContent((current) =>
                          current
                            ? { ...current, siteSettings: { ...current.siteSettings, whatsapp: value } }
                            : current,
                        )
                      }
                      placeholder="+971565227806"
                    />
                    <Field
                      label="Office label"
                      value={adminContent.siteSettings.officeLabel}
                      onChange={(value) =>
                        setAdminContent((current) =>
                          current
                            ? {
                                ...current,
                                siteSettings: { ...current.siteSettings, officeLabel: value },
                              }
                            : current,
                        )
                      }
                      placeholder="Deira Office"
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                        Office address lines
                      </label>
                      <textarea
                        rows={5}
                        value={adminContent.siteSettings.officeAddressLines.join('\n')}
                        onChange={(event) =>
                          setAdminContent((current) =>
                            current
                              ? {
                                  ...current,
                                  siteSettings: {
                                    ...current.siteSettings,
                                    officeAddressLines: linesToArray(event.target.value),
                                  },
                                }
                              : current,
                          )
                        }
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                        Office hours
                      </label>
                      <textarea
                        rows={5}
                        value={adminContent.siteSettings.officeHours}
                        onChange={(event) =>
                          setAdminContent((current) =>
                            current
                              ? {
                                  ...current,
                                  siteSettings: {
                                    ...current.siteSettings,
                                    officeHours: event.target.value,
                                  },
                                }
                              : current,
                          )
                        }
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
                      />
                    </div>
                  </div>
                </AdminCard>
              )}

              {activeTab === 'submissions' && (
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <AdminCard title={`Contact inquiries (${submissions.contacts.length})`}>
                    <SubmissionList
                      items={submissions.contacts.map((item) => ({
                        id: item.id,
                        title: item.subject,
                        subtitle: `${item.name} · ${item.email} · ${formatLongDate(item.createdAt)}`,
                        body: item.message,
                      }))}
                    />
                  </AdminCard>
                  <AdminCard title={`Career applications (${submissions.careers.length})`}>
                    <SubmissionList
                      items={submissions.careers.map((item) => ({
                        id: item.id,
                        title: item.roleTitle,
                        subtitle: `${item.name} · ${item.email} · ${formatLongDate(item.createdAt)}`,
                        body: `${item.coverText}\n\nPortfolio: ${item.portfolio}`,
                      }))}
                    />
                  </AdminCard>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );

  async function restoreAdminSession() {
    const requestId = ++adminLoadRequestRef.current;
    setIsLoading(true);
    setError('');

    try {
      await getAdminSession();
    } catch (loadError) {
      if (requestId !== adminLoadRequestRef.current) {
        return;
      }

      setIsAuthenticated(false);
      setAdminContent(null);
      setSubmissions({ contacts: [], careers: [] });
      if (loadError instanceof Error && loadError.message === 'Unauthorized.') {
        setError('');
      } else {
        setError(loadError instanceof Error ? loadError.message : 'Could not load admin data.');
      }
      setIsLoading(false);
      return;
    }

    if (requestId !== adminLoadRequestRef.current) {
      return;
    }

    setIsAuthenticated(true);
    await loadAdminData('restore', requestId);
  }

  async function loadAdminData(
    mode: 'restore' | 'login' | 'refresh' = 'refresh',
    requestId = ++adminLoadRequestRef.current,
  ) {
    setIsLoading(true);
    if (mode !== 'login') {
      setError('');
    }

    const [contentResult, submissionsResult] = await Promise.allSettled([
      getAdminContent(),
      getAdminSubmissions(),
    ]);

    if (requestId !== adminLoadRequestRef.current) {
      return false;
    }

    let nextError = '';

    if (contentResult.status === 'fulfilled') {
      setAdminContent(contentResult.value);
    } else {
      const contentError =
        contentResult.reason instanceof Error
          ? contentResult.reason.message
          : 'Could not load admin content.';

      if (contentError === 'Unauthorized.') {
        setIsAuthenticated(false);
        setAdminContent(null);
        setSubmissions({ contacts: [], careers: [] });
        setIsLoading(false);
        return false;
      }

      setAdminContent(null);
      nextError = contentError;
    }

    if (submissionsResult.status === 'fulfilled') {
      setSubmissions(submissionsResult.value);
    } else {
      const submissionsError =
        submissionsResult.reason instanceof Error
          ? submissionsResult.reason.message
          : 'Could not load submission inbox.';

      if (submissionsError === 'Unauthorized.') {
        setIsAuthenticated(false);
        setAdminContent(null);
        setSubmissions({ contacts: [], careers: [] });
        setIsLoading(false);
        return false;
      }

      setSubmissions({ contacts: [], careers: [] });
      nextError = nextError ? `${nextError} ${submissionsError}` : submissionsError;
    }

    setIsAuthenticated(true);
    setError(nextError);
    setIsLoading(false);
    return contentResult.status === 'fulfilled';
  }

  function updateBlog(id: string, updater: (post: BlogPost) => BlogPost) {
    setAdminContent((current) =>
      current
        ? {
            ...current,
            blogPosts: current.blogPosts.map((post) => (post.id === id ? updater(post) : post)),
          }
        : current,
    );
  }
}

function AdminTabButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.18em] transition ${
        active ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-200 hover:bg-white/10'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function AdminCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/20">
      <h2 className="text-lg font-black">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function DashboardSection({
  content,
  submissions,
}: {
  content: SiteContent;
  submissions: SiteSubmissions;
}) {
  const cards = [
    ['Published blogs', content.blogPosts.filter((post) => post.status === 'published').length],
    ['Products', content.products.length],
    ['Services', content.services.length],
    ['Open roles', content.careerRoles.filter((role) => role.isOpen).length],
    ['Contact inquiries', submissions.contacts.length],
    ['Career applications', submissions.careers.length],
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {cards.map(([label, value]) => (
        <div
          key={label}
          className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/20"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-300">{label}</p>
          <p className="mt-4 text-4xl font-black text-white">{value}</p>
        </div>
      ))}
    </div>
  );
}

function SelectionPanel({
  title,
  description,
  items,
  selectedId,
  onSelect,
  onCreate,
  onDelete,
  canDelete = true,
}: {
  title: string;
  description: string;
  items: Array<{ id: string; title: string; meta: string }>;
  selectedId: string;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: () => void;
  canDelete?: boolean;
}) {
  return (
    <AdminCard title={title}>
      <p className="text-sm leading-7 text-slate-300">{description}</p>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={onCreate}
          className="rounded-full bg-blue-600 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white"
        >
          Add new
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={!canDelete}
          className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-rose-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Trash2 className="h-4 w-4" />
          Remove
        </button>
      </div>
      <div className="mt-5 space-y-3">
        {items.length ? (
          items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`w-full rounded-[1.5rem] border px-4 py-3 text-left transition ${
                item.id === selectedId
                  ? 'border-blue-500/40 bg-blue-500/15'
                  : 'border-white/10 bg-slate-950 hover:bg-white/5'
              }`}
            >
              <p className="text-sm font-bold text-white">{item.title}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-slate-400">{item.meta}</p>
            </button>
          ))
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-slate-950/70 px-4 py-5 text-sm leading-7 text-slate-400">
            Nothing here yet. Use <span className="font-semibold text-white">Add new</span> to create the first item.
          </div>
        )}
      </div>
    </AdminCard>
  );
}

function EmptyEditorState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-slate-950/70 p-6 text-center">
      <p className="text-lg font-bold text-white">{title}</p>
      <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-full bg-blue-600 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-blue-700"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

function BlogPreviewCard({ post }: { post: BlogPost }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950">
      <SmartMedia
        image={post.image}
        video={post.video}
        poster={post.poster}
        alt={post.alt || post.title}
        mediaClassName="h-56 w-full object-cover"
        showVideoBadge
      />
      <div className="space-y-4 p-6">
        <span className="inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-300">
          {post.category}
        </span>
        <h3 className="text-2xl font-black text-white">{post.title}</h3>
        <p className="text-sm leading-7 text-slate-300">{post.summary}</p>
        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
          {post.author} · {formatLongDate(post.publishedAt)} · {post.readTime}
        </div>
        <div
          className="rich-article rounded-[1.5rem] border border-white/10 bg-white/5 p-5"
          dangerouslySetInnerHTML={{ __html: sanitizeRichText(post.content) }}
        />
      </div>
    </div>
  );
}

function MediaManagementPanel({
  slots,
  selectedSlot,
  selectedSlotId,
  onSelectSlot,
  onChange,
  onUpload,
}: {
  slots: MediaSlotDescriptor[];
  selectedSlot: MediaSlotDescriptor | null;
  selectedSlotId: string;
  onSelectSlot: (id: string) => void;
  onChange: (patch: Partial<MediaFields>) => void;
  onUpload: (file: File) => Promise<string>;
}) {
  const sections = Array.from(new Set(slots.map((slot) => slot.section)));
  const activeSection = selectedSlot?.section || sections[0] || '';
  const visibleSlots = slots.filter((slot) => slot.section === activeSection);

  if (!slots.length) {
    return (
      <AdminCard title="Media manager">
        <EmptyEditorState
          title="No media slots found"
          description="The current site content does not expose any editable media slots yet."
        />
      </AdminCard>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[340px_1fr_1fr]">
      <AdminCard title="Media directory">
        <div className="space-y-5">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Section
            </label>
            <select
              value={activeSection}
              onChange={(event) => {
                const nextSlots = slots.filter((slot) => slot.section === event.target.value);
                if (nextSlots[0]) {
                  onSelectSlot(nextSlots[0].id);
                }
              }}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
            >
              {sections.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Media slot
            </label>
            <select
              value={selectedSlotId}
              onChange={(event) => onSelectSlot(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
            >
              {visibleSlots.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {slot.label}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-300">
              {selectedSlot?.section || 'Media'}
            </p>
            <p className="mt-2 text-base font-bold text-white">
              {selectedSlot?.label || 'Select a slot'}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              {selectedSlot?.helper ||
                'Pick a section and slot to update the exact media shown on the public site.'}
            </p>
          </div>

          <div className="space-y-3">
            {visibleSlots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => onSelectSlot(slot.id)}
                className={`w-full rounded-[1.5rem] border px-4 py-3 text-left transition ${
                  slot.id === selectedSlotId
                    ? 'border-blue-500/40 bg-blue-500/15'
                    : 'border-white/10 bg-slate-950 hover:bg-white/5'
                }`}
              >
                <p className="text-sm font-bold text-white">{slot.label}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-slate-400">
                  {slot.helper}
                </p>
              </button>
            ))}
          </div>
        </div>
      </AdminCard>

      <AdminCard title="Media editor">
        {selectedSlot ? (
          <div className="space-y-5">
            <MediaFieldsEditor value={selectedSlot} onChange={onChange} onUpload={onUpload} />
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-4 text-sm leading-7 text-slate-400">
              Upload MP4, WebM, or MOV files here for hero-style sections that benefit from motion.
              Listing cards stay image-first on purpose so software, dashboards, blog cards, and
              catalog surfaces remain sharp and readable.
            </div>
          </div>
        ) : (
          <EmptyEditorState
            title="Select a media slot"
            description="Choose a slot from the directory to replace its image, video, poster, or alt text."
          />
        )}
      </AdminCard>

      <AdminCard title="Live preview">
        {selectedSlot ? (
          <div className="space-y-5">
            <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950">
              <SmartMedia
                image={selectedSlot.image}
                video={selectedSlot.video}
                poster={selectedSlot.poster}
                alt={selectedSlot.alt || selectedSlot.label}
                mediaClassName="aspect-[16/9] w-full object-cover"
                showVideoBadge
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950">
                <SmartMedia
                  image={selectedSlot.image}
                  video={selectedSlot.video}
                  poster={selectedSlot.poster}
                  alt={selectedSlot.alt || selectedSlot.label}
                  mediaClassName="aspect-[5/4] w-full object-cover"
                  showVideoBadge
                />
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-300">
                  Alt text
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  {selectedSlot.alt || selectedSlot.label}
                </p>
                <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-300">
                  Current sources
                </p>
                <p className="mt-2 break-all text-xs leading-6 text-slate-400">
                  Image: {selectedSlot.image || 'None'}
                </p>
                <p className="mt-2 break-all text-xs leading-6 text-slate-400">
                  Video: {selectedSlot.video || 'None'}
                </p>
                <p className="mt-2 break-all text-xs leading-6 text-slate-400">
                  Poster: {selectedSlot.poster || 'None'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <EmptyEditorState
            title="Preview unavailable"
            description="Select a slot from the media directory to preview how it will look before saving."
          />
        )}
      </AdminCard>
    </div>
  );
}

function MediaFieldsEditor({
  value,
  onChange,
  onUpload,
}: {
  value: MediaFields;
  onChange: (patch: Partial<MediaFields>) => void;
  onUpload: (file: File) => Promise<string>;
}) {
  return (
    <div className="space-y-4">
      <AssetField
        label="Primary image"
        value={value.image}
        onChange={(next) => onChange({ image: next })}
        onUpload={onUpload}
        accept="image/*"
        placeholder="/uploads/section-image.jpg"
        helper="Used whenever video is not present or as the still fallback."
      />

      <AssetField
        label="Video"
        value={value.video || ''}
        onChange={(next) => onChange({ video: next || undefined })}
        onUpload={onUpload}
        accept="video/mp4,video/webm,video/quicktime"
        placeholder="/uploads/section-video.mp4"
        helper="Best for hero slides, infrastructure, AI, and physical environment storytelling."
        buttonLabel="Upload video"
      />

      <AssetField
        label="Poster image"
        value={value.poster || ''}
        onChange={(next) => onChange({ poster: next || undefined })}
        onUpload={onUpload}
        accept="image/*"
        placeholder="/uploads/video-poster.jpg"
        helper="Shown before the video plays and used as the video fallback thumbnail."
      />

      <Field
        label="Alt text"
        value={value.alt || ''}
        onChange={(next) => onChange({ alt: next })}
        placeholder="Describe what the media shows in one clear sentence."
        required={false}
      />
    </div>
  );
}

function ProductEditor({
  item,
  onChange,
  onUpload,
}: {
  item: ProductDetailItem;
  onChange: (item: ProductDetailItem) => void;
  onUpload: (file: File) => Promise<string>;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Title"
          value={item.title}
          onChange={(value) => onChange({ ...item, title: value })}
          placeholder="Title"
        />
        <Field
          label="Category"
          value={item.category}
          onChange={(value) => onChange({ ...item, category: value })}
          placeholder="Category"
        />
      </div>

      <Field
        label="Tagline"
        value={item.tagline}
        onChange={(value) => onChange({ ...item, tagline: value })}
        placeholder="Tagline"
      />

      <div>
        <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
          Subtitle
        </label>
        <textarea
          rows={3}
          value={item.subtitle}
          onChange={(event) => onChange({ ...item, subtitle: event.target.value })}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
        />
      </div>

      <div>
        <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
          Long description
        </label>
        <textarea
          rows={5}
          value={item.longDescription}
          onChange={(event) => onChange({ ...item, longDescription: event.target.value })}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
        />
      </div>

      <MediaFieldsEditor
        value={item}
        onChange={(patch) => onChange({ ...item, ...patch })}
        onUpload={onUpload}
      />

      <LineListEditor
        label="Features"
        values={item.features}
        onChange={(values) => onChange({ ...item, features: values })}
      />

      <Field
        label="Advantage title"
        value={item.advantageTitle}
        onChange={(value) => onChange({ ...item, advantageTitle: value })}
        placeholder="Advantage title"
      />
      <StructuredAdvantageEditor
        values={item.advantages}
        onChange={(values) => onChange({ ...item, advantages: values })}
      />
      <Field
        label="Process title"
        value={item.processTitle}
        onChange={(value) => onChange({ ...item, processTitle: value })}
        placeholder="Process title"
      />
      <LineListEditor
        label="Implementation phases"
        values={item.processes}
        onChange={(values) => onChange({ ...item, processes: values })}
      />
    </div>
  );
}

function ServiceEditor({
  item,
  onChange,
  onUpload,
}: {
  item: ServiceDetailItem;
  onChange: (item: ServiceDetailItem) => void;
  onUpload: (file: File) => Promise<string>;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Title"
          value={item.title}
          onChange={(value) => onChange({ ...item, title: value })}
          placeholder="Title"
        />
        <Field
          label="Tech title"
          value={item.techTitle || ''}
          onChange={(value) => onChange({ ...item, techTitle: value })}
          placeholder="Technical standards"
        />
      </div>

      <Field
        label="Tagline"
        value={item.tagline}
        onChange={(value) => onChange({ ...item, tagline: value })}
        placeholder="Tagline"
      />

      <div>
        <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
          Subtitle
        </label>
        <textarea
          rows={3}
          value={item.subtitle}
          onChange={(event) => onChange({ ...item, subtitle: event.target.value })}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
        />
      </div>

      <div>
        <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
          Long description
        </label>
        <textarea
          rows={5}
          value={item.longDescription}
          onChange={(event) => onChange({ ...item, longDescription: event.target.value })}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
        />
      </div>

      <MediaFieldsEditor
        value={item}
        onChange={(patch) => onChange({ ...item, ...patch })}
        onUpload={onUpload}
      />

      <Field
        label="Bullet section title"
        value={item.bulletTitle}
        onChange={(value) => onChange({ ...item, bulletTitle: value })}
        placeholder="Capabilities"
      />
      <LineListEditor
        label="Bullets"
        values={item.bullets}
        onChange={(values) => onChange({ ...item, bullets: values })}
      />
      <LineListEditor
        label="Technologies"
        values={item.techs || []}
        onChange={(values) => onChange({ ...item, techs: values })}
      />
      <StructuredFeatureEditor
        label="Feature table"
        values={item.features || [{ featureTitle: '', description: '', impact: '' }]}
        onChange={(values) => onChange({ ...item, features: values })}
      />
    </div>
  );
}

function CareerEditor({ role, onChange }: { role: CareerRole; onChange: (role: CareerRole) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Title"
          value={role.title}
          onChange={(value) => onChange({ ...role, title: value })}
          placeholder="Role title"
        />
        <Field
          label="Department"
          value={role.department}
          onChange={(value) => onChange({ ...role, department: value })}
          placeholder="Department"
        />
        <Field
          label="Location"
          value={role.location}
          onChange={(value) => onChange({ ...role, location: value })}
          placeholder="Dubai, UAE"
        />
        <Field
          label="Type"
          value={role.type}
          onChange={(value) => onChange({ ...role, type: value })}
          placeholder="Full-Time"
        />
        <Field
          label="Experience"
          value={role.experience}
          onChange={(value) => onChange({ ...role, experience: value })}
          placeholder="3+ years"
        />
        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Status
          </label>
          <select
            value={role.isOpen ? 'open' : 'closed'}
            onChange={(event) => onChange({ ...role, isOpen: event.target.value === 'open' })}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
          Summary
        </label>
        <textarea
          rows={4}
          value={role.summary}
          onChange={(event) => onChange({ ...role, summary: event.target.value })}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
        />
      </div>

      <LineListEditor
        label="Requirements"
        values={role.requirements}
        onChange={(values) => onChange({ ...role, requirements: values })}
      />
      <LineListEditor
        label="Benefits"
        values={role.benefits}
        onChange={(values) => onChange({ ...role, benefits: values })}
      />
    </div>
  );
}

function SubmissionList({
  items,
}: {
  items: Array<{ id: string; title: string; subtitle: string; body: string }>;
}) {
  return (
    <div className="space-y-4">
      {items.length ? (
        items.map((item) => (
          <div key={item.id} className="rounded-[1.5rem] border border-white/10 bg-slate-950 p-4">
            <h3 className="text-sm font-bold text-white">{item.title}</h3>
            <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-slate-400">{item.subtitle}</p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-300">{item.body}</p>
          </div>
        ))
      ) : (
        <p className="text-sm text-slate-300">No submissions yet.</p>
      )}
    </div>
  );
}

function StructuredFeatureEditor({
  label,
  values,
  onChange,
}: {
  label: string;
  values: Array<{ featureTitle: string; description: string; impact: string }>;
  onChange: (values: Array<{ featureTitle: string; description: string; impact: string }>) => void;
}) {
  const update = (
    index: number,
    key: 'featureTitle' | 'description' | 'impact',
    value: string,
  ) => {
    onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)));
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
          {label}
        </label>
        <button
          type="button"
          onClick={() => onChange([...values, { featureTitle: '', description: '', impact: '' }])}
          className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-200"
        >
          Add row
        </button>
      </div>
      <div className="space-y-3">
        {values.map((feature, index) => (
          <div key={`${feature.featureTitle}-${index}`} className="rounded-[1.5rem] border border-white/10 bg-slate-950 p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <Field
                label="Feature"
                value={feature.featureTitle}
                onChange={(value) => update(index, 'featureTitle', value)}
                placeholder="Feature"
              />
              <Field
                label="Description"
                value={feature.description}
                onChange={(value) => update(index, 'description', value)}
                placeholder="Description"
              />
              <Field
                label="Impact"
                value={feature.impact}
                onChange={(value) => update(index, 'impact', value)}
                placeholder="Impact"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StructuredAdvantageEditor({
  values,
  onChange,
}: {
  values: Array<{ feature: string; standard: string; need: string }>;
  onChange: (values: Array<{ feature: string; standard: string; need: string }>) => void;
}) {
  const update = (index: number, key: 'feature' | 'standard' | 'need', value: string) => {
    onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)));
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
          Advantage table
        </label>
        <button
          type="button"
          onClick={() => onChange([...values, { feature: '', standard: '', need: '' }])}
          className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-200"
        >
          Add row
        </button>
      </div>
      <div className="space-y-3">
        {values.map((advantage, index) => (
          <div key={`${advantage.feature}-${index}`} className="rounded-[1.5rem] border border-white/10 bg-slate-950 p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <Field
                label="Capability"
                value={advantage.feature}
                onChange={(value) => update(index, 'feature', value)}
                placeholder="Capability"
              />
              <Field
                label="BetterHub standard"
                value={advantage.standard}
                onChange={(value) => update(index, 'standard', value)}
                placeholder="Standard"
              />
              <Field
                label="Business value"
                value={advantage.need}
                onChange={(value) => update(index, 'need', value)}
                placeholder="Business value"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LineListEditor({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </label>
      <textarea
        rows={5}
        value={values.join('\n')}
        onChange={(event) => onChange(linesToArray(event.target.value))}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
      />
      <p className="mt-2 text-[11px] text-slate-500">Use one item per line.</p>
    </div>
  );
}

function ImageField({
  label,
  value,
  onChange,
  onUpload,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onUpload: (file: File) => Promise<string>;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const url = await onUpload(file);
    onChange(url);
    event.target.value = '';
  };

  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="/uploads/example.png"
          className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-200"
        >
          <ImagePlus className="h-4 w-4" />
          Upload
        </button>
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFileChange} />
    </div>
  );
}

function VideoField({
  label,
  value,
  onChange,
  onUpload,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  onUpload: (file: File) => Promise<string>;
}) {
  return (
    <AssetField
      label={label}
      value={value || ''}
      onChange={onChange}
      onUpload={onUpload}
      accept="video/mp4,video/webm,video/quicktime"
      placeholder="/uploads/video.mp4"
      helper="Upload or paste a direct MP4, WebM, or MOV file URL."
      buttonLabel="Upload video"
    />
  );
}

function AssetField({
  label,
  value,
  onChange,
  onUpload,
  accept,
  placeholder,
  helper,
  buttonLabel = 'Upload',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onUpload: (file: File) => Promise<string>;
  accept: string;
  placeholder: string;
  helper?: string;
  buttonLabel?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const url = await onUpload(file);
    onChange(url);
    event.target.value = '';
  };

  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-200"
        >
          <ImagePlus className="h-4 w-4" />
          {buttonLabel}
        </button>
      </div>
      {helper ? <p className="mt-2 text-[11px] text-slate-500">{helper}</p> : null}
      <input ref={fileInputRef} type="file" accept={accept} hidden onChange={handleFileChange} />
    </div>
  );
}

function RichTextEditor({
  value,
  onChange,
  onUploadImage,
}: {
  value: string;
  onChange: (value: string) => void;
  onUploadImage: (file: File) => Promise<string>;
}) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const exec = (command: string, argument?: string) => {
    document.execCommand(command, false, argument);
    onChange(editorRef.current?.innerHTML || '');
  };

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const url = await onUploadImage(file);
    exec('insertImage', url);
    event.target.value = '';
  };

  return (
    <div className="mt-2 rounded-[1.5rem] border border-white/10 bg-slate-950">
      <div className="flex flex-wrap gap-2 border-b border-white/10 p-3">
        {[
          { label: 'Bold', action: () => exec('bold') },
          { label: 'Italic', action: () => exec('italic') },
          { label: 'H2', action: () => exec('formatBlock', '<h2>') },
          { label: 'H3', action: () => exec('formatBlock', '<h3>') },
          { label: 'Quote', action: () => exec('formatBlock', '<blockquote>') },
          { label: 'Bullets', action: () => exec('insertUnorderedList') },
          { label: 'Numbers', action: () => exec('insertOrderedList') },
          { label: 'Paragraph', action: () => exec('formatBlock', '<p>') },
          {
            label: 'Link',
            action: () => {
              const href = window.prompt('Enter a URL');
              if (href) exec('createLink', href);
            },
          },
        ].map(({ label, action }) => (
          <button
            key={label}
            type="button"
            onClick={action}
            className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-200"
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-200"
        >
          <ImagePlus className="h-3.5 w-3.5" />
          Image
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleUpload} />
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(editorRef.current?.innerHTML || '')}
        className="rich-article min-h-[320px] p-5 text-sm text-white outline-none"
      />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  dark = false,
  required = true,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  dark?: boolean;
  required?: boolean;
}) {
  const baseClasses = dark
    ? 'border-white/10 bg-slate-950 text-white'
    : 'border-white/10 bg-slate-950 text-white';

  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:border-blue-500 ${baseClasses}`}
      />
    </div>
  );
}

function linesToArray(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `item-${Date.now()}`
  );
}

function createBlogDraft(): BlogPost {
  return {
    id: `blog-${Date.now()}`,
    title: 'New blog post',
    summary: '',
    content: '<p>Start writing here...</p>',
    category: 'Insights',
    publishedAt: new Date().toISOString().slice(0, 10),
    author: 'BetterHub Team',
    readTime: '1 min read',
    image: '/uploads/page-blog-hero.png',
    status: 'draft',
  };
}

function createProductDraft(): SiteContent['products'][number] {
  return {
    id: `product-${Date.now()}`,
    title: 'New product',
    category: 'Category',
    subtitle: '',
    tagline: '',
    longDescription: '',
    features: [''],
    advantageTitle: 'Why it matters',
    advantages: [{ feature: '', standard: '', need: '' }],
    processTitle: 'Implementation flow',
    processes: [''],
    image: '/uploads/page-products-catalog.png',
  };
}

function createServiceDraft(): SiteContent['services'][number] {
  return {
    id: `service-${Date.now()}`,
    title: 'New service',
    subtitle: '',
    longDescription: '',
    tagline: '',
    bulletTitle: 'Capabilities',
    bullets: [''],
    techTitle: 'Technology stack',
    techs: [''],
    features: [{ featureTitle: '', description: '', impact: '' }],
    image: '/uploads/page-services-catalog.png',
  };
}

function createCareerDraft(): CareerRole {
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
