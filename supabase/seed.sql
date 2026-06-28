-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  last_played DATE,
  games_played INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  total_answers INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Game sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mode TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  correct INTEGER DEFAULT 0,
  total INTEGER DEFAULT 0,
  duration_seconds INTEGER,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily scores table
CREATE TABLE IF NOT EXISTS daily_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_date DATE NOT NULL,
  score INTEGER DEFAULT 0,
  time_seconds INTEGER,
  UNIQUE(user_id, challenge_date)
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_scores ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Questions are viewable by everyone" ON questions FOR SELECT USING (true);

CREATE POLICY "Users can view all game sessions" ON game_sessions FOR SELECT USING (true);
CREATE POLICY "Users can insert own sessions" ON game_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all daily scores" ON daily_scores FOR SELECT USING (true);
CREATE POLICY "Users can insert own daily scores" ON daily_scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own daily scores" ON daily_scores FOR UPDATE USING (auth.uid() = user_id);

-- Seed Biology Questions (10 per topic = 60 high-quality questions covering Cell Bio, Genetics, Ecology, Anatomy, Evolution, Microbiology)
TRUNCATE TABLE questions;

INSERT INTO questions (topic, difficulty, question, options, correct_answer, explanation) VALUES
-- Cell Biology
('cell_biology', 'easy', 'What organelle is known as the powerhouse of the cell?', '["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"]', 1, 'Mitochondria generate most of the cell''s supply of ATP (adenosine triphosphate), used as a source of chemical energy.'),
('cell_biology', 'easy', 'Which of the following is responsible for protein synthesis in cells?', '["Lysosome", "Vacuole", "Ribosome", "Endoplasmic Reticulum"]', 2, 'Ribosomes are macromolecular machines found within all living cells that perform biological protein synthesis.'),
('cell_biology', 'medium', 'What is the primary function of the lysosome?', '["Photosynthesis", "Intracellular digestion and waste removal", "Lipid synthesis", "Cell division"]', 1, 'Lysosomes contain acid hydrolase enzymes that break down waste materials and cellular debris.'),
('cell_biology', 'medium', 'Which cell junction prevents fluids from passing between epithelial cells?', '["Gap junctions", "Desmosomes", "Tight junctions", "Plasmodesmata"]', 2, 'Tight junctions form a water-tight seal between cells, preventing leakage of extracellular fluid.'),
('cell_biology', 'hard', 'During which phase of mitosis do sister chromatids separate to opposite poles?', '["Prophase", "Metaphase", "Anaphase", "Telophase"]', 2, 'In anaphase, the sister chromatids are separated and pulled by spindle fibers to opposite ends of the cell.'),
('cell_biology', 'hard', 'Which protein complex connects spindle fibers to the chromosome centromere?', '["Kinetochore", "Centrosome", "Telomere", "Histone"]', 0, 'The kinetochore is a transient protein structure assembled on the centromere where spindle microtubules attach.'),
('cell_biology', 'easy', 'What carbohydrate is the primary structural component of plant cell walls?', '["Starch", "Glycogen", "Cellulose", "Chitin"]', 2, 'Cellulose is a polysaccharide consisting of a linear chain of glucose units, providing structural strength to plant cell walls.'),
('cell_biology', 'medium', 'Which organelle modifies, sorts, and packages proteins received from the ER?', '["Mitochondria", "Golgi apparatus", "Lysosome", "Peroxisome"]', 1, 'The Golgi apparatus acts as the cell''s post office, processing and packaging proteins for secretional release or internal use.'),
('cell_biology', 'hard', 'What molecule acts as the primary electron donor in the light-dependent reactions of photosynthesis?', '["CO2", "NADH", "H2O", "O2"]', 2, 'Water molecules are split during photolysis, donating electrons to Photosystem II and releasing oxygen as a byproduct.'),
('cell_biology', 'medium', 'Which phase of the cell cycle involves replication of DNA?', '["G1 phase", "S phase", "G2 phase", "M phase"]', 1, 'The S phase (Synthesis phase) is the part of the cell cycle in which DNA is replicated.'),

-- Genetics
('genetics', 'easy', 'What is the physical structure that carries genetic information in the cell nucleus?', '["Protein", "Lipid", "Chromosome", "Ribosome"]', 2, 'Chromosomes are thread-like structures located inside the nucleus of animal and plant cells, made of DNA and proteins.'),
('genetics', 'easy', 'What is the shape of the DNA molecule described by Watson and Crick?', '["Single helix", "Triple helix", "Double helix", "Circular loop"]', 2, 'DNA consists of two strands that wind around each other like a twisted ladder, known as a double helix.'),
('genetics', 'medium', 'If a plant with red flowers (RR) is crossed with a plant with white flowers (rr), what flower color will the F1 generation display under complete dominance?', '["All white", "All pink", "All red", "Half red, half white"]', 2, 'Red is dominant (R) and white is recessive (r). All offspring will be heterozygous (Rr) and show red flowers.'),
('genetics', 'medium', 'Which enzyme is responsible for unwinding the DNA double helix during replication?', '["DNA Polymerase", "DNA Ligase", "Helicase", "RNA Primase"]', 2, 'Helicase unwinds the double-stranded DNA by breaking hydrogen bonds between the bases, creating the replication fork.'),
('genetics', 'hard', 'What term describes the expression of both alleles fully in a heterozygous individual, such as AB blood type?', '["Codominance", "Incomplete dominance", "Epistasis", "Pleiotropy"]', 0, 'Codominance occurs when both alleles for a gene are fully expressed in the phenotype, neither masking the other.'),
('genetics', 'hard', 'What is the start codon sequence in mRNA translation?', '["UAA", "AUG", "UAG", "UGA"]', 1, 'AUG is the universal start codon, which also codes for the amino acid methionine.'),
('genetics', 'easy', 'Who is considered the father of modern genetics for his work with pea plants?', '["Charles Darwin", "Gregor Mendel", "Louis Pasteur", "Alexander Fleming"]', 1, 'Gregor Mendel discovered the fundamental laws of inheritance through his systematic cross-breeding of pea plants.'),
('genetics', 'medium', 'A mutation that results in a premature stop codon is known as what type of mutation?', '["Silent mutation", "Missense mutation", "Nonsense mutation", "Frameshift mutation"]', 2, 'A nonsense mutation changes a codon specifying an amino acid into a termination (stop) codon, truncating the protein.'),
('genetics', 'hard', 'Which law states that alleles for different traits assort independently of one another during gamete formation?', '["Law of Segregation", "Law of Independent Assortment", "Law of Dominance", "Hardy-Weinberg Law"]', 1, 'Mendel''s Law of Independent Assortment states that genes for different traits separate independently during meiosis.'),
('genetics', 'medium', 'Which nucleotide base is found in RNA but NOT in DNA?', '["Thymine", "Uracil", "Adenine", "Cytosine"]', 1, 'Uracil replaces thymine in RNA, pairing with adenine during transcription.'),

-- Ecology
('ecology', 'easy', 'Which trophic level consists of organisms that produce their own food using sunlight?', '["Primary consumers", "Secondary consumers", "Decomposers", "Primary producers"]', 3, 'Primary producers (autotrophs) convert light energy into chemical energy through photosynthesis.'),
('ecology', 'easy', 'What term refers to all the living organisms in a given area interacting with their non-living environment?', '["Community", "Population", "Ecosystem", "Biosphere"]', 2, 'An ecosystem includes all biotic (living) components and abiotic (non-living) components in a defined area.'),
('ecology', 'medium', 'What is the term for a species that has a disproportionately large effect on its natural environment relative to its abundance?', '["Indicator species", "Keystone species", "Invasive species", "Pioneer species"]', 1, 'Keystone species play a critical role in maintaining the structure and balance of an ecological community.'),
('ecology', 'medium', 'What type of symbiotic relationship benefits one organism while the other is unaffected?', '["Mutualism", "Parasitism", "Commensalism", "Competition"]', 2, 'Commensalism is an interaction where one species benefits and the other experiences no significant benefit or harm.'),
('ecology', 'hard', 'Which ecological principle states that two species competing for the exact same resources cannot stably coexist?', '["Competitive Exclusion Principle", "Biogeographical Principle", "Ten Percent Law", "Bergmann''s Rule"]', 0, 'Also known as Gause''s law, it states that complete competitors cannot coexist; one will eventually outcompete the other.'),
('ecology', 'hard', 'In the nitrogen cycle, which process converts ammonia (NH3) into nitrates (NO3-)?', '["Nitrogen fixation", "Nitrification", "Denitrification", "Assimilation"]', 1, 'Nitrification is the biological oxidation of ammonia to nitrite, followed by the oxidation of nitrite to nitrate.'),
('ecology', 'easy', 'What is the main driver of the greenhouse effect on Earth?', '["Solar flares", "Tectonic activity", "Greenhouse gas emissions trapping heat", "Deforestation alone"]', 2, 'Greenhouse gases like CO2, methane, and water vapor absorb infrared radiation and warm the atmosphere.'),
('ecology', 'medium', 'What term describes the maximum population size that an environment can sustain indefinitely?', '["Growth limit", "Carrying capacity", "Saturation point", "Niche limit"]', 1, 'Carrying capacity is the maximum population size of a biological species that can be sustained by that environment.'),
('ecology', 'hard', 'Which index is commonly used to measure biodiversity by taking into account both species richness and evenness?', '["Hardy index", "Simpson''s Diversity Index", "Richness Ratio", "Keystone Index"]', 1, 'Simpson''s Diversity Index measures probability that two individuals randomly selected from a sample will belong to different species.'),
('ecology', 'medium', 'What is the primary succession''s first colonizing organism class called?', '["Climax species", "Pioneer species", "Apex species", "Secondary species"]', 1, 'Pioneer species (like lichens and mosses) are the first to colonize bare rock or barren land.'),

-- Human Anatomy
('anatomy', 'easy', 'Which organ is responsible for pumping blood throughout the human body?', '["Brain", "Lungs", "Heart", "Kidneys"]', 2, 'The heart is a muscular organ that pumps oxygenated blood through the circulatory system to all body tissues.'),
('anatomy', 'easy', 'What is the largest organ of the human body?', '["Liver", "Skin", "Brain", "Large intestine"]', 1, 'The skin (integumentary system) is the largest organ by surface area and weight.'),
('anatomy', 'medium', 'Which part of the brain is primarily responsible for balance, coordination, and posture?', '["Cerebrum", "Brainstem", "Cerebellum", "Thalamus"]', 2, 'The cerebellum (little brain) coordinates voluntary movements, balance, and motor learning.'),
('anatomy', 'medium', 'What is the functional unit of the human kidney responsible for filtration?', '["Neuron", "Nephron", "Alveolus", "Lobule"]', 1, 'Nephrons filter blood, reabsorb essential nutrients, and produce urine in the kidneys.'),
('anatomy', 'hard', 'Which hormone is secreted by the alpha cells of the pancreas to raise blood glucose levels?', '["Insulin", "Glucagon", "Somatostatin", "Cortisol"]', 1, 'Glucagon stimulates the liver to convert stored glycogen into glucose, raising blood sugar levels.'),
('anatomy', 'hard', 'What is the name of the valve located between the left atrium and left ventricle of the heart?', '["Tricuspid valve", "Bicuspid (Mitral) valve", "Pulmonary valve", "Aortic valve"]', 1, 'The bicuspid or mitral valve prevents backflow of blood from the left ventricle into the left atrium.'),
('anatomy', 'easy', 'How many bones are in the average adult human skeleton?', '["106", "206", "306", "406"]', 1, 'Adult humans have 206 bones, while infants are born with around 270 bones which fuse over time.'),
('anatomy', 'medium', 'Which chemical substance is responsible for oxygen transport in human red blood cells?', '["Myoglobin", "Hemoglobin", "Chlorophyll", "Albumin"]', 1, 'Hemoglobin is an iron-rich protein that binds oxygen in the lungs and carries it to the rest of the body.'),
('anatomy', 'hard', 'Which cranial nerve is primarily responsible for transmitting visual information from the eye to the brain?', '["Olfactory nerve (CN I)", "Optic nerve (CN II)", "Oculomotor nerve (CN III)", "Trigeminal nerve (CN V)"]', 1, 'The optic nerve (Cranial Nerve II) is sensory and transmits electrical impulses from the retina to the visual cortex.'),
('anatomy', 'medium', 'Where does the majority of nutrient absorption take place in the human digestive system?', '["Stomach", "Small intestine", "Large intestine", "Esophagus"]', 1, 'The small intestine is highly adapted for absorption due to its immense surface area lined with villi and microvilli.'),

-- Evolution
('evolution', 'easy', 'Who published the landmark book "On the Origin of Species" in 1859?', '["Gregor Mendel", "Jean-Baptiste Lamarck", "Charles Darwin", "Alfred Russel Wallace"]', 2, 'Charles Darwin proposed the theory of evolution by natural selection in his famous book.'),
('evolution', 'easy', 'What term describes a trait that helps an organism survive and reproduce in its environment?', '["Mutation", "Adaptation", "Speciation", "Variation"]', 1, 'An adaptation is a physical or behavioral characteristic that evolved through natural selection to improve survival chances.'),
('evolution', 'medium', 'Which evolutionary process refers to the random changes in allele frequencies within a population over generations?', '["Natural selection", "Genetic drift", "Gene flow", "Non-random mating"]', 1, 'Genetic drift is a mechanism of evolution due to random chance, having a larger impact in smaller populations.'),
('evolution', 'medium', 'What type of structures share a common evolutionary origin but may perform different functions (e.g., human arm and bat wing)?', '["Analogous structures", "Homologous structures", "Vestigial structures", "Rudimentary structures"]', 1, 'Homologous structures point to shared ancestry, showing structural similarities adapted for different lifestyles.'),
('evolution', 'hard', 'Which concept states that evolutionary change occurs in rapid bursts separated by long periods of stability?', '["Phaletic gradualism", "Punctuated equilibrium", "Adaptive radiation", "Orthogenesis"]', 1, 'Punctuated equilibrium was proposed by Niles Eldredge and Stephen Jay Gould to explain gaps in the fossil record.'),
('evolution', 'hard', 'What formula calculates the allele and genotype frequencies in a non-evolving population?', '["Mendelian Ratio", "Hardy-Weinberg Equation", "Darwinian Coefficient", "Fibonacci Sequence"]', 1, 'The Hardy-Weinberg equation (p^2 + 2pq + q^2 = 1) describes genetic equilibrium under ideal conditions.'),
('evolution', 'easy', 'What is the primary source of new genetic variation in a population?', '["Natural selection", "Mitosis", "Mutation", "Acquired characteristics"]', 2, 'Mutations are random changes in the DNA sequence that create new alleles, driving genetic diversity.'),
('evolution', 'medium', 'What term defines the evolution of similar traits in unrelated species due to similar environmental pressures (e.g., shark and dolphin body shape)?', '["Divergent evolution", "Convergent evolution", "Coevolution", "Parallel evolution"]', 1, 'Convergent evolution leads to analogous structures that perform similar functions but do not share common ancestry.'),
('evolution', 'hard', 'Which speciation type occurs when a population is split geographically by a physical barrier?', '["Sympatric speciation", "Allopatric speciation", "Parapatric speciation", "Peripatric speciation"]', 1, 'Allopatric speciation occurs when geographic isolation prevents gene flow, leading to independent evolution.'),
('evolution', 'medium', 'What is a vestigial structure in biological evolution?', '["A structure essential for survival", "A newly evolved complex organ", "A structure that has lost its original ancestral function", "A structure shared between all vertebrates"]', 2, 'Vestigial structures (like the human appendix or whale pelvic bones) are remnants of organs that were functional in ancestors.'),

-- Microbiology
('microbiology', 'easy', 'Which type of microorganism lacks a membrane-bound nucleus?', '["Fungus", "Protozoan", "Bacterium", "Alga"]', 2, 'Bacteria are prokaryotes, meaning they do not possess a true nucleus or membrane-bound organelles.'),
('microbiology', 'easy', 'What discovery by Alexander Fleming in 1928 revolutionized the treatment of bacterial infections?', '["Vaccines", "Penicillin", "Polio cure", "Antiseptics"]', 1, 'Fleming discovered penicillin, the world''s first broad-spectrum antibiotic, produced by Penicillium mold.'),
('microbiology', 'medium', 'What is the protective protein coat surrounding a virus''s genetic material called?', '["Capsid", "Envelope", "Cell wall", "Peptidoglycan"]', 0, 'A capsid is the protein shell of a virus, enclosing its genetic material (DNA or RNA).'),
('microbiology', 'medium', 'Which bacterial structure allows them to survive extreme conditions like boiling heat or radiation?', '["Flagellum", "Pilus", "Endospore", "Capsule"]', 2, 'Endospores are dormant, tough, and non-reproductive structures produced by certain bacteria to endure extreme stress.'),
('microbiology', 'hard', 'What material forms the primary mesh-like structural component of bacterial cell walls?', '["Chitin", "Peptidoglycan", "Cellulose", "Pseudomurein"]', 1, 'Peptidoglycan (murein) consists of sugars and amino acids, forming a rigid layer outside the plasma membrane.'),
('microbiology', 'hard', 'Which infectious agent is composed entirely of misfolded protein molecules, containing no nucleic acids?', '["Viroid", "Prion", "Bacteriophage", "Retrovirus"]', 1, 'Prions cause transmissible spongiform encephalopathies (like Mad Cow Disease) by inducing normal proteins to misfold.'),
('microbiology', 'easy', 'What process uses microbes to clean up polluted environments, such as oil spills?', '["Fermentation", "Bioremediation", "Pasteurization", "Sterilization"]', 1, 'Bioremediation is the use of organisms (usually bacteria/fungi) to break down environmental pollutants.'),
('microbiology', 'medium', 'What organelle is NOT present in fungal cells?', '["Nucleus", "Mitochondria", "Chloroplast", "Cell wall"]', 2, 'Fungi are heterotrophic and do not contain chloroplasts; they obtain nutrients by absorption.'),
('microbiology', 'hard', 'Which bacterial staining technique classifies cells into two groups based on cell wall thickness?', '["Acid-fast stain", "Gram stain", "Endospore stain", "Flagellar stain"]', 1, 'The Gram stain differentiates between Gram-positive (thick peptidoglycan) and Gram-negative (thin peptidoglycan + outer membrane) bacteria.'),
('microbiology', 'medium', 'What type of organism causes malaria in humans?', '["A virus", "A bacterium", "A protozoan (Plasmodium)", "A fungus"]', 2, 'Malaria is caused by single-celled protozoan parasites of the genus Plasmodium, transmitted by Anopheles mosquitoes.');
