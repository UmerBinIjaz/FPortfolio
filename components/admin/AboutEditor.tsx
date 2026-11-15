'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Save, Trash2 } from 'lucide-react';
import { PublicationStatus } from '@prisma/client';
import {
  deleteEducationAction,
  deleteSkillAction,
  deleteTrainingAction,
  updateProfileAction,
  upsertEducationAction,
  upsertSkillAction,
  upsertTrainingAction,
} from '@/actions/about';
import { useToast } from '@/components/ui/toast';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { FileUploadField } from './FileUploadField';
import { parseLinesOnly } from '@/lib/utils';

interface AboutEditorProps {
  profile: {
    fullName: string;
    title: string;
    tagline: string;
    location: string;
    email: string;
    phone: string;
    summary: string;
    bio: string;
    teachingPhilosophy: string;
    personalValues: string[];
    futureGoals: string[];
    professionalVision: string;
    languages: string[];
    profileImageUrl: string | null;
    profileImageId: string | null;
    cvDocumentUrl: string | null;
  };
  educations: Array<{
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy: string | null;
    startYear: string;
    endYear: string | null;
    isCurrent: boolean;
    location: string | null;
    description: string | null;
    sortOrder: number;
    status: PublicationStatus;
  }>;
  skills: Array<{
    id: string;
    name: string;
    category: string;
    description: string | null;
    sortOrder: number;
    status: PublicationStatus;
  }>;
  trainings: Array<{
    id: string;
    title: string;
    provider: string;
    duration: string;
    period: string | null;
    description: string;
    highlights: string[];
    sortOrder: number;
    status: PublicationStatus;
  }>;
}

export function AboutEditor({ profile, educations, skills, trainings }: AboutEditorProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [pForm, setPForm] = useState({
    ...profile,
    profileImageUrl: profile.profileImageUrl || '',
    profileImageId: profile.profileImageId || '',
    cvDocumentUrl: profile.cvDocumentUrl || '',
    personalValuesText: profile.personalValues.join('\n'),
    futureGoalsText: profile.futureGoals.join('\n'),
    languagesText: profile.languages.join('\n'),
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Education quick add
  const [newEdu, setNewEdu] = useState({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startYear: '',
    endYear: '',
    isCurrent: false,
    description: '',
    sortOrder: educations.length + 1,
    status: PublicationStatus.PUBLISHED,
  });

  // Skill quick add
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'Professional',
    sortOrder: skills.length + 1,
    status: PublicationStatus.PUBLISHED,
  });

  // Training quick add
  const [newTraining, setNewTraining] = useState({
    title: '',
    provider: '',
    duration: '',
    description: '',
    highlightsText: '',
    sortOrder: trainings.length + 1,
    status: PublicationStatus.PUBLISHED,
  });

  const [confirmDelete, setConfirmDelete] = useState<{
    type: 'edu' | 'skill' | 'training';
    id: string;
    label: string;
  } | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    const res = await updateProfileAction({
      fullName: pForm.fullName,
      title: pForm.title,
      tagline: pForm.tagline,
      location: pForm.location,
      email: pForm.email,
      phone: pForm.phone,
      summary: pForm.summary,
      bio: pForm.bio,
      teachingPhilosophy: pForm.teachingPhilosophy,
      personalValues: parseLinesOnly(pForm.personalValuesText),
      futureGoals: parseLinesOnly(pForm.futureGoalsText),
      professionalVision: pForm.professionalVision,
      languages: parseLinesOnly(pForm.languagesText),
      profileImageUrl: pForm.profileImageUrl || null,
      profileImageId: pForm.profileImageId || null,
      cvDocumentUrl: pForm.cvDocumentUrl || null,
    });
    setSavingProfile(false);
    if (!res.success) {
      toast({ title: 'Save failed', description: res.error, variant: 'error' });
      return;
    }
    toast({ title: 'Profile updated', variant: 'success' });
    router.refresh();
  };

  const handleAddEdu = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await upsertEducationAction(newEdu);
    if (!res.success) {
      toast({ title: 'Error', description: res.error, variant: 'error' });
      return;
    }
    toast({ title: 'Education added', variant: 'success' });
    setNewEdu({
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startYear: '',
      endYear: '',
      isCurrent: false,
      description: '',
      sortOrder: educations.length + 2,
      status: PublicationStatus.PUBLISHED,
    });
    router.refresh();
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await upsertSkillAction(newSkill);
    if (!res.success) {
      toast({ title: 'Error', description: res.error, variant: 'error' });
      return;
    }
    toast({ title: 'Skill added', variant: 'success' });
    setNewSkill({
      name: '',
      category: 'Professional',
      sortOrder: skills.length + 2,
      status: PublicationStatus.PUBLISHED,
    });
    router.refresh();
  };

  const handleAddTraining = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await upsertTrainingAction({
      title: newTraining.title,
      provider: newTraining.provider,
      duration: newTraining.duration,
      description: newTraining.description,
      highlights: parseLinesOnly(newTraining.highlightsText),
      sortOrder: newTraining.sortOrder,
      status: newTraining.status,
    });
    if (!res.success) {
      toast({ title: 'Error', description: res.error, variant: 'error' });
      return;
    }
    toast({ title: 'Training added', variant: 'success' });
    setNewTraining({
      title: '',
      provider: '',
      duration: '',
      description: '',
      highlightsText: '',
      sortOrder: trainings.length + 2,
      status: PublicationStatus.PUBLISHED,
    });
    router.refresh();
  };

  const executeDelete = async () => {
    if (!confirmDelete) return;
    let res;
    if (confirmDelete.type === 'edu') res = await deleteEducationAction(confirmDelete.id);
    else if (confirmDelete.type === 'skill') res = await deleteSkillAction(confirmDelete.id);
    else res = await deleteTrainingAction(confirmDelete.id);

    setConfirmDelete(null);
    if (!res.success) {
      toast({ title: 'Delete failed', description: res.error, variant: 'error' });
      return;
    }
    toast({ title: 'Record removed', variant: 'success' });
    router.refresh();
  };

  return (
    <div className="space-y-10">
      {/* Profile & Biography Form */}
      <form
        onSubmit={handleSaveProfile}
        className="bg-white border border-[#172554]/10 rounded-lg p-6 space-y-5"
      >
        <h2 className="font-serif text-2xl text-[#172554]">Profile, Biography &amp; Philosophy</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#172554] mb-1">Full Name</label>
            <input
              type="text"
              value={pForm.fullName}
              onChange={(e) => setPForm({ ...pForm, fullName: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#172554] mb-1">Professional Title</label>
            <input
              type="text"
              value={pForm.title}
              onChange={(e) => setPForm({ ...pForm, title: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#172554] mb-1">Location</label>
            <input
              type="text"
              value={pForm.location}
              onChange={(e) => setPForm({ ...pForm, location: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#172554] mb-1">Email</label>
            <input
              type="email"
              value={pForm.email}
              onChange={(e) => setPForm({ ...pForm, email: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#172554] mb-1">Phone</label>
            <input
              type="text"
              value={pForm.phone}
              onChange={(e) => setPForm({ ...pForm, phone: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#172554] mb-1">Tagline</label>
            <input
              type="text"
              value={pForm.tagline}
              onChange={(e) => setPForm({ ...pForm, tagline: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FileUploadField
            label="Profile Photograph"
            value={pForm.profileImageUrl}
            onChange={(url, publicId) =>
              setPForm({ ...pForm, profileImageUrl: url, profileImageId: publicId || '' })
            }
            accept="image/*"
            category="Profile"
          />
          <FileUploadField
            label="Uploaded CV PDF (Optional)"
            value={pForm.cvDocumentUrl}
            onChange={(url) => setPForm({ ...pForm, cvDocumentUrl: url })}
            accept=".pdf"
            category="Resume"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#172554] mb-1">Professional Summary (CV &amp; Intro)</label>
          <textarea
            rows={3}
            value={pForm.summary}
            onChange={(e) => setPForm({ ...pForm, summary: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#172554] mb-1">Detailed Biography</label>
          <textarea
            rows={4}
            value={pForm.bio}
            onChange={(e) => setPForm({ ...pForm, bio: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#172554] mb-1">Developing Teaching Philosophy</label>
          <textarea
            rows={4}
            value={pForm.teachingPhilosophy}
            onChange={(e) => setPForm({ ...pForm, teachingPhilosophy: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#172554] mb-1">Professional Vision</label>
          <textarea
            rows={2}
            value={pForm.professionalVision}
            onChange={(e) => setPForm({ ...pForm, professionalVision: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#172554] mb-1">
              Personal Values (one per line)
            </label>
            <textarea
              rows={4}
              value={pForm.personalValuesText}
              onChange={(e) => setPForm({ ...pForm, personalValuesText: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#172554] mb-1">
              Future Goals (one per line)
            </label>
            <textarea
              rows={4}
              value={pForm.futureGoalsText}
              onChange={(e) => setPForm({ ...pForm, futureGoalsText: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#172554] mb-1">
              Languages (one per line)
            </label>
            <textarea
              rows={4}
              value={pForm.languagesText}
              onChange={(e) => setPForm({ ...pForm, languagesText: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={savingProfile}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[#172554] text-white rounded-md hover:bg-[#1e3170] disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{savingProfile ? 'Saving...' : 'Save Profile'}</span>
        </button>
      </form>

      {/* Education CRUD */}
      <div className="bg-white border border-[#172554]/10 rounded-lg p-6 space-y-5">
        <h2 className="font-serif text-2xl text-[#172554]">Education Records</h2>
        <div className="divide-y divide-[#172554]/10">
          {educations.map((edu) => (
            <div key={edu.id} className="py-3 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-sm text-[#172554]">
                  {edu.degree} — {edu.institution}
                </p>
                <p className="text-xs text-[#64748B]">
                  {edu.startYear} – {edu.isCurrent ? 'Present' : edu.endYear}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setConfirmDelete({ type: 'edu', id: edu.id, label: `${edu.degree} (${edu.institution})` })
                }
                className="p-2 text-rose-700 hover:bg-rose-50 rounded-md"
                aria-label="Delete education"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddEdu} className="pt-4 border-t border-[#172554]/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            type="text"
            required
            placeholder="Institution"
            value={newEdu.institution}
            onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
            className="px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
          />
          <input
            type="text"
            required
            placeholder="Degree / Certificate"
            value={newEdu.degree}
            onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
            className="px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
          />
          <input
            type="text"
            required
            placeholder="Start Year (e.g. 2023)"
            value={newEdu.startYear}
            onChange={(e) => setNewEdu({ ...newEdu, startYear: e.target.value })}
            className="px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="End Year / Present"
              value={newEdu.endYear}
              onChange={(e) => setNewEdu({ ...newEdu, endYear: e.target.value })}
              className="flex-1 px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-medium bg-[#172554] text-white rounded-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </form>
      </div>

      {/* Skills CRUD */}
      <div className="bg-white border border-[#172554]/10 rounded-lg p-6 space-y-5">
        <h2 className="font-serif text-2xl text-[#172554]">Skills</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="px-4 py-2.5 bg-[#FAF9F6] border border-[#172554]/10 rounded-md flex items-center justify-between gap-2"
            >
              <div>
                <p className="text-sm font-medium text-[#172554]">{skill.name}</p>
                <p className="text-xs text-[#64748B]">{skill.category}</p>
              </div>
              <button
                type="button"
                onClick={() => setConfirmDelete({ type: 'skill', id: skill.id, label: skill.name })}
                className="p-1.5 text-rose-700 hover:bg-rose-50 rounded"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddSkill} className="pt-4 border-t border-[#172554]/10 flex flex-wrap gap-3">
          <input
            type="text"
            required
            placeholder="Skill name"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            className="flex-1 min-w-[180px] px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
          />
          <input
            type="text"
            required
            placeholder="Category (Academic, Communication, Digital Tools)"
            value={newSkill.category}
            onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
            className="w-56 px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-[#172554] text-white rounded-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill</span>
          </button>
        </form>
      </div>

      {/* Training CRUD */}
      <div className="bg-white border border-[#172554]/10 rounded-lg p-6 space-y-5">
        <h2 className="font-serif text-2xl text-[#172554]">Professional Training</h2>
        <div className="space-y-3">
          {trainings.map((tr) => (
            <div
              key={tr.id}
              className="p-4 bg-[#FAF9F6] border border-[#172554]/10 rounded-md flex items-start justify-between gap-4"
            >
              <div>
                <p className="font-medium text-sm text-[#172554]">
                  {tr.title} — {tr.provider} ({tr.duration})
                </p>
                <p className="text-xs text-[#64748B] mt-1">{tr.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setConfirmDelete({ type: 'training', id: tr.id, label: tr.title })}
                className="p-2 text-rose-700 hover:bg-rose-50 rounded-md shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddTraining} className="pt-4 border-t border-[#172554]/10 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Training Title"
              value={newTraining.title}
              onChange={(e) => setNewTraining({ ...newTraining, title: e.target.value })}
              className="px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
            />
            <input
              type="text"
              required
              placeholder="Provider (e.g. DigiSkills.pk)"
              value={newTraining.provider}
              onChange={(e) => setNewTraining({ ...newTraining, provider: e.target.value })}
              className="px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
            />
            <input
              type="text"
              required
              placeholder="Duration (e.g. 6 Months)"
              value={newTraining.duration}
              onChange={(e) => setNewTraining({ ...newTraining, duration: e.target.value })}
              className="px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
            />
          </div>
          <textarea
            rows={2}
            required
            placeholder="Training description"
            value={newTraining.description}
            onChange={(e) => setNewTraining({ ...newTraining, description: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
          />
          <textarea
            rows={2}
            placeholder="Key topics covered (one per line)"
            value={newTraining.highlightsText}
            onChange={(e) => setNewTraining({ ...newTraining, highlightsText: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-[#172554] text-white rounded-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Training</span>
          </button>
        </form>
      </div>

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title="Delete Record"
        description={`Are you sure you want to delete "${confirmDelete?.label}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={executeDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
