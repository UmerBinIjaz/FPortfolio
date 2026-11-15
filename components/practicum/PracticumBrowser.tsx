'use client';

import React, { useMemo, useState } from 'react';
import { BookOpen, Download, ExternalLink, FileText, PlayCircle } from 'lucide-react';
import { TEACHING_MATERIAL_CATEGORIES, TEACHING_METHODOLOGIES } from '@/lib/constants';
import { EmptyState } from '@/components/ui/empty-state';
import { MediaFrame } from '@/components/ui/media-frame';
import { formatDate } from '@/lib/utils';

export interface LessonPlanItem {
  id: string;
  title: string;
  slug: string;
  subjectTopic: string;
  targetLevel: string;
  learningObjectives: string[];
  duration: string;
  methodology: string;
  requiredResources: string[];
  warmUpActivity: string;
  lessonDevelopment: string;
  studentActivities: string;
  assessment: string;
  homework: string | null;
  teacherReflection: string | null;
  documentUrl: string | null;
  documentName: string | null;
}

export interface DemoItem {
  id: string;
  title: string;
  slug: string;
  topic: string;
  description: string;
  videoUrl: string | null;
  externalVideoUrl: string | null;
  thumbnailUrl: string | null;
  galleryUrls: string[];
  demonstrationDate: Date | string | null;
}

export interface ResourceItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  targetLevel: string | null;
  fileUrl: string | null;
  fileType: string | null;
  externalUrl: string | null;
}

export interface TeachingReflectionItem {
  id: string;
  title: string;
  slug: string;
  context: string;
  whatText: string;
  soWhatText: string;
  nowWhatText: string;
  methodologyStudied: string | null;
  reflectionDate: Date | string | null;
}

interface PracticumBrowserProps {
  lessonPlans: LessonPlanItem[];
  demonstrations: DemoItem[];
  resources: ResourceItem[];
  reflections: TeachingReflectionItem[];
}

type PracticumTab =
  | 'lesson-plans'
  | 'demonstrations'
  | 'materials'
  | 'methodologies'
  | 'reflections';

export function PracticumBrowser({
  lessonPlans,
  demonstrations,
  resources,
  reflections,
}: PracticumBrowserProps) {
  const [activeTab, setActiveTab] = useState<PracticumTab>('lesson-plans');
  const [materialCategory, setMaterialCategory] = useState<string>('All');
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(
    lessonPlans[0]?.id ?? null
  );

  const filteredResources = useMemo(() => {
    if (materialCategory === 'All') return resources;
    return resources.filter((r) => r.category === materialCategory);
  }, [resources, materialCategory]);

  const implementedMethodologies = useMemo(() => {
    const set = new Set<string>();
    lessonPlans.forEach((p) => set.add(p.methodology.toLowerCase()));
    return set;
  }, [lessonPlans]);

  const tabs: Array<{ id: PracticumTab; label: string; count?: number }> = [
    { id: 'lesson-plans', label: 'Lesson Plans', count: lessonPlans.length },
    { id: 'demonstrations', label: 'Demonstrations', count: demonstrations.length },
    { id: 'materials', label: 'Teaching Materials', count: resources.length },
    { id: 'methodologies', label: 'Methodologies', count: TEACHING_METHODOLOGIES.length },
    { id: 'reflections', label: 'Reflective Practice', count: reflections.length },
  ];

  return (
    <div className="space-y-10">
      <div
        role="tablist"
        aria-label="Teaching Practicum Sections"
        className="flex flex-wrap gap-2 border-b border-[#4C0519]/10 pb-4"
      >
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                active
                  ? 'bg-[#BE185D] text-white'
                  : 'bg-white border border-[#4C0519]/15 text-[#271C22] hover:bg-[#FCE7F3]/60'
              }`}
            >
              {tab.label}
              {typeof tab.count === 'number' ? ` (${tab.count})` : ''}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Lesson Plans */}
      {activeTab === 'lesson-plans' && (
        <div>
          {lessonPlans.length === 0 ? (
            <EmptyState
              title="No Lesson Plans Published Yet"
              description="Structured English Language Teaching lesson plans—including learning objectives, warm-up activities, lesson development, assessment, and reflections—will appear here once added through the Admin Panel."
              secondaryHref="/admin/teaching-practicum"
              secondaryLabel="Add Lesson Plan in Admin"
            />
          ) : (
            <div className="space-y-6">
              {lessonPlans.map((plan) => {
                const isOpen = expandedPlanId === plan.id;
                return (
                  <div
                    key={plan.id}
                    className="bg-white border border-[#4C0519]/10 rounded-lg p-6 md:p-8"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E5A64] mb-2">
                          <span>{plan.subjectTopic}</span>
                          <span aria-hidden="true">·</span>
                          <span>{plan.targetLevel}</span>
                          <span aria-hidden="true">·</span>
                          <span>{plan.duration}</span>
                          <span aria-hidden="true">·</span>
                          <span>{plan.methodology}</span>
                        </div>
                        <h3 className="font-serif text-2xl text-[#4C0519]">{plan.title}</h3>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {plan.documentUrl && (
                          <a
                            href={plan.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border border-[#4C0519]/20 text-[#4C0519] rounded-md hover:bg-[#FCE7F3]/50 whitespace-nowrap"
                          >
                            <Download className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>{plan.documentName || 'Download Plan'}</span>
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => setExpandedPlanId(isOpen ? null : plan.id)}
                          className="px-4 py-2 text-xs font-medium bg-[#BE185D] text-white rounded-md hover:bg-[#9D174D] whitespace-nowrap"
                        >
                          {isOpen ? 'Hide Details' : 'View Full Plan'}
                        </button>
                      </div>
                    </div>

                    {isOpen && (
                      <div className="mt-6 pt-6 border-t border-[#4C0519]/10 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        {plan.learningObjectives.length > 0 && (
                          <div>
                            <h4 className="font-serif text-base text-[#4C0519] mb-2">
                              Learning Objectives
                            </h4>
                            <ul className="space-y-1.5 text-[#271C22]/85">
                              {plan.learningObjectives.map((obj) => (
                                <li key={obj} className="flex items-start gap-2">
                                  <span className="text-[#F59E0B] font-bold" aria-hidden="true">•</span>
                                  <span>{obj}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {plan.requiredResources.length > 0 && (
                          <div>
                            <h4 className="font-serif text-base text-[#4C0519] mb-2">
                              Required Resources
                            </h4>
                            <ul className="space-y-1.5 text-[#271C22]/85">
                              {plan.requiredResources.map((res) => (
                                <li key={res} className="flex items-start gap-2">
                                  <span className="text-[#F59E0B] font-bold" aria-hidden="true">•</span>
                                  <span>{res}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div>
                          <h4 className="font-serif text-base text-[#4C0519] mb-1.5">
                            Warm-Up Activity
                          </h4>
                          <p className="text-[#6E5A64] leading-relaxed whitespace-pre-line">
                            {plan.warmUpActivity}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-serif text-base text-[#4C0519] mb-1.5">
                            Lesson Development
                          </h4>
                          <p className="text-[#6E5A64] leading-relaxed whitespace-pre-line">
                            {plan.lessonDevelopment}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-serif text-base text-[#4C0519] mb-1.5">
                            Student Activities
                          </h4>
                          <p className="text-[#6E5A64] leading-relaxed whitespace-pre-line">
                            {plan.studentActivities}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-serif text-base text-[#4C0519] mb-1.5">
                            Assessment
                          </h4>
                          <p className="text-[#6E5A64] leading-relaxed whitespace-pre-line">
                            {plan.assessment}
                          </p>
                        </div>
                        {plan.homework && (
                          <div>
                            <h4 className="font-serif text-base text-[#4C0519] mb-1.5">Homework</h4>
                            <p className="text-[#6E5A64] leading-relaxed whitespace-pre-line">
                              {plan.homework}
                            </p>
                          </div>
                        )}
                        {plan.teacherReflection && (
                          <div>
                            <h4 className="font-serif text-base text-[#4C0519] mb-1.5">
                              Teacher Reflection
                            </h4>
                            <p className="text-[#6E5A64] leading-relaxed whitespace-pre-line">
                              {plan.teacherReflection}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Demonstrations */}
      {activeTab === 'demonstrations' && (
        <div>
          {demonstrations.length === 0 ? (
            <EmptyState
              title="No Teaching Demonstrations Uploaded Yet"
              description="Verified micro-teaching videos, external demonstration links, and genuine classroom documentation will appear here once uploaded via the Admin Panel."
              secondaryHref="/admin/teaching-practicum"
              secondaryLabel="Add Demonstration in Admin"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              {demonstrations.map((demo) => (
                <div
                  key={demo.id}
                  className="bg-white border border-[#4C0519]/10 rounded-lg overflow-hidden p-6 space-y-4"
                >
                  {demo.videoUrl ? (
                    <video
                      controls
                      preload="metadata"
                      className="w-full rounded-md bg-black aspect-video"
                      poster={demo.thumbnailUrl || undefined}
                    >
                      <source src={demo.videoUrl} />
                    </video>
                  ) : (
                    <MediaFrame
                      src={demo.thumbnailUrl}
                      alt={demo.title}
                      fallbackTitle={demo.title}
                      aspectClass="aspect-[16/9]"
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#6E5A64] mb-1">
                      <span>{demo.topic}</span>
                      {demo.demonstrationDate && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{formatDate(demo.demonstrationDate)}</span>
                        </>
                      )}
                    </div>
                    <h3 className="font-serif text-xl text-[#4C0519] mb-2">{demo.title}</h3>
                    <p className="text-sm text-[#6E5A64] leading-relaxed">{demo.description}</p>
                  </div>
                  {demo.externalVideoUrl && (
                    <a
                      href={demo.externalVideoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-[#BE185D] hover:text-[#4C0519]"
                    >
                      <PlayCircle className="w-4 h-4" aria-hidden="true" />
                      <span>Watch External Video</span>
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Teaching Materials */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {['All', ...TEACHING_MATERIAL_CATEGORIES].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setMaterialCategory(cat)}
                className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  materialCategory === cat
                    ? 'bg-[#BE185D] text-white'
                    : 'bg-white border border-[#4C0519]/15 text-[#271C22] hover:bg-[#FCE7F3]/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredResources.length === 0 ? (
            <EmptyState
              title="No Teaching Materials Published Yet"
              description="Original worksheets, grammar exercises, reading activities, vocabulary tasks, and presentation slides will appear here when added through the Admin Panel."
              secondaryHref="/admin/teaching-practicum"
              secondaryLabel="Add Material in Admin"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((res) => (
                <div
                  key={res.id}
                  className="bg-white border border-[#4C0519]/10 rounded-lg p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#6E5A64] mb-2">
                      <span>{res.category}</span>
                      {res.targetLevel && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{res.targetLevel}</span>
                        </>
                      )}
                    </div>
                    <h3 className="font-serif text-xl text-[#4C0519] mb-2">{res.title}</h3>
                    <p className="text-sm text-[#6E5A64] leading-relaxed mb-4">
                      {res.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 pt-3 border-t border-[#4C0519]/10">
                    {res.fileUrl && (
                      <a
                        href={res.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#BE185D] hover:text-[#4C0519]"
                      >
                        <FileText className="w-4 h-4" aria-hidden="true" />
                        <span>Download {res.fileType || 'Resource'}</span>
                      </a>
                    )}
                    {res.externalUrl && (
                      <a
                        href={res.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#BE185D] hover:text-[#4C0519]"
                      >
                        <ExternalLink className="w-4 h-4" aria-hidden="true" />
                        <span>Open Link</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Teaching Methodologies */}
      {activeTab === 'methodologies' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#FCE7F3]/75 via-[#FFFBF7] to-[#FEF3C7]/75 border border-[#BE185D]/20 rounded-xl p-5 text-sm text-[#271C22]/85">
            Transparent distinction: Methodologies below are categorized as{' '}
            <strong className="text-[#4C0519]">Studied Approach</strong> while in academic preparation, and automatically display as{' '}
            <strong className="text-[#4C0519]">Implemented in Lesson Plan</strong> once documented in a published lesson plan.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TEACHING_METHODOLOGIES.map((m, idx) => {
              const isImplemented = Array.from(implementedMethodologies).some((val) =>
                val.includes(m.name.toLowerCase().split(' (')[0])
              );
              const barColors = [
                'bg-[#BE185D]',
                'bg-[#F59E0B]',
                'bg-[#7E22CE]',
                'bg-[#0F766E]',
              ];
              return (
                <div
                  key={m.name}
                  className="bg-white border border-[#4C0519]/12 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className={`h-1.5 w-full ${barColors[idx % barColors.length]}`} />
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-3 text-xs mb-2">
                      <span className="text-[#BE185D] font-semibold">
                        {isImplemented ? 'Implemented in Lesson Plan' : m.status}
                      </span>
                      <BookOpen className="w-4 h-4 text-[#F59E0B]" aria-hidden="true" />
                    </div>
                    <h3 className="font-serif text-xl text-[#4C0519] mb-2">{m.name}</h3>
                    <p className="text-sm text-[#6E5A64] leading-relaxed">{m.summary}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: Reflective Teaching Practice */}
      {activeTab === 'reflections' && (
        <div>
          {reflections.length === 0 ? (
            <EmptyState
              title="No Practicum Reflections Recorded Yet"
              description="Structured teaching reflections using the What? / So What? / Now What? model will be displayed here as practicum observations and teaching demonstrations take place."
              secondaryHref="/admin/teaching-practicum"
              secondaryLabel="Add Reflection in Admin"
            />
          ) : (
            <div className="space-y-6">
              {reflections.map((ref) => (
                <article
                  key={ref.id}
                  className="bg-white border border-[#4C0519]/10 rounded-lg p-7 space-y-5"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E5A64] mb-2">
                      <span>{ref.context}</span>
                      {ref.methodologyStudied && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{ref.methodologyStudied}</span>
                        </>
                      )}
                      {ref.reflectionDate && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{formatDate(ref.reflectionDate)}</span>
                        </>
                      )}
                    </div>
                    <h3 className="font-serif text-2xl text-[#4C0519]">{ref.title}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#4C0519]/10 text-sm">
                    <div>
                      <h4 className="font-serif text-base text-[#4C0519] mb-1.5">What?</h4>
                      <p className="text-[#6E5A64] leading-relaxed whitespace-pre-line">
                        {ref.whatText}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-serif text-base text-[#4C0519] mb-1.5">So What?</h4>
                      <p className="text-[#6E5A64] leading-relaxed whitespace-pre-line">
                        {ref.soWhatText}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-serif text-base text-[#4C0519] mb-1.5">Now What?</h4>
                      <p className="text-[#6E5A64] leading-relaxed whitespace-pre-line">
                        {ref.nowWhatText}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
