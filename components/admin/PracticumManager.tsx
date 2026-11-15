'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PublicationStatus } from '@prisma/client';
import { Plus, Trash2 } from 'lucide-react';
import { TEACHING_MATERIAL_CATEGORIES } from '@/lib/constants';
import {
  deleteLessonPlanAction,
  deleteTeachingDemoAction,
  deleteTeachingReflectionAction,
  deleteTeachingResourceAction,
  upsertLessonPlanAction,
  upsertTeachingDemoAction,
  upsertTeachingReflectionAction,
  upsertTeachingResourceAction,
} from '@/actions/practicum';
import { useToast } from '@/components/ui/toast';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { FileUploadField } from './FileUploadField';
import { parseLinesOnly, slugify } from '@/lib/utils';

interface PracticumManagerProps {
  lessonPlans: Array<{ id: string; title: string; subjectTopic: string; targetLevel: string; status: PublicationStatus }>;
  demonstrations: Array<{ id: string; title: string; topic: string; status: PublicationStatus }>;
  resources: Array<{ id: string; title: string; category: string; status: PublicationStatus }>;
  reflections: Array<{ id: string; title: string; context: string; status: PublicationStatus }>;
}

export function PracticumManager({
  lessonPlans,
  demonstrations,
  resources,
  reflections,
}: PracticumManagerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [tab, setTab] = useState<'plans' | 'demos' | 'materials' | 'reflections'>('plans');
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string; label: string } | null>(null);

  const [planForm, setPlanForm] = useState({
    title: '',
    subjectTopic: '',
    targetLevel: '',
    duration: '45 minutes',
    methodology: 'Communicative Language Teaching (CLT)',
    objectivesText: '',
    resourcesText: '',
    warmUpActivity: '',
    lessonDevelopment: '',
    studentActivities: '',
    assessment: '',
    homework: '',
    teacherReflection: '',
    documentUrl: '',
    status: PublicationStatus.PUBLISHED as PublicationStatus,
  });

  const [demoForm, setDemoForm] = useState({
    title: '',
    topic: '',
    description: '',
    videoUrl: '',
    externalVideoUrl: '',
    thumbnailUrl: '',
    demonstrationDate: '',
    status: PublicationStatus.PUBLISHED as PublicationStatus,
  });

  const [resForm, setResForm] = useState({
    title: '',
    category: TEACHING_MATERIAL_CATEGORIES[0] as string,
    targetLevel: '',
    description: '',
    fileUrl: '',
    fileType: 'PDF',
    externalUrl: '',
    status: PublicationStatus.PUBLISHED as PublicationStatus,
  });

  const [refForm, setRefForm] = useState({
    title: '',
    context: '',
    methodologyStudied: '',
    whatText: '',
    soWhatText: '',
    nowWhatText: '',
    reflectionDate: '',
    status: PublicationStatus.PUBLISHED as PublicationStatus,
  });

  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await upsertLessonPlanAction({
      ...planForm,
      slug: slugify(planForm.title),
      learningObjectives: parseLinesOnly(planForm.objectivesText),
      requiredResources: parseLinesOnly(planForm.resourcesText),
      documentUrl: planForm.documentUrl || null,
      homework: planForm.homework || null,
      teacherReflection: planForm.teacherReflection || null,
    });
    if (!res.success) {
      toast({ title: 'Save failed', description: res.error, variant: 'error' });
      return;
    }
    toast({ title: 'Lesson plan saved', variant: 'success' });
    setPlanForm({ ...planForm, title: '', subjectTopic: '', targetLevel: '', objectivesText: '', resourcesText: '', warmUpActivity: '', lessonDevelopment: '', studentActivities: '', assessment: '', homework: '', teacherReflection: '', documentUrl: '' });
    router.refresh();
  };

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await upsertTeachingDemoAction({
      ...demoForm,
      slug: slugify(demoForm.title),
      videoUrl: demoForm.videoUrl || null,
      externalVideoUrl: demoForm.externalVideoUrl || null,
      thumbnailUrl: demoForm.thumbnailUrl || null,
      demonstrationDate: demoForm.demonstrationDate || null,
    });
    if (!res.success) {
      toast({ title: 'Save failed', description: res.error, variant: 'error' });
      return;
    }
    toast({ title: 'Demonstration saved', variant: 'success' });
    setDemoForm({ ...demoForm, title: '', topic: '', description: '', videoUrl: '', externalVideoUrl: '', thumbnailUrl: '', demonstrationDate: '' });
    router.refresh();
  };

  const handleResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await upsertTeachingResourceAction({
      ...resForm,
      slug: slugify(resForm.title),
      targetLevel: resForm.targetLevel || null,
      fileUrl: resForm.fileUrl || null,
      externalUrl: resForm.externalUrl || null,
    });
    if (!res.success) {
      toast({ title: 'Save failed', description: res.error, variant: 'error' });
      return;
    }
    toast({ title: 'Teaching material saved', variant: 'success' });
    setResForm({ ...resForm, title: '', targetLevel: '', description: '', fileUrl: '', externalUrl: '' });
    router.refresh();
  };

  const handleReflectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await upsertTeachingReflectionAction({
      ...refForm,
      slug: slugify(refForm.title),
      methodologyStudied: refForm.methodologyStudied || null,
      reflectionDate: refForm.reflectionDate || null,
    });
    if (!res.success) {
      toast({ title: 'Save failed', description: res.error, variant: 'error' });
      return;
    }
    toast({ title: 'Teaching reflection saved', variant: 'success' });
    setRefForm({ ...refForm, title: '', context: '', methodologyStudied: '', whatText: '', soWhatText: '', nowWhatText: '', reflectionDate: '' });
    router.refresh();
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    let res;
    if (deleteTarget.type === 'plan') res = await deleteLessonPlanAction(deleteTarget.id);
    else if (deleteTarget.type === 'demo') res = await deleteTeachingDemoAction(deleteTarget.id);
    else if (deleteTarget.type === 'material') res = await deleteTeachingResourceAction(deleteTarget.id);
    else res = await deleteTeachingReflectionAction(deleteTarget.id);

    setDeleteTarget(null);
    if (!res.success) {
      toast({ title: 'Delete failed', description: res.error, variant: 'error' });
      return;
    }
    toast({ title: 'Deleted', variant: 'success' });
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'plans', label: `Lesson Plans (${lessonPlans.length})` },
          { id: 'demos', label: `Demonstrations (${demonstrations.length})` },
          { id: 'materials', label: `Teaching Materials (${resources.length})` },
          { id: 'reflections', label: `Reflections (${reflections.length})` },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id as typeof tab)}
            className={`px-4 py-2 text-xs font-medium rounded-md ${
              tab === item.id
                ? 'bg-[#BE185D] text-white'
                : 'bg-white border border-[#4C0519]/15 text-[#4C0519]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'plans' && (
        <div className="space-y-6">
          <form onSubmit={handlePlanSubmit} className="bg-white border border-[#4C0519]/10 rounded-lg p-6 space-y-4">
            <h2 className="font-serif text-xl text-[#4C0519]">Create Lesson Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" required placeholder="Lesson Title" value={planForm.title} onChange={(e) => setPlanForm({ ...planForm, title: e.target.value })} className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md" />
              <input type="text" required placeholder="Subject / Topic" value={planForm.subjectTopic} onChange={(e) => setPlanForm({ ...planForm, subjectTopic: e.target.value })} className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md" />
              <input type="text" required placeholder="Target Class / Level" value={planForm.targetLevel} onChange={(e) => setPlanForm({ ...planForm, targetLevel: e.target.value })} className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md" />
              <input type="text" required placeholder="Duration" value={planForm.duration} onChange={(e) => setPlanForm({ ...planForm, duration: e.target.value })} className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md" />
              <input type="text" required placeholder="Teaching Methodology" value={planForm.methodology} onChange={(e) => setPlanForm({ ...planForm, methodology: e.target.value })} className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md" />
              <select value={planForm.status} onChange={(e) => setPlanForm({ ...planForm, status: e.target.value as PublicationStatus })} className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md">
                <option value={PublicationStatus.PUBLISHED}>Published</option>
                <option value={PublicationStatus.DRAFT}>Draft</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <textarea rows={3} placeholder="Learning Objectives (one per line)" value={planForm.objectivesText} onChange={(e) => setPlanForm({ ...planForm, objectivesText: e.target.value })} className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md" />
              <textarea rows={3} placeholder="Required Resources (one per line)" value={planForm.resourcesText} onChange={(e) => setPlanForm({ ...planForm, resourcesText: e.target.value })} className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <textarea rows={2} required placeholder="Warm-up Activity" value={planForm.warmUpActivity} onChange={(e) => setPlanForm({ ...planForm, warmUpActivity: e.target.value })} className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md" />
              <textarea rows={2} required placeholder="Lesson Development" value={planForm.lessonDevelopment} onChange={(e) => setPlanForm({ ...planForm, lessonDevelopment: e.target.value })} className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md" />
              <textarea rows={2} required placeholder="Student Activities" value={planForm.studentActivities} onChange={(e) => setPlanForm({ ...planForm, studentActivities: e.target.value })} className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md" />
              <textarea rows={2} required placeholder="Assessment" value={planForm.assessment} onChange={(e) => setPlanForm({ ...planForm, assessment: e.target.value })} className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md" />
            </div>
            <FileUploadField label="Supporting Document (PDF/Word)" value={planForm.documentUrl} onChange={(url) => setPlanForm({ ...planForm, documentUrl: url })} accept=".pdf,.doc,.docx" category="Practicum" />
            <button type="submit" className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-medium bg-[#BE185D] text-white rounded-md">
              <Plus className="w-4 h-4" />
              <span>Save Lesson Plan</span>
            </button>
          </form>

          <div className="bg-white border border-[#4C0519]/10 rounded-lg divide-y divide-[#4C0519]/10">
            {lessonPlans.map((p) => (
              <div key={p.id} className="p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-sm text-[#4C0519]">{p.title}</p>
                  <p className="text-xs text-[#6E5A64]">{p.subjectTopic} · {p.targetLevel} · {p.status}</p>
                </div>
                <button type="button" onClick={() => setDeleteTarget({ type: 'plan', id: p.id, label: p.title })} className="p-1.5 text-rose-700 hover:bg-rose-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'demos' && (
        <div className="space-y-6">
          <form onSubmit={handleDemoSubmit} className="bg-white border border-[#4C0519]/10 rounded-lg p-6 space-y-4">
            <h2 className="font-serif text-xl text-[#4C0519]">Add Teaching Demonstration</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input type="text" required placeholder="Title" value={demoForm.title} onChange={(e) => setDemoForm({ ...demoForm, title: e.target.value })} className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md" />
              <input type="text" required placeholder="Topic" value={demoForm.topic} onChange={(e) => setDemoForm({ ...demoForm, topic: e.target.value })} className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md" />
              <input type="date" value={demoForm.demonstrationDate} onChange={(e) => setDemoForm({ ...demoForm, demonstrationDate: e.target.value })} className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md" />
            </div>
            <textarea rows={3} required placeholder="Description" value={demoForm.description} onChange={(e) => setDemoForm({ ...demoForm, description: e.target.value })} className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileUploadField label="Video Upload (MP4/WEBM)" value={demoForm.videoUrl} onChange={(url) => setDemoForm({ ...demoForm, videoUrl: url })} accept="video/*" category="Practicum" />
              <FileUploadField label="Thumbnail Photo" value={demoForm.thumbnailUrl} onChange={(url) => setDemoForm({ ...demoForm, thumbnailUrl: url })} accept="image/*" category="Practicum" />
            </div>
            <input type="url" placeholder="External Video Link (optional)" value={demoForm.externalVideoUrl} onChange={(e) => setDemoForm({ ...demoForm, externalVideoUrl: e.target.value })} className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md" />
            <button type="submit" className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-medium bg-[#BE185D] text-white rounded-md">
              <Plus className="w-4 h-4" />
              <span>Save Demonstration</span>
            </button>
          </form>

          <div className="bg-white border border-[#4C0519]/10 rounded-lg divide-y divide-[#4C0519]/10">
            {demonstrations.map((d) => (
              <div key={d.id} className="p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-sm text-[#4C0519]">{d.title}</p>
                  <p className="text-xs text-[#6E5A64]">{d.topic} · {d.status}</p>
                </div>
                <button type="button" onClick={() => setDeleteTarget({ type: 'demo', id: d.id, label: d.title })} className="p-1.5 text-rose-700 hover:bg-rose-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'materials' && (
        <div className="space-y-6">
          <form onSubmit={handleResourceSubmit} className="bg-white border border-[#4C0519]/10 rounded-lg p-6 space-y-4">
            <h2 className="font-serif text-xl text-[#4C0519]">Add Teaching Material</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input type="text" required placeholder="Material Title" value={resForm.title} onChange={(e) => setResForm({ ...resForm, title: e.target.value })} className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md" />
              <select value={resForm.category} onChange={(e) => setResForm({ ...resForm, category: e.target.value })} className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md">
                {TEACHING_MATERIAL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="text" placeholder="Target Level (optional)" value={resForm.targetLevel} onChange={(e) => setResForm({ ...resForm, targetLevel: e.target.value })} className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md" />
            </div>
            <textarea rows={2} required placeholder="Description" value={resForm.description} onChange={(e) => setResForm({ ...resForm, description: e.target.value })} className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md" />
            <FileUploadField label="Material File (PDF/Word/PPT/Image)" value={resForm.fileUrl} onChange={(url) => setResForm({ ...resForm, fileUrl: url })} category="Teaching Materials" />
            <button type="submit" className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-medium bg-[#BE185D] text-white rounded-md">
              <Plus className="w-4 h-4" />
              <span>Save Teaching Material</span>
            </button>
          </form>

          <div className="bg-white border border-[#4C0519]/10 rounded-lg divide-y divide-[#4C0519]/10">
            {resources.map((r) => (
              <div key={r.id} className="p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-sm text-[#4C0519]">{r.title}</p>
                  <p className="text-xs text-[#6E5A64]">{r.category} · {r.status}</p>
                </div>
                <button type="button" onClick={() => setDeleteTarget({ type: 'material', id: r.id, label: r.title })} className="p-1.5 text-rose-700 hover:bg-rose-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'reflections' && (
        <div className="space-y-6">
          <form onSubmit={handleReflectionSubmit} className="bg-white border border-[#4C0519]/10 rounded-lg p-6 space-y-4">
            <h2 className="font-serif text-xl text-[#4C0519]">Add Reflective Teaching Entry</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input type="text" required placeholder="Reflection Title" value={refForm.title} onChange={(e) => setRefForm({ ...refForm, title: e.target.value })} className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md" />
              <input type="text" required placeholder="Context (e.g. Micro-Teaching Session)" value={refForm.context} onChange={(e) => setRefForm({ ...refForm, context: e.target.value })} className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md" />
              <input type="text" placeholder="Methodology Studied" value={refForm.methodologyStudied} onChange={(e) => setRefForm({ ...refForm, methodologyStudied: e.target.value })} className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md" />
            </div>
            <textarea rows={2} required placeholder="What? — What happened or was observed?" value={refForm.whatText} onChange={(e) => setRefForm({ ...refForm, whatText: e.target.value })} className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md" />
            <textarea rows={2} required placeholder="So What? — Why was it significant?" value={refForm.soWhatText} onChange={(e) => setRefForm({ ...refForm, soWhatText: e.target.value })} className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md" />
            <textarea rows={2} required placeholder="Now What? — Next step in teaching practice" value={refForm.nowWhatText} onChange={(e) => setRefForm({ ...refForm, nowWhatText: e.target.value })} className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md" />
            <button type="submit" className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-medium bg-[#BE185D] text-white rounded-md">
              <Plus className="w-4 h-4" />
              <span>Save Reflection</span>
            </button>
          </form>

          <div className="bg-white border border-[#4C0519]/10 rounded-lg divide-y divide-[#4C0519]/10">
            {reflections.map((rf) => (
              <div key={rf.id} className="p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-sm text-[#4C0519]">{rf.title}</p>
                  <p className="text-xs text-[#6E5A64]">{rf.context} · {rf.status}</p>
                </div>
                <button type="button" onClick={() => setDeleteTarget({ type: 'reflection', id: rf.id, label: rf.title })} className="p-1.5 text-rose-700 hover:bg-rose-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Practicum Item"
        description={`Remove "${deleteTarget?.label}"?`}
        confirmLabel="Delete"
        onConfirm={executeDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
