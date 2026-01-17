
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Define types based on what we saw in the codebase
interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface QuizCard {
  type: 'quiz';
  title: string;
  content: string;
  options: Option[];
  xpReward: number;
}

// 1. Load the course file
const coursePath = join('..', 'COURS_INDIVIDUELS', '1944-1947_refonder_la_république_redéfinir_la_démocratie.json');
console.log(`Reading course from: ${coursePath}`);
const courseRaw = readFileSync(coursePath, 'utf-8');
const courseData = JSON.parse(courseRaw);

// 2. Define AI-generated questions (Simulation)
const generatedQuizzes: QuizCard[] = [
  {
    type: 'quiz',
    title: 'Question 1',
    content: 'Quel est le rôle principal du Gouvernement Provisoire de la République Française (GPRF) ?',
    options: [
      { id: 'opt-0-0', text: 'Installer une dictature militaire provisoire', isCorrect: false },
      { id: 'opt-0-1', text: 'Rétablir la légalité républicaine et préparer les élections', isCorrect: true },
      { id: 'opt-0-2', text: 'Négocier une alliance avec l\'Allemagne', isCorrect: false },
      { id: 'opt-0-3', text: 'Abolir le droit de vote', isCorrect: false }
    ],
    xpReward: 25
  },
  {
    type: 'quiz',
    title: 'Question 2',
    content: 'Quelle avancée sociale majeure est adoptée en 1944 ?',
    options: [
      { id: 'opt-1-0', text: 'La semaine de 35 heures', isCorrect: false },
      { id: 'opt-1-1', text: 'Les congés payés', isCorrect: false },
      { id: 'opt-1-2', text: 'Le droit de vote des femmes', isCorrect: true },
      { id: 'opt-1-3', text: 'La scolarité obligatoire jusqu\'à 18 ans', isCorrect: false }
    ],
    xpReward: 25
  },
  {
    type: 'quiz',
    title: 'Question 3',
    content: 'Pourquoi le Général de Gaulle démissionne-t-il en 1946 ?',
    options: [
      { id: 'opt-2-0', text: 'Il est en désaccord avec le projet de constitution qui donne trop de pouvoir au parlement', isCorrect: true },
      { id: 'opt-2-1', text: 'Il veut prendre sa retraite', isCorrect: false },
      { id: 'opt-2-2', text: 'Il est chassé par les communistes', isCorrect: false },
      { id: 'opt-2-3', text: 'Il veut fonder une monarchie', isCorrect: false }
    ],
    xpReward: 25
  }
];

// 3. Inject quizzes into the course structure
// Assuming structure: data.courses[0].cards
if (courseData.courses && courseData.courses.length > 0) {
    // Insert after the lesson content
    courseData.courses[0].cards.push(...generatedQuizzes);
    console.log(`Added ${generatedQuizzes.length} quiz cards to the course.`);
} else {
    console.error("Invalid course structure found.");
    process.exit(1);
}

// 4. Save the new file
const outputPath = join('..', 'COURS_INDIVIDUELS', '1944-1947_refonder_la_république_redéfinir_la_démocratie_WITH_QUIZ.json');
writeFileSync(outputPath, JSON.stringify(courseData, null, 2), 'utf-8');

console.log(`\nSuccess! Generated file saved at: ${outputPath}`);
console.log("You can now inspect this file to verify the quiz integration.");
