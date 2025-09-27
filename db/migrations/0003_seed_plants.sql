-- Migration: Seed plants table with initial botanical data
-- File: 0003_seed_plants.sql

INSERT INTO plants (
  scientific_name,
  english_name,
  spanish_name,
  hebrew_name,
  recommended_light,
  recommended_soil,
  recommended_soil_airiness,
  recommended_soil_ph,
  recommended_soil_moisture,
  recommended_watering,
  recommended_water_amount,
  recommended_fertilizer,
  care_difficulty
) VALUES
('Epipremnum aureum', 'Pothos', 'Potus', NULL, 'Indirect Light', 'Well-draining, rich', 'Airy', NULL, 'Let dry between', 'Biweekly, reduced in cold seasons', 'Moderate', 'Monthly/spring-summer', 'easy'),
('Pachira aquatica', 'Money Tree', NULL, NULL, 'Bright Indirect', 'Well-draining', NULL, NULL, 'Let dry between', 'Regular, do not overwater', 'Moderate', 'Regular, not excessive', 'easy'),
('Ficus amstel', 'Ficus Amstel King', 'Ficus', NULL, 'Indirect Light', 'Well-draining', NULL, NULL, 'Let dry 2-3 cm', 'Moderate, less in winter', 'Moderate', 'Biweekly growth, rare in winter', 'easy'),
('Calluna vulgaris', 'Heather', 'Brezo', NULL, 'Bright, partial shade', 'Well-drained acidic (slightly acidic)', 'Airy', 'Acid', 'Keep moist, not soggy', 'Water regularly, let dry roughly', 'Moderate', 'Spring/summer fertilizer', 'medium'),
('Erica capensis', 'Cape Heath', 'Brezo', NULL, 'Bright, partial shade', 'Well-drained acidic', 'Airy', 'Acid', 'Moist, well-drained', 'Water sparingly in winter', NULL, 'Acid-loving feed', 'medium'),
('Hedera helix', 'English Ivy', 'Hiedra', 'קיסוס', 'Partial to bright indirect', 'Chalk, clay, loam, sand', 'Airy', 'Acid/Alk/Neutral', 'Moist but well-drained', 'Average', 'Low to moderate', NULL, 'easy'),
('Spathiphyllum', 'Peace Lily', 'Lirio de la paz', 'שושן השלום', 'Indirect Light', 'Moist, well-drained', 'Airy', NULL, 'Moist, not soggy', 'Water when top dries', 'Moderate', 'Monthly, more in growing season', 'easy'),
('Sansevieria', 'Snake Plant', 'Lengua de suegra', 'צמח הנחש', 'Direct/Indirect', 'Well-drained, gritty', 'Airy', 'Neutral/Alk', 'Allow to dry', 'Water sparingly', 'Little', 'Rare, diluted feed', 'easy'),
('Calathea ornata', 'Calathea', 'Calatea', NULL, 'Indirect Light', 'Well-draining, rich', 'Airy', 'Acid', 'Moist, not soggy', 'Water regularly, filtered water', 'Moderate', 'Feed monthly spring/summer', 'hard'),
('Fittonia', 'Nerve Plant', 'Fittonia', NULL, 'Indirect Light', 'Well-drained', 'Airy', 'Acid', 'Moist, not soggy', 'Water regularly', 'Small', 'Half strength, monthly', 'medium'),
('Maranta leuconeura', 'Prayer Plant', 'Maranta', NULL, 'Indirect Light', 'Well-draining, humus', 'Airy', 'Acid', 'Moist, not soggy', 'Water regularly', 'Moderate', 'Monthly during growth', 'medium'),
('Jasminum', 'Star Jasmine', 'Jazmín', NULL, 'Direct/Indirect', 'Well-drained', 'Airy', NULL, 'Moist', 'Water when dry', 'Moderate', 'Feed monthly in growth', 'medium'),
('Citrus sinensis', 'Orange', 'Naranja', 'תפוז', 'Direct Sun', 'Well-drained, sandy', 'Airy', 'Acid', 'Moist', 'Frequent, avoid dryness', 'Moderate', 'Citrus food during active growth', 'hard'),
('Ribes rubrum', 'Grosello rojo Jonkheer', 'Grosella roja', NULL, 'Direct Sun', 'Well-draining', 'Airy', 'Acid', 'Moist', 'Regular', 'Moderate', 'Feed before and after fruiting', 'medium'),
('Acer palmatum', 'Japanese Maple', 'Arce japonés palmeado', 'קיסוס', 'Partial to full sun', 'Moist, acidic, rich', 'Airy', 'Acid', 'Moist', 'Water as needed', 'Moderate', 'Slow-release feed', 'hard'),
('Juniperus', 'Blue Juniper', 'Enebro azul', 'ערער', 'Direct Sun', 'Well-drained', 'Airy', 'Acid/Neutral', 'Dry to moist', 'Drought tolerant', 'Low', 'Fertilize only if growth weak', 'easy'),
('Photinia x fraseri', 'Red Tip Photinia', 'Fotinia roja', NULL, 'Full Sun', 'Well-drained', 'Airy', 'Neutral', 'Moist', 'Regular watering', 'Moderate', 'Spring fertilization', 'easy'),
('Origanum vulgare', 'Oregano', 'Orégano', 'אורגנו', 'Full Sun', 'Well-drained', 'Airy', 'Neutral', 'Dry', 'Drought tolerant', 'Low', 'Light monthly feed', 'easy'),
('Allium schoenoprasum', 'Chives', 'Ciboulette', 'עירית', 'Full Sun', 'Well-drained', 'Airy', 'Neutral', 'Moist', 'Regular', 'Moderate', 'Moderate monthly', 'easy'),
('Ocimum basilicum', 'Basil', 'Albahaca', 'בזיליקום', 'Full Sun', 'Well-drained, rich', 'Airy', 'Neutral', 'Moist', 'Water often', 'Moderate', 'Feed every two weeks', 'easy'),
('Bougainvillea', 'Bougainvillea', 'Bugambilia', 'בונגוביליה', 'Full Sun', 'Well-drained sandy', 'Airy', NULL, 'Dry between', 'Infrequent', 'Moderate', 'Low fertilizer, spring', 'medium'),
('Capsicum annuum', 'Red Pepper', 'Pimiento rojo', 'פלפל אדום', 'Full Sun', 'Well-drained, sandy', 'Airy', 'Neutral', 'Moist', 'Water when dry', 'Moderate', 'Tomato feed during fruiting', 'medium');

-- Note: One duplicate Prayer Plant entry was excluded from the original CSV data