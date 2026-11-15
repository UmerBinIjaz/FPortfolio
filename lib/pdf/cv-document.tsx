import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FAF9F6',
    fontFamily: 'Helvetica',
  },
  sidebar: {
    width: '34%',
    backgroundColor: '#172554',
    color: '#FAF9F6',
    padding: 26,
    minHeight: '100%',
  },
  main: {
    width: '66%',
    padding: 30,
    color: '#252525',
  },
  name: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#FAF9F6',
    marginBottom: 4,
  },
  role: {
    fontSize: 10,
    color: '#C5A46D',
    marginBottom: 14,
    lineHeight: 1.4,
  },
  contactBlock: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2E3F7F',
  },
  contactLine: {
    fontSize: 8.5,
    color: '#E2E8F0',
    marginBottom: 4,
  },
  sideHeading: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#C5A46D',
    letterSpacing: 1.2,
    marginTop: 10,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  eduItem: {
    marginBottom: 11,
  },
  eduInst: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
  },
  eduPeriod: {
    fontSize: 8,
    color: '#C5A46D',
    marginTop: 1,
  },
  eduDegree: {
    fontSize: 8.5,
    color: '#E2E8F0',
    marginTop: 2,
  },
  bulletItem: {
    fontSize: 8.5,
    color: '#E2E8F0',
    marginBottom: 4,
    lineHeight: 1.35,
  },
  mainHeading: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#172554',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#C5A46D',
    paddingBottom: 4,
    marginBottom: 10,
    marginTop: 4,
  },
  summaryText: {
    fontSize: 9.5,
    lineHeight: 1.55,
    color: '#252525',
    marginBottom: 18,
  },
  trainingBlock: {
    marginBottom: 16,
  },
  trainingTitle: {
    fontSize: 10.5,
    fontFamily: 'Helvetica-Bold',
    color: '#172554',
  },
  trainingMeta: {
    fontSize: 8.5,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 6,
  },
  mainBullet: {
    fontSize: 9,
    color: '#252525',
    marginBottom: 3.5,
    lineHeight: 1.4,
    paddingLeft: 6,
  },
  footerNote: {
    marginTop: 18,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    fontSize: 8,
    color: '#64748B',
  },
});

export interface CvDocumentProps {
  profile: {
    fullName: string;
    title: string;
    tagline: string;
    location: string;
    email: string;
    phone: string;
    summary: string;
    languages: string[];
  };
  educations: Array<{
    institution: string;
    degree: string;
    startYear: string;
    endYear?: string | null;
    isCurrent?: boolean;
  }>;
  skills: Array<{
    name: string;
  }>;
  trainings: Array<{
    title: string;
    provider: string;
    duration: string;
    highlights: string[];
  }>;
}

export function CvPdfDocument({ profile, educations, skills, trainings }: CvDocumentProps) {
  return (
    <Document
      title={`${profile.fullName} — Curriculum Vitae`}
      author={profile.fullName}
      subject="Academic & Professional Curriculum Vitae"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}>
          <Text style={styles.name}>{profile.fullName}</Text>
          <Text style={styles.role}>{profile.title}</Text>

          <View style={styles.contactBlock}>
            <Text style={styles.contactLine}>{profile.location}</Text>
            <Text style={styles.contactLine}>{profile.email}</Text>
            <Text style={styles.contactLine}>{profile.phone}</Text>
          </View>

          <Text style={styles.sideHeading}>Education</Text>
          {educations.map((edu, idx) => (
            <View key={idx} style={styles.eduItem}>
              <Text style={styles.eduInst}>{edu.institution}</Text>
              <Text style={styles.eduPeriod}>
                {edu.startYear} – {edu.isCurrent ? 'Present' : edu.endYear || ''}
              </Text>
              <Text style={styles.eduDegree}>{edu.degree}</Text>
            </View>
          ))}

          <Text style={styles.sideHeading}>Skills</Text>
          {skills.map((skill, idx) => (
            <Text key={idx} style={styles.bulletItem}>
              • {skill.name}
            </Text>
          ))}

          <Text style={styles.sideHeading}>Languages</Text>
          {profile.languages.map((lang, idx) => (
            <Text key={idx} style={styles.bulletItem}>
              • {lang}
            </Text>
          ))}
        </View>

        <View style={styles.main}>
          <Text style={styles.mainHeading}>Professional Summary</Text>
          <Text style={styles.summaryText}>{profile.summary}</Text>

          <Text style={styles.mainHeading}>Professional Training</Text>
          {trainings.map((training, idx) => (
            <View key={idx} style={styles.trainingBlock}>
              <Text style={styles.trainingTitle}>{training.title}</Text>
              <Text style={styles.trainingMeta}>
                {training.provider} · {training.duration}
              </Text>
              {training.highlights.map((item, hIdx) => (
                <Text key={hIdx} style={styles.mainBullet}>
                  • {item}
                </Text>
              ))}
            </View>
          ))}

          <View style={styles.footerNote}>
            <Text>{profile.tagline}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
