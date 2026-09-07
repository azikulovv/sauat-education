import type { Subject } from '~/entities/subject'
import { subjects } from '~/entities/subject'

export async function getSubjects(): Promise<Subject[]> {
  await new Promise((resolve) => setTimeout(resolve, 250))

  return subjects
}

export async function getSubject(subjectId: string): Promise<Subject | undefined> {
  const result = await getSubjects()

  return result.find((subject) => subject.id === subjectId)
}
