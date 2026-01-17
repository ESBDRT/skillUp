const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const INPUT_DIR = 'C:/Users/hisle/Desktop/HACKKKKK/COURS_INDIVIDUELS/COURS_AVEC_QUIZ';
const OUTPUT_FILE = 'C:/Users/hisle/Desktop/HACKKKKK/remix-of-klemann-le-boss/import_courses.sql';
const POC_USER_ID = "00000000-0000-0000-0000-000000000001";

// Helper to escape SQL strings
const escapeSql = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/'/g, "''");
};

// Start SQL file
let sqlContent = `-- Import Courses SQL Generated at ${new Date().toISOString()}
-- Based on files in ${INPUT_DIR}

BEGIN;

`;

// Process files
try {
    const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.json'));
    console.log(`Found ${files.length} JSON files.`);

    files.forEach(file => {
        console.log(`Processing ${file}...`);
        const filePath = path.join(INPUT_DIR, file);
        const rawData = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(rawData);

        // Handle both single object and "courses" array format
        const courses = data.courses ? data.courses : [data];

        courses.forEach(course => {
            const courseId = crypto.randomUUID();
            const title = escapeSql(course.title);
            const description = escapeSql(course.description || '');
            const category = escapeSql(course.category || 'Général');
            const level = escapeSql(course.level || 'beginner');
            const estimatedMinutes = course.estimatedMinutes || 15;
            const icon = escapeSql(course.icon || '📚');

            // Flatten cards (handle Quiz with questions array)
            let flattenedCards = [];

            // Determine daily cards count (heuristic)
            const inputCards = course.cards || [];

            inputCards.forEach(card => {
                if (card.type === 'quiz' && card.questions && Array.isArray(card.questions)) {
                    // Flatten multi-question quiz
                    card.questions.forEach((q, qIndex) => {
                        flattenedCards.push({
                            type: 'quiz',
                            title: escapeSql(q.question || `Quiz ${qIndex + 1}`),
                            content: escapeSql(q.question),
                            options: JSON.stringify(q.answers.map((ans, idx) => ({
                                id: `opt-${idx}`,
                                text: ans,
                                isCorrect: idx === q.correctAnswerIndex
                            }))),
                            xpReward: card.xpReward || 10,
                            flashcardBack: null,
                            sliderConfig: null
                        });
                    });
                } else {
                    // Standard card
                    let options = null;
                    if (card.options) {
                        options = JSON.stringify(card.options.map((opt, idx) => {
                            if (typeof opt === 'string') return { id: `opt-${idx}`, text: opt, isCorrect: idx === (card.correctIndex || 0) };
                            return opt;
                        }));
                    }

                    flattenedCards.push({
                        type: card.type,
                        title: escapeSql(card.title),
                        content: escapeSql(card.content),
                        options: options, // Already stringified above or null
                        xpReward: card.xpReward || 10,
                        flashcardBack: card.flashcardBack ? escapeSql(card.flashcardBack) : null,
                        sliderConfig: card.sliderConfig ? JSON.stringify(card.sliderConfig) : null
                    });
                }
            });

            const totalCards = flattenedCards.length;
            // Calculate schedule
            const cardsPerDay = 6; // Reasonable default
            const durationDays = Math.ceil(totalCards / cardsPerDay);
            const totalXP = flattenedCards.reduce((sum, c) => sum + (c.xpReward || 0), 0);

            console.log(`  Course "${title}": ${totalCards} cards, ${durationDays} days`);

            // 1. INSERT COURSE
            sqlContent += `-- Course: ${title}\n`;
            sqlContent += `INSERT INTO public.courses (id, user_id, title, description, category, level, estimated_minutes, icon, total_xp, is_published, duration_days, daily_cards_count)
VALUES ('${courseId}', '${POC_USER_ID}', '${title}', '${description}', '${category}', '${level}', ${estimatedMinutes}, '${icon}', ${totalXP}, true, ${durationDays}, ${cardsPerDay});\n\n`;

            // 2. INSERT CARDS
            flattenedCards.forEach((card, index) => {
                const optionsSql = card.options ? `'${escapeSql(card.options)}'` : 'NULL';
                const flashcardBackSql = card.flashcardBack ? `'${card.flashcardBack}'` : 'NULL';
                const sliderConfigSql = card.sliderConfig ? `'${card.sliderConfig}'` : 'NULL';

                sqlContent += `INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('${courseId}', ${index}, '${card.type}', '${card.title}', '${card.content}', ${optionsSql}, ${flashcardBackSql}, ${sliderConfigSql}, ${card.xpReward});\n`;
            });
            sqlContent += '\n';

            // 3. INSERT SESSIONS
            let currentCardIndex = 0;
            const today = new Date();

            for (let day = 0; day < durationDays; day++) {
                const startIndex = currentCardIndex;
                const endIndex = Math.min(currentCardIndex + cardsPerDay - 1, totalCards - 1);

                if (startIndex > totalCards - 1) break;

                // Schedule dates starting from today
                const sessionDate = new Date(today);
                sessionDate.setDate(today.getDate() + day);
                const dateStr = sessionDate.toISOString().split('T')[0];

                sqlContent += `INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('${POC_USER_ID}', '${courseId}', '${dateStr}', ${day + 1}, ${startIndex}, ${endIndex})
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;\n`;

                currentCardIndex = endIndex + 1;
            }
            sqlContent += '\n';

        });
    });

    sqlContent += `COMMIT;\n`;

    fs.writeFileSync(OUTPUT_FILE, sqlContent);
    console.log(`Successfully generated SQL at ${OUTPUT_FILE}`);

} catch (err) {
    console.error("Error generating SQL:", err);
}
