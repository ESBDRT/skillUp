-- Insert 18 courses (3 per category) with full content

DO $$
DECLARE
  poc_user_id UUID := '00000000-0000-0000-0000-000000000001';
  v_course_id UUID;
BEGIN

  -- ==================== BIEN-ÊTRE ====================
  
  -- Course 1: Secrets du Sommeil
  INSERT INTO courses (id, user_id, title, description, icon, category, level, estimated_minutes, duration_days, daily_cards_count, total_xp, is_published)
  VALUES (gen_random_uuid(), poc_user_id, 'Les Secrets du Sommeil Réparateur', 'Découvrez comment optimiser votre sommeil pour une meilleure santé et énergie au quotidien.', '😴', 'Bien-être', 'beginner', 8, 1, 10, 150, true)
  RETURNING id INTO v_course_id;
  
  INSERT INTO course_cards (course_id, order_index, type, title, content, options, flashcard_back, xp_reward) VALUES
  (v_course_id, 0, 'info', 'Introduction au sommeil', E'# L''importance du sommeil\n\nLe sommeil est un **pilier fondamental** de notre santé. Pendant que nous dormons, notre corps :\n\n- 🧠 Consolide la mémoire\n- 💪 Répare les tissus musculaires\n- 🛡️ Renforce le système immunitaire\n\n> Un adulte a besoin de **7 à 9 heures** de sommeil par nuit.', NULL, NULL, 10),
  (v_course_id, 1, 'info', 'Les cycles du sommeil', E'# Les 4 phases du sommeil\n\nChaque nuit, nous traversons **4 à 6 cycles** :\n\n1. **Sommeil léger** : Transition\n2. **Sommeil profond** : Récupération physique\n3. **Sommeil très profond** : Régénération\n4. **Sommeil paradoxal (REM)** : Rêves\n\nChaque cycle dure environ **90 minutes**.', NULL, NULL, 10),
  (v_course_id, 2, 'quiz', 'Quiz : Cycles', 'Combien de temps dure un cycle de sommeil ?', '{"options": ["45 minutes", "90 minutes", "120 minutes", "180 minutes"], "correctIndex": 1}', NULL, 15),
  (v_course_id, 3, 'info', 'Hygiène du sommeil', E'# 5 règles d''or\n\n1. 📱 **Éviter les écrans** 1h avant\n2. 🌡️ **Température** 18-20°C\n3. 🌙 **Obscurité totale**\n4. ⏰ **Horaires réguliers**\n5. ☕ **Pas de caféine** après 14h', NULL, NULL, 10),
  (v_course_id, 4, 'flashcard', 'Mémorisation : Température', 'Quelle est la température idéale pour dormir ?', NULL, 'La température idéale se situe entre **18 et 20°C**. Une chambre trop chaude perturbe le sommeil profond.', 20),
  (v_course_id, 5, 'quiz', 'Quiz : Hygiène', 'Quel conseil améliore le sommeil ?', '{"options": ["Regarder la TV au lit", "Sport avant de dormir", "Horaires réguliers", "Café le soir"], "correctIndex": 2}', NULL, 15),
  (v_course_id, 6, 'flashcard', 'Mémorisation : REM', 'Que se passe-t-il en sommeil paradoxal ?', NULL, 'Le sommeil paradoxal (REM) est la phase où nous **rêvons** et où le cerveau consolide les **souvenirs**.', 20),
  (v_course_id, 7, 'info', 'Conclusion', E'# Récapitulatif\n\n✅ Le sommeil est essentiel\n✅ Chaque cycle dure 90 min\n✅ Hygiène du sommeil = qualité\n\n🎯 Appliquez une règle d''or ce soir !', NULL, NULL, 10);

  -- Course 2: Méditation Débutants
  INSERT INTO courses (id, user_id, title, description, icon, category, level, estimated_minutes, duration_days, daily_cards_count, total_xp, is_published)
  VALUES (gen_random_uuid(), poc_user_id, 'Méditation pour Débutants', 'Apprenez les bases de la méditation en quelques minutes par jour.', '🧘', 'Bien-être', 'beginner', 7, 1, 8, 130, true)
  RETURNING id INTO v_course_id;
  
  INSERT INTO course_cards (course_id, order_index, type, title, content, options, flashcard_back, xp_reward) VALUES
  (v_course_id, 0, 'info', 'Qu''est-ce que la méditation ?', E'# La méditation\n\nUne **pratique millénaire** pour entraîner son attention.\n\n**Bienfaits** :\n- 🧠 Réduction du stress\n- 💡 Meilleure concentration\n- 😌 Gestion des émotions\n\n> **5 minutes par jour** suffisent !', NULL, NULL, 10),
  (v_course_id, 1, 'info', 'La respiration consciente', E'# Technique de base\n\n1. Asseyez-vous confortablement\n2. Fermez les yeux\n3. Inspirez par le nez (4 sec)\n4. Expirez par la bouche (6 sec)\n\n> Ramenez l''attention sur le souffle.', NULL, NULL, 10),
  (v_course_id, 2, 'quiz', 'Quiz : Méditation', 'Premier pas pour méditer ?', '{"options": ["Vider son esprit", "Se concentrer sur sa respiration", "Réciter des mantras", "Vide mental total"], "correctIndex": 1}', NULL, 15),
  (v_course_id, 3, 'flashcard', 'Mémorisation : Durée', 'Combien de temps méditer au début ?', NULL, 'Pour les débutants, **5 à 10 minutes** par jour suffisent. L''important est la régularité.', 20),
  (v_course_id, 4, 'info', 'Les postures', E'# Position pour méditer\n\n- **Chaise** : dos droit, pieds au sol\n- **Tailleur** : sur un coussin\n- **Allongé** : attention à ne pas dormir !\n\n🔑 Être **confortable mais alerte**.', NULL, NULL, 10),
  (v_course_id, 5, 'quiz', 'Quiz : Posture', 'Clé d''une bonne posture ?', '{"options": ["Être rigide", "Confortable mais alerte", "Toujours en lotus", "Debout"], "correctIndex": 1}', NULL, 15),
  (v_course_id, 6, 'flashcard', 'Mémorisation : Technique 4-6', 'Décrivez la respiration 4-6.', NULL, '**Inspirer 4 secondes** par le nez, **expirer 6 secondes** par la bouche. Active le système parasympathique.', 20),
  (v_course_id, 7, 'info', 'Conclusion', E'# Prêt à méditer !\n\n✅ 5 min/jour suffisent\n✅ Focus sur la respiration\n✅ Soyez régulier\n\n🎯 Méditez 5 min demain matin !', NULL, NULL, 10);

  -- Course 3: Gérer le Stress
  INSERT INTO courses (id, user_id, title, description, icon, category, level, estimated_minutes, duration_days, daily_cards_count, total_xp, is_published)
  VALUES (gen_random_uuid(), poc_user_id, 'Gérer son Stress au Quotidien', 'Techniques pratiques pour réduire le stress.', '🌿', 'Bien-être', 'intermediate', 9, 1, 10, 160, true)
  RETURNING id INTO v_course_id;
  
  INSERT INTO course_cards (course_id, order_index, type, title, content, options, flashcard_back, xp_reward) VALUES
  (v_course_id, 0, 'info', 'Comprendre le stress', E'# Le stress : ami ou ennemi ?\n\nRéponse naturelle du corps.\n\n**Stress aigu** (positif) : concentration, performance\n**Stress chronique** (négatif) : épuisement, immunité affaiblie', NULL, NULL, 10),
  (v_course_id, 1, 'info', 'Signaux d''alerte', E'# Reconnaître le stress\n\n**Physiques** : cœur rapide, transpiration, maux de tête\n**Émotionnels** : irritabilité, anxiété, difficultés de concentration', NULL, NULL, 10),
  (v_course_id, 2, 'quiz', 'Quiz : Types', 'Quel stress est bénéfique à court terme ?', '{"options": ["Chronique", "Aigu", "Burn-out", "Anxiété"], "correctIndex": 1}', NULL, 15),
  (v_course_id, 3, 'info', 'Technique 5-4-3-2-1', E'# Ancrage sensoriel\n\n- 👀 **5** choses vues\n- 👂 **4** sons\n- ✋ **3** textures\n- 👃 **2** odeurs\n- 👅 **1** saveur\n\nRamène dans le moment présent.', NULL, NULL, 10),
  (v_course_id, 4, 'flashcard', 'Mémorisation : 5-4-3-2-1', 'Expliquez la technique 5-4-3-2-1.', NULL, 'Technique de **grounding** utilisant les 5 sens pour ramener l''attention au présent et couper le cycle du stress.', 20),
  (v_course_id, 5, 'info', 'Cohérence cardiaque', E'# Respirez en 3 temps\n\n1. **Inspirez** 5 sec\n2. **Expirez** 5 sec\n3. **Répétez** 5 min\n\n✨ Pratiquez **3 fois par jour**.', NULL, NULL, 10),
  (v_course_id, 6, 'quiz', 'Quiz : Cohérence', 'Combien de fois par jour ?', '{"options": ["1 fois", "2 fois", "3 fois", "5 fois"], "correctIndex": 2}', NULL, 15),
  (v_course_id, 7, 'flashcard', 'Mémorisation : Cohérence', 'Rythme de la cohérence cardiaque ?', NULL, '**Inspirer 5 sec**, **expirer 5 sec**, 6 respirations/min, pendant 5 min, 3 fois par jour.', 20),
  (v_course_id, 8, 'info', 'Conclusion', E'# Récapitulatif\n\n✅ Reconnaître les signaux\n✅ Technique 5-4-3-2-1\n✅ Cohérence cardiaque\n\n🎯 Essayez maintenant !', NULL, NULL, 10);

  -- ==================== NUTRITION ====================

  -- Course 4: Alimentation Saine
  INSERT INTO courses (id, user_id, title, description, icon, category, level, estimated_minutes, duration_days, daily_cards_count, total_xp, is_published)
  VALUES (gen_random_uuid(), poc_user_id, 'Les Bases d''une Alimentation Saine', 'Fondamentaux de la nutrition équilibrée.', '🥗', 'Nutrition', 'beginner', 8, 1, 10, 150, true)
  RETURNING id INTO v_course_id;
  
  INSERT INTO course_cards (course_id, order_index, type, title, content, options, flashcard_back, xp_reward) VALUES
  (v_course_id, 0, 'info', 'L''assiette équilibrée', E'# Modèle de l''assiette\n\n- 🥬 **50% légumes**\n- 🍚 **25% glucides**\n- 🍗 **25% protéines**\n\n> Ajoutez des bonnes graisses.', NULL, NULL, 10),
  (v_course_id, 1, 'info', 'Groupes alimentaires', E'# 5 groupes essentiels\n\n1. Fruits et légumes\n2. Céréales\n3. Protéines\n4. Produits laitiers\n5. Matières grasses', NULL, NULL, 10),
  (v_course_id, 2, 'quiz', 'Quiz : Assiette', 'Proportion de légumes ?', '{"options": ["25%", "33%", "50%", "75%"], "correctIndex": 2}', NULL, 15),
  (v_course_id, 3, 'flashcard', 'Mémorisation : Assiette', 'Proportions de l''assiette ?', NULL, '**50% légumes**, **25% glucides**, **25% protéines** + bonnes graisses.', 20),
  (v_course_id, 4, 'info', 'Aliments à privilégier', E'# Choix santé\n\n✅ Légumes de saison, fruits frais, céréales complètes, légumineuses\n❌ Sucres ajoutés, ultra-transformés, sel en excès', NULL, NULL, 10),
  (v_course_id, 5, 'quiz', 'Quiz : Aliments', 'Aliment à privilégier ?', '{"options": ["Sodas", "Plats préparés", "Légumineuses", "Chips"], "correctIndex": 2}', NULL, 15),
  (v_course_id, 6, 'flashcard', 'Mémorisation : Aliments', '3 catégories à privilégier ?', NULL, '**Légumes de saison**, **céréales complètes** et **légumineuses**.', 20),
  (v_course_id, 7, 'info', 'Conclusion', E'# Récapitulatif\n\n✅ 50% légumes\n✅ Aliments bruts\n✅ Limiter les transformés\n\n🎯 Ajoutez un légume !', NULL, NULL, 10);

  -- Course 5: Macronutriments
  INSERT INTO courses (id, user_id, title, description, icon, category, level, estimated_minutes, duration_days, daily_cards_count, total_xp, is_published)
  VALUES (gen_random_uuid(), poc_user_id, 'Comprendre les Macronutriments', 'Protéines, glucides, lipides expliqués.', '🔬', 'Nutrition', 'beginner', 9, 1, 10, 160, true)
  RETURNING id INTO v_course_id;
  
  INSERT INTO course_cards (course_id, order_index, type, title, content, options, flashcard_back, xp_reward) VALUES
  (v_course_id, 0, 'info', 'Les 3 macronutriments', E'# Macro quoi ?\n\n- 🍞 **Glucides** : carburant\n- 🥩 **Protéines** : construction\n- 🥑 **Lipides** : énergie et hormones', NULL, NULL, 10),
  (v_course_id, 1, 'info', 'Les glucides', E'# L''énergie\n\n**Simples** : fruits, sucre (rapides)\n**Complexes** : céréales (durables)\n\n> Privilégiez les complexes !', NULL, NULL, 10),
  (v_course_id, 2, 'quiz', 'Quiz : Glucides', 'Glucides à privilégier ?', '{"options": ["Simples", "Complexes", "Raffinés", "Sucrés"], "correctIndex": 1}', NULL, 15),
  (v_course_id, 3, 'info', 'Les protéines', E'# Les briques du corps\n\n**Rôles** : muscles, réparation, immunité\n**Sources** : viande, poisson, légumineuses, tofu', NULL, NULL, 10),
  (v_course_id, 4, 'flashcard', 'Mémorisation : Protéines', 'Rôle des protéines ?', NULL, '**Construction et réparation des tissus**, système immunitaire, enzymes.', 20),
  (v_course_id, 5, 'info', 'Les lipides', E'# Graisses essentielles\n\n✅ Huile d''olive, avocat, oméga-3\n❌ Graisses trans, excès de saturées\n\n> 25-35% de l''apport calorique.', NULL, NULL, 10),
  (v_course_id, 6, 'quiz', 'Quiz : Lipides', 'Bonne source de lipides ?', '{"options": ["Margarine industrielle", "Huile d''olive", "Beurre de palme", "Graisses trans"], "correctIndex": 1}', NULL, 15),
  (v_course_id, 7, 'flashcard', 'Mémorisation : 3 macros', 'Nommez les 3 macronutriments.', NULL, '**Glucides** (énergie), **protéines** (construction), **lipides** (énergie et hormones).', 20),
  (v_course_id, 8, 'info', 'Conclusion', E'# Récapitulatif\n\n✅ Glucides = énergie\n✅ Protéines = construction\n✅ Lipides = réserve\n\n🎯 Équilibrez vos macros !', NULL, NULL, 10);

  -- Course 6: Hydratation
  INSERT INTO courses (id, user_id, title, description, icon, category, level, estimated_minutes, duration_days, daily_cards_count, total_xp, is_published)
  VALUES (gen_random_uuid(), poc_user_id, 'L''Hydratation et ses Bienfaits', 'Pourquoi et comment bien s''hydrater.', '💧', 'Nutrition', 'beginner', 6, 1, 8, 120, true)
  RETURNING id INTO v_course_id;
  
  INSERT INTO course_cards (course_id, order_index, type, title, content, options, flashcard_back, xp_reward) VALUES
  (v_course_id, 0, 'info', 'L''eau dans notre corps', E'# 60% d''eau !\n\nL''eau :\n- 🌡️ Régule la température\n- 🚛 Transporte les nutriments\n- 🧹 Élimine les déchets\n\n> 2% de déshydratation = performances réduites', NULL, NULL, 10),
  (v_course_id, 1, 'info', 'Combien boire ?', E'# Recommandations\n\n- Femmes : ~**2 litres**\n- Hommes : ~**2,5 litres**\n\n⬆️ Sport, chaleur, maladie', NULL, NULL, 10),
  (v_course_id, 2, 'quiz', 'Quiz : Hydratation', 'Eau/jour pour un homme ?', '{"options": ["1 litre", "1,5 litres", "2,5 litres", "4 litres"], "correctIndex": 2}', NULL, 15),
  (v_course_id, 3, 'flashcard', 'Mémorisation : Quantité', 'Quantité d''eau par jour ?', NULL, '**2 litres** (femmes), **2,5 litres** (hommes). Plus si sport/chaleur.', 20),
  (v_course_id, 4, 'info', 'Signes de déshydratation', E'# Écoutez votre corps\n\n- 💛 Urine foncée\n- 🤕 Maux de tête\n- 😵 Fatigue\n- 👄 Bouche sèche\n\n> N''attendez pas la soif !', NULL, NULL, 10),
  (v_course_id, 5, 'quiz', 'Quiz : Déshydratation', 'Signe de déshydratation ?', '{"options": ["Urine claire", "Énergie", "Urine foncée", "Peau hydratée"], "correctIndex": 2}', NULL, 15),
  (v_course_id, 6, 'flashcard', 'Mémorisation : Signes', '2 signes de déshydratation ?', NULL, '**Urine foncée**, **maux de tête**, fatigue, bouche sèche.', 20),
  (v_course_id, 7, 'info', 'Conclusion', E'# Récapitulatif\n\n✅ 2-2,5 L/jour\n✅ Surveillez vos urines\n✅ Buvez régulièrement\n\n🎯 Gardez une bouteille près de vous !', NULL, NULL, 10);

  -- ==================== MENTAL ====================

  -- Course 7: Concentration
  INSERT INTO courses (id, user_id, title, description, icon, category, level, estimated_minutes, duration_days, daily_cards_count, total_xp, is_published)
  VALUES (gen_random_uuid(), poc_user_id, 'Développer sa Concentration', 'Techniques pour améliorer votre focus.', '🎯', 'Mental', 'beginner', 8, 1, 10, 150, true)
  RETURNING id INTO v_course_id;
  
  INSERT INTO course_cards (course_id, order_index, type, title, content, options, flashcard_back, xp_reward) VALUES
  (v_course_id, 0, 'info', 'La concentration expliquée', E'# Qu''est-ce que le focus ?\n\nCapacité à maintenir son attention sur une tâche.\n\n**Ennemis** : notifications, interruptions, pensées parasites\n\n> Attention moyenne : **8 secondes** !', NULL, NULL, 10),
  (v_course_id, 1, 'info', 'Environnement de travail', E'# Zone de focus\n\n1. 📱 Désactivez notifications\n2. 🎧 Écouteurs (musique sans paroles)\n3. 🧹 Bureau rangé\n4. 🚪 Signalez votre indisponibilité', NULL, NULL, 10),
  (v_course_id, 2, 'quiz', 'Quiz : Environnement', 'Pour mieux se concentrer ?', '{"options": ["Garder les notifs", "Bruit", "Désactiver les notifs", "Multitâcher"], "correctIndex": 2}', NULL, 15),
  (v_course_id, 3, 'flashcard', 'Mémorisation : Attention', 'Durée moyenne d''attention ?', NULL, 'Environ **8 secondes**. D''où l''importance d''un environnement sans distractions.', 20),
  (v_course_id, 4, 'info', 'Time-blocking', E'# Bloquez votre temps\n\n1. 📅 Planifiez les tâches\n2. ⏰ Blocs de 25-50 min\n3. 🎯 Une seule tâche/bloc\n4. 💤 Pause entre les blocs', NULL, NULL, 10),
  (v_course_id, 5, 'quiz', 'Quiz : Time-blocking', 'Durée d''un bloc idéal ?', '{"options": ["10 min", "25-50 min", "2 heures", "4 heures"], "correctIndex": 1}', NULL, 15),
  (v_course_id, 6, 'flashcard', 'Mémorisation : Time-blocking', 'Décrivez le time-blocking.', NULL, '**Bloquer des créneaux de 25 à 50 minutes** dédiés à une seule tâche, suivis de pauses.', 20),
  (v_course_id, 7, 'info', 'Conclusion', E'# Récapitulatif\n\n✅ Éliminez les distractions\n✅ Bloquez votre temps\n✅ Une tâche à la fois\n\n🎯 Bloc de 25 min maintenant !', NULL, NULL, 10);

  -- Course 8: Psychologie Positive
  INSERT INTO courses (id, user_id, title, description, icon, category, level, estimated_minutes, duration_days, daily_cards_count, total_xp, is_published)
  VALUES (gen_random_uuid(), poc_user_id, 'La Psychologie Positive', 'La science du bonheur et du bien-être.', '🌈', 'Mental', 'intermediate', 9, 1, 10, 160, true)
  RETURNING id INTO v_course_id;
  
  INSERT INTO course_cards (course_id, order_index, type, title, content, options, flashcard_back, xp_reward) VALUES
  (v_course_id, 0, 'info', 'Introduction', E'# Psychologie positive\n\nCréée par **Martin Seligman**. Étudie ce qui rend heureux.\n\n**Focus** : forces personnelles, émotions positives, sens\n\n> Pas "penser positif" mais comprendre le bien-être.', NULL, NULL, 10),
  (v_course_id, 1, 'info', 'Le modèle PERMA', E'# 5 piliers du bien-être\n\n- **P**ositive emotions\n- **E**ngagement\n- **R**elationships\n- **M**eaning\n- **A**ccomplishment', NULL, NULL, 10),
  (v_course_id, 2, 'quiz', 'Quiz : PERMA', 'M dans PERMA ?', '{"options": ["Motivation", "Meaning (Sens)", "Money", "Mindfulness"], "correctIndex": 1}', NULL, 15),
  (v_course_id, 3, 'flashcard', 'Mémorisation : PERMA', 'Les 5 piliers PERMA ?', NULL, '**P**ositive emotions, **E**ngagement, **R**elationships, **M**eaning, **A**ccomplishment.', 20),
  (v_course_id, 4, 'info', 'La gratitude', E'# Pouvoir de dire merci\n\n- 📝 Notez 3 choses positives/soir\n- 💬 Exprimez votre reconnaissance\n- 🔍 Cherchez le positif\n\n> +25% de bonheur !', NULL, NULL, 10),
  (v_course_id, 5, 'quiz', 'Quiz : Gratitude', 'Comment pratiquer la gratitude ?', '{"options": ["Se plaindre", "Noter 3 choses positives/soir", "Ignorer le positif", "Se comparer"], "correctIndex": 1}', NULL, 15),
  (v_course_id, 6, 'flashcard', 'Mémorisation : Gratitude', 'Exercice de gratitude quotidien ?', NULL, 'Chaque soir, noter **3 choses positives**. Augmente le bonheur de 25%.', 20),
  (v_course_id, 7, 'info', 'Conclusion', E'# Récapitulatif\n\n✅ Le bonheur se cultive\n✅ PERMA : 5 piliers\n✅ Pratiquez la gratitude\n\n🎯 Notez 3 gratitudes ce soir !', NULL, NULL, 10);

  -- Course 9: Booster sa Mémoire
  INSERT INTO courses (id, user_id, title, description, icon, category, level, estimated_minutes, duration_days, daily_cards_count, total_xp, is_published)
  VALUES (gen_random_uuid(), poc_user_id, 'Booster sa Mémoire', 'Techniques mnémotechniques efficaces.', '🧠', 'Mental', 'beginner', 8, 1, 10, 150, true)
  RETURNING id INTO v_course_id;
  
  INSERT INTO course_cards (course_id, order_index, type, title, content, options, flashcard_back, xp_reward) VALUES
  (v_course_id, 0, 'info', 'Comment fonctionne la mémoire', E'# 3 étapes\n\n1. **Encodage** : réception\n2. **Stockage** : conservation\n3. **Récupération** : rappel\n\n> Renforcez chaque étape !', NULL, NULL, 10),
  (v_course_id, 1, 'info', 'Répétition espacée', E'# Apprenez moins, retenez plus\n\n- Jour 1 : Apprentissage\n- Jour 2 : Révision 1\n- Jour 4 : Révision 2\n- Jour 7 : Révision 3\n\n> Rétention x4 !', NULL, NULL, 10),
  (v_course_id, 2, 'quiz', 'Quiz : Répétition', 'Principe de la répétition espacée ?', '{"options": ["Tout en une fois", "Intervalles croissants", "Jamais réviser", "Relire 10 fois"], "correctIndex": 1}', NULL, 15),
  (v_course_id, 3, 'flashcard', 'Mémorisation : Répétition', 'Expliquez la répétition espacée.', NULL, '**Réviser à intervalles croissants** (J1, J2, J4, J7...) pour ancrer en mémoire longue.', 20),
  (v_course_id, 4, 'info', 'Palais de la mémoire', E'# Technique des loci\n\n1. 🏠 Imaginez un lieu familier\n2. 📍 Placez les infos dans chaque pièce\n3. 🚶 "Marchez" mentalement', NULL, NULL, 10),
  (v_course_id, 5, 'quiz', 'Quiz : Palais', 'Qu''est-ce que le palais de la mémoire ?', '{"options": ["Bâtiment réel", "Visualisation spatiale", "Jeu vidéo", "Application mobile"], "correctIndex": 1}', NULL, 15),
  (v_course_id, 6, 'flashcard', 'Mémorisation : Palais', 'Décrivez le palais de la mémoire.', NULL, '**Visualiser un lieu familier** et y placer les informations. "Marcher" dans ce lieu pour les retrouver.', 20),
  (v_course_id, 7, 'info', 'Conclusion', E'# Récapitulatif\n\n✅ Répétition espacée\n✅ Palais de la mémoire\n✅ Associations visuelles\n\n🎯 Utilisez le palais pour 5 éléments !', NULL, NULL, 10);

  -- ==================== FITNESS ====================

  -- Course 10: Musculation Débutant
  INSERT INTO courses (id, user_id, title, description, icon, category, level, estimated_minutes, duration_days, daily_cards_count, total_xp, is_published)
  VALUES (gen_random_uuid(), poc_user_id, 'Débuter la Musculation', 'Les bases de la musculation en sécurité.', '🏋️', 'Fitness', 'beginner', 9, 1, 10, 160, true)
  RETURNING id INTO v_course_id;
  
  INSERT INTO course_cards (course_id, order_index, type, title, content, options, flashcard_back, xp_reward) VALUES
  (v_course_id, 0, 'info', 'Pourquoi la musculation ?', E'# Bienfaits\n\n- 💪 Masse musculaire\n- 🔥 Métabolisme boosté\n- 🦴 Os solides\n- 🧠 Confiance\n\n> 2 séances/semaine font la différence !', NULL, NULL, 10),
  (v_course_id, 1, 'info', 'Mouvements de base', E'# Exercices fondamentaux\n\n**Haut** : pompes, développé couché, rowing\n**Bas** : squats, fentes, soulevé de terre\n\n> Maîtrisez les bases !', NULL, NULL, 10),
  (v_course_id, 2, 'quiz', 'Quiz : Exercices', 'Exercice pour le bas du corps ?', '{"options": ["Pompes", "Développé couché", "Squats", "Rowing"], "correctIndex": 2}', NULL, 15),
  (v_course_id, 3, 'flashcard', 'Mémorisation : Fondamentaux', '3 exercices fondamentaux ?', NULL, '**Squat** (bas), **développé couché** (poitrine), **soulevé de terre** (chaîne postérieure).', 20),
  (v_course_id, 4, 'info', 'Technique avant charge', E'# Priorité : la forme !\n\n✅ Mouvement à vide\n✅ Progression lente\n❌ Ego lifting\n❌ Mouvements brusques\n\n> Mauvaise technique = blessures', NULL, NULL, 10),
  (v_course_id, 5, 'quiz', 'Quiz : Technique', 'Priorité en musculation ?', '{"options": ["Soulever lourd", "Technique correcte", "Beaucoup de reps", "Tous les jours"], "correctIndex": 1}', NULL, 15),
  (v_course_id, 6, 'flashcard', 'Mémorisation : Progression', 'Règle d''or de la progression ?', NULL, '**Technique avant charge**. Maîtrisez le mouvement avant d''augmenter le poids.', 20),
  (v_course_id, 7, 'info', 'Conclusion', E'# Récapitulatif\n\n✅ Commencez par les bases\n✅ Technique parfaite\n✅ Progression lente\n\n🎯 10 squats parfaits !', NULL, NULL, 10);

  -- Course 11: Cardio
  INSERT INTO courses (id, user_id, title, description, icon, category, level, estimated_minutes, duration_days, daily_cards_count, total_xp, is_published)
  VALUES (gen_random_uuid(), poc_user_id, 'Les Bienfaits du Cardio', 'Intégrer le cardio dans votre routine.', '🏃', 'Fitness', 'beginner', 7, 1, 8, 130, true)
  RETURNING id INTO v_course_id;
  
  INSERT INTO course_cards (course_id, order_index, type, title, content, options, flashcard_back, xp_reward) VALUES
  (v_course_id, 0, 'info', 'C''est quoi le cardio ?', E'# Entraînement cardiovasculaire\n\nExercices qui augmentent le rythme cardiaque.\n\n**Exemples** : course, vélo, natation, marche rapide\n\n> Renforcer le cœur, brûler des calories.', NULL, NULL, 10),
  (v_course_id, 1, 'info', 'Les bienfaits', E'# Pourquoi faire du cardio ?\n\n- ❤️ Cœur plus fort\n- 🔥 Brûle les graisses\n- 🧠 Améliore l''humeur\n- 💤 Meilleur sommeil\n\n> 150 min/semaine = optimal', NULL, NULL, 10),
  (v_course_id, 2, 'quiz', 'Quiz : Durée', 'Cardio recommandé/semaine ?', '{"options": ["30 min", "150 min", "300 min", "60 min"], "correctIndex": 1}', NULL, 15),
  (v_course_id, 3, 'flashcard', 'Mémorisation : Recommandation', 'Durée de cardio/semaine ?', NULL, '**150 minutes de cardio modéré**/semaine, ou 75 min de cardio intense.', 20),
  (v_course_id, 4, 'info', 'HIIT vs LISS', E'# Deux approches\n\n**HIIT** : court (15-25 min), intervalles intenses\n**LISS** : long (30-60 min), intensité modérée', NULL, NULL, 10),
  (v_course_id, 5, 'quiz', 'Quiz : HIIT', 'Que signifie HIIT ?', '{"options": ["Heavy Interval", "High Intensity Interval Training", "Home Indoor", "Heart Improvement"], "correctIndex": 1}', NULL, 15),
  (v_course_id, 6, 'flashcard', 'Mémorisation : HIIT', 'Décrivez le HIIT.', NULL, '**High Intensity Interval Training**. Phases intenses + repos. Sessions courtes (15-25 min) mais efficaces.', 20),
  (v_course_id, 7, 'info', 'Conclusion', E'# Récapitulatif\n\n✅ 150 min/semaine\n✅ HIIT ou LISS\n✅ Progressez graduellement\n\n🎯 20 min de marche rapide !', NULL, NULL, 10);

  -- Course 12: Étirements
  INSERT INTO courses (id, user_id, title, description, icon, category, level, estimated_minutes, duration_days, daily_cards_count, total_xp, is_published)
  VALUES (gen_random_uuid(), poc_user_id, 'Étirements et Mobilité', 'Améliorer souplesse et prévenir blessures.', '🧘‍♂️', 'Fitness', 'beginner', 7, 1, 8, 130, true)
  RETURNING id INTO v_course_id;
  
  INSERT INTO course_cards (course_id, order_index, type, title, content, options, flashcard_back, xp_reward) VALUES
  (v_course_id, 0, 'info', 'Pourquoi s''étirer ?', E'# Bienfaits\n\n- 🦵 Souplesse\n- 🛡️ Prévention blessures\n- 😌 Réduction tensions\n- 🧘 Relaxation\n\n> 10 min/jour changent tout !', NULL, NULL, 10),
  (v_course_id, 1, 'info', 'Statique vs Dynamique', E'# Deux types\n\n**Dynamiques** (avant) : mouvements contrôlés\n**Statiques** (après) : position tenue 20-30 sec', NULL, NULL, 10),
  (v_course_id, 2, 'quiz', 'Quiz : Types', 'Quand faire les statiques ?', '{"options": ["Avant l''effort", "Pendant", "Après l''effort", "Jamais"], "correctIndex": 2}', NULL, 15),
  (v_course_id, 3, 'flashcard', 'Mémorisation : Étirements', 'Quand les étirements statiques ?', NULL, '**Après l''effort**. Avant, privilégiez les dynamiques.', 20),
  (v_course_id, 4, 'info', 'Zones clés', E'# Muscles à étirer\n\n**Souvent tendus** :\n- Ischio-jambiers\n- Hanches (psoas)\n- Bas du dos\n- Épaules et cou', NULL, NULL, 10),
  (v_course_id, 5, 'quiz', 'Quiz : Zones', 'Muscle tendu quand on est assis ?', '{"options": ["Biceps", "Psoas (hanches)", "Mollets", "Triceps"], "correctIndex": 1}', NULL, 15),
  (v_course_id, 6, 'flashcard', 'Mémorisation : Durée', 'Durée d''un étirement statique ?', NULL, '**20 à 30 secondes**. Ne jamais forcer jusqu''à la douleur.', 20),
  (v_course_id, 7, 'info', 'Conclusion', E'# Récapitulatif\n\n✅ Dynamique avant, statique après\n✅ 20-30 sec/position\n✅ Pas de douleur !\n\n🎯 5 min ce soir !', NULL, NULL, 10);

  -- ==================== PRODUCTIVITÉ ====================

  -- Course 13: Méthode Pomodoro
  INSERT INTO courses (id, user_id, title, description, icon, category, level, estimated_minutes, duration_days, daily_cards_count, total_xp, is_published)
  VALUES (gen_random_uuid(), poc_user_id, 'La Méthode Pomodoro', 'Technique de gestion du temps efficace.', '🍅', 'Productivité', 'beginner', 7, 1, 8, 130, true)
  RETURNING id INTO v_course_id;
  
  INSERT INTO course_cards (course_id, order_index, type, title, content, options, flashcard_back, xp_reward) VALUES
  (v_course_id, 0, 'info', 'L''origine', E'# La tomate magique 🍅\n\nInventée par **Francesco Cirillo** (années 80).\n\nNom du minuteur de cuisine en forme de tomate.\n\n**Principe** : blocs de 25 min + pauses.', NULL, NULL, 10),
  (v_course_id, 1, 'info', 'Comment ça marche', E'# Les 5 étapes\n\n1. 📝 Choisissez une tâche\n2. ⏱️ Minuteur sur 25 min\n3. 🎯 Travaillez sans interruption\n4. ☕ Pause 5 min\n5. 🔄 Répétez (pause longue après 4)', NULL, NULL, 10),
  (v_course_id, 2, 'quiz', 'Quiz : Durée', 'Durée d''un Pomodoro ?', '{"options": ["15 min", "25 min", "45 min", "60 min"], "correctIndex": 1}', NULL, 15),
  (v_course_id, 3, 'flashcard', 'Mémorisation : Pomodoro', 'Décrivez le cycle Pomodoro.', NULL, '**25 min de travail** + **5 min de pause**. Pause longue (15-30 min) après 4 Pomodoros.', 20),
  (v_course_id, 4, 'info', 'Pourquoi ça fonctionne', E'# La science\n\n- ⏰ Urgence artificielle\n- 🧠 Focus total\n- 💆 Pauses = récupération\n- ✅ Petites victoires', NULL, NULL, 10),
  (v_course_id, 5, 'quiz', 'Quiz : Pause longue', 'Quand la pause longue ?', '{"options": ["Après 2", "Après 4", "Après 6", "Jamais"], "correctIndex": 1}', NULL, 15),
  (v_course_id, 6, 'flashcard', 'Mémorisation : Pauses', 'Après combien de Pomodoros la pause longue ?', NULL, 'Après **4 Pomodoros** (~2h), pause longue de **15 à 30 minutes**.', 20),
  (v_course_id, 7, 'info', 'Conclusion', E'# Récapitulatif\n\n✅ 25 min + 5 min\n✅ Pause longue après 4\n✅ Pas d''interruptions !\n\n🎯 2 Pomodoros aujourd''hui !', NULL, NULL, 10);

  -- Course 14: Organisation tâches
  INSERT INTO courses (id, user_id, title, description, icon, category, level, estimated_minutes, duration_days, daily_cards_count, total_xp, is_published)
  VALUES (gen_random_uuid(), poc_user_id, 'Organiser ses Tâches Efficacement', 'Systèmes pour ne rien oublier.', '📋', 'Productivité', 'beginner', 8, 1, 10, 150, true)
  RETURNING id INTO v_course_id;
  
  INSERT INTO course_cards (course_id, order_index, type, title, content, options, flashcard_back, xp_reward) VALUES
  (v_course_id, 0, 'info', 'Le cerveau n''est pas une liste', E'# Libérez votre esprit\n\nLe cerveau est mauvais pour stocker les tâches.\n\n**Résultat** : stress, oublis, charge mentale\n\n> **Tout noter** dans un système !', NULL, NULL, 10),
  (v_course_id, 1, 'info', 'Matrice Eisenhower', E'# Urgent vs Important\n\n| | Urgent | Non urgent |\n|---|---|---|\n| **Important** | Faire | Planifier |\n| **Non important** | Déléguer | Éliminer |\n\n> Focus sur Important/Non urgent !', NULL, NULL, 10),
  (v_course_id, 2, 'quiz', 'Quiz : Matrice', 'Tâche importante mais non urgente ?', '{"options": ["Ignorer", "Déléguer", "Planifier", "Faire maintenant"], "correctIndex": 2}', NULL, 15),
  (v_course_id, 3, 'flashcard', 'Mémorisation : Eisenhower', 'Décrivez la matrice Eisenhower.', NULL, 'Classe les tâches selon **urgent/non urgent** et **important/non important**. Focus sur l''important.', 20),
  (v_course_id, 4, 'info', 'Règle des 2 minutes', E'# Faites-le maintenant !\n\n**Règle de David Allen** :\n\n> Si < **2 minutes**, faites-le immédiatement.\n\n✅ Pas de report, liste plus courte, accomplissement', NULL, NULL, 10),
  (v_course_id, 5, 'quiz', 'Quiz : 2 minutes', 'Tâche de moins de 2 min ?', '{"options": ["Noter pour plus tard", "Faire immédiatement", "Déléguer", "Oublier"], "correctIndex": 1}', NULL, 15),
  (v_course_id, 6, 'flashcard', 'Mémorisation : 2 min', 'Expliquez la règle des 2 minutes.', NULL, 'Si une tâche prend **moins de 2 minutes**, la **faire immédiatement**.', 20),
  (v_course_id, 7, 'info', 'Conclusion', E'# Récapitulatif\n\n✅ Notez tout\n✅ Matrice Eisenhower\n✅ Règle des 2 min\n\n🎯 Videz votre tête dans une liste !', NULL, NULL, 10);

  -- Course 15: Procrastination
  INSERT INTO courses (id, user_id, title, description, icon, category, level, estimated_minutes, duration_days, daily_cards_count, total_xp, is_published)
  VALUES (gen_random_uuid(), poc_user_id, 'Éviter la Procrastination', 'Dépasser la tendance à remettre à plus tard.', '⏰', 'Productivité', 'intermediate', 9, 1, 10, 160, true)
  RETURNING id INTO v_course_id;
  
  INSERT INTO course_cards (course_id, order_index, type, title, content, options, flashcard_back, xp_reward) VALUES
  (v_course_id, 0, 'info', 'Qu''est-ce que la procrastination ?', E'# Remettre à demain\n\n**Ce n''est pas** : paresse, problème de temps\n**C''est** : gestion des émotions, évitement de l''inconfort', NULL, NULL, 10),
  (v_course_id, 1, 'info', 'Pourquoi on procrastine', E'# Les vraies raisons\n\n- 😰 Peur de l''échec\n- 😤 Tâche déplaisante\n- 🤯 Perfectionnisme\n- 😵 Submersion\n\n> On évite une **émotion négative**.', NULL, NULL, 10),
  (v_course_id, 2, 'quiz', 'Quiz : Cause', 'Vraie cause de la procrastination ?', '{"options": ["Paresse", "Manque de temps", "Gestion des émotions", "Incompétence"], "correctIndex": 2}', NULL, 15),
  (v_course_id, 3, 'flashcard', 'Mémorisation : Cause', 'Vraie cause de la procrastination ?', NULL, 'Problème de **gestion des émotions**. On reporte pour éviter l''inconfort émotionnel.', 20),
  (v_course_id, 4, 'info', 'Règle des 5 secondes', E'# 5, 4, 3, 2, 1... GO !\n\n**Mel Robbins** :\n\n1. Identifiez ce à faire\n2. Comptez : 5-4-3-2-1\n3. **Agissez** immédiatement\n\n> Le cerveau bloque après 5 sec d''hésitation.', NULL, NULL, 10),
  (v_course_id, 5, 'quiz', 'Quiz : 5 secondes', 'Après 5-4-3-2-1 ?', '{"options": ["Réfléchir", "Agir immédiatement", "Recommencer", "Pause"], "correctIndex": 1}', NULL, 15),
  (v_course_id, 6, 'info', 'Commencer petit', E'# Engagement minimal\n\n- Pas envie de courir ? Mettez vos baskets\n- Pas envie d''écrire ? Une phrase\n- Flemme de ranger ? Un objet\n\n> Le plus dur est de **commencer**.', NULL, NULL, 10),
  (v_course_id, 7, 'flashcard', 'Mémorisation : Commencer', 'Comment vaincre la procrastination ?', NULL, '**Engagement minimal** : la plus petite action possible. L''élan fera le reste.', 20),
  (v_course_id, 8, 'info', 'Conclusion', E'# Récapitulatif\n\n✅ Comprenez vos émotions\n✅ Règle des 5 secondes\n✅ Commencez petit\n\n🎯 Appliquez 5-4-3-2-1 maintenant !', NULL, NULL, 10);

  -- ==================== FINANCES ====================

  -- Course 16: Épargne
  INSERT INTO courses (id, user_id, title, description, icon, category, level, estimated_minutes, duration_days, daily_cards_count, total_xp, is_published)
  VALUES (gen_random_uuid(), poc_user_id, 'Épargner Intelligemment', 'Stratégies pour mettre de l''argent de côté.', '🐷', 'Finances', 'beginner', 8, 1, 10, 150, true)
  RETURNING id INTO v_course_id;
  
  INSERT INTO course_cards (course_id, order_index, type, title, content, options, flashcard_back, xp_reward) VALUES
  (v_course_id, 0, 'info', 'Pourquoi épargner ?', E'# Raisons d''économiser\n\n- 🛡️ Fonds d''urgence\n- 🎯 Projets\n- 🏠 Immobilier\n- 👴 Retraite\n\n> Épargne = **liberté financière**', NULL, NULL, 10),
  (v_course_id, 1, 'info', 'Payez-vous en premier', E'# La règle d''or\n\nÉpargnez **dès réception du salaire**.\n\n1. Salaire arrive\n2. Virement auto vers épargne\n3. Vivez avec le reste\n\n> Ne pas : dépenser puis épargner ce qui reste.', NULL, NULL, 10),
  (v_course_id, 2, 'quiz', 'Quiz : Timing', 'Quand épargner ?', '{"options": ["Fin de mois", "Quand il reste", "Dès réception du salaire", "1 fois/an"], "correctIndex": 2}', NULL, 15),
  (v_course_id, 3, 'flashcard', 'Mémorisation : Règle', 'Règle d''or de l''épargne ?', NULL, '**Payez-vous en premier** : virement automatique dès réception du salaire.', 20),
  (v_course_id, 4, 'info', 'Combien épargner ?', E'# Règle 50/30/20\n\n- **50%** : Besoins\n- **30%** : Envies\n- **20%** : Épargne\n\n> 20% est un objectif solide.', NULL, NULL, 10),
  (v_course_id, 5, 'quiz', 'Quiz : 50/30/20', 'Pourcentage d''épargne ?', '{"options": ["10%", "20%", "30%", "50%"], "correctIndex": 1}', NULL, 15),
  (v_course_id, 6, 'flashcard', 'Mémorisation : 50/30/20', 'Décrivez la règle 50/30/20.', NULL, '**50% besoins**, **30% envies**, **20% épargne**.', 20),
  (v_course_id, 7, 'info', 'Conclusion', E'# Récapitulatif\n\n✅ Automatisez\n✅ Objectif : 20%\n✅ Fonds d''urgence d''abord\n\n🎯 Mettez en place un virement auto !', NULL, NULL, 10);

  -- Course 17: Investissement
  INSERT INTO courses (id, user_id, title, description, icon, category, level, estimated_minutes, duration_days, daily_cards_count, total_xp, is_published)
  VALUES (gen_random_uuid(), poc_user_id, 'Les Bases de l''Investissement', 'Principes pour faire fructifier votre argent.', '📈', 'Finances', 'beginner', 9, 1, 10, 160, true)
  RETURNING id INTO v_course_id;
  
  INSERT INTO course_cards (course_id, order_index, type, title, content, options, flashcard_back, xp_reward) VALUES
  (v_course_id, 0, 'info', 'Pourquoi investir ?', E'# L''argent qui travaille\n\n**L''inflation** ronge l''épargne.\n2% d''inflation = perte de pouvoir d''achat.\n\n> Investir pour croître plus vite que l''inflation.', NULL, NULL, 10),
  (v_course_id, 1, 'info', 'Risque et rendement', E'# Règle fondamentale\n\n> Plus le **rendement** est élevé, plus le **risque** est grand.\n\n- 🏦 Livret A : ~3% - Risque 0\n- 📊 Actions : ~7% - Risque élevé', NULL, NULL, 10),
  (v_course_id, 2, 'quiz', 'Quiz : Risque', 'Rendement élevé signifie ?', '{"options": ["Aucun risque", "Risque faible", "Risque élevé", "Argent garanti"], "correctIndex": 2}', NULL, 15),
  (v_course_id, 3, 'flashcard', 'Mémorisation : Risque', 'Relation risque/rendement ?', NULL, 'Plus le **rendement potentiel** est élevé, plus le **risque** est grand.', 20),
  (v_course_id, 4, 'info', 'La diversification', E'# Ne pas mettre tous ses œufs...\n\n**Diversifier** = Répartir sur plusieurs supports\n\n- 🌍 Zones géographiques\n- 📊 Classes d''actifs\n- 🏢 Secteurs\n\n> Réduit le risque global.', NULL, NULL, 10),
  (v_course_id, 5, 'quiz', 'Quiz : Diversification', 'Pourquoi diversifier ?', '{"options": ["Compliquer", "Réduire le risque", "Plus de frais", "Moins de rendement"], "correctIndex": 1}', NULL, 15),
  (v_course_id, 6, 'flashcard', 'Mémorisation : Diversification', 'Qu''est-ce que la diversification ?', NULL, '**Répartir les investissements** sur différents supports pour **réduire le risque global**.', 20),
  (v_course_id, 7, 'info', 'L''intérêt composé', E'# 8ème merveille du monde\n\nEinstein : "La force la plus puissante"\n\n1000€ à 7%/an :\n- 10 ans : 1 967€\n- 30 ans : 7 612€\n\n> Le temps est votre allié !', NULL, NULL, 10),
  (v_course_id, 8, 'info', 'Conclusion', E'# Récapitulatif\n\n✅ Investir bat l''inflation\n✅ Risque = Rendement\n✅ Diversifiez !\n\n🎯 Renseignez-vous sur le PEA !', NULL, NULL, 10);

  -- Course 18: Budget
  INSERT INTO courses (id, user_id, title, description, icon, category, level, estimated_minutes, duration_days, daily_cards_count, total_xp, is_published)
  VALUES (gen_random_uuid(), poc_user_id, 'Créer un Budget Personnel', 'Contrôlez vos finances avec un budget.', '💰', 'Finances', 'beginner', 8, 1, 10, 150, true)
  RETURNING id INTO v_course_id;
  
  INSERT INTO course_cards (course_id, order_index, type, title, content, options, flashcard_back, xp_reward) VALUES
  (v_course_id, 0, 'info', 'Pourquoi un budget ?', E'# Savoir où va l''argent\n\n**Sans budget** : stress, oublis, pas d''épargne\n**Avec budget** : contrôle, objectifs, sérénité', NULL, NULL, 10),
  (v_course_id, 1, 'info', 'Étape 1 : Revenus', E'# Listez vos entrées\n\n- 💼 Salaire net\n- 💰 Primes\n- 🏠 Revenus locatifs\n- 📈 Autres\n\n> Montant **net mensuel moyen**.', NULL, NULL, 10),
  (v_course_id, 2, 'quiz', 'Quiz : Revenus', 'Que compter dans les revenus ?', '{"options": ["Uniquement salaire", "Tous les revenus nets", "Salaire brut", "Les dépenses"], "correctIndex": 1}', NULL, 15),
  (v_course_id, 3, 'info', 'Étape 2 : Dépenses fixes', E'# Charges incompressibles\n\n- 🏠 Loyer/crédit\n- 💡 Énergie\n- 📱 Téléphone/Internet\n- 🚗 Transport\n- 🛡️ Assurances', NULL, NULL, 10),
  (v_course_id, 4, 'flashcard', 'Mémorisation : Dépenses', 'Qu''est-ce qu''une dépense fixe ?', NULL, 'Charge **récurrente et obligatoire** : loyer, énergie, assurances. Chaque mois.', 20),
  (v_course_id, 5, 'info', 'Étape 3 : Reste à vivre', E'# Ce qui reste pour vous\n\nRevenus - Fixes - Épargne = **Reste à vivre**\n\n🍕 Loisirs, 👗 Shopping, 🎬 Sorties\n\n> Liberté de dépenser sans culpabilité.', NULL, NULL, 10),
  (v_course_id, 6, 'quiz', 'Quiz : Reste à vivre', 'Comment le calculer ?', '{"options": ["Revenus - Loisirs", "Revenus - Fixes - Épargne", "Revenus + Épargne", "Dépenses - Revenus"], "correctIndex": 1}', NULL, 15),
  (v_course_id, 7, 'flashcard', 'Mémorisation : Budget', 'Formule du reste à vivre ?', NULL, '**Revenus - Dépenses fixes - Épargne**. L''argent pour les loisirs.', 20),
  (v_course_id, 8, 'info', 'Conclusion', E'# Récapitulatif\n\n✅ Listez revenus et dépenses\n✅ Priorisez l''épargne\n✅ Profitez du reste à vivre\n\n🎯 Faites votre budget ce weekend !', NULL, NULL, 10);

END $$;