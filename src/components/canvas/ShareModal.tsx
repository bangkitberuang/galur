'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Share2, 
  Users, 
  Link as LinkIcon, 
  Download, 
  Upload, 
  Code, 
  Copy, 
  Check, 
  X, 
  Globe, 
  UserCheck, 
  Sparkles,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  FileCode
} from 'lucide-react';
import { Node, Edge } from '@xyflow/react';
import { CanvasPageConfig } from './CanvasPageFrame';
import { CollabUser, COLLAB_COLORS } from '@/lib/collaboration';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagramTitle: string;
  diagramId: string;
  nodes: Node[];
  edges: Edge[];
  pageConfig: CanvasPageConfig;
  activeRoomId: string;
  onJoinRoom: (newRoomId: string) => void;
  collabUsers: CollabUser[];
  currentUser: CollabUser;
  onUpdateUserProfile: (name: string, color: string) => void;
  onImportDiagram: (imported: { title: string; nodes: Node[]; edges: Edge[]; pageConfig?: CanvasPageConfig }) => void;
}

export default function ShareModal({
  isOpen,
  onClose,
  diagramTitle,
  diagramId,
  nodes,
  edges,
  pageConfig,
  activeRoomId,
  onJoinRoom,
  collabUsers,
  currentUser,
  onUpdateUserProfile,
  onImportDiagram,
}: ShareModalProps) {
  const [activeTab, setActiveTab] = useState<'collab' | 'link' | 'file' | 'embed'>('collab');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [roomInput, setRoomInput] = useState(activeRoomId);
  const [nameInput, setNameInput] = useState(currentUser.name);
  const [colorInput, setColorInput] = useState(currentUser.color);
  const [profileSaved, setProfileSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNameInput(currentUser.name);
    setColorInput(currentUser.color);
  }, [currentUser]);

  useEffect(() => {
    setRoomInput(activeRoomId);
  }, [activeRoomId]);

  if (!isOpen) return null;

  // URL origin browser
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  
  // 1. Tautan Kolaborasi Real-Time (Aktif hanya saat room dibuat / dibuka)
  const effectiveRoomId = activeRoomId || `room_${diagramId || Date.now()}`;
  const collabUrl = `${origin}/editor?id=${diagramId}&room=${encodeURIComponent(effectiveRoomId)}`;

  // 2. Tautan Snapshot Data
  const generateSnapshotLink = () => {
    try {
      const payload = {
        title: diagramTitle,
        nodes,
        edges,
        pageConfig,
      };
      const jsonStr = JSON.stringify(payload);
      // Kompresi base64 aman untuk URL
      const base64 = typeof window !== 'undefined' ? btoa(unescape(encodeURIComponent(jsonStr))) : '';
      return `${origin}/editor?share=${encodeURIComponent(base64)}`;
    } catch {
      return collabUrl;
    }
  };

  const shareLinkUrl = generateSnapshotLink();

  // 3. Kode Semat Iframe
  const embedCode = `<iframe src="${origin}/editor?id=${diagramId}&embed=true" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`;

  // Salin Tautan Kolaborasi
  const handleCopyCollabLink = () => {
    if (!activeRoomId) {
      onJoinRoom(effectiveRoomId);
    }
    navigator.clipboard.writeText(collabUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Salin Tautan Snapshot
  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareLinkUrl);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2500);
  };

  // Salin Kode Semat
  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2500);
  };

  // Simpan Profil Kolaborator
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    onUpdateUserProfile(trimmed, colorInput);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  // Masuk / Buat Ruang Baru
  const handleSwitchRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanRoom = roomInput.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    if (cleanRoom && cleanRoom !== activeRoomId) {
      onJoinRoom(cleanRoom);
    }
  };

  // Unduh File Proyek (.galur)
  const handleDownloadProjectFile = () => {
    const projectData = {
      format: 'galur-diagram-project',
      version: '1.3.0',
      id: diagramId,
      title: diagramTitle,
      savedAt: new Date().toISOString(),
      nodes,
      edges,
      pageConfig,
    };

    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${diagramTitle.toLowerCase().replace(/\s+/g, '-') || 'diagram'}.galur`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Impor File Proyek (.galur / .json)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (parsed.nodes && Array.isArray(parsed.nodes)) {
          onImportDiagram({
            title: parsed.title || file.name.replace(/\.(galur|json)$/, ''),
            nodes: parsed.nodes,
            edges: parsed.edges || [],
            pageConfig: parsed.pageConfig,
          });
          onClose();
        } else {
          alert('Format file tidak valid. Pastikan file berisi data diagram GALUR.');
        }
      } catch (err) {
        alert('Gagal membaca file proyek: format JSON rusak.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150 no-print select-none">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Bagikan Diagram & Kolaborasi Real-Time
              </h2>
              <p className="text-[11px] text-slate-500">
                Desain bersama rekan secara langsung atau simpan dan ekspor file proyek
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigasi */}
        <div className="flex border-b border-slate-200 px-4 pt-2 bg-slate-50/30 gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('collab')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'collab'
                ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Kolaborasi Langsung</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
              {collabUsers.length + 1}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('link')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'link'
                ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Tautan Berbagi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'file'
                ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>File Proyek (.galur)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('embed')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'embed'
                ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Sematkan (Embed)</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* TAB 1: KOLABORASI REAL-TIME */}
          {activeTab === 'collab' && (
            <div className="space-y-4">
              {/* Box Undangan Tautan Ruang */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${activeRoomId ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                    <span className="font-bold text-slate-800">
                      {activeRoomId ? 'Ruang Kolaborasi Aktif' : 'Kanvas Privat (Belum Ada Ruang Aktif)'}
                    </span>
                  </div>
                  {activeRoomId ? (
                    <span className="font-mono text-[11px] bg-white border border-blue-200 px-2 py-0.5 rounded-md text-blue-800 font-bold">
                      {activeRoomId}
                    </span>
                  ) : (
                    <span className="text-[10px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md text-slate-500 font-semibold">
                      Mode Privat
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Salin tautan ini dan kirimkan ke rekan kerja Anda. Siapa pun yang membuka tautan ini akan langsung masuk ke kanvas yang sama dan dapat mendesain secara bersamaan secara *real-time*!
                </p>

                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={collabUrl}
                    className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 font-mono text-[11px] select-all focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleCopyCollabLink}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all cursor-pointer shadow-xs ${
                      copiedLink ? 'bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Tersalin!' : 'Salin Tautan'}</span>
                  </button>
                </div>
              </div>

              {/* Ganti / Masuk Ruang Lain */}
              <form onSubmit={handleSwitchRoom} className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Ganti / Masuk Kode Ruang Lain:
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={roomInput}
                    onChange={(e) => setRoomInput(e.target.value)}
                    placeholder="Contoh: tim-desain-proyek"
                    className="flex-1 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden font-medium"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Masuk Ruang
                  </button>
                </div>
              </form>

              {/* Pengaturan Profil Saya (Nama & Warna Kursor) */}
              <form onSubmit={handleSaveProfile} className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Profil Kolaborator Saya</span>
                  </span>
                  {profileSaved && (
                    <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Tersimpan!
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Nama Tampilan Anda:
                    </label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="Nama Anda..."
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Warna Kursor Anda:
                    </label>
                    <div className="flex items-center gap-1.5">
                      {COLLAB_COLORS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setColorInput(c)}
                          className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                            colorInput === c ? 'scale-115 border-slate-800 shadow-sm' : 'border-white hover:scale-105'
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                >
                  Terapkan Nama & Warna
                </button>
              </form>

              {/* Daftar Pengguna Aktif di Ruang Ini / Status Privat */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    {activeRoomId ? `Pengguna Online di Ruang (${collabUsers.length + 1}):` : 'Status Sesi Kanvas:'}
                  </span>
                  {!activeRoomId && (
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      Privat (Hanya Anda)
                    </span>
                  )}
                </div>

                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-40 overflow-y-auto">
                  {/* Diri Sendiri */}
                  <div className="p-2 flex items-center justify-between bg-blue-50/30">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full text-white font-bold text-[10px] flex items-center justify-center shadow-xs"
                        style={{ backgroundColor: currentUser.color }}
                      >
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-slate-800">{currentUser.name}</span>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      {activeRoomId ? 'Anda' : 'Anda (Kanvas Privat)'}
                    </span>
                  </div>

                  {/* Rekan Kolaborasi jika ada room */}
                  {activeRoomId && collabUsers.map((u) => (
                    <div key={u.id} className="p-2 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full text-white font-bold text-[10px] flex items-center justify-center shadow-xs"
                          style={{ backgroundColor: u.color }}
                        >
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-700">{u.name}</span>
                      </div>
                      <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Online</span>
                      </span>
                    </div>
                  ))}

                  {activeRoomId && collabUsers.length === 0 && (
                    <div className="p-3 text-center text-slate-400 text-xs italic">
                      Belum ada rekan lain di ruang ini. Bagikan tautan di atas untuk mengundang!
                    </div>
                  )}

                  {!activeRoomId && (
                    <div className="p-3 text-center text-slate-500 text-xs leading-relaxed bg-slate-50/60">
                      🔒 Kanvas ini sedang berada dalam <strong>mode privat</strong>. Tidak ada sesi kolaborasi yang aktif. Klik &quot;Salin Tautan&quot; di atas jika Anda ingin mengundang rekan untuk berkolaborasi bersama.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TAUTAN BERBAGI SNAPSHOT */}
          {activeTab === 'link' && (
            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <span>Tautan Pratinjau Diagram (Snapshot)</span>
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Tautan ini menyematkan seluruh isi diagram langsung di dalam URL. Rekan kerja dapat langsung membuka dan menyalin diagram ini di peramban mereka tanpa perlu login atau terhubung ke server database!
                </p>

                <div className="flex items-center gap-1.5 pt-1">
                  <input
                    type="text"
                    readOnly
                    value={shareLinkUrl}
                    className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 font-mono text-[11px] select-all focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleCopyShareLink}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all cursor-pointer shadow-xs ${
                      copiedShareLink ? 'bg-emerald-600' : 'bg-emerald-700 hover:bg-emerald-800'
                    }`}
                  >
                    {copiedShareLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedShareLink ? 'Tersalin!' : 'Salin'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FILE PROYEK (.GALUR / .JSON) */}
          {activeTab === 'file' && (
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl p-3.5 space-y-3 bg-slate-50/50">
                <div>
                  <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-emerald-600" />
                    <span>Unduh File Proyek (.galur)</span>
                  </h3>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Simpan salinan cadangan lengkap diagram ke komputer Anda. File format <code>.galur</code> memuat seluruh halaman, bentuk objek, garis penghubung, gaya warna, dan ukuran lembar.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadProjectFile}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh File Proyek ({diagramTitle}.galur)</span>
                </button>
              </div>

              <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center space-y-2 hover:border-blue-400 transition-colors">
                <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">
                    Buka / Impor File Diagram
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Pilih file <code>.galur</code> atau <code>.json</code> untuk dipulihkan ke dalam kanvas ini
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".galur,.json"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 font-semibold text-slate-700 text-xs transition-colors cursor-pointer"
                >
                  Pilih File dari Komputer...
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: KODE SEMAT (EMBED) */}
          {activeTab === 'embed' && (
            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-blue-600" />
                  <span>Sematkan Diagram ke Website / Dokumen</span>
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Salin cuplikan kode iframe berikut untuk menampilkan diagram ini secara interaktif pada website, blog, atau portal dokumentasi tim Anda:
                </p>

                <textarea
                  readOnly
                  rows={3}
                  value={embedCode}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono text-[11px] text-slate-700 focus:outline-hidden"
                />

                <button
                  type="button"
                  onClick={handleCopyEmbed}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all cursor-pointer shadow-xs ${
                    copiedEmbed ? 'bg-emerald-600' : 'bg-slate-800 hover:bg-slate-900'
                  }`}
                >
                  {copiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmbed ? 'Kode Tersalin!' : 'Salin Kode Semat'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Koneksi aman & terenkripsi</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
