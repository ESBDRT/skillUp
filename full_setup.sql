-- Migration to fix RLS policies for POC environment
-- This allows the hardcoded POC_USER_ID to access data without proper authentication

-- 1. COURSES
DROP POLICY IF EXISTS "Users can view their own courses" ON public.courses;
DROP POLICY IF EXISTS "Users can view published courses" ON public.courses;
DROP POLICY IF EXISTS "Users can create their own courses" ON public.courses;
DROP POLICY IF EXISTS "Users can update their own courses" ON public.courses;
DROP POLICY IF EXISTS "Users can delete their own courses" ON public.courses;

CREATE POLICY "POC: Full access to courses"
ON public.courses
FOR ALL
USING (true)
WITH CHECK (true);

-- 2. COURSE_CARDS
DROP POLICY IF EXISTS "Users can view cards of their courses" ON public.course_cards;
DROP POLICY IF EXISTS "Users can create cards for their courses" ON public.course_cards;
DROP POLICY IF EXISTS "Users can update cards of their courses" ON public.course_cards;
DROP POLICY IF EXISTS "Users can delete cards of their courses" ON public.course_cards;

CREATE POLICY "POC: Full access to cards"
ON public.course_cards
FOR ALL
USING (true)
WITH CHECK (true);

-- 3. COURSE_PROGRESS
DROP POLICY IF EXISTS "Users can view their own progress" ON public.course_progress;
DROP POLICY IF EXISTS "Users can create their own progress" ON public.course_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON public.course_progress;
DROP POLICY IF EXISTS "Users can delete their own progress" ON public.course_progress;

CREATE POLICY "POC: Full access to progress"
ON public.course_progress
FOR ALL
USING (true)
WITH CHECK (true);
-- Import Courses SQL Generated at 2026-01-17T15:00:14.690Z
-- Based on files in C:/Users/hisle/Desktop/HACKKKKK/COURS_INDIVIDUELS/COURS_AVEC_QUIZ

BEGIN;

-- Course: Alimentation et digestion
INSERT INTO public.courses (id, user_id, title, description, category, level, estimated_minutes, icon, total_xp, is_published, duration_days, daily_cards_count)
VALUES ('f41b4ba5-180b-41b3-9a49-69da3c603b74', '00000000-0000-0000-0000-000000000001', 'Alimentation et digestion', 'Cours de SVT : Alimentation et digestion', 'SVT', '3eme', 38, '📚', 690, true, 5, 6);

INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f41b4ba5-180b-41b3-9a49-69da3c603b74', 0, 'lesson', 'Introduction', 'Afin d’assurer ses besoins, le corps humain a besoin de nutriments. Ces nutriments sont des molécules très petites car elles doivent pouvoir être dissoutes.
Nous verrons donc comment la digestion permet de passer des aliments que nous mangeons à des molécules absorbables, puis comment les nutriments sont absorbés par l’organisme.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f41b4ba5-180b-41b3-9a49-69da3c603b74', 1, 'lesson', 'Le trajet des aliments dans le tube digestif', 'Les aliments que nous ingérons parcourent un long chemin dans le tube digestif avant d’être assimilés par le corps.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f41b4ba5-180b-41b3-9a49-69da3c603b74', 2, 'lesson', 'Appareil digestif', 'L''appareil digestif est composé du tube digestif, où circulent les aliments, et des glandes digestives qui lui sont associées.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f41b4ba5-180b-41b3-9a49-69da3c603b74', 3, 'lesson', 'Glandes digestives', 'Les glandes digestives sont les organes qui aident à la digestion en sécrétant des enzymes. Les aliments ne passent pas dans les glandes digestives annexes.

Le tube digestif comprend plusieurs organes permettant la digestion des aliments et l’absorption des nutriments. L’aliment est ainsi ingéré par la bouche, puis ce qui n’a pas été absorbé est rejeté par l’anus.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f41b4ba5-180b-41b3-9a49-69da3c603b74', 4, 'lesson', 'Nutriment', 'Le mot nutriment désigne les substances procurées par l''alimentation une fois la digestion faite. Les nutriments regroupent les acides aminés, les glucides, les lipides, mais aussi les minéraux et les vitamines.

La bouche permet d’ingérer les aliments. Une fois avalés, les aliments passent par l’œsophage, un long tube reliant la cavité buccale à l’estomac.
L’estomac est un organe en forme de poche, qui garde les aliments pendant plusieurs heures pour les dégrader chimiquement.
Une fois que les aliments sont assez digérés, ils passent dans l’intestin grêle. Dans la première partie de l’intestin grêle, les sucs digestifs de plusieurs glandes sont déversés.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f41b4ba5-180b-41b3-9a49-69da3c603b74', 5, 'lesson', 'Astuce', 'Les sucs digestifs continuent la digestion chimique, clivant les aliments prédigérés dans l’estomac en molécules assez petites pour être ingérées.

Tout le long de l’intestin, des cellules intestinales permettent d’absorber les nutriments, et de les faire passer dans le sang.

Dans la continuité de l’intestin grêle, on trouve le gros intestin. Comme son nom l’indique, il est plus large que l’intestin grêle, mais il est aussi plus court. Il est composé dans sa plus grande partie du colon. C’est dans cette zone du tube digestif que le surplus d’eau est absorbé.
Enfin, l’anus est l’orifice permettant la sortie de ce qui n’a pas été digéré, c’est à dire des aliments pas suffisamment digérés et des nutriments non absorbés.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f41b4ba5-180b-41b3-9a49-69da3c603b74', 6, 'lesson', 'La digestion mécanique', 'La digestion mécanique a pour but de réduire les gros morceaux d''aliments en de plus petits morceaux tout en les mélangeant.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f41b4ba5-180b-41b3-9a49-69da3c603b74', 7, 'lesson', 'Le tube digestif agit en quelque sorte comme un hachoir ou un broyeur.', 'Dans la bouche, la mastication des aliments est la première étape de la digestion mécanique. Les dents coupent, déchirent et broient les aliments en morceaux plus fins, faciles à avaler. La langue malaxe ces différents morceaux, plus faciles à mâcher.

Les aliments broyés s’accumulent ensuite dans l''estomac. Les muscles qui forment la paroi de l''estomac se contractent et créent des mouvements de brassage. Le contenu de l''estomac est ainsi brassé et mélangé durant environ quatre heures.

Dans l’intestin grêle et le colon, des mouvements permettent également de brasser le contenu du tube digestif, et de le faire avancer peu à peu.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f41b4ba5-180b-41b3-9a49-69da3c603b74', 8, 'lesson', 'La digestion chimique', 'La digestion chimique est un processus qui se fait en même temps que la digestion mécanique, qu’il vient compléter en s''attaquant à la nature même des aliments.
Les liquides permettant la digestion chimique sont produits et sécrétés par les glandes digestives, et sont déversés dans le tube digestif. Ils contiennent des enzymes, qui vont aider à dégrader les aliments en nutriments.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f41b4ba5-180b-41b3-9a49-69da3c603b74', 9, 'lesson', 'Substance sécrétée par les glandes digestives qui dégrade les aliments.', 'Dans la bouche, les glandes salivaires sécrètent la salive qui permet à la fois d’humidifier la bouche et d’aider la progression des aliments dans l’œsophage.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f41b4ba5-180b-41b3-9a49-69da3c603b74', 10, 'lesson', 'La salive permet surtout une première dégradation chimique des aliments.', 'L’estomac, quant à lui, sécrète les sucs gastriques qui se mélangent au contenu du repas ingéré. Ces sucs dégradent très fortement les particules alimentaires par des réactions chimiques, les grosses molécules formant les aliments deviennent des molécules plus petites.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f41b4ba5-180b-41b3-9a49-69da3c603b74', 11, 'lesson', 'C’est dans l’estomac que se passe la majorité de la dégradation des aliments.', 'Dans l’intestin grêle, des sucs digestifs vont aussi se mélanger à ce qui a été prédigéré par l’estomac. Ces sucs digestifs sont produits par des glandes annexes :

la bile, produite par le foie, permet de mélanger les lipides et l’eau, c’est l’émulsification ;
le suc pancréatique, produit par le pancréas, continue la dégradation des protéines, glucides et lipides.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f41b4ba5-180b-41b3-9a49-69da3c603b74', 12, 'lesson', 'Glande', 'Une glande est un organe produisant et sécrétant des substances, ici permettant la dégradation des aliments. On parle de glandes annexes car ce sont des organes qui font partie de l’appareil digestif mais les aliments n’y passent pas.

La bile et le suc pancréatique sont déversés dans le tube digestif au début de l’intestin grêle, et se mélangent alors au bol alimentaire, pour continuer la digestion chimique.
À ce stade, dans l’intestin grêle, les aliments sont presque totalement dégradés en nutriments, alors absorbables par l’organisme.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f41b4ba5-180b-41b3-9a49-69da3c603b74', 13, 'lesson', 'Le passage des nutriments dans le sang', 'Pour que les aliments digérés puissent être utilisés par le corps, nous devons absorber les nutriments en les faisant passer dans le sang.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f41b4ba5-180b-41b3-9a49-69da3c603b74', 14, 'lesson', 'L’absorption des nutriments se fait majoritairement dans l’intestin grêle.', 'L’intestin grêle est un organe dont la morphologie favorise l’absorption. En effet, la paroi de l’intestin est constituée de plis, appelés villosités, augmentant la surface d’échange entre l’intestin grêle et les nutriments.
Les glucides, protéines et lipides passent dans le sang ou la lymphe au niveau de la paroi de l’intestin grêle, qui est richement vascularisée.
Le sang arrivant au niveau d’une villosité de l’intestin est pauvre en nutriments. Au contact des cellules de l’intestin, il se charge en protéines et glucides, et repart enrichi.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f41b4ba5-180b-41b3-9a49-69da3c603b74', 15, 'lesson', 'À retenir', 'La digestion regroupe des phénomènes mécaniques et chimiques qui transforment des aliments en éléments nutritifs assimilables dans le sang, et utilisables par le corps.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f41b4ba5-180b-41b3-9a49-69da3c603b74', 16, 'lesson', 'Les besoins nutritionnels et la nature des aliments', 'Pour avoir une alimentation équilibrée, c’est-à-dire qui réponde aux besoins de notre corps, il est nécessaire de comprendre ses besoins.

Les aliments qui constituent un repas sont composés de matière minérale (eau, sels minéraux), de glucides (sucres), de lipides (graisses), de protéines, et de vitamines. Ils apportent au corps l’énergie dont il a besoin.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f41b4ba5-180b-41b3-9a49-69da3c603b74', 17, 'lesson', 'À retenir', 'L’apport en nutriments doit être qualitatif et quantitatif. Il doit contenir assez d’énergie pour subvenir aux besoins, c’est l’aspect quantitatif, mais les aliments de notre ration doivent aussi apporter tous les éléments indispensables, c’est l’aspect qualitatif. Les quantités des différents groupes doivent être respectées pour satisfaire les besoins nutritionnels.

Comme le montre le schéma précédent, la pyramide alimentaire permet de se représenter les proportions d’aliments qui devraient constituer notre alimentation.
Le bas de la pyramide comprend l’eau qui peut être bue à volonté dans la journée.
Puis, plus on monte vers le sommet de la pyramide, plus les aliments doivent être consommés avec modération pour avoir une alimentation saine et équilibrée.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f41b4ba5-180b-41b3-9a49-69da3c603b74', 18, 'lesson', 'À retenir', 'Une alimentation déséquilibrée est à l’origine de troubles de la santé, comme des carences ou de l’obésité .

Le système digestif est constitué du tube digestif, constitué lui-même des organes par lesquels passent les aliments, et des glandes digestives.
Les aliments que nous consommons subissent des dégradations mécaniques et chimiques, pour devenir des nutriments qui pourront être absorbés dans l’intestin grêle. Les nutriments (protéines, glucides, et lipides majoritairement) vont alors dans le sang et la lymphe pour être amenés au reste du corps.
Enfin, il est important de manger équilibré et de manière raisonnable, pour avoir un apport en nutriments proportionné. Une alimentation équilibrée permet de subvenir correctement aux besoins de notre corps.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f41b4ba5-180b-41b3-9a49-69da3c603b74', 19, 'quiz', 'Qu''est-ce que : Le trajet des aliments dans le tube digestif ?', 'Qu''est-ce que : Le trajet des aliments dans le tube digestif ?', '[{"id":"opt-0","text":"Les aliments que nous ingérons parcourent un long chemin dans le tube digestif avant d’être assimilés par le corps.","isCorrect":true},{"id":"opt-1","text":"L''appareil digestif est composé du tube digestif, où circulent les aliments, et des glandes digestives qui lui sont associées.","isCorrect":false},{"id":"opt-2","text":"Les glandes digestives sont les organes qui aident à la digestion en sécrétant des enzymes.","isCorrect":false},{"id":"opt-3","text":"Le mot nutriment désigne les substances procurées par l''alimentation une fois la digestion faite.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f41b4ba5-180b-41b3-9a49-69da3c603b74', 20, 'quiz', 'Qu''est-ce que : Appareil digestif ?', 'Qu''est-ce que : Appareil digestif ?', '[{"id":"opt-0","text":"L''appareil digestif est composé du tube digestif, où circulent les aliments, et des glandes digestives qui lui sont associées.","isCorrect":true},{"id":"opt-1","text":"Les aliments que nous ingérons parcourent un long chemin dans le tube digestif avant d’être assimilés par le corps.","isCorrect":false},{"id":"opt-2","text":"Les glandes digestives sont les organes qui aident à la digestion en sécrétant des enzymes.","isCorrect":false},{"id":"opt-3","text":"Le mot nutriment désigne les substances procurées par l''alimentation une fois la digestion faite.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f41b4ba5-180b-41b3-9a49-69da3c603b74', 21, 'quiz', 'Qu''est-ce que : Glandes digestives ?', 'Qu''est-ce que : Glandes digestives ?', '[{"id":"opt-0","text":"Les glandes digestives sont les organes qui aident à la digestion en sécrétant des enzymes.","isCorrect":true},{"id":"opt-1","text":"Les aliments que nous ingérons parcourent un long chemin dans le tube digestif avant d’être assimilés par le corps.","isCorrect":false},{"id":"opt-2","text":"L''appareil digestif est composé du tube digestif, où circulent les aliments, et des glandes digestives qui lui sont associées.","isCorrect":false},{"id":"opt-3","text":"Le mot nutriment désigne les substances procurées par l''alimentation une fois la digestion faite.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f41b4ba5-180b-41b3-9a49-69da3c603b74', 22, 'quiz', 'Qu''est-ce que : Nutriment ?', 'Qu''est-ce que : Nutriment ?', '[{"id":"opt-0","text":"Le mot nutriment désigne les substances procurées par l''alimentation une fois la digestion faite.","isCorrect":true},{"id":"opt-1","text":"Les aliments que nous ingérons parcourent un long chemin dans le tube digestif avant d’être assimilés par le corps.","isCorrect":false},{"id":"opt-2","text":"L''appareil digestif est composé du tube digestif, où circulent les aliments, et des glandes digestives qui lui sont associées.","isCorrect":false},{"id":"opt-3","text":"Les glandes digestives sont les organes qui aident à la digestion en sécrétant des enzymes.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f41b4ba5-180b-41b3-9a49-69da3c603b74', 23, 'quiz', 'Qu''est-ce que : La digestion mécanique ?', 'Qu''est-ce que : La digestion mécanique ?', '[{"id":"opt-0","text":"La digestion mécanique a pour but de réduire les gros morceaux d''aliments en de plus petits morceaux tout en les mélangeant.","isCorrect":true},{"id":"opt-1","text":"Les aliments que nous ingérons parcourent un long chemin dans le tube digestif avant d’être assimilés par le corps.","isCorrect":false},{"id":"opt-2","text":"L''appareil digestif est composé du tube digestif, où circulent les aliments, et des glandes digestives qui lui sont associées.","isCorrect":false},{"id":"opt-3","text":"Les glandes digestives sont les organes qui aident à la digestion en sécrétant des enzymes.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f41b4ba5-180b-41b3-9a49-69da3c603b74', 24, 'quiz', 'Qu''est-ce que : La digestion chimique ?', 'Qu''est-ce que : La digestion chimique ?', '[{"id":"opt-0","text":"La digestion chimique est un processus qui se fait en même temps que la digestion mécanique, qu’il vient compléter en s''attaquant à la nature même des aliments.","isCorrect":true},{"id":"opt-1","text":"Les aliments que nous ingérons parcourent un long chemin dans le tube digestif avant d’être assimilés par le corps.","isCorrect":false},{"id":"opt-2","text":"L''appareil digestif est composé du tube digestif, où circulent les aliments, et des glandes digestives qui lui sont associées.","isCorrect":false},{"id":"opt-3","text":"Les glandes digestives sont les organes qui aident à la digestion en sécrétant des enzymes.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f41b4ba5-180b-41b3-9a49-69da3c603b74', 25, 'quiz', 'Qu''est-ce que : Glande ?', 'Qu''est-ce que : Glande ?', '[{"id":"opt-0","text":"Une glande est un organe produisant et sécrétant des substances, ici permettant la dégradation des aliments.","isCorrect":true},{"id":"opt-1","text":"Les aliments que nous ingérons parcourent un long chemin dans le tube digestif avant d’être assimilés par le corps.","isCorrect":false},{"id":"opt-2","text":"L''appareil digestif est composé du tube digestif, où circulent les aliments, et des glandes digestives qui lui sont associées.","isCorrect":false},{"id":"opt-3","text":"Les glandes digestives sont les organes qui aident à la digestion en sécrétant des enzymes.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f41b4ba5-180b-41b3-9a49-69da3c603b74', 26, 'quiz', 'Qu''est-ce que : Le passage des nutriments dans le sang ?', 'Qu''est-ce que : Le passage des nutriments dans le sang ?', '[{"id":"opt-0","text":"Pour que les aliments digérés puissent être utilisés par le corps, nous devons absorber les nutriments en les faisant passer dans le sang.","isCorrect":true},{"id":"opt-1","text":"Les aliments que nous ingérons parcourent un long chemin dans le tube digestif avant d’être assimilés par le corps.","isCorrect":false},{"id":"opt-2","text":"L''appareil digestif est composé du tube digestif, où circulent les aliments, et des glandes digestives qui lui sont associées.","isCorrect":false},{"id":"opt-3","text":"Les glandes digestives sont les organes qui aident à la digestion en sécrétant des enzymes.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f41b4ba5-180b-41b3-9a49-69da3c603b74', 27, 'quiz', 'Qu''est-ce que : L’absorption des nutriments se fait majoritairement dans l’intestin grêle. ?', 'Qu''est-ce que : L’absorption des nutriments se fait majoritairement dans l’intestin grêle. ?', '[{"id":"opt-0","text":"L’intestin grêle est un organe dont la morphologie favorise l’absorption.","isCorrect":true},{"id":"opt-1","text":"Les aliments que nous ingérons parcourent un long chemin dans le tube digestif avant d’être assimilés par le corps.","isCorrect":false},{"id":"opt-2","text":"L''appareil digestif est composé du tube digestif, où circulent les aliments, et des glandes digestives qui lui sont associées.","isCorrect":false},{"id":"opt-3","text":"Les glandes digestives sont les organes qui aident à la digestion en sécrétant des enzymes.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f41b4ba5-180b-41b3-9a49-69da3c603b74', 28, 'quiz', 'Qu''est-ce que : Les besoins nutritionnels et la nature des aliments ?', 'Qu''est-ce que : Les besoins nutritionnels et la nature des aliments ?', '[{"id":"opt-0","text":"Pour avoir une alimentation équilibrée, c’est-à-dire qui réponde aux besoins de notre corps, il est nécessaire de comprendre ses besoins.","isCorrect":true},{"id":"opt-1","text":"Les aliments que nous ingérons parcourent un long chemin dans le tube digestif avant d’être assimilés par le corps.","isCorrect":false},{"id":"opt-2","text":"L''appareil digestif est composé du tube digestif, où circulent les aliments, et des glandes digestives qui lui sont associées.","isCorrect":false},{"id":"opt-3","text":"Les glandes digestives sont les organes qui aident à la digestion en sécrétant des enzymes.","isCorrect":false}]', NULL, NULL, 50);

INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'f41b4ba5-180b-41b3-9a49-69da3c603b74', '2026-01-17', 1, 0, 5)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'f41b4ba5-180b-41b3-9a49-69da3c603b74', '2026-01-18', 2, 6, 11)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'f41b4ba5-180b-41b3-9a49-69da3c603b74', '2026-01-19', 3, 12, 17)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'f41b4ba5-180b-41b3-9a49-69da3c603b74', '2026-01-20', 4, 18, 23)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'f41b4ba5-180b-41b3-9a49-69da3c603b74', '2026-01-21', 5, 24, 28)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;

-- Course: Calcul littéral et équation
INSERT INTO public.courses (id, user_id, title, description, category, level, estimated_minutes, icon, total_xp, is_published, duration_days, daily_cards_count)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', '00000000-0000-0000-0000-000000000001', 'Calcul littéral et équation', 'Cours de Mathématiques : Calcul littéral et équation', 'Mathématiques', '3eme', 18, '📚', 1000, true, 10, 6);

INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 0, 'lesson', 'Introduction', 'En quatrième, nous avons appris à développer et factoriser une expression, grâce à la propriété de distributivité. Puis nous nous en sommes notamment servis pour résoudre des équations.

Nous allons dans ce cours continuer ce travail, en l’approfondissant. Nous verrons ainsi une nouvelle propriété, celle de la double distributivité, qui nous permettra de découvrir une identité remarquable.
Puis nous apprendrons à résoudre des équations plus complexes, appelées équations produits, mais qui peuvent se ramener à des équations du premier degré.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 1, 'lesson', 'Distributivité simple', 'La multiplication est distributive par rapport à l’addition (et à la soustraction) : nous distribuons un facteur aux termes d’une somme (ou d’une différence).', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 2, 'lesson', 'Distributivité simple', 'Quels que soient les nombres relatifs 
𝑘
k, 
𝑎
a et 
𝑏
b, on a :

𝑘
(
𝑎
+
𝑏
)
=
𝑘
𝑎
+
𝑘
𝑏


𝑘
(
𝑎
−
𝑏
)
=
𝑘
𝑎
−
𝑘
𝑏
k(a+b)=ka+kb
k(a−b)=ka−kb
	​', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 3, 'lesson', 'Cette propriété permet', 'de développer une expression, c’est-à-dire de transformer un produit en somme ;
de factoriser une expression, c’est-à-dire de transformer une somme en produit.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 4, 'lesson', 'Développer et factoriser', 'Regardons un cas particulier : l’opposé de l’expression littérale 
𝑎
+
𝑏
a+b, où 
𝑎
a et 
𝑏
b sont des nombres relatifs.

L’opposé de 
𝑎
+
𝑏
a+b s’écrit 
−
(
𝑎
+
𝑏
)
−(a+b).
Or, l’opposé d’un nombre est égal au produit du nombre par 
−
1
−1.

−
(
𝑎
+
𝑏
)
−(a+b) revient donc à écrire : 
(
−
1
)
×
(
𝑎
+
𝑏
)
(−1)×(a+b).
Développons cette dernière expression :

(
−
1
)
×
(
𝑎
+
𝑏
)
	
=
(
−
1
)
×
𝑎
+
(
−
1
)
×
𝑏


	
=
−
𝑎
−
𝑏
(−1)×(a+b)
	​

=(−1)×a+(−1)×b
=−a−b
	​', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 5, 'lesson', 'Propriété', 'Soit 
𝑎
+
𝑏
a+b une expression littérale, avec 
𝑎
a et 
𝑏
b des nombres relatifs.
Son opposé vaut :

−
(
𝑎
+
𝑏
)
=
−
𝑎
−
𝑏
−(a+b)=−a−b', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 6, 'lesson', 'Astuce', 'Pour prendre l’opposé d’une expression, on la réécrit en changeant tous les signes.
Si le premier terme est positif et que le signe 
+
+ est omis, on n’oublie pas de mettre un 
−
−.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 7, 'lesson', 'Exemple', 'Illustrons cette propriété par quatre exemples, où 
𝑥
x et 
𝑦
y sont des nombres relatifs :

3
−
(
𝑥
+
2
)
	
=
3
−
𝑥
−
2


	
=
1
−
𝑥
3−(x+2)
	​

=3−x−2
=1−x
	​

3
−
(
𝑥
−
2
)
	
=
3
−
𝑥
+
2


	
=
5
−
𝑥
3−(x−2)
	​

=3−x+2
=5−x
	​

7
𝑥
−
𝑦
+
2
−
(
−
𝑥
+
7
−
𝑦
)
	
=
7
𝑥
−
𝑦
+
2
+
𝑥
−
7
+
𝑦


	
=
8
𝑥
+
0
−
5


	
=
8
𝑥
−
5
7x−y+2−(−x+7−y)
	​

=7x−y+2+x−7+y
=8x+0−5
=8x−5
	​

4
(
𝑥
−
7
)
−
𝑥
+
7
	
=
4
(
𝑥
−
7
)
−
(
𝑥
−
7
)


	
=
3
(
𝑥
−
7
)
4(x−7)−x+7
	​

=4(x−7)−(x−7)
=3(x−7)
	​', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 8, 'lesson', 'Double distributivité', 'Nous savons distribuer un facteur simple sur les termes d’une somme. Mais comment faire quand ce facteur est lui-même une somme ?
Nous utilisons pour cela la double distributivité.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 9, 'lesson', 'Propriété', 'Quels que soient les nombres relatifs 
𝑎
a, 
𝑏
b, 
𝑐
c et 
𝑑
d, on a :

(
𝑎
+
𝑏
)
(
𝑐
+
𝑑
)
=
𝑎
𝑐
+
𝑎
𝑑
+
𝑏
𝑐
+
𝑏
𝑑
(a+b)(c+d)=ac+ad+bc+bd', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 10, 'lesson', 'Cette propriété est appelée double distributivité, car cela revient à', 'distribuer une première fois : 
𝑎
a sur 
𝑐
c et 
𝑑
d ;
puis à distribuer une deuxième fois : 
𝑏
b sur 
𝑐
c et 
𝑑
d.
On distribue 
2
2 facteurs sur 
2
2 termes : on obtient une somme de 
2
×
2
=
4
2×2=4 termes.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 11, 'lesson', 'Démonstration', 'Nous pouvons prouver cette propriété en considérant quatre nombres relatifs 
𝑎
a, 
𝑏
b, 
𝑐
c et 
𝑑
d, et le produit :

(
𝑎
+
𝑏
)
(
𝑐
+
𝑑
)
(a+b)(c+d)', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 12, 'lesson', 'Nous allons nous servir pour cela de la propriété de distributivité simple.', '(
𝑎
+
𝑏
)
(
𝑐
+
𝑑
)
	
=
(
𝑎
+
𝑏
)
𝑐
+
(
𝑎
+
𝑏
)
𝑑
 [en distribuant 
(
𝑎
+
𝑏
)
 sur 
𝑐
 et 
𝑑
]


	
=
𝑐
(
𝑎
+
𝑏
)
+
𝑑
(
𝑎
+
𝑏
)
 [car, dans un produit, on peut changer l’ordre des facteurs]


	
=
𝑐
𝑎
+
𝑐
𝑏
+
𝑑
𝑎
+
𝑑
𝑏
 [en distribuant 
𝑐
 puis 
𝑑
 sur 
𝑎
 et 
𝑏
]


	
=
𝑎
𝑐
+
𝑏
𝑐
+
𝑎
𝑑
+
𝑏
𝑑


	
=
𝑎
𝑐
+
𝑎
𝑑
+
𝑏
𝑐
+
𝑏
𝑑
 [car, dans une somme, on peut changer l’ordre des termes]
(a+b)(c+d)
	​

=(a+b)c+(a+b)d [en distribuant (a+b) sur c et d]
=c(a+b)+d(a+b) [car, dans un produit, on peut changer l’ordre des facteurs]
=ca+cb+da+db [en distribuant c puis d sur a et b]
=ac+bc+ad+bd
=ac+ad+bc+bd [car, dans une somme, on peut changer l’ordre des termes]
	​', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 13, 'lesson', 'Nous retrouvons bien l’égalité de la double distributivité', '(
𝑎
+
𝑏
)
(
𝑐
+
𝑑
)
=
𝑎
𝑐
+
𝑎
𝑑
+
𝑏
𝑐
+
𝑏
𝑑
(a+b)(c+d)=ac+ad+bc+bd', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 14, 'lesson', 'Exemple', 'Développons l’expression : 
𝐴
=
(
7
𝑥
+
9
)
(
2
𝑥
+
3
)
A=(7x+9)(2x+3).

𝐴
	
=
(
7
𝑥
+
9
)
(
2
𝑥
+
3
)


	
=
7
𝑥
×
2
𝑥
+
7
𝑥
×
3
+
9
×
2
𝑥
+
9
×
3


	
=
7
×
2
×
𝑥
×
𝑥
+
7
×
3
×
𝑥
+
18
𝑥
+
27


	
=
14
𝑥
2
+
21
𝑥
+
18
𝑥
+
27


	
=
14
𝑥
2
+
39
𝑥
+
27
A
	​

=(7x+9)(2x+3)
=7x×2x+7x×3+9×2x+9×3
=7×2×x×x+7×3×x+18x+27
=14x
2
+21x+18x+27
=14x
2
+39x+27
	​


Développons l’expression : 
𝐵
=
(
𝑥
+
6
)
(
𝑥
−
3
)
B=(x+6)(x−3).

𝐵
	
=
(
𝑥
+
6
)
(
𝑥
+
(
−
3
)
)


	
=
𝑥
×
𝑥
+
𝑥
×
(
−
3
)
+
6
×
𝑥
+
6
×
(
−
3
)


	
=
𝑥
2
+
(
−
3
𝑥
)
+
6
𝑥
+
(
−
18
)


	
=
𝑥
2
+
3
𝑥
−
18
B
	​

=(x+6)(x+(−3))
=x×x+x×(−3)+6×x+6×(−3)
=x
2
+(−3x)+6x+(−18)
=x
2
+3x−18
	​


Étudions maintenant un cas particulier : le produit de la somme de deux nombres par leur différence.
Soit 
𝑎
a et 
𝑏
b deux nombres relatifs. Développons le produit :

(
𝑎
+
𝑏
)
(
𝑎
−
𝑏
)
	
=
𝑎
×
𝑎
−
𝑎
×
𝑏
+
𝑏
×
𝑎
−
𝑏
×
𝑏


	
=
𝑎
2
−
𝑎
𝑏
+
𝑏
𝑎
−
𝑏
2


	
=
𝑎
2
−
𝑎
𝑏
+
𝑎
𝑏
−
𝑏
2


	
=
𝑎
2
+
0
−
𝑏
2
(a+b)(a−b)
	​

=a×a−a×b+b×a−b×b
=a
2
−ab+ba−b
2
=a
2
−ab+ab−b
2
=a
2
+0−b
2
	​', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 15, 'lesson', 'Nous obtenons finalement', '(
𝑎
+
𝑏
)
(
𝑎
−
𝑏
)
=
𝑎
2
−
𝑏
2
(a+b)(a−b)=a
2
−b
2', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 16, 'lesson', 'Propriété', 'Quels que soient les nombres relatifs 
𝑎
a et 
𝑏
b, on a :

(
𝑎
+
𝑏
)
(
𝑎
−
𝑏
)
=
𝑎
2
−
𝑏
2
(a+b)(a−b)=a
2
−b
2

Remarque :
On a aussi : 
(
𝑎
−
𝑏
)
(
𝑎
+
𝑏
)
=
𝑎
2
−
𝑏
2
(a−b)(a+b)=a
2
−b
2
.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 17, 'lesson', 'Cette identité permet', 'de développer très rapidement un produit de la forme 
(
𝑎
+
𝑏
)
(
𝑎
−
𝑏
)
(a+b)(a−b) ou 
(
𝑎
−
𝑏
)
(
𝑎
+
𝑏
)
(a−b)(a+b) ;
de factoriser très rapidement une différence de la forme 
𝑎
2
−
𝑏
2
a
2
−b
2
.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 18, 'lesson', 'Exemple', '𝑥
x et 
𝑦
y désignent des nombres relatifs.

Développer l’expression : 
𝐴
=
(
𝑥
+
7
)
(
𝑥
−
7
)
A=(x+7)(x−7).

𝐴
	
=
(
𝑥
+
7
)
(
𝑥
−
7
)


	
=
𝑥
2
−
7
2


	
=
𝑥
2
−
49
A
	​

=(x+7)(x−7)
=x
2
−7
2
=x
2
−49
	​


Développer l’expression : 
𝐵
=
(
9
𝑦
−
12
)
(
9
𝑦
+
12
)
B=(9y−12)(9y+12).

𝐵
	
=
(
9
𝑦
−
12
)
(
9
𝑦
+
12
)


	
=
(
9
𝑦
)
2
−
12
2


	
=
81
𝑦
2
−
144
B
	​

=(9y−12)(9y+12)
=(9y)
2
−12
2
=81y
2
−144
	​', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 19, 'lesson', 'Attention', 'Dans le développement de 
𝐵
B, il faut bien veiller à faire la différence entre 
9
𝑦
2
9y
2
 et 
(
9
𝑦
)
2
(9y)
2
 :

dans la première, seul 
𝑦
y est élevé au carré :

9
𝑦
2
=
9
×
𝑦
×
𝑦
9y
2
=9×y×y

dans la seconde, c’est 
9
𝑦
9y qui est élevé au carré, soit :

(
9
𝑦
)
2
	
=
9
𝑦
×
9
𝑦


	
=
9
×
9
×
𝑦
×
𝑦


	
=
81
𝑦
2
≠
9
𝑦
2
(9y)
2
	​

=9y×9y
=9×9×y×y
=81y
2

	​

=9y
2
	​


Et montrons maintenant comment factoriser une expression, toujours grâce à cette identité remarquable.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 20, 'lesson', 'Astuce', 'Quand on vous demande de factoriser une différence entre deux termes, la plupart du temps, il faudra utiliser l’identité remarquable :

𝑎
2
−
𝑏
2
=
(
𝑎
+
𝑏
)
(
𝑎
−
𝑏
)
a
2
−b
2
=(a+b)(a−b)

Il est donc important de savoir reconnaître les carrés parfaits et de bien connaître la définition de la racine carrée d’un nombre positif, que vous pouvez retrouver dans le cours de 4e sur les racines carrées d’un nombre positif. Vous pourrez ainsi :

d’abord identifier rapidement s’il y a des carrés parfaits dans l’expression ;
si ce n’est pas le cas, faire appel à la racine carrée.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 21, 'lesson', 'Exemple', '𝑥
x, 
𝑦
y et 
𝑧
z désignent des nombres relatifs.

Factoriser l’expression : 
𝐶
=
𝑥
2
−
16
C=x
2
−16

𝐶
	
=
𝑥
2
−
16


	
=
𝑥
2
−
4
2


	
=
(
𝑥
+
4
)
(
𝑥
−
4
)
C
	​

=x
2
−16
=x
2
−4
2
=(x+4)(x−4)
	​


Factoriser l’expression : 
𝐷
=
10
−
𝑦
2
D=10−y
2
.

Par définition de la racine carrée d’un nombre positif, nous avons : 
10
2
=
10
10
	​

2
=10.
Nous pouvons donc écrire :

𝐷
	
=
10
−
𝑦
2


	
=
10
2
−
𝑦
2


	
=
(
10
+
𝑦
)
(
10
−
𝑦
)
D
	​

=10−y
2
=
10
	​

2
−y
2
=(
10
	​

+y)(
10
	​

−y)
	​


Factoriser l’expression : 
𝐸
=
121
𝑧
2
−
(
𝑧
+
3
)
2
E=121z
2
−(z+3)
2
.

𝐸
	
=
121
𝑧
2
−
(
𝑧
+
3
)
2


	
=
(
11
𝑧
)
2
−
(
𝑧
+
3
)
2


	
=
(
11
𝑧
+
(
𝑧
+
3
)
)
(
11
𝑧
−
(
𝑧
+
3
)
)


	
=
(
11
𝑧
+
𝑧
+
3
)
(
11
𝑧
−
𝑧
−
3
)
 [car 
−
(
𝑧
+
3
)
=
−
𝑧
−
3
]


	
=
(
12
𝑧
+
3
)
(
10
𝑧
−
3
)
E
	​

=121z
2
−(z+3)
2
=(11z)
2
−(z+3)
2
=(11z+(z+3))(11z−(z+3))
=(11z+z+3)(11z−z−3) [car −(z+3)=−z−3]
=(12z+3)(10z−3)
	​', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 22, 'lesson', 'Cette identité remarquable peut permettre d’effectuer mentalement des calculs. Par exemple', '97
×
103
	
=
(
100
−
3
)
(
100
+
3
)


	
=
10
0
2
−
3
2


	
=
10
000
−
9


	
=
9
991
97×103
	​

=(100−3)(100+3)
=100
2
−3
2
=10000−9
=9991
	​


Terminons cette partie en précisant qu’il existe deux autres identités remarquables que vous rencontrerez souvent.
Quels que soient les nombres relatifs 
𝑎
a et 
𝑏
b, on a :

(
𝑎
+
𝑏
)
2
=
𝑎
2
+
2
𝑎
𝑏
+
𝑏
2
(a+b)
2
=a
2
+2ab+b
2
 ;
(
𝑎
−
𝑏
)
2
=
𝑎
2
−
2
𝑎
𝑏
+
𝑏
2
(a−b)
2
=a
2
−2ab+b
2
.
Vous apprendrez en seconde à les reconnaître et à vous en servir, autant pour développer que pour factoriser.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 23, 'lesson', 'Résoudre des équations', 'Factoriser une expression littérale peut servir à résoudre une équation, comme nous allons le voir dans cette partie.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 24, 'lesson', 'Équation, solution', 'Une équation est une égalité dans laquelle figure au moins un nombre inconnu, alors désigné par une lettre.
Une solution d’une équation est une valeur de l’inconnue qui rend l’égalité de l’équation vraie.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 25, 'lesson', 'Une égalité reste vraie si', 'on ajoute ou soustrait un même nombre à ses deux membres ;
on multiplie ou divise ses deux membres par un même nombre non nul.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 26, 'lesson', 'À retenir', 'Ainsi, pour résoudre une équation du premier degré à une inconnue, on se servira de ces deux propriétés pour isoler l’inconnue, en transformant successivement l’égalité de l’équation initiale.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 27, 'lesson', 'Résoudre l’équation', '3
(
2
−
4
,
5
𝑥
)
=
−
(
1
,
5
𝑥
+
14
)
3(2−4,5x)=−(1,5x+14)

Nous commençons par développer les deux membres ; nous pourrons ainsi rassembler d’un côté les termes avec 
𝑥
x et, de l’autre, les nombres connus :

3
×
2
−
3
×
4
,
5
𝑥
	
=
−
1
,
5
𝑥
−
14


6
−
13
,
5
𝑥
	
=
−
1
,
5
𝑥
−
14


−
13
,
5
𝑥
+
1
,
5
𝑥
	
=
−
14
−
6


−
12
𝑥
	
=
−
20


𝑥
	
=
−
20
−
12


𝑥
	
=
−
4
×
5
−
4
×
3


𝑥
	
=
5
3
3×2−3×4,5x
6−13,5x
−13,5x+1,5x
−12x
x
x
x
	​

=−1,5x−14
=−1,5x−14
=−14−6
=−20
=
−12
−20
	​

=
−4×3
−4×5
	​

=
3
5
	​

	​


L’équation admet comme unique solution 
5
3
3
5
	​

.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 28, 'lesson', 'Équations produits', 'Nous allons ici apprendre à résoudre des équations plus complexes, mais pour lesquelles on peut se ramener à la résolution d’équations du premier degré, grâce à la propriété suivante.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 29, 'lesson', 'On considère le produit de deux facteurs.', 'Si au moins l’un des facteurs est nul, alors leur produit est nul.
Si leur produit est nul, alors au moins l’un des facteurs est nul.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 30, 'lesson', 'En effet', 'si vous multipliez n’importe quel nombre par 
0
0, alors le résultat sera 
0
0.
si le résultat d’un produit est nul, il faut qu’au moins l’un des deux facteurs soit nul (si vous multipliez deux nombres non nuls, votre résultat ne sera jamais nul !).

Cela nous permettra de résoudre des équations appelées équations produits (ou équations produits nuls), comme dans l’exemple suivant.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 31, 'lesson', 'Résoudre l’équation', '(
2
𝑥
−
7
)
(
3
𝑥
+
4
)
=
0
(2x−7)(3x+4)=0

D’après la propriété sur le produit nul que nous venons de voir, on peut traduire cette équation par deux équations du premier degré :

2
𝑥
−
7
=
0
ou :
3
𝑥
+
4
=
0
2x−7=0ou :3x+4=0', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 32, 'lesson', 'Nous résolvons donc ces deux équations comme nous en avons désormais l’habitude.', 'Pour 
2
𝑥
−
7
=
0
2x−7=0 :

2
𝑥
−
7
	
=
0


2
𝑥
	
=
7


𝑥
	
=
7
2
=
3
,
5
2x−7
2x
x
	​

=0
=7
=
2
7
	​

=3,5
	​


Pour 
3
𝑥
+
4
=
0
3x+4=0 :

3
𝑥
+
4
	
=
0


3
𝑥
	
=
−
4


𝑥
	
=
−
4
3
3x+4
3x
x
	​

=0
=−4
=−
3
4
	​

	​


L’équation 
(
2
𝑥
−
7
)
(
3
𝑥
+
4
)
=
0
(2x−7)(3x+4)=0 admet donc deux solutions :

−
4
3
−
3
4
	​

 et 
3
,
5
3,5.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 33, 'lesson', 'À retenir', 'Il sera parfois nécessaire de factoriser, afin de faire apparaître une équation produit nul et ainsi pouvoir se ramener à la résolution d’équations du premier degré.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 34, 'lesson', 'On cherche à résoudre l’équation', '4
𝑥
2
=
−
5
𝑥
4x
2
=−5x

On commence par rassembler les termes avec 
𝑥
x :

4
𝑥
2
+
5
𝑥
=
0
4x
2
+5x=0

On peut factoriser par 
𝑥
x :

𝑥
(
4
𝑥
+
5
)
=
0
x(4x+5)=0

Ainsi, résoudre 
4
𝑥
2
=
−
5
𝑥
4x
2
=−5x revient à résoudre 
𝑥
(
4
𝑥
+
5
)
=
0
x(4x+5)=0.
Et 
𝑥
(
4
𝑥
+
5
)
=
0
x(4x+5)=0 lorsque :

𝑥
=
0
x=0 ;
ou 
4
𝑥
+
5
=
0
4x+5=0.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 35, 'lesson', 'On résout donc cette dernière équation du premier degré', '4
𝑥
+
5
	
=
0


4
𝑥
	
=
−
5


𝑥
	
=
−
5
4
=
−
1
,
25
4x+5
4x
x
	​

=0
=−5
=−
4
5
	​

=−1,25
	​


L’équation 
4
𝑥
2
=
−
5
𝑥
4x
2
=−5x admet deux solutions :

0
0 et 
−
1
,
25
−1,25.

Équations de la forme 
𝑥
2
=
𝑎
x
2
=a

Pour résoudre une équation de la forme 
𝑥
2
=
𝑎
x
2
=a, avec 
𝑎
a un nombre relatif, on applique la propriété suivante.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 36, 'lesson', 'Propriété', 'Soit 
𝑎
a un nombre relatif, et l’équation 
𝑥
2
=
𝑎
x
2
=a.

Si 
𝑎
<
0
a<0, l’équation n’admet aucune solution.
Si 
𝑎
=
0
a=0, l’équation admet comme solution 
0
0.
Si 
𝑎
>
0
a>0, l’équation admet deux solutions : 
𝑎
a
	​

 et 
−
𝑎
−
a
	​

.

Nous proposons une démonstration de ces propriétés, qui fera notamment appel à la propriété du produit nul.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 37, 'lesson', 'Démonstration', 'Si 
𝑎
<
0
a<0, l’équation n’admet aucune solution.

𝑥
2
x
2
 est le produit de 
𝑥
x par lui-même. C’est donc le produit de deux nombres de même signe. Nous savons alors que ce produit sera positif ou nul.
Il n’existe donc pas de valeur pour 
𝑥
x qui rende l’égalité vraie si 
𝑎
a est strictement négatif.

Donc, si 
𝑎
<
0
a<0, l’équation n’admet aucune solution.
Si 
𝑎
=
0
a=0, l’équation admet comme solution 
0
0.

L’équation devient donc : 
𝑥
2
=
0
x
2
=0, soit : 
𝑥
×
𝑥
=
0
x×x=0.
Par la propriété du produit nul, cela revient à dire qu’au moins l’un des facteurs est nul, soit 
𝑥
=
0
x=0 (puisque les deux facteurs sont identiques ici).

Donc, si 
𝑎
=
0
a=0, l’équation admet 
0
0 comme solution.
Si 
𝑎
>
0
a>0, l’équation admet deux solutions : 
𝑎
a
	​

 et 
−
𝑎
−
a
	​

.

On considère l’équation 
𝑥
2
=
𝑎
x
2
=a, avec 
𝑎
a strictement positif. On peut la transformer en :

𝑥
2
−
𝑎
=
0
x
2
−a=0

On sait que, pour tout 
𝑎
a positif : 
𝑎
2
=
𝑎
a
	​

2
=a.
On peut donc transformer encore l’égalité :

𝑥
2
−
𝑎
2
=
0
x
2
−
a
	​

2
=0

Et on reconnaît ici l’identité remarquable que nous avons vue, qui nous permet de factoriser l’expression :

(
𝑥
+
𝑎
)
(
𝑥
−
𝑎
)
=
0
(x+
a
	​

)(x−
a
	​

)=0

On obtient ainsi une équation produit nul, que l’on résout en la ramenant à deux équations simples du premier degré :

𝑥
+
𝑎
=
0
et :
𝑥
−
𝑎
=
0
x+
a
	​

=0et :x−
a
	​

=0

Pour 
𝑥
+
𝑎
=
0
x+
a
	​

=0 :

𝑥
+
𝑎
	
=
0


𝑥
	
=
−
𝑎
x+
a
	​

x
	​

=0
=−
a
	​

	​


Pour 
𝑥
−
𝑎
=
0
x−
a
	​

=0 :

𝑥
−
𝑎
	
=
0


𝑥
	
=
𝑎
x−
a
	​

x
	​

=0
=
a
	​

	​


L’équation 
𝑥
2
=
𝑎
x
2
=a admet deux solutions : 
−
𝑎
−
a
	​

 et 
𝑎
a
	​

.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 38, 'lesson', 'Méthode', 'Nous l’avons vu en quatrième, modéliser une situation par une équation permet de résoudre des problèmes divers. Nous commençons donc par rappeler ici la méthode, que nous appliquerons ensuite pour la résolution de deux petits problèmes, géométrique et numérique.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 39, 'lesson', 'Méthode : Comment modéliser une situation', 'Avant de se lancer, on s’assurera d’avoir bien compris l’énoncé, ce que l’on cherche. On pourra s’aider d’un schéma si nécessaire.

Choisir l’inconnue (bien comprendre l’énoncé permet de l’identifier) et la nommer.
S’il y a plusieurs nombres à chercher, il convient d’exprimer tous les nombres en fonction de l’inconnue.
Traduire l’énoncé par une équation.
Résoudre l’équation obtenue, en utilisant les propriétés sur les égalités et les opérations.
Vérifier que la solution trouvée est cohérente et qu’elle répond bien au problème posé.
Conclure en répondant à la question posée.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 40, 'lesson', 'Énoncé', 'La facture d’eau d’un jardinier s’élevait à 
545
 €
545 € par an. Mais il vient d’installer un récupérateur d’eau, qui lui permettra d’économiser 
55
 €
55 € par an.
Le récupérateur a coûté 
199
 €
199 € à l’achat et va nécessiter chaque année 
13
 €
13 € pour l’entretien (nettoyage, tuyau…).

Au bout de combien d’années l’installation sera-t-elle rentable, c’est-à-dire qu’elle lui permettra d’économiser de l’argent ?
Corrigé
Choix de l’inconnue

Ici, on s’intéresse au nombre d’années à partir duquel l’installation sera rentable. On décide donc de noter 
𝑥
x le nombre d’années.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 41, 'lesson', 'Traduisons les différentes informations données dans l’énoncé.', 'D’une part, sans le récupérateur d’eau de pluie, la facture d’eau du jardinier se serait élevée à 
545
 €
545 € par an.

Ainsi, au bout de 
𝑥
x années, sans ce récupérateur, il aurait payé : 
(
545
𝑥
)
 €
(545x) €.

D’autre part, avec le récupérateur, il économisera 
55
 €
55 € :

545
−
55
=
490
545−55=490

Sa facture d’eau annuelle s’élèvera donc à 
490
 €
490 €.
Mais l’entretien lui coûtera 
13
 €
13 € par an, il faut donc l’ajouter à la facture d’eau annuelle :

490
+
13
=
503
490+13=503

Soit une dépense annuelle, eau et entretien compris, de : 
503
 €
503 €.
Il ne faut pas oublier l’achat initial (et ponctuel) du récupérateur, qui vaut 
199
 €
199 €.

Ainsi, au bout de 
𝑥
x années, avec le récupérateur, il aura payé : 
(
199
+
503
𝑥
)
 €
(199+503x) €.

Testons les deux formules littérales avec 
𝑥
=
1
x=1, ce qui nous donnera le montant payé après une année.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 42, 'lesson', 'Sans le récupérateur', '545
×
1
=
545
545×1=545', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 43, 'lesson', 'Avec le récupérateur', '199
+
503
×
1
=
702
199+503×1=702

Ainsi, sans récupérateur, il aurait payé 
545
 €
545 € au bout d’une année, tandis que, avec le récupérateur, il paiera 
702
 €
702 €.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 44, 'lesson', 'L’installation n’est visiblement pas rentable après une année.', 'Nous cherchons le moment à partir duquel ce sera rentable, c’est-à-dire le moment où les dépenses seront égales, que ce soit avec ou sans le récupérateur.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 45, 'lesson', 'Nous obtenons donc l’équation suivante, qui modélise le problème', '545
𝑥
=
199
+
503
𝑥
545x=199+503x', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 46, 'lesson', 'Nous résolvons l’équation comme nous en avons l’habitude', '545
𝑥
	
=
199
+
503
𝑥


545
𝑥
−
503
𝑥
	
=
199


42
𝑥
	
=
199


𝑥
	
=
199
42
545x
545x−503x
42x
x
	​

=199+503x
=199
=199
=
42
199
	​

	​


L’équation admet comme unique solution 
199
42
42
199
	​

.
Vérification

On a : 
199
42
≈
4
,
74
42
199
	​

≈4,74.
Donc, d’après notre résultat, l’installation devient rentable entre les années 
4
4 et 
5
5, soit durant la cinquième année.
Nous pouvons vérifier que :

au bout de 
4
4 ans, le coût sans le récupérateur est toujours inférieur à celui avec récupérateur :

sans : 
	
545
×
4
=
2
180


avec : 
	
199
+
503
×
4
=
2
211


on a bien : 
	
2
180
<
2
211
sans : 
avec : 
on a bien : 
	​

545×4=2180
199+503×4=2211
2180<2211
	​


au bout de 
5
5 ans, le coût sans le récupérateur est cette fois supérieur à celui avec récupérateur :

sans : 
	
545
×
5
=
2
725


avec : 
	
199
+
503
×
4
=
2
714


on a bien : 
	
2
725
>
2
714
sans : 
avec : 
on a bien : 
	​

545×5=2725
199+503×4=2714
2725>2714
	​


Notre résultat est bien cohérent.
Conclusion', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 47, 'lesson', 'On demande un nombre d’années, on donnera donc plutôt un nombre entier en réponse.', 'L’installation sera rentable au bout de 
5
5 ans.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 48, 'lesson', 'Avec le récupérateur', 'il l’achète au prix de 
199
 €
199 € ;
et il dépense 
13
 €
13 € par an pour l’entretien ;
en parallèle, il économise 
55
 €
55 € par an.

Résoudre le problème revient à répondre à la question : quand les économies permises par le récupérateur compenseront les dépenses supplémentaires engendrées ?', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 49, 'lesson', 'Nous obtenons ainsi l’équation', '199
+
13
𝑥
=
55
𝑥
199+13x=55x

Les équations sont au cœur des mathématiques, qui elles-mêmes sont à la base des sciences, comme la physique ou l’informatique. Nous apprenons chaque année à résoudre des équations sans cesse plus complexes ; ce qui nous permet de trouver la solution à des problèmes de plus en plus riches.
Nous continuerons au lycée à approfondir toutes ces notions et à en découvrir de nouvelles. In fine, nous serons capables de mettre le monde en équation !', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 50, 'quiz', 'Qu''est-ce que : Distributivité simple ?', 'Qu''est-ce que : Distributivité simple ?', '[{"id":"opt-0","text":"La multiplication est distributive par rapport à l’addition (et à la soustraction) : nous distribuons un facteur aux termes d’une somme (ou d’une différence).","isCorrect":true},{"id":"opt-1","text":"Quels que soient les nombres relatifs  𝑘 k,  𝑎 a et  𝑏 b, on a :  𝑘 ( 𝑎 + 𝑏 ) = 𝑘 𝑎 + 𝑘 𝑏   𝑘 ( 𝑎 − 𝑏 ) = 𝑘 𝑎 − 𝑘 𝑏 k(a+b)=ka+kb k(a−b)=ka−kb \t​","isCorrect":false},{"id":"opt-2","text":"de développer une expression, c’est-à-dire de transformer un produit en somme ; de factoriser une expression, c’est-à-dire de transformer une somme en produit.","isCorrect":false},{"id":"opt-3","text":"Regardons un cas particulier : l’opposé de l’expression littérale  𝑎 + 𝑏 a+b, où  𝑎 a et  𝑏 b sont des nombres relatifs.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 51, 'quiz', 'Qu''est-ce que : Distributivité simple ?', 'Qu''est-ce que : Distributivité simple ?', '[{"id":"opt-0","text":"Quels que soient les nombres relatifs  𝑘 k,  𝑎 a et  𝑏 b, on a :  𝑘 ( 𝑎 + 𝑏 ) = 𝑘 𝑎 + 𝑘 𝑏   𝑘 ( 𝑎 − 𝑏 ) = 𝑘 𝑎 − 𝑘 𝑏 k(a+b)=ka+kb k(a−b)=ka−kb \t​","isCorrect":true},{"id":"opt-1","text":"La multiplication est distributive par rapport à l’addition (et à la soustraction) : nous distribuons un facteur aux termes d’une somme (ou d’une différence).","isCorrect":false},{"id":"opt-2","text":"de développer une expression, c’est-à-dire de transformer un produit en somme ; de factoriser une expression, c’est-à-dire de transformer une somme en produit.","isCorrect":false},{"id":"opt-3","text":"Regardons un cas particulier : l’opposé de l’expression littérale  𝑎 + 𝑏 a+b, où  𝑎 a et  𝑏 b sont des nombres relatifs.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 52, 'quiz', 'Qu''est-ce que : Cette propriété permet ?', 'Qu''est-ce que : Cette propriété permet ?', '[{"id":"opt-0","text":"de développer une expression, c’est-à-dire de transformer un produit en somme ; de factoriser une expression, c’est-à-dire de transformer une somme en produit.","isCorrect":true},{"id":"opt-1","text":"La multiplication est distributive par rapport à l’addition (et à la soustraction) : nous distribuons un facteur aux termes d’une somme (ou d’une différence).","isCorrect":false},{"id":"opt-2","text":"Quels que soient les nombres relatifs  𝑘 k,  𝑎 a et  𝑏 b, on a :  𝑘 ( 𝑎 + 𝑏 ) = 𝑘 𝑎 + 𝑘 𝑏   𝑘 ( 𝑎 − 𝑏 ) = 𝑘 𝑎 − 𝑘 𝑏 k(a+b)=ka+kb k(a−b)=ka−kb \t​","isCorrect":false},{"id":"opt-3","text":"Regardons un cas particulier : l’opposé de l’expression littérale  𝑎 + 𝑏 a+b, où  𝑎 a et  𝑏 b sont des nombres relatifs.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 53, 'quiz', 'Qu''est-ce que : Développer et factoriser ?', 'Qu''est-ce que : Développer et factoriser ?', '[{"id":"opt-0","text":"Regardons un cas particulier : l’opposé de l’expression littérale  𝑎 + 𝑏 a+b, où  𝑎 a et  𝑏 b sont des nombres relatifs.","isCorrect":true},{"id":"opt-1","text":"La multiplication est distributive par rapport à l’addition (et à la soustraction) : nous distribuons un facteur aux termes d’une somme (ou d’une différence).","isCorrect":false},{"id":"opt-2","text":"Quels que soient les nombres relatifs  𝑘 k,  𝑎 a et  𝑏 b, on a :  𝑘 ( 𝑎 + 𝑏 ) = 𝑘 𝑎 + 𝑘 𝑏   𝑘 ( 𝑎 − 𝑏 ) = 𝑘 𝑎 − 𝑘 𝑏 k(a+b)=ka+kb k(a−b)=ka−kb \t​","isCorrect":false},{"id":"opt-3","text":"de développer une expression, c’est-à-dire de transformer un produit en somme ; de factoriser une expression, c’est-à-dire de transformer une somme en produit.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 54, 'quiz', 'Qu''est-ce que : Propriété ?', 'Qu''est-ce que : Propriété ?', '[{"id":"opt-0","text":"Soit  𝑎 + 𝑏 a+b une expression littérale, avec  𝑎 a et  𝑏 b des nombres relatifs. Son opposé vaut :  − ( 𝑎 + 𝑏 ) = − 𝑎 − 𝑏 −(a+b)=−a−b","isCorrect":true},{"id":"opt-1","text":"La multiplication est distributive par rapport à l’addition (et à la soustraction) : nous distribuons un facteur aux termes d’une somme (ou d’une différence).","isCorrect":false},{"id":"opt-2","text":"Quels que soient les nombres relatifs  𝑘 k,  𝑎 a et  𝑏 b, on a :  𝑘 ( 𝑎 + 𝑏 ) = 𝑘 𝑎 + 𝑘 𝑏   𝑘 ( 𝑎 − 𝑏 ) = 𝑘 𝑎 − 𝑘 𝑏 k(a+b)=ka+kb k(a−b)=ka−kb \t​","isCorrect":false},{"id":"opt-3","text":"de développer une expression, c’est-à-dire de transformer un produit en somme ; de factoriser une expression, c’est-à-dire de transformer une somme en produit.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 55, 'quiz', 'Qu''est-ce que : Double distributivité ?', 'Qu''est-ce que : Double distributivité ?', '[{"id":"opt-0","text":"Nous savons distribuer un facteur simple sur les termes d’une somme. Mais comment faire quand ce facteur est lui-même une somme ? Nous utilisons pour cela la double distributivité.","isCorrect":true},{"id":"opt-1","text":"La multiplication est distributive par rapport à l’addition (et à la soustraction) : nous distribuons un facteur aux termes d’une somme (ou d’une différence).","isCorrect":false},{"id":"opt-2","text":"Quels que soient les nombres relatifs  𝑘 k,  𝑎 a et  𝑏 b, on a :  𝑘 ( 𝑎 + 𝑏 ) = 𝑘 𝑎 + 𝑘 𝑏   𝑘 ( 𝑎 − 𝑏 ) = 𝑘 𝑎 − 𝑘 𝑏 k(a+b)=ka+kb k(a−b)=ka−kb \t​","isCorrect":false},{"id":"opt-3","text":"de développer une expression, c’est-à-dire de transformer un produit en somme ; de factoriser une expression, c’est-à-dire de transformer une somme en produit.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 56, 'quiz', 'Qu''est-ce que : Propriété ?', 'Qu''est-ce que : Propriété ?', '[{"id":"opt-0","text":"Quels que soient les nombres relatifs  𝑎 a,  𝑏 b,  𝑐 c et  𝑑 d, on a :  ( 𝑎 + 𝑏 ) ( 𝑐 + 𝑑 ) = 𝑎 𝑐 + 𝑎 𝑑 + 𝑏 𝑐 + 𝑏 𝑑 (a+b)(c+d)=ac+ad+bc+bd","isCorrect":true},{"id":"opt-1","text":"La multiplication est distributive par rapport à l’addition (et à la soustraction) : nous distribuons un facteur aux termes d’une somme (ou d’une différence).","isCorrect":false},{"id":"opt-2","text":"Quels que soient les nombres relatifs  𝑘 k,  𝑎 a et  𝑏 b, on a :  𝑘 ( 𝑎 + 𝑏 ) = 𝑘 𝑎 + 𝑘 𝑏   𝑘 ( 𝑎 − 𝑏 ) = 𝑘 𝑎 − 𝑘 𝑏 k(a+b)=ka+kb k(a−b)=ka−kb \t​","isCorrect":false},{"id":"opt-3","text":"de développer une expression, c’est-à-dire de transformer un produit en somme ; de factoriser une expression, c’est-à-dire de transformer une somme en produit.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 57, 'quiz', 'Qu''est-ce que : Démonstration ?', 'Qu''est-ce que : Démonstration ?', '[{"id":"opt-0","text":"Nous pouvons prouver cette propriété en considérant quatre nombres relatifs  𝑎 a,  𝑏 b,  𝑐 c et  𝑑 d, et le produit :  ( 𝑎 + 𝑏 ) ( 𝑐 + 𝑑 ) (a+b)(c+d)","isCorrect":true},{"id":"opt-1","text":"La multiplication est distributive par rapport à l’addition (et à la soustraction) : nous distribuons un facteur aux termes d’une somme (ou d’une différence).","isCorrect":false},{"id":"opt-2","text":"Quels que soient les nombres relatifs  𝑘 k,  𝑎 a et  𝑏 b, on a :  𝑘 ( 𝑎 + 𝑏 ) = 𝑘 𝑎 + 𝑘 𝑏   𝑘 ( 𝑎 − 𝑏 ) = 𝑘 𝑎 − 𝑘 𝑏 k(a+b)=ka+kb k(a−b)=ka−kb \t​","isCorrect":false},{"id":"opt-3","text":"de développer une expression, c’est-à-dire de transformer un produit en somme ; de factoriser une expression, c’est-à-dire de transformer une somme en produit.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 58, 'quiz', 'Qu''est-ce que : Nous retrouvons bien l’égalité de la double distributivité ?', 'Qu''est-ce que : Nous retrouvons bien l’égalité de la double distributivité ?', '[{"id":"opt-0","text":"( 𝑎 + 𝑏 ) ( 𝑐 + 𝑑 ) = 𝑎 𝑐 + 𝑎 𝑑 + 𝑏 𝑐 + 𝑏 𝑑 (a+b)(c+d)=ac+ad+bc+bd","isCorrect":true},{"id":"opt-1","text":"La multiplication est distributive par rapport à l’addition (et à la soustraction) : nous distribuons un facteur aux termes d’une somme (ou d’une différence).","isCorrect":false},{"id":"opt-2","text":"Quels que soient les nombres relatifs  𝑘 k,  𝑎 a et  𝑏 b, on a :  𝑘 ( 𝑎 + 𝑏 ) = 𝑘 𝑎 + 𝑘 𝑏   𝑘 ( 𝑎 − 𝑏 ) = 𝑘 𝑎 − 𝑘 𝑏 k(a+b)=ka+kb k(a−b)=ka−kb \t​","isCorrect":false},{"id":"opt-3","text":"de développer une expression, c’est-à-dire de transformer un produit en somme ; de factoriser une expression, c’est-à-dire de transformer une somme en produit.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('3942b3d3-dba2-4c9f-961e-e9f13103f5d5', 59, 'quiz', 'Qu''est-ce que : Nous obtenons finalement ?', 'Qu''est-ce que : Nous obtenons finalement ?', '[{"id":"opt-0","text":"( 𝑎 + 𝑏 ) ( 𝑎 − 𝑏 ) = 𝑎 2 − 𝑏 2 (a+b)(a−b)=a 2 −b 2","isCorrect":true},{"id":"opt-1","text":"La multiplication est distributive par rapport à l’addition (et à la soustraction) : nous distribuons un facteur aux termes d’une somme (ou d’une différence).","isCorrect":false},{"id":"opt-2","text":"Quels que soient les nombres relatifs  𝑘 k,  𝑎 a et  𝑏 b, on a :  𝑘 ( 𝑎 + 𝑏 ) = 𝑘 𝑎 + 𝑘 𝑏   𝑘 ( 𝑎 − 𝑏 ) = 𝑘 𝑎 − 𝑘 𝑏 k(a+b)=ka+kb k(a−b)=ka−kb \t​","isCorrect":false},{"id":"opt-3","text":"de développer une expression, c’est-à-dire de transformer un produit en somme ; de factoriser une expression, c’est-à-dire de transformer une somme en produit.","isCorrect":false}]', NULL, NULL, 50);

INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '3942b3d3-dba2-4c9f-961e-e9f13103f5d5', '2026-01-17', 1, 0, 5)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '3942b3d3-dba2-4c9f-961e-e9f13103f5d5', '2026-01-18', 2, 6, 11)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '3942b3d3-dba2-4c9f-961e-e9f13103f5d5', '2026-01-19', 3, 12, 17)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '3942b3d3-dba2-4c9f-961e-e9f13103f5d5', '2026-01-20', 4, 18, 23)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '3942b3d3-dba2-4c9f-961e-e9f13103f5d5', '2026-01-21', 5, 24, 29)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '3942b3d3-dba2-4c9f-961e-e9f13103f5d5', '2026-01-22', 6, 30, 35)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '3942b3d3-dba2-4c9f-961e-e9f13103f5d5', '2026-01-23', 7, 36, 41)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '3942b3d3-dba2-4c9f-961e-e9f13103f5d5', '2026-01-24', 8, 42, 47)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '3942b3d3-dba2-4c9f-961e-e9f13103f5d5', '2026-01-25', 9, 48, 53)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '3942b3d3-dba2-4c9f-961e-e9f13103f5d5', '2026-01-26', 10, 54, 59)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;

-- Course: Caractéristiques d''une série statistique
INSERT INTO public.courses (id, user_id, title, description, category, level, estimated_minutes, icon, total_xp, is_published, duration_days, daily_cards_count)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', '00000000-0000-0000-0000-000000000001', 'Caractéristiques d''une série statistique', 'Cours de Mathématiques : Caractéristiques d''une série statistique', 'Mathématiques', '3eme', 15, '📚', 960, true, 10, 6);

INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 0, 'lesson', 'Introduction', 'Très souvent, une série statistique avec des données brutes, surtout si elles sont nombreuses, n’est pas très parlante. Il est donc important d’en calculer des caractéristiques, aussi appelées indicateurs.
Nous reverrons ainsi dans ce cours les deux caractéristiques de position que nous connaissons : la moyenne et la médiane. Puis nous aborderons une caractéristique de dispersion : l’étendue, que certains ont peut-être déjà vu. Nous pourrons alors appliquer ces notions à un exercice type brevet.
Enfin, nous verrons comment organiser et représenter des données dont les valeurs sont très variées, en les regroupant par classes.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 1, 'lesson', 'Caractéristiques de position', 'Les caractéristiques de position permettent de repérer certaines valeurs importantes, comme les valeurs minimales et maximales, ou, comme nous le savons déjà, la moyenne et la médiane, qui sont plus particulièrement des caractéristiques de tendance centrale.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 2, 'lesson', 'Moyenne d’une série de données numériques', 'La moyenne d’une série de données numériques est égale à la somme de toutes les données, divisée par l’effectif total :

moyenne
=
somme des donn
e
ˊ
es
effectif total
moyenne=
effectif total
somme des donn
e
ˊ
es
	​


Dans de nombreuses séries statistiques, les valeurs apparaissent plusieurs fois. Et les données sont organisées sous la forme d’un tableau d’effectifs, que l’on peut compléter en donnant les fréquences.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 3, 'lesson', 'On l’exprime sous forme de fraction, décimale ou de pourcentage.', 'Par exemple, lors d’une étude statistique, on a demandé à 
100
100 élèves (population), choisis au hasard dans un collège, combien de livres ils avaient lus (caractère) durant les douze derniers mois – sans compter ceux lus pour la classe.

Le tableau suivant récapitule les réponses, avec les fréquences, exprimées en pourcentage (car c’est bien pratique, vu que l’effectif total est de 
100
100) :', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 4, 'lesson', 'Fréquence', '0
0

	

14
14

	

14
%
14%




1
1

	

11
11

	

11
%
11%




2
2

	

31
31

	

31
%
31%




3
3

	

10
10

	

10
%
10%




4
4

	

8
8

	

8
%
8%




5
5

	

9
9

	

9
%
9%




6
6

	

2
2

	

2
%
2%




7
7

	

3
3

	

3
%
3%




11
11

	

7
7

	

7
%
7%




12
12

	

4
4

	

4
%
4%




24
24

	

1
1

	

1
%
1%', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 5, 'lesson', 'Totaux', '100
100

	

100
%
100%

Pour calculer la moyenne de livres lus durant les douze derniers mois, nous allons ici utiliser la moyenne pondérée.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 6, 'lesson', 'Moyenne pondérée', 'La moyenne pondérée d’une série statistique numérique est égale à la somme des produits de chaque valeur par son effectif, divisée par l’effectif total :

moyenne pond
e
ˊ
r
e
ˊ
e
=
somme des produits des valeurs par leurs effectifs
effectif total
moyenne pond
e
ˊ
r
e
ˊ
e=
effectif total
somme des produits des valeurs par leurs effectifs
	​


Commençons par calculer la somme 
𝑆
p
S
p
	​

 des produits de chaque valeur (soit le nombre de livres lus) par son effectif (soit le nombre d’élèves ayant lu cette quantité de livres) :

𝑆
p
	
=
0
×
14
+
1
×
11
+
2
×
31
+
3
×
10
+
4
×
8
+
5
×
9


	
+
6
×
2
+
7
×
3
+
11
×
7
+
12
×
4
+
24
×
1


	
=
0
+
11
+
62
+
30
+
32
+
45
+
12
+
21
+
77
+
48
+
24


	
=
362
S
p
	​

	​

=0×14+1×11+2×31+3×10+4×8+5×9
+6×2+7×3+11×7+12×4+24×1
=0+11+62+30+32+45+12+21+77+48+24
=362
	​


Il suffit donc de diviser cette somme par l’effectif total, pour déterminer la moyenne (pondérée) de livres lus, notée 
𝑀
p
M
p
	​

 :

𝑀
p
=
𝑆
p
100
=
362
100
=
3
,
62
M
p
	​

=
100
S
p
	​

	​

=
100
362
	​

=3,62

Parmi la population des 
100
100 élèves choisis, un élève a lu en moyenne 
3
,
62
3,62 livres sur l’année écoulée.

Pour donner une image plus visuelle des données, on peut les représenter graphiquement, par exemple par un diagramme en bâtons :', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 7, 'lesson', 'Diagramme en bâtons', 'Ce diagramme permet, entre autres, de voir d’un simple coup d’œil que la valeur qui apparaît le plus souvent est « 
2
2 ».

« 
2
2 livres » est la réponse la plus fréquente.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 8, 'lesson', 'Astuce', 'La valeur qui est la plus fréquente est appelée mode de la série. C’est une autre caractéristique de position.

Par ailleurs, madame A., professeure de français du collège, considère qu’un élève est un lecteur régulier s’il a lu 
6
6 livres ou plus durant l’année écoulée (soit, en moyenne, un livre tous les deux mois). Elle se demande alors quel est, dans ce même groupe d’élèves, le pourcentage de lecteurs réguliers.

Pour déterminer ce pourcentage, on se sert du tableau ou du diagramme pour repérer les effectifs des valeurs supérieures ou égales à 
6
6, que l’on additionne, avant de diviser par l’effectif total.

2
2 élèves ont lu 
6
6 livres.
3
3 élèves ont lu 
7
7 livres.
7
7 élèves ont lu 
11
11 livres.
4
4 élèves ont lu 
12
12 livres.
1
1 seul élève a lu 
24
24 livres.
Donc, 
2
+
3
+
7
+
4
+
1
=
17
2+3+7+4+1=17 élèves ont lu 
6
6 livres ou plus.

17
%
17% des élèves interrogés sont des lecteurs réguliers, selon la définition de madame A.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 9, 'lesson', 'Astuce', 'On peut aussi ajouter directement les fréquences des valeurs concernées, lorsqu’on souhaite avoir une fréquence en résultat.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 10, 'lesson', 'Médiane d’une série statistique', 'Les données d’une série numérique étant rangées dans l’ordre croissant, on appelle médiane de cette série une valeur qui la partage en deux groupes de même effectif.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 11, 'lesson', 'Cas 1 : Effectif total impair', 'Ludivine pratique le saut en longueur à assez haut niveau.
Lors d’une session d’entraînement, elle a réalisé 
7
7 sauts, et a relevé les longueurs atteintes (en mètre) :

4
,
20
4
,
55
4
,
92
4
,
70
5
,
07
5
,
01
4
,
85
4,204,554,924,705,075,014,85', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 12, 'lesson', 'Pour calculer la médiane de cette série, on commence par la ranger dans l’ordre croissant', '4
,
20
4
,
55
4
,
70
4
,
85
4
,
92
5
,
01
5
,
07
4,204,554,704,854,925,015,07', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 13, 'lesson', 'Ici, comme l’effectif total est impair, la médiane est une donnée de la série.', '4
,
20
4
,
55
4
,
70
⏟
3
 donn
e
ˊ
es
4
,
85
⏟
M
e
ˊ
diane
4
,
92
5
,
01
5
,
07
⏟
3
 donn
e
ˊ
es
3 donn
e
ˊ
es
4,204,554,70
	​

	​

M
e
ˊ
diane
4,85
	​

	​

3 donn
e
ˊ
es
4,925,015,07
	​

	​


La médiane de cette série vaut 
4
,
85
 m
4,85 m.
Autrement dit, Ludivine a effectué autant de sauts inférieurs ou égaux à 
4
,
85
 m
4,85 m que de sauts supérieurs ou égaux à 
4
,
85
 m
4,85 m.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 14, 'lesson', 'Cas 2 : Effectif total pair', 'Un peu plus tard dans la journée, Ludivine effectue une nouvelle session d’entraînement, cette fois de 
6
6 sauts. On donne les longueurs réalisées, déjà ordonnées :

3
,
82
4
,
65
4
,
73
4
,
90
4
,
99
5
,
12
3,824,654,734,904,995,12

Pour déterminer la médiane, on cherche toujours une valeur qui partage la série en deux séries de même effectif.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 15, 'lesson', 'Ici, comme l’effectif total est pair, la médiane est entre deux données de la série.', '3
,
82
4
,
65
4
,
73
⏟
3
 donn
e
ˊ
es
⏟
M
e
ˊ
diane
4
,
90
4
,
99
5
,
12
⏟
3
 donn
e
ˊ
es
3 donn
e
ˊ
es
3,824,654,73
	​

	​

M
e
ˊ
diane
2,22
	​

	​

3 donn
e
ˊ
es
4,904,995,12
	​

	​


N’importe quel nombre compris entre 
4
,
73
4,73 et 
4
,
90
4,90 partagera cette série en deux séries de même effectif.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 16, 'lesson', 'Par convention, on prend la moyenne de ces deux valeurs', '4
,
73
+
4
,
90
2
=
9
,
63
2
=
4
,
815
2
4,73+4,90
	​

=
2
9,63
	​

=4,815

La médiane de cette série vaut 
4
,
815
 m
4,815 m.
Autrement dit, Ludivine a effectué autant de sauts inférieurs à 
4
,
815
 m
4,815 m que de sauts supérieurs à 
4
,
815
 m
4,815 m.

Remarque : En saut en longueur, les millimètres ne comptent pas vraiment. On peut alors choisir comme médiane de cette deuxième session 
4
,
81
 m
4,81 m ou 
4
,
82
 m
4,82 m.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 17, 'lesson', 'Moyenne de la session 1', '4
,
20
+
4
,
55
+
4
,
7
+
4
,
85
+
4
,
92
+
5
,
01
+
5
,
07
7
	
=
33
,
3
7


	
≈
4
,
76
 m
7
4,20+4,55+4,7+4,85+4,92+5,01+5,07
	​

	​

=
7
33,3
	​

≈4,76 m
	​', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 18, 'lesson', 'Moyenne de la session 2', '3
,
82
+
4
,
65
+
4
,
73
+
4
,
90
+
4
,
99
+
5
,
12
6
	
=
28
,
21
6


	
≈
4
,
70
 m
6
3,82+4,65+4,73+4,90+4,99+5,12
	​

	​

=
6
28,21
	​

≈4,70 m
	​', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 19, 'lesson', 'Session 1', '4
,
76
 m
4,76 m

	

4
,
85
 m
4,85 m', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 20, 'lesson', 'Session 2', '4
,
70
 m
4,70 m

	

4
,
815
 m
4,815 m

On voit que la moyenne et la médiane sont meilleures pour la session 1 que pour la session 2. On pourrait donc conclure que Ludivine a été meilleure lors de cette première session.
Toutefois, à y regarder de plus près, et comme on sait que, dans ce sport, c’est la saut le plus long qui compte, on se rend compte que sa meilleure session pourrait aussi être la seconde, où elle a atteint une longueur de 
5
,
12
 m
5,12 m !

Ainsi, la moyenne et la médiane sont des caractéristiques de position importantes. Mais, souvent, elles ne suffisent pas : ici, il est tout aussi important de noter la valeur maximale, qui est également une caractéristique de position.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 21, 'lesson', 'Caractéristique de dispersion', 'Vous découvrirez, au fil de vos études, plusieurs caractéristiques de dispersion, qui permettent de donner des indications sur la répartition des données.
En 3e, nous travaillons uniquement avec l’étendue.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 22, 'lesson', 'Étendue d’une série statistique', 'Reprenons les deux sessions de saut de Ludivine.
Il est aussi intéressant pour elle, afin de mieux juger ses prestations, de regarder le plus mauvais saut de chaque session (le minimum), ainsi que le meilleur (le maximum) :

Session 1 :
	
4
,
20
4
,
55
4
,
70
4
,
85
4
,
92
5
,
01
5
,
07


Session 2 :
	
3
,
82
4
,
65
4
,
73
4
,
90
4
,
99
5
,
12
Session 1 :
Session 2 :
	​

4,204,554,704,854,925,015,07
3,824,654,734,904,995,12
	​', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 23, 'lesson', 'Étendue d’une série statistique', 'L’étendue d’une série statistique est la différence entre la plus grande valeur et la plus petite valeur de cette série :

E
ˊ
tendue
=
Valeur max
−
Valeur min
E
ˊ
tendue=Valeur max−Valeur min', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 24, 'lesson', 'Pour Ludivine, cela donne', 'E
ˊ
tendue pour la s
e
ˊ
rie 1 : 
	
5
,
07
−
4
,
20
=
0
,
87
 m


E
ˊ
tendue pour la s
e
ˊ
rie 2 : 
	
5
,
12
−
3
,
82
=
1
,
30
 m
E
ˊ
tendue pour la s
e
ˊ
rie 1 : 
E
ˊ
tendue pour la s
e
ˊ
rie 2 : 
	​

5,07−4,20=0,87 m
5,12−3,82=1,30 m
	​', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 25, 'lesson', 'L’étendue de la série 2 est supérieure à celle de la série 1.', 'Une façon d’interpréter cela, c’est de dire que, si Ludivine a effectué son meilleur saut lors de la session 2, elle y a aussi raté un saut.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 26, 'lesson', 'Session 1', '4
,
76
 m
4,76 m

	

4
,
85
 m
4,85 m

	

5
,
01
 m
5,01 m

	

0
,
87
 m
0,87 m', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 27, 'lesson', 'Session 2', '4
,
70
 m
4,70 m

	

4
,
815
 m
4,815 m

	

5
,
12
 m
5,12 m

	

1
,
30
 m
1,30 m

On a alors pas mal d’informations, et on peut choisir laquelle nous intéresse plus particulièrement (meilleure moyenne, meilleur saut, différence entre pire et mauvais saut réduite…).', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 28, 'lesson', 'Revenons à Ludivine, la sauteuse en longueur et à son club d’athlétisme.', '25
25 filles au total dans ce club pratiquent le saut en longueur.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 29, 'lesson', 'Le tableau suivant recense les records personnels de chacune des athlètes (en mètre)', '4
,
57
4,57

	

4
,
66
4,66

	

4
,
68
4,68

	

4
,
78
4,78

	

4
,
64
4,64




5
,
07
5,07

	

4
,
67
4,67

	

4
,
94
4,94

	

4
,
85
4,85

	

5
,
13
5,13




4
,
93
4,93

	

4
,
77
4,77

	

4
,
54
4,54

	

4
,
51
4,51

	

4
,
92
4,92




4
,
84
4,84

	

4
,
98
4,98

	

5
,
16
5,16

	

4
,
75
4,75

	

4
,
87
4,87




4
,
95
4,95

	

4
,
81
4,81

	

4
,
97
4,97

	

4
,
95
4,95

	

4
,
60
4,60

Nous nous rendons compte très vite qu’il y a de nombreuses valeurs différentes (
24
24, en fait).', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 30, 'lesson', 'À retenir', 'Quand, dans une série de données numériques, il y a de très nombreuses valeurs différentes, on peut les regrouper en classes, c’est-à-dire en intervalles de valeurs.

On compte alors le nombre de valeurs qui appartiennent à chaque classe et on récapitule, dans un tableau, les effectifs.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 31, 'lesson', 'Amplitude d’une classe', 'L’amplitude d’une classe est égale à la différence entre la valeur la plus grande de la classe et la plus petite.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 32, 'lesson', 'Au collège, nous travaillerons uniquement avec des classes de même amplitude.', 'Pour le saut en longueur, il est intéressant de regrouper les longueurs par classes de 
10
 cm
10 cm, à partir, pour notre série, de 
4
,
50
 m
4,50 m, jusqu’à avoir la classe contenant le saut le plus long.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 33, 'lesson', 'On obtient ainsi les classes suivantes', 'Longueur 
𝑙
l (en 
m
m)




4
,
50
≤
𝑙
<
4
,
60
4,50≤l<4,60




4
,
60
≤
𝑙
<
4
,
70
4,60≤l<4,70




4
,
70
≤
𝑙
<
4
,
80
4,70≤l<4,80




4
,
80
≤
𝑙
<
4
,
90
4,80≤l<4,90




4
,
90
≤
𝑙
<
5
,
00
4,90≤l<5,00




5
,
00
≤
𝑙
<
5
,
10
5,00≤l<5,10




5
,
10
≤
𝑙
<
5
,
20
5,10≤l<5,20

Pour trouver les effectifs de chaque classe, il suffit de compter les données comprises entre sa plus petite valeur et sa plus grande. Par exemple :

les longueurs appartenant à la première classe sont celles supérieures ou égales à 
4
,
50
 m
4,50 m et strictement inférieures à 
4
,
60
 m
4,60 m (sur fond orange ci-dessous) ;
les longueurs appartenant à la dernière classe sont celles supérieures ou égales à 
5
,
10
 m
5,10 m et strictement inférieures à 
5
,
20
 m
5,20 m (sur fond vert ci-dessous).

4
,
57
4,57

	

4
,
66
4,66

	

4
,
68
4,68

	

4
,
78
4,78

	

4
,
64
4,64




5
,
07
5,07

	

4
,
67
4,67

	

4
,
94
4,94

	

4
,
85
4,85

	

5
,
13
5,13




4
,
93
4,93

	

4
,
77
4,77

	

4
,
54
4,54

	

4
,
51
4,51

	

4
,
92
4,92




4
,
84
4,84

	

4
,
98
4,98

	

5
,
16
5,16

	

4
,
75
4,75

	

4
,
87
4,87




4
,
95
4,95

	

4
,
81
4,81

	

4
,
97
4,97

	

4
,
95
4,95

	

4
,
60
4,60', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 34, 'lesson', 'Il y a ainsi', '3
3 données comprises entre 
4
,
50
 m
4,50 m et 
4
,
60
 m
4,60 m ;
2
2 données comprises entre 
5
,
10
 m
5,10 m et 
5
,
20
 m
5,20 m.

On procède de même pour toutes les autres classes.
On peut aussi calculer les fréquences des classes, en calculant le quotient de l’effectif de la classe par l’effectif total.

Longueur 
𝑙
l (en 
m
m)', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 35, 'lesson', 'Fréquence', '4
,
50
≤
𝑙
<
4
,
60
4,50≤l<4,60

	

3
3

	

0
,
12
0,12




4
,
60
≤
𝑙
<
4
,
70
4,60≤l<4,70

	

5
5

	

0
,
2
0,2




4
,
70
≤
𝑙
<
4
,
80
4,70≤l<4,80

	

3
3

	

0
,
12
0,12




4
,
80
≤
𝑙
<
4
,
90
4,80≤l<4,90

	

4
4

	

0
,
16
0,16




4
,
90
≤
𝑙
<
5
,
00
4,90≤l<5,00

	

7
7

	

0
,
28
0,28




5
,
00
≤
𝑙
<
5
,
10
5,00≤l<5,10

	

1
1

	

0
,
04
0,04




5
,
10
≤
𝑙
<
5
,
20
5,10≤l<5,20

	

2
2

	

0
,
08
0,08', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 36, 'lesson', 'Exemple', 'Seules les filles ayant déjà sauté à au moins 
4
,
90
 m
4,90 m pourront participer à la prochaine compétition.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 37, 'lesson', 'Quel est le pourcentage des athlètes du club qui pourront y participer ?', 'On se sert ici du tableau précédent, en repérant les classes où les longueurs sont supérieures à la longueur minimale. Les records personnels suffisants appartiennent ainsi aux trois dernières classes.

Il suffit maintenant d’ajouter les fréquences de ces trois classes, que l’on n’oubliera pas d’exprimer en pourcentage :

0
,
28
+
0
,
04
+
0
,
08
=
0
,
4
=
40
%
0,28+0,04+0,08=0,4=40%

40
%
40% des filles du club pourront participer à la prochaine compétition.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 38, 'lesson', 'Histogramme', 'Un histogramme est un diagramme permettant de représenter des données regroupées en classes.
Les classes sont représentées par des rectangles dont les aires sont proportionnelles aux effectifs.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 39, 'lesson', 'Propriété', 'Cas particulier : Lorsque les classes sont de même amplitude, ce qui est le cas des situations que nous rencontrons en troisième, les rectangles représentant les classes ont la même largeur et leurs hauteurs sont proportionnelles aux effectifs.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 40, 'lesson', 'Calculer une moyenne avec des données regroupées par classe', 'Pour calculer la moyenne des records personnels du club de Ludivine, on pourrait faire comme d’habitude, en effectuant la somme de toutes les longueurs, puis en la divisant par l’effectif total. On obtiendrait ainsi la moyenne exacte.
Il s’agirait toutefois d’un calcul fastidieux, qui l’est encore plus quand les données sont très nombreuses. De plus, souvent, les données sont directement données regroupées par classes.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 41, 'lesson', 'Pour calculer une moyenne lorsque les données sont regroupées par classe', 'on détermine le centre de chaque classe, qui est égal à la moyenne entre les valeurs extrêmes de la classe ;
on calcule ensuite la moyenne pondérée en prenant comme valeurs les centres des classes.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 42, 'lesson', 'On les ajoute dans le tableau que nous avons fait plus haut', 'Longueur 
𝑙
l (en 
m
m)', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 43, 'lesson', 'Fréquence', '4
,
50
≤
𝑙
<
4
,
60
4,50≤l<4,60

	

4
,
55
4,55

	

3
3

	

0
,
12
0,12




4
,
60
≤
𝑙
<
4
,
70
4,60≤l<4,70

	

4
,
65
4,65

	

5
5

	

0
,
2
0,2




4
,
70
≤
𝑙
<
4
,
80
4,70≤l<4,80

	

4
,
75
4,75

	

3
3

	

0
,
12
0,12




4
,
80
≤
𝑙
<
4
,
90
4,80≤l<4,90

	

4
,
85
4,85

	

4
4

	

0
,
16
0,16




4
,
90
≤
𝑙
<
5
,
00
4,90≤l<5,00

	

4
,
95
4,95

	

7
7

	

0
,
28
0,28




5
,
00
≤
𝑙
<
5
,
10
5,00≤l<5,10

	

5
,
05
5,05

	

1
1

	

0
,
04
0,04




5
,
10
≤
𝑙
<
5
,
20
5,10≤l<5,20

	

5
,
15
5,15

	

2
2

	

0
,
08
0,08', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 44, 'lesson', 'On peut maintenant calculer la moyenne pondérée', '𝑀
p
	
=
4
,
55
×
3
+
4
,
65
×
5
+
4
,
75
×
3
+
4
,
85
×
4
+
4
,
95
×
7
+
5
,
05
×
1
+
5
,
15
×
2
25


	
=
13
,
65
+
23
,
25
+
14
,
25
+
19
,
4
+
34
,
65
+
5
,
05
+
10
,
3
25


	
=
120
,
55
25


	
=
4
,
822
 m
M
p
	​

	​

=
25
4,55×3+4,65×5+4,75×3+4,85×4+4,95×7+5,05×1+5,15×2
	​

=
25
13,65+23,25+14,25+19,4+34,65+5,05+10,3
	​

=
25
120,55
	​

=4,822 m
	​


En passant par les centres des classes, on trouve un record personnel moyen égal à 
4
,
822
 m
4,822 m.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 45, 'lesson', 'Astuce', 'Puisqu’on dispose ici de toutes les données, on peut calculer la moyenne exacte, en faisant appel à un tableur. Celui-ci nous renvoie une moyenne exacte de 
4
,
8216
 m
4,8216 m.

Ici, moyenne exacte et moyenne calculée avec les centres des classes sont très proches.
Cette dernière est donc dans notre cas très fiable.

Tout au long du collège, nous avons appris à traiter et à interpréter des séries de données statistiques, en les représentant et en en déterminant des premières caractéristiques. Ces bases sont fondamentales pour bien comprendre le monde actuel, où les statistiques et le traitement des données ont une place sans cesse grandissante, avec Internet notamment.
Au lycée, nous continuerons à approfondir l’étude des statistiques. Nous en découvrirons la puissance, mais aussi les limites. Et nous serons ainsi plus sensibles à tous les enjeux du traitement des données.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 46, 'quiz', 'Qu''est-ce que : Caractéristiques de position ?', 'Qu''est-ce que : Caractéristiques de position ?', '[{"id":"opt-0","text":"Les caractéristiques de position permettent de repérer certaines valeurs importantes, comme les valeurs minimales et maximales, ou, comme nous le savons déjà, la moyenne et la médiane, qui sont plus particulièrement des caractéristiques de tendance centrale.","isCorrect":true},{"id":"opt-1","text":"La moyenne d’une série de données numériques est égale à la somme de toutes les données, divisée par l’effectif total :  moyenne = somme des donn e ˊ es effectif total moyenne= effectif total somme des donn e ˊ es \t​   Dans de nombreuses séries statistiques, les valeurs apparaissent plusieurs fois.","isCorrect":false},{"id":"opt-2","text":"0 0  \t  14 14  \t  14 % 14%     1 1  \t  11 11  \t  11 % 11%     2 2  \t  31 31  \t  31 % 31%     3 3  \t  10 10  \t  10 % 10%     4 4  \t  8 8  \t  8 % 8%     5 5  \t  9 9  \t  9 % 9%     6 6  \t  2 2  \t  2 % 2%...","isCorrect":false},{"id":"opt-3","text":"100 100  \t  100 % 100%  Pour calculer la moyenne de livres lus durant les douze derniers mois, nous allons ici utiliser la moyenne pondérée.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 47, 'quiz', 'Qu''est-ce que : Moyenne d’une série de données numériques ?', 'Qu''est-ce que : Moyenne d’une série de données numériques ?', '[{"id":"opt-0","text":"La moyenne d’une série de données numériques est égale à la somme de toutes les données, divisée par l’effectif total :  moyenne = somme des donn e ˊ es effectif total moyenne= effectif total somme des donn e ˊ es \t​   Dans de nombreuses séries statistiques, les valeurs apparaissent plusieurs fois.","isCorrect":true},{"id":"opt-1","text":"Les caractéristiques de position permettent de repérer certaines valeurs importantes, comme les valeurs minimales et maximales, ou, comme nous le savons déjà, la moyenne et la médiane, qui sont plus particulièrement des caractéristiques de tendance centrale.","isCorrect":false},{"id":"opt-2","text":"0 0  \t  14 14  \t  14 % 14%     1 1  \t  11 11  \t  11 % 11%     2 2  \t  31 31  \t  31 % 31%     3 3  \t  10 10  \t  10 % 10%     4 4  \t  8 8  \t  8 % 8%     5 5  \t  9 9  \t  9 % 9%     6 6  \t  2 2  \t  2 % 2%...","isCorrect":false},{"id":"opt-3","text":"100 100  \t  100 % 100%  Pour calculer la moyenne de livres lus durant les douze derniers mois, nous allons ici utiliser la moyenne pondérée.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 48, 'quiz', 'Qu''est-ce que : Fréquence ?', 'Qu''est-ce que : Fréquence ?', '[{"id":"opt-0","text":"0 0  \t  14 14  \t  14 % 14%     1 1  \t  11 11  \t  11 % 11%     2 2  \t  31 31  \t  31 % 31%     3 3  \t  10 10  \t  10 % 10%     4 4  \t  8 8  \t  8 % 8%     5 5  \t  9 9  \t  9 % 9%     6 6  \t  2 2  \t  2 % 2%...","isCorrect":true},{"id":"opt-1","text":"Les caractéristiques de position permettent de repérer certaines valeurs importantes, comme les valeurs minimales et maximales, ou, comme nous le savons déjà, la moyenne et la médiane, qui sont plus particulièrement des caractéristiques de tendance centrale.","isCorrect":false},{"id":"opt-2","text":"La moyenne d’une série de données numériques est égale à la somme de toutes les données, divisée par l’effectif total :  moyenne = somme des donn e ˊ es effectif total moyenne= effectif total somme des donn e ˊ es \t​   Dans de nombreuses séries statistiques, les valeurs apparaissent plusieurs fois.","isCorrect":false},{"id":"opt-3","text":"100 100  \t  100 % 100%  Pour calculer la moyenne de livres lus durant les douze derniers mois, nous allons ici utiliser la moyenne pondérée.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 49, 'quiz', 'Qu''est-ce que : Totaux ?', 'Qu''est-ce que : Totaux ?', '[{"id":"opt-0","text":"100 100  \t  100 % 100%  Pour calculer la moyenne de livres lus durant les douze derniers mois, nous allons ici utiliser la moyenne pondérée.","isCorrect":true},{"id":"opt-1","text":"Les caractéristiques de position permettent de repérer certaines valeurs importantes, comme les valeurs minimales et maximales, ou, comme nous le savons déjà, la moyenne et la médiane, qui sont plus particulièrement des caractéristiques de tendance centrale.","isCorrect":false},{"id":"opt-2","text":"La moyenne d’une série de données numériques est égale à la somme de toutes les données, divisée par l’effectif total :  moyenne = somme des donn e ˊ es effectif total moyenne= effectif total somme des donn e ˊ es \t​   Dans de nombreuses séries statistiques, les valeurs apparaissent plusieurs fois.","isCorrect":false},{"id":"opt-3","text":"0 0  \t  14 14  \t  14 % 14%     1 1  \t  11 11  \t  11 % 11%     2 2  \t  31 31  \t  31 % 31%     3 3  \t  10 10  \t  10 % 10%     4 4  \t  8 8  \t  8 % 8%     5 5  \t  9 9  \t  9 % 9%     6 6  \t  2 2  \t  2 % 2%...","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 50, 'quiz', 'Qu''est-ce que : Moyenne pondérée ?', 'Qu''est-ce que : Moyenne pondérée ?', '[{"id":"opt-0","text":"La moyenne pondérée d’une série statistique numérique est égale à la somme des produits de chaque valeur par son effectif, divisée par l’effectif total :  moyenne pond e ˊ r e ˊ e = somme des produits des valeurs par leurs effectifs effectif total moyenne pond e ˊ r e ˊ e= effectif total somme des produits des valeurs par leurs effectifs \t​   Commençons par calculer la somme  𝑆 p S p \t​   des produits de chaque valeur (soit le nombre de livres lus) par son effectif (soit le nombre d’élèves ayant lu cette quantité de livres) :  𝑆 p \t = 0 × 14 + 1 × 11 + 2 × 31 + 3 × 10 + 4 × 8 + 5 × 9   \t + 6 × 2 + 7 × 3 + 11 × 7 + 12 × 4 + 24 × 1   \t = 0 + 11 + 62 + 30 + 32 + 45 + 12 + 21 + 77 + 48 + 24   \t = 362 S p \t​  \t​  =0×14+1×11+2×31+3×10+4×8+5×9 +6×2+7×3+11×7+12×4+24×1 =0+11+62+30+32+45+12+21+77+48+24 =362 \t​   Il suffit donc de diviser cette somme par l’effectif total, pour déterminer la moyenne (pondérée) de livres lus, notée  𝑀 p M p \t​   :  𝑀 p = 𝑆 p 100 = 362 100 = 3 , 62 M p \t​  = 100 S p \t​  \t​  = 100 362 \t​  =3,62  Parmi la population des  100 100 élèves choisis, un élève a lu en moyenne  3 , 62 3,62 livres sur l’année écoulée.","isCorrect":true},{"id":"opt-1","text":"Les caractéristiques de position permettent de repérer certaines valeurs importantes, comme les valeurs minimales et maximales, ou, comme nous le savons déjà, la moyenne et la médiane, qui sont plus particulièrement des caractéristiques de tendance centrale.","isCorrect":false},{"id":"opt-2","text":"La moyenne d’une série de données numériques est égale à la somme de toutes les données, divisée par l’effectif total :  moyenne = somme des donn e ˊ es effectif total moyenne= effectif total somme des donn e ˊ es \t​   Dans de nombreuses séries statistiques, les valeurs apparaissent plusieurs fois.","isCorrect":false},{"id":"opt-3","text":"0 0  \t  14 14  \t  14 % 14%     1 1  \t  11 11  \t  11 % 11%     2 2  \t  31 31  \t  31 % 31%     3 3  \t  10 10  \t  10 % 10%     4 4  \t  8 8  \t  8 % 8%     5 5  \t  9 9  \t  9 % 9%     6 6  \t  2 2  \t  2 % 2%...","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 51, 'quiz', 'Qu''est-ce que : Diagramme en bâtons ?', 'Qu''est-ce que : Diagramme en bâtons ?', '[{"id":"opt-0","text":"Ce diagramme permet, entre autres, de voir d’un simple coup d’œil que la valeur qui apparaît le plus souvent est «  2 2 ».  «  2 2 livres » est la réponse la plus fréquente.","isCorrect":true},{"id":"opt-1","text":"Les caractéristiques de position permettent de repérer certaines valeurs importantes, comme les valeurs minimales et maximales, ou, comme nous le savons déjà, la moyenne et la médiane, qui sont plus particulièrement des caractéristiques de tendance centrale.","isCorrect":false},{"id":"opt-2","text":"La moyenne d’une série de données numériques est égale à la somme de toutes les données, divisée par l’effectif total :  moyenne = somme des donn e ˊ es effectif total moyenne= effectif total somme des donn e ˊ es \t​   Dans de nombreuses séries statistiques, les valeurs apparaissent plusieurs fois.","isCorrect":false},{"id":"opt-3","text":"0 0  \t  14 14  \t  14 % 14%     1 1  \t  11 11  \t  11 % 11%     2 2  \t  31 31  \t  31 % 31%     3 3  \t  10 10  \t  10 % 10%     4 4  \t  8 8  \t  8 % 8%     5 5  \t  9 9  \t  9 % 9%     6 6  \t  2 2  \t  2 % 2%...","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 52, 'quiz', 'Qu''est-ce que : Médiane d’une série statistique ?', 'Qu''est-ce que : Médiane d’une série statistique ?', '[{"id":"opt-0","text":"Les données d’une série numérique étant rangées dans l’ordre croissant, on appelle médiane de cette série une valeur qui la partage en deux groupes de même effectif.","isCorrect":true},{"id":"opt-1","text":"Les caractéristiques de position permettent de repérer certaines valeurs importantes, comme les valeurs minimales et maximales, ou, comme nous le savons déjà, la moyenne et la médiane, qui sont plus particulièrement des caractéristiques de tendance centrale.","isCorrect":false},{"id":"opt-2","text":"La moyenne d’une série de données numériques est égale à la somme de toutes les données, divisée par l’effectif total :  moyenne = somme des donn e ˊ es effectif total moyenne= effectif total somme des donn e ˊ es \t​   Dans de nombreuses séries statistiques, les valeurs apparaissent plusieurs fois.","isCorrect":false},{"id":"opt-3","text":"0 0  \t  14 14  \t  14 % 14%     1 1  \t  11 11  \t  11 % 11%     2 2  \t  31 31  \t  31 % 31%     3 3  \t  10 10  \t  10 % 10%     4 4  \t  8 8  \t  8 % 8%     5 5  \t  9 9  \t  9 % 9%     6 6  \t  2 2  \t  2 % 2%...","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 53, 'quiz', 'Qu''est-ce que : Cas 1 : Effectif total impair ?', 'Qu''est-ce que : Cas 1 : Effectif total impair ?', '[{"id":"opt-0","text":"Ludivine pratique le saut en longueur à assez haut niveau.","isCorrect":true},{"id":"opt-1","text":"Les caractéristiques de position permettent de repérer certaines valeurs importantes, comme les valeurs minimales et maximales, ou, comme nous le savons déjà, la moyenne et la médiane, qui sont plus particulièrement des caractéristiques de tendance centrale.","isCorrect":false},{"id":"opt-2","text":"La moyenne d’une série de données numériques est égale à la somme de toutes les données, divisée par l’effectif total :  moyenne = somme des donn e ˊ es effectif total moyenne= effectif total somme des donn e ˊ es \t​   Dans de nombreuses séries statistiques, les valeurs apparaissent plusieurs fois.","isCorrect":false},{"id":"opt-3","text":"0 0  \t  14 14  \t  14 % 14%     1 1  \t  11 11  \t  11 % 11%     2 2  \t  31 31  \t  31 % 31%     3 3  \t  10 10  \t  10 % 10%     4 4  \t  8 8  \t  8 % 8%     5 5  \t  9 9  \t  9 % 9%     6 6  \t  2 2  \t  2 % 2%...","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 54, 'quiz', 'Qu''est-ce que : Cas 2 : Effectif total pair ?', 'Qu''est-ce que : Cas 2 : Effectif total pair ?', '[{"id":"opt-0","text":"Un peu plus tard dans la journée, Ludivine effectue une nouvelle session d’entraînement, cette fois de  6 6 sauts.","isCorrect":true},{"id":"opt-1","text":"Les caractéristiques de position permettent de repérer certaines valeurs importantes, comme les valeurs minimales et maximales, ou, comme nous le savons déjà, la moyenne et la médiane, qui sont plus particulièrement des caractéristiques de tendance centrale.","isCorrect":false},{"id":"opt-2","text":"La moyenne d’une série de données numériques est égale à la somme de toutes les données, divisée par l’effectif total :  moyenne = somme des donn e ˊ es effectif total moyenne= effectif total somme des donn e ˊ es \t​   Dans de nombreuses séries statistiques, les valeurs apparaissent plusieurs fois.","isCorrect":false},{"id":"opt-3","text":"0 0  \t  14 14  \t  14 % 14%     1 1  \t  11 11  \t  11 % 11%     2 2  \t  31 31  \t  31 % 31%     3 3  \t  10 10  \t  10 % 10%     4 4  \t  8 8  \t  8 % 8%     5 5  \t  9 9  \t  9 % 9%     6 6  \t  2 2  \t  2 % 2%...","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('009d5b0d-42bd-46a6-88a3-695f3f47fa7a', 55, 'quiz', 'Qu''est-ce que : Moyenne de la session 1 ?', 'Qu''est-ce que : Moyenne de la session 1 ?', '[{"id":"opt-0","text":"4 , 20 + 4 , 55 + 4 , 7 + 4 , 85 + 4 , 92 + 5 , 01 + 5 , 07 7 \t = 33 , 3 7   \t ≈ 4 , 76  m 7 4,20+4,55+4,7+4,85+4,92+5,01+5,07 \t​  \t​  = 7 33,3 \t​  ≈4,76 m \t​","isCorrect":true},{"id":"opt-1","text":"Les caractéristiques de position permettent de repérer certaines valeurs importantes, comme les valeurs minimales et maximales, ou, comme nous le savons déjà, la moyenne et la médiane, qui sont plus particulièrement des caractéristiques de tendance centrale.","isCorrect":false},{"id":"opt-2","text":"La moyenne d’une série de données numériques est égale à la somme de toutes les données, divisée par l’effectif total :  moyenne = somme des donn e ˊ es effectif total moyenne= effectif total somme des donn e ˊ es \t​   Dans de nombreuses séries statistiques, les valeurs apparaissent plusieurs fois.","isCorrect":false},{"id":"opt-3","text":"0 0  \t  14 14  \t  14 % 14%     1 1  \t  11 11  \t  11 % 11%     2 2  \t  31 31  \t  31 % 31%     3 3  \t  10 10  \t  10 % 10%     4 4  \t  8 8  \t  8 % 8%     5 5  \t  9 9  \t  9 % 9%     6 6  \t  2 2  \t  2 % 2%...","isCorrect":false}]', NULL, NULL, 50);

INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '009d5b0d-42bd-46a6-88a3-695f3f47fa7a', '2026-01-17', 1, 0, 5)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '009d5b0d-42bd-46a6-88a3-695f3f47fa7a', '2026-01-18', 2, 6, 11)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '009d5b0d-42bd-46a6-88a3-695f3f47fa7a', '2026-01-19', 3, 12, 17)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '009d5b0d-42bd-46a6-88a3-695f3f47fa7a', '2026-01-20', 4, 18, 23)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '009d5b0d-42bd-46a6-88a3-695f3f47fa7a', '2026-01-21', 5, 24, 29)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '009d5b0d-42bd-46a6-88a3-695f3f47fa7a', '2026-01-22', 6, 30, 35)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '009d5b0d-42bd-46a6-88a3-695f3f47fa7a', '2026-01-23', 7, 36, 41)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '009d5b0d-42bd-46a6-88a3-695f3f47fa7a', '2026-01-24', 8, 42, 47)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '009d5b0d-42bd-46a6-88a3-695f3f47fa7a', '2026-01-25', 9, 48, 53)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '009d5b0d-42bd-46a6-88a3-695f3f47fa7a', '2026-01-26', 10, 54, 55)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;

-- Course: Comprendre et utiliser la notion de fonction
INSERT INTO public.courses (id, user_id, title, description, category, level, estimated_minutes, icon, total_xp, is_published, duration_days, daily_cards_count)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', '00000000-0000-0000-0000-000000000001', 'Comprendre et utiliser la notion de fonction', 'Cours de Mathématiques : Comprendre et utiliser la notion de fonction', 'Mathématiques', '3eme', 24, '📚', 820, true, 7, 6);

INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 0, 'lesson', 'Introduction', 'Dans ce cours, nous allons aborder la notion de fonction, élément clé des mathématiques, indispensable dans beaucoup de domaines : physique, biologie, géologie, médecine, économie, etc.

Nous commencerons par en donner la définition, le vocabulaire et les notations spécifiques. Nous découvrirons ainsi les notions d’antécédent et d’image d’un nombre par une fonction, et verrons comment les déterminer. Nous verrons aussi comment représenter graphiquement une fonction et comment exploiter une telle représentation.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 1, 'lesson', 'Fonction', 'Une fonction, souvent notée 
𝑓
f, est un processus (une machine) qui, à un nombre 
𝑥
x donné au départ, associe un unique nombre, appelé image de 
𝑥
x par la fonction 
𝑓
f et noté 
𝑓
(
𝑥
)
f(x) (on lit « 
𝑓
f de 
𝑥
x »).', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 2, 'lesson', 'La fonction f associe à x une unique image notée f(x)', 'Prenons l’exemple d’une fonction 
𝑓
f qui, au nombre donné au départ, associe son quintuple (on multiplie le nombre de départ par 
5
5). Et donnons quelques images de nombres par cette fonction 
𝑓
f.

L’image de 
−
3
−3 par la fonction 
𝑓
f est 
−
15
−15, puisque 
−
3
×
5
=
−
15
−3×5=−15.
On note : 
−
3
↦
−
15
−3↦−15 ou 
𝑓
(
−
3
)
=
−
15
f(−3)=−15.
L’image de 
0
0 par la fonction 
𝑓
f est 
0
0, puisque 
0
×
5
=
0
0×5=0.
On note : 
0
↦
0
0↦0 ou 
𝑓
(
0
)
=
0
f(0)=0.
L’image de 
1
1 par la fonction 
𝑓
f est 
5
5, puisque 
1
×
5
=
5
1×5=5.
On note : 
1
↦
5
1↦5 ou 
𝑓
(
1
)
=
5
f(1)=5.
L’image de 
8
8 par la fonction 
𝑓
f est 
40
40, puisque 
8
×
5
=
40
8×5=40.
On note : 
8
↦
40
8↦40 ou 
𝑓
(
8
)
=
40
f(8)=40.

Ainsi, de manière générale, à tout nombre 
𝑥
x, la fonction associe le nombre 
5
𝑥
5x.
On note :

𝑥
↦
5
𝑥
ou 
𝑓
(
𝑥
)
=
5
𝑥
x↦5xou f(x)=5x', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 3, 'lesson', 'À retenir', 'La fonction 
𝑓
f qui, à 
𝑥
x, associe 
𝑓
(
𝑥
)
f(x) peut être notée :

𝑓
:
𝑥
↦
𝑓
(
𝑥
)
f:x↦f(x)

Le nombre 
𝑓
(
𝑥
)
f(x) dépend de la valeur de 
𝑥
x. Autrement dit, 
𝑓
(
𝑥
)
f(x) varie en fonction de 
𝑥
x.

𝑥
x est appelé variable.

Reprenons la fonction 
𝑓
f précédente, qui associe à un nombre son quintuple.
Cette fonction 
𝑓
f se note donc :

𝑓
:
𝑥
↦
5
𝑥
f:x↦5x

On dit aussi que la fonction 
𝑓
f est définie par 
𝑓
(
𝑥
)
=
5
𝑥
f(x)=5x.

Cette expression littérale est appelée expression algébrique de la fonction 
𝑓
f.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 4, 'lesson', 'Attention', 'Il ne faut pas confondre 
𝑓
f et 
𝑓
(
𝑥
)
f(x) :

𝑓
f est une fonction ;
𝑓
(
𝑥
)
f(x) est un nombre, l’image de 
𝑥
x par la fonction 
𝑓
f.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 5, 'lesson', 'Exemple', 'On considère la fonction 
𝑔
g, qui, à un nombre 
𝑥
x, associe son carré 
𝑥
2
x
2
.

On peut alors noter la fonction : 
𝑔
:
𝑥
↦
𝑥
2
g:x↦x
2
.
On peut aussi dire que la fonction 
𝑔
g est définie par 
𝑔
(
𝑥
)
=
𝑥
2
g(x)=x
2
.

Ainsi, pour déterminer l’image d’un nombre par la fonction 
𝑔
g, on remplace, dans l’expression algébrique, 
𝑥
x par ce nombre.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 6, 'lesson', 'On a, par exemple', '𝑔
(
−
7
)
	
=
(
−
7
)
2
=
49


𝑔
(
2
)
	
=
2
2
=
4


𝑔
(
11
)
	
=
11
2
=
121
g(−7)
g(2)
g(11)
	​

=(−7)
2
=49
=2
2
=4
=11
2
=121
	​', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 7, 'lesson', 'Antécédent d’un nombre', 'On considère une fonction 
𝑓
f, et un nombre 
𝑥
x dont l’image par 
𝑓
f est le nombre 
𝑦
y.

𝑥
x est appelé antécédent de 
𝑦
y par la fonction 
𝑓
f.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 8, 'lesson', 'Par une fonction', 'un nombre a une unique image ;
mais un nombre peut avoir plusieurs antécédents !', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 9, 'lesson', 'Exemple', 'On considère la fonction 
𝑓
:
𝑥
↦
5
𝑥
f:x↦5x.

𝑓
(
−
12
)
=
5
×
(
−
12
)
=
−
60
f(−12)=5×(−12)=−60 :
−
60
−60 est l’image de 
−
12
−12 par la fonction 
𝑓
f ;
−
12
−12 est un antécédent de 
−
60
−60 par la fonction 
𝑓
f.
𝑓
(
12
)
=
5
×
12
=
60
f(12)=5×12=60 :
60
60 est l’image de 
12
12 par la fonction 
𝑓
f ;
12
12 est un antécédent de 
60
60 par la fonction 
𝑓
f.

On considère maintenant la fonction 
𝑔
:
𝑥
↦
𝑥
2
g:x↦x
2
.

𝑔
(
−
9
)
=
(
−
9
)
2
=
81
g(−9)=(−9)
2
=81 :
81
81 est l’image de 
−
9
−9 par la fonction 
𝑔
g ;
−
9
−9 est un antécédent de 
81
81 par la fonction 
𝑔
g.
𝑔
(
9
)
=
9
2
=
81
g(9)=9
2
=81 :
81
81 est l’image de 
9
9 par la fonction 
𝑔
g ;
9
9 est un antécédent de 
81
81 par la fonction 
𝑔
g.

On voit ainsi que 
81
81 a pour antécédents, par la fonction 
𝑔
g, deux nombres différents : 
−
9
−9 et 
9
9.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 10, 'lesson', 'À retenir', 'Pour déterminer le ou les antécédents d’un nombre 
𝑎
a par une fonction 
𝑓
f, on peut utiliser l’expression algébrique qui définit la fonction 
𝑓
f.

Il s’agit alors de résoudre l’équation 
𝑓
(
𝑥
)
=
𝑎
f(x)=a.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 11, 'lesson', 'On considère toujours les fonctions', '𝑓
f, définie par 
𝑓
(
𝑥
)
=
5
𝑥
f(x)=5x ;
𝑔
g, définie par 
𝑔
(
𝑥
)
=
𝑥
2
g(x)=x
2
.

Quels sont le ou les antécédents de 
64
64 par les fonctions 
𝑓
f et 
𝑔
g ?

Par la fonction 
𝑓
:
𝑥
↦
5
𝑥
f:x↦5x

Un antécédent de 
64
64 est un nombre qui a pour image 
64
64 par la fonction 
𝑓
f.
On cherche donc 
𝑥
x tel que 
𝑓
(
𝑥
)
=
64
f(x)=64, autrement dit, tel que :

5
𝑥
=
64
5x=64', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 12, 'lesson', 'Il s’agit alors de résoudre cette équation', '5
𝑥
	
=
64


5
𝑥
5
	
=
64
5


𝑥
	
=
12
,
8
5x
5
5x
	​

x
	​

=64
=
5
64
	​

=12,8
	​


On vérifie le résultat, en calculant l’image de 
12
,
8
12,8 par 
𝑓
f :

𝑓
(
12
,
8
)
=
5
×
12
,
8
=
64
f(12,8)=5×12,8=64

On trouve bien 
64
64.

12
,
8
12,8 est donc un antécédent de 
64
64 par la fonction 
𝑓
f.

Remarque :
On sait que 
12
,
8
12,8 est la seule solution de l’équation 
5
𝑥
=
64
5x=64. Donc 
12
,
8
12,8 est le seul antécédent de 
64
64 par la fonction 
𝑓
f.

Par la fonction 
𝑔
:
𝑥
↦
𝑥
2
g:x↦x
2

Ici, on cherche donc 
𝑥
x tel que 
𝑔
(
𝑥
)
=
64
g(x)=64, c’est-à-dire tel que :

𝑥
2
=
64
x
2
=64

En reconnaissant en 
64
64 le carré (parfait) de 
8
8, on trouve comme solutions :

64
	
=
8


−
64
	
=
−
8
64
	​

−
64
	​

	​

=8
=−8
	​


On vérifie les résultats, en calculant les images de 
−
8
−8 et 
8
8 par la fonction 
𝑔
g :

𝑔
(
−
8
)
	
=
(
−
8
)
2
=
64


𝑔
(
8
)
	
=
8
2
=
64
g(−8)
g(8)
	​

=(−8)
2
=64
=8
2
=64
	​


On trouve bien 
64
64 dans les deux cas.

−
8
−8 et 
8
8 sont des antécédents de 
64
64 par la fonction 
𝑔
g.

Remarque :
On sait que 
−
8
−8 et 
8
8 sont les seules solutions de l’équation 
𝑥
2
=
64
x
2
=64. Donc 
−
8
−8 et 
8
8 sont les seuls antécédents de 
64
64 par la fonction 
𝑔
g.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 13, 'lesson', 'Pour décrire une fonction, on peut rassembler les antécédents et images dans un tableau', 'sur la première ligne du tableau, on écrit les antécédents, classés par ordre croissant ;
sur la deuxième ligne, on écrit les images correspondantes par la fonction.
Ce tableau est appelé tableau de valeurs.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 14, 'lesson', 'Exemple', 'Soit 
𝑓
f la fonction définie par 
𝑓
(
𝑥
)
=
5
𝑥
f(x)=5x.
On donne dans le tableau de valeurs ci-dessous quelques antécédents et leurs images respectives (on reprend les valeurs déterminées dans les parties précédentes) :

𝑥
x

	

−
12
−12

	

−
3
−3

	

0
0

	

1
1

	

8
8

	

12
12

	

12
,
8
12,8




𝑓
(
𝑥
)
f(x)

	

−
60
−60

	

−
15
−15

	

0
0

	

5
5

	

40
40

	

60
60

	

64
64

De la même façon, pour la fonction 
𝑔
g définie par 
𝑔
(
𝑥
)
=
𝑥
2
g(x)=x
2
 :

𝑥
x

	

−
9
−9

	

−
8
−8

	

−
7
−7

	

2
2

	

8
8

	

9
9

	

11
11




𝑔
(
𝑥
)
g(x)

	

81
81

	

64
64

	

49
49

	

4
4

	

64
64

	

81
81

	

121
121', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 15, 'lesson', 'À retenir', 'Un tableau de valeurs permet de trouver très facilement l’image ou un antécédent par une fonction d’un nombre, car ils se lisent directement dans le tableau.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 16, 'lesson', 'Exemple', 'On trouve ainsi très facilement, par exemple, l’image de 
−
3
−3 ou de 
12
,
8
12,8 par la fonction 
𝑓
f :

𝑥
x

	

−
12
−12

	

−
3
−3

	

0
0

	

1
1

	

8
8

	

12
12

	

12
,
8
12,8




𝑓
(
𝑥
)
f(x)

	

−
60
−60

	

−
15
−15

	

0
0

	

5
5

	

40
40

	

60
60

	

64
64

Par la fonction 
𝑓
f :

l’image de 
−
3
−3 est 
−
15
−15 ;
l’image de 
12
,
8
12,8 est 
64
64.

Le tableau de valeurs de la fonction 
𝑔
g permet aussi de trouver très vite, par exemple, deux antécédents de 
64
64 :

𝑥
x

	

−
9
−9

	

−
8
−8

	

−
7
−7

	

2
2

	

8
8

	

9
9

	

11
11




𝑔
(
𝑥
)
g(x)

	

81
81

	

64
64

	

49
49

	

4
4

	

64
64

	

81
81

	

121
121

D’après le tableau, par la fonction 
𝑔
g, 
64
64 a pour antécédents 
−
8
−8 et 
8
8.

Le désavantage principal d’un tableau de valeurs est qu’il n’y a qu’un nombre limité d’antécédents et d’images correspondantes.
En outre, déterminer un ou plusieurs antécédents d’un nombre à l’aide d’un tableau de valeurs ne permet pas de savoir s’il y en a d’autres ou non, contrairement à la méthode algébrique que nous avons vue plus haut.

Dans la pratique, un tableau de valeurs va nous aider à représenter graphiquement une fonction, comme nous allons le voir dans la partie suivante.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 17, 'lesson', 'Représentation graphique d’une fonction', 'Dans un repère du plan, la représentation graphique d’une fonction 
𝑓
f est l’ensemble des points de coordonnées 
(
𝑥
 
;
𝑓
(
𝑥
)
)
(x ;f(x)).

On appelle cette représentation graphique courbe représentative de la fonction, qu’on note souvent 
𝐶
𝑓
C
f
	​

.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 18, 'lesson', 'Sur la représentation graphique d’une fonction', 'on lit les antécédents sur l’axe des abscisses ;
on lit les images sur l’axe des ordonnées.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 19, 'lesson', 'À retenir', 'Pour représenter graphiquement une fonction 
𝑓
f :

on calcule les images par 
𝑓
f d’un certain nombre de valeurs ;
on donne les résultats dans un tableau de valeurs ;
on place les points correspondants aux valeurs du tableau, en lisant, pour chaque point :
l’abscisse sur la première ligne,
l’ordonnée correspondante sur la seconde ligne ;
on trace ensuite la courbe passant par tous ces points.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 20, 'lesson', 'Astuce', 'Plus on aura de valeurs dans notre tableau, plus on aura de points à placer, plus le tracé sera précis.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 21, 'lesson', 'Exemple', 'On considère la fonction 
𝑓
f définie par 
𝑓
(
𝑥
)
=
(
𝑥
+
2
)
(
1
−
𝑥
)
f(x)=(x+2)(1−x), que l’on veut représenter graphiquement dans un repère.

On calcule l’image de quelques valeurs de 
𝑥
x par la fonction 
𝑓
f, par exemple de :

𝑥
x

	

−
2
,
5
−2,5

	

−
2
−2

	

−
1
,
5
−1,5

	

−
1
−1

	

−
0
,
5
−0,5

	

0
0

	

0
,
5
0,5

	

1
1

	

1
,
5
1,5

Pour calculer ces images, comme on l’a dit dans la première partie, on remplace dans l’expression algébrique qui définit la fonction (
𝑓
(
𝑥
)
=
(
𝑥
+
2
)
(
1
−
𝑥
)
f(x)=(x+2)(1−x)) par la valeur qui nous intéresse.
On indique les résultats dans un tableau de valeurs, qui nous donnera ainsi les coordonnées des points à placer :

𝑥
x

	

−
2
,
5
−2,5

	

−
2
−2

	

−
1
,
5
−1,5

	

−
1
−1

	

−
0
,
5
−0,5

	

0
0

	

0
,
5
0,5

	

1
1

	

1
,
5
1,5




𝑓
(
𝑥
)
f(x)

	

−
1
,
75
−1,75

	

0
0

	

1
,
25
1,25

	

2
2

	

2
,
25
2,25

	

2
2

	

1
,
25
1,25

	

0
0

	

−
1
,
75
−1,75', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 22, 'lesson', 'Point', '𝐴
A

	

𝐵
B

	

𝐶
C

	

𝐷
D

	

𝐸
E

	

𝐹
F

	

𝐺
G

	

𝐻
H

	

𝐼
I

On place maintenant les points dans le repère. Pour cela, on se sert du tableau de valeurs pour avoir les coordonnées. Par exemple :

le point 
𝐴
A a pour coordonnées 
(
−
2
,
5
 
;
−
1
,
75
)
(−2,5 ;−1,75) ;
le point 
𝐺
G a pour coordonnées 
(
0
,
5
 
;
1
,
25
)
(0,5 ;1,25).', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 23, 'lesson', 'Représentation graphique de la fonction f (étape 1)', 'On joint ensuite les points, sans utiliser la règle, pour former la courbe représentative 
𝐶
𝑓
C
f
	​

 :', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 24, 'lesson', 'Méthode : Comment déterminer graphiquement l’image d’un nombre', 'On considère une fonction 
𝑓
f dont la représentation graphique dans un repère est donnée.
On cherche à déterminer l’image d’un nombre 
𝑎
a.

Sur l’axe des abscisses, on place le point d’abscisse 
𝑎
a.
On trace la droite parallèle à l’axe des ordonnées qui passe par ce point.
On lit l’ordonnée du point d’intersection de cette droite avec la courbe.
La valeur de cette ordonnée est l’image de 
𝑎
a.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 25, 'lesson', 'Méthode : Comment déterminer graphiquement un antécédent', 'On considère une fonction 
𝑓
f dont la représentation graphique dans un repère est donnée.
On cherche à déterminer un (ou plusieurs) antécédent(s) d’un nombre 
𝑏
b.

Sur l’axe des ordonnées, on place le point d’ordonnée 
𝑏
b.
On trace la droite parallèle à l’axe des abscisses qui passe par ce point.
Cette droite coupe la courbe représentative de la fonction en un ou plusieurs points.
Les abscisses de ces points d’intersection sont des antécédents de 
𝑏
b par la fonction 
𝑓
f.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 26, 'lesson', 'Attention', 'La précision des résultats trouvés graphiquement dépendra de la précision que permet la représentation graphique donnée.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 27, 'lesson', 'Exemple', 'On considère la fonction 
𝑔
g dont on donne ci-dessous la représentation graphique dans un repère orthogonal :', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 28, 'lesson', 'On cherche à déterminer graphiquement', 'l’image de 
0
,
5
0,5 par la fonction 
𝑔
g
un antécédent, ou des antécédents le cas échéant, de 
−
2
−2.

On place donc sur l’axe des abscisses le point d’abscisse 
0
,
5
0,5, et on trace la droite parallèle à l’axe des ordonnées passant par ce point.

L’ordonnée de son point d’intersection avec la courbe donne l’image de 
0
,
5
0,5 par 
𝑔
g.

On place ensuite sur l’axe des ordonnées le point d’ordonnée 
−
2
−2, et on trace la droite parallèle à l’axe des abscisses passant par ce point.

L’abscisse de chaque point d’intersection avec la courbe donne un antécédent de 
−
2
−2.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 29, 'lesson', 'Par lecture graphique', 'l’image de 
0
,
5
0,5 est 
1
,
25
1,25 ;
des antécédents de 
−
2
−2 sont environ 
−
0
,
8
−0,8 ; 
1
,
7
1,7 ; 
2
,
6
2,6.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 30, 'lesson', 'Astuce', 'Allons un peu plus loin.
La fonction 
𝑔
g représentée ci-dessus est en réalité définie par :

𝑔
(
𝑥
)
=
𝑥
3
−
3
,
5
𝑥
2
+
𝑥
+
1
,
5
g(x)=x
3
−3,5x
2
+x+1,5', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 31, 'lesson', 'Et on considère l’équation', '𝑥
3
−
3
,
5
𝑥
2
+
𝑥
+
1
,
5
=
0
x
3
−3,5x
2
+x+1,5=0

En l’état, on ne sait pas (encore) la résoudre algébriquement. On peut toutefois en déterminer graphiquement trois solutions, en se servant de la représentation donnée ci-dessus.

En effet, résoudre 
𝑥
3
−
3
,
5
𝑥
2
+
𝑥
+
1
,
5
=
0
x
3
−3,5x
2
+x+1,5=0 revient à résoudre 
𝑔
(
𝑥
)
=
0
g(x)=0. C’est-à-dire à trouver les antécédents de 
0
0. Ou encore à donner les abscisses des points d’intersection de la courbe représentative de 
𝑔
g et de l’axe des abscisses.

La représentation graphique nous permet d’en déterminer trois : 
−
0
,
5
−0,5 ; 
1
1 ; 
3
3.

Nous avons découvert de manière plus formelle les fonctions. Il est essentiel de bien les comprendre, de savoir les définir, les représenter et les exploiter. En effet, elles servent à modéliser de très nombreux phénomènes au quotidien, en économie, par exemple, pour calculer un bénéfice.
Elles sont ainsi au cœur d’un domaine très important des mathématiques, l’analyse, qui s’intéresse à l’étude des fonctions et qui aura une grande place dans votre formation, au lycée notamment.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 32, 'quiz', 'Qu''est-ce que : Fonction ?', 'Qu''est-ce que : Fonction ?', '[{"id":"opt-0","text":"Une fonction, souvent notée  𝑓 f, est un processus (une machine) qui, à un nombre  𝑥 x donné au départ, associe un unique nombre, appelé image de  𝑥 x par la fonction  𝑓 f et noté  𝑓 ( 𝑥 ) f(x) (on lit «  𝑓 f de  𝑥 x »).","isCorrect":true},{"id":"opt-1","text":"𝑔 ( − 7 ) \t = ( − 7 ) 2 = 49   𝑔 ( 2 ) \t = 2 2 = 4   𝑔 ( 11 ) \t = 11 2 = 121 g(−7) g(2) g(11) \t​  =(−7) 2 =49 =2 2 =4 =11 2 =121 \t​","isCorrect":false},{"id":"opt-2","text":"On considère une fonction  𝑓 f, et un nombre  𝑥 x dont l’image par  𝑓 f est le nombre  𝑦 y.  𝑥 x est appelé antécédent de  𝑦 y par la fonction  𝑓 f.","isCorrect":false},{"id":"opt-3","text":"un nombre a une unique image ; mais un nombre peut avoir plusieurs antécédents !","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 33, 'quiz', 'Qu''est-ce que : On a, par exemple ?', 'Qu''est-ce que : On a, par exemple ?', '[{"id":"opt-0","text":"𝑔 ( − 7 ) \t = ( − 7 ) 2 = 49   𝑔 ( 2 ) \t = 2 2 = 4   𝑔 ( 11 ) \t = 11 2 = 121 g(−7) g(2) g(11) \t​  =(−7) 2 =49 =2 2 =4 =11 2 =121 \t​","isCorrect":true},{"id":"opt-1","text":"Une fonction, souvent notée  𝑓 f, est un processus (une machine) qui, à un nombre  𝑥 x donné au départ, associe un unique nombre, appelé image de  𝑥 x par la fonction  𝑓 f et noté  𝑓 ( 𝑥 ) f(x) (on lit «  𝑓 f de  𝑥 x »).","isCorrect":false},{"id":"opt-2","text":"On considère une fonction  𝑓 f, et un nombre  𝑥 x dont l’image par  𝑓 f est le nombre  𝑦 y.  𝑥 x est appelé antécédent de  𝑦 y par la fonction  𝑓 f.","isCorrect":false},{"id":"opt-3","text":"un nombre a une unique image ; mais un nombre peut avoir plusieurs antécédents !","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 34, 'quiz', 'Qu''est-ce que : Antécédent d’un nombre ?', 'Qu''est-ce que : Antécédent d’un nombre ?', '[{"id":"opt-0","text":"On considère une fonction  𝑓 f, et un nombre  𝑥 x dont l’image par  𝑓 f est le nombre  𝑦 y.  𝑥 x est appelé antécédent de  𝑦 y par la fonction  𝑓 f.","isCorrect":true},{"id":"opt-1","text":"Une fonction, souvent notée  𝑓 f, est un processus (une machine) qui, à un nombre  𝑥 x donné au départ, associe un unique nombre, appelé image de  𝑥 x par la fonction  𝑓 f et noté  𝑓 ( 𝑥 ) f(x) (on lit «  𝑓 f de  𝑥 x »).","isCorrect":false},{"id":"opt-2","text":"𝑔 ( − 7 ) \t = ( − 7 ) 2 = 49   𝑔 ( 2 ) \t = 2 2 = 4   𝑔 ( 11 ) \t = 11 2 = 121 g(−7) g(2) g(11) \t​  =(−7) 2 =49 =2 2 =4 =11 2 =121 \t​","isCorrect":false},{"id":"opt-3","text":"un nombre a une unique image ; mais un nombre peut avoir plusieurs antécédents !","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 35, 'quiz', 'Qu''est-ce que : Par une fonction ?', 'Qu''est-ce que : Par une fonction ?', '[{"id":"opt-0","text":"un nombre a une unique image ; mais un nombre peut avoir plusieurs antécédents !","isCorrect":true},{"id":"opt-1","text":"Une fonction, souvent notée  𝑓 f, est un processus (une machine) qui, à un nombre  𝑥 x donné au départ, associe un unique nombre, appelé image de  𝑥 x par la fonction  𝑓 f et noté  𝑓 ( 𝑥 ) f(x) (on lit «  𝑓 f de  𝑥 x »).","isCorrect":false},{"id":"opt-2","text":"𝑔 ( − 7 ) \t = ( − 7 ) 2 = 49   𝑔 ( 2 ) \t = 2 2 = 4   𝑔 ( 11 ) \t = 11 2 = 121 g(−7) g(2) g(11) \t​  =(−7) 2 =49 =2 2 =4 =11 2 =121 \t​","isCorrect":false},{"id":"opt-3","text":"On considère une fonction  𝑓 f, et un nombre  𝑥 x dont l’image par  𝑓 f est le nombre  𝑦 y.  𝑥 x est appelé antécédent de  𝑦 y par la fonction  𝑓 f.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 36, 'quiz', 'Qu''est-ce que : On considère toujours les fonctions ?', 'Qu''est-ce que : On considère toujours les fonctions ?', '[{"id":"opt-0","text":"𝑓 f, définie par  𝑓 ( 𝑥 ) = 5 𝑥 f(x)=5x ; 𝑔 g, définie par  𝑔 ( 𝑥 ) = 𝑥 2 g(x)=x 2 .","isCorrect":true},{"id":"opt-1","text":"Une fonction, souvent notée  𝑓 f, est un processus (une machine) qui, à un nombre  𝑥 x donné au départ, associe un unique nombre, appelé image de  𝑥 x par la fonction  𝑓 f et noté  𝑓 ( 𝑥 ) f(x) (on lit «  𝑓 f de  𝑥 x »).","isCorrect":false},{"id":"opt-2","text":"𝑔 ( − 7 ) \t = ( − 7 ) 2 = 49   𝑔 ( 2 ) \t = 2 2 = 4   𝑔 ( 11 ) \t = 11 2 = 121 g(−7) g(2) g(11) \t​  =(−7) 2 =49 =2 2 =4 =11 2 =121 \t​","isCorrect":false},{"id":"opt-3","text":"On considère une fonction  𝑓 f, et un nombre  𝑥 x dont l’image par  𝑓 f est le nombre  𝑦 y.  𝑥 x est appelé antécédent de  𝑦 y par la fonction  𝑓 f.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 37, 'quiz', 'Qu''est-ce que : Il s’agit alors de résoudre cette équation ?', 'Qu''est-ce que : Il s’agit alors de résoudre cette équation ?', '[{"id":"opt-0","text":"5 𝑥 \t = 64   5 𝑥 5 \t = 64 5   𝑥 \t = 12 , 8 5x 5 5x \t​  x \t​  =64 = 5 64 \t​  =12,8 \t​   On vérifie le résultat, en calculant l’image de  12 , 8 12,8 par  𝑓 f :  𝑓 ( 12 , 8 ) = 5 × 12 , 8 = 64 f(12,8)=5×12,8=64  On trouve bien  64 64.","isCorrect":true},{"id":"opt-1","text":"Une fonction, souvent notée  𝑓 f, est un processus (une machine) qui, à un nombre  𝑥 x donné au départ, associe un unique nombre, appelé image de  𝑥 x par la fonction  𝑓 f et noté  𝑓 ( 𝑥 ) f(x) (on lit «  𝑓 f de  𝑥 x »).","isCorrect":false},{"id":"opt-2","text":"𝑔 ( − 7 ) \t = ( − 7 ) 2 = 49   𝑔 ( 2 ) \t = 2 2 = 4   𝑔 ( 11 ) \t = 11 2 = 121 g(−7) g(2) g(11) \t​  =(−7) 2 =49 =2 2 =4 =11 2 =121 \t​","isCorrect":false},{"id":"opt-3","text":"On considère une fonction  𝑓 f, et un nombre  𝑥 x dont l’image par  𝑓 f est le nombre  𝑦 y.  𝑥 x est appelé antécédent de  𝑦 y par la fonction  𝑓 f.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 38, 'quiz', 'Qu''est-ce que : Représentation graphique d’une fonction ?', 'Qu''est-ce que : Représentation graphique d’une fonction ?', '[{"id":"opt-0","text":"Dans un repère du plan, la représentation graphique d’une fonction  𝑓 f est l’ensemble des points de coordonnées  ( 𝑥   ; 𝑓 ( 𝑥 ) ) (x ;f(x)).","isCorrect":true},{"id":"opt-1","text":"Une fonction, souvent notée  𝑓 f, est un processus (une machine) qui, à un nombre  𝑥 x donné au départ, associe un unique nombre, appelé image de  𝑥 x par la fonction  𝑓 f et noté  𝑓 ( 𝑥 ) f(x) (on lit «  𝑓 f de  𝑥 x »).","isCorrect":false},{"id":"opt-2","text":"𝑔 ( − 7 ) \t = ( − 7 ) 2 = 49   𝑔 ( 2 ) \t = 2 2 = 4   𝑔 ( 11 ) \t = 11 2 = 121 g(−7) g(2) g(11) \t​  =(−7) 2 =49 =2 2 =4 =11 2 =121 \t​","isCorrect":false},{"id":"opt-3","text":"On considère une fonction  𝑓 f, et un nombre  𝑥 x dont l’image par  𝑓 f est le nombre  𝑦 y.  𝑥 x est appelé antécédent de  𝑦 y par la fonction  𝑓 f.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 39, 'quiz', 'Qu''est-ce que : Sur la représentation graphique d’une fonction ?', 'Qu''est-ce que : Sur la représentation graphique d’une fonction ?', '[{"id":"opt-0","text":"on lit les antécédents sur l’axe des abscisses ; on lit les images sur l’axe des ordonnées.","isCorrect":true},{"id":"opt-1","text":"Une fonction, souvent notée  𝑓 f, est un processus (une machine) qui, à un nombre  𝑥 x donné au départ, associe un unique nombre, appelé image de  𝑥 x par la fonction  𝑓 f et noté  𝑓 ( 𝑥 ) f(x) (on lit «  𝑓 f de  𝑥 x »).","isCorrect":false},{"id":"opt-2","text":"𝑔 ( − 7 ) \t = ( − 7 ) 2 = 49   𝑔 ( 2 ) \t = 2 2 = 4   𝑔 ( 11 ) \t = 11 2 = 121 g(−7) g(2) g(11) \t​  =(−7) 2 =49 =2 2 =4 =11 2 =121 \t​","isCorrect":false},{"id":"opt-3","text":"On considère une fonction  𝑓 f, et un nombre  𝑥 x dont l’image par  𝑓 f est le nombre  𝑦 y.  𝑥 x est appelé antécédent de  𝑦 y par la fonction  𝑓 f.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 40, 'quiz', 'Qu''est-ce que : Point ?', 'Qu''est-ce que : Point ?', '[{"id":"opt-0","text":"𝐴 A  \t  𝐵 B  \t  𝐶 C  \t  𝐷 D  \t  𝐸 E  \t  𝐹 F  \t  𝐺 G  \t  𝐻 H  \t  𝐼 I  On place maintenant les points dans le repère.","isCorrect":true},{"id":"opt-1","text":"Une fonction, souvent notée  𝑓 f, est un processus (une machine) qui, à un nombre  𝑥 x donné au départ, associe un unique nombre, appelé image de  𝑥 x par la fonction  𝑓 f et noté  𝑓 ( 𝑥 ) f(x) (on lit «  𝑓 f de  𝑥 x »).","isCorrect":false},{"id":"opt-2","text":"𝑔 ( − 7 ) \t = ( − 7 ) 2 = 49   𝑔 ( 2 ) \t = 2 2 = 4   𝑔 ( 11 ) \t = 11 2 = 121 g(−7) g(2) g(11) \t​  =(−7) 2 =49 =2 2 =4 =11 2 =121 \t​","isCorrect":false},{"id":"opt-3","text":"On considère une fonction  𝑓 f, et un nombre  𝑥 x dont l’image par  𝑓 f est le nombre  𝑦 y.  𝑥 x est appelé antécédent de  𝑦 y par la fonction  𝑓 f.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', 41, 'quiz', 'Qu''est-ce que : Représentation graphique de la fonction f (étape 1) ?', 'Qu''est-ce que : Représentation graphique de la fonction f (étape 1) ?', '[{"id":"opt-0","text":"On joint ensuite les points, sans utiliser la règle, pour former la courbe représentative  𝐶 𝑓 C f \t​   :","isCorrect":true},{"id":"opt-1","text":"Une fonction, souvent notée  𝑓 f, est un processus (une machine) qui, à un nombre  𝑥 x donné au départ, associe un unique nombre, appelé image de  𝑥 x par la fonction  𝑓 f et noté  𝑓 ( 𝑥 ) f(x) (on lit «  𝑓 f de  𝑥 x »).","isCorrect":false},{"id":"opt-2","text":"𝑔 ( − 7 ) \t = ( − 7 ) 2 = 49   𝑔 ( 2 ) \t = 2 2 = 4   𝑔 ( 11 ) \t = 11 2 = 121 g(−7) g(2) g(11) \t​  =(−7) 2 =49 =2 2 =4 =11 2 =121 \t​","isCorrect":false},{"id":"opt-3","text":"On considère une fonction  𝑓 f, et un nombre  𝑥 x dont l’image par  𝑓 f est le nombre  𝑦 y.  𝑥 x est appelé antécédent de  𝑦 y par la fonction  𝑓 f.","isCorrect":false}]', NULL, NULL, 50);

INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', '2026-01-17', 1, 0, 5)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', '2026-01-18', 2, 6, 11)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', '2026-01-19', 3, 12, 17)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', '2026-01-20', 4, 18, 23)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', '2026-01-21', 5, 24, 29)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', '2026-01-22', 6, 30, 35)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '9a3f5c4a-c9e2-48d0-84e3-a82ee1e3efd3', '2026-01-23', 7, 36, 41)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;

-- Course: Construire une argumentation
INSERT INTO public.courses (id, user_id, title, description, category, level, estimated_minutes, icon, total_xp, is_published, duration_days, daily_cards_count)
VALUES ('1b2884b9-1a13-4929-b0df-04f8351d7101', '00000000-0000-0000-0000-000000000001', 'Construire une argumentation', 'Cours de Français : Construire une argumentation', 'Français', '3eme', 20, '📚', 640, true, 6, 6);

INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('1b2884b9-1a13-4929-b0df-04f8351d7101', 0, 'lesson', 'Introduction', 'En 3e, les collégiens développent des qualités d’écriture nouvelles, notamment pour construire une bonne argumentation. Nous verrons d’abord ce que c’est que l’argumentation à proprement parler, avant de voir son utilité dans l’épreuve de français. Nous verrons enfin comment bien traiter la partie argumentative du brevet de français incluse dans la rédaction.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('1b2884b9-1a13-4929-b0df-04f8351d7101', 1, 'lesson', 'Argumentation', 'L’argumentation, c’est la construction de discours et de raisonnements structurés, qui s’appuient sur une démonstration logique. L’argumentation sert à convaincre quelqu’un en défendant ou en réfutant une thèse.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('1b2884b9-1a13-4929-b0df-04f8351d7101', 2, 'lesson', 'Argumenter, c’est l’art de savoir dire les choses afin de convaincre ou persuader son destinataire.', 'La définition précédente parle de « défendre une thèse ». Le mot thèse est en fait synonyme d’idée : lorsqu’on défend une thèse, on tente de faire admettre à son auditoire qu’une idée est la bonne.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('1b2884b9-1a13-4929-b0df-04f8351d7101', 3, 'lesson', 'L’argumentation peut se faire de deux façons', 'on peut convaincre : en faisant appel à la raison et au bon sens de son auditoire ;
on peut persuader : en suscitant de l’émotion chez l’auditoire et en jouant de ses sentiments.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('1b2884b9-1a13-4929-b0df-04f8351d7101', 4, 'lesson', 'La compréhension de texte', 'La première partie du brevet, qui occupe une bonne heure du temps total de l’épreuve, se compose d’un texte et de plusieurs questions de compréhension de texte. Il ne faut pas répondre de façon monosyllabique, avec un simple « oui » ou « non ». Pour bien formuler la réponse, il faut effectuer un vrai travail de fond et étayer les arguments par des exemples précis, c’est-à-dire des citations tirées du texte.

Puisqu’il faut argumenter sa réponse, les questions de compréhension sont bel et bien un exercice d’argumentation.
Le sujet de rédaction

L’épreuve se compose de deux sujets différents entre lesquels il faut choisir. Un sujet d’imagination, et un sujet de réflexion.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('1b2884b9-1a13-4929-b0df-04f8351d7101', 5, 'lesson', 'Exemple', 'Quitter sa terre natale peut se révéler une grande aventure. Quel intérêt trouverais-tu à partir t’installer à l’étranger ?
Selon toi, travaille-t-on uniquement pour gagner de l’argent ?
À ton avis, la poésie, ainsi que les autres formes d’art, peuvent-elles permettre à l’homme de résister et d’appeler à la révolte ?

Les sujets sont extrêmement variés. Il s’agit à chaque fois d’une réflexion que l’on demande de conduire, de façon organisée et méthodique. C’est d’ailleurs ce que précisera très souvent la petite consigne accompagnant ces questions.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('1b2884b9-1a13-4929-b0df-04f8351d7101', 6, 'lesson', 'Selon toi, travaille-t-on uniquement pour gagner de l’argent ?', 'Au brouillon, il va falloir réfléchir et chercher différentes idées qui peuvent s’appliquer à cette question.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('1b2884b9-1a13-4929-b0df-04f8351d7101', 7, 'lesson', 'À retenir', 'Il faut travailler sa réflexion au brouillon car un travail préalable est obligatoire pour ce type d’exercice.
Il faut rechercher la thèse que l’on souhaite défendre, c’est-à-dire l’idée générale de l’argumentaire. Cette thèse devra être démontrée par plusieurs arguments.
Enfin, ces arguments devront être illustrés par des exemples concrets, comme des citations de texte ou des situations réelles.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('1b2884b9-1a13-4929-b0df-04f8351d7101', 8, 'lesson', 'Exemple', 'Il faudra sans doute essayer de définir ce qu’est le travail. En cherchant un peu, on se rend compte que c’est différent de ce qu’on appelle les loisirs. Travailler serait donc à l’opposé de la notion de plaisir.
Avec quelques connaissances en latin, ou avec un dictionnaire, on se rend compte que le mot « travail » vient du mot latin tripalium, qui est à la base un instrument de torture. Le travail serait donc associé à la souffrance.
Élargissons maintenant le problème au niveau de la société : pourquoi travaille-t-on ? Dans la société à laquelle nous appartenons, travailler est un prérequis essentiel au vivre ensemble. On travaille pour contribuer au fonctionnement de la société, et en retour celle-ci nous gratifie de nombreux avantages.
On arrive alors à la notion d’argent, moteur de notre société. À ce stade, il faut essayer de nuancer le propos général, en s’interrogeant sur les possibles dérives de ce système. On peut citer des exemples concrets : certaines personnes doivent acheter une voiture pour pouvoir travailler, et travaillent ensuite uniquement pour rembourser cette voiture. On peut aussi s’interroger sur les métiers en rapport direct avec l’argent, comme les banquiers, ou les traders. Enfin, que dire alors du problème du chômage, qui nous touche tant en cette période de crise ?

Il y a donc toujours de nombreuses choses à dire sur n’importe quel sujet, pourvu que l’on prenne le temps d’y réfléchir.

Sur la copie, après avoir réfléchi au brouillon, il faut espacer ses idées en plusieurs paragraphes, en marquant des alinéas à chacun d’entre eux. Il faut s’efforcer, pour chaque paragraphe, d’apporter des exemples concrets, et de soigner le style d’écriture. Il faut faire attention aux transitions, en utilisant des mots comme «  de plus », « de surcroît », « en outre », « on pourrait ajouter à cela », etc.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('1b2884b9-1a13-4929-b0df-04f8351d7101', 9, 'lesson', 'À retenir', 'L’ argumentation doit paraître la plus fluide possible : c’est un raisonnement qui doit couler tout seul, pour finalement arriver à la réponse dans la conclusion.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('1b2884b9-1a13-4929-b0df-04f8351d7101', 10, 'lesson', 'La juxtaposition : l’absence de connecteur logique', 'La façon la plus simple de donner des idées est de les juxtaposer, c’est-à-dire de les donner les unes à la suite des autres, sans connecteur logique en transition. Seule reste la ponctuation, et notamment les deux points qui indiquent qu’une explication va suivre le propos.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('1b2884b9-1a13-4929-b0df-04f8351d7101', 11, 'lesson', 'Exemple', 'Rien ne sert de courir : il faut partir à point.
L’ordre des idées : d’abord, ensuite, enfin, d’une part, d’autre part, premièrement, deuxièmement…

Dans un paragraphe rédigé, il est important de jalonner la progression avec des indices d’ordre. Cette façon de faire aide le lecteur à suivre car il sait où en est la réflexion, à quelle étape.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('1b2884b9-1a13-4929-b0df-04f8351d7101', 12, 'lesson', 'Exemple', 'Tu ne devrais pas demander à Maria de venir. Pour commencer, elle marche bien plus lentement que nous. Ensuite, si nous la distançons, elle ne saura pas retrouver son chemin et pour finir, elle est mal remise de sa dernière entorse !', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('1b2884b9-1a13-4929-b0df-04f8351d7101', 13, 'lesson', 'La cause : car, parce que, en effet, puisque, en raison de, grâce à, par, de sorte que…', 'Pour articuler un argument et un exemple, l’emploi de la cause est particulièrement fréquent. Cette idée est juste parce que ceci ou en raison de cela…', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('1b2884b9-1a13-4929-b0df-04f8351d7101', 14, 'lesson', 'Exemple', 'Il a accepté un poste que tout le monde a refusé, c’est pourquoi il est mal vu.
Ils se connaissaient depuis six ans et elle est tombée enceinte, alors ils ont emmenagé ensemble.
L’addition : et, or, de plus, en outre, de surcroît…', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('1b2884b9-1a13-4929-b0df-04f8351d7101', 15, 'lesson', 'Exemple', 'L’emprisonnement des toxicomanes revendeurs de drogue n’est pas une solution : ils restent des années en prison sans être traités, or la drogue circule en milieu carcéral. D’ailleurs, on n’envoie jamais derrière les barreaux que les petits revendeurs et les vrais criminels restent dehors. En outre, les prisonniers recommencent souvent le trafic une fois sortis et de surcroît, sous les yeux des jeunes de leur quartier, pour qui ils deviennent des modèles avec l’argent qu’ils gagnent de la sorte !', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('1b2884b9-1a13-4929-b0df-04f8351d7101', 16, 'lesson', 'Exemple', 'Ni le système judiciaire ni les prisons ne peuvent solutionner cette mauvaise influence des trafiquants sur la jeunesse. Il ne faut en aucun cas augmenter les effectifs de police mais plutôt donner des moyens aux écoles et associations de quartier.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('1b2884b9-1a13-4929-b0df-04f8351d7101', 17, 'lesson', 'Nuancer ses idées', 'Donner des idées avec les procédés décrits précédemment est utile, mais si l’on veut montrer qu’on maîtrise vraiment son discours, il faut apprendre à le nuancer.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('1b2884b9-1a13-4929-b0df-04f8351d7101', 18, 'lesson', 'Exemple', 'Apprendre l’informatique aux enfants est devenu un enjeu d’éducation mais le temps nécessaire risque d’être pris aux dépens des autres enseignements. Néanmoins, cette éducation est indispensable pour l’égalité des chances : alors que certains enfants naissent avec l’outil informatique, d’autres, faute de moyens, n’y auront accès qu’en classe.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('1b2884b9-1a13-4929-b0df-04f8351d7101', 19, 'lesson', 'L’alternative : ou, ou bien… ou bien, soit… soit, etc.', 'Donner des alternatives permet de donner l’impression d’un discours réfléchi, nuancé, qui n’est pas enfermé dans une seule idée.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('1b2884b9-1a13-4929-b0df-04f8351d7101', 20, 'lesson', 'Exemple', 'Pour donner accès à tous à l’outil informatique, la région pourrait soit acquérir des tablettes numériques et les distribuer aux élèves soit prendre des mesures pour que chaque établissement dispose d’une salle informatique en accès libre ou encadré.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('1b2884b9-1a13-4929-b0df-04f8351d7101', 21, 'lesson', 'La concession : bien que, certes, malgré, mais…', 'Bien utilisée, la concession est le meilleur outil pour montrer que l’on sait argumenter. Elle consiste à avouer qu’un argument – ou un exemple – opposé à ce que l’on veut démontrer est valable, mais pour donner aussitôt un autre argument qui, sans infirmer le premier, est plus fort ou plus adapté à la situation. Ce nouvel argument fait totalement oublier celui que l’on n’a pas su contrer.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('1b2884b9-1a13-4929-b0df-04f8351d7101', 22, 'lesson', 'Je sais qu’il ne pense qu’au football, mais il a de si beaux yeux !', 'Dans cet exemple volontairement simple, les « beaux yeux » font oublier le défaut (« il ne pense qu’au football »). Les beaux yeux sont l’argument décisif qui font oublier la concession (l’aveu) du défaut introduite par « je sais que ».

Dans une argumentation plus compliquée, le principe de concession est le même que dans l’exemple précédent :', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('1b2884b9-1a13-4929-b0df-04f8351d7101', 23, 'lesson', 'Exemple', 'La perpétuité est un mal nécessaire. Certes, vous pourriez m’objecter que les hommes n’ont pas à juger les hommes. Mais les hommes ont à protéger les hommes, et cela passe hélas par la mise à l’écart définitive de ceux qui nuisent à l’humanité.

La thèse défendue dans cet exemple reprend à son compte un argument d’une thèse adverse et avoue qu’il a de la valeur (« certes »), mais en donne ensuite un partiellement opposé qui a tout autant de valeur.

​Conclusion :

La maîtrise de l’argumentation est la clé de la réussite en classe de 3e. Il faut apprendre à développer son opinion, que ce soit sur des sujets généralistes ou sur des textes imposés dans le cadre d’un examen.

Lors du brevet, pour chaque question de compréhension, il faut au maximum développer ses réponses, en prenant soin de les argumenter et de citer le texte de façon systématique. Quant à la seconde partie de l’épreuve, celle de la rédaction, si le sujet d’imagination peut bien sûr sembler le plus facile, sélectionner le sujet de réflexion peut être un choix judicieux en ce que les jurys ont tendance à le favoriser. Lorsqu’il faut rédiger un texte argumentatif, il ne faut surtout pas avoir peur de l’ampleur de la tâche. Il faut prendre le temps de bien réfléchir au problème sur la feuille de brouillon, en essayant de diversifier au maximum les idées. Puis, lors de la rédaction, ne pas oublier de soigner le style et l’expressivité. Pour cela, la grammaire assimilée durant l’année est d’un grand secours.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('1b2884b9-1a13-4929-b0df-04f8351d7101', 24, 'quiz', 'Qu''est-ce que : Argumentation ?', 'Qu''est-ce que : Argumentation ?', '[{"id":"opt-0","text":"L’argumentation, c’est la construction de discours et de raisonnements structurés, qui s’appuient sur une démonstration logique.","isCorrect":true},{"id":"opt-1","text":"on peut convaincre : en faisant appel à la raison et au bon sens de son auditoire ; on peut persuader : en suscitant de l’émotion chez l’auditoire et en jouant de ses sentiments.","isCorrect":false},{"id":"opt-2","text":"La première partie du brevet, qui occupe une bonne heure du temps total de l’épreuve, se compose d’un texte et de plusieurs questions de compréhension de texte.","isCorrect":false},{"id":"opt-3","text":"Au brouillon, il va falloir réfléchir et chercher différentes idées qui peuvent s’appliquer à cette question.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('1b2884b9-1a13-4929-b0df-04f8351d7101', 25, 'quiz', 'Qu''est-ce que : L’argumentation peut se faire de deux façons ?', 'Qu''est-ce que : L’argumentation peut se faire de deux façons ?', '[{"id":"opt-0","text":"on peut convaincre : en faisant appel à la raison et au bon sens de son auditoire ; on peut persuader : en suscitant de l’émotion chez l’auditoire et en jouant de ses sentiments.","isCorrect":true},{"id":"opt-1","text":"L’argumentation, c’est la construction de discours et de raisonnements structurés, qui s’appuient sur une démonstration logique.","isCorrect":false},{"id":"opt-2","text":"La première partie du brevet, qui occupe une bonne heure du temps total de l’épreuve, se compose d’un texte et de plusieurs questions de compréhension de texte.","isCorrect":false},{"id":"opt-3","text":"Au brouillon, il va falloir réfléchir et chercher différentes idées qui peuvent s’appliquer à cette question.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('1b2884b9-1a13-4929-b0df-04f8351d7101', 26, 'quiz', 'Qu''est-ce que : La compréhension de texte ?', 'Qu''est-ce que : La compréhension de texte ?', '[{"id":"opt-0","text":"La première partie du brevet, qui occupe une bonne heure du temps total de l’épreuve, se compose d’un texte et de plusieurs questions de compréhension de texte.","isCorrect":true},{"id":"opt-1","text":"L’argumentation, c’est la construction de discours et de raisonnements structurés, qui s’appuient sur une démonstration logique.","isCorrect":false},{"id":"opt-2","text":"on peut convaincre : en faisant appel à la raison et au bon sens de son auditoire ; on peut persuader : en suscitant de l’émotion chez l’auditoire et en jouant de ses sentiments.","isCorrect":false},{"id":"opt-3","text":"Au brouillon, il va falloir réfléchir et chercher différentes idées qui peuvent s’appliquer à cette question.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('1b2884b9-1a13-4929-b0df-04f8351d7101', 27, 'quiz', 'Qu''est-ce que : Selon toi, travaille-t-on uniquement pour gagner de l’argent ? ?', 'Qu''est-ce que : Selon toi, travaille-t-on uniquement pour gagner de l’argent ? ?', '[{"id":"opt-0","text":"Au brouillon, il va falloir réfléchir et chercher différentes idées qui peuvent s’appliquer à cette question.","isCorrect":true},{"id":"opt-1","text":"L’argumentation, c’est la construction de discours et de raisonnements structurés, qui s’appuient sur une démonstration logique.","isCorrect":false},{"id":"opt-2","text":"on peut convaincre : en faisant appel à la raison et au bon sens de son auditoire ; on peut persuader : en suscitant de l’émotion chez l’auditoire et en jouant de ses sentiments.","isCorrect":false},{"id":"opt-3","text":"La première partie du brevet, qui occupe une bonne heure du temps total de l’épreuve, se compose d’un texte et de plusieurs questions de compréhension de texte.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('1b2884b9-1a13-4929-b0df-04f8351d7101', 28, 'quiz', 'Qu''est-ce que : La juxtaposition : l’absence de connecteur logique ?', 'Qu''est-ce que : La juxtaposition : l’absence de connecteur logique ?', '[{"id":"opt-0","text":"La façon la plus simple de donner des idées est de les juxtaposer, c’est-à-dire de les donner les unes à la suite des autres, sans connecteur logique en transition.","isCorrect":true},{"id":"opt-1","text":"L’argumentation, c’est la construction de discours et de raisonnements structurés, qui s’appuient sur une démonstration logique.","isCorrect":false},{"id":"opt-2","text":"on peut convaincre : en faisant appel à la raison et au bon sens de son auditoire ; on peut persuader : en suscitant de l’émotion chez l’auditoire et en jouant de ses sentiments.","isCorrect":false},{"id":"opt-3","text":"La première partie du brevet, qui occupe une bonne heure du temps total de l’épreuve, se compose d’un texte et de plusieurs questions de compréhension de texte.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('1b2884b9-1a13-4929-b0df-04f8351d7101', 29, 'quiz', 'Qu''est-ce que : Nuancer ses idées ?', 'Qu''est-ce que : Nuancer ses idées ?', '[{"id":"opt-0","text":"Donner des idées avec les procédés décrits précédemment est utile, mais si l’on veut montrer qu’on maîtrise vraiment son discours, il faut apprendre à le nuancer.","isCorrect":true},{"id":"opt-1","text":"L’argumentation, c’est la construction de discours et de raisonnements structurés, qui s’appuient sur une démonstration logique.","isCorrect":false},{"id":"opt-2","text":"on peut convaincre : en faisant appel à la raison et au bon sens de son auditoire ; on peut persuader : en suscitant de l’émotion chez l’auditoire et en jouant de ses sentiments.","isCorrect":false},{"id":"opt-3","text":"La première partie du brevet, qui occupe une bonne heure du temps total de l’épreuve, se compose d’un texte et de plusieurs questions de compréhension de texte.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('1b2884b9-1a13-4929-b0df-04f8351d7101', 30, 'quiz', 'Qu''est-ce que : L’alternative : ou, ou bien… ou bien, soit… soit, etc. ?', 'Qu''est-ce que : L’alternative : ou, ou bien… ou bien, soit… soit, etc. ?', '[{"id":"opt-0","text":"Donner des alternatives permet de donner l’impression d’un discours réfléchi, nuancé, qui n’est pas enfermé dans une seule idée.","isCorrect":true},{"id":"opt-1","text":"L’argumentation, c’est la construction de discours et de raisonnements structurés, qui s’appuient sur une démonstration logique.","isCorrect":false},{"id":"opt-2","text":"on peut convaincre : en faisant appel à la raison et au bon sens de son auditoire ; on peut persuader : en suscitant de l’émotion chez l’auditoire et en jouant de ses sentiments.","isCorrect":false},{"id":"opt-3","text":"La première partie du brevet, qui occupe une bonne heure du temps total de l’épreuve, se compose d’un texte et de plusieurs questions de compréhension de texte.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('1b2884b9-1a13-4929-b0df-04f8351d7101', 31, 'quiz', 'Qu''est-ce que : La concession : bien que, certes, malgré, mais… ?', 'Qu''est-ce que : La concession : bien que, certes, malgré, mais… ?', '[{"id":"opt-0","text":"Bien utilisée, la concession est le meilleur outil pour montrer que l’on sait argumenter.","isCorrect":true},{"id":"opt-1","text":"L’argumentation, c’est la construction de discours et de raisonnements structurés, qui s’appuient sur une démonstration logique.","isCorrect":false},{"id":"opt-2","text":"on peut convaincre : en faisant appel à la raison et au bon sens de son auditoire ; on peut persuader : en suscitant de l’émotion chez l’auditoire et en jouant de ses sentiments.","isCorrect":false},{"id":"opt-3","text":"La première partie du brevet, qui occupe une bonne heure du temps total de l’épreuve, se compose d’un texte et de plusieurs questions de compréhension de texte.","isCorrect":false}]', NULL, NULL, 50);

INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '1b2884b9-1a13-4929-b0df-04f8351d7101', '2026-01-17', 1, 0, 5)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '1b2884b9-1a13-4929-b0df-04f8351d7101', '2026-01-18', 2, 6, 11)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '1b2884b9-1a13-4929-b0df-04f8351d7101', '2026-01-19', 3, 12, 17)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '1b2884b9-1a13-4929-b0df-04f8351d7101', '2026-01-20', 4, 18, 23)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '1b2884b9-1a13-4929-b0df-04f8351d7101', '2026-01-21', 5, 24, 29)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '1b2884b9-1a13-4929-b0df-04f8351d7101', '2026-01-22', 6, 30, 31)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;

-- Course: La Première Guerre mondiale : vers une guerre totale
INSERT INTO public.courses (id, user_id, title, description, category, level, estimated_minutes, icon, total_xp, is_published, duration_days, daily_cards_count)
VALUES ('9c3b5a5d-ce98-4aa7-960f-add549194e71', '00000000-0000-0000-0000-000000000001', 'La Première Guerre mondiale : vers une guerre totale', 'Cours de Histoire : La Première Guerre mondiale : vers une guerre totale', 'Histoire', '3eme', 16, '📚', 540, true, 4, 6);

INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9c3b5a5d-ce98-4aa7-960f-add549194e71', 0, 'lesson', 'Introduction', 'Pour les historiens, le monde entre dans le XXe siècle à partir de la Première Guerre mondiale. En effet, celle-ci représente un tournant majeur dans l’histoire de l’humanité, de par sa violence et ses conséquences. S’il est important d’en connaître la chronologie, il s’agit surtout de comprendre son importance dans l’histoire du XXe siècle. En quoi la Première Guerre mondiale peut être qualifiée de guerre totale ? Pourquoi ce conflit inaugure-t-il une période de violence caractéristique du XXe siècle ?

Pour répondre à ces questions, nous analyserons tout d’abord les grandes phases de la guerre, puis nous étudierons les raisons pour lesquelles on peut parler d’une guerre nouvelle, à partir de l’exemple de la bataille de Verdun. Finalement nous analyserons les conséquences de la guerre.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9c3b5a5d-ce98-4aa7-960f-add549194e71', 1, 'lesson', 'Les forces en présence', 'Tout d’abord, il est nécessaire de bien comprendre les forces en présence. La Première Guerre mondiale voit s’affronter deux camps : le camp des Empires centraux (ou Triple Alliance) et ses alliés contre l’Entente (ou Triple-Entente) et ses alliés.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9c3b5a5d-ce98-4aa7-960f-add549194e71', 2, 'lesson', 'Camp des empires centraux et Entente', 'Le camp des Empires centraux est composé de l’Allemagne, de l’Autriche-Hongrie, de l’Italie (jusqu’en 1915) et de l’Empire Ottoman.
L’Entente est formée du Royaume-Uni, de la France et de la Russie (puis de l’Italie, en 1915, et des États-Unis, en 1917).

Il existait, bien avant le début de la guerre, des rivalités politiques économiques et territoriales entre les principaux pays européens. C’est pourquoi un seul événement parvient à faire éclater une guerre que beaucoup sentaient venir.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9c3b5a5d-ce98-4aa7-960f-add549194e71', 3, 'lesson', 'À retenir', '​L’élément déclencheur de la Première Guerre, c’est l’assassinat de l’archiduc François-Ferdinand et de son épouse, le 28 juin 1914.

Celui-ci était l’héritier du trône d’Autriche-Hongrie, alliée de l’Allemagne. L’assassin était un serbe. La Serbie étant alliée à la Russie, et celle-ci à la France, le réseau d’alliance se met en place. Le 3 août 1914, l’Allemagne déclare la guerre à la France.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9c3b5a5d-ce98-4aa7-960f-add549194e71', 4, 'lesson', 'La Première Guerre mondiale est divisée en 3 phases', 'la guerre de mouvement (du mois d’août 1914 à octobre 1914) ;
la guerre de tranchées ou guerre de position (de novembre 1914 à mars 1918) ;
et la reprise de la guerre de mouvement : du mois d’avril à novembre 1918.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9c3b5a5d-ce98-4aa7-960f-add549194e71', 5, 'lesson', 'Guerre de mouvement', 'Elle se définit comme un moment de grandes offensives entre les armées, afin de gagner du territoire.
Au contraire, une guerre de tranchées, ou guerre de position, se caractérise par son immobilité. Les soldats sont enfoncés dans des fossés aménagés, les tranchées, qui protègent les combattants et qui leur permettent de lancer des assauts contre l’ennemi.

​La première phase, la guerre de mouvement, est un échec pour les deux camps.

Ni la France ni l’Allemagne ne parviennent à prendre l’avantage, malgré la grande offensive allemande menée au nord de la France, et malgré la stratégie de Joffre, général français, qui permit néanmoins de stopper cette offensive allemande, durant la bataille de la Marne (septembre 1914).

À la fin de l’année 1914, une nouvelle stratégie est alors instaurée, celle des tranchées creusées sur 700 km, de la mer du Nord à la Suisse. Le symbole de la guerre de tranchées, c’est la bataille de Verdun.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9c3b5a5d-ce98-4aa7-960f-add549194e71', 6, 'lesson', 'En 1917, deux évènements majeurs font basculer le destin du monde', 'l’entrée en guerre des États-Unis, du côté de l’Entente, (qui apportera 4 millions d’hommes) en avril 1917;
les deux révolutions russes de février et d’octobre 1917, deux révolutions communistes, qui obligeront la Russie à quitter la guerre.

L’année 1917, c’est également l’année de l’arrivée de Georges Clemenceau au pouvoir en France, surnommé « le Tigre », en raison de sa détermination.

Lorsque la guerre de mouvement reprend, au printemps 1918, c’est un échec pour l’Allemagne qui avait relancé une grande offensive contre la France. Durant l’été 1918, l’Entente remporte définitivement la guerre.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9c3b5a5d-ce98-4aa7-960f-add549194e71', 7, 'lesson', 'Une guerre nouvelle', 'La Première Guerre mondiale n’a pas été une guerre traditionnelle. Deux exemples suffiront à le montrer : celui de la bataille de Verdun et celui du génocide des Arméniens.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9c3b5a5d-ce98-4aa7-960f-add549194e71', 8, 'lesson', 'La violence de Verdun', 'La guerre de mouvement a donc été un échec pour les deux camps, qui adoptent dès la fin 1914, une autre stratégie, celle des tranchées. Les pays en guerre décident alors de se faire face, en creusant d’immenses fossés. Les soldats se retranchent et s’abritent dans des tranchées, qui servaient également de centres d’opérations complexes, avec notamment un centre de secours, un poste de communication, des dépôts d’armes, etc.

Les soldats français, que l’on nomme alors « les Poilus », surveillent les attaques ennemies ou bien donnent l’assaut. Lorsqu’ils ne combattent pas, les soldats doivent alors survivre au froid, au manque d’hygiène et de nourriture, ou encore à l’ennui. Il faut noter que les tranchées ennemies étaient parallèles, ce qui faisait que Français et Allemands étaient toujours face à face.

Une des batailles les plus importantes de cette guerre de tranchées est la bataille de Verdun, de février à décembre 1916. Le but des Allemands lors de cette bataille longue de 10 mois n’est pas de gagner du territoire mais de « saigner à blanc l’armée française », c’est-à-dire de l’épuiser jusqu’au bout.

Les armes utilisées durant cette bataille sont particulièrement sanglantes : tirs d’obus massifs et gaz asphyxiants principalement. Trois généraux se succèdent du côté français : Joffre, Pétain et Nivelle.

Après des mois de batailles intenses et malgré les dernières offensives allemandes, c’est finalement la France qui gagne la bataille.

À l’échelle du conflit, le territoire gagné est quasi nul. Mais à l’échelle symbolique, la bataille de Verdun représente le sacrifice des poilus (presque 3 000 morts par jour), l’enfer des tranchées et la mort en masse. Plus de 700 000 soldats sont morts durant cette bataille, et 45 millions d’obus ont été lancés. Ces chiffres vertigineux démontrent à quel point la Première Guerre mondiale a produit de la violence de masse.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9c3b5a5d-ce98-4aa7-960f-add549194e71', 9, 'lesson', 'Le génocide des Arméniens', 'Mais ce ne sont pas seulement des soldats qui ont été touchés dans ce terrible conflit. Ce sont également et pour la première fois des civils.

Les Arméniens, peuple minoritaire dans l’Empire ottoman (actuelle Turquie) vont être victimes d’un génocide, c’est-à-dire d’une extermination systématique et planifiée.

Accusant les Arméniens d’avoir tenté de rallier le côté russe, les Turcs décident « d’éliminer méthodiquement ce peuple durant toute l’année 1915 ». Des déportations sont organisées et les Arméniens sont enfermés dans des camps de concentration puis assassinés, ou parfois envoyés dans le désert, sans vivres. Ce sont finalement 1,2 millions d’Arméniens qui ont ainsi été assassinés.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9c3b5a5d-ce98-4aa7-960f-add549194e71', 10, 'lesson', 'La Première Guerre mondiale mobilise l’ensemble de la société : il s’agit bien d’une guerre totale.', 'Dans les industries, en particulier celles liées aux armements, ce sont alors les femmes qui doivent remplacer les hommes, partis au front. Les industries sont mises au service de la guerre. Renault par exemple va construire des obus, des chars d’assaut, des moteurs, etc.

La mobilisation est également culturelle : les pays vont mettre en place des politiques de propagande et de censure afin de mobiliser le moral et de trouver également des sources de financement, car la guerre coûte cher.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9c3b5a5d-ce98-4aa7-960f-add549194e71', 11, 'lesson', 'Le bilan humain et matériel', 'Le bilan humain de la guerre, c’est pratiquement 10 millions de morts dont 1,5 millions de Français. C’est aussi 20 millions de blessés, dont 6 millions d’invalides et de mutilés, qu’on appelle les « gueules cassées ».

Les « gueules cassées » sont le nom que se donnent les soldats survivants de la Première Guerre. Souvent gravement amputés et traumatisés par la guerre, le travail de réinsertion dans la vie quotidienne sera très complexe. Des millions de veuves et d’orphelins plongent l’Europe dans une période de tristesse et de deuil intense.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9c3b5a5d-ce98-4aa7-960f-add549194e71', 12, 'lesson', 'Aux niveaux territorial et politique, la Première Guerre mondiale a des conséquences complexes.', 'La première révolution russe, en février 1917, avait fait tomber le tsar Nicolas II, tandis que la seconde révolution russe d’octobre 1917 s’installe avec ce slogan : « la paix, le pain, la terre ». Dirigées par Lénine, chef du parti bolchévique (ou parti communiste), elles ont pour conséquence le retrait de la Russie de la Première Guerre. Une vague de révolutions en Europe débute alors, principalement en Hongrie et en Allemagne.
Le traité de Versailles, signé le 28 juin 1919, est un traité de paix qui dicte les décisions prises contre les vaincus. L’Allemagne est désignée comme seule responsable de la guerre et doit endurer des conditions très lourdes : elle est privée de ses colonies, d’une grande partie de ses droits militaires, doit payer de lourdes réparations de guerre et elle est amputée de certains territoires (la France récupère l’Alsace et la Lorraine). Elle vit très mal ce traité qu’elle nomme le diktat de Versailles (décision imposée et humiliante). Le traité de Versailles crée également la SDN ou Société des Nations, un organisme international qui doit garantir la paix dans le monde.
Il faut noter la disparition de certains empires à la fin de la guerre : l’Empire ottoman disparait, ainsi que l’Empire allemand et l’Empire austro-hongrois. De nouveaux pays apparaissent, tels que la Tchécoslovaquie.

La Première Guerre mondiale est donc bien une guerre totale : la mobilisation humaine est sans précédent, sur le front, et en arrière, au niveau de l’implication des civils.

C’est un conflit à échelle mondiale, qui concerne l’Europe mais aussi les États-Unis, la Turquie, et le Japon. 10 millions de personnes sont mortes, et presque 7 millions de soldats sont blessés.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9c3b5a5d-ce98-4aa7-960f-add549194e71', 13, 'lesson', 'Au niveau culturel et économique, l’effort de guerre est également unique.', 'L’Europe sort donc bouleversée de cette terrible épreuve, avec des nouvelles frontières redessinées. La révolution russe de 1917 déclenche pour sa part une série de révolutions en Europe et installe durablement l’idéologie communiste, qui se présente alors comme une alternative au capitalisme.

Alors que d’un côté, un sentiment de pacifisme se développe dans le monde, l’Allemagne, grande perdante de la Première Guerre, développera à partir des années 1920 un esprit de revanche qui mènera jusqu’à la Seconde Guerre mondiale. Hélas, ce n’était donc pas « la der des der » comme on aurait aimé le croire.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9c3b5a5d-ce98-4aa7-960f-add549194e71', 14, 'quiz', 'Qu''est-ce que : Les forces en présence ?', 'Qu''est-ce que : Les forces en présence ?', '[{"id":"opt-0","text":"Tout d’abord, il est nécessaire de bien comprendre les forces en présence.","isCorrect":true},{"id":"opt-1","text":"Le camp des Empires centraux est composé de l’Allemagne, de l’Autriche-Hongrie, de l’Italie (jusqu’en 1915) et de l’Empire Ottoman.","isCorrect":false},{"id":"opt-2","text":"la guerre de mouvement (du mois d’août 1914 à octobre 1914) ; la guerre de tranchées ou guerre de position (de novembre 1914 à mars 1918) ; et la reprise de la guerre de mouvement : du mois d’avril à novembre 1918.","isCorrect":false},{"id":"opt-3","text":"Elle se définit comme un moment de grandes offensives entre les armées, afin de gagner du territoire.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9c3b5a5d-ce98-4aa7-960f-add549194e71', 15, 'quiz', 'Qu''est-ce que : Camp des empires centraux et Entente ?', 'Qu''est-ce que : Camp des empires centraux et Entente ?', '[{"id":"opt-0","text":"Le camp des Empires centraux est composé de l’Allemagne, de l’Autriche-Hongrie, de l’Italie (jusqu’en 1915) et de l’Empire Ottoman.","isCorrect":true},{"id":"opt-1","text":"Tout d’abord, il est nécessaire de bien comprendre les forces en présence.","isCorrect":false},{"id":"opt-2","text":"la guerre de mouvement (du mois d’août 1914 à octobre 1914) ; la guerre de tranchées ou guerre de position (de novembre 1914 à mars 1918) ; et la reprise de la guerre de mouvement : du mois d’avril à novembre 1918.","isCorrect":false},{"id":"opt-3","text":"Elle se définit comme un moment de grandes offensives entre les armées, afin de gagner du territoire.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9c3b5a5d-ce98-4aa7-960f-add549194e71', 16, 'quiz', 'Qu''est-ce que : La Première Guerre mondiale est divisée en 3 phases ?', 'Qu''est-ce que : La Première Guerre mondiale est divisée en 3 phases ?', '[{"id":"opt-0","text":"la guerre de mouvement (du mois d’août 1914 à octobre 1914) ; la guerre de tranchées ou guerre de position (de novembre 1914 à mars 1918) ; et la reprise de la guerre de mouvement : du mois d’avril à novembre 1918.","isCorrect":true},{"id":"opt-1","text":"Tout d’abord, il est nécessaire de bien comprendre les forces en présence.","isCorrect":false},{"id":"opt-2","text":"Le camp des Empires centraux est composé de l’Allemagne, de l’Autriche-Hongrie, de l’Italie (jusqu’en 1915) et de l’Empire Ottoman.","isCorrect":false},{"id":"opt-3","text":"Elle se définit comme un moment de grandes offensives entre les armées, afin de gagner du territoire.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9c3b5a5d-ce98-4aa7-960f-add549194e71', 17, 'quiz', 'Qu''est-ce que : Guerre de mouvement ?', 'Qu''est-ce que : Guerre de mouvement ?', '[{"id":"opt-0","text":"Elle se définit comme un moment de grandes offensives entre les armées, afin de gagner du territoire.","isCorrect":true},{"id":"opt-1","text":"Tout d’abord, il est nécessaire de bien comprendre les forces en présence.","isCorrect":false},{"id":"opt-2","text":"Le camp des Empires centraux est composé de l’Allemagne, de l’Autriche-Hongrie, de l’Italie (jusqu’en 1915) et de l’Empire Ottoman.","isCorrect":false},{"id":"opt-3","text":"la guerre de mouvement (du mois d’août 1914 à octobre 1914) ; la guerre de tranchées ou guerre de position (de novembre 1914 à mars 1918) ; et la reprise de la guerre de mouvement : du mois d’avril à novembre 1918.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9c3b5a5d-ce98-4aa7-960f-add549194e71', 18, 'quiz', 'Qu''est-ce que : Une guerre nouvelle ?', 'Qu''est-ce que : Une guerre nouvelle ?', '[{"id":"opt-0","text":"La Première Guerre mondiale n’a pas été une guerre traditionnelle. Deux exemples suffiront à le montrer : celui de la bataille de Verdun et celui du génocide des Arméniens.","isCorrect":true},{"id":"opt-1","text":"Tout d’abord, il est nécessaire de bien comprendre les forces en présence.","isCorrect":false},{"id":"opt-2","text":"Le camp des Empires centraux est composé de l’Allemagne, de l’Autriche-Hongrie, de l’Italie (jusqu’en 1915) et de l’Empire Ottoman.","isCorrect":false},{"id":"opt-3","text":"la guerre de mouvement (du mois d’août 1914 à octobre 1914) ; la guerre de tranchées ou guerre de position (de novembre 1914 à mars 1918) ; et la reprise de la guerre de mouvement : du mois d’avril à novembre 1918.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9c3b5a5d-ce98-4aa7-960f-add549194e71', 19, 'quiz', 'Qu''est-ce que : La violence de Verdun ?', 'Qu''est-ce que : La violence de Verdun ?', '[{"id":"opt-0","text":"La guerre de mouvement a donc été un échec pour les deux camps, qui adoptent dès la fin 1914, une autre stratégie, celle des tranchées.","isCorrect":true},{"id":"opt-1","text":"Tout d’abord, il est nécessaire de bien comprendre les forces en présence.","isCorrect":false},{"id":"opt-2","text":"Le camp des Empires centraux est composé de l’Allemagne, de l’Autriche-Hongrie, de l’Italie (jusqu’en 1915) et de l’Empire Ottoman.","isCorrect":false},{"id":"opt-3","text":"la guerre de mouvement (du mois d’août 1914 à octobre 1914) ; la guerre de tranchées ou guerre de position (de novembre 1914 à mars 1918) ; et la reprise de la guerre de mouvement : du mois d’avril à novembre 1918.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9c3b5a5d-ce98-4aa7-960f-add549194e71', 20, 'quiz', 'Qu''est-ce que : Le génocide des Arméniens ?', 'Qu''est-ce que : Le génocide des Arméniens ?', '[{"id":"opt-0","text":"Mais ce ne sont pas seulement des soldats qui ont été touchés dans ce terrible conflit.","isCorrect":true},{"id":"opt-1","text":"Tout d’abord, il est nécessaire de bien comprendre les forces en présence.","isCorrect":false},{"id":"opt-2","text":"Le camp des Empires centraux est composé de l’Allemagne, de l’Autriche-Hongrie, de l’Italie (jusqu’en 1915) et de l’Empire Ottoman.","isCorrect":false},{"id":"opt-3","text":"la guerre de mouvement (du mois d’août 1914 à octobre 1914) ; la guerre de tranchées ou guerre de position (de novembre 1914 à mars 1918) ; et la reprise de la guerre de mouvement : du mois d’avril à novembre 1918.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('9c3b5a5d-ce98-4aa7-960f-add549194e71', 21, 'quiz', 'Qu''est-ce que : Le bilan humain et matériel ?', 'Qu''est-ce que : Le bilan humain et matériel ?', '[{"id":"opt-0","text":"Le bilan humain de la guerre, c’est pratiquement 10 millions de morts dont 1,5 millions de Français.","isCorrect":true},{"id":"opt-1","text":"Tout d’abord, il est nécessaire de bien comprendre les forces en présence.","isCorrect":false},{"id":"opt-2","text":"Le camp des Empires centraux est composé de l’Allemagne, de l’Autriche-Hongrie, de l’Italie (jusqu’en 1915) et de l’Empire Ottoman.","isCorrect":false},{"id":"opt-3","text":"la guerre de mouvement (du mois d’août 1914 à octobre 1914) ; la guerre de tranchées ou guerre de position (de novembre 1914 à mars 1918) ; et la reprise de la guerre de mouvement : du mois d’avril à novembre 1918.","isCorrect":false}]', NULL, NULL, 50);

INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '9c3b5a5d-ce98-4aa7-960f-add549194e71', '2026-01-17', 1, 0, 5)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '9c3b5a5d-ce98-4aa7-960f-add549194e71', '2026-01-18', 2, 6, 11)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '9c3b5a5d-ce98-4aa7-960f-add549194e71', '2026-01-19', 3, 12, 17)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '9c3b5a5d-ce98-4aa7-960f-add549194e71', '2026-01-20', 4, 18, 21)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;

-- Course: La Seconde Guerre mondiale : une guerre d’anéantissement
INSERT INTO public.courses (id, user_id, title, description, category, level, estimated_minutes, icon, total_xp, is_published, duration_days, daily_cards_count)
VALUES ('fbb736dc-e779-4186-b57c-54c4dd1b74cd', '00000000-0000-0000-0000-000000000001', 'La Seconde Guerre mondiale : une guerre d’anéantissement', 'Cours de Histoire : La Seconde Guerre mondiale : une guerre d’anéantissement', 'Histoire', '3eme', 22, '📚', 640, true, 4, 6);

INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('fbb736dc-e779-4186-b57c-54c4dd1b74cd', 0, 'lesson', 'Introduction', 'La Seconde Guerre mondiale (1939-1945) se caractérise par l’idée d’anéantissement total de l’ennemi. C’est une guerre d’une violence extrême qui met en place une politique d’extermination systématique et organisée de l’ennemi.

Pourquoi peut-on qualifier la Seconde Guerre mondiale de guerre d’anéantissement ? Pour y répondre, nous étudierons trois grandes parties : la première partie évaluera les dimensions planétaires du conflit et proposera une brève chronologie. L’exemple de la bataille de Stalingrad, la deuxième partie, permettra d’étudier de quelles manières l’intégralité des forces matérielles et morales des peuples ont été utilisées. Le thème du génocide des Juifs et des Tsiganes formera une troisième partie. Nous soulignerons ici que l’objectif des nazis était bien une destruction totale et systématique de l’ennemi.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('fbb736dc-e779-4186-b57c-54c4dd1b74cd', 1, 'lesson', 'Un affrontement aux dimensions planétaires', '1939-1942 : les victoires de l’Axe

Quelques petites définitions sont nécessaires avant de commencer cette partie. Quand on parle de l’Axe, c’est pour faire référence à l’Allemagne nazie, dirigée par Adolf Hitler, l’Italie fasciste, dirigée par Benito Mussolini, et le Japon. Les pays qui s’opposent aux forces de l’Axe se regroupent sous le nom d’Alliés, c’est-à-dire principalement le Royaume-Uni, la France, ainsi que les États-Unis et l’URSS à partir de 1941.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('fbb736dc-e779-4186-b57c-54c4dd1b74cd', 2, 'lesson', 'Carte des avancées allemandes lors de la Blitzkrieg', 'La Seconde Guerre mondiale débute le 1er septembre 1939 après l’invasion de la Pologne par l’Allemagne nazie.

Avec la technique du Blitzkrieg, Hitler parvient à occuper une grande partie de l’Europe : le Danemark, la Norvège, puis la Belgique, les Pays-Bas, le Luxembourg et la France sont occupés. Seul le Royaume-Uni lui résiste grâce au soutien matériel des États-Unis. Hitler lui impose alors un blocus.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('fbb736dc-e779-4186-b57c-54c4dd1b74cd', 3, 'lesson', 'Blitzkrieg', 'C’est la « guerre éclair » : des attaques très rapides de l’armée d’Hitler, qui utilise en même temps les chars blindés et les avions.

En Asie, le Japon (allié des Nazis), a conquis d’immenses territoires en Chine et dans l’Océan Pacifique. Il faut savoir que les colonies européennes participent au conflit, ce qui accentue la dimension mondiale du conflit.

En 1941, deux nouveaux pays entrent en guerre : l’URSS et les États-Unis. L’URSS est attaquée le 22 juin alors que Staline et Hitler avaient signé un pacte de non-agression en 1939. C’est ce qu’on appelle « l’opération Barbarossa ». Les États-Unis sont attaqués par le Japon à Pearl Harbor. Ils entrent en guerre le 7 décembre.

Les rapports de force vont alors être modifiés par l’entrée en guerre de ces deux superpuissances et l’armée d’Hitler ne pourra plus progresser.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('fbb736dc-e779-4186-b57c-54c4dd1b74cd', 4, 'lesson', 'Le tournant de 1942', 'La bataille de Stalingrad est le symbole du coup d’arrêt porté aux victoires allemandes. Il faut également noter que deux autres victoires des Alliés permettent de mettre un frein aux conquêtes nazies durant l’année 1942 : dans le Pacifique, avec les victoires américaines de Midway et Guadalcanal (cette dernière se termine en 1943) contre les Japonais, et en Afrique du Nord, à El Alamein.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('fbb736dc-e779-4186-b57c-54c4dd1b74cd', 5, 'lesson', 'La victoire des Alliés', 'De 1943 à 1945, l’Axe recule sur tous les fronts. Le débarquement en Sicile en 1943 oblige l’Italie à capituler.

Le débarquement des troupes alliées en Normandie le 6 juin 1944 puis en Provence en août 1944 permet d’encercler l’armée nazie. Bloquée à l’Est par l’avancée de l’Armée rouge (c’est ainsi qu’on appelait l’armée communiste) et à l’Ouest par les Alliés, l’armée allemande est encerclée.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('fbb736dc-e779-4186-b57c-54c4dd1b74cd', 6, 'lesson', 'Le 30 avril, Hitler se suicide et l’Allemagne capitule le 8 mai 1945.', 'Quant au Japon, il résiste jusqu’en août 1945, date à laquelle les États-Unis lancent les deux bombes atomiques sur Hiroshima et Nagasaki.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('fbb736dc-e779-4186-b57c-54c4dd1b74cd', 7, 'lesson', 'Une guerre aux enjeux idéologiques et nationaux', 'La bataille de Stalingrad, en 1942, permet d’illustrer l’idée de mobilisation totale durant la Seconde Guerre mondiale.

Ce sont 1,5 millions de soldats allemands et soviétiques qui vont s’y affronter. La bataille exige la mobilisation de toutes les forces humaines, militaires et économiques disponibles, avec un intense effort de propagande. La bataille n’est pas seulement territoriale, elle est avant tout idéologique. Chaque camp affronte une conception différente de la civilisation.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('fbb736dc-e779-4186-b57c-54c4dd1b74cd', 8, 'lesson', 'La bataille connait deux grandes phases', 'de août à novembre 1942 : la ville de Stalingrad est assiégée par les Allemands, qui parviennent ensuite à y pénétrer ;
de novembre 1942 à février 1943 : l’armée soviétique parvient à reprendre le contrôle et à encercler l’armée allemande. Cette reprise en main soviétique est due en partie à la démoralisation des troupes allemandes qui furent très mal approvisionnées.

Le bilan de la bataille est impressionnant : l’URSS, bien que victorieuse, a perdu presque 1,2 millions de personnes, tandis que l’Allemagne, vaincue, 760 000 personnes. Cela qui fait de la bataille de Stalingrad l’unes plus meurtrières de toute la guerre, voire de toute l’Histoire.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('fbb736dc-e779-4186-b57c-54c4dd1b74cd', 9, 'lesson', 'L’exemple de Stalingrad permet de saisir les enjeux de la Seconde Guerre mondiale.', 'C’est une guerre idéologique. Il ne s’agit pas seulement de gagner des terres mais surtout d’imposer une vision du monde (le nazisme, le communisme ou la démocratie libérale).
C’est une guerre qui mobilise toutes les ressources possibles. Peu importe les moyens, c’est la victoire qui compte, coûte que coûte.
Les avancées scientifiques, mises au service de cet effort de guerre totale, sont majeures : l’Allemagne va mettre au point les missiles tandis que les Alliés vont créer et développer les ordinateurs, des moyens de détection perfectionnés comme le radar et surtout la bombe atomique.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('fbb736dc-e779-4186-b57c-54c4dd1b74cd', 10, 'lesson', 'L’exclusion des Juifs', 'En 1933, les nazis avaient mis en place en Allemagne une politique antisémite, c’est-à-dire d’identification et d’exclusion des Juifs, privés alors de leurs principaux droits. En 1940, cette politique est appliquée sur les territoires conquis par les Nazis. Peu à peu, ce mouvement va s’intensifier, et les Juifs vont être victimes de rafles (arrestations en masse) puis enfermés dans des camps de transit ou des ghettos (c’est-à-dire des quartiers spécifiquement réservés aux Juifs, entourés de fils barbelés et de murs). Le ghetto de Varsovie comptait par exemple 550 000 Juifs.

Quant aux Tsiganes, ils sont enfermés dans des camps de concentration dès 1933 (attention à ne pas les confondre avec des camps d’extermination puisque dans un premier temps, il s’agit de les exclure de la société en les enfermant dans des camps de travail et non pas de les exterminer).', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('fbb736dc-e779-4186-b57c-54c4dd1b74cd', 11, 'lesson', 'Les Einsatzgruppen et la conférence de Wannsee', 'C’est à partir de la tentative d’invasion de l’URSS par les nazis en 1941 que le processus d’extermination des Juifs et des Tsiganes débute.

Ce sont les Einsatzgruppen, définis comme des unités mobiles d’extermination qui suivaient l’avancée de l’armée allemande qui furent chargés d’assassiner systématiquement les ennemis politiques et raciaux des Nazis (Juifs, Tsiganes ou communistes). On estime que 750 000 personnes ont été tuées par ces commandos nazis.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('fbb736dc-e779-4186-b57c-54c4dd1b74cd', 12, 'lesson', 'À retenir', 'Le 20 janvier 1942, une étape est franchie dans le processus d’extermination des Juifs et des Tsiganes, avec la Conférence de Wannsee. Hitler décide durant cette conférence que tous les Juifs d’Europe (soit 11 millions de personnes) devront être déportés et éliminés.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('fbb736dc-e779-4186-b57c-54c4dd1b74cd', 13, 'lesson', 'C’est ce qu’on appelle « la Solution finale ».', 'Les Juifs, ainsi que les Tsiganes, enfermés dans des ghettos ou dans des camps de transit, sont alors déportés par l’intermédiaire de wagons à bestiaux principalement vers des camps d’extermination. Les opposants politiques, les homosexuels, les Slaves ou encore les chrétiens étaient davantage dirigés vers les camps de concentration. Certains camps, comme à Auschwitz, furent à la fois camps de concentration et camp d’extermination.

Ce sont 240 000 Tsiganes et 5 à 6 millions de Juifs qui vont alors trouver la mort dans ces camps. Le génocide juif est appelé la Shoah, ce qui signifie « catastrophe » ou « anéantissement » en hébreu.

La Seconde Guerre mondiale est bien une guerre d’anéantissement, qui vise la destruction totale de l’ennemi, par tous les moyens possibles. L’affrontement est planétaire et mobilise toutes les forces matérielles et morales des peuples en guerre.
La bataille de Stalingrad permet de comprendre comment la mise en place d’une économie de guerre s’associe à une propagande afin de détruire l’ennemi sur le plan territorial mais aussi idéologique.
Au total, la guerre a fait entre 50 et 60 millions de morts, en majorité des civils. L’Europe est ruinée et la découverte des camps d’extermination à la fin de la guerre traumatise les populations. La notion de « crime contre l’humanité », c’est-à-dire de condamnation de tout acte violent et ignoble contre une population pour des motifs politiques, religieux ou raciaux est alors créée.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('fbb736dc-e779-4186-b57c-54c4dd1b74cd', 14, 'quiz', 'Qu''est-ce que : Un affrontement aux dimensions planétaires ?', 'Qu''est-ce que : Un affrontement aux dimensions planétaires ?', '[{"id":"opt-0","text":"1939-1942 : les victoires de l’Axe  Quelques petites définitions sont nécessaires avant de commencer cette partie.","isCorrect":true},{"id":"opt-1","text":"La Seconde Guerre mondiale débute le 1er septembre 1939 après l’invasion de la Pologne par l’Allemagne nazie.","isCorrect":false},{"id":"opt-2","text":"C’est la « guerre éclair » : des attaques très rapides de l’armée d’Hitler, qui utilise en même temps les chars blindés et les avions.","isCorrect":false},{"id":"opt-3","text":"La bataille de Stalingrad est le symbole du coup d’arrêt porté aux victoires allemandes.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('fbb736dc-e779-4186-b57c-54c4dd1b74cd', 15, 'quiz', 'Qu''est-ce que : Carte des avancées allemandes lors de la Blitzkrieg ?', 'Qu''est-ce que : Carte des avancées allemandes lors de la Blitzkrieg ?', '[{"id":"opt-0","text":"La Seconde Guerre mondiale débute le 1er septembre 1939 après l’invasion de la Pologne par l’Allemagne nazie.","isCorrect":true},{"id":"opt-1","text":"1939-1942 : les victoires de l’Axe  Quelques petites définitions sont nécessaires avant de commencer cette partie.","isCorrect":false},{"id":"opt-2","text":"C’est la « guerre éclair » : des attaques très rapides de l’armée d’Hitler, qui utilise en même temps les chars blindés et les avions.","isCorrect":false},{"id":"opt-3","text":"La bataille de Stalingrad est le symbole du coup d’arrêt porté aux victoires allemandes.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('fbb736dc-e779-4186-b57c-54c4dd1b74cd', 16, 'quiz', 'Qu''est-ce que : Blitzkrieg ?', 'Qu''est-ce que : Blitzkrieg ?', '[{"id":"opt-0","text":"C’est la « guerre éclair » : des attaques très rapides de l’armée d’Hitler, qui utilise en même temps les chars blindés et les avions.","isCorrect":true},{"id":"opt-1","text":"1939-1942 : les victoires de l’Axe  Quelques petites définitions sont nécessaires avant de commencer cette partie.","isCorrect":false},{"id":"opt-2","text":"La Seconde Guerre mondiale débute le 1er septembre 1939 après l’invasion de la Pologne par l’Allemagne nazie.","isCorrect":false},{"id":"opt-3","text":"La bataille de Stalingrad est le symbole du coup d’arrêt porté aux victoires allemandes.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('fbb736dc-e779-4186-b57c-54c4dd1b74cd', 17, 'quiz', 'Qu''est-ce que : Le tournant de 1942 ?', 'Qu''est-ce que : Le tournant de 1942 ?', '[{"id":"opt-0","text":"La bataille de Stalingrad est le symbole du coup d’arrêt porté aux victoires allemandes.","isCorrect":true},{"id":"opt-1","text":"1939-1942 : les victoires de l’Axe  Quelques petites définitions sont nécessaires avant de commencer cette partie.","isCorrect":false},{"id":"opt-2","text":"La Seconde Guerre mondiale débute le 1er septembre 1939 après l’invasion de la Pologne par l’Allemagne nazie.","isCorrect":false},{"id":"opt-3","text":"C’est la « guerre éclair » : des attaques très rapides de l’armée d’Hitler, qui utilise en même temps les chars blindés et les avions.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('fbb736dc-e779-4186-b57c-54c4dd1b74cd', 18, 'quiz', 'Qu''est-ce que : La victoire des Alliés ?', 'Qu''est-ce que : La victoire des Alliés ?', '[{"id":"opt-0","text":"De 1943 à 1945, l’Axe recule sur tous les fronts. Le débarquement en Sicile en 1943 oblige l’Italie à capituler.","isCorrect":true},{"id":"opt-1","text":"1939-1942 : les victoires de l’Axe  Quelques petites définitions sont nécessaires avant de commencer cette partie.","isCorrect":false},{"id":"opt-2","text":"La Seconde Guerre mondiale débute le 1er septembre 1939 après l’invasion de la Pologne par l’Allemagne nazie.","isCorrect":false},{"id":"opt-3","text":"C’est la « guerre éclair » : des attaques très rapides de l’armée d’Hitler, qui utilise en même temps les chars blindés et les avions.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('fbb736dc-e779-4186-b57c-54c4dd1b74cd', 19, 'quiz', 'Qu''est-ce que : Une guerre aux enjeux idéologiques et nationaux ?', 'Qu''est-ce que : Une guerre aux enjeux idéologiques et nationaux ?', '[{"id":"opt-0","text":"La bataille de Stalingrad, en 1942, permet d’illustrer l’idée de mobilisation totale durant la Seconde Guerre mondiale.","isCorrect":true},{"id":"opt-1","text":"1939-1942 : les victoires de l’Axe  Quelques petites définitions sont nécessaires avant de commencer cette partie.","isCorrect":false},{"id":"opt-2","text":"La Seconde Guerre mondiale débute le 1er septembre 1939 après l’invasion de la Pologne par l’Allemagne nazie.","isCorrect":false},{"id":"opt-3","text":"C’est la « guerre éclair » : des attaques très rapides de l’armée d’Hitler, qui utilise en même temps les chars blindés et les avions.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('fbb736dc-e779-4186-b57c-54c4dd1b74cd', 20, 'quiz', 'Qu''est-ce que : La bataille connait deux grandes phases ?', 'Qu''est-ce que : La bataille connait deux grandes phases ?', '[{"id":"opt-0","text":"de août à novembre 1942 : la ville de Stalingrad est assiégée par les Allemands, qui parviennent ensuite à y pénétrer ; de novembre 1942 à février 1943 : l’armée soviétique parvient à reprendre le contrôle et à encercler l’armée allemande.","isCorrect":true},{"id":"opt-1","text":"1939-1942 : les victoires de l’Axe  Quelques petites définitions sont nécessaires avant de commencer cette partie.","isCorrect":false},{"id":"opt-2","text":"La Seconde Guerre mondiale débute le 1er septembre 1939 après l’invasion de la Pologne par l’Allemagne nazie.","isCorrect":false},{"id":"opt-3","text":"C’est la « guerre éclair » : des attaques très rapides de l’armée d’Hitler, qui utilise en même temps les chars blindés et les avions.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('fbb736dc-e779-4186-b57c-54c4dd1b74cd', 21, 'quiz', 'Qu''est-ce que : L’exclusion des Juifs ?', 'Qu''est-ce que : L’exclusion des Juifs ?', '[{"id":"opt-0","text":"En 1933, les nazis avaient mis en place en Allemagne une politique antisémite, c’est-à-dire d’identification et d’exclusion des Juifs, privés alors de leurs principaux droits.","isCorrect":true},{"id":"opt-1","text":"1939-1942 : les victoires de l’Axe  Quelques petites définitions sont nécessaires avant de commencer cette partie.","isCorrect":false},{"id":"opt-2","text":"La Seconde Guerre mondiale débute le 1er septembre 1939 après l’invasion de la Pologne par l’Allemagne nazie.","isCorrect":false},{"id":"opt-3","text":"C’est la « guerre éclair » : des attaques très rapides de l’armée d’Hitler, qui utilise en même temps les chars blindés et les avions.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('fbb736dc-e779-4186-b57c-54c4dd1b74cd', 22, 'quiz', 'Qu''est-ce que : Les Einsatzgruppen et la conférence de Wannsee ?', 'Qu''est-ce que : Les Einsatzgruppen et la conférence de Wannsee ?', '[{"id":"opt-0","text":"C’est à partir de la tentative d’invasion de l’URSS par les nazis en 1941 que le processus d’extermination des Juifs et des Tsiganes débute.","isCorrect":true},{"id":"opt-1","text":"1939-1942 : les victoires de l’Axe  Quelques petites définitions sont nécessaires avant de commencer cette partie.","isCorrect":false},{"id":"opt-2","text":"La Seconde Guerre mondiale débute le 1er septembre 1939 après l’invasion de la Pologne par l’Allemagne nazie.","isCorrect":false},{"id":"opt-3","text":"C’est la « guerre éclair » : des attaques très rapides de l’armée d’Hitler, qui utilise en même temps les chars blindés et les avions.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('fbb736dc-e779-4186-b57c-54c4dd1b74cd', 23, 'quiz', 'Qu''est-ce que : C’est ce qu’on appelle « la Solution finale ». ?', 'Qu''est-ce que : C’est ce qu’on appelle « la Solution finale ». ?', '[{"id":"opt-0","text":"Les Juifs, ainsi que les Tsiganes, enfermés dans des ghettos ou dans des camps de transit, sont alors déportés par l’intermédiaire de wagons à bestiaux principalement vers des camps d’extermination.","isCorrect":true},{"id":"opt-1","text":"1939-1942 : les victoires de l’Axe  Quelques petites définitions sont nécessaires avant de commencer cette partie.","isCorrect":false},{"id":"opt-2","text":"La Seconde Guerre mondiale débute le 1er septembre 1939 après l’invasion de la Pologne par l’Allemagne nazie.","isCorrect":false},{"id":"opt-3","text":"C’est la « guerre éclair » : des attaques très rapides de l’armée d’Hitler, qui utilise en même temps les chars blindés et les avions.","isCorrect":false}]', NULL, NULL, 50);

INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'fbb736dc-e779-4186-b57c-54c4dd1b74cd', '2026-01-17', 1, 0, 5)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'fbb736dc-e779-4186-b57c-54c4dd1b74cd', '2026-01-18', 2, 6, 11)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'fbb736dc-e779-4186-b57c-54c4dd1b74cd', '2026-01-19', 3, 12, 17)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'fbb736dc-e779-4186-b57c-54c4dd1b74cd', '2026-01-20', 4, 18, 23)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;

-- Course: Les fonctions affines
INSERT INTO public.courses (id, user_id, title, description, category, level, estimated_minutes, icon, total_xp, is_published, duration_days, daily_cards_count)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', '00000000-0000-0000-0000-000000000001', 'Les fonctions affines', 'Cours de Mathématiques : Les fonctions affines', 'Mathématiques', '3eme', 15, '📚', 940, true, 9, 6);

INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 0, 'lesson', 'Introduction', 'Nous avons découvert dans le cours précédent ce qu’est une fonction linéaire. Dans ce chapitre, nous allons découvrir qu’il s’agit, en fait, d’un cas particulier de fonction affine.
Nous définirons les fonctions affines, avant de les représenter et d’en comprendre les paramètres. Des méthodes et une application seront aussi proposées.
Enfin, nous approfondirons un peu le sujet, en parlant de proportionnalité des accroissements.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 1, 'lesson', 'Fonction affine', 'Soit 
𝑎
a et 
𝑏
b deux nombres.
Une fonction affine est une fonction qui, à un nombre 
𝑥
x, associe le nombre 
𝑎
𝑥
+
𝑏
ax+b.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 2, 'lesson', 'On la note', '𝑓
:
𝑥
↦
𝑎
𝑥
+
𝑏
f:x↦ax+b

La fonction 
𝑓
f est définie par 
𝑓
(
𝑥
)
=
𝑎
𝑥
+
𝑏
f(x)=ax+b.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 3, 'lesson', 'Exemple', 'La fonction 
𝑓
f définie par 
𝑓
(
𝑥
)
=
3
,
5
𝑥
+
2
f(x)=3,5x+2 est une fonction affine.

En effet, on a bien : 
𝑓
(
𝑥
)
=
𝑎
𝑥
+
𝑏
f(x)=ax+b, avec 
𝑎
=
3
,
5
a=3,5 et 
𝑏
=
2
b=2.

La fonction 
𝑔
g définie par 
𝑔
(
𝑥
)
=
−
𝑥
−
4
g(x)=−x−4 est une fonction affine.

En effet, on peut écrire : 
𝑔
(
𝑥
)
=
−
1
𝑥
+
(
−
4
)
g(x)=−1x+(−4).
On a donc bien : 
𝑔
(
𝑥
)
=
𝑎
𝑥
+
𝑏
g(x)=ax+b, avec 
𝑎
=
−
1
a=−1 et 
𝑏
=
−
4
b=−4.

La fonction 
ℎ
h définie par 
ℎ
(
𝑥
)
=
0
,
7
𝑥
h(x)=0,7x est une fonction affine.

En effet, on peut écrire : 
ℎ
(
𝑥
)
=
0
,
7
𝑥
+
0
h(x)=0,7x+0.
On a donc bien : 
𝑔
(
𝑥
)
=
𝑎
𝑥
+
𝑏
g(x)=ax+b, avec 
𝑎
=
0
,
7
a=0,7 et 
𝑏
=
0
b=0.
On remarque que 
ℎ
h est une fonction linéaire, qui est en fait un cas particulier d’une fonction affine, où 
𝑏
=
0
b=0.

La fonction 
𝑙
l définie par 
𝑙
(
𝑥
)
=
−
2
,
2
l(x)=−2,2 est une fonction affine.

En effet, on peut écrire : 
𝑙
(
𝑥
)
=
0
𝑥
+
(
−
2
,
2
)
l(x)=0x+(−2,2).
On a donc bien : 
𝑙
(
𝑥
)
=
𝑎
𝑥
+
𝑏
l(x)=ax+b, avec 
𝑎
=
0
a=0 et 
𝑏
=
−
2
,
2
b=−2,2.
On remarque que tous les nombres ont la même image par la fonction 
𝑙
l.

𝑙
l est appelée fonction constante, qui est une fonction affine où 
𝑎
=
0
a=0.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 4, 'lesson', 'À retenir', 'Une fonction affine où 
𝑏
b est nul est une fonction linéaire.
Le coefficient de la fonction linéaire vaut alors 
𝑎
a.
Une fonction affine où 
𝑎
a est nul est une fonction constante.
Par une fonction constante, tous les nombres ont la même image, égale à 
𝑏
b.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 5, 'lesson', 'Propriété', 'Si une fonction est affine, alors sa représentation graphique est une droite.
Réciproquement, si la représentation graphique d’une fonction est une droite, alors la fonction est affine.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 6, 'lesson', 'Exemple', 'On donne ci-dessous, dans un même repère, les représentations graphiques des fonctions 
𝑓
f, 
𝑔
g, 
ℎ
h et 
𝑙
l, que nous avons définies dans le paragraphe précédent :

𝑓
:
𝑥
	
↦
3
,
5
𝑥
+
2


𝑔
:
𝑥
	
↦
−
𝑥
−
4


ℎ
:
𝑥
	
↦
0
,
7
𝑥


𝑙
:
𝑥
	
↦
−
2
,
2
f:x
g:x
h:x
l:x
	​

↦3,5x+2
↦−x−4
↦0,7x
↦−2,2
	​', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 7, 'lesson', 'On remarque, à partir des exemples donnés ci-dessus que', 'la représentation graphique d’une fonction linéaire est une droite passant par l’origine – ce que nous savions déjà ;
la représentation graphique d’une fonction constante est une droite parallèle à l’axe des abscisses.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 8, 'lesson', 'Coefficient directeur et ordonnée à l’origine', 'Soit 
𝑓
f une fonction affine définie par 
𝑓
(
𝑥
)
=
𝑎
𝑥
+
𝑏
f(x)=ax+b, avec 
𝑎
a et 
𝑏
b deux nombres.
On note 
𝐷
D sa représentation graphique, qui est une droite.

𝑎
a est appelé coefficient directeur, ou pente, de 
𝐷
D;
𝑏
b est appelé ordonnée à l’origine de 
𝐷
D.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 9, 'lesson', 'À retenir', 'Le coefficient directeur peut s’interpréter ainsi : en parcourant la droite, quand on augmente de 
1
1 l’abscisse, l’ordonnée varie de 
𝑎
a :

si le coefficient directeur est positif, elle « monte » ;
si le coefficient directeur est négatif, elle « descend ».

𝑏
b est appelé ordonnée à l’origine car c’est l’ordonnée du point de 
𝐷
D d’abscisse 
0
0, soit l’ordonnée du point d’intersection de 
𝐷
D avec l’axe des ordonnées.

Autrement dit encore, 
𝑏
b est l’image de 
0
0 par la fonction 
𝑓
f :

𝑓
(
0
)
=
𝑎
×
0
+
𝑏
=
𝑏
f(0)=a×0+b=b', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 10, 'lesson', 'Exemple', 'On considère 
𝑓
f la fonction affine définie par 
𝑓
(
𝑥
)
=
−
0
,
5
𝑥
+
3
f(x)=−0,5x+3 et 
𝐷
D sa représentation graphique.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 11, 'lesson', 'Méthode : Comment représenter graphiquement une fonction affine', 'Soit 
𝑓
f une fonction affine définie par 
𝑓
(
𝑥
)
=
𝑎
𝑥
+
𝑏
f(x)=ax+b, avec 
𝑎
a et 
𝑏
b deux nombres donnés. Dans un repère, pour construire sa représentation graphique, qui est une droite, il suffit de connaître les coordonnées de deux points.

L’ordonnée à l’origine 
𝑏
b permet de trouver rapidement les coordonnées du premier point : 
(
0
 
;
𝑏
)
(0 ;b) (il est sur l’axe des ordonnées).
Pour en trouver un second, on se sert de l’expression algébrique pour trouver l’image 
𝑓
(
𝑐
)
f(c) d’un nombre 
𝑐
c, que l’on choisit assez éloigné du premier point pour un tracé plus précis, et avec une valeur qui facilite le calcul.
Ce second point aura alors pour coordonnées 
(
𝑐
 
;
𝑓
(
𝑐
)
)
(c ;f(c)).
En traçant la droite qui passe par les deux points, on obtient la représentation graphique de 
𝑓
f.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 12, 'lesson', 'Exemple', 'Soit 
𝑓
f la fonction affine définie par 
𝑓
(
𝑥
)
=
1
,
5
𝑥
+
4
,
5
f(x)=1,5x+4,5.
Pour construire sa représentation graphique :

on commence par construire le point 
𝐵
B, de coordonnées 
(
0
 
;
4
,
5
)
(0 ;4,5) ;
puis on calcule l’image, par exemple, de 
2
2 :

𝑓
(
2
)
=
1
,
5
×
2
+
4
,
5
=
7
,
5
f(2)=1,5×2+4,5=7,5

on peut alors placer le point 
𝐴
A de coordonnées 
(
2
 
;
7
,
5
)
(2 ;7,5) ;
on trace la droite 
(
𝐴
𝐵
)
(AB), ce qui nous donne la représentation graphique de 
𝑓
f.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 13, 'lesson', 'À retenir', 'Méthode : Comment déterminer graphiquement les paramètres 
𝑎
a et 
𝑏
b d’une fonction affine

Soit 
𝑓
f une fonction affine dont on connaît la représentation graphique dans un repère.

𝑓
f, comme fonction affine, est définie par 
𝑓
(
𝑥
)
=
𝑎
𝑥
+
𝑏
f(x)=ax+b, avec 
𝑎
a et 
𝑏
b deux nombres que l’on cherche à déterminer.

Pour déterminer 
𝑏
b, on lit l’ordonnée du point d’intersection de la droite avec l’axe des ordonnées.
On détermine ainsi l’ordonnée à l’origine de la droite, qui est égale à 
𝑏
b.
On choisit un point de la droite, et on regarde, quand on « avance » de 
1
1 en abscisse, de combien on « monte » ou « descend » en ordonnée.
Cette valeur donne le coefficient directeur de la droite (positif si on est « monté », négatif si on est « descendu »), qui est égal à 
𝑎
a.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 14, 'lesson', 'Exemple', 'On donne ci-contre la représentation graphique de la fonction affine 
𝑓
f.
On cherche à déterminer l’expression algébrique qui définit 
𝑓
f. Autrement dit, on cherche à déterminer 
𝑎
a et 
𝑏
b dans l’expression :

𝑓
(
𝑥
)
=
𝑎
𝑥
+
𝑏
f(x)=ax+b', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 15, 'lesson', 'Représentation graphique de la fonction affine f', 'Pour déterminer 
𝑎
a et 
𝑏
b, on regarde donc :

l’ordonnée du point d’intersection de la droite et de l’axe des ordonnées ;
de combien on « monte » ou « descend » en ordonnée quand on « avance » de 
1
1 en abscisse, par exemple en partant du point de la droite de coordonnées 
(
1
 
;
−
5
)
(1 ;−5).', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 16, 'lesson', 'Coefficient directeur et ordonnée à l’origine de la droite', 'Le coefficient directeur de la droite vaut ainsi 
−
3
−3, et l’ordonnée à l’origine 
−
2
−2.

La fonction 
𝑓
f est définie par l’expression algébrique :

𝑓
(
𝑥
)
=
−
3
𝑥
−
2
f(x)=−3x−2', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 17, 'lesson', 'Application', 'Nous proposons ici d’appliquer ce que nous avons appris sur les fonctions affines à travers un exercice corrigé, adapté d’un sujet de brevet (centres étrangers, juin 2011).', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 18, 'lesson', 'Énoncé', 'Une école décide de tester un logiciel pour gérer sa bibliothèque. Après une période d’essai d’un mois, elle décide d’acheter le logiciel.
Il y a trois tarifs :

tarif F : 
19
 €
19 € ;
tarif G : 
10
10 centimes par élève ;
tarif H : 
8
 €
+
5
8 €+5 centimes par élève.
Compléter le tableau suivant :', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 19, 'lesson', 'Nombre d’élèves', '100
100

	

200
200

	

300
300', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 20, 'lesson', 'Tarif F', '19
,
00
 €
19,00 €', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 21, 'lesson', 'Tarif G', '30
,
00
 €
30,00 €', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 22, 'lesson', 'Tarif H', '18
,
00
 €
18,00 €

	

Si 
𝑥
x est le nombre d’élèves de l’école, laquelle des fonctions suivantes correspond au tarif H ?

𝑥
↦
8
+
5
𝑥
𝑥
↦
8
+
0
,
05
𝑥
𝑥
↦
0
,
05
+
8
𝑥
x↦8+5xx↦8+0,05xx↦0,05+8x

On note cette fonction 
ℎ
h. Quelle est la nature de cette fonction ?
On note maintenant 
𝑓
f la fonction qui correspond au tarif F, et 
𝑔
g celle qui correspond au tarif G.
Donner les expressions algébriques qui définissent 
𝑓
f et 
𝑔
g. Préciser leurs natures en étant le plus précis possible.
On a tracé dans un repère les représentations graphiques des fonctions 
𝑓
f, 
𝑔
g et 
ℎ
h, que l’on a nommées arbitrairement 
𝐷
1
D
1
	​

, 
𝐷
2
D
2
	​

 et 
𝐷
3
D
3
	​

 :', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 23, 'lesson', 'Retrouver quelle droite représente quelle fonction.', 'À l’aide du graphique, déterminer à partir de combien d’élèves le tarif F est plus intéressant que le tarif H.
L’école compte 
209
209 élèves.
Quel tarif est le plus intéressant ? Combien paiera alors l’école ?
Corrigé
Tableau de valeurs
Pour le tarif F, le prix reste fixe quel que soit le nombre d’élèves. Le montant payé sera donc toujours de 
19
 €
19 €, qu’il y ait 
100
100, 
200
200 ou 
300
300 élèves.
Pour le tarif G, on paye un prix de 
10
10 centimes par élève. Il suffit donc de multiplier ce prix par le nombre d’élèves :

Pour 100 
e
ˊ
l
e
ˋ
ves : 
0
,
10
×
100
	
=
10


Pour 200 
e
ˊ
l
e
ˋ
ves : 
0
,
10
×
200
	
=
20
Pour 100 
e
ˊ
l
e
ˋ
ves : 0,10×100
Pour 200 
e
ˊ
l
e
ˋ
ves : 0,10×200
	​

=10
=20
	​


On peut vérifier qu’avec cette logique on trouve le résultat donné pour 
300
300 élèves :

0
,
10
×
300
=
30
0,10×300=30', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 24, 'lesson', 'Attention', 'Les réponses attendues sont à exprimer en euro, il faut bien penser à écrire 
10
10 centimes sous la forme 
0
,
10
 €
0,10 €.

Enfin, pour le tarif H, on paie un forfait de 
8
 €
8 €, puis 
5
5 centimes par élève. Il faut donc ajouter, aux 
8
 €
8 € forfaitaires, le produit de 
0
,
05
 €
0,05 € par le nombre d’élèves :

Pour 100 
e
ˊ
l
e
ˋ
ves : 
8
+
0
,
05
×
100
	
=
8
+
5
=
13


Pour 300 
e
ˊ
l
e
ˋ
ves : 
8
+
0
,
05
×
300
	
=
8
+
15
=
23
Pour 100 
e
ˊ
l
e
ˋ
ves : 8+0,05×100
Pour 300 
e
ˊ
l
e
ˋ
ves : 8+0,05×300
	​

=8+5=13
=8+15=23
	​


On trouve bien le même résultat que celui donné pour 
200
200 élèves :

8
+
0
,
05
×
200
=
8
+
10
=
18
8+0,05×200=8+10=18', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 25, 'lesson', 'Nombre d’élèves', '100
100

	

200
200

	

300
300', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 26, 'lesson', 'Tarif F', '19
,
00
 €
19,00 €

	

19
,
00
 €
19,00 €

	

19
,
00
 €
19,00 €', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 27, 'lesson', 'Tarif G', '10
,
00
 €
10,00 €

	

20
,
00
 €
20,00 €

	

30
,
00
 €
30,00 €', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 28, 'lesson', 'Tarif H', '13
,
00
 €
13,00 €

	

18
,
00
 €
18,00 €

	

23
,
00
 €
23,00 €', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 29, 'lesson', 'Fonction correspondant au tarif H', 'Pour le tarif H, on ajoute, aux 
8
 €
8 € forfaitaires, le produit de 
0
,
05
 €
0,05 € par le nombre d’élèves, soit 
𝑥
x.
La fonction qui correspond au tarif H est donc la deuxième :

𝑥
↦
8
+
0
,
05
𝑥
x↦8+0,05x
	​


Nature de la fonction 
ℎ
h

On a donc : 
ℎ
:
𝑥
↦
8
+
0
,
05
𝑥
h:x↦8+0,05x.
Si on préfère, on peut écrire : 
ℎ
(
𝑥
)
=
0
,
05
𝑥
+
8
h(x)=0,05x+8.
On reconnaît alors en 
ℎ
h une fonction de la forme : 
ℎ
(
𝑥
)
=
𝑎
𝑥
+
𝑏
h(x)=ax+b, avec 
𝑎
=
0
,
05
a=0,05 et 
𝑏
=
8
b=8.

ℎ
h est donc une fonction affine.

Fonctions 
𝑓
f et 
𝑔
g

𝑓
f est la fonction qui correspond au tarif F, où le prix de 
19
 €
19 € est fixe. La fonction 
𝑓
f, correspondant au tarif F, est donc définie par :

𝑓
(
𝑥
)
=
19
f(x)=19
	​


𝑓
f est une fonction affine, de la forme 
𝑓
(
𝑥
)
=
𝑎
𝑥
+
𝑏
f(x)=ax+b, avec 
𝑎
=
0
a=0 et 
𝑏
=
19
b=19. Cela signifie que, quel que soit le nombre 
𝑥
x, son image par 
𝑓
f est égale à 
19
19.

𝑓
f est une fonction constante.

𝑔
g est la fonction qui correspond au tarif G, où l’on paye 
0
,
10
 €
0,10 € par élève. La fonction 
𝑔
g, correspondant au tarif G, est donc définie par :

𝑔
(
𝑥
)
=
0
,
1
𝑥
g(x)=0,1x
	​


𝑔
g est une fonction affine, de la forme 
𝑔
(
𝑥
)
=
𝑎
𝑥
+
𝑏
g(x)=ax+b, avec 
𝑎
=
0
,
1
a=0,1 et 
𝑏
=
0
b=0.
Puisque 
𝑏
=
0
b=0, 
𝑔
g est une fonction linéaire de coefficient 
0
,
1
0,1. Cela signifie que, avec le tarif G, le tarif à payer par l’école est proportionnel au nombre d’élèves.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 30, 'lesson', 'Représentations graphiques des fonctions', 'On voit que la droite 
𝐷
1
D
1
	​

 passe par l’origine.

Or on sait que, dans ce cas, c’est la représentation graphique d’une fonction linéaire. Et, on l’a dit plus haut, 
𝑔
g est la seule fonction linéaire parmi les trois.

𝐷
1
D
1
	​

 est la représentation graphique de la fonction 
𝑔
g. On peut la noter, pour plus de clarté, 
𝐶
𝑔
C
g
	​

.

Ensuite, on remarque que 
𝐷
3
D
3
	​

 est « horizontale », plus précisément parallèle à l’axe des abscisses.

Il s’agit donc de la représentation graphique d’une fonction constante. Et 
𝑓
f est la seule fonction constante parmi les trois. On peut confirmer cette correspondance en vérifiant avec la droite que toutes les images sont bien égales à 
19
19.

𝐷
3
D
3
	​

 est la représentation graphique de la fonction 
𝑓
f. On la note désormais 
𝐶
𝑓
C
f
	​

.

Enfin, par élimination, on sait que 
𝐷
2
D
2
	​

 est la représentation graphique de la fonction 
ℎ
h, que l’on note 
𝐶
ℎ
C
h
	​

.

On peut là aussi vérifier que l’ordonnée à l’origine est bien égale à 
8
8.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 31, 'lesson', 'Comparaison des tarifs F et H.', 'Regardons les représentations graphiques de 
𝑓
f et 
ℎ
h.

Au début, 
𝐶
𝑓
C
f
	​

 est « au-dessus » de 
𝐶
ℎ
C
h
	​

.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 32, 'lesson', 'Cela signifie que, si les élèves sont peu nombreux, le tarif F reviendra plus cher que le H.', 'Mais au bout d’un certain nombre d’élèves, c’est 
𝐶
ℎ
C
h
	​

 qui passe « au-dessus » de 
𝐶
𝑓
C
f
	​

.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 33, 'lesson', 'Le tarif F devient alors plus intéressant.', 'Ainsi, pour savoir à partir de combien d’élèves le tarif F devient plus intéressant, il faut s’intéresser au point d’intersection des deux droites, que l’on peut noter 
𝐼
I.

L’abscisse de 
𝐼
I donnera le nombre d’élèves pour lesquels les tarifs F et H sont égaux.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 34, 'lesson', 'I, point d’intersection des représentations graphiques de f et h', 'On lit graphiquement que l’abscisse de 
𝐼
I est 
220
220. Cela signifie que, pour 
220
220 élèves, les tarifs F et H sont égaux. Ce qu’on peut vérifier :

𝑓
(
220
)
	
=
19


ℎ
(
220
)
	
=
8
+
0
,
05
×
220
=
19
f(220)
h(220)
	​

=19
=8+0,05×220=19
	​


Ainsi, pour plus de 
220
220 élèves, le tarif F est plus avantageux que le tarif H.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 35, 'lesson', 'Quel tarif choisir pour l’école ?', 'Il y a 
209
209 élèves dans l’école.
On peut là aussi travailler graphiquement, en déterminant les images de 
209
209 par 
𝑓
f, 
𝑔
g et 
ℎ
h. Pour cela, on trace la parallèle à l’axe des ordonnées qui passe par le point de coordonnées 
(
209
 
;
0
)
(209 ;0).', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 36, 'lesson', 'Tarif le plus intéressant pour 209 élèves', 'On voit que la droite rouge coupe 
𝐶
ℎ
C
h
	​

 « plus bas » que 
𝐶
𝑓
C
f
	​

 et 
𝐶
𝑔
C
g
	​

. Cela signifie que l’image de 
209
209 par 
ℎ
h est inférieure à celles par 
𝑓
f et 
𝑔
g.
Ainsi, l’école de 
209
209 élèves a tout intérêt à choisir le tarif H, qui lui reviendra le moins cher.

Pour savoir combien l’école paiera avec ce tarif H, on choisit de le faire avec l’expression algébrique, pour avoir une valeur exacte :

ℎ
(
209
)
=
8
+
0
,
05
×
209
=
18
,
45
h(209)=8+0,05×209=
18,45
	​


L’achat du logiciel coûtera, avec le tarif H, 
18
,
45
 €
18,45 € à l’école.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 37, 'lesson', 'Proportionnalité des accroissements (approfondissement)', 'Dans cette partie, nous allons aller un peu plus loin, en traitant une notion qui n’est pas exigible en troisième. Elle est toutefois intéressante et vous permettra de vous projeter sur la classe de seconde.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 38, 'lesson', 'Propriété', '𝑎
a et 
𝑏
b sont des nombres donnés.
On considère 
𝑓
f, une fonction affine définie par 
𝑓
(
𝑥
)
=
𝑎
𝑥
+
𝑏
f(x)=ax+b.

Soit maintenant deux nombres 
𝑥
1
x
1
	​

 et 
𝑥
2
x
2
	​

, qui sont différents.
On s’intéresse à l’accroissement de 
𝑓
(
𝑥
)
f(x) entre 
𝑥
1
x
1
	​

 et 
𝑥
2
x
2
	​

, c’est-à dire à la différence 
𝑓
(
𝑥
2
)
−
𝑓
(
𝑥
1
)
f(x
2
	​

)−f(x
1
	​

) :

𝑓
(
𝑥
2
)
−
𝑓
(
𝑥
1
)
	
=
𝑎
𝑥
2
+
𝑏
−
(
𝑎
𝑥
1
+
𝑏
)


	
=
𝑎
𝑥
2
+
𝑏
−
𝑎
𝑥
1
−
𝑏


	
=
𝑎
𝑥
2
−
𝑎
𝑥
1


	
=
𝑎
(
𝑥
2
−
𝑥
1
)
 [en factorisant par 
𝑎
]
f(x
2
	​

)−f(x
1
	​

)
	​

=ax
2
	​

+b−(ax
1
	​

+b)
=ax
2
	​

+b−ax
1
	​

−b
=ax
2
	​

−ax
1
	​

=a(x
2
	​

−x
1
	​

) [en factorisant par a]
	​


On en déduit, comme 
𝑥
1
≠
𝑥
2
x
1
	​


	​

=x
2
	​

 (et donc 
𝑥
2
−
𝑥
1
≠
0
x
2
	​

−x
1
	​


	​

=0) :

𝑎
=
𝑓
(
𝑥
2
)
−
𝑓
(
𝑥
1
)
𝑥
2
−
𝑥
1
a=
x
2
	​

−x
1
	​

f(x
2
	​

)−f(x
1
	​

)
	​


Pour une fonction affine, il y a ainsi proportionnalité entre les accroissements de 
𝑥
x et de 
𝑓
(
𝑥
)
f(x) : la variation de 
𝑓
(
𝑥
)
f(x) est proportionnelle à la variation de 
𝑥
x, et le coefficient de proportionnalité est 
𝑎
a.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 39, 'lesson', 'Propriété', 'Soit 
𝑓
f la fonction affine définie par 
𝑓
(
𝑥
)
=
𝑎
𝑥
+
𝑏
f(x)=ax+b, avec 
𝑎
a et 
𝑏
b deux nombres.
Quels que soient les nombres 
𝑥
1
x
1
	​

 et 
𝑥
2
x
2
	​

, avec 
𝑥
1
≠
𝑥
2
x
1
	​


	​

=x
2
	​

, on a :

𝑎
=
𝑓
(
𝑥
2
)
−
𝑓
(
𝑥
1
)
𝑥
2
−
𝑥
1
a=
x
2
	​

−x
1
	​

f(x
2
	​

)−f(x
1
	​

)
	​', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 40, 'lesson', 'Astuce', 'On a aussi : 
𝑎
=
𝑓
(
𝑥
1
)
−
𝑓
(
𝑥
2
)
𝑥
1
−
𝑥
2
a=
x
1
	​

−x
2
	​

f(x
1
	​

)−f(x
2
	​

)
	​

.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 41, 'lesson', 'Application', 'La propriété que nous venons de voir permet notamment de déterminer l’expression algébrique qui définit une fonction affine en connaissant les images de deux nombres différents.

On considère la fonction affine 
𝑓
f telle que :

𝑓
(
−
2
)
=
−
16
f(−2)=−16 ;
𝑓
(
4
)
=
11
f(4)=11.

𝑓
f, comme fonction affine, est de la forme 
𝑓
(
𝑥
)
=
𝑎
𝑥
+
𝑏
f(x)=ax+b, avec 
𝑎
a et 
𝑏
b deux nombres à déterminer.

Recherche du coefficient 
𝑎
a

On se sert de la propriété sur les accroissements pour déterminer 
𝑎
a :

𝑎
	
=
𝑓
(
4
)
−
𝑓
(
−
2
)
4
−
(
−
2
)


	
=
11
−
(
−
16
)
4
+
2


	
=
11
+
16
6


	
=
27
6


	
=
4
,
5
a
	​

=
4−(−2)
f(4)−f(−2)
	​

=
4+2
11−(−16)
	​

=
6
11+16
	​

=
6
27
	​

=4,5
	​


Le coefficient directeur 
𝑎
a de 
𝑓
f vaut donc 
4
,
5
4,5.

Recherche de 
𝑏
b

On a donc, grâce au point précédent : 
𝑓
(
𝑥
)
=
4
,
5
𝑥
+
𝑏
f(x)=4,5x+b.
On se sert d’un des deux nombres dont on connaît l’image, par exemple 
4
4, dont l’image est égale à 
11
11 :

𝑓
(
4
)
	
=
11


𝑓
(
4
)
	
=
4
,
5
×
4
+
𝑏
=
18
+
𝑏
f(4)
f(4)
	​

=11
=4,5×4+b=18+b
	​', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 42, 'lesson', 'On obtient ainsi', '18
+
𝑏
=
11
18+b=11

Il suffit donc de résoudre cette équation, d’inconnue 
𝑏
b. On sait le faire et on obtient :

𝑏
=
11
−
18
=
−
7
b=11−18=−7', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 43, 'lesson', 'On obtient finalement', '𝑓
(
𝑥
)
=
4
,
5
𝑥
−
7
f(x)=4,5x−7
	​


On peut vérifier notre résultat, en calculant avec cette expression les images de 
−
2
−2 et 
4
4, pour voir si l’on trouve les bonnes :

𝑓
(
−
2
)
	
=
4
,
5
×
(
−
2
)
−
7
=
−
9
−
7
=
−
16


𝑓
(
4
)
	
=
4
,
5
×
4
−
7
=
−
18
−
7
=
11
f(−2)
f(4)
	​

=4,5×(−2)−7=−9−7=−16
=4,5×4−7=−18−7=11
	​', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 44, 'quiz', 'Qu''est-ce que : Fonction affine ?', 'Qu''est-ce que : Fonction affine ?', '[{"id":"opt-0","text":"Soit  𝑎 a et  𝑏 b deux nombres. Une fonction affine est une fonction qui, à un nombre  𝑥 x, associe le nombre  𝑎 𝑥 + 𝑏 ax+b.","isCorrect":true},{"id":"opt-1","text":"𝑓 : 𝑥 ↦ 𝑎 𝑥 + 𝑏 f:x↦ax+b  La fonction  𝑓 f est définie par  𝑓 ( 𝑥 ) = 𝑎 𝑥 + 𝑏 f(x)=ax+b.","isCorrect":false},{"id":"opt-2","text":"Si une fonction est affine, alors sa représentation graphique est une droite. Réciproquement, si la représentation graphique d’une fonction est une droite, alors la fonction est affine.","isCorrect":false},{"id":"opt-3","text":"la représentation graphique d’une fonction linéaire est une droite passant par l’origine – ce que nous savions déjà ; la représentation graphique d’une fonction constante est une droite parallèle à l’axe des abscisses.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 45, 'quiz', 'Qu''est-ce que : On la note ?', 'Qu''est-ce que : On la note ?', '[{"id":"opt-0","text":"𝑓 : 𝑥 ↦ 𝑎 𝑥 + 𝑏 f:x↦ax+b  La fonction  𝑓 f est définie par  𝑓 ( 𝑥 ) = 𝑎 𝑥 + 𝑏 f(x)=ax+b.","isCorrect":true},{"id":"opt-1","text":"Soit  𝑎 a et  𝑏 b deux nombres. Une fonction affine est une fonction qui, à un nombre  𝑥 x, associe le nombre  𝑎 𝑥 + 𝑏 ax+b.","isCorrect":false},{"id":"opt-2","text":"Si une fonction est affine, alors sa représentation graphique est une droite. Réciproquement, si la représentation graphique d’une fonction est une droite, alors la fonction est affine.","isCorrect":false},{"id":"opt-3","text":"la représentation graphique d’une fonction linéaire est une droite passant par l’origine – ce que nous savions déjà ; la représentation graphique d’une fonction constante est une droite parallèle à l’axe des abscisses.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 46, 'quiz', 'Qu''est-ce que : Propriété ?', 'Qu''est-ce que : Propriété ?', '[{"id":"opt-0","text":"Si une fonction est affine, alors sa représentation graphique est une droite. Réciproquement, si la représentation graphique d’une fonction est une droite, alors la fonction est affine.","isCorrect":true},{"id":"opt-1","text":"Soit  𝑎 a et  𝑏 b deux nombres. Une fonction affine est une fonction qui, à un nombre  𝑥 x, associe le nombre  𝑎 𝑥 + 𝑏 ax+b.","isCorrect":false},{"id":"opt-2","text":"𝑓 : 𝑥 ↦ 𝑎 𝑥 + 𝑏 f:x↦ax+b  La fonction  𝑓 f est définie par  𝑓 ( 𝑥 ) = 𝑎 𝑥 + 𝑏 f(x)=ax+b.","isCorrect":false},{"id":"opt-3","text":"la représentation graphique d’une fonction linéaire est une droite passant par l’origine – ce que nous savions déjà ; la représentation graphique d’une fonction constante est une droite parallèle à l’axe des abscisses.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 47, 'quiz', 'Qu''est-ce que : On remarque, à partir des exemples donnés ci-dessus que ?', 'Qu''est-ce que : On remarque, à partir des exemples donnés ci-dessus que ?', '[{"id":"opt-0","text":"la représentation graphique d’une fonction linéaire est une droite passant par l’origine – ce que nous savions déjà ; la représentation graphique d’une fonction constante est une droite parallèle à l’axe des abscisses.","isCorrect":true},{"id":"opt-1","text":"Soit  𝑎 a et  𝑏 b deux nombres. Une fonction affine est une fonction qui, à un nombre  𝑥 x, associe le nombre  𝑎 𝑥 + 𝑏 ax+b.","isCorrect":false},{"id":"opt-2","text":"𝑓 : 𝑥 ↦ 𝑎 𝑥 + 𝑏 f:x↦ax+b  La fonction  𝑓 f est définie par  𝑓 ( 𝑥 ) = 𝑎 𝑥 + 𝑏 f(x)=ax+b.","isCorrect":false},{"id":"opt-3","text":"Si une fonction est affine, alors sa représentation graphique est une droite. Réciproquement, si la représentation graphique d’une fonction est une droite, alors la fonction est affine.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 48, 'quiz', 'Qu''est-ce que : Coefficient directeur et ordonnée à l’origine ?', 'Qu''est-ce que : Coefficient directeur et ordonnée à l’origine ?', '[{"id":"opt-0","text":"Soit  𝑓 f une fonction affine définie par  𝑓 ( 𝑥 ) = 𝑎 𝑥 + 𝑏 f(x)=ax+b, avec  𝑎 a et  𝑏 b deux nombres.","isCorrect":true},{"id":"opt-1","text":"Soit  𝑎 a et  𝑏 b deux nombres. Une fonction affine est une fonction qui, à un nombre  𝑥 x, associe le nombre  𝑎 𝑥 + 𝑏 ax+b.","isCorrect":false},{"id":"opt-2","text":"𝑓 : 𝑥 ↦ 𝑎 𝑥 + 𝑏 f:x↦ax+b  La fonction  𝑓 f est définie par  𝑓 ( 𝑥 ) = 𝑎 𝑥 + 𝑏 f(x)=ax+b.","isCorrect":false},{"id":"opt-3","text":"Si une fonction est affine, alors sa représentation graphique est une droite. Réciproquement, si la représentation graphique d’une fonction est une droite, alors la fonction est affine.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 49, 'quiz', 'Qu''est-ce que : Méthode : Comment représenter graphiquement une fonction affine ?', 'Qu''est-ce que : Méthode : Comment représenter graphiquement une fonction affine ?', '[{"id":"opt-0","text":"Soit  𝑓 f une fonction affine définie par  𝑓 ( 𝑥 ) = 𝑎 𝑥 + 𝑏 f(x)=ax+b, avec  𝑎 a et  𝑏 b deux nombres donnés.","isCorrect":true},{"id":"opt-1","text":"Soit  𝑎 a et  𝑏 b deux nombres. Une fonction affine est une fonction qui, à un nombre  𝑥 x, associe le nombre  𝑎 𝑥 + 𝑏 ax+b.","isCorrect":false},{"id":"opt-2","text":"𝑓 : 𝑥 ↦ 𝑎 𝑥 + 𝑏 f:x↦ax+b  La fonction  𝑓 f est définie par  𝑓 ( 𝑥 ) = 𝑎 𝑥 + 𝑏 f(x)=ax+b.","isCorrect":false},{"id":"opt-3","text":"Si une fonction est affine, alors sa représentation graphique est une droite. Réciproquement, si la représentation graphique d’une fonction est une droite, alors la fonction est affine.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 50, 'quiz', 'Qu''est-ce que : Représentation graphique de la fonction affine f ?', 'Qu''est-ce que : Représentation graphique de la fonction affine f ?', '[{"id":"opt-0","text":"Pour déterminer  𝑎 a et  𝑏 b, on regarde donc :  l’ordonnée du point d’intersection de la droite et de l’axe des ordonnées ; de combien on « monte » ou « descend » en ordonnée quand on « avance » de  1 1 en abscisse, par exemple en partant du point de la droite de coordonnées  ( 1   ; − 5 ) (1 ;−5).","isCorrect":true},{"id":"opt-1","text":"Soit  𝑎 a et  𝑏 b deux nombres. Une fonction affine est une fonction qui, à un nombre  𝑥 x, associe le nombre  𝑎 𝑥 + 𝑏 ax+b.","isCorrect":false},{"id":"opt-2","text":"𝑓 : 𝑥 ↦ 𝑎 𝑥 + 𝑏 f:x↦ax+b  La fonction  𝑓 f est définie par  𝑓 ( 𝑥 ) = 𝑎 𝑥 + 𝑏 f(x)=ax+b.","isCorrect":false},{"id":"opt-3","text":"Si une fonction est affine, alors sa représentation graphique est une droite. Réciproquement, si la représentation graphique d’une fonction est une droite, alors la fonction est affine.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 51, 'quiz', 'Qu''est-ce que : Coefficient directeur et ordonnée à l’origine de la droite ?', 'Qu''est-ce que : Coefficient directeur et ordonnée à l’origine de la droite ?', '[{"id":"opt-0","text":"Le coefficient directeur de la droite vaut ainsi  − 3 −3, et l’ordonnée à l’origine  − 2 −2.  La fonction  𝑓 f est définie par l’expression algébrique :  𝑓 ( 𝑥 ) = − 3 𝑥 − 2 f(x)=−3x−2","isCorrect":true},{"id":"opt-1","text":"Soit  𝑎 a et  𝑏 b deux nombres. Une fonction affine est une fonction qui, à un nombre  𝑥 x, associe le nombre  𝑎 𝑥 + 𝑏 ax+b.","isCorrect":false},{"id":"opt-2","text":"𝑓 : 𝑥 ↦ 𝑎 𝑥 + 𝑏 f:x↦ax+b  La fonction  𝑓 f est définie par  𝑓 ( 𝑥 ) = 𝑎 𝑥 + 𝑏 f(x)=ax+b.","isCorrect":false},{"id":"opt-3","text":"Si une fonction est affine, alors sa représentation graphique est une droite. Réciproquement, si la représentation graphique d’une fonction est une droite, alors la fonction est affine.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 52, 'quiz', 'Qu''est-ce que : Application ?', 'Qu''est-ce que : Application ?', '[{"id":"opt-0","text":"Nous proposons ici d’appliquer ce que nous avons appris sur les fonctions affines à travers un exercice corrigé, adapté d’un sujet de brevet (centres étrangers, juin 2011).","isCorrect":true},{"id":"opt-1","text":"Soit  𝑎 a et  𝑏 b deux nombres. Une fonction affine est une fonction qui, à un nombre  𝑥 x, associe le nombre  𝑎 𝑥 + 𝑏 ax+b.","isCorrect":false},{"id":"opt-2","text":"𝑓 : 𝑥 ↦ 𝑎 𝑥 + 𝑏 f:x↦ax+b  La fonction  𝑓 f est définie par  𝑓 ( 𝑥 ) = 𝑎 𝑥 + 𝑏 f(x)=ax+b.","isCorrect":false},{"id":"opt-3","text":"Si une fonction est affine, alors sa représentation graphique est une droite. Réciproquement, si la représentation graphique d’une fonction est une droite, alors la fonction est affine.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('b2bc0aae-9a88-4cf4-afa5-b378f92afd19', 53, 'quiz', 'Qu''est-ce que : Énoncé ?', 'Qu''est-ce que : Énoncé ?', '[{"id":"opt-0","text":"Une école décide de tester un logiciel pour gérer sa bibliothèque.","isCorrect":true},{"id":"opt-1","text":"Soit  𝑎 a et  𝑏 b deux nombres. Une fonction affine est une fonction qui, à un nombre  𝑥 x, associe le nombre  𝑎 𝑥 + 𝑏 ax+b.","isCorrect":false},{"id":"opt-2","text":"𝑓 : 𝑥 ↦ 𝑎 𝑥 + 𝑏 f:x↦ax+b  La fonction  𝑓 f est définie par  𝑓 ( 𝑥 ) = 𝑎 𝑥 + 𝑏 f(x)=ax+b.","isCorrect":false},{"id":"opt-3","text":"Si une fonction est affine, alors sa représentation graphique est une droite. Réciproquement, si la représentation graphique d’une fonction est une droite, alors la fonction est affine.","isCorrect":false}]', NULL, NULL, 50);

INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'b2bc0aae-9a88-4cf4-afa5-b378f92afd19', '2026-01-17', 1, 0, 5)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'b2bc0aae-9a88-4cf4-afa5-b378f92afd19', '2026-01-18', 2, 6, 11)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'b2bc0aae-9a88-4cf4-afa5-b378f92afd19', '2026-01-19', 3, 12, 17)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'b2bc0aae-9a88-4cf4-afa5-b378f92afd19', '2026-01-20', 4, 18, 23)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'b2bc0aae-9a88-4cf4-afa5-b378f92afd19', '2026-01-21', 5, 24, 29)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'b2bc0aae-9a88-4cf4-afa5-b378f92afd19', '2026-01-22', 6, 30, 35)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'b2bc0aae-9a88-4cf4-afa5-b378f92afd19', '2026-01-23', 7, 36, 41)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'b2bc0aae-9a88-4cf4-afa5-b378f92afd19', '2026-01-24', 8, 42, 47)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'b2bc0aae-9a88-4cf4-afa5-b378f92afd19', '2026-01-25', 9, 48, 53)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;

-- Course: Les probabilités
INSERT INTO public.courses (id, user_id, title, description, category, level, estimated_minutes, icon, total_xp, is_published, duration_days, daily_cards_count)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', '00000000-0000-0000-0000-000000000001', 'Les probabilités', 'Cours de Mathématiques : Les probabilités', 'Mathématiques', '3eme', 38, '📚', 780, true, 7, 6);

INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 0, 'lesson', 'Introduction', 'En quatrième, nous avons vu comment calculer des probabilités dans des cas simples, comme le lancer d’un dé classique non truqué. On a ainsi compris intuitivement que la probabilité d’obtenir 
6
6, par exemple, est égale à 
1
6
6
1
	​

.
Pourtant, si on lance six fois un dé, on se rend compte que, la plupart du temps, on n’obtient pas nécessairement une seule fois 
6
6 : on peut l’obtenir plusieurs fois, ou jamais ! Alors, à quoi correspond ce nombre de 
1
6
6
1
	​

 ?

C’est ce que nous allons voir dans ce cours. Pour cela, nous ferons un bref rappel des notions vues en quatrième, puis nous simulerons un lancer de dé pour montrer le lien entre fréquences et probabilités, ce qui nous permettra de programmer un peu avec Scratch.
Enfin, nous découvrirons comment calculer des probabilités dans des expériences aléatoires un peu plus complexes que celles vues jusqu’ici : avec deux épreuves.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 1, 'lesson', 'Expérience aléatoire et probabilité', 'Nous allons, tout au long de cette première partie, nous servir de l’exemple d’un lancer d’un dé cubique parfaitement équilibré, dont les 
6
6 faces sont numérotées de 
1
1 à 
6
6 ; on s’intéresse au numéro inscrit sur la face du dessus.
Cet exemple nous permettra de revoir le vocabulaire des probabilités et des propriétés importantes.

Une expérience aléatoire est une expérience dont on connaît tous les résultats possibles, mais dont on ne peut pas prévoir le résultat.
Ici, on sait qu’il y a 
6
6 résultats différents possibles, mais on ne sait pas lequel va se réaliser. Le résultat sera dû au hasard.
Tous les résultats possibles d’une expérience sont appelés issues.
Pour le dé, il y a 
6
6 issues : 
1
1 ; 
2
2 ; 
3
3 ; 
4
4 ; 
5
5 et 
6
6.
Pour modéliser une expérience aléatoire, on associe à chaque issue sa probabilité, c’est-à-dire sa proportion de chance d’être obtenue, que l’on détermine ici intuitivement et qui respectent les règles suivantes :
la probabilité de chaque issue est un nombre compris entre 
0
0 et 
1
1 ;
la somme des probabilités de toutes les issues vaut 
1
1.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 2, 'lesson', 'Échelle de probabilités', 'Chaque numéro du dé est porté par 
1
1 seule face sur les 
6
6.
Donc chacune des issues a une probabilité de 
1
6
6
1
	​

. Ce que l’on peut récapituler dans un petit tableau :', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 3, 'lesson', 'Issues', '1
1

	

2
2

	

3
3

	

4
4

	

5
5

	

6
6', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 4, 'lesson', 'Probabilités', '1
6
6
1
	​


	

1
6
6
1
	​


	

1
6
6
1
	​


	

1
6
6
1
	​


	

1
6
6
1
	​


	

1
6
6
1
	​


Lorsque les issues d’une expérience ont toutes la même probabilité, elles sont dites équiprobables.
Le tableau ci-dessus permet de voir que les issues du lancer de dé sont toutes égales à 
1
6
6
1
	​

.
Elles sont donc équiprobables.
Si une expérience aléatoire possède 
𝑛
n issues équiprobables (avec 
𝑛
n un entier strictement positif), alors la probabilité de chaque issue vaut : 
1
𝑛
n
1
	​

.
Il y a pour le dé 
6
6 issues équiprobables et on a vu que les probabilités des issues sont bien égales à 
1
6
6
1
	​

.
Dans une expérience aléatoire, un événement est une condition qui peut être réalisée ou non, en fonction de l’issue obtenue.
On peut le décrire par une phrase ou en donnant les issues qui le réalisent ; on peut aussi le noter par une lettre.
Dans l’expérience du dé, la condition 
𝐴
A : « Obtenir au plus 
2
2 », est un événement réalisé par les issues 
1
1 et 
2
2.
La probabilité d’un événement est égale à la somme des probabilités des issues qui le réalisent.
Si les issues sont équiprobables, alors la probabilité d’un événement est égale au quotient du nombre d’issues qui le réalisent sur le nombre total d’issues.
L’événement 
𝐴
A : « Obtenir au plus 
2
2 », est réalisé par les issues 
1
1 et 
2
2. Sa probabilité vaut donc la somme des probabilités de ces issues.
De plus, les issues sont équiprobables, donc la probabilité de 
𝐴
A est aussi égale au quotient du nombre d’issues qui le réalisent, soit 
2
2, sur le nombre total d’issues, soit 
6
6.

𝑝
(
𝐴
)
	
=
𝑝
(
1
)
+
𝑝
(
2
)
=
1
6
+
1
6
=
2
6
=
1
3


𝑝
(
𝐴
)
	
=
nombre d’issues qui r
e
ˊ
alisent 
𝐴
nombre total d’issues
=
2
6
=
1
3
p(A)
p(A)
	​

=p(1)+p(2)=
6
1
	​

+
6
1
	​

=
6
2
	​

=
3
1
	​

=
nombre total d’issues
nombre d’issues qui r
e
ˊ
alisent A
	​

=
6
2
	​

=
3
1
	​

	​


Un événement élémentaire est un événement réalisé par une seule issue.
Sa probabilité vaut alors celle de l’issue qui le réalise.
L’événement 
𝑀
M : « Obtenir un multiple de 
5
5 », n’est réalisé que par l’issue 
5
5, c’est un événement élémentaire.
Et nous avons : 
𝑝
(
𝑀
)
=
𝑝
(
5
)
=
1
6
p(M)=p(5)=
6
1
	​

.
Un événement impossible est un événement qui n’est réalisé par aucune issue ; sa probabilité vaut logiquement 
0
0.
« Obtenir un multiple de 
10
10 » est un événement impossible, de probabilité 
0
0.
Un événement certain est un événement qui est réalisé quelle que soit l’issue obtenue : sa probabilité vaut 
1
1.
« Obtenir un multiple de 
1
1 » est un événement certain, de probabilité 
1
1.
L’événement contraire d’un événement 
𝐸
E est noté 
𝐸
‾
E
 et se définit comme l’événement réalisé par chacune des issues qui ne réalisent pas 
𝐸
E ; par conséquent :
𝐸
E et 
𝐸
‾
E
 ne peuvent se réaliser simultanément ;
si 
𝐸
E ne se réalise pas, alors 
𝐸
‾
E
 se réalise ; si 
𝐸
‾
E
 ne se réalise pas, alors 
𝐸
E se réalise ;
la somme de leurs probabilités vaut 
1
1 :

𝑝
(
𝐸
)
+
𝑝
(
𝐸
‾
)
	
=
1


D’o
u
ˋ
 :
	


𝑝
(
𝐸
‾
)
	
=
1
−
𝑝
(
𝐸
)


𝑝
(
𝐸
)
	
=
1
−
𝑝
(
𝐸
‾
)
p(E)+p(
E
)
D’o
u
ˋ
 :
p(
E
)
p(E)
	​

=1
=1−p(E)
=1−p(
E
)
	​


On considère l’événement 
𝐴
A : « Obtenir au plus 
2
2 », de probabilité 
1
3
3
1
	​

, et 
𝐵
B : « Obtenir au moins 
3
3 ».
𝐴
A et 
𝐵
B ne peuvent se réaliser en même temps.
L’un des deux se réalisent quelle que soit l’issue.
𝐵
B est donc l’événement contraire de 
𝐴
A et :

𝑝
(
𝐵
)
	
=
𝑝
(
𝐴
‾
)
 [car 
𝐵
=
𝐴
‾
]


	
=
1
−
𝑝
(
𝐴
)


	
=
1
−
1
3


	
=
2
3
p(B)
	​

=p(
A
) [car B=
A
]
=1−p(A)
=1−
3
1
	​

=
3
2
	​

	​', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 5, 'lesson', 'Fréquences et probabilités', 'Nous avons jusqu’ici travaillé avec des cas où les probabilités étaient intuitives et évidentes : nous pouvions facilement déterminer la proportion de chance d’obtenir telle ou telle issue. Mais comment faire dans des cas où ne sait pas déterminer la probabilité des issues ?
Cette partie se propose de le montrer, en faisant une approche des probabilités par les fréquences.

Pour bien comprendre, nous repartons de l’exemple du dé, que nous allons lancer un grand nombre de fois. Nous aurons besoin pour cela d’un programme, qui sera fait avec Scratch.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 6, 'lesson', 'Programmer un lancer un dé', 'Lancer un dé classique parfaitement équilibré et regarder le numéro inscrit sur la face supérieure, cela revient à choisir aléatoirement, c’est-à-dire complètement au hasard, un nombre entier entre 
1
1 et 
6
6 (compris).

Pour cela, dans Scratch, on utilise un bloc dédié : « nombre aléatoire entre… », disponible dans la rubrique « Opérateurs ».
Il suffit de lui mettre l’entier le plus petit et le plus grand que l’on souhaite, soit, dans notre cas : « nombre aléatoire entre 1 et 6 ».
Nous créons aussi une variable que nous appelons « NumeroDe », qui contiendra le numéro obtenu au hasard.
Enfin, nous allons demander à Scratch de nous « dire » quel nombre il a obtenu, c’est-à-dire la valeur de la variable « NumeroDe ».
Voici le petit programme, si vous voulez le tester :', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 7, 'lesson', 'Programme de lancer de dé (© CC BY-SA 2.0)', 'Exécutons à 
6
6 reprises ce programme et voyons ce que nous dit Scratch.
Bien sûr, si vous le faites de votre côté, vous n’obtiendrez pas les mêmes résultats.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 8, 'lesson', 'Résultats des six lancers de dés (© CC BY-SA 2.0)', 'Nous remarquons que, sur les 
6
6 lancers, Scratch n’a obtenu ni 
3
3 ni 
6
6, alors qu’il a obtenu une fois 
1
1 et 
5
5, et deux fois 
2
2 et 
4
4.
Pourtant, nous avons dit que toutes les issues ont la même probabilité d’être obtenues : 
1
6
6
1
	​

.
Allons donc un peu plus loin.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 9, 'lesson', 'Lancer un dé de nombreuses fois', 'Nous allons maintenant nous intéresser plus particulièrement à la probabilité d’obtenir 
6
6 avec le dé. Nous savons la calculer, elle vaut :

𝑝
(
6
)
=
1
6
≈
0
,
1667
p(6)=
6
1
	​

≈0,1667

Nous lancerons à plusieurs reprises le dé et nous compterons le nombre de fois où Scratch obtiendra 
6
6.
Puis nous étudierons la fréquence d’obtention du 
6
6, c’est-à-dire le quotient du nombre de fois où Scratch a obtenu 
6
6, sur le nombre total de lancers du dé :

Fr
e
ˊ
quence de la valeur 
6
=
Effectif de la valeur 
6
Effectif total
Fr
e
ˊ
quence de la valeur 6=
Effectif total
Effectif de la valeur 6
	​


Nous allons donc compléter le programme Scratch précédent pour qu’il lance plusieurs fois le dé, comptabilise le nombre de 
6
6 obtenus et calcule la fréquence correspondante.

Nous expliquons en parallèle les éléments les plus importants du programme.
D’abord, nous souhaitons que l’utilisateur choisisse le nombre de lancers à effectuer, nous lui posons donc la question avec le module « demander… et attendre ».
La variable « NombreLancers » contiendra la réponse donnée, soit le nombre de lancers que fera Scratch.
Nous nous intéressons ici à l’issue 
6
6, il nous faudra donc compter le nombre de fois où Scratch obtient 
6
6, nous créons donc la variable « NombreSix » qui nous le permettra.
Nous lui donnons au début la valeur de 
0
0, puisque, évidemment, aucun 
6
6 n’a encore été obtenu.
Scratch va répéter le lancer de dé autant de fois que l’utilisateur l’aura demandé, soit NombreLancers fois.
Nous voulons compter le nombre de 
6
6 obtenus : à chaque lancer, si le numéro tiré au hasard est égal à 
6
6, alors nous ajoutons 
1
1 à la variable « NombreSix ».
Si ce n’est pas le cas, nous ne faisons rien.
Une fois que tous les lancers ont été faits, nous calculons la fréquence « FreqSix » en effectuant le quotient du nombre de 
6
6 obtenus sur le nombre de lancers total, soit : « NombreSix / NombreLancers ».
Enfin, nous demandons à Scratch de nous donner cette fréquence.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 10, 'lesson', 'Programme Scratch donnant la fréquence de 6 obtenus (© CC BY-SA 2.0)', 'Nous allons maintenant demander à Scratch de lancer le dé dix, cent, mille, dix mille, cent mille et même un million de fois (ce sera un tout petit peu plus long dans ce dernier cas, mais toujours rapide), puis observer les fréquences du 
6
6 qu’il obtient :', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 11, 'lesson', 'Fréquences obtenues (© CC BY-SA 2.0)', 'Rappelons que la probabilité d’obtenir l’issue 
6
6 est de 
1
6
≈
0
,
1667
6
1
	​

≈0,1667.

Nous voyons que, plus le nombre de lancers est grands, plus la fréquence obtenue par Scratch est proche de la probabilité que nous avons donnée.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 12, 'lesson', 'Vous pouvez maintenant exécuter vous-même le programme dans la fenêtre ci-dessous', '(Pour voir ou modifier le programme : Fréquences et probabilités)

Si vous simulez à votre tour un million de lancers, la fréquence que vous obtiendrez sera différente de celle obtenue ici, mais vous remarquerez que, sauf rare exception, elle reste proche de la probabilité de 
1
6
6
1
	​

.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 13, 'lesson', 'Propriété', 'Lorsqu’on répète un très grand nombre de fois une expérience aléatoire, la fréquence d’apparition d’une issue tend à se stabiliser autour d’une valeur.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 14, 'lesson', 'Cette valeur est la probabilité de l’issue.', 'Cette propriété est une première approche simplifiée de la loi dite des grands nombres. C’est cette loi qui, par exemple, justifie le recours aux sondages.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 15, 'lesson', 'À retenir', 'Dans une expérience aléatoire, quand on ne peut pas déterminer a priori la probabilité d’une issue, on peut répéter un grand nombre de fois l’expérience et observer la fréquence d’apparition de l’issue.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 16, 'lesson', 'Cela permettra de donner une approximation de la probabilité.', 'Nous allons maintenant nous servir de cette propriété dans un petit exercice classique : estimer une probabilité à partir d’une courbe de fréquence.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 17, 'lesson', 'Exemple', 'On sait qu’une urne opaque contient 
10
10 boules indiscernables au toucher. On sait aussi que ces boules sont soit orange, soit bleues.
On n’a pas le droit de sortir plus d’une boule à la fois. Et on souhaite deviner le nombre de boules orange et le nombre de boules bleues qu’il y a dans l’urne.

Comme on a beaucoup de temps et de patience, et qu’on aime les stats, on répète 
5
000
5000 fois l’expérience suivante : on tire une boule, on note sa couleur et on la remet dans l’urne.
Un tableur a permis d’obtenir le graphique suivant, qui représente l’évolution des fréquences (courbe orange pour les boules orange, et bleue pour les bleues) en fonction du nombre de tirages :', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 18, 'lesson', 'Courbes des fréquences d’obtention des boules orange et bleues', 'On cherche à estimer :
la probabilité de tirer une boule orange, notée 
𝑝
(
𝑂
)
p(O), et celle de tirer une boule bleue, notée 
𝑝
(
𝐵
)
p(B) ;
une répartition plausible des 
10
10 boules en fonction de leur couleur.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 19, 'lesson', 'On voit que', 'la fréquence de tirage d’une boule orange se stabilise autour de 
0
,
30
0,30 ;
logiquement, celle de tirage d’une boule bleue se stabilise autour de 
0
,
70
0,70.
On peut donc supposer que :
𝑝
(
𝑂
)
=
0
,
30
p(O)=0,30 ;
𝑝
(
𝐵
)
=
0
,
70
p(B)=0,70.

On a supposé la probabilité de tirer une boule orange égale à 
0
,
30
0,30, soit 
3
10
10
3
	​

. Autrement dit, on a, selon notre hypothèse, 
3
3 chances sur 
10
10 de tirer une boule orange.

Comme il y a 
10
10 boules au total, on peut supposer que l’urne contienne :
3
3 boules orange ;
et donc 
10
−
3
=
7
10−3=7 boules bleues.

Attention, en probabilités, on n’affirme rien avec certitude. Ici, nous émettons une hypothèse raisonnable, mais nous ne pouvons pas être certains que la répartition réelle des boules est celle que nous avons donnée.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 20, 'lesson', 'Expérience aléatoire à deux épreuves', 'Nous avons travaillé jusqu’ici sur des expériences aléatoires simples, avec une seule étape : lancer un dé et regarder le numéro inscrit sur la face supérieure ; tirer une boule dans une urne et regarder sa couleur.
Nous allons ici étudier des expériences aléatoires constituées de deux étapes, où nous nous intéressons aux résultats de ces deux étapes.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 21, 'lesson', 'Exemple', 'Un sac opaque contient 
4
4 jetons indiscernables au toucher, numérotés de 
1
1 à 
4
4.
On considère l’expérience aléatoire à deux épreuves suivante :

on tire un premier jeton, on note le chiffre inscrit et on le remet dans le sac ;
on tire un second jeton et on note le chiffe inscrit ;
on s’intéresse au nombre formé par ces deux chiffres (le premier jeton donnera donc le chiffre des dizaines, et le second celui des unités).
Les deux tirages constituent les deux épreuves de l’expérience aléatoire.
Les issues de cette expérience sont tous les nombres que l’on peut ainsi constituer.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 22, 'lesson', 'Astuce', 'Dans cet exemple, on remet dans le sac le premier jeton tiré. On revient donc à la situation initiale pour le tirage de la deuxième boule. Ainsi, le résultat du deuxième tirage ne dépend pas de celui du premier.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 23, 'lesson', 'On dit que les épreuves sont indépendantes.', 'Ce ne serait pas le cas si on ne remettait pas le premier jeton avant de tirer le second. En effet, il y aurait eu un numéro de moins de disponible pour le second tirage. Vous apprendrez au lycée à travailler avec de telles expériences aléatoires.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 24, 'lesson', 'Pour étudier une expérience à deux épreuves, on utilise un tableau à double entrée.', 'Appliquons cette méthode du tableau à double entrée à l’exemple précédent, pour en comprendre l’utilité.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 25, 'lesson', 'Exemple', 'Dans le jeu que nous avons décrit plus haut, on gagne si le nombre formé par les deux numéros obtenus est un multiple de 
8
8. Quelle est la probabilité de gagner ?', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 26, 'lesson', 'On construit un tableau à double entrée', 'dans la première colonne, on représente les issues possibles de la première épreuve (en violet dans le tableau) ;
sur la première ligne, on représente celle de la seconde épreuve (en rose dans le tableau).
Nous obtiendrons, en « croisant » les lignes et les colonnes, l’ensemble des issues possibles.

1
er
 tirage 
↓
2
d
 tirage 
→
1
er
 tirage ↓
2
d
 tirage →
	​


	

1
1

	

2
2

	

3
3

	

4
4




1
1

	

1
1
11

	

1
2
12

	

1
3
13

	

1
4
14




2
2

	

2
1
21

	

2
2
22

	

2
3
23

	

2
4
24




3
3

	

3
1
31

	

3
2
32

	

3
3
33

	

3
4
34




4
4

	

4
1
41

	

4
2
42

	

4
3
43

	

4
4
44

Nous trouvons ainsi les 
16
16 issues de l’expérience aléatoire. Il y a donc 
16
16 nombres possibles.
Regardons, parmi ces 
16
16 nombres, lesquels sont des multiples de 
8
8.

1
er
 tirage 
↓
2
d
 tirage 
→
1
er
 tirage ↓
2
d
 tirage →
	​


	

1
1

	

2
2

	

3
3

	

4
4




1
1

	

1
1
11

	

1
2
12

	

1
3
13

	

1
4
14




2
2

	

2
1
21

	

2
2
22

	

2
3
23

	

2
4
24




3
3

	

3
1
31

	

3
2
32

	

3
3
33

	

3
4
34




4
4

	

4
1
41

	

4
2
42

	

4
3
43

	

4
4
44

Notons 
𝐺
G l’événement : « On gagne ».
Précisons aussi que, comme les jetons sont indiscernables au toucher et qu’on ne peut pas les voir, tous ont les mêmes chances d’être tirés : les issues sont équiprobables.
Il y a donc 
2
2 issues sur les 
16
16 (les nombres 
24
24 et 
32
32) qui réalisent l’événement 
𝐺
G. Donc :

𝑝
(
𝐺
)
=
2
16
=
1
8
=
0
,
125
=
12
,
5
%
p(G)=
16
2
	​

=
8
1
	​

=0,125=12,5%

Il y a donc 
12
,
5
%
12,5% de chance de gagner à ce jeu.

Prenons un dernier exemple, pour bien comprendre comment on étudie une expérience aléatoire à deux épreuves.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 27, 'lesson', 'Exemple', 'Un couple souhaite avoir deux enfants.
En considérant que la probabilité d’avoir une fille et celle d’avoir un garçon sont égales, nous cherchons à déterminer la probabilité des deux événements suivants :

𝐴
A : « Le couple n’a que des filles » ;
𝐵
B : « Le couple a au moins un garçon ».

On note 
𝐹
F si l’enfant est une fille, et 
𝐺
G si c’est un garçon.
Nous construisons le tableau à double entrée correspondant :

1
er
 enfant 
↓
2
d
 enfant 
→
1
er
 enfant ↓
2
d
 enfant →
	​


	

𝐹
F

	

𝐺
G




𝐹
F

	

𝐹
𝐹
FF

	

𝐹
𝐺
FG




𝐺
G

	

𝐺
𝐹
GF

	

𝐺
𝐺
GG

Il y a donc 
4
4 issues possibles.
De plus, les probabilités d’avoir une fille ou un garçon étant égales, ces issues sont équiprobables.

1
1 seule issue réalise l’événement 
𝐴
A, donc :

𝑝
(
𝐴
)
=
1
4
p(A)=
4
1
	​


On remarque qu’on peut traduire l’événement 
𝐵
B : « Le couple a au moins un garçon » par : « Le couple n’a pas que des filles ».

𝐵
B est donc l’événement contraire de 
𝐴
A, et nous obtenons :

𝑝
(
𝐵
)
=
𝑝
(
𝐴
‾
)
=
1
−
𝑝
(
𝐴
)
=
1
−
1
4
=
3
4
p(B)=p(
A
)=1−p(A)=1−
4
1
	​

=
4
3
	​


On peut aussi bien sûr, pour calculer cette probabilité, dénombrer le nombre d’issues qui réalisent 
𝐵
B, soit 
3
3 sur 
4
4.

La probabilité que le couple n’ait que des filles est de 
1
4
4
1
	​

.
Celle qu’il ait au moins une fille vaut 
3
4
4
3
	​

.

Nos connaissances des probabilités s’approfondissent d’année en année. Ainsi, ce cours nous a permis de mieux comprendre ce que représente une probabilité, notamment grâce à une approche avec les fréquences. Nous avons aussi vu comment modéliser des expériences aléatoires un peu plus complexes, à deux épreuves.
Plus tard, vous découvrirez d’autres définitions et propriétés, qui vous permettront de comprendre pourquoi les probabilités sont si importantes dans de nombreux domaines du quotidien.

Scratch est un projet de la Scratch Foundation, en collaboration avec le groupe Lifelong Kindergarten du MIT Media Lab. Il est disponible gratuitement à l’adresse https://scratch.mit.edu.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 28, 'quiz', 'Qu''est-ce que : Expérience aléatoire et probabilité ?', 'Qu''est-ce que : Expérience aléatoire et probabilité ?', '[{"id":"opt-0","text":"Nous allons, tout au long de cette première partie, nous servir de l’exemple d’un lancer d’un dé cubique parfaitement équilibré, dont les  6 6 faces sont numérotées de  1 1 à  6 6 ; on s’intéresse au numéro inscrit sur la face du dessus.","isCorrect":true},{"id":"opt-1","text":"Chaque numéro du dé est porté par  1 1 seule face sur les  6 6. Donc chacune des issues a une probabilité de  1 6 6 1 \t​  . Ce que l’on peut récapituler dans un petit tableau :","isCorrect":false},{"id":"opt-2","text":"1 1  \t  2 2  \t  3 3  \t  4 4  \t  5 5  \t  6 6","isCorrect":false},{"id":"opt-3","text":"1 6 6 1 \t​   \t  1 6 6 1 \t​   \t  1 6 6 1 \t​   \t  1 6 6 1 \t​   \t  1 6 6 1 \t​   \t  1 6 6 1 \t​   Lorsque les issues d’une expérience ont toutes la même probabilité, elles sont dites équiprobables.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 29, 'quiz', 'Qu''est-ce que : Échelle de probabilités ?', 'Qu''est-ce que : Échelle de probabilités ?', '[{"id":"opt-0","text":"Chaque numéro du dé est porté par  1 1 seule face sur les  6 6. Donc chacune des issues a une probabilité de  1 6 6 1 \t​  . Ce que l’on peut récapituler dans un petit tableau :","isCorrect":true},{"id":"opt-1","text":"Nous allons, tout au long de cette première partie, nous servir de l’exemple d’un lancer d’un dé cubique parfaitement équilibré, dont les  6 6 faces sont numérotées de  1 1 à  6 6 ; on s’intéresse au numéro inscrit sur la face du dessus.","isCorrect":false},{"id":"opt-2","text":"1 1  \t  2 2  \t  3 3  \t  4 4  \t  5 5  \t  6 6","isCorrect":false},{"id":"opt-3","text":"1 6 6 1 \t​   \t  1 6 6 1 \t​   \t  1 6 6 1 \t​   \t  1 6 6 1 \t​   \t  1 6 6 1 \t​   \t  1 6 6 1 \t​   Lorsque les issues d’une expérience ont toutes la même probabilité, elles sont dites équiprobables.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 30, 'quiz', 'Qu''est-ce que : Issues ?', 'Qu''est-ce que : Issues ?', '[{"id":"opt-0","text":"1 1  \t  2 2  \t  3 3  \t  4 4  \t  5 5  \t  6 6","isCorrect":true},{"id":"opt-1","text":"Nous allons, tout au long de cette première partie, nous servir de l’exemple d’un lancer d’un dé cubique parfaitement équilibré, dont les  6 6 faces sont numérotées de  1 1 à  6 6 ; on s’intéresse au numéro inscrit sur la face du dessus.","isCorrect":false},{"id":"opt-2","text":"Chaque numéro du dé est porté par  1 1 seule face sur les  6 6. Donc chacune des issues a une probabilité de  1 6 6 1 \t​  . Ce que l’on peut récapituler dans un petit tableau :","isCorrect":false},{"id":"opt-3","text":"1 6 6 1 \t​   \t  1 6 6 1 \t​   \t  1 6 6 1 \t​   \t  1 6 6 1 \t​   \t  1 6 6 1 \t​   \t  1 6 6 1 \t​   Lorsque les issues d’une expérience ont toutes la même probabilité, elles sont dites équiprobables.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 31, 'quiz', 'Qu''est-ce que : Probabilités ?', 'Qu''est-ce que : Probabilités ?', '[{"id":"opt-0","text":"1 6 6 1 \t​   \t  1 6 6 1 \t​   \t  1 6 6 1 \t​   \t  1 6 6 1 \t​   \t  1 6 6 1 \t​   \t  1 6 6 1 \t​   Lorsque les issues d’une expérience ont toutes la même probabilité, elles sont dites équiprobables.","isCorrect":true},{"id":"opt-1","text":"Nous allons, tout au long de cette première partie, nous servir de l’exemple d’un lancer d’un dé cubique parfaitement équilibré, dont les  6 6 faces sont numérotées de  1 1 à  6 6 ; on s’intéresse au numéro inscrit sur la face du dessus.","isCorrect":false},{"id":"opt-2","text":"Chaque numéro du dé est porté par  1 1 seule face sur les  6 6. Donc chacune des issues a une probabilité de  1 6 6 1 \t​  . Ce que l’on peut récapituler dans un petit tableau :","isCorrect":false},{"id":"opt-3","text":"1 1  \t  2 2  \t  3 3  \t  4 4  \t  5 5  \t  6 6","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 32, 'quiz', 'Qu''est-ce que : Fréquences et probabilités ?', 'Qu''est-ce que : Fréquences et probabilités ?', '[{"id":"opt-0","text":"Nous avons jusqu’ici travaillé avec des cas où les probabilités étaient intuitives et évidentes : nous pouvions facilement déterminer la proportion de chance d’obtenir telle ou telle issue.","isCorrect":true},{"id":"opt-1","text":"Nous allons, tout au long de cette première partie, nous servir de l’exemple d’un lancer d’un dé cubique parfaitement équilibré, dont les  6 6 faces sont numérotées de  1 1 à  6 6 ; on s’intéresse au numéro inscrit sur la face du dessus.","isCorrect":false},{"id":"opt-2","text":"Chaque numéro du dé est porté par  1 1 seule face sur les  6 6. Donc chacune des issues a une probabilité de  1 6 6 1 \t​  . Ce que l’on peut récapituler dans un petit tableau :","isCorrect":false},{"id":"opt-3","text":"1 1  \t  2 2  \t  3 3  \t  4 4  \t  5 5  \t  6 6","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 33, 'quiz', 'Qu''est-ce que : Programmer un lancer un dé ?', 'Qu''est-ce que : Programmer un lancer un dé ?', '[{"id":"opt-0","text":"Lancer un dé classique parfaitement équilibré et regarder le numéro inscrit sur la face supérieure, cela revient à choisir aléatoirement, c’est-à-dire complètement au hasard, un nombre entier entre  1 1 et  6 6 (compris).","isCorrect":true},{"id":"opt-1","text":"Nous allons, tout au long de cette première partie, nous servir de l’exemple d’un lancer d’un dé cubique parfaitement équilibré, dont les  6 6 faces sont numérotées de  1 1 à  6 6 ; on s’intéresse au numéro inscrit sur la face du dessus.","isCorrect":false},{"id":"opt-2","text":"Chaque numéro du dé est porté par  1 1 seule face sur les  6 6. Donc chacune des issues a une probabilité de  1 6 6 1 \t​  . Ce que l’on peut récapituler dans un petit tableau :","isCorrect":false},{"id":"opt-3","text":"1 1  \t  2 2  \t  3 3  \t  4 4  \t  5 5  \t  6 6","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 34, 'quiz', 'Qu''est-ce que : Programme de lancer de dé (© CC BY-SA 2.0) ?', 'Qu''est-ce que : Programme de lancer de dé (© CC BY-SA 2.0) ?', '[{"id":"opt-0","text":"Exécutons à  6 6 reprises ce programme et voyons ce que nous dit Scratch. Bien sûr, si vous le faites de votre côté, vous n’obtiendrez pas les mêmes résultats.","isCorrect":true},{"id":"opt-1","text":"Nous allons, tout au long de cette première partie, nous servir de l’exemple d’un lancer d’un dé cubique parfaitement équilibré, dont les  6 6 faces sont numérotées de  1 1 à  6 6 ; on s’intéresse au numéro inscrit sur la face du dessus.","isCorrect":false},{"id":"opt-2","text":"Chaque numéro du dé est porté par  1 1 seule face sur les  6 6. Donc chacune des issues a une probabilité de  1 6 6 1 \t​  . Ce que l’on peut récapituler dans un petit tableau :","isCorrect":false},{"id":"opt-3","text":"1 1  \t  2 2  \t  3 3  \t  4 4  \t  5 5  \t  6 6","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 35, 'quiz', 'Qu''est-ce que : Lancer un dé de nombreuses fois ?', 'Qu''est-ce que : Lancer un dé de nombreuses fois ?', '[{"id":"opt-0","text":"Nous allons maintenant nous intéresser plus particulièrement à la probabilité d’obtenir  6 6 avec le dé.","isCorrect":true},{"id":"opt-1","text":"Nous allons, tout au long de cette première partie, nous servir de l’exemple d’un lancer d’un dé cubique parfaitement équilibré, dont les  6 6 faces sont numérotées de  1 1 à  6 6 ; on s’intéresse au numéro inscrit sur la face du dessus.","isCorrect":false},{"id":"opt-2","text":"Chaque numéro du dé est porté par  1 1 seule face sur les  6 6. Donc chacune des issues a une probabilité de  1 6 6 1 \t​  . Ce que l’on peut récapituler dans un petit tableau :","isCorrect":false},{"id":"opt-3","text":"1 1  \t  2 2  \t  3 3  \t  4 4  \t  5 5  \t  6 6","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 36, 'quiz', 'Qu''est-ce que : Fréquences obtenues (© CC BY-SA 2.0) ?', 'Qu''est-ce que : Fréquences obtenues (© CC BY-SA 2.0) ?', '[{"id":"opt-0","text":"Rappelons que la probabilité d’obtenir l’issue  6 6 est de  1 6 ≈ 0 , 1667 6 1 \t​  ≈0,1667.","isCorrect":true},{"id":"opt-1","text":"Nous allons, tout au long de cette première partie, nous servir de l’exemple d’un lancer d’un dé cubique parfaitement équilibré, dont les  6 6 faces sont numérotées de  1 1 à  6 6 ; on s’intéresse au numéro inscrit sur la face du dessus.","isCorrect":false},{"id":"opt-2","text":"Chaque numéro du dé est porté par  1 1 seule face sur les  6 6. Donc chacune des issues a une probabilité de  1 6 6 1 \t​  . Ce que l’on peut récapituler dans un petit tableau :","isCorrect":false},{"id":"opt-3","text":"1 1  \t  2 2  \t  3 3  \t  4 4  \t  5 5  \t  6 6","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('89c22c59-e1dc-42e5-bd54-b969a7f18f19', 37, 'quiz', 'Qu''est-ce que : Propriété ?', 'Qu''est-ce que : Propriété ?', '[{"id":"opt-0","text":"Lorsqu’on répète un très grand nombre de fois une expérience aléatoire, la fréquence d’apparition d’une issue tend à se stabiliser autour d’une valeur.","isCorrect":true},{"id":"opt-1","text":"Nous allons, tout au long de cette première partie, nous servir de l’exemple d’un lancer d’un dé cubique parfaitement équilibré, dont les  6 6 faces sont numérotées de  1 1 à  6 6 ; on s’intéresse au numéro inscrit sur la face du dessus.","isCorrect":false},{"id":"opt-2","text":"Chaque numéro du dé est porté par  1 1 seule face sur les  6 6. Donc chacune des issues a une probabilité de  1 6 6 1 \t​  . Ce que l’on peut récapituler dans un petit tableau :","isCorrect":false},{"id":"opt-3","text":"1 1  \t  2 2  \t  3 3  \t  4 4  \t  5 5  \t  6 6","isCorrect":false}]', NULL, NULL, 50);

INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '89c22c59-e1dc-42e5-bd54-b969a7f18f19', '2026-01-17', 1, 0, 5)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '89c22c59-e1dc-42e5-bd54-b969a7f18f19', '2026-01-18', 2, 6, 11)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '89c22c59-e1dc-42e5-bd54-b969a7f18f19', '2026-01-19', 3, 12, 17)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '89c22c59-e1dc-42e5-bd54-b969a7f18f19', '2026-01-20', 4, 18, 23)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '89c22c59-e1dc-42e5-bd54-b969a7f18f19', '2026-01-21', 5, 24, 29)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '89c22c59-e1dc-42e5-bd54-b969a7f18f19', '2026-01-22', 6, 30, 35)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', '89c22c59-e1dc-42e5-bd54-b969a7f18f19', '2026-01-23', 7, 36, 37)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;

-- Course: Le vocabulaire du théâtre
INSERT INTO public.courses (id, user_id, title, description, category, level, estimated_minutes, icon, total_xp, is_published, duration_days, daily_cards_count)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', '00000000-0000-0000-0000-000000000001', 'Le vocabulaire du théâtre', 'Cours de Français : Le vocabulaire du théâtre', 'Français', '3eme', 44, '📚', 1050, true, 11, 6);

INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 0, 'lesson', 'Introduction', 'En littérature, un vocabulaire précis est consacré au théâtre. Utiliser les termes réservés à ce genre permet de montrer au professeur, ou au correcteur le jour du brevet, que l''on sait de quoi on parle. La note en sera grandement améliorée.

La présente fiche de cours résume tout ce que l''on peut rencontrer concernant le théâtre au collège : nous verrons d’abord dans une première partie quelles sont les particularités du théâtre en matière de découpage et d’effets stylistiques. La deuxième partie nous permettra de définir les formes du discours au théâtre. Ensuite, nous ferons la distinction entre les deux principaux genres que sont la tragédie et la comédie, en révisant leurs règles et ce qu’il en est advenu à l’époque moderne.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 1, 'lesson', 'À retenir', 'Un texte théâtral n’est pas une œuvre en soi mais un outil de travail. L’œuvre, c’est la représentation du texte, c’est-à-dire le moment où les comédiens l’interprétent sur une scène.

De la même façon, un script de film se lit mais a peu de points communs avec le film que l’on va voir au cinéma. C’est une évidence que les élèves ont tendance à oublier car à l’école, on étudie souvent le théâtre par le biais du texte.

Mais le texte théâtral est avant tout un outil qui sert à ceux qui vont participer à la mise en scène de la pièce.

Un texte théâtral n’est donc pas rédigé comme un roman, qui essaye en général de plaire à son lecteur. Le lecteur n’a aucune importance au théâtre, on ne cherche pas à le flatter. C’est le spectateur, et lui seul, qui est important. Et ce spectateur n’aura pas le texte sous les yeux : il ne verra que ce qu’on aura bien voulu lui montrer.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 2, 'lesson', 'Les didascalies', 'Les didascalies ne sont perceptibles que dans le théâtre écrit, les spectateurs n’ont pas conscience de leur présence durant la représentation.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 3, 'lesson', 'Didascalies', 'Les didascalies sont des indications scéniques qui apparaissent sur le texte théâtral et que les acteurs ne jouent pas. Elles servent à aider le metteur en scène et permettent aux acteurs de préparer leur rôle.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 4, 'lesson', 'On distingue plusieurs types de didascalies', 'les didascalies initiales sont celles qui figurent au début du texte. Elles donnent les différents rôles, précisent la fonction des personnages et les liens qui existent entre eux. Elles donnent aussi, le plus souvent, les détails qui importent pour le décor (par exemple si l’action se déroule dans un palais, au bord d’une rivière) et pour les accessoires (par exemple s’il faut absolument un lit, un fauteuil, des fleurs ou un piano) ;
les didascalies internes sont celles qui figurent dans le texte, et qui donnent une indication sur la façon dont les répliques sont prononcées (en criant, en riant, en bégayant) et précisent parfois les gestes des acteurs ou encore le moment où il y a de la musique, du chant ou de la danse, comme cela arrive parfois. Ainsi, Molière a écrit des comédies-ballets comme Le Médecin malgré lui. Les didascalies internes peuvent également fournir des indices sur la psychologie des personnages ;
les noms des personnages, qui précèdent immédiatement leurs répliques, sont également des didascalies. C’est pour des soucis de clarté envers les comédiens que le nom du personnage concerné est inscrit avant chaque réplique. C’est à ce genre de détails que l’on voit qu’un texte théâtral n’a pas vocation à être lu, ou en tous cas, pas par le public ;
les numéros des actes et des scènes sont encore des éléments inclus dans les didascalies.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 5, 'lesson', 'Scène', 'La scène au théâtre est tout à la fois le lieu sur lequel les comédiens jouent et le découpage de la pièce en plusieurs unités narratives. On change de scène à chaque fois qu’un personnage entre ou sort de scène.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 6, 'lesson', 'À retenir', 'La scène, c’est donc le sol sur lequel jouent les comédiens, mais c’est aussi le moment pendant lequel ils jouent.

L’intérêt du découpage en scènes est purement pratique : un comédien doit savoir exactement dans quelles scènes il interviendra. Ainsi, d’un rapide coup d’œil sur le texte, il saura par exemple qu’il joue dans les scènes trois, huit et neuf de l’acte deux.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 7, 'lesson', 'Acte', 'Un acte rassemble plusieurs scènes (dont le nombre peut varier). Le nombre d’actes par pièce se limite en général à trois ou cinq dans les pièces classiques.

À l’origine, le changement d’acte permettait de changer les bougies du grand chandelier qui illuminait la salle de spectacle ; puis, avec le temps, le changement d’acte est souvent devenu synonyme de changement de décor. Le changement d’acte repose avant tout sur le même principe que le chapitrage d’un roman, et intervient la plupart du temps lorsque l’on arrive au bout d’une partie importante de l’intrigue, ou encore juste avant que celle-ci ne prenne une autre direction.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 8, 'lesson', 'À retenir', 'On écrit toujours l’acte en chiffre romain et la scène en chiffre arabe. Cette notation codifiée permet d’éviter d’écrire les mots « acte » et « scène », et de se contenter uniquement des chiffres :

« Tous les vices à la mode passent pour vertus. »
Molière, Dom Juan ou Le Festin de pierre, (V, 3)', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 9, 'lesson', 'Les scènes d’ouverture et de clôture au théâtre', 'Pour la première scène d’une pièce, ou à la rigueur, les deux premières scènes, on parle de scène d’exposition.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 10, 'lesson', 'Scène d’exposition', 'La scène d’exposition est le nom de la première scène d’une pièce de théâtre. Elle vise à plonger le spectateur in medias res, c’est-à-dire directement dans l’action, en lui exposant rapidement les personnages principaux et les enjeux de l’intrigue à venir.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 11, 'lesson', 'La scène d’exposition a plusieurs rôles', 'présenter les personnages principaux ;
raconter ce qui a pu se passer avant le début de la pièce et qui serait utile à la pièce ;
faire comprendre quelle intrigue va se jouer (une intrigue amoureuse, une affaire d’argent, un mari trompé, une vengeance).

La scène d’exposition au théâtre est finalement l’équivalent d’un incipit romanesque, ou d’une scène d’introduction au cinéma : il est essentiel qu’elle soit réussie, ou alors le public ne comprendra rien au reste de la pièce.

Faisant écho à la première scène d’une pièce, la dernière scène d’une pièce de théâtre se nomme le dénouement.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 12, 'lesson', 'Dénouement', 'Le dénouement au théâtre est la dernière scène, où tous les nœuds dramatiques se défont et où toutes les intrigues de la pièce se résolvent.

Cette résolution forcée à la dernière scène mène parfois à des situations assez étranges et peu crédibles.

Lorsqu’une scène très problématique se résout d’elle-même, comme par magie, on appelle ça un deus ex machina.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 13, 'lesson', 'À retenir', 'Le deus ex machina (littéralement « dieu sorti de la machine ») est une convention théâtrale qui date de l’antiquité, où l’on faisait intervenir à l’aide d''une machinerie un dieu qui descendait sur terre – donc sur scène – pour régler tous les problèmes avec une sorte de miracle. Le comédien qui l’interprétait pouvait, par exemple, être suspendu à un câble ou jaillir du sol par un jeu de trappes et de leviers (d’où le mot machina).

Dans le théâtre récent, on emploie cette expression pour désigner les coïncidences un peu trop exagérées qui vont sortir les personnages de l’embarras juste à la fin de la pièce. C’est souvent le cas dans le théâtre de Molière. Par exemple, dans Le Tartuffe, le personnage éponyme trompe tout le monde. Seule l’intervention du roi à la dernière scène permet de mettre fin à ses agissements et de sortir l’ensemble des autres personnages de l’embarras.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 14, 'lesson', 'Le hors-scène', 'Au théâtre, le plus souvent, on montre l’action en direct, en la faisant jouer par les personnages présents sur scène. Mais parfois, une action n’est pas montrée et est juste racontée par un comédien : on dit alors que c’est une action hors-scène ou juste un hors-scène.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 15, 'lesson', 'Hors-scène', 'Le hors-scène au théâtre est tout ce qui intervient durant la pièce et qui n’est pas montré au spectateur.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 16, 'lesson', 'À retenir', 'Dans le théâtre classique, le hors-scène permet de ne pas choquer le spectateur. En faisant mourir les comédiens en dehors de la scène, cachés dans la coulisse, l’auteur évitait de montrer le sang et les blessures.

Mais on peut aussi utiliser le hors-scène pour des raisons purement pratiques, comme pour dire qu’un horrible monstre est apparu dans le ciel sans avoir à montrer ledit monstre.

Au théâtre, lorsqu’on entend un acteur parler depuis la coulisse, c’est un cas de hors-scène.
De la même façon, les événements qui ont pu avoir lieu avant la scène d’exposition et que les comédiens racontent dans la pièce sont du hors-scène.
Enfin, si le décor comprend une fenêtre, les comédiens peuvent aller à la fenêtre et décrire en direct, à l’intention du spectateur qui lui ne voit rien, ce qu’il se passe. Cette description vise à expliquer ce qui a prétendument lieu hors-scène.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 17, 'lesson', 'Astuce', 'Le cinéma est un genre qui tient du théâtre pour bien des aspects. Par exemple, le hors-scène est aussi utilisé au cinéma, mais il s’appelle alors le hors-champ ou le hors-cadre.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 18, 'lesson', 'La théorie du quatrième mur', 'Au théâtre, les acteurs jouent comme s’il n’y avait pas de public. Tout se passe comme si un mur imaginaire, un écran, séparait la scène des spectateurs. Les théoriciens du théâtre nomment cet écran le quatrième mur.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 19, 'lesson', 'Quatrième mur', 'Le quatrième mur est un mur imaginaire qui sépare les comédiens des spectateurs. Il fonctionne comme suit :

les comédiens n’ont pas conscience qu’on les regarde jouer et font la représentation comme si le rideau restait baissé ;
les spectateurs peuvent voir et entendre uniquement ce qu’on choisit de leur montrer. Ils savent qu’ils assistent à une illusion mais peuvent parfois s’y abandonner car elle est réaliste (elle imite la réalité). Les spectateurs peuvent donc oublier momentanément que ce qu’ils voient n’est que du théâtre.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 20, 'lesson', 'À retenir', 'Certains auteurs de théâtre s’amusent à casser l’illusion de réalité en s’adressant directement au spectateur malgré la règle du quatrième mur.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 21, 'lesson', 'Le texte théâtral', 'L’essentiel d’un texte théâtral est constitué de répliques : il n’y a pas de narrateur pour raconter l’histoire, mais uniquement du dialogue entre personnages, ou du discours, émis par un seul comédien.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 22, 'lesson', 'Le dialogue théâtral', '« KNOCK :
[…] De quoi souffrez-vous ?

LE TAMBOUR :
Attendez que je réfléchisse ! (Il rit.) Voilà. Quand j’ai dîné, il y a des fois que je me sens une espèce de démangeaison ici. (Il montre le haut de son épigastre.) Ça me chatouille, ou plutôt, ça me gratouille.

KNOCK d’un air de profonde concentration :
Attention. Ne confondons pas. Est-ce que ça vous chatouille, ou est-ce que ça vous gratouille ?

LE TAMBOUR :
Ça me gratouille. (Il médite.) Mais ça me chatouille bien un peu aussi. »', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 23, 'lesson', 'Jules Romain, Knock, Acte II scène 1', 'La parole au théâtre est partagée entre les personnages. Le plus souvent de façon équitable, comme dans l’extrait précédent. Ce cas où deux personnages discutent est un dialogue.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 24, 'lesson', 'Dialogue théâtral', 'Le dialogue théâtral est une succession de répliques que s’échangent deux personnages, ou plus, au théâtre. Il est la façon la plus courante d’écrire du théâtre.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 25, 'lesson', 'Les stichomythies', '« AGNÈS :
Est-il possible ?

ARNOLPHE :
Oui.

AGNÈS :
Que vous me ferez aise !

ARNOLPHE :
Oui, je ne doute point que l’hymen ne vous plaise.

AGNÈS :
Vous nous voulez, nous deux…

ARNOLPHE :
Rien de plus assuré.

AGNÈS :
Que, si cela se fait, je vous caresserai !

ARNOLPHE :
Eh ! la chose sera de ma part réciproque.

AGNÈS :
Je ne reconnais point, pour moi, quand on se moque. Parlez-vous tout de bon ?

ARNOLPHE :
Oui, vous le pourrez voir.

AGNÈS :
Nous serons mariés ?

ARNOLPHE :
Oui.

AGNÈS :
Mais quand ?

ARNOLPHE :
Dès ce soir.

AGNÈS riant :
Dès ce soir ?

ARNOLPHE :
Dès ce soir. Cela vous fait donc rire ?

AGNÈS :
Oui.

ARNOLPHE :
Vous voir bien contente est ce que je désire.  »', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 26, 'lesson', 'Molière, L’École des femmes, Acte II scène 5', 'Ce dialogue théâtral est un peu particulier : les répliques de chacun des personnages sont très courtes et s’enchaînent très rapidement. On appelle ce genre de répliques des stichomythies. Ce mot vient du grec ancien et servait à nommer les coups alternés et rapides que s’infligaient les combattants à l’épée.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 27, 'lesson', 'Stichomythies', 'Les stichomythies sont des répliques très courtes entre les personnages. Elles servent à montrer l’exaltation des sentiments, qu’il s’agisse d’amour, de peur, de haine ou d’exaspération.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 28, 'lesson', 'L’aparté', '« LUBIN :
Elle m’a dit de lui dire […] qu’elle lui est tout à fait obligée de l’affection qu’il a pour elle, et qu’à cause de son mari qui est fantasque, il garde d’en rien faire paraître, et qu’il faudra songer à chercher quelque invention pour se pouvoir entretenir tous deux.

GEORGE DANDIN, à part  :
Ah ! pendarde de femme.

LUBIN :
[…] Cela sera drôle, car le mari ne se doutera point de la manigance, voilà ce qui est de bon. »', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 29, 'lesson', 'Molière, George Dandin, Acte I scène 2', 'Ce que George Dandin dit dans cet exemple est une réplique prononcée à haute voix et qui s’adresse au public. Cependant, les autres comédiens sur scène (ici Lubin) sont sensés ne pas l’entendre. Ce procédé, nommé l’aparté, crée une connivence avec le public. Souvent, dans le texte, on fait précéder l’aparté de la mention « à part ».', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 30, 'lesson', 'Aparté', 'L’aparté est une réplique adressée au public que les autres acteurs sur scène font semblant de ne pas entendre. Ce procédé crée une connivence avec le public, il est très utilisé en comédie.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 31, 'lesson', 'À retenir', 'L’aparté est un procédé théâtral de rupture du quatrième mur : en s’adressant directement à la salle, le comédien interrompt la situation en train de se jouer sur scène pour prendre les spectateurs à témoin. Se faisant, il empêche de croire à l’illusion de réalité.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 32, 'lesson', 'Le monologue théâtral', '« FIGARO, seul, se promenant dans l’obscurité, dit du ton le plus sombre  :
Ô femme ! femme ! femme ! créature faible et décevante ! … nul animal créé ne peut manquer à son instinct : le tien est-il donc de tromper ? … Après m’avoir obstinément refusé quand je l’en pressais devant sa maîtresse ; à l’instant qu’elle me donne sa parole, au milieu même de la cérémonie… Il riait en lisant, le perfide ! et moi comme un benêt… Non, monsieur le comte, vous ne l’aurez pas… vous ne l’aurez pas. Parce que vous êtes un grand seigneur, vous vous croyez un grand génie ! … Noblesse, fortune, un rang, des places, tout cela rend si fier ! Qu’avez-vous fait pour tant de biens ? Vous vous êtes donné la peine de naître, et rien de plus. Du reste, homme assez ordinaire ; tandis que moi, morbleu ! perdu dans la foule obscure, il m’a fallu déployer plus de science et de calculs pour subsister seulement, qu’on n’en a mis depuis cent ans à gouverner toutes les Espagnes : et vous voulez jouter… On vient… c’est elle… ce n’est personne. – La nuit est noire en diable, et me voilà faisant le sot métier de mari quoique je ne le sois qu’à moitié ! […]  »', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 33, 'lesson', 'Beaumarchais, Le Mariage de Figaro, Acte V scène 3', 'L’exemple ci-dessus est le très célèbre monologue de Figaro. Il est environ cinq fois plus long que l’extrait présenté ici.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 34, 'lesson', 'Monologue', 'Au théâtre, un monologue est une longue prise de parole par un personnage qui se parle à lui-même alors qu’il est, ou se croit, seul sur scène.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 35, 'lesson', 'Les stances', '« Percé jusques au fond du cœur
D’une atteinte imprévue aussi bien que mortelle,
Misérable vengeur d’une juste querelle,
Et malheureux objet d’une injuste rigueur,
Je demeure immobile, et mon âme abattue
Cède au coup qui me tue.
Si près de voir mon feu récompensé,
Ô Dieu, l’étrange peine !
En cet affront mon père est l’offensé,
Et l’offenseur le père de Chimène !

Que je sens de rudes combats !
Contre mon propre honneur mon amour s’intéresse :
Il faut venger un père, et perdre une maitresse.
L’un m’anime le cœur, l’autre retient mon bras.
Réduit au triste choix ou de trahir ma flamme,
Ou de vivre en infâme,
Des deux côtés mon mal est infini.
Ô Dieu, l’étrange peine !
Faut-il laisser un affront impuni ?
Faut-il punir le père de Chimène ?

Père, maitresse, honneur, amour,
Noble et dure contrainte, aimable tyrannie,
Tous mes plaisirs sont morts, ou ma gloire ternie.
L’un me rend malheureux, l’autre indigne du jour.
Cher et cruel espoir d’une âme généreuse,
Mais ensemble amoureuse,
Digne ennemi de mon plus grand bonheur,
Fer qui cause ma peine,
M’es-tu donné pour venger mon honneur ?
M’es-tu donné pour perdre ma Chimène ?

Il vaut mieux courir au trépas.
Je dois à ma maitresse aussi bien qu’à mon père ;
J’attire en me vengeant sa haine et sa colère ;
J’attire ses mépris en ne me vengeant pas.
À mon plus doux espoir l’un me rend infidèle,
Et l’autre indigne d’elle.
Mon mal augmente à le vouloir guérir ;
Tout redouble ma peine.
Allons, mon âme ; et puisqu’il faut mourir,
Mourons du moins sans offenser Chimène. […] »', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 36, 'lesson', 'Corneille, Le Cid, Acte I scène 6', 'Dans ce long extrait pourtant largement raccourci du Cid, don Rodrigue doit décider s’il tue ou non le père de sa promise pour venger le sien. S’il le fait, Chimène ne l’aimera plus, et s’il ne le fait pas, il sera déshonoré faute d’avoir vengé son père. Le choix est impossible à faire : c’est un dilemme cornélien (car on doit son invention à Pierre Corneille). Rodrigue tente de trouver une solution dans des strophes en vers nommées des stances.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 37, 'lesson', 'Stances', 'Les stances sont les différentes strophes d’un monologue versifié. Elles sont de même longueur et de même rythme. Elles servent à prendre une décision face à un dilemme. La dernière des stances est celle qui apporte finalement la solution : elle s’appelle la chute.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 38, 'lesson', 'À retenir', 'Un dilemme au théâtre est un problème particulièrement difficile à régler et pour lequel toutes les solutions ont des conséquences mauvaises sur le héros.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 39, 'lesson', 'La tirade', '« CYRANO :
Ah ! Non ! C’est un peu court, jeune homme !
On pouvait dire… oh ! Dieu ! … bien des choses en somme…
En variant le ton, – par exemple, tenez :
Agressif : "moi, monsieur, si j’avais un tel nez,
Il faudrait sur le champ que je me l’amputasse !”
Amical : "mais il doit tremper dans votre tasse :
Pour boire, faites-vous fabriquer un hanap !”
Descriptif : "c’est un roc ! … c’est un pic… c’est un cap !
Que dis-je, c’est un cap ? … c’est une péninsule !”
Curieux : "de quoi sert cette oblongue capsule ?
D’écritoire, monsieur, ou de boîte à ciseaux ?”
Gracieux : "aimez-vous à ce point les oiseaux
Que paternellement vous vous préoccupâtes
De tendre ce perchoir à leurs petites pattes ?”
Truculent : "ça, monsieur, lorsque vous pétunez,
La vapeur du tabac vous sort-elle du nez
Sans qu’un voisin ne crie au feu de cheminée ?" […] »', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 40, 'lesson', 'Edmond Rostand, Cyrano de Bergerac, Acte I scène IV', 'Dans cet extrait de la célèbre tirade du nez, Cyrano, le personnage principal, répond à un homme qui l’a insulté en disant juste « Vous… vous avez un nez… heu… un nez… très grand. » Là encore, il ne s’agit que d’un extrait.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 41, 'lesson', 'Tirade', 'Au théâtre, une tirade, c’est lorsqu’un des personnages monopolise la parole pendant un long moment, aux dépens des autres personnages sur scène.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 42, 'lesson', 'Attention', 'Par sa longueur, la tirade ressemble au monologue. Pour différencier les deux, il faut donc savoir si le personnage en train de parler s’adresse à lui-même ou à un autre personnage.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 43, 'lesson', 'La tragédie et le tragique', 'La tragédie est un genre théâtral très ancien, puisqu’on écrivait et jouait déjà des tragédies durant l’Antiquité grecque. C’est à l’origine un art destiné à faire réfléchir les citoyens et servant à honorer les dieux.

Lorsque les empires grec puis romain ont disparu, on a cessé de jouer des tragédies. Néanmoins, le genre ne s’est pas totalement perdu puisqu’au Moyen Âge on jouait des pièces de théâtre religieuses, les mystères, qui avaient la même fonction.

Les tragédies antiques ont été redécouvertes au XVIIe siècle. En France, sous le règne de Louis XIV, elles ont suscité tant d’intérêt que de nouvelles tragédies, inspirées des modèles grecs, ont été écrites. Les principaux auteurs de tragédies classiques sont Corneille et Racine. Tous deux ont des styles très différents.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 44, 'lesson', 'À retenir', 'La tragédie est une pièce de théâtre rédigée en alexandrins. Elle comporte cinq actes et se termine généralement par la mort du personnage principal.

Les thèmes abordés en tragédie sont la politique, le destin, la condition humaine, le pouvoir divin, etc. On comprend donc que le ton d’une tragédie est sérieux.

Les personnages de tragédie sont d’un rang noble, des rois et reines, des princes, des représentants de l’État, parfois des héros ou des demi-dieux. Dans une tragédie, ces personnages ont de grands pouvoirs politiques et leurs décisions influent sur la destinée des autres. Aussi, une tragédie met toujours en scène un moment de crise où la destinée d’une ville, voire d’un peuple entier, peut basculer dans le chaos.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 45, 'lesson', 'La comédie et le comique', 'Aussi ancienne que la tragédie, la comédie lui est généralement opposée. Là où la tragédie cherche à susciter les passions et la réflexion, la comédie mise sur le divertissement et le rire. Néanmoins, la comédie sert aussi à faire réfléchir : en pointant les défauts d’un avare, d’une femme adultère ou d’un faux dévot, elle exhorte les spectateurs à se corriger.

Le genre a lui aussi connu des évolutions. Au Moyen Âge notamment, de très courtes comédies en prose mettant en scène gens du peuple, petite noblesse ou bourgeoisie étaient nommées des farces. Ce genre, très populaire, a existé longtemps.

Contrairement à la tragédie qui a été redécouverte, la comédie n’a jamais complètement disparu. Au XVIIe siècle en France, l’auteur phare de la comédie est Molière. Il a commencé par écrire des farces jouées en province, avant de se faire connaitre à la cour.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 46, 'lesson', 'À retenir', 'La comédie est un genre théâtral populaire le plus souvent rédigé en prose. Elle comporte généralement trois ou cinq actes.

Plus que des thèmes précis, la comédie met en scène des caractères humains exagérés tels que l’homme avare, la femme adultère, la jeune fille amoureuse ou le jeune homme amoureux, le valet rusé, le noble libertin, le dévot…

Les personnages de comédie sont généralement des bourgeois ou de petits nobles, la classe sociale la plus basse étant constituée par les valets, suivantes, nourrisses et autres serviteurs desdits nobles. Dans les rares cas où il y a des paysans, ils sont toujours policés.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 47, 'lesson', 'Attention', 'Tout comme il ne faut pas confondre tragédie et tragique, il existe une distinction entre la comédie, pièce de théâtre, et le registre comique. Le registre comique peut être obtenu par différents procédés appelés les types de comique.

Les types de comique sont aussi appelés procédés comiques. On peut tous les combiner ou en utiliser juste quelques-uns. Ils ne sont pas le propre du théâtre et peuvent se trouver dans n’importe quel genre littéraire. Ce sont :

le comique de mot : les accents régionaux, les calembours, les lapsus et autres mauvaises prononciations sont autant de comiques de mots possibles ;
le comique de geste : le jeu des acteurs, les bastonnades font partie du comique de geste ;
le comique de répétition : répéter une réplique plusieurs fois dans la pièce, reproduire pratiquement à l’identique une scène, amener un double d’un personnage fait partie du comique de répétition ;
le comique de situation : la plus fréquente est le quiproquo, c’est-à-dire lorsqu’une personne se fait passer pour une autre. Le quiproquo est levé lors d’une scène dite de « reconnaissance » ;
le comique de mœurs ou de caractère : c’est le fait de créer un personnage caricatural, un « caractère », par exemple un avare, une précieuse ridicule, un mari trompé… Molière le fait dans beaucoup de ses pièces.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 48, 'lesson', 'Les règles du théâtre classique', 'Durant le règne de Louis XIV, l’art doit servir le pouvoir du roi et les idéaux esthétiques du classicisme.

À cette époque, le théâtre est donc théorisé. Les penseurs de l’époque le cadrent avec des règles contraignantes. Ces règles sont la règle de vraisemblance, la règle de bienséance et la règle des trois unités.
La règle de vraisemblance', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 49, 'lesson', 'Règle de vraisemblance', 'La règle de vraisemblance impose aux auteurs de donner une impression de vérité, car les spectateurs ne peuvent pas se sentir concernés par une pièce de téâtre si elle ne reflète pas assez la réalité. L’histoire doit donc être crédible.

Cette règle a été très critiquée car elle était un énorme frein à l’imagination des auteurs.
La règle de bienséance', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 50, 'lesson', 'Règle de bienséance', 'La règle de bienséance impose de ne pas choquer le public. Il faut donc un langage soigné, des sentiments nobles. Par ailleurs, il est interdit de montrer des meurtres sur scène.

La règle de bienséance était globalement respectée au siècle classique, du moins pour le théâtre de cour.
La règle des trois unités', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 51, 'lesson', 'La règle des trois unités a suscité de vifs débats entre les auteurs, notamment de tragédie.', 'Racine, par exemple, s’y est strictement conformé et était apprécié pour cela.
Corneille en revanche, préférait appliquer avec plus de souplesse ces règles qui contrariaient trop son imagination.
La rivalité entre ces deux auteurs était très connue à l’époque.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 52, 'lesson', 'Règle des trois unités', 'Pour imiter au mieux la réalité, il faut que la durée de l’action d’une pièce soit comparable au temps réellement nécessaire pour la jouer. Par ailleurs, il faut une unique action et un unique lieu.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 53, 'lesson', 'Ces principes se résument par le respect de la règle des trois unités', 'l’unité de temps : pas d’ellipses temporelles, impossible de sauter plusieurs heures ;
l’unité de lieu : un seul endroit où tout le monde peut se croiser, comme le devant d’un palais, une antichambre, un vestibule ;
l’unité d’action : une intrigue simple sur laquelle on se concentre et qui doit s’achever avec le dénouement de la pièce.
Même en leur temps, ces règles très strictes étaient régulièrement transgressées. Molière par exemple, en faisait assez peu de cas et disait que « l’essentiel est de plaire ».', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 54, 'lesson', 'La remise en question des règles', 'Les XVIIIe et XIXe siècles sont eux aussi des siècles de théâtre. Néanmoins, la règle des trois unités est peu a peu dépassée.

À l’époque moderne, on ne pratique même plus la séparation des genres tragique et comique et on mêle les deux au sein d’une seule pièce, comme dans le théâtre de l’absurde.

Cette forme de théâtre est apparue à la fin de la Seconde Guerre mondiale. C’est un théâtre étrange, qui met l’accent sur les personnages mais sans construire pour eux une action particulière. Cette absence d’action permet de mettre en scène l’absurdité de la condition humaine.

Aujourd’hui, les réalisations les plus modernes ne nomment plus les personnages, nient la nécessité d’un décor, pratiquent la déconstruction de l’illusion théâtrale, bref, remettent constamment le genre en question. Mais des pièces plus traditionnelles sont toujours produites, notamment des comédies. La tragédie en revanche, est en net retrait.

​Conclusion :

Au théâtre, le texte n’est donc qu’un outil de travail, destiné avant tout aux comédiens. Pour des raisons pratiques, il est divisé en actes et en scènes, et n’indique que les répliques des personnages, sans narration aucune. La parole au théâtre peut être un simple dialogue, une tirade, un monologue, ou encore un aparté, qui établit un lien avec le public en dépit de la règle du quatrième mur.
Analyser un texte de théâtre, c’est aussi savoir différencier tragique et comique, et donc tragédie et comédie, et avoir conscience que ces deux genres, très anciens, ont beaucoup évolué au fil du temps.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 55, 'quiz', 'Qu''est-ce que : Les didascalies ?', 'Qu''est-ce que : Les didascalies ?', '[{"id":"opt-0","text":"Les didascalies ne sont perceptibles que dans le théâtre écrit, les spectateurs n’ont pas conscience de leur présence durant la représentation.","isCorrect":true},{"id":"opt-1","text":"Les didascalies sont des indications scéniques qui apparaissent sur le texte théâtral et que les acteurs ne jouent pas.","isCorrect":false},{"id":"opt-2","text":"les didascalies initiales sont celles qui figurent au début du texte.","isCorrect":false},{"id":"opt-3","text":"La scène au théâtre est tout à la fois le lieu sur lequel les comédiens jouent et le découpage de la pièce en plusieurs unités narratives.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 56, 'quiz', 'Qu''est-ce que : Didascalies ?', 'Qu''est-ce que : Didascalies ?', '[{"id":"opt-0","text":"Les didascalies sont des indications scéniques qui apparaissent sur le texte théâtral et que les acteurs ne jouent pas.","isCorrect":true},{"id":"opt-1","text":"Les didascalies ne sont perceptibles que dans le théâtre écrit, les spectateurs n’ont pas conscience de leur présence durant la représentation.","isCorrect":false},{"id":"opt-2","text":"les didascalies initiales sont celles qui figurent au début du texte.","isCorrect":false},{"id":"opt-3","text":"La scène au théâtre est tout à la fois le lieu sur lequel les comédiens jouent et le découpage de la pièce en plusieurs unités narratives.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 57, 'quiz', 'Qu''est-ce que : On distingue plusieurs types de didascalies ?', 'Qu''est-ce que : On distingue plusieurs types de didascalies ?', '[{"id":"opt-0","text":"les didascalies initiales sont celles qui figurent au début du texte.","isCorrect":true},{"id":"opt-1","text":"Les didascalies ne sont perceptibles que dans le théâtre écrit, les spectateurs n’ont pas conscience de leur présence durant la représentation.","isCorrect":false},{"id":"opt-2","text":"Les didascalies sont des indications scéniques qui apparaissent sur le texte théâtral et que les acteurs ne jouent pas.","isCorrect":false},{"id":"opt-3","text":"La scène au théâtre est tout à la fois le lieu sur lequel les comédiens jouent et le découpage de la pièce en plusieurs unités narratives.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 58, 'quiz', 'Qu''est-ce que : Scène ?', 'Qu''est-ce que : Scène ?', '[{"id":"opt-0","text":"La scène au théâtre est tout à la fois le lieu sur lequel les comédiens jouent et le découpage de la pièce en plusieurs unités narratives.","isCorrect":true},{"id":"opt-1","text":"Les didascalies ne sont perceptibles que dans le théâtre écrit, les spectateurs n’ont pas conscience de leur présence durant la représentation.","isCorrect":false},{"id":"opt-2","text":"Les didascalies sont des indications scéniques qui apparaissent sur le texte théâtral et que les acteurs ne jouent pas.","isCorrect":false},{"id":"opt-3","text":"les didascalies initiales sont celles qui figurent au début du texte.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 59, 'quiz', 'Qu''est-ce que : Acte ?', 'Qu''est-ce que : Acte ?', '[{"id":"opt-0","text":"Un acte rassemble plusieurs scènes (dont le nombre peut varier).","isCorrect":true},{"id":"opt-1","text":"Les didascalies ne sont perceptibles que dans le théâtre écrit, les spectateurs n’ont pas conscience de leur présence durant la représentation.","isCorrect":false},{"id":"opt-2","text":"Les didascalies sont des indications scéniques qui apparaissent sur le texte théâtral et que les acteurs ne jouent pas.","isCorrect":false},{"id":"opt-3","text":"les didascalies initiales sont celles qui figurent au début du texte.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 60, 'quiz', 'Qu''est-ce que : Les scènes d’ouverture et de clôture au théâtre ?', 'Qu''est-ce que : Les scènes d’ouverture et de clôture au théâtre ?', '[{"id":"opt-0","text":"Pour la première scène d’une pièce, ou à la rigueur, les deux premières scènes, on parle de scène d’exposition.","isCorrect":true},{"id":"opt-1","text":"Les didascalies ne sont perceptibles que dans le théâtre écrit, les spectateurs n’ont pas conscience de leur présence durant la représentation.","isCorrect":false},{"id":"opt-2","text":"Les didascalies sont des indications scéniques qui apparaissent sur le texte théâtral et que les acteurs ne jouent pas.","isCorrect":false},{"id":"opt-3","text":"les didascalies initiales sont celles qui figurent au début du texte.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 61, 'quiz', 'Qu''est-ce que : Scène d’exposition ?', 'Qu''est-ce que : Scène d’exposition ?', '[{"id":"opt-0","text":"La scène d’exposition est le nom de la première scène d’une pièce de théâtre.","isCorrect":true},{"id":"opt-1","text":"Les didascalies ne sont perceptibles que dans le théâtre écrit, les spectateurs n’ont pas conscience de leur présence durant la représentation.","isCorrect":false},{"id":"opt-2","text":"Les didascalies sont des indications scéniques qui apparaissent sur le texte théâtral et que les acteurs ne jouent pas.","isCorrect":false},{"id":"opt-3","text":"les didascalies initiales sont celles qui figurent au début du texte.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 62, 'quiz', 'Qu''est-ce que : La scène d’exposition a plusieurs rôles ?', 'Qu''est-ce que : La scène d’exposition a plusieurs rôles ?', '[{"id":"opt-0","text":"présenter les personnages principaux ; raconter ce qui a pu se passer avant le début de la pièce et qui serait utile à la pièce ; faire comprendre quelle intrigue va se jouer (une intrigue amoureuse, une affaire d’argent, un mari trompé, une vengeance).","isCorrect":true},{"id":"opt-1","text":"Les didascalies ne sont perceptibles que dans le théâtre écrit, les spectateurs n’ont pas conscience de leur présence durant la représentation.","isCorrect":false},{"id":"opt-2","text":"Les didascalies sont des indications scéniques qui apparaissent sur le texte théâtral et que les acteurs ne jouent pas.","isCorrect":false},{"id":"opt-3","text":"les didascalies initiales sont celles qui figurent au début du texte.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 63, 'quiz', 'Qu''est-ce que : Dénouement ?', 'Qu''est-ce que : Dénouement ?', '[{"id":"opt-0","text":"Le dénouement au théâtre est la dernière scène, où tous les nœuds dramatiques se défont et où toutes les intrigues de la pièce se résolvent.","isCorrect":true},{"id":"opt-1","text":"Les didascalies ne sont perceptibles que dans le théâtre écrit, les spectateurs n’ont pas conscience de leur présence durant la représentation.","isCorrect":false},{"id":"opt-2","text":"Les didascalies sont des indications scéniques qui apparaissent sur le texte théâtral et que les acteurs ne jouent pas.","isCorrect":false},{"id":"opt-3","text":"les didascalies initiales sont celles qui figurent au début du texte.","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('f5311355-4d1f-40ad-97b4-478c033d0991', 64, 'quiz', 'Qu''est-ce que : Le hors-scène ?', 'Qu''est-ce que : Le hors-scène ?', '[{"id":"opt-0","text":"Au théâtre, le plus souvent, on montre l’action en direct, en la faisant jouer par les personnages présents sur scène.","isCorrect":true},{"id":"opt-1","text":"Les didascalies ne sont perceptibles que dans le théâtre écrit, les spectateurs n’ont pas conscience de leur présence durant la représentation.","isCorrect":false},{"id":"opt-2","text":"Les didascalies sont des indications scéniques qui apparaissent sur le texte théâtral et que les acteurs ne jouent pas.","isCorrect":false},{"id":"opt-3","text":"les didascalies initiales sont celles qui figurent au début du texte.","isCorrect":false}]', NULL, NULL, 50);

INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'f5311355-4d1f-40ad-97b4-478c033d0991', '2026-01-17', 1, 0, 5)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'f5311355-4d1f-40ad-97b4-478c033d0991', '2026-01-18', 2, 6, 11)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'f5311355-4d1f-40ad-97b4-478c033d0991', '2026-01-19', 3, 12, 17)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'f5311355-4d1f-40ad-97b4-478c033d0991', '2026-01-20', 4, 18, 23)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'f5311355-4d1f-40ad-97b4-478c033d0991', '2026-01-21', 5, 24, 29)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'f5311355-4d1f-40ad-97b4-478c033d0991', '2026-01-22', 6, 30, 35)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'f5311355-4d1f-40ad-97b4-478c033d0991', '2026-01-23', 7, 36, 41)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'f5311355-4d1f-40ad-97b4-478c033d0991', '2026-01-24', 8, 42, 47)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'f5311355-4d1f-40ad-97b4-478c033d0991', '2026-01-25', 9, 48, 53)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'f5311355-4d1f-40ad-97b4-478c033d0991', '2026-01-26', 10, 54, 59)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'f5311355-4d1f-40ad-97b4-478c033d0991', '2026-01-27', 11, 60, 64)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;

-- Course: Trigonométrie dans un triangle rectangle
INSERT INTO public.courses (id, user_id, title, description, category, level, estimated_minutes, icon, total_xp, is_published, duration_days, daily_cards_count)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', '00000000-0000-0000-0000-000000000001', 'Trigonométrie dans un triangle rectangle', 'Cours de Mathématiques : Trigonométrie dans un triangle rectangle', 'Mathématiques', '3eme', 15, '📚', 920, true, 9, 6);

INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 0, 'lesson', 'Prérequis', 'cours de 4esur le théorème de Pythagore.

Nous savons désormais calculer des longueurs dans diverses situations : avec le théorème de Thalès, dans un triangle, si une droite coupe deux de ses côtés (ou les droites qui portent ces côtés) tout en étant parallèle au troisième ; avec le théorème de Pythagore, dans un triangle rectangle, si on connaît la longueur de deux côtés.
Dans ce cours, nous allons découvrir une nouvelle façon de calculer des longueurs dans un triangle rectangle, et même des mesures d’angles, grâce aux rapports trigonométriques, que nous avons un peu abordés en quatrième, avec le cosinus d’un angle.
Nous définirons donc, dans un premier temps, ces rapports trigonométriques que sont les cosinus, sinus et tangente d’un angle aigu dans un triangle rectangle. Ensuite, à travers exemples et petits exercices corrigés, nous verrons comment ils permettent de déterminer des longueurs ou des mesures d’angles.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 1, 'lesson', 'Théorème de Pythagore (et réciproque)', 'Dans un triangle rectangle, le carré de la longueur de l’hypoténuse est égal à la somme des carrés des longueurs des deux autres côtés.
Réciproquement, si, dans un triangle, le carré de la longueur d’un côté est égal à la somme des carrés des longueurs des deux autres côtés, alors le triangle est rectangle.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 2, 'lesson', 'Vocabulaire et notations', 'Avant d’entrer dans le vif du sujet, commençons par préciser les termes et les notations que nous utiliserons dans ce cours.

On considère un triangle 
𝐴
𝐵
𝐶
ABC rectangle en 
𝐵
B :', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 3, 'lesson', 'Dans ce triangle', 'les côtés 
[
𝐴
𝐵
]
[AB] et 
[
𝐵
𝐶
]
[BC] forment l’angle droit ;
le troisième côté 
[
𝐴
𝐶
]
[AC] est l’hypoténuse ;
on s’intéresse plus particulièrement aux angles aigus du triangle rectangle, c’est-à-dire aux deux angles qui ne sont pas droits (ils sont donc strictement compris entre 
0
°
0° et 
90
°
90°), et on notera :
𝐴
^
A
 l’angle 
𝐵
𝐴
𝐶
^
BAC
,
𝐶
^
C
 l’angle 
𝐴
𝐶
𝐵
^
ACB
 ;
on appellera côté adjacent à un angle le côté qui le forme et qui n’est pas l’hypoténuse, ainsi :
[
𝐴
𝐵
]
[AB] est le côté adjacent à l’angle 
𝐴
^
A
,
[
𝐵
𝐶
]
[BC] est le côté adjacent à l’angle 
𝐶
^
C
 ;
et on appellera côté opposé à un angle l’autre côté qui forme l’angle droit, ainsi :
[
𝐵
𝐶
]
[BC] est le côté opposé à l’angle 
𝐴
^
A
,
[
𝐴
𝐵
]
[AB] est le côté opposé à l’angle 
𝐶
^
C
.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 4, 'lesson', 'Définition et propriétés', 'En quatrième, nous avons vu que, dans un triangle rectangle en 
𝐵
B, le rapport 
𝐴
𝐵
𝐴
𝐶
AC
AB
	​

 ne dépendait que de la mesure de l’angle aigu 
𝐴
^
A
. Nous avions ensuite défini le cosinus de l’angle 
𝐴
^
A
 comme égal à ce rapport.
Nous allons ici compléter cette propriété-définition.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 5, 'lesson', 'Propriété', 'Dans un triangle 
𝐴
𝐵
𝐶
ABC rectangle en 
𝐵
B, les rapports 
𝐴
𝐵
𝐴
𝐶
AC
AB
	​

, 
𝐵
𝐶
𝐴
𝐶
AC
BC
	​

 et 
𝐵
𝐶
𝐴
𝐵
AB
BC
	​

 ne dépendent que de la mesure de l’angle aigu 
𝐴
^
A
.

Ces rapports, dits trigonométriques, sont respectivement appelés cosinus, sinus et tangente de l’angle 
𝐴
^
A
.
Et ils sont respectivement notés 
cos
⁡
𝐴
^
cos
A
, 
sin
⁡
𝐴
^
sin
A
 et 
tan
⁡
𝐴
^
tan
A
 (on peut aussi mettre l’angle entre parenthèses).', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 6, 'lesson', 'On a alors', 'cos
⁡
𝐴
^
	
=
𝐴
𝐵
𝐴
𝐶
=
longueur du c
o
ˆ
t
e
ˊ
 adjacent
longueur de l’hypot
e
ˊ
nuse




sin
⁡
𝐴
^
	
=
𝐵
𝐶
𝐴
𝐶
=
longueur du c
o
ˆ
t
e
ˊ
 oppos
e
ˊ
longueur de l’hypot
e
ˊ
nuse




tan
⁡
𝐴
^
	
=
𝐵
𝐶
𝐴
𝐵
=
longueur du c
o
ˆ
t
e
ˊ
 oppos
e
ˊ
longueur du c
o
ˆ
t
e
ˊ
 adjacent
cos
A
sin
A
tan
A
	​

=
AC
AB
	​

=
longueur de l’hypot
e
ˊ
nuse
longueur du c
o
ˆ
t
e
ˊ
 adjacent
	​

=
AC
BC
	​

=
longueur de l’hypot
e
ˊ
nuse
longueur du c
o
ˆ
t
e
ˊ
 oppos
e
ˊ
	​

=
AB
BC
	​

=
longueur du c
o
ˆ
t
e
ˊ
 adjacent
longueur du c
o
ˆ
t
e
ˊ
 oppos
e
ˊ
	​

	​', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 7, 'lesson', 'Astuce', 'Pour retrouver les formules pour calculer les rapports trigonométriques, on peut se souvenir de l’expression (qui ressemble à une incantation rituelle) :

S
O
H
 C
A
H
 T
O
A
SOH CAH TOA

𝑆
inus
=
𝑂
ppos
e
ˊ
𝐻
ypot
e
ˊ
nuse
𝐶
osinus
=
𝐴
djacent
𝐻
ypot
e
ˊ
nuse
𝑇
angente
=
𝑂
ppos
e
ˊ
𝐴
djacent
Sinus=
Hypot
e
ˊ
nuse
Oppos
e
ˊ
	​

Cosinus=
Hypot
e
ˊ
nuse
Adjacent
	​

Tangente=
Adjacent
Oppos
e
ˊ
	​', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 8, 'lesson', 'Ou, de manière plus familière, en se souvenant de l’expression proche de « Casse-toi »', 'C
A
H
 S
O
H
 T
O
A
CAH SOH TOA

Dans un triangle rectangle, l’hypoténuse est toujours le côté plus long. On a alors les propriétés suivantes.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 9, 'lesson', 'Propriété', 'Le cosinus et le sinus d’un angle aigu dans un triangle rectangle est strictement compris entre 
0
0 et 
1
1.
Sa tangente, elle, est un nombre strictement positif.

On peut aussi retenir les propriétés suivantes, bien utiles dans certaines situations. (Nous les admettons cette année, mais leurs démonstrations sont assez simples, comme vous le verrez en seconde.)', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 10, 'lesson', 'Propriété', 'Quel que soit l’angle aigu 
𝐴
^
A
, on a :

(
cos
⁡
𝐴
^
)
2
+
(
sin
⁡
𝐴
^
)
2
=
1
(cos
A
)
2
+(sin
A
)
2
=1

Quel que soit l’angle aigu 
𝐴
^
A
, on a aussi, pour la tangente :

tan
⁡
𝐴
^
=
sin
⁡
𝐴
^
cos
⁡
𝐴
^
tan
A
=
cos
A
sin
A
	​', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 11, 'lesson', 'À retenir', 'Pour calculer le cosinus, le sinus ou la tangente d’un angle donné, on utilise les fonctions dédiées de la calculatrice, en étant sûr qu’elle est bien paramétrée en degré : cos / sin / tan', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 12, 'lesson', 'Astuce', 'On peut se souvenir de ces trois valeurs remarquables, qui permettront le cas échéant de ne pas faire appel à la calculatrice :

cos
⁡
(
60
°
)
=
1
2
sin
⁡
(
30
°
)
=
1
2
tan
⁡
(
45
°
)
=
1
cos(60°)=
2
1
	​

sin(30°)=
2
1
	​

tan(45°)=1

Les rapports trigonométriques permettent de calculer des longueurs, ou de déterminer des mesures d’angles. C’est ce que nous allons voir dans les deux parties suivantes.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 13, 'lesson', 'Méthode', 'Dans un triangle, nous savons, grâce au théorème de Pythagore, calculer la longueur d’un côté si nous connaissons la longueur des deux autres.
Les rapports trigonométriques permettent, eux, de déterminer la longueur d’un côté en connaissant la longueur d’un seul côté et la mesure d’un angle aigu.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 14, 'lesson', 'Astuce', 'Ainsi, dans les exercices, ayez les réflexes suivants si on vous demande de calculer une longueur dans un triangle rectangle.

Vous connaissez la longueur de deux côtés ?
Théorème de Pythagore.
Vous connaissez la longueur d’un côté et la mesure d’un angle ?
Rapports trigonométriques.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 15, 'lesson', 'Méthode : Comment calculer des longueurs grâce aux rapports trigonométriques', 'Tout d’abord, on s’assure qu’on travaille bien dans un triangle rectangle.
Puis on identifie les grandeurs qui sont connues : quel est le côté dont on connaît la longueur, quel est l’angle dont on connaît la mesure, de quel côté cherche-t-on la longueur ?
En fonction de ces données, on choisit le rapport trigonométrique qui nous intéresse, où figurent la longueur connue et la longueur recherchée. Par exemple :

on connaît la longueur de l’hypoténuse et on souhaite calculer la longueur du côté opposé à l’angle connu ?
on utilise le sinus, car on se souvient du SOH : « Sinus (égale) Opposé (sur) Hypoténuse » ;
on connaît la longueur du côté opposé et on cherche la longueur du côté adjacent à l’angle connu ?
on utilise la tangente, car TOA : « Tangente (égale) Opposé (sur) Adjacent.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 16, 'lesson', 'Exemple', 'On considère le triangle 
𝑃
𝐻
𝑂
PHO rectangle en 
𝐻
H représenté ci-dessous :', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 17, 'lesson', 'Triangle PHO rectangle en H', 'On cherche la longueur du côté 
[
𝑃
𝑂
]
[PO].

On connaît donc la mesure de l’angle 
𝑃
^
P
, ainsi que la longueur du côté adjacent. Et 
[
𝑃
𝑂
]
[PO] est l’hypoténuse du triangle rectangle.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 18, 'lesson', 'On a alors', 'cos
⁡
𝑃
^
	
=
𝑃
𝐻
𝑃
𝑂


Soit : 
cos
⁡
(
60
°
)
	
=
1
𝑃
𝑂
cos
P
Soit : cos(60°)
	​

=
PO
PH
	​

=
PO
1
	​

	​


On peut se souvenir ici de la valeur remarquable du cosinus d’un angle de 
60
°
60°, que nous avons mentionnée dans la première partie, avant de se servir des produits en croix :

1
2
	
=
1
𝑃
𝑂


D’o
u
ˋ
 : 
𝑃
𝑂
	
=
2
 m
2
1
	​

D’o
u
ˋ
 : PO
	​

=
PO
1
	​

=
2 m
	​

	​', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 19, 'lesson', 'Astuce', 'Dans cet exemple, on peut aussi calculer la longueur de 
[
𝐻
𝑂
]
[HO].

Si une valeur approchée nous suffit, par exemple au centimètre près, on peut par exemple utiliser la tangente de l’angle 
𝑃
^
P
 et se servir d’une calculatrice :

tan
⁡
𝑃
^
	
=
𝐻
𝑂
𝑃
𝐻


D’o
u
ˋ
 : 
𝐻
𝑂
	
=
𝑃
𝐻
×
tan
⁡
𝑃
^


	
=
1
×
tan
⁡
(
60
°
)


	
=
tan
⁡
(
60
°
)


	
≈
1
,
73
 m
tan
P
D’o
u
ˋ
 : HO
	​

=
PH
HO
	​

=PH×tan
P
=1×tan(60°)
=tan(60°)
≈
1,73 m
	​

	​


Si on souhaite donner la valeur exacte de 
𝐻
𝑂
HO, et comme on a une valeur exacte pour 
𝑃
𝑂
=
2
 m
PO=2 m, on peut se servir du théorème de Pythagore qui, appliqué dans le triangle 
𝑃
𝐻
𝑂
PHO rectangle en 
𝐻
H, donne :

𝑃
𝐻
2
+
𝐻
𝑂
2
	
=
𝑃
𝑂
2


D’o
u
ˋ
 : 
𝐻
𝑂
2
	
=
𝑃
𝑂
2
−
𝑃
𝐻
2


	
=
2
2
−
1
2


	
=
4
−
1


	
=
3
PH
2
+HO
2
D’o
u
ˋ
 : HO
2
	​

=PO
2
=PO
2
−PH
2
=2
2
−1
2
=4−1
=3
	​


𝐻
𝑂
HO est une longueur, donc positive, et on obtient :

𝐻
𝑂
=
3
≈
1
,
73
HO=
3
	​

	​

≈1,73

Allons encore un peu plus loin : des deux égalités que nous avons vues, on peut déduire la valeur exacte de la tangente d’un angle de 
60
°
60° :

𝐻
𝑂
=
tan
⁡
(
60
°
)
=
3
HO=
tan(60°)=
3
	​

	​


On a de plus : 
sin
⁡
𝑃
^
=
𝐻
𝑂
𝑃
𝑂
sin
P
=
PO
HO
	​

.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 20, 'lesson', 'On trouve ainsi', 'sin
⁡
(
60
°
)
=
3
2
sin(60°)=
2
3
	​

	​

	​


On connaît maintenant les valeurs exactes des cosinus, sinus et tangente d’un angle de 
60
°
60° :

cos
⁡
(
60
°
)
=
1
2
sin
⁡
(
60
°
)
=
3
2
tan
⁡
(
60
°
)
=
3
cos(60°)=
2
1
	​

sin(60°)=
2
3
	​

	​

tan(60°)=
3
	​', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 21, 'lesson', 'Petit exercice pour approfondir, si vous voulez : toujours à partir de ce triangle, montrer que', 'cos
⁡
(
30
°
)
	
=
sin
⁡
(
60
°
)
=
3
2


sin
⁡
(
30
°
)
	
=
cos
⁡
(
60
°
)
=
1
2
cos(30°)
sin(30°)
	​

=sin(60°)=
2
3
	​

	​

=cos(60°)=
2
1
	​

	​


Toutes ces valeurs que nous venons de donner font partie des valeurs remarquables que certains auront à connaître au lycée. (Oui, on prend un peu d’avance… Elles ne sont pas exigibles au collège.)', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 22, 'lesson', 'Application', 'Voyons maintenant comment appliquer ce que nous venons d’apprendre à un cas concret, avec un exercice corrigé adapté d’un sujet de brevet (Nouvelle-Calédonie, 2015).', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 23, 'lesson', 'Énoncé', 'L’entrée d’une librairie est surélevée par rapport au trottoir, de 
30
 cm
30 cm. Pour augmenter l’accessibilité du magasin, la libraire décide d’ajouter une rampe d’accès. Celle-ci, pour respecter les normes et limiter la pente à monter ou descendre, formera un angle de 
3
°
3° par rapport à la rue (que nous considérons horizontale).
On représente la situation par le schéma suivant, qui n’est pas à l’échelle :', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 24, 'lesson', 'Ainsi', '𝑃
𝑂
𝐿
POL est un triangle rectangle en 
𝑂
O ;
𝑂
𝑃
=
30
 cm
OP=30 cm ;
l’angle 
𝐿
^
L
 mesure 
3
°
3°.

Calculer la longueur 
𝑂
𝐿
OL, arrondie au centimètre près, pour savoir où doit commencer la rampe.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 25, 'lesson', 'Corrigé', '𝑃
𝑂
𝐿
POL est un triangle rectangle en 
𝑂
O. Et on connaît la mesure de 
𝐿
^
L
, ainsi que la longueur 
𝑂
𝑃
OP, soit celle du côté opposé. Et on veut connaître la longueur de 
[
𝑂
𝐿
]
[OL], qui est le côté adjacent. On se servira donc de la tangente de l’angle 
𝐿
^
L
 :

tan
⁡
𝐿
^
	
=
𝑂
𝑃
𝑂
𝐿


D’o
u
ˋ
 : 
𝑂
𝐿
	
=
𝑂
𝑃
tan
⁡
𝐿
^
=
30
tan
⁡
(
3
°
)
≈
572
,
43
 cm
tan
L
D’o
u
ˋ
 : OL
	​

=
OL
OP
	​

=
tan
L
OP
	​

=
tan(3°)
30
	​

≈572,43 cm
	​


On va ici arrondir par excès et donner comme réponse 
573
 cm
573 cm, car, avec une longueur de 
572
 cm
572 cm, on aurait un angle légèrement plus grand que les 
3
°
3° voulus par les normes que s’est fixées la libraire.

La longueur 
𝑃
𝑂
PO doit donc être égale à 
5
,
73
 m
5,73 m.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 26, 'lesson', 'Méthode : Comment déterminer des mesures d’angles grâce aux rapports trigonométriques', 'Tout d’abord, on s’assure qu’on travaille bien dans un triangle rectangle.
Ensuite, à partir de l’angle dont on cherche la mesure, on repère quelle longueur sont connues. Et on choisit en conséquence le rapport à utiliser :

on connaît les longueurs du côté adjacent à l’angle et de l’hypoténuse ?
on calcule le cosinus ;
on connaît les longueurs du côté opposé à l’angle et de l’hypoténuse ?
on calcule le sinus ;
on connaît les longueurs des côtés adjacent et opposé à l’angle ?
on calcule la tangente.

Puis, connaissant la valeur du rapport, pour obtenir la mesure de l’angle, on utilise les fonctions dédiées de la calculatrice :

arccos
⁡
arccos, si on a le cosinus ;
arcsin
⁡
arcsin, si on a le sinus ;
arctan
⁡
arctan, si on a la tangente.

Pour accéder à ces fonctions, on appuiera successivement sur les touches indiquées dans le tableau suivant :

	

TI', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 27, 'lesson', 'Numworks', 'arccos
⁡
arccos

	

2nde et cos', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 28, 'lesson', 'SECONDE et cos', 'shift et cos




arcsin
⁡
arcsin

	

2nde et sin', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 29, 'lesson', 'SECONDE et sin', 'shift et sin




arctan
⁡
arctan

	

2nde et tan', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 30, 'lesson', 'SECONDE et tan', 'shift et tan

Si la valeur du rapport calculé n’est pas un nombre décimal, on entrera dans la calculatrice le quotient (entre parenthèses), plutôt que la valeur approchée, pour ne pas ajouter encore de l’approximation au résultat final.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 31, 'lesson', 'Exemple', 'On considère le triangle 
𝑃
𝑂
𝑇
POT rectangle en 
𝑂
O représenté ci-dessous :', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 32, 'lesson', 'Triangle POT rectangle en O', 'On cherche à déterminer la mesure, au degrès près, de l’angle 
𝑇
^
T
.

Les longueurs ici connues sont celles de 
[
𝑃
𝑂
]
[PO], qui est le côté opposé à 
𝑇
^
T
, et 
[
𝑇
𝑃
]
[TP], qui est l’hypoténuse du triangle rectangle.

On pense donc au sinus de 
𝑇
^
T
 :

sin
⁡
𝑇
^
=
𝑃
𝑂
𝑇
𝑃
=
6
9
=
2
3
sin
T
=
TP
PO
	​

=
9
6
	​

=
3
2
	​


2
3
3
2
	​

 n’est pas un nombre décimal, on entre donc dans la calculatrice :

arcsin
⁡
(
2
÷
3
)
arcsin(2÷3)

Elle nous renvoie la valeur, arrondie au degré près, de la mesure de 
𝑇
^
T
 :

𝑇
^
≈
42
°
T
≈
42°
	​', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 33, 'lesson', 'Énoncé', 'On pose contre un mur vertical et perpendiculaire au sol une échelle de 
13
 m
13 m de long, et ses pieds sont posés à 
5
 m
5 m du mur.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 34, 'lesson', 'À quelle hauteur du mur repose-t-elle ?', 'Le constructeur de l’échelle recommande, pour assurer la sécurité de l’utilisateur, un angle entre le sol et l’échelle compris entre 
65
°
65° et 
75
°
75°.

Avec l’échelle posée selon les conditions données plus haut, la situation respecte-t-elle la recommandation de sécurité ?
Corrigé
Hauteur de l’échelle', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 35, 'lesson', 'Astuce', 'La première chose à faire dans un tel exercice, où aucune représentation n’est donnée, est de tracer un schéma au brouillon, même à « main levée » et sans souci d’échelle, pour bien comprendre la situation et identifier les propriétés que l’on pourra utiliser.
On fait aussi bien attention au contenu de l’énoncé : ici, il est précisé que le mur est non seulement vertical, mais surtout perpendiculaire au sol, il y aura donc un angle droit à marquer.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 36, 'lesson', 'Sur cette représentation', 'l’échelle est représentée par le segment 
[
𝐵
𝐶
]
[BC], avec donc : 
𝐵
𝐶
=
13
 m
BC=13 m ;
𝐴
𝐵
AB est la distance entre les pieds de l’échelle et le mur, d’où : 
𝐴
𝐵
=
5
 m
AB=5 m ;
on marque aussi l’angle droit entre le sol et le mur.

On voit que le triangle 
𝐴
𝐵
𝐶
ABC est rectangle en 
𝐴
A, 
[
𝐵
𝐶
]
[BC] étant donc l’hypoténuse, et que la hauteur recherchée est la longueur du segment 
[
𝐴
𝐶
]
[AC].
De plus, du triangle 
𝐴
𝐵
𝐶
ABC, on connaît la longueur de deux côtés : pour calculer la longueur du troisième, on utilise donc le théorème de Pythagore :

𝐴
𝐵
2
+
𝐴
𝐶
2
	
=
𝐵
𝐶
2


D’o
u
ˋ
 : 
𝐴
𝐶
2
	
=
𝐵
𝐶
2
−
𝐴
𝐵
2


	
=
1
3
2
−
5
2


	
=
169
−
25


	
=
144
AB
2
+AC
2
D’o
u
ˋ
 : AC
2
	​

=BC
2
=BC
2
−AB
2
=13
2
−5
2
=169−25
=144
	​


𝐴
𝐶
AC étant une longueur, et reconnaissant en 
144
144 un carré parfait (celui de 
12
12), on obtient :

𝐴
𝐶
=
144
=
1
2
2
=
12
AC=
144
	​

=
12
2
	​

=
12
	​


L’échelle repose sur le mur à une hauteur de 
12
 m
12 m au-dessus du sol.
Mesure de l’angle formé par l’échelle et le sol

On cherche donc à savoir si la mesure de l’angle entre le sol et l’échelle est comprise entre 
65
°
65° et 
75
°
75°.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 37, 'lesson', 'Là aussi, pour bien se représenter la situation, représentons sur notre schéma ce que l’on cherche.', 'C’est la mesure de l’angle 
𝐵
^
B
.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 38, 'lesson', 'Représentation de la situation', 'Pour déterminer la mesure d’un angle dans un triangle rectangle, on pense immédiatement aux rapports trigonométriques. Ici, on a les longueurs des trois côtés, on a donc l’embarras du choix… Pour le plaisir, nous donnons ci-dessous le calcul via les trois rapports : nous trouverons bien sûr le même résultat (sinon, il faudra s’inquiéter…).', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 39, 'lesson', 'Avec le cosinus', 'cos
⁡
𝐵
^
=
𝐴
𝐵
𝐵
𝐶
=
5
13
cos
B
=
BC
AB
	​

=
13
5
	​


En entrant dans la calculette : 
arccos
⁡
(
5
÷
13
)
arccos(5÷13), on trouve, arrondi au dixième près :

𝐵
^
≈
67
,
4
°
B
≈
67,4°
	​', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 40, 'lesson', 'Avec le sinus', 'sin
⁡
𝐵
^
=
𝐴
𝐶
𝐵
𝐶
=
12
13
sin
B
=
BC
AC
	​

=
13
12
	​


En entrant dans la calculette : 
arcsin
⁡
(
12
÷
13
)
arcsin(12÷13), on trouve, arrondi au dixième près :

𝐵
^
≈
67
,
4
°
B
≈
67,4°
	​', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 41, 'lesson', 'Avec la tangente', 'tan
⁡
𝐵
^
=
𝐴
𝐶
𝐴
𝐵
=
12
5
=
2
,
4
tan
B
=
AB
AC
	​

=
5
12
	​

=2,4

En entrant dans la calculette : 
arctan
⁡
2.4
arctan2.4, on trouve, arrondi au dixième près :

𝐵
^
≈
67
,
4
°
B
≈
67,4°
	​


Ainsi, dans la configuration donnée, l’échelle et le sol forment un angle d’environ 
67
,
4
°
67,4°, qui est compris entre les 
65
°
65° et 
75
°
75° préconisés par le constructeur.

Nous avons vu dans ce cours comment, à partir de la mesure d’angles, on peut déterminer des longueurs (et inversement) grâce aux rapports trigonométriques. Les applications, tout au long de l’histoire et au quotidien, en sont immenses : en astronomie, en navigation, en optique, en électricité, en musique – oui, aussi ! –, etc.
Et, à notre niveau, nous disposons maintenant de nombreux outils géométriques : Thalès, Pythagore, trigonométrie… Ainsi, nous sommes de mieux en mieux armés pour résoudre des problèmes de plus en plus complexes.', NULL, NULL, NULL, 10);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 42, 'quiz', 'Qu''est-ce que : Prérequis ?', 'Qu''est-ce que : Prérequis ?', '[{"id":"opt-0","text":"cours de 4esur le théorème de Pythagore.  Nous savons désormais calculer des longueurs dans diverses situations : avec le théorème de Thalès, dans un triangle, si une droite coupe deux de ses côtés (ou les droites qui portent ces côtés) tout en étant parallèle au troisième ; avec le théorème de Pythagore, dans un triangle rectangle, si on connaît la longueur de deux côtés.","isCorrect":true},{"id":"opt-1","text":"Dans un triangle rectangle, le carré de la longueur de l’hypoténuse est égal à la somme des carrés des longueurs des deux autres côtés.","isCorrect":false},{"id":"opt-2","text":"Avant d’entrer dans le vif du sujet, commençons par préciser les termes et les notations que nous utiliserons dans ce cours.  On considère un triangle  𝐴 𝐵 𝐶 ABC rectangle en  𝐵 B :","isCorrect":false},{"id":"opt-3","text":"les côtés  [ 𝐴 𝐵 ] [AB] et  [ 𝐵 𝐶 ] [BC] forment l’angle droit ; le troisième côté  [ 𝐴 𝐶 ] [AC] est l’hypoténuse ; on s’intéresse plus particulièrement aux angles aigus du triangle rectangle, c’est-à-dire aux deux angles qui ne sont pas droits (ils sont donc strictement compris entre  0 ° 0° et  90 ° 90°), et on notera : 𝐴 ^ A  l’angle  𝐵 𝐴 𝐶 ^ BAC , 𝐶 ^ C  l’angle  𝐴 𝐶 𝐵 ^ ACB  ; on appellera côté adjacent à un angle le côté qui le forme et qui n’est pas l’hypoténuse, ainsi : [ 𝐴 𝐵 ] [AB] est le côté adjacent à l’angle  𝐴 ^ A , [ 𝐵 𝐶 ] [BC] est le côté adjacent à l’angle  𝐶 ^ C  ; et on appellera côté opposé à un angle l’autre côté qui forme l’angle droit, ainsi : [ 𝐵 𝐶 ] [BC] est le côté opposé à l’angle  𝐴 ^ A , [ 𝐴 𝐵 ] [AB] est le côté opposé à l’angle  𝐶 ^ C .","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 43, 'quiz', 'Qu''est-ce que : Théorème de Pythagore (et réciproque) ?', 'Qu''est-ce que : Théorème de Pythagore (et réciproque) ?', '[{"id":"opt-0","text":"Dans un triangle rectangle, le carré de la longueur de l’hypoténuse est égal à la somme des carrés des longueurs des deux autres côtés.","isCorrect":true},{"id":"opt-1","text":"cours de 4esur le théorème de Pythagore.  Nous savons désormais calculer des longueurs dans diverses situations : avec le théorème de Thalès, dans un triangle, si une droite coupe deux de ses côtés (ou les droites qui portent ces côtés) tout en étant parallèle au troisième ; avec le théorème de Pythagore, dans un triangle rectangle, si on connaît la longueur de deux côtés.","isCorrect":false},{"id":"opt-2","text":"Avant d’entrer dans le vif du sujet, commençons par préciser les termes et les notations que nous utiliserons dans ce cours.  On considère un triangle  𝐴 𝐵 𝐶 ABC rectangle en  𝐵 B :","isCorrect":false},{"id":"opt-3","text":"les côtés  [ 𝐴 𝐵 ] [AB] et  [ 𝐵 𝐶 ] [BC] forment l’angle droit ; le troisième côté  [ 𝐴 𝐶 ] [AC] est l’hypoténuse ; on s’intéresse plus particulièrement aux angles aigus du triangle rectangle, c’est-à-dire aux deux angles qui ne sont pas droits (ils sont donc strictement compris entre  0 ° 0° et  90 ° 90°), et on notera : 𝐴 ^ A  l’angle  𝐵 𝐴 𝐶 ^ BAC , 𝐶 ^ C  l’angle  𝐴 𝐶 𝐵 ^ ACB  ; on appellera côté adjacent à un angle le côté qui le forme et qui n’est pas l’hypoténuse, ainsi : [ 𝐴 𝐵 ] [AB] est le côté adjacent à l’angle  𝐴 ^ A , [ 𝐵 𝐶 ] [BC] est le côté adjacent à l’angle  𝐶 ^ C  ; et on appellera côté opposé à un angle l’autre côté qui forme l’angle droit, ainsi : [ 𝐵 𝐶 ] [BC] est le côté opposé à l’angle  𝐴 ^ A , [ 𝐴 𝐵 ] [AB] est le côté opposé à l’angle  𝐶 ^ C .","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 44, 'quiz', 'Qu''est-ce que : Vocabulaire et notations ?', 'Qu''est-ce que : Vocabulaire et notations ?', '[{"id":"opt-0","text":"Avant d’entrer dans le vif du sujet, commençons par préciser les termes et les notations que nous utiliserons dans ce cours.  On considère un triangle  𝐴 𝐵 𝐶 ABC rectangle en  𝐵 B :","isCorrect":true},{"id":"opt-1","text":"cours de 4esur le théorème de Pythagore.  Nous savons désormais calculer des longueurs dans diverses situations : avec le théorème de Thalès, dans un triangle, si une droite coupe deux de ses côtés (ou les droites qui portent ces côtés) tout en étant parallèle au troisième ; avec le théorème de Pythagore, dans un triangle rectangle, si on connaît la longueur de deux côtés.","isCorrect":false},{"id":"opt-2","text":"Dans un triangle rectangle, le carré de la longueur de l’hypoténuse est égal à la somme des carrés des longueurs des deux autres côtés.","isCorrect":false},{"id":"opt-3","text":"les côtés  [ 𝐴 𝐵 ] [AB] et  [ 𝐵 𝐶 ] [BC] forment l’angle droit ; le troisième côté  [ 𝐴 𝐶 ] [AC] est l’hypoténuse ; on s’intéresse plus particulièrement aux angles aigus du triangle rectangle, c’est-à-dire aux deux angles qui ne sont pas droits (ils sont donc strictement compris entre  0 ° 0° et  90 ° 90°), et on notera : 𝐴 ^ A  l’angle  𝐵 𝐴 𝐶 ^ BAC , 𝐶 ^ C  l’angle  𝐴 𝐶 𝐵 ^ ACB  ; on appellera côté adjacent à un angle le côté qui le forme et qui n’est pas l’hypoténuse, ainsi : [ 𝐴 𝐵 ] [AB] est le côté adjacent à l’angle  𝐴 ^ A , [ 𝐵 𝐶 ] [BC] est le côté adjacent à l’angle  𝐶 ^ C  ; et on appellera côté opposé à un angle l’autre côté qui forme l’angle droit, ainsi : [ 𝐵 𝐶 ] [BC] est le côté opposé à l’angle  𝐴 ^ A , [ 𝐴 𝐵 ] [AB] est le côté opposé à l’angle  𝐶 ^ C .","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 45, 'quiz', 'Qu''est-ce que : Dans ce triangle ?', 'Qu''est-ce que : Dans ce triangle ?', '[{"id":"opt-0","text":"les côtés  [ 𝐴 𝐵 ] [AB] et  [ 𝐵 𝐶 ] [BC] forment l’angle droit ; le troisième côté  [ 𝐴 𝐶 ] [AC] est l’hypoténuse ; on s’intéresse plus particulièrement aux angles aigus du triangle rectangle, c’est-à-dire aux deux angles qui ne sont pas droits (ils sont donc strictement compris entre  0 ° 0° et  90 ° 90°), et on notera : 𝐴 ^ A  l’angle  𝐵 𝐴 𝐶 ^ BAC , 𝐶 ^ C  l’angle  𝐴 𝐶 𝐵 ^ ACB  ; on appellera côté adjacent à un angle le côté qui le forme et qui n’est pas l’hypoténuse, ainsi : [ 𝐴 𝐵 ] [AB] est le côté adjacent à l’angle  𝐴 ^ A , [ 𝐵 𝐶 ] [BC] est le côté adjacent à l’angle  𝐶 ^ C  ; et on appellera côté opposé à un angle l’autre côté qui forme l’angle droit, ainsi : [ 𝐵 𝐶 ] [BC] est le côté opposé à l’angle  𝐴 ^ A , [ 𝐴 𝐵 ] [AB] est le côté opposé à l’angle  𝐶 ^ C .","isCorrect":true},{"id":"opt-1","text":"cours de 4esur le théorème de Pythagore.  Nous savons désormais calculer des longueurs dans diverses situations : avec le théorème de Thalès, dans un triangle, si une droite coupe deux de ses côtés (ou les droites qui portent ces côtés) tout en étant parallèle au troisième ; avec le théorème de Pythagore, dans un triangle rectangle, si on connaît la longueur de deux côtés.","isCorrect":false},{"id":"opt-2","text":"Dans un triangle rectangle, le carré de la longueur de l’hypoténuse est égal à la somme des carrés des longueurs des deux autres côtés.","isCorrect":false},{"id":"opt-3","text":"Avant d’entrer dans le vif du sujet, commençons par préciser les termes et les notations que nous utiliserons dans ce cours.  On considère un triangle  𝐴 𝐵 𝐶 ABC rectangle en  𝐵 B :","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 46, 'quiz', 'Qu''est-ce que : Définition et propriétés ?', 'Qu''est-ce que : Définition et propriétés ?', '[{"id":"opt-0","text":"En quatrième, nous avons vu que, dans un triangle rectangle en  𝐵 B, le rapport  𝐴 𝐵 𝐴 𝐶 AC AB \t​   ne dépendait que de la mesure de l’angle aigu  𝐴 ^ A .","isCorrect":true},{"id":"opt-1","text":"cours de 4esur le théorème de Pythagore.  Nous savons désormais calculer des longueurs dans diverses situations : avec le théorème de Thalès, dans un triangle, si une droite coupe deux de ses côtés (ou les droites qui portent ces côtés) tout en étant parallèle au troisième ; avec le théorème de Pythagore, dans un triangle rectangle, si on connaît la longueur de deux côtés.","isCorrect":false},{"id":"opt-2","text":"Dans un triangle rectangle, le carré de la longueur de l’hypoténuse est égal à la somme des carrés des longueurs des deux autres côtés.","isCorrect":false},{"id":"opt-3","text":"Avant d’entrer dans le vif du sujet, commençons par préciser les termes et les notations que nous utiliserons dans ce cours.  On considère un triangle  𝐴 𝐵 𝐶 ABC rectangle en  𝐵 B :","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 47, 'quiz', 'Qu''est-ce que : Propriété ?', 'Qu''est-ce que : Propriété ?', '[{"id":"opt-0","text":"Dans un triangle  𝐴 𝐵 𝐶 ABC rectangle en  𝐵 B, les rapports  𝐴 𝐵 𝐴 𝐶 AC AB \t​  ,  𝐵 𝐶 𝐴 𝐶 AC BC \t​   et  𝐵 𝐶 𝐴 𝐵 AB BC \t​   ne dépendent que de la mesure de l’angle aigu  𝐴 ^ A .","isCorrect":true},{"id":"opt-1","text":"cours de 4esur le théorème de Pythagore.  Nous savons désormais calculer des longueurs dans diverses situations : avec le théorème de Thalès, dans un triangle, si une droite coupe deux de ses côtés (ou les droites qui portent ces côtés) tout en étant parallèle au troisième ; avec le théorème de Pythagore, dans un triangle rectangle, si on connaît la longueur de deux côtés.","isCorrect":false},{"id":"opt-2","text":"Dans un triangle rectangle, le carré de la longueur de l’hypoténuse est égal à la somme des carrés des longueurs des deux autres côtés.","isCorrect":false},{"id":"opt-3","text":"Avant d’entrer dans le vif du sujet, commençons par préciser les termes et les notations que nous utiliserons dans ce cours.  On considère un triangle  𝐴 𝐵 𝐶 ABC rectangle en  𝐵 B :","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 48, 'quiz', 'Qu''est-ce que : On a alors ?', 'Qu''est-ce que : On a alors ?', '[{"id":"opt-0","text":"cos ⁡ 𝐴 ^ \t = 𝐴 𝐵 𝐴 𝐶 = longueur du c o ˆ t e ˊ  adjacent longueur de l’hypot e ˊ nuse     sin ⁡ 𝐴 ^ \t = 𝐵 𝐶 𝐴 𝐶 = longueur du c o ˆ t e ˊ  oppos e ˊ longueur de l’hypot e ˊ nuse     tan ⁡ \ud835...","isCorrect":true},{"id":"opt-1","text":"cours de 4esur le théorème de Pythagore.  Nous savons désormais calculer des longueurs dans diverses situations : avec le théorème de Thalès, dans un triangle, si une droite coupe deux de ses côtés (ou les droites qui portent ces côtés) tout en étant parallèle au troisième ; avec le théorème de Pythagore, dans un triangle rectangle, si on connaît la longueur de deux côtés.","isCorrect":false},{"id":"opt-2","text":"Dans un triangle rectangle, le carré de la longueur de l’hypoténuse est égal à la somme des carrés des longueurs des deux autres côtés.","isCorrect":false},{"id":"opt-3","text":"Avant d’entrer dans le vif du sujet, commençons par préciser les termes et les notations que nous utiliserons dans ce cours.  On considère un triangle  𝐴 𝐵 𝐶 ABC rectangle en  𝐵 B :","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 49, 'quiz', 'Qu''est-ce que : Propriété ?', 'Qu''est-ce que : Propriété ?', '[{"id":"opt-0","text":"Le cosinus et le sinus d’un angle aigu dans un triangle rectangle est strictement compris entre  0 0 et  1 1.","isCorrect":true},{"id":"opt-1","text":"cours de 4esur le théorème de Pythagore.  Nous savons désormais calculer des longueurs dans diverses situations : avec le théorème de Thalès, dans un triangle, si une droite coupe deux de ses côtés (ou les droites qui portent ces côtés) tout en étant parallèle au troisième ; avec le théorème de Pythagore, dans un triangle rectangle, si on connaît la longueur de deux côtés.","isCorrect":false},{"id":"opt-2","text":"Dans un triangle rectangle, le carré de la longueur de l’hypoténuse est égal à la somme des carrés des longueurs des deux autres côtés.","isCorrect":false},{"id":"opt-3","text":"Avant d’entrer dans le vif du sujet, commençons par préciser les termes et les notations que nous utiliserons dans ce cours.  On considère un triangle  𝐴 𝐵 𝐶 ABC rectangle en  𝐵 B :","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 50, 'quiz', 'Qu''est-ce que : Propriété ?', 'Qu''est-ce que : Propriété ?', '[{"id":"opt-0","text":"Quel que soit l’angle aigu  𝐴 ^ A , on a :  ( cos ⁡ 𝐴 ^ ) 2 + ( sin ⁡ 𝐴 ^ ) 2 = 1 (cos A ) 2 +(sin A ) 2 =1  Quel que soit l’angle aigu  𝐴 ^ A , on a aussi, pour la tangente :  tan ⁡ 𝐴 ^ = sin ⁡ ...","isCorrect":true},{"id":"opt-1","text":"cours de 4esur le théorème de Pythagore.  Nous savons désormais calculer des longueurs dans diverses situations : avec le théorème de Thalès, dans un triangle, si une droite coupe deux de ses côtés (ou les droites qui portent ces côtés) tout en étant parallèle au troisième ; avec le théorème de Pythagore, dans un triangle rectangle, si on connaît la longueur de deux côtés.","isCorrect":false},{"id":"opt-2","text":"Dans un triangle rectangle, le carré de la longueur de l’hypoténuse est égal à la somme des carrés des longueurs des deux autres côtés.","isCorrect":false},{"id":"opt-3","text":"Avant d’entrer dans le vif du sujet, commençons par préciser les termes et les notations que nous utiliserons dans ce cours.  On considère un triangle  𝐴 𝐵 𝐶 ABC rectangle en  𝐵 B :","isCorrect":false}]', NULL, NULL, 50);
INSERT INTO public.course_cards (course_id, order_index, type, title, content, options, flashcard_back, slider_config, xp_reward)
VALUES ('ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', 51, 'quiz', 'Qu''est-ce que : Méthode : Comment calculer des longueurs grâce aux rapports trigonométriques ?', 'Qu''est-ce que : Méthode : Comment calculer des longueurs grâce aux rapports trigonométriques ?', '[{"id":"opt-0","text":"Tout d’abord, on s’assure qu’on travaille bien dans un triangle rectangle.","isCorrect":true},{"id":"opt-1","text":"cours de 4esur le théorème de Pythagore.  Nous savons désormais calculer des longueurs dans diverses situations : avec le théorème de Thalès, dans un triangle, si une droite coupe deux de ses côtés (ou les droites qui portent ces côtés) tout en étant parallèle au troisième ; avec le théorème de Pythagore, dans un triangle rectangle, si on connaît la longueur de deux côtés.","isCorrect":false},{"id":"opt-2","text":"Dans un triangle rectangle, le carré de la longueur de l’hypoténuse est égal à la somme des carrés des longueurs des deux autres côtés.","isCorrect":false},{"id":"opt-3","text":"Avant d’entrer dans le vif du sujet, commençons par préciser les termes et les notations que nous utiliserons dans ce cours.  On considère un triangle  𝐴 𝐵 𝐶 ABC rectangle en  𝐵 B :","isCorrect":false}]', NULL, NULL, 50);

INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', '2026-01-17', 1, 0, 5)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', '2026-01-18', 2, 6, 11)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', '2026-01-19', 3, 12, 17)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', '2026-01-20', 4, 18, 23)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', '2026-01-21', 5, 24, 29)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', '2026-01-22', 6, 30, 35)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', '2026-01-23', 7, 36, 41)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', '2026-01-24', 8, 42, 47)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;
INSERT INTO public.course_sessions (user_id, course_id, scheduled_date, session_number, cards_start_index, cards_end_index)
VALUES ('00000000-0000-0000-0000-000000000001', 'ff4bd34a-6500-47ab-ad3d-d6cd2a32ea31', '2026-01-25', 9, 48, 51)
ON CONFLICT (user_id, course_id, session_number) DO NOTHING;

COMMIT;
