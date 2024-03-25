from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer

qdrant_client = QdrantClient(
    "ead20606-651e-4ea2-a592-252e7ca6ed1e.europe-west3-0.gcp.cloud.qdrant.io",
    api_key="KDLJ23vjZkSUbyFXOXSytHH61po__Y61dNuI5p4OsfzGP_KD9SbF5Q",
)
encoder = SentenceTransformer("all-MiniLM-L6-v2")

diets = [
    {
      "name": "Mediterranean Diet",
      "description": "The Mediterranean diet emphasizes eating primarily plant-based foods, such as fruits and vegetables, whole grains, legumes, and nuts. It includes olive oil as a primary fat source and encourages moderate consumption of fish, poultry, and dairy products, while limiting red meat and sweets."
    },
    {
      "name": "Keto Diet",
      "description": "The ketogenic diet involves drastically reducing carbohydrate intake and replacing it with fat, putting the body into a state of ketosis where it burns fat for energy. It typically includes high-fat foods like meat, fish, eggs, dairy, oils, nuts, and seeds, while restricting or eliminating most carbohydrates."
    },
    {
      "name": "Paleo Diet",
      "description": "The paleo diet is based on foods presumed to have been available to humans during the Paleolithic era, such as lean meats, fish, fruits, vegetables, nuts, and seeds. It excludes processed foods, grains, legumes, dairy, and refined sugars."
    },
    {
      "name": "Vegetarian Diet",
      "description": "A vegetarian diet excludes meat, poultry, and seafood. However, it may include dairy products and eggs depending on the individual's preferences. Variations include lacto-vegetarian (includes dairy but not eggs), ovo-vegetarian (includes eggs but not dairy), and lacto-ovo-vegetarian (includes both dairy and eggs)."
    },
    {
      "name": "Vegan Diet",
      "description": "A vegan diet excludes all animal products, including meat, poultry, seafood, dairy, eggs, and honey. It primarily consists of fruits, vegetables, grains, legumes, nuts, and seeds."
    },
    {
      "name": "Intermittent Fasting",
      "description": "Intermittent fasting involves cycling between periods of eating and fasting. Common methods include the 16/8 method (fasting for 16 hours and eating within an 8-hour window), alternate-day fasting, and the 5:2 diet (eating normally for five days and restricting calories on two non-consecutive days)."
    },
    {
      "name": "Whole30 Diet",
      "description": "The Whole30 diet is a 30-day program that emphasizes whole foods while eliminating added sugars, alcohol, grains, legumes, soy, and dairy. It aims to reset eating habits, improve digestion, and promote overall health."
    },
    {
      "name": "DASH Diet",
      "description": "The DASH (Dietary Approaches to Stop Hypertension) diet is designed to prevent and lower high blood pressure. It emphasizes fruits, vegetables, whole grains, lean proteins, and low-fat dairy while limiting sodium, saturated fats, and added sugars."
    },
    {
      "name": "Flexitarian Diet",
      "description": "The flexitarian diet is a flexible approach to vegetarianism that encourages mostly plant-based foods while allowing for occasional meat and fish consumption. It prioritizes fruits, vegetables, whole grains, and plant-based proteins but does not strictly eliminate animal products."
    },
    {
      "name": "Atkins Diet",
      "description": "The Atkins diet is a low-carb, high-fat diet that promotes weight loss by inducing ketosis. It involves four phases, starting with very low carbohydrate intake and gradually adding more carbs as the diet progresses. It emphasizes protein-rich foods, healthy fats, and non-starchy vegetables."
    },
    {
      "name": "South Beach Diet",
      "description": "The South Beach diet is a low-carb, high-protein diet that focuses on consuming lean proteins, healthy fats, and complex carbohydrates. It is divided into three phases, with the first phase being the most restrictive, gradually introducing more foods as the program progresses."
    },
    {
      "name": "Zone Diet",
      "description": "The Zone diet aims to regulate hormone levels and control inflammation by balancing macronutrients in each meal. It emphasizes a 40/30/30 ratio of carbohydrates, protein, and fat, respectively, to stabilize blood sugar levels and promote weight loss."
    },
    {
      "name": "Weight Watchers (WW)",
      "description": "Weight Watchers (WW) is a points-based system that assigns a value to foods and beverages based on their nutritional content. Participants are allocated a daily and weekly points allowance, encouraging them to make healthier food choices while still enjoying their favorite treats in moderation."
    },
    {
      "name": "Low FODMAP Diet",
      "description": "The low FODMAP diet is designed to alleviate symptoms of irritable bowel syndrome (IBS) by restricting certain fermentable carbohydrates that can cause digestive discomfort. It involves avoiding foods high in fermentable oligosaccharides, disaccharides, monosaccharides, and polyols."
    },
    {
      "name": "Carnivore Diet",
      "description": "The carnivore diet is a meat-based diet that involves consuming only animal products, such as meat, fish, and animal-derived fats. It excludes all plant-based foods, including fruits, vegetables, grains, legumes, nuts, and seeds."
    },
    {
      "name": "Low-Carb Diet",
      "description": "A low-carb diet restricts carbohydrate intake, typically to less than 20-50 grams per day, to promote weight loss and improve health markers such as blood sugar and insulin levels. It focuses on foods like meat, fish, eggs, non-starchy vegetables, nuts, and seeds while limiting or avoiding grains, sugars, and starchy foods."
    },
    {
      "name": "Gluten-Free Diet",
      "description": "A gluten-free diet eliminates gluten, a protein found in wheat, barley, and rye, to manage symptoms of celiac disease or gluten sensitivity. It involves consuming naturally gluten-free foods like fruits, vegetables, meats, fish, dairy, nuts, and gluten-free grains like rice and quinoa."
    },
    {
      "name": "Alkaline Diet",
      "description": "The alkaline diet promotes consuming foods that alkalize the body and reduce acidity. It emphasizes fruits, vegetables, nuts, seeds, and legumes while limiting or avoiding acidic foods like meat, dairy, processed foods, and refined sugars."
    },
    {
      "name": "Low-Calorie Diet",
      "description": "A low-calorie diet involves reducing calorie intake to create a calorie deficit, promoting weight loss. It typically focuses on portion control, choosing foods with lower energy density, and increasing physical activity to achieve and maintain a healthy weight."
    },
    {
        "name": "Raw Food Diet",
        "description": "The raw food diet involves consuming predominantly uncooked and unprocessed foods to preserve their natural enzymes and nutrients. It includes fruits, vegetables, nuts, seeds, sprouted grains, and raw dairy products or eggs (in some variations) while excluding cooked, processed, or refined foods."
    },
    {
        "name": "Macrobiotic Diet",
        "description": "The macrobiotic diet is based on the principles of balance and harmony with nature. It emphasizes whole grains, vegetables, legumes, seaweed, fermented foods, and occasionally fish while avoiding processed foods, refined sugars, and animal products."
    },
    {
        "name": "Blood Type Diet",
        "description": "The blood type diet suggests that individuals should eat certain foods based on their blood type for optimal health and weight loss. It categorizes foods as beneficial, neutral, or harmful depending on blood type, with type O being encouraged to consume more protein-rich foods, type A focusing on plant-based diets, type B emphasizing a balanced diet, and type AB combining elements of types A and B."
    },
    {
        "name": "Detox Diet",
        "description": "A detox diet involves removing toxins from the body by consuming specific foods or liquids for a designated period. It typically includes fruits, vegetables, herbs, and water while excluding processed foods, caffeine, alcohol, and added sugars."
    },
    {
        "name": "Plant-Based Diet",
        "description": "A plant-based diet focuses on consuming predominantly or exclusively plant-derived foods, such as fruits, vegetables, grains, legumes, nuts, and seeds. It may include small amounts of animal products but emphasizes plant foods for health and environmental reasons."
    },
    {
        "name": "Low-Glycemic Index Diet",
        "description": "The low-glycemic index diet emphasizes consuming foods that have a low glycemic index (GI) to help control blood sugar levels and promote weight loss. It includes foods like non-starchy vegetables, whole grains, lean proteins, and healthy fats while limiting high-GI foods like refined sugars and processed carbohydrates."
    },
    {
        "name": "HCG Diet",
        "description": "The HCG (human chorionic gonadotropin) diet involves pairing a very low-calorie diet (VLCD) with daily injections or supplements of HCG hormone to promote rapid weight loss. It typically restricts calorie intake to 500-800 calories per day while emphasizing lean proteins, vegetables, and limited carbohydrates."
    },
    {
        "name": "Low-Sodium Diet",
        "description": "A low-sodium diet involves reducing sodium intake to manage conditions like high blood pressure, heart disease, and kidney problems. It focuses on consuming fresh, whole foods and avoiding processed or packaged foods, which often contain high levels of sodium."
    },
    {
        "name": "Low-Fat Diet",
        "description": "A low-fat diet restricts fat intake to reduce calorie consumption and promote weight loss. It emphasizes lean proteins, whole grains, fruits, vegetables, and low-fat dairy products while limiting or avoiding high-fat foods like fatty meats, oils, butter, and full-fat dairy."
    },
    {
        "name": "Anti-Inflammatory Diet",
        "description": "The anti-inflammatory diet focuses on consuming foods that reduce inflammation in the body, which is linked to chronic diseases like heart disease, arthritis, and cancer. It includes fruits, vegetables, nuts, seeds, fatty fish, whole grains, and healthy fats while limiting or avoiding processed foods, refined sugars, and trans fats."
    },
    {
        "name": "Specific Carbohydrate Diet (SCD)",
        "description": "The specific carbohydrate diet (SCD) is designed to manage conditions like Crohn's disease, ulcerative colitis, and celiac disease by restricting complex carbohydrates that are difficult to digest. It includes easily digestible foods like fruits, vegetables, nuts, seeds, lean proteins, and certain dairy products while excluding grains, sugars, and most processed foods."
    },
    {
        "name": "Low-Residue Diet",
        "description": "A low-residue diet limits high-fiber foods to reduce the volume and frequency of bowel movements, often recommended for individuals with digestive disorders like Crohn's disease, ulcerative colitis, or diverticulitis. It involves consuming refined grains, lean proteins, cooked fruits and vegetables, and avoiding raw or fibrous foods."
    },
    {
        "name": "Fruitarian Diet",
        "description": "The fruitarian diet primarily consists of fruits, with some variations including nuts and seeds. It is based on the belief that consuming only foods that naturally fall from plants, such as fruits and nuts, promotes health and harmony with nature."
    },
    {
        "name": "Warrior Diet",
        "description": "The Warrior diet involves fasting during the day and consuming one large meal at night, mimicking the eating patterns of ancient warriors. It combines periods of undereating (fasting) with overeating (feasting) to promote fat loss, muscle growth, and metabolic health."
    },
    {
        "name": "Cabbage Soup Diet",
        "description": "The cabbage soup diet is a short-term weight loss plan that involves consuming large quantities of cabbage soup along with specific low-calorie foods over seven days. It is designed for rapid weight loss but lacks balanced nutrition and may lead to nutrient deficiencies and fatigue."
    },
    {
        "name": "Macrobiotic Diet",
        "description": "The macrobiotic diet is based on the principles of balance and harmony with nature. It emphasizes whole grains, vegetables, legumes, seaweed, fermented foods, and occasionally fish while avoiding processed foods, refined sugars, and animal products."
    },
    {
        "name": "Blood Type Diet",
        "description": "The blood type diet suggests that individuals should eat certain foods based on their blood type for optimal health and weight loss. It categorizes foods as beneficial, neutral, or harmful depending on blood type, with type O being encouraged to consume more protein-rich foods, type A focusing on plant-based diets, type B emphasizing a balanced diet, and type AB combining elements of types A and B."
    },
    {
        "name": "Detox Diet",
        "description": "A detox diet involves removing toxins from the body by consuming specific foods or liquids for a designated period. It typically includes fruits, vegetables, herbs, and water while excluding processed foods, caffeine, alcohol, and added sugars."
    },
    { 
        "name": "Plant-Based Diet",
        "description": "A plant-based diet focuses on consuming predominantly or exclusively plant-derived foods, such as fruits, vegetables, grains, legumes, nuts, and seeds. It may include small amounts of animal products but emphasizes plant foods for health and environmental reasons."
    },
    {
        "name": "Low-Glycemic Index Diet",
        "description": "The low-glycemic index diet emphasizes consuming foods that have a low glycemic index (GI) to help control blood sugar levels and promote weight loss. It includes foods like non-starchy vegetables, whole grains, lean proteins, and healthy fats while limiting high-GI foods like refined sugars and processed carbohydrates."
    },
]