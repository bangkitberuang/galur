'use client';

import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Database, 
  Users, 
  GitFork, 
  LayoutGrid, 
  Network, 
  Server, 
  Zap, 
  Gauge, 
  Target, 
  Boxes,
  Code2,
  Check,
  Fish,
  LayoutTemplate,
  Lightbulb,
  HelpCircle,
  Grid,
  TrendingUp,
  FolderOpen,
  FilePlus,
  Workflow,
  Globe,
  ShieldAlert,
  CheckCircle2,
  Scale,
  PieChart,
  Briefcase,
  Compass,
  Search,
  Calendar,
  Clock,
  Video
} from 'lucide-react';
import { SPECIALIST_CATEGORIES, CategoryTemplate } from '@/lib/specialistTemplates';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: CategoryTemplate) => void;
}

export default function TemplateModal({
  isOpen,
  onClose,
  onSelectTemplate,
}: TemplateModalProps) {
  // Default to Fishbone / Problem Solving
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('fishbone');
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const filteredCategories = SPECIALIST_CATEGORIES.filter((cat) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = cat.name.toLowerCase().includes(q);
      const matchDesc = cat.description.toLowerCase().includes(q);
      const matchBadge = cat.badge.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchBadge) return false;
    }
    if (filterGroup === 'all') return true;
    if (filterGroup === 'strategic') return cat.group === 'strategic';
    if (filterGroup === 'problem_solving') return cat.group === 'problem_solving';
    if (filterGroup === 'business') {
      return (
        cat.id === 'flowchart' ||
        cat.id === 'org' ||
        cat.id === 'floorplan' ||
        cat.id === 'mindmap' ||
        cat.id === 'swimlane' ||
        cat.id === 'service_blueprint' ||
        cat.id === 'timebox_gantt' ||
        cat.id === 'vertical_timeline'
      );
    }
    if (filterGroup === 'engineering') {
      return (
        cat.id === 'network' ||
        cat.id === 'rack' ||
        cat.id === 'circuit' ||
        cat.id === 'pid' ||
        cat.id === 'live_streaming'
      );
    }
    if (filterGroup === 'software') {
      return cat.id === 'uml' || cat.id === 'erd' || cat.id === 'block';
    }
    return true;
  });

  const currentTemplate =
    SPECIALIST_CATEGORIES.find((c) => c.id === selectedCategoryId) ||
    filteredCategories[0] ||
    SPECIALIST_CATEGORIES[0];

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'blank': return <FilePlus className="w-4 h-4 text-slate-500" />;
      case 'uml': return <Code2 className="w-4 h-4" />;
      case 'erd': return <Database className="w-4 h-4" />;
      case 'org': return <Users className="w-4 h-4" />;
      case 'flowchart': return <GitFork className="w-4 h-4" />;
      case 'swimlane': return <Layers className="w-4 h-4 text-sky-500" />;
      case 'floorplan': return <LayoutGrid className="w-4 h-4" />;
      case 'network': return <Network className="w-4 h-4" />;
      case 'rack': return <Server className="w-4 h-4" />;
      case 'circuit': return <Zap className="w-4 h-4" />;
      case 'pid': return <Gauge className="w-4 h-4" />;
      case 'swot': return <Target className="w-4 h-4 text-amber-500" />;
      case 'block': return <Boxes className="w-4 h-4" />;
      case 'fishbone': return <Fish className="w-4 h-4 text-rose-500" />;
      case 'lean_canvas': return <LayoutTemplate className="w-4 h-4 text-emerald-600" />;
      case 'service_blueprint': return <Workflow className="w-4 h-4 text-orange-500" />;
      case 'live_streaming': return <Video className="w-4 h-4 text-purple-600" />;
      case 'timebox_gantt': return <Calendar className="w-4 h-4 text-sky-600" />;
      case 'vertical_timeline': return <Clock className="w-4 h-4 text-violet-600" />;
      case 'bmc': return <LayoutGrid className="w-4 h-4 text-sky-600" />;
      case 'tows': return <Target className="w-4 h-4 text-amber-600" />;
      case 'pestle': return <Globe className="w-4 h-4 text-indigo-600" />;
      case 'porters_five_forces': return <ShieldAlert className="w-4 h-4 text-red-600" />;
      case 'ansoff': return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case 'okrs': return <CheckCircle2 className="w-4 h-4 text-blue-600" />;
      case 'balanced_scorecard': return <Scale className="w-4 h-4 text-purple-600" />;
      case 'bcg_matrix': return <Sparkles className="w-4 h-4 text-rose-600" />;
      case 'blue_ocean': return <Compass className="w-4 h-4 text-sky-600" />;
      case 'value_chain': return <Boxes className="w-4 h-4 text-emerald-600" />;
      case 'competitive_analysis': return <ShieldAlert className="w-4 h-4 text-violet-600" />;
      case 'hoshin_kanri': return <Target className="w-4 h-4 text-amber-600" />;
      case 'benchmarking': return <Gauge className="w-4 h-4 text-blue-600" />;
      case 'scenario_analysis': return <TrendingUp className="w-4 h-4 text-indigo-600" />;
      case 'model_canvas': return <LayoutTemplate className="w-4 h-4 text-teal-600" />;
      case 'vpc': return <Lightbulb className="w-4 h-4 text-blue-500" />;
      case 'five_whys': return <HelpCircle className="w-4 h-4 text-teal-600" />;
      case 'eisenhower': return <Grid className="w-4 h-4 text-amber-600" />;
      case 'impact_effort': return <TrendingUp className="w-4 h-4 text-purple-600" />;
      default: return <Layers className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs no-print p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header Modal dengan Pencarian Terpadu */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0b4632] text-amber-300 flex items-center justify-center shadow-md shrink-0">
              <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900">
                  Pilih Format Diagram Baru
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  {SPECIALIST_CATEGORIES.length} Format Tersedia
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Mulai dari kanvas kosong atau pilih format diagram siap pakai
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari format (SWOT, Gantt, Live)..."
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-white rounded-xl border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer shrink-0"
              title="Tutup (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Bar Kategori (Rapi, Wrap Tanpa Scrollbar Rusak) */}
        <div className="px-4 py-2.5 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center gap-1.5 no-scrollbar">
          {[
            { id: 'all', label: 'Semua Format', count: SPECIALIST_CATEGORIES.length },
            { id: 'strategic', label: '🎯 Strategic & AI', count: SPECIALIST_CATEGORIES.filter(c => c.group === 'strategic').length },
            { id: 'problem_solving', label: '💡 Problem Solving', count: SPECIALIST_CATEGORIES.filter(c => c.group === 'problem_solving').length },
            { id: 'business', label: '📊 Alur & Jadwal Kerja', count: SPECIALIST_CATEGORIES.filter(c => c.id === 'flowchart' || c.id === 'org' || c.id === 'floorplan' || c.id === 'mindmap' || c.id === 'swimlane' || c.id === 'service_blueprint' || c.id === 'timebox_gantt' || c.id === 'vertical_timeline').length },
            { id: 'engineering', label: '🎥 Siaran & Jaringan', count: SPECIALIST_CATEGORIES.filter(c => c.id === 'network' || c.id === 'rack' || c.id === 'circuit' || c.id === 'pid' || c.id === 'live_streaming').length },
            { id: 'software', label: '💻 Software & Basis Data', count: SPECIALIST_CATEGORIES.filter(c => c.id === 'uml' || c.id === 'erd' || c.id === 'block').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setFilterGroup(tab.id);
                // Pilih template pertama dari filter jika yang aktif tidak ada di filter
                const nextCategories = SPECIALIST_CATEGORIES.filter((cat) => {
                  if (tab.id === 'all') return true;
                  if (tab.id === 'strategic') return cat.group === 'strategic';
                  if (tab.id === 'problem_solving') return cat.group === 'problem_solving';
                  if (tab.id === 'business') {
                    return (
                      cat.id === 'flowchart' ||
                      cat.id === 'org' ||
                      cat.id === 'floorplan' ||
                      cat.id === 'mindmap' ||
                      cat.id === 'swimlane' ||
                      cat.id === 'service_blueprint' ||
                      cat.id === 'timebox_gantt' ||
                      cat.id === 'vertical_timeline'
                    );
                  }
                  if (tab.id === 'engineering') {
                    return (
                      cat.id === 'network' ||
                      cat.id === 'rack' ||
                      cat.id === 'circuit' ||
                      cat.id === 'pid' ||
                      cat.id === 'live_streaming'
                    );
                  }
                  if (tab.id === 'software') {
                    return cat.id === 'uml' || cat.id === 'erd' || cat.id === 'block';
                  }
                  return true;
                });
                if (nextCategories.length > 0 && !nextCategories.some((c) => c.id === selectedCategoryId)) {
                  setSelectedCategoryId(nextCategories[0].id);
                }
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                filterGroup === tab.id
                  ? 'bg-[#0b4632] text-amber-300 shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200/70'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${
                filterGroup === tab.id ? 'bg-emerald-900 text-amber-200' : 'bg-slate-100 text-slate-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Modal Body: 2 Kolom (Kiri: List Template, Kanan: Preview & Detail) */}
        <div className="flex-1 overflow-hidden flex flex-col sm:flex-row">
          {/* Kolom Kiri: Menu Template */}
          <div className="w-full sm:w-72 border-r border-slate-200 bg-slate-50/50 p-3 overflow-y-auto custom-scrollbar space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 flex items-center justify-between">
              <span>Daftar Template ({filteredCategories.length})</span>
            </div>
            {filteredCategories.map((cat) => {
              const isSelected = cat.id === selectedCategoryId;
              const isProblem = cat.group === 'problem_solving';

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0b4632] text-amber-300 shadow-md font-bold'
                      : 'text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  <span className={`shrink-0 ${isSelected ? 'text-amber-300' : 'text-slate-500'}`}>
                    {getCategoryIcon(cat.id)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate">{cat.name}</span>
                      {cat.isAI && (
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 border border-purple-200/80 shrink-0">
                          AI
                        </span>
                      )}
                    </div>
                    <div className={`text-[10px] truncate ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`}>
                      {cat.badge}
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-amber-300" />}
                </button>
              );
            })}
          </div>

          {/* Kolom Kanan: Preview Template & Tombol Terapkan */}
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col justify-between space-y-6 bg-white">
            <div className="space-y-4">
              {/* Badge & Title */}
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white shadow-xs"
                  style={{ backgroundColor: currentTemplate.accentColor }}
                >
                  {currentTemplate.badge}
                </span>
                {currentTemplate.isAI && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-600 fill-purple-600" />
                    AI Framework
                  </span>
                )}
                <span className="text-xs text-slate-400">
                  {currentTemplate.nodes.length} Objek • {currentTemplate.edges.length} Konektor
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {currentTemplate.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  {currentTemplate.description}
                </p>
              </div>

              {/* Box Preview Struktur Objek */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Komponen Utama yang Akan Dimuat:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentTemplate.nodes.map((n, idx) => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center gap-2 text-xs"
                    >
                      <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0">
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-800 truncate">
                          {String(n.data.label || n.data.className || n.data.tableName || n.data.name || n.data.title || 'Objek')}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          Tipe: {n.type}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectTemplate(currentTemplate);
                  onClose();
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0b4632] hover:bg-[#073022] text-amber-300 font-bold text-xs shadow-md shadow-emerald-950/20 hover:scale-102 transition-all cursor-pointer"
              >
                <span>
                  {currentTemplate.id === 'blank'
                    ? 'Buat Kanvas Kosong Baru'
                    : `Gunakan Format ${currentTemplate.name}`}
                </span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
