
INSERT INTO "Users" ("username", "hashedPassword")
VALUES
  ('johndoe', 'hashed_password_1'),
  ('janesmit', 'hashed_password_2'),
  ('bobwilson', 'hashed_password_3'),
  ('alicejohn', 'hashed_password_4'),
  ('mikebrown', 'hashed_password_5');


INSERT INTO "GrassSpecies" (
  "name", "description", "idealTempMin", "idealTempMax", "idealRainfallMin", "idealRainfallMax",
  "idealHardinessZone", "idealKoppenZone", "idealSpringTempMin", "idealSpringTempMax",
  "idealSummerTempMin", "idealSummerTempMax", "idealFallTempMin", "idealFallTempMax",
  "idealWinterTempMin", "idealWinterTempMax", "idealSpringRainfallMin", "idealSpringRainfallMax",
  "idealSummerRainfallMin", "idealSummerRainfallMax", "idealFallRainfallMin", "idealFallRainfallMax",
  "idealWinterRainfallMin", "idealWinterRainfallMax", "minGrowingDays", "idealEcoregion"
)
VALUES
  ('Kentucky Bluegrass', 'Kentucky Bluegrass is a popular cool-season grass known for its lush, dark green color and soft texture. It forms a dense, durable turf that self-repairs through underground rhizomes. Ideal for lawns in cooler climates, it requires moderate maintenance and has good cold tolerance but may struggle in extreme heat or drought.',
   60, 75, 25, 40, '3-9', 'Dfa, Dfb',
   50, 65, 65, 80, 50, 65, 20, 40,
   2, 4, 2, 4, 2, 4, 1, 3,
   150, 'Temperate Broadleaf and Mixed Forests'),

  ('Tall Fescue', 'Tall Fescue is a versatile cool-season grass with excellent heat and drought tolerance. It forms a coarse-textured, deep-rooted turf that stays green year-round in many areas. This low-maintenance grass adapts well to various soil types and light conditions, making it popular for both sunny and partially shaded lawns.',
   60, 75, 20, 40, '4-9', 'Cfa, Cfb',
   55, 70, 70, 85, 55, 70, 25, 45,
   1.5, 3.5, 1.5, 3.5, 1.5, 3.5, 1, 3,
   120, 'Temperate Broadleaf and Mixed Forests, Temperate Grasslands'),

  ('Perennial Ryegrass', 'Perennial Ryegrass is a fast-growing, cool-season grass known for its quick germination and establishment. It produces a fine-textured, bright green turf with excellent wear tolerance, making it ideal for high-traffic areas. While it prefers cool, moist climates, it can adapt to various conditions and is often used in grass seed mixes.',
   60, 75, 25, 50, '3-8', 'Cfb, Dfb',
   50, 65, 65, 80, 50, 65, 20, 40,
   2, 4, 2, 4, 2, 4, 1.5, 3.5,
   140, 'Temperate Broadleaf and Mixed Forests'),

  ('Bermuda Grass', 'Bermuda Grass is a warm-season grass prized for its excellent heat and drought tolerance. It forms a dense, fine-textured turf that recovers quickly from damage due to its aggressive growth habit. Ideal for sunny, hot climates, it goes dormant in winter but greens up quickly in spring, making it popular for lawns and sports fields in southern regions.',
   75, 95, 20, 50, '7-10', 'Cfa, BSh',
   65, 85, 80, 100, 65, 85, 35, 55,
   1, 3, 1, 3, 1, 3, 0.5, 2.5,
   100, 'Tropical and Subtropical Grasslands, Temperate Grasslands'),

  ('Zoysia Grass', 'Zoysia Grass is a warm-season grass known for its dense, carpet-like texture and good drought tolerance. It forms a thick, weed-resistant turf that requires less mowing than many other grasses. While slow to establish, once mature, it''s low-maintenance and can withstand moderate foot traffic, making it popular for lawns in transitional climate zones.',
   70, 90, 20, 40, '6-11', 'Cfa, Cwa',
   60, 80, 75, 95, 60, 80, 30, 50,
   1.5, 3.5, 1.5, 3.5, 1.5, 3.5, 1, 3,
   110, 'Tropical and Subtropical Grasslands, Temperate Broadleaf and Mixed Forests'),

  ('St. Augustine Grass', 'St. Augustine Grass is a warm-season grass with broad, coarse-textured blades, forming a dense, carpet-like turf. It has excellent shade tolerance and thrives in hot, coastal areas. While not as drought-tolerant as some warm-season grasses, it recovers quickly from stress and is popular for lawns in tropical and subtropical regions.',
   75, 90, 30, 60, '8-10', 'Cfa, Aw',
   70, 85, 80, 95, 70, 85, 40, 60,
   2, 4, 2, 4, 2, 4, 1.5, 3.5,
   120, 'Tropical and Subtropical Moist Broadleaf Forests'),

  ('Centipede Grass', 'Centipede Grass is a warm-season grass known for its excellent low-maintenance characteristics. It forms a medium-textured, light green turf that grows slowly, requiring less mowing and fertilization. Ideal for lawns in the southeastern U.S., it prefers acidic soils and has moderate shade tolerance but poor wear resistance.',
   70, 85, 30, 50, '7-10', 'Cfa',
   65, 80, 75, 90, 65, 80, 35, 55,
   2, 4, 2, 4, 2, 4, 1.5, 3.5,
   130, 'Temperate Broadleaf and Mixed Forests, Tropical and Subtropical Moist Broadleaf Forests'),

  ('Fine Fescue', 'Fine Fescue is a group of cool-season grasses known for their fine texture and excellent shade tolerance. They form a dense turf with narrow, needle-like blades and require little maintenance. Ideal for low-traffic areas and often used in shade mixes, Fine Fescues are drought-tolerant but may go dormant in extreme heat.',
   55, 75, 15, 35, '3-7', 'Dfb, Cfb',
   45, 65, 60, 80, 45, 65, 15, 35,
   1, 3, 1, 3, 1, 3, 0.5, 2.5,
   160, 'Temperate Broadleaf and Mixed Forests, Temperate Conifer Forests'),

  ('Buffalo Grass', 'Buffalo Grass is a warm-season native grass known for its exceptional drought tolerance and low maintenance requirements. It forms a fine-textured, grayish-green turf that grows slowly and requires minimal mowing. Ideal for areas with low rainfall, it''s eco-friendly but has poor shade tolerance and wear resistance.',
   70, 95, 10, 30, '3-10', 'BSk, Dfa',
   60, 85, 75, 100, 60, 85, 25, 45,
   0.5, 2.5, 0.5, 2.5, 0.5, 2.5, 0.25, 2,
   90, 'Temperate Grasslands, Deserts and Xeric Shrublands'),

  ('Bahia Grass', 'Bahia Grass is a warm-season grass known for its excellent heat and drought tolerance. It forms a coarse-textured, open turf with deep roots, making it ideal for erosion control. While not as aesthetically pleasing as some lawn grasses, it''s low-maintenance, tolerates poor soils, and is often used for pastures and low-traffic areas in the southern U.S.',
   70, 95, 25, 60, '7-11', 'Cfa, Aw',
   65, 85, 80, 100, 65, 85, 35, 55,
   1.5, 3.5, 1.5, 3.5, 1.5, 3.5, 1, 3,
   105, 'Tropical and Subtropical Grasslands, Temperate Grasslands');

-- Assume Kentucky Bluegrass has grassSpeciesId = 1

-- New Lawn Plan (Seed)
INSERT INTO "PlanStepTemplates" (
  "grassSpeciesId",
  "planType",
  "establishmentType",
  "stepOrder",
  "stepDescription",
  "estimatedDuration",
  "intervalToNextStep"
)
VALUES
  (1, 'new_lawn', 'seed', 1, 'Test soil pH and nutrient levels', '7 days', NULL),
  (1, 'new_lawn', 'seed', 2, 'Adjust soil pH to 6.2-6.8 if necessary', '14 days', NULL),
  (1, 'new_lawn', 'seed', 3, 'Remove debris and old grass', '3 days', NULL),
  (1, 'new_lawn', 'seed', 4, 'Till the soil to a depth of 4-6 inches', '2 days', NULL),
  (1, 'new_lawn', 'seed', 5, 'Level the area and create a slight slope for drainage', '2 days', NULL),
  (1, 'new_lawn', 'seed', 6, 'Apply starter fertilizer high in phosphorus', '1 day', '28 days'),
  (1, 'new_lawn', 'seed', 7, 'Sow Kentucky Bluegrass seeds at 2-3 lbs per 1000 sq ft', '1 day', NULL),
  (1, 'new_lawn', 'seed', 8, 'Lightly rake seeds into soil', '1 day', NULL),
  (1, 'new_lawn', 'seed', 9, 'Roll the area to ensure good seed-to-soil contact', '1 day', NULL),
  (1, 'new_lawn', 'seed', 10, 'Water lightly and frequently to keep soil moist', '21 days', NULL),
  (1, 'new_lawn', 'seed', 11, 'Reduce watering frequency but increase depth as grass establishes', '21 days', NULL),
  (1, 'new_lawn', 'seed', 12, 'Mow when grass reaches 2-3 inches height', '30 days', NULL),
  (1, 'new_lawn', 'seed', 13, 'Apply nitrogen-rich fertilizer 6-8 weeks after germination', '1 day', '28 days'),
  (1, 'new_lawn', 'seed', 14, 'Apply pre-emergent herbicide if needed', '1 day', '28 days'),
  (1, 'new_lawn', 'seed', 15, 'Apply post-emergent herbicide if needed', '1 day', '28 days');

-- New Lawn Plan (Sod)
INSERT INTO "PlanStepTemplates" (
  "grassSpeciesId",
  "planType",
  "establishmentType",
  "stepOrder",
  "stepDescription",
  "estimatedDuration",
  "intervalToNextStep"
)
VALUES
  (1, 'new_lawn', 'new_lawn', 'sod', 1, 'Test soil pH and nutrient levels', '7 days', NULL),
  (1, 'new_lawn', 'new_lawn', 'sod', 2, 'Adjust soil pH to 6.2-6.8 if necessary', '14 days', NULL),
  (1, 'new_lawn', 'new_lawn', 'sod', 3, 'Remove debris and old grass', '3 days', NULL),
  (1, 'new_lawn', 'new_lawn', 'sod', 4, 'Till the soil to a depth of 4-6 inches', '2 days', NULL),
  (1, 'new_lawn', 'new_lawn', 'sod', 5, 'Level the area and create a slight slope for drainage', '2 days', NULL),
  (1, 'new_lawn', 'new_lawn', 'sod', 6, 'Apply starter fertilizer', '1 day', '28 days'),
  (1, 'new_lawn', 'new_lawn', 'sod', 7, 'Lay Kentucky Bluegrass sod', '1 day', NULL),
  (1, 'new_lawn', 'new_lawn', 'sod', 8, 'Roll sod for good soil contact', '1 day', NULL),
  (1, 'new_lawn', 'new_lawn', 'sod', 9, 'Water deeply immediately after laying sod', '1 day', NULL),
  (1, 'new_lawn', 'new_lawn', 'sod', 10, 'Keep sod consistently moist for 2-3 weeks', '21 days', NULL),
  (1, 'new_lawn', 'new_lawn', 'sod', 11, 'Reduce watering frequency but increase depth', '14 days', NULL),
  (1, 'new_lawn', 'new_lawn', 'sod', 12, 'Mow when grass reaches 2-3 inches height', '14 days', NULL),
  (1, 'new_lawn', 'new_lawn', 'sod', 13, 'Apply nitrogen-rich fertilizer 3-4 weeks after installation', '1 day', '28 days'),
  (1, 'new_lawn', 'new_lawn', 'sod', 14, 'Apply pre-emergent herbicide if needed', '1 day', '28 days'),
  (1, 'new_lawn', 'new_lawn', 'sod', 15, 'Apply post-emergent herbicide if needed', '1 day', '28 days');

-- Lawn Improvement Plan
INSERT INTO "PlanStepTemplates" (
  "grassSpeciesId",
  "planType",
  "establishmentType",
  "stepOrder",
  "stepDescription",
  "estimatedDuration",
  "intervalToNextStep"
)
VALUES
  (1, 'lawn_improvement', null, 1, 'Test soil pH and nutrient levels', '7 days', NULL),
  (1, 'lawn_improvement', null, 2, 'Adjust soil pH to 6.2-6.8 if necessary', '14 days', NULL),
  (1, 'lawn_improvement', null, 3, 'Dethatch if thatch is more than 1/2 inch thick', '1 day', NULL),
  (1, 'lawn_improvement', null, 4, 'Aerate the lawn in early fall', '1 day', NULL),
  (1, 'lawn_improvement', null, 5, 'Rake out dead grass and debris', '1 day', NULL),
  (1, 'lawn_improvement', null, 6, 'Overseed thin areas with Kentucky Bluegrass seeds', '1 day', NULL),
  (1, 'lawn_improvement', null, 7, 'Apply balanced fertilizer', '1 day', '28 days'),
  (1, 'lawn_improvement', null, 8, 'Mow the lawn at 2.5-3.5 inches height', '1 day', '7 days'),
  (1, 'lawn_improvement', null, 9, 'Water deeply (about 1 inch) if no rainfall', '1 day', '7 days'),
  (1, 'lawn_improvement', null, 10, 'Monitor for pests and diseases', NULL, '14 days'),
  (1, 'lawn_improvement', null, 11, 'Apply pre-emergent herbicide in early spring', '1 day', '28 days'),
  (1, 'lawn_improvement', null, 12, 'Apply post-emergent herbicide if needed', '1 day', '28 days');

-- Assume Tall Fescue has grassSpeciesId = 2

-- New Lawn Plan (Seed)
INSERT INTO "PlanStepTemplates" (
  "grassSpeciesId",
  "planType",
  "establishmentType",
  "stepOrder",
  "stepDescription",
  "estimatedDuration",
  "intervalToNextStep"
)
VALUES
  (2, 'new_lawn', 'seed', 1, 'Test soil pH and nutrient levels', '7 days', NULL),
  (2, 'new_lawn', 'seed', 2, 'Adjust soil pH to 5.8-6.5 if necessary', '14 days', NULL),
  (2, 'new_lawn', 'seed', 3, 'Remove debris and old grass', '3 days', NULL),
  (2, 'new_lawn', 'seed', 4, 'Till the soil to a depth of 4-6 inches', '2 days', NULL),
  (2, 'new_lawn', 'seed', 5, 'Level the area and create a slight slope for drainage', '2 days', NULL),
  (2, 'new_lawn', 'seed', 6, 'Apply starter fertilizer', '1 day', '42 days'),
  (2, 'new_lawn', 'seed', 7, 'Sow Tall Fescue seeds at 6-8 lbs per 1000 sq ft', '1 day', NULL),
  (2, 'new_lawn', 'seed', 8, 'Lightly rake seeds into soil', '1 day', NULL),
  (2, 'new_lawn', 'seed', 9, 'Roll the area to ensure good seed-to-soil contact', '1 day', NULL),
  (2, 'new_lawn', 'seed', 10, 'Water deeply to moisten soil to 6-8 inches', '1 day', NULL),
  (2, 'new_lawn', 'seed', 11, 'Keep soil moist until germination (7-14 days)', '14 days', NULL),
  (2, 'new_lawn', 'seed', 12, 'Reduce watering frequency but increase depth as grass establishes', '21 days', NULL),
  (2, 'new_lawn', 'seed', 13, 'Mow when grass reaches 3-4 inches height', '21 days', NULL),
  (2, 'new_lawn', 'seed', 14, 'Apply balanced fertilizer 6-8 weeks after germination', '1 day', '42 days'),
  (2, 'new_lawn', 'seed', 15, 'Apply pre-emergent herbicide if needed', '1 day', '42 days');

-- New Lawn Plan (Sod)
INSERT INTO "PlanStepTemplates" (
  "grassSpeciesId",
  "planType",
  "establishmentType",
  "stepOrder",
  "stepDescription",
  "estimatedDuration",
  "intervalToNextStep"
)
VALUES
  (2, 'new_lawn', 'sod', 1, 'Test soil pH and nutrient levels', '7 days', NULL),
  (2, 'new_lawn', 'sod', 2, 'Adjust soil pH to 5.8-6.5 if necessary', '14 days', NULL),
  (2, 'new_lawn', 'sod', 3, 'Remove debris and old grass', '3 days', NULL),
  (2, 'new_lawn', 'sod', 4, 'Till the soil to a depth of 4-6 inches', '2 days', NULL),
  (2, 'new_lawn', 'sod', 5, 'Level the area and create a slight slope for drainage', '2 days', NULL),
  (2, 'new_lawn', 'sod', 6, 'Apply starter fertilizer', '1 day', '42 days'),
  (2, 'new_lawn', 'sod', 7, 'Lay Tall Fescue sod', '1 day', NULL),
  (2, 'new_lawn', 'sod', 8, 'Roll sod for good soil contact', '1 day', NULL),
  (2, 'new_lawn', 'sod', 9, 'Water deeply immediately after laying sod', '1 day', NULL),
  (2, 'new_lawn', 'sod', 10, 'Keep sod consistently moist for 2 weeks', '14 days', NULL),
  (2, 'new_lawn', 'sod', 11, 'Reduce watering frequency but increase depth', '14 days', NULL),
  (2, 'new_lawn', 'sod', 12, 'Mow when grass reaches 3-4 inches height', '14 days', NULL),
  (2, 'new_lawn', 'sod', 13, 'Apply balanced fertilizer 3-4 weeks after installation', '1 day', '42 days'),
  (2, 'new_lawn', 'sod', 14, 'Apply pre-emergent herbicide if needed', '1 day', '42 days');

-- Lawn Improvement Plan
INSERT INTO "PlanStepTemplates" (
  "grassSpeciesId",
  "planType",
  "establishmentType",
  "stepOrder",
  "stepDescription",
  "estimatedDuration",
  "intervalToNextStep"
)
VALUES
  (2, 'lawn_improvement', null, 1, 'Test soil pH and nutrient levels', '7 days', NULL),
  (2, 'lawn_improvement', null, 2, 'Adjust soil pH to 5.8-6.5 if necessary', '14 days', NULL),
  (2, 'lawn_improvement', null, 3, 'Dethatch if thatch is more than 1/2 inch thick', '1 day', NULL),
  (2, 'lawn_improvement', null, 4, 'Aerate the lawn in early fall or spring', '1 day', NULL),
  (2, 'lawn_improvement', null, 5, 'Rake out dead grass and debris', '1 day', NULL),
  (2, 'lawn_improvement', null, 6, 'Overseed thin areas with Tall Fescue seeds', '1 day', NULL),
  (2, 'lawn_improvement', null, 7, 'Apply balanced fertilizer', '1 day', '42 days'),
  (2, 'lawn_improvement', null, 8, 'Mow the lawn at 2.5-3.5 inches height', '1 day', '7 days'),
  (2, 'lawn_improvement', null, 9, 'Water deeply (about 1 inch) if no rainfall', '1 day', '7 days'),
  (2, 'lawn_improvement', null, 10, 'Monitor for pests and diseases', NULL, '14 days'),
  (2, 'lawn_improvement', null, 11, 'Apply pre-emergent herbicide in early spring', '1 day', '42 days'),
  (2, 'lawn_improvement', null, 12, 'Apply post-emergent herbicide if needed', '1 day', '42 days');

-- Assume Perennial Ryegrass has grassSpeciesId = 3

-- New Lawn Plan (Seed)
INSERT INTO "PlanStepTemplates" (
  "grassSpeciesId",
  "planType",
  "establishmentType",
  "stepOrder",
  "stepDescription",
  "estimatedDuration",
  "intervalToNextStep"
)
VALUES
  (3, 'new_lawn', 'seed', 1, 'Test soil pH and nutrient levels', '7 days', NULL),
  (3, 'new_lawn', 'seed', 2, 'Adjust soil pH to 6.0-7.0 if necessary', '14 days', NULL),
  (3, 'new_lawn', 'seed', 3, 'Remove debris and old grass', '3 days', NULL),
  (3, 'new_lawn', 'seed', 4, 'Till the soil to a depth of 4-6 inches', '2 days', NULL),
  (3, 'new_lawn', 'seed', 5, 'Level the area and create a slight slope for drainage', '2 days', NULL),
  (3, 'new_lawn', 'seed', 6, 'Apply starter fertilizer high in phosphorus', '1 day', '28 days'),
  (3, 'new_lawn', 'seed', 7, 'Sow Perennial Ryegrass seeds at 6-8 lbs per 1000 sq ft', '1 day', NULL),
  (3, 'new_lawn', 'seed', 8, 'Lightly rake seeds into soil', '1 day', NULL),
  (3, 'new_lawn', 'seed', 9, 'Roll the area to ensure good seed-to-soil contact', '1 day', NULL),
  (3, 'new_lawn', 'seed', 10, 'Water lightly and frequently to keep soil moist', '14 days', NULL),
  (3, 'new_lawn', 'seed', 11, 'Reduce watering frequency but increase depth as grass establishes', '14 days', NULL),
  (3, 'new_lawn', 'seed', 12, 'Mow when grass reaches 2-3 inches height', '14 days', NULL),
  (3, 'new_lawn', 'seed', 13, 'Apply balanced fertilizer 4-6 weeks after germination', '1 day', '28 days'),
  (3, 'new_lawn', 'seed', 14, 'Apply pre-emergent herbicide if needed', '1 day', '28 days'),
  (3, 'new_lawn', 'seed', 15, 'Apply post-emergent herbicide if needed', '1 day', '28 days');

-- Lawn Improvement Plan
INSERT INTO "PlanStepTemplates" (
  "grassSpeciesId",
  "planType",
  "establishmentType",
  "stepOrder",
  "stepDescription",
  "estimatedDuration",
  "intervalToNextStep"
)
VALUES
  (3, 'lawn_improvement', null, 1, 'Test soil pH and nutrient levels', '7 days', NULL),
  (3, 'lawn_improvement', null, 2, 'Adjust soil pH to 6.0-7.0 if necessary', '14 days', NULL),
  (3, 'lawn_improvement', null, 3, 'Dethatch if thatch is more than 1/2 inch thick', '1 day', NULL),
  (3, 'lawn_improvement', null, 4, 'Aerate the lawn in early fall or spring', '1 day', NULL),
  (3, 'lawn_improvement', null, 5, 'Rake out dead grass and debris', '1 day', NULL),
  (3, 'lawn_improvement', null, 6, 'Overseed thin areas with Perennial Ryegrass seeds', '1 day', NULL),
  (3, 'lawn_improvement', null, 7, 'Apply balanced fertilizer', '1 day', '28 days'),
  (3, 'lawn_improvement', null, 8, 'Mow the lawn at 1.5-2.5 inches height', '1 day', '7 days'),
  (3, 'lawn_improvement', null, 9, 'Water deeply (about 1 inch) if no rainfall', '1 day', '7 days'),
  (3, 'lawn_improvement', null, 10, 'Monitor for pests and diseases', NULL, '14 days'),
  (3, 'lawn_improvement', null, 11, 'Apply pre-emergent herbicide in early spring', '1 day', '28 days'),
  (3, 'lawn_improvement', null, 12, 'Apply post-emergent herbicide if needed', '1 day', '28 days');

-- Assume Bermuda Grass has grassSpeciesId = 4

-- New Lawn Plan (Seed)
INSERT INTO "PlanStepTemplates" (
  "grassSpeciesId",
  "planType",
  "establishmentType",
  "stepOrder",
  "stepDescription",
  "estimatedDuration",
  "intervalToNextStep"
)
VALUES
  (4, 'new_lawn', 'seed', 1, 'Test soil pH and nutrient levels', '7 days', NULL),
  (4, 'new_lawn', 'seed', 2, 'Adjust soil pH to 6.0-7.0 if necessary', '14 days', NULL),
  (4, 'new_lawn', 'seed', 3, 'Remove debris and old grass', '3 days', NULL),
  (4, 'new_lawn', 'seed', 4, 'Till the soil to a depth of 4-6 inches', '2 days', NULL),
  (4, 'new_lawn', 'seed', 5, 'Level the area and create a slight slope for drainage', '2 days', NULL),
  (4, 'new_lawn', 'seed', 6, 'Apply starter fertilizer high in phosphorus', '1 day', '28 days'),
  (4, 'new_lawn', 'seed', 7, 'Sow Bermuda Grass seeds at 1-2 lbs per 1000 sq ft', '1 day', NULL),
  (4, 'new_lawn', 'seed', 8, 'Lightly rake seeds into soil', '1 day', NULL),
  (4, 'new_lawn', 'seed', 9, 'Roll the area to ensure good seed-to-soil contact', '1 day', NULL),
  (4, 'new_lawn', 'seed', 10, 'Water lightly and frequently to keep soil moist', '14 days', NULL),
  (4, 'new_lawn', 'seed', 11, 'Reduce watering frequency but increase depth as grass establishes', '21 days', NULL),
  (4, 'new_lawn', 'seed', 12, 'Mow when grass reaches 1.5 inches height', '21 days', NULL),
  (4, 'new_lawn', 'seed', 13, 'Apply nitrogen-rich fertilizer 4-6 weeks after germination', '1 day', '28 days'),
  (4, 'new_lawn', 'seed', 14, 'Apply pre-emergent herbicide if needed', '1 day', '28 days'),
  (4, 'new_lawn', 'seed', 15, 'Apply post-emergent herbicide if needed', '1 day', '28 days');

-- New Lawn Plan (Sod)
INSERT INTO "PlanStepTemplates" (
  "grassSpeciesId",
  "planType",
  "establishmentType",
  "stepOrder",
  "stepDescription",
  "estimatedDuration",
  "intervalToNextStep"
)
VALUES
  (4, 'new_lawn', 'sod', 1, 'Test soil pH and nutrient levels', '7 days', NULL),
  (4, 'new_lawn', 'sod', 2, 'Adjust soil pH to 6.0-7.0 if necessary', '14 days', NULL),
  (4, 'new_lawn', 'sod', 3, 'Remove debris and old grass', '3 days', NULL),
  (4, 'new_lawn', 'sod', 4, 'Till the soil to a depth of 4-6 inches', '2 days', NULL),
  (4, 'new_lawn', 'sod', 5, 'Level the area and create a slight slope for drainage', '2 days', NULL),
  (4, 'new_lawn', 'sod', 6, 'Apply starter fertilizer', '1 day', '28 days'),
  (4, 'new_lawn', 'sod', 7, 'Lay Bermuda Grass sod', '1 day', NULL),
  (4, 'new_lawn', 'sod', 8, 'Roll sod for good soil contact', '1 day', NULL),
  (4, 'new_lawn', 'sod', 9, 'Water deeply immediately after laying sod', '1 day', NULL),
  (4, 'new_lawn', 'sod', 10, 'Keep sod consistently moist for 2 weeks', '14 days', NULL),
  (4, 'new_lawn', 'sod', 11, 'Reduce watering frequency but increase depth', '14 days', NULL),
  (4, 'new_lawn', 'sod', 12, 'Mow when grass reaches 1.5 inches height', '14 days', NULL),
  (4, 'new_lawn', 'sod', 13, 'Apply nitrogen-rich fertilizer 3-4 weeks after installation', '1 day', '28 days'),
  (4, 'new_lawn', 'sod', 14, 'Apply pre-emergent herbicide if needed', '1 day', '28 days'),
  (4, 'new_lawn', 'sod', 15, 'Apply post-emergent herbicide if needed', '1 day', '28 days');

-- Lawn Improvement Plan
INSERT INTO "PlanStepTemplates" (
  "grassSpeciesId",
  "planType",
  "establishmentType",
  "stepOrder",
  "stepDescription",
  "estimatedDuration",
  "intervalToNextStep"
)
VALUES
  (4, 'lawn_improvement', null, 1, 'Test soil pH and nutrient levels', '7 days', NULL),
  (4, 'lawn_improvement', null, 2, 'Adjust soil pH to 6.0-7.0 if necessary', '14 days', NULL),
  (4, 'lawn_improvement', null, 3, 'Dethatch if thatch is more than 1/2 inch thick', '1 day', NULL),
  (4, 'lawn_improvement', null, 4, 'Aerate the lawn in late spring or early summer', '1 day', NULL),
  (4, 'lawn_improvement', null, 5, 'Rake out dead grass and debris', '1 day', NULL),
  (4, 'lawn_improvement', null, 6, 'Overseed thin areas with Bermuda Grass seeds', '1 day', NULL),
  (4, 'lawn_improvement', null, 7, 'Apply nitrogen-rich fertilizer', '1 day', '28 days'),
  (4, 'lawn_improvement', null, 8, 'Mow the lawn at 1-2 inches height', '1 day', '5 days'),
  (4, 'lawn_improvement', null, 9, 'Water deeply (about 1 inch) if no rainfall', '1 day', '7 days'),
  (4, 'lawn_improvement', null, 10, 'Monitor for pests and diseases', NULL, '14 days'),
  (4, 'lawn_improvement', null, 11, 'Apply pre-emergent herbicide in early spring and fall', '1 day', '28 days'),
  (4, 'lawn_improvement', null, 12, 'Apply post-emergent herbicide if needed', '1 day', '28 days');

-- Assume Zoysia Grass has grassSpeciesId = 5

-- New Lawn Plan (Seed)
INSERT INTO "PlanStepTemplates" (
  "grassSpeciesId",
  "planType",
  "establishmentType",
  "stepOrder",
  "stepDescription",
  "estimatedDuration",
  "intervalToNextStep"
)
VALUES
  (5, 'new_lawn', 'seed', 1, 'Test soil pH and nutrient levels', '7 days', NULL),
  (5, 'new_lawn', 'seed', 2, 'Adjust soil pH to 6.0-7.0 if necessary', '14 days', NULL),
  (5, 'new_lawn', 'seed', 3, 'Remove debris and old grass', '3 days', NULL),
  (5, 'new_lawn', 'seed', 4, 'Till the soil to a depth of 4-6 inches', '2 days', NULL),
  (5, 'new_lawn', 'seed', 5, 'Level the area and create a slight slope for drainage', '2 days', NULL),
  (5, 'new_lawn', 'seed', 6, 'Apply starter fertilizer', '1 day', '42 days'),
  (5, 'new_lawn', 'seed', 7, 'Sow Zoysia Grass seeds at 1-2 lbs per 1000 sq ft', '1 day', NULL),
  (5, 'new_lawn', 'seed', 8, 'Lightly rake seeds into soil', '1 day', NULL),
  (5, 'new_lawn', 'seed', 9, 'Roll the area to ensure good seed-to-soil contact', '1 day', NULL),
  (5, 'new_lawn', 'seed', 10, 'Water lightly and frequently to keep soil moist', '21 days', NULL),
  (5, 'new_lawn', 'seed', 11, 'Reduce watering frequency but increase depth as grass establishes', '30 days', NULL),
  (5, 'new_lawn', 'seed', 12, 'Mow when grass reaches 2 inches height', '30 days', NULL),
  (5, 'new_lawn', 'seed', 13, 'Apply balanced fertilizer 6-8 weeks after germination', '1 day', '42 days'),
  (5, 'new_lawn', 'seed', 14, 'Apply pre-emergent herbicide if needed', '1 day', '42 days'),
  (5, 'new_lawn', 'seed', 15, 'Apply post-emergent herbicide if needed', '1 day', '42 days');

-- New Lawn Plan (Sod or Plugs)
INSERT INTO "PlanStepTemplates" (
  "grassSpeciesId",
  "planType",
  "establishmentType",
  "stepOrder",
  "stepDescription",
  "estimatedDuration",
  "intervalToNextStep"
)
VALUES
  (5, 'new_lawn', 'sod_plugs', 1, 'Test soil pH and nutrient levels', '7 days', NULL),
  (5, 'new_lawn', 'sod_plugs', 2, 'Adjust soil pH to 6.0-7.0 if necessary', '14 days', NULL),
  (5, 'new_lawn', 'sod_plugs', 3, 'Remove debris and old grass', '3 days', NULL),
  (5, 'new_lawn', 'sod_plugs', 4, 'Till the soil to a depth of 4-6 inches', '2 days', NULL),
  (5, 'new_lawn', 'sod_plugs', 5, 'Level the area and create a slight slope for drainage', '2 days', NULL),
  (5, 'new_lawn', 'sod_plugs', 6, 'Apply starter fertilizer', '1 day', '42 days'),
  (5, 'new_lawn', 'sod_plugs', 7, 'Lay Zoysia Grass sod or plant plugs 6-12 inches apart', '1 day', NULL),
  (5, 'new_lawn', 'sod_plugs', 8, 'Roll sod or tamp soil around plugs for good contact', '1 day', NULL),
  (5, 'new_lawn', 'sod_plugs', 9, 'Water deeply immediately after installation', '1 day', NULL),
  (5, 'new_lawn', 'sod_plugs', 10, 'Keep soil consistently moist for 2-3 weeks', '21 days', NULL),
  (5, 'new_lawn', 'sod_plugs', 11, 'Reduce watering frequency but increase depth', '14 days', NULL),
  (5, 'new_lawn', 'sod_plugs', 12, 'Mow when grass reaches 2 inches height', '14 days', NULL),
  (5, 'new_lawn', 'sod_plugs', 13, 'Apply balanced fertilizer 4-6 weeks after installation', '1 day', '42 days'),
  (5, 'new_lawn', 'sod_plugs', 14, 'Apply pre-emergent herbicide if needed', '1 day', '42 days'),
  (5, 'new_lawn', 'sod_plugs', 15, 'Apply post-emergent herbicide if needed', '1 day', '42 days');

-- Lawn Improvement Plan
INSERT INTO "PlanStepTemplates" (
  "grassSpeciesId",
  "planType",
  "establishmentType",
  "stepOrder",
  "stepDescription",
  "estimatedDuration",
  "intervalToNextStep"
)
VALUES
  (5, 'lawn_improvement', null, 1, 'Test soil pH and nutrient levels', '7 days', NULL),
  (5, 'lawn_improvement', null, 2, 'Adjust soil pH to 6.0-7.0 if necessary', '14 days', NULL),
  (5, 'lawn_improvement', null, 3, 'Dethatch if thatch is more than 1/2 inch thick', '1 day', NULL),
  (5, 'lawn_improvement', null, 4, 'Aerate the lawn in late spring or early summer', '1 day', NULL),
  (5, 'lawn_improvement', null, 5, 'Rake out dead grass and debris', '1 day', NULL),
  (5, 'lawn_improvement', null, 6, 'Overseed thin areas with Zoysia Grass seeds or plant plugs', '1 day', NULL),
  (5, 'lawn_improvement', null, 7, 'Apply balanced fertilizer', '1 day', '42 days'),
  (5, 'lawn_improvement', null, 8, 'Mow the lawn at 1-2 inches height', '1 day', '7 days'),
  (5, 'lawn_improvement', null, 9, 'Water deeply (about 1 inch) if no rainfall', '1 day', '7 days'),
  (5, 'lawn_improvement', null, 10, 'Monitor for pests and diseases', NULL, '14 days'),
  (5, 'lawn_improvement', null, 11, 'Apply pre-emergent herbicide in early spring', '1 day', '42 days'),
  (5, 'lawn_improvement', null, 12, 'Apply post-emergent herbicide if needed', '1 day', '42 days');

-- Assume St. Augustine Grass has grassSpeciesId = 6

-- New Lawn Plan (Sod)
INSERT INTO "PlanStepTemplates" (
  "grassSpeciesId",
  "planType",
  "establishmentType",
  "stepOrder",
  "stepDescription",
  "estimatedDuration",
  "intervalToNextStep"
)
VALUES
  (6, 'new_lawn', 'sod', 1, 'Test soil pH and nutrient levels', '7 days', NULL),
  (6, 'new_lawn', 'sod', 2, 'Adjust soil pH to 6.0-7.5 if necessary', '14 days', NULL),
  (6, 'new_lawn', 'sod', 3, 'Remove debris and old grass', '3 days', NULL),
  (6, 'new_lawn', 'sod', 4, 'Till the soil to a depth of 4-6 inches', '2 days', NULL),
  (6, 'new_lawn', 'sod', 5, 'Level the area and create a slight slope for drainage', '2 days', NULL),
  (6, 'new_lawn', 'sod', 6, 'Apply starter fertilizer', '1 day', '30 days'),
  (6, 'new_lawn', 'sod', 7, 'Lay St. Augustine sod', '1 day', NULL),
  (6, 'new_lawn', 'sod', 8, 'Roll sod for good soil contact', '1 day', NULL),
  (6, 'new_lawn', 'sod', 9, 'Water deeply immediately after laying sod', '1 day', NULL),
  (6, 'new_lawn', 'sod', 10, 'Keep sod consistently moist for 2 weeks', '14 days', NULL),
  (6, 'new_lawn', 'sod', 11, 'Reduce watering frequency but increase depth', '14 days', NULL),
  (6, 'new_lawn', 'sod', 12, 'Mow when grass reaches 3-4 inches height', '14 days', NULL),
  (6, 'new_lawn', 'sod', 13, 'Apply balanced fertilizer 3-4 weeks after installation', '1 day', '30 days'),
  (6, 'new_lawn', 'sod', 14, 'Apply pre-emergent herbicide if needed', '1 day', '30 days'),
  (6, 'new_lawn', 'sod', 15, 'Apply post-emergent herbicide if needed', '1 day', '30 days');

-- New Lawn Plan (Plugs)
INSERT INTO "PlanStepTemplates" (
  "grassSpeciesId",
  "planType",
  "establishmentType",
  "stepOrder",
  "stepDescription",
  "estimatedDuration",
  "intervalToNextStep"
)
VALUES
  (6, 'new_lawn', 'plugs', 1, 'Test soil pH and nutrient levels', '7 days', NULL),
  (6, 'new_lawn', 'plugs', 2, 'Adjust soil pH to 6.0-7.5 if necessary', '14 days', NULL),
  (6, 'new_lawn', 'plugs', 3, 'Remove debris and old grass', '3 days', NULL),
  (6, 'new_lawn', 'plugs', 4, 'Till the soil to a depth of 4-6 inches', '2 days', NULL),
  (6, 'new_lawn', 'plugs', 5, 'Level the area and create a slight slope for drainage', '2 days', NULL),
  (6, 'new_lawn', 'plugs', 6, 'Apply starter fertilizer', '1 day', '30 days'),
  (6, 'new_lawn', 'plugs', 7, 'Plant St. Augustine plugs 6-12 inches apart', '1 day', NULL),
  (6, 'new_lawn', 'plugs', 8, 'Water deeply immediately after planting', '1 day', NULL),
  (6, 'new_lawn', 'plugs', 9, 'Keep soil consistently moist for 2 weeks', '14 days', NULL),
  (6, 'new_lawn', 'plugs', 10, 'Reduce watering frequency but increase depth', '14 days', NULL),
  (6, 'new_lawn', 'plugs', 11, 'Mow when grass reaches 3-4 inches height', '30 days', NULL),
  (6, 'new_lawn', 'plugs', 12, 'Apply balanced fertilizer 4-6 weeks after planting', '1 day', '30 days'),
  (6, 'new_lawn', 'plugs', 13, 'Apply pre-emergent herbicide if needed', '1 day', '30 days'),
  (6, 'new_lawn', 'plugs', 14, 'Apply post-emergent herbicide if needed', '1 day', '30 days');

-- Lawn Improvement Plan
INSERT INTO "PlanStepTemplates" (
  "grassSpeciesId",
  "planType",
  "establishmentType",
  "stepOrder",
  "stepDescription",
  "estimatedDuration",
  "intervalToNextStep"
)
VALUES
  (6, 'lawn_improvement', null, 1, 'Test soil pH and nutrient levels', '7 days', NULL),
  (6, 'lawn_improvement', null, 2, 'Adjust soil pH to 6.0-7.5 if necessary', '14 days', NULL),
  (6, 'lawn_improvement', null, 3, 'Dethatch if thatch is more than 1/2 inch thick', '1 day', NULL),
  (6, 'lawn_improvement', null, 4, 'Aerate the lawn in late spring or early summer if soil is compacted', '1 day', NULL),
  (6, 'lawn_improvement', null, 5, 'Rake out dead grass and debris', '1 day', NULL),
  (6, 'lawn_improvement', null, 6, 'Plant St. Augustine plugs in thin areas', '1 day', NULL),
  (6, 'lawn_improvement', null, 7, 'Apply balanced fertilizer', '1 day', '30 days'),
  (6, 'lawn_improvement', null, 8, 'Mow the lawn at 2.5-4 inches height', '1 day', '7 days'),
  (6, 'lawn_improvement', null, 9, 'Water deeply (about 1 inch)', '1 day', '7 days'),
  (6, 'lawn_improvement', null, 10, 'Monitor for pests and diseases, especially chinch bugs', NULL, '14 days'),
  (6, 'lawn_improvement', null, 11, 'Apply pre-emergent herbicide in early spring and fall', '1 day', '30 days'),
  (6, 'lawn_improvement', null, 12, 'Apply post-emergent herbicide if needed', '1 day', '30 days');

-- Assume Centipede Grass has grassSpeciesId = 7

-- New Lawn Plan (Seed)
INSERT INTO "PlanStepTemplates" (
  "grassSpeciesId",
  "planType",
  "establishmentType",
  "stepOrder",
  "stepDescription",
  "estimatedDuration",
  "intervalToNextStep"
)
VALUES
  (7, 'new_lawn', 'seed', 1, 'Test soil pH and nutrient levels', '7 days', NULL),
  (7, 'new_lawn', 'seed', 2, 'Adjust soil pH to 4.5-6.0 if necessary', '14 days', NULL),
  (7, 'new_lawn', 'seed', 3, 'Remove debris and old grass', '3 days', NULL),
  (7, 'new_lawn', 'seed', 4, 'Till the soil to a depth of 4-6 inches', '2 days', NULL),
  (7, 'new_lawn', 'seed', 5, 'Level the area and create a slight slope for drainage', '2 days', NULL),
  (7, 'new_lawn', 'seed', 6, 'Apply starter fertilizer low in nitrogen', '1 day', '84 days'),
  (7, 'new_lawn', 'seed', 7, 'Sow Centipede Grass seeds at 1/4 to 1/2 lb per 1000 sq ft', '1 day', NULL),
  (7, 'new_lawn', 'seed', 8, 'Lightly rake seeds into soil', '1 day', NULL),
  (7, 'new_lawn', 'seed', 9, 'Roll the area to ensure good seed-to-soil contact', '1 day', NULL),
  (7, 'new_lawn', 'seed', 10, 'Water lightly and frequently to keep soil moist', '21 days', NULL),
  (7, 'new_lawn', 'seed', 11, 'Reduce watering frequency but increase depth as grass establishes', '30 days', NULL),
  (7, 'new_lawn', 'seed', 12, 'Mow when grass reaches 2 inches height', '30 days', NULL),
  (7, 'new_lawn', 'seed', 13, 'Apply low-nitrogen fertilizer 8-12 weeks after germination', '1 day', '84 days'),
  (7, 'new_lawn', 'seed', 14, 'Apply pre-emergent herbicide if needed', '1 day', '84 days'),
  (7, 'new_lawn', 'seed', 15, 'Apply post-emergent herbicide if needed', '1 day', '84 days');

-- New Lawn Plan (Sod)
INSERT INTO "PlanStepTemplates" (
  "grassSpeciesId",
  "planType",
  "establishmentType",
  "stepOrder",
  "stepDescription",
  "estimatedDuration",
  "intervalToNextStep"
)
VALUES
  (7, 'new_lawn', 'sod', 1, 'Test soil pH and nutrient levels', '7 days', NULL),
  (7, 'new_lawn', 'sod', 2, 'Adjust soil pH to 4.5-6.0 if necessary', '14 days', NULL),
  (7, 'new_lawn', 'sod', 3, 'Remove debris and old grass', '3 days', NULL),
  (7, 'new_lawn', 'sod', 4, 'Till the soil to a depth of 4-6 inches', '2 days', NULL),
  (7, 'new_lawn', 'sod', 5, 'Level the area and create a slight slope for drainage', '2 days', NULL),
  (7, 'new_lawn', 'sod', 6, 'Apply starter fertilizer low in nitrogen', '1 day', '84 days'),
  (7, 'new_lawn', 'sod', 7, 'Lay Centipede Grass sod', '1 day', NULL),
  (7, 'new_lawn', 'sod', 8, 'Roll sod for good soil contact', '1 day', NULL),
  (7, 'new_lawn', 'sod', 9, 'Water deeply immediately after laying sod', '1 day', NULL),
  (7, 'new_lawn', 'sod', 10, 'Keep sod consistently moist for 2-3 weeks', '21 days', NULL),
  (7, 'new_lawn', 'sod', 11, 'Reduce watering frequency but increase depth', '14 days', NULL),
  (7, 'new_lawn', 'sod', 12, 'Mow when grass reaches 2 inches height', '14 days', NULL),
  (7, 'new_lawn', 'sod', 13, 'Apply low-nitrogen fertilizer 4-6 weeks after installation', '1 day', '84 days'),
  (7, 'new_lawn', 'sod', 14, 'Apply pre-emergent herbicide if needed', '1 day', '84 days'),
  (7, 'new_lawn', 'sod', 15, 'Apply post-emergent herbicide if needed', '1 day', '84 days');

-- Lawn Improvement Plan
INSERT INTO "PlanStepTemplates" (
  "grassSpeciesId",
  "planType",
  "establishmentType",
  "stepOrder",
  "stepDescription",
  "estimatedDuration",
  "intervalToNextStep"
)
VALUES
  (7, 'lawn_improvement', null, 1, 'Test soil pH and nutrient levels', '7 days', NULL),
  (7, 'lawn_improvement', null, 2, 'Adjust soil pH to 4.5-6.0 if necessary', '14 days', NULL),
  (7, 'lawn_improvement', null, 3, 'Dethatch if thatch is more than 1/2 inch thick', '1 day', NULL),
  (7, 'lawn_improvement', null, 4, 'Aerate the lawn in late spring if soil is compacted', '1 day', NULL),
  (7, 'lawn_improvement', null, 5, 'Rake out dead grass and debris', '1 day', NULL),
  (7, 'lawn_improvement', null, 6, 'Overseed thin areas with Centipede Grass seeds', '1 day', NULL),
  (7, 'lawn_improvement', null, 7, 'Apply low-nitrogen, high-potassium fertilizer', '1 day', '84 days'),
  (7, 'lawn_improvement', null, 8, 'Mow the lawn at 1-2 inches height', '1 day', '14 days'),
  (7, 'lawn_improvement', null, 9, 'Water deeply (about 1 inch) if no rainfall', '1 day', '14 days'),
  (7, 'lawn_improvement', null, 10, 'Monitor for pests and diseases', NULL, '30 days'),
  (7, 'lawn_improvement', null, 11, 'Apply pre-emergent herbicide in early spring if needed', '1 day', '84 days'),
  (7, 'lawn_improvement', null, 12, 'Apply post-emergent herbicide if needed', '1 day', '84 days');

-- Assume Fine Fescue has grassSpeciesId = 8

-- New Lawn Plan (Seed)
INSERT INTO "PlanStepTemplates" (
  "grassSpeciesId",
  "planType",
  "establishmentType",
  "stepOrder",
  "stepDescription",
  "estimatedDuration",
  "intervalToNextStep"
)
VALUES
  (8, 'new_lawn', 'seed', 1, 'Test soil pH and nutrient levels', '7 days', NULL),
  (8, 'new_lawn', 'seed', 2, 'Adjust soil pH to 5.5-6.5 if necessary', '14 days', NULL),
  (8, 'new_lawn', 'seed', 3, 'Remove debris and old grass', '3 days', NULL),
  (8, 'new_lawn', 'seed', 4, 'Till the soil to a depth of 4-6 inches', '2 days', NULL),
  (8, 'new_lawn', 'seed', 5, 'Level the area and create a slight slope for drainage', '2 days', NULL),
  (8, 'new_lawn', 'seed', 6, 'Apply starter fertilizer', '1 day', '56 days'),
  (8, 'new_lawn', 'seed', 7, 'Sow Fine Fescue seeds at 5-8 lbs per 1000 sq ft', '1 day', NULL),
  (8, 'new_lawn', 'seed', 8, 'Lightly rake seeds into soil', '1 day', NULL),
  (8, 'new_lawn', 'seed', 9, 'Roll the area to ensure good seed-to-soil contact', '1 day', NULL),
  (8, 'new_lawn', 'seed', 10, 'Water lightly and frequently to keep soil moist', '14 days', NULL),
  (8, 'new_lawn', 'seed', 11, 'Reduce watering frequency but increase depth as grass establishes', '21 days', NULL),
  (8, 'new_lawn', 'seed', 12, 'Mow when grass reaches 3 inches height', '21 days', NULL),
  (8, 'new_lawn', 'seed', 13, 'Apply balanced fertilizer 6-8 weeks after germination', '1 day', '56 days'),
  (8, 'new_lawn', 'seed', 14, 'Apply pre-emergent herbicide if needed', '1 day', '56 days'),
  (8, 'new_lawn', 'seed', 15, 'Apply post-emergent herbicide if needed', '1 day', '56 days');

-- New Lawn Plan (Sod)
INSERT INTO "PlanStepTemplates" (
  "grassSpeciesId",
  "planType",
  "establishmentType",
  "stepOrder",
  "stepDescription",
  "estimatedDuration",
  "intervalToNextStep"
)
VALUES
  (8, 'new_lawn', 'sod', 1, 'Test soil pH and nutrient levels', '7 days', NULL),
  (8, 'new_lawn', 'sod', 2, 'Adjust soil pH to 5.5-6.5 if necessary', '14 days', NULL),
  (8, 'new_lawn', 'sod', 3, 'Remove debris and old grass', '3 days', NULL),
  (8, 'new_lawn', 'sod', 4, 'Till the soil to a depth of 4-6 inches', '2 days', NULL),
  (8, 'new_lawn', 'sod', 5, 'Level the area and create a slight slope for drainage', '2 days', NULL),
  (8, 'new_lawn', 'sod', 6, 'Apply starter fertilizer', '1 day', '56 days'),
  (8, 'new_lawn', 'sod', 7, 'Lay Fine Fescue sod', '1 day', NULL),
  (8, 'new_lawn', 'sod', 8, 'Roll sod for good soil contact', '1 day', NULL),
  (8, 'new_lawn', 'sod', 9, 'Water deeply immediately after laying sod', '1 day', NULL),
  (8, 'new_lawn', 'sod', 10, 'Keep sod consistently moist for 2 weeks', '14 days', NULL),
  (8, 'new_lawn', 'sod', 11, 'Reduce watering frequency but increase depth', '14 days', NULL),
  (8, 'new_lawn', 'sod', 12, 'Mow when grass reaches 3 inches height', '14 days', NULL),
  (8, 'new_lawn', 'sod', 13, 'Apply balanced fertilizer 3-4 weeks after installation', '1 day', '56 days'),
  (8, 'new_lawn', 'sod', 14, 'Apply pre-emergent herbicide if needed', '1 day', '56 days'),
  (8, 'new_lawn', 'sod', 15, 'Apply post-emergent herbicide if needed', '1 day', '56 days');

-- Lawn Improvement Plan
INSERT INTO "PlanStepTemplates" (
  "grassSpeciesId",
  "planType",
  "establishmentType",
  "stepOrder",
  "stepDescription",
  "estimatedDuration",
  "intervalToNextStep"
)
VALUES
  (8, 'lawn_improvement', null, 1, 'Test soil pH and nutrient levels', '7 days', NULL),
  (8, 'lawn_improvement', null, 2, 'Adjust soil pH to 5.5-6.5 if necessary', '14 days', NULL),
  (8, 'lawn_improvement', null, 3, 'Dethatch if thatch is more than 1/2 inch thick', '1 day', NULL),
  (8, 'lawn_improvement', null, 4, 'Aerate the lawn in early fall if soil is compacted', '1 day', NULL),
  (8, 'lawn_improvement', null, 5, 'Rake out dead grass and debris', '1 day', NULL),
  (8, 'lawn_improvement', null, 6, 'Overseed thin areas with Fine Fescue seeds', '1 day', NULL),
  (8, 'lawn_improvement', null, 7, 'Apply balanced fertilizer', '1 day', '56 days'),
  (8, 'lawn_improvement', null, 8, 'Mow the lawn at 2.5-3.5 inches height', '1 day', '7 days'),
  (8, 'lawn_improvement', null, 9, 'Water deeply (about 1 inch) if no rainfall', '1 day', '7 days'),
  (8, 'lawn_improvement', null, 10, 'Monitor for pests and diseases', NULL, '30 days'),
  (8, 'lawn_improvement', null, 11, 'Apply pre-emergent herbicide in early spring if needed', '1 day', '56 days'),
  (8, 'lawn_improvement', null, 12, 'Apply post-emergent herbicide if needed', '1 day', '56 days');

-- Assume Buffalo Grass has grassSpeciesId = 9

-- New Lawn Plan (Seed)
INSERT INTO "PlanStepTemplates" (
  "grassSpeciesId",
  "planType",
  "establishmentType",
  "stepOrder",
  "stepDescription",
  "estimatedDuration",
  "intervalToNextStep"
)
VALUES
  (9, 'new_lawn', 'seed', 1, 'Test soil pH and nutrient levels', '7 days', NULL),
  (9, 'new_lawn', 'seed', 2, 'Adjust soil pH to 6.0-7.5 if necessary', '14 days', NULL),
  (9, 'new_lawn', 'seed', 3, 'Remove debris and old grass', '3 days', NULL),
  (9, 'new_lawn', 'seed', 4, 'Till the soil to a depth of 4-6 inches', '2 days', NULL),
  (9, 'new_lawn', 'seed', 5, 'Level the area and create a slight slope for drainage', '2 days', NULL),
  (9, 'new_lawn', 'seed', 6, 'Apply low-nitrogen starter fertilizer', '1 day', '56 days'),
  (9, 'new_lawn', 'seed', 7, 'Sow Buffalo Grass seeds at 1-3 lbs per 1000 sq ft', '1 day', NULL),
  (9, 'new_lawn', 'seed', 8, 'Lightly rake seeds into soil', '1 day', NULL),
  (9, 'new_lawn', 'seed', 9, 'Roll the area to ensure good seed-to-soil contact', '1 day', NULL),
  (9, 'new_lawn', 'seed', 10, 'Water lightly and frequently to keep soil moist', '21 days', NULL),
  (9, 'new_lawn', 'seed', 11, 'Reduce watering frequency but increase depth as grass establishes', '30 days', NULL),
  (9, 'new_lawn', 'seed', 12, 'Mow when grass reaches 2-3 inches height', '30 days', NULL),
  (9, 'new_lawn', 'seed', 13, 'Apply low-nitrogen fertilizer 8 weeks after germination', '1 day', '56 days'),
  (9, 'new_lawn', 'seed', 14, 'Apply pre-emergent herbicide if needed', '1 day', '56 days'),
  (9, 'new_lawn', 'seed', 15, 'Apply post-emergent herbicide if needed', '1 day', '56 days');

-- New Lawn Plan (Sod or Plugs)
INSERT INTO "PlanStepTemplates" (
  "grassSpeciesId",
  "planType",
  "establishmentType",
  "stepOrder",
  "stepDescription",
  "estimatedDuration",
  "intervalToNextStep"
)
VALUES
  (9, 'new_lawn', 'sod_plugs', 1, 'Test soil pH and nutrient levels', '7 days', NULL),
  (9, 'new_lawn', 'sod_plugs', 2, 'Adjust soil pH to 6.0-7.5 if necessary', '14 days', NULL),
  (9, 'new_lawn', 'sod_plugs', 3, 'Remove debris and old grass', '3 days', NULL),
  (9, 'new_lawn', 'sod_plugs', 4, 'Till the soil to a depth of 4-6 inches', '2 days', NULL),
  (9, 'new_lawn', 'sod_plugs', 5, 'Level the area and create a slight slope for drainage', '2 days', NULL),
  (9, 'new_lawn', 'sod_plugs', 6, 'Apply low-nitrogen starter fertilizer', '1 day', '56 days'),
  (9, 'new_lawn', 'sod_plugs', 7, 'Lay Buffalo Grass sod or plant plugs 6-12 inches apart', '1 day', NULL),
  (9, 'new_lawn', 'sod_plugs', 8, 'Roll sod or tamp soil around plugs for good contact', '1 day', NULL),
  (9, 'new_lawn', 'sod_plugs', 9, 'Water deeply immediately after installation', '1 day', NULL),
  (9, 'new_lawn', 'sod_plugs', 10, 'Keep soil consistently moist for 2-3 weeks', '21 days', NULL),
  (9, 'new_lawn', 'sod_plugs', 11, 'Reduce watering frequency but increase depth', '14 days', NULL),
  (9, 'new_lawn', 'sod_plugs', 12, 'Mow when grass reaches 2-3 inches height', '21 days', NULL),
  (9, 'new_lawn', 'sod_plugs', 13, 'Apply low-nitrogen fertilizer 4-6 weeks after installation', '1 day', '56 days'),
  (9, 'new_lawn', 'sod_plugs', 14, 'Apply pre-emergent herbicide if needed', '1 day', '56 days'),
  (9, 'new_lawn', 'sod_plugs', 15, 'Apply post-emergent herbicide if needed', '1 day', '56 days');

-- Lawn Improvement Plan
INSERT INTO "PlanStepTemplates" (
  "grassSpeciesId",
  "planType",
  "establishmentType",
  "stepOrder",
  "stepDescription",
  "estimatedDuration",
  "intervalToNextStep"
)
VALUES
  (9, 'lawn_improvement', null, 1, 'Test soil pH and nutrient levels', '7 days', NULL),
  (9, 'lawn_improvement', null, 2, 'Adjust soil pH to 6.0-7.5 if necessary', '14 days', NULL),
  (9, 'lawn_improvement', null, 3, 'Dethatch if thatch is more than 1/2 inch thick', '1 day', NULL),
  (9, 'lawn_improvement', null, 4, 'Aerate the lawn in late spring or early summer if soil is compacted', '1 day', NULL),
  (9, 'lawn_improvement', null, 5, 'Rake out dead grass and debris', '1 day', NULL),
  (9, 'lawn_improvement', null, 6, 'Overseed thin areas with Buffalo Grass seeds or plant plugs', '1 day', NULL),
  (9, 'lawn_improvement', null, 7, 'Apply low-nitrogen, slow-release fertilizer', '1 day', '56 days'),
  (9, 'lawn_improvement', null, 8, 'Mow the lawn at 2-3 inches height', '1 day', '14 days'),
  (9, 'lawn_improvement', null, 9, 'Water deeply (about 1 inch) if no rainfall', '1 day', '14 days'),
  (9, 'lawn_improvement', null, 10, 'Monitor for pests and diseases', NULL, '30 days'),
  (9, 'lawn_improvement', null, 11, 'Apply pre-emergent herbicide in early spring if needed', '1 day', '56 days'),
  (9, 'lawn_improvement', null, 12, 'Apply post-emergent herbicide if needed', '1 day', '56 days');

-- Assume Bahia Grass has grassSpeciesId = 10

-- New Lawn Plan (Seed)
INSERT INTO "PlanStepTemplates" (
  "grassSpeciesId",
  "planType",
  "establishmentType",
  "stepOrder",
  "stepDescription",
  "estimatedDuration",
  "intervalToNextStep"
)
VALUES
  (10, 'new_lawn', 'seed', 1, 'Test soil pH and nutrient levels', '7 days', NULL),
  (10, 'new_lawn', 'seed', 2, 'Adjust soil pH to 5.5-6.5 if necessary', '14 days', NULL),
  (10, 'new_lawn', 'seed', 3, 'Remove debris and old grass', '3 days', NULL),
  (10, 'new_lawn', 'seed', 4, 'Till the soil to a depth of 4-6 inches', '2 days', NULL),
  (10, 'new_lawn', 'seed', 5, 'Level the area and create a slight slope for drainage', '2 days', NULL),
  (10, 'new_lawn', 'seed', 6, 'Apply starter fertilizer high in phosphorus', '1 day', '42 days'),
  (10, 'new_lawn', 'seed', 7, 'Sow Bahia Grass seeds at 5-10 lbs per 1000 sq ft', '1 day', NULL),
  (10, 'new_lawn', 'seed', 8, 'Lightly rake seeds into soil', '1 day', NULL),
  (10, 'new_lawn', 'seed', 9, 'Roll the area to ensure good seed-to-soil contact', '1 day', NULL),
  (10, 'new_lawn', 'seed', 10, 'Water lightly and frequently to keep soil moist', '21 days', NULL),
  (10, 'new_lawn', 'seed', 11, 'Reduce watering frequency but increase depth as grass establishes', '30 days', NULL),
  (10, 'new_lawn', 'seed', 12, 'Mow when grass reaches 3-4 inches height', '30 days', NULL),
  (10, 'new_lawn', 'seed', 13, 'Apply balanced fertilizer 6-8 weeks after germination', '1 day', '42 days'),
  (10, 'new_lawn', 'seed', 14, 'Apply pre-emergent herbicide', '1 day', '42 days'),
  (10, 'new_lawn', 'seed', 15, 'Apply post-emergent herbicide if needed', '1 day', '42 days');

-- New Lawn Plan (Sod)
INSERT INTO "PlanStepTemplates" (
  "grassSpeciesId",
  "planType",
  "establishmentType",
  "stepOrder",
  "stepDescription",
  "estimatedDuration",
  "intervalToNextStep"
)
VALUES
  (10, 'new_lawn', 'sod', 1, 'Test soil pH and nutrient levels', '7 days', NULL),
  (10, 'new_lawn', 'sod', 2, 'Adjust soil pH to 5.5-6.5 if necessary', '14 days', NULL),
  (10, 'new_lawn', 'sod', 3, 'Remove debris and old grass', '3 days', NULL),
  (10, 'new_lawn', 'sod', 4, 'Till the soil to a depth of 4-6 inches', '2 days', NULL),
  (10, 'new_lawn', 'sod', 5, 'Level the area and create a slight slope for drainage', '2 days', NULL),
  (10, 'new_lawn', 'sod', 6, 'Apply starter fertilizer', '1 day', '42 days'),
  (10, 'new_lawn', 'sod', 7, 'Lay Bahia Grass sod', '1 day', NULL),
  (10, 'new_lawn', 'sod', 8, 'Roll sod for good soil contact', '1 day', NULL),
  (10, 'new_lawn', 'sod', 9, 'Water deeply immediately after laying sod', '1 day', NULL),
  (10, 'new_lawn', 'sod', 10, 'Keep sod consistently moist for 2-3 weeks', '21 days', NULL),
  (10, 'new_lawn', 'sod', 11, 'Reduce watering frequency but increase depth', '14 days', NULL),
  (10, 'new_lawn', 'sod', 12, 'Mow when grass reaches 3-4 inches height', '14 days', NULL),
  (10, 'new_lawn', 'sod', 13, 'Apply balanced fertilizer 3-4 weeks after installation', '1 day', '42 days'),
  (10, 'new_lawn', 'sod', 14, 'Apply pre-emergent herbicide', '1 day', '42 days'),
  (10, 'new_lawn', 'sod', 15, 'Apply post-emergent herbicide if needed', '1 day', '42 days');

-- Lawn Improvement Plan
INSERT INTO "PlanStepTemplates" (
  "grassSpeciesId",
  "planType",
  "establishmentType",
  "stepOrder",
  "stepDescription",
  "estimatedDuration",
  "intervalToNextStep"
)
VALUES
  (10, 'lawn_improvement', null, 1, 'Test soil pH and nutrient levels', '7 days', NULL),
  (10, 'lawn_improvement', null, 2, 'Adjust soil pH to 5.5-6.5 if necessary', '14 days', NULL),
  (10, 'lawn_improvement', null, 3, 'Dethatch if thatch is more than 1/2 inch thick', '1 day', NULL),
  (10, 'lawn_improvement', null, 4, 'Aerate the lawn in late spring or early summer', '1 day', NULL),
  (10, 'lawn_improvement', null, 5, 'Rake out dead grass and debris', '1 day', NULL),
  (10, 'lawn_improvement', null, 6, 'Overseed thin areas with Bahia Grass seeds', '1 day', NULL),
  (10, 'lawn_improvement', null, 7, 'Apply balanced fertilizer', '1 day', '42 days'),
  (10, 'lawn_improvement', null, 8, 'Mow the lawn at 2-3 inches height', '1 day', '7 days'),
  (10, 'lawn_improvement', null, 9, 'Water deeply (about 1 inch)', '1 day', '7 days'),
  (10, 'lawn_improvement', null, 10, 'Monitor for pests and diseases, especially mole crickets', NULL, '30 days'),
  (10, 'lawn_improvement', null, 11, 'Apply pre-emergent herbicide in early spring', '1 day', '42 days'),
  (10, 'lawn_improvement', null, 12, 'Apply post-emergent herbicide as needed', '1 day', '42 days');
