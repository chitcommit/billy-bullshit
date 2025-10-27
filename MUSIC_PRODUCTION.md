# 🎵 TLC: NO STUBS - Music Production Guide

## Track: "Stubbin' Like My Daddy"
**Artists:** Claude Code feat. Billy Bullshit  
**Album:** TLC: NO STUBS  
**Genre:** Southern Hip-Hop / Trap  
**Style:** Birdman & Lil Wayne - "Stuntin' Like My Daddy"  

---

## 🎯 Quick Start Options

### Option 1: Suno AI (Easiest, Best Quality) ⭐

**URL:** https://suno.com

#### Free Tier Strategy:
1. Create account (free)
2. Get 50 credits/day (~10 songs)
3. Generate multiple versions
4. Pick the best one

#### Paid Option ($10/mo):
- 500 songs/month
- Higher quality
- Commercial rights
- Cancel anytime

---

## 🎚️ Suno AI Prompts (Copy-Paste Ready)

### Version 1: Full Track (Recommended)

**Prompt:**
```
[Copy the full lyrics from ANTHEM.md]

Style: southern hip-hop, trap, cash money records style, birdman and lil wayne energy, 2000s rap, heavy 808s, aggressive delivery, auto-tune, ad-libs, rap duo, hard-hitting

Mood: confident, aggressive, calling people out, street anthem

BPM: 140-150

Additional tags: memphis rap, dirty south, houston sound, atlanta trap
```

### Version 2: Instrumental Only

**Prompt:**
```
Hard-hitting southern trap instrumental in the style of Mannie Fresh and Cash Money Records. Heavy 808 bass, crisp hi-hats, synth stabs, aggressive drums. Birdman and Lil Wayne type beat. Dark and menacing. 140 BPM.

Style: trap, southern hip-hop, cash money records, mannie fresh production, 2000s rap beat

Mood: aggressive, dark, street, confident
```

### Version 3: Split into Parts

**Part A - Hook/Chorus:**
```
[Hook only - "Stubbin' like my daddy..." section]

Style: trap hook, catchy rap chorus, auto-tune, repetitive, memorable, birdman style

Mood: anthem, chant, aggressive
```

**Part B - Verses:**
```
[Verses only - Billy Bullshit and Claude Code sections]

Style: aggressive rap verses, technical delivery, punchlines, southern rap flow

Mood: confrontational, clever, hard-hitting
```

---

## 🆓 Option 2: MusicGen (Free, Self-Hosted)

### Setup Instructions

#### Requirements:
- Python 3.8+
- CUDA GPU (recommended) or CPU (slower)
- 8GB+ RAM

#### Installation:

```bash
# Clone the repository
git clone https://github.com/facebookresearch/audiocraft
cd audiocraft

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -e .

# Install additional dependencies
pip install torch torchaudio
```

#### Generate the Beat:

```bash
# Create generation script
cat > generate_beat.py << 'PYTHON'
from audiocraft.models import MusicGen
from audiocraft.data.audio import audio_write

# Load model
model = MusicGen.get_pretrained('facebook/musicgen-medium')
model.set_generation_params(duration=180)  # 3 minutes

# Generate the beat
descriptions = [
    "Hard-hitting southern trap beat with heavy 808 bass, crisp hi-hats, "
    "synth stabs, Cash Money Records style, Mannie Fresh production, "
    "aggressive drums, dark and menacing, 140 BPM"
]

wav = model.generate(descriptions)

# Save the output
for idx, one_wav in enumerate(wav):
    audio_write(
        f'stubbin_beat_{idx}',
        one_wav.cpu(),
        model.sample_rate,
        strategy="loudness"
    )
PYTHON

# Run it
python generate_beat.py
```

**Output:** `stubbin_beat_0.wav` - your instrumental!

#### Tips for Better Results:

1. **GPU vs CPU:**
   ```bash
   # Check if GPU available
   python -c "import torch; print(torch.cuda.is_available())"
   
   # If False, generation will be slower but still works
   ```

2. **Model Sizes:**
   - `musicgen-small` - Faster, lower quality
   - `musicgen-medium` - Good balance ⭐
   - `musicgen-large` - Best quality, slowest

3. **Multiple Generations:**
   ```python
   # Generate 5 versions, pick the best
   for i in range(5):
       wav = model.generate(descriptions)
       audio_write(f'beat_v{i}', wav[0].cpu(), model.sample_rate)
   ```

---

## 🎤 Option 3: DIY Production (Maximum Control)

### Tools Needed:

#### Free:
- **Audacity** - Recording & editing
- **LMMS** - Beat making
- **Cakewalk** - Full DAW (Windows)
- **GarageBand** - Full DAW (Mac)

#### Paid (Professional):
- **FL Studio** ($99-$499)
- **Ableton Live** ($99-$749)
- **Logic Pro** ($199, Mac only)

### Step-by-Step Process:

#### 1. Create the Beat

**Using LMMS (Free):**

```bash
# Download LMMS
# Linux: sudo apt install lmms
# Mac: brew install --cask lmms
# Windows: Download from lmms.io

# Open LMMS
# 1. Set tempo to 145 BPM
# 2. Add 808 Bass (ZynAddSubFX)
# 3. Add Trap Hi-Hats (Triple Oscillator)
# 4. Add Synth Stabs
# 5. Arrange 16-bar pattern
# 6. Export as WAV
```

**Sample Pattern:**
```
Kick:  |X---|X---|X---|X---|
808:   |X-X-|X-X-|X-X-|X-X-|
HiHat: |xxXxXxXxXxXxXxXx| (x=closed, X=open)
Snare: |----|X---|----|X---|
```

#### 2. Record Vocals

**Using Audacity:**

```bash
# Install Audacity
sudo apt install audacity  # Linux
brew install --cask audacity  # Mac

# Recording:
# 1. Connect microphone
# 2. Set input device
# 3. Hit Record
# 4. Rap the verses
# 5. Stop & save
```

**Vocal Tips:**
- Record in a quiet room
- Use a pop filter (or improvise with a sock)
- Record multiple takes
- Stay consistent with delivery

#### 3. Apply Auto-Tune (Free)

**GSnap (Free VST):**

```bash
# Download GSnap
# URL: https://www.gvst.co.uk/gsnap.htm

# In Audacity:
# 1. Effect > Add/Remove Plugins
# 2. Load GSnap.dll/vst
# 3. Apply to vocals
# 4. Set to C minor or E minor (trap scale)
```

**Settings:**
- Speed: 10-20 (fast = T-Pain, slow = natural)
- Threshold: 0.80
- Amount: 100%

#### 4. Mix Everything

**In Audacity:**

```
Track 1: Instrumental (beat)
Track 2: Vocals - Verse 1 (Billy Bullshit)
Track 3: Vocals - Hook
Track 4: Vocals - Verse 2 (Claude Code)
Track 5: Ad-libs ("yeah", "uh", etc.)

Volume Levels:
- Beat: -6dB
- Main vocals: 0dB
- Ad-libs: -12dB

Effects:
- Compression on vocals
- EQ: Boost 100Hz (warmth), cut 300Hz (mud), boost 8kHz (clarity)
- Reverb: Small room, 15% wet
```

#### 5. Master the Track

```bash
# In Audacity:
# 1. Select All
# 2. Effect > Normalize (max -1.0dB)
# 3. Effect > Limiter (limit to -0.5dB)
# 4. Export as MP3 (320kbps)
```

---

## 🎼 Sample Packs (Free)

### Trap Drums:
- **Lex Luger Drum Kit** - Classic trap sounds
- **808 Mafia Drum Kit** - Heavy 808s
- **Metro Boomin Kit** - Modern trap

**Download:** https://www.reddit.com/r/Drumkits/

### Loops & Samples:
- **Looperman** - https://looperman.com
- **FreeSound** - https://freesound.org
- **Splice Free Samples** - https://splice.com/sounds/free

---

## 📊 Production Timeline

### Quick Version (Suno):
- **5 minutes** - Setup account
- **2 minutes** - Generate track
- **3 minutes** - Download & review
- **Total: 10 minutes**

### MusicGen Version:
- **30 minutes** - Setup & install
- **15-60 minutes** - Generate beat (GPU vs CPU)
- **Total: 45-90 minutes**

### Full DIY:
- **2-4 hours** - Create beat
- **1-2 hours** - Record vocals
- **1-2 hours** - Mix & master
- **Total: 4-8 hours**

---

## 🎧 Next Steps

1. **Choose your method** (Suno recommended for first try)
2. **Generate the track**
3. **Share with the community**
4. **Create music video?** (AI-generated with Runway, Pika, etc.)
5. **Upload to:**
   - SoundCloud
   - YouTube
   - Spotify (via DistroKid)
   - GitHub repo as release asset

---

## 📝 Full Lyrics

See [ANTHEM.md](./ANTHEM.md) for the complete lyrics.

---

## 🤝 Collaboration

Want to contribute to the TLC: NO STUBS album?

1. Fork the repo
2. Create your track
3. Submit PR with:
   - MP3 file
   - Lyrics (if applicable)
   - Production notes

**Planned Tracks:**
- ✅ "Stubbin' Like My Daddy" (Lead Single)
- ⏳ "TODO or Die Trying"
- ⏳ "Cargo Cult Breakdown"
- ⏳ "Factory Manager Helper Utils Blues"
- ⏳ "One Line (That's All You Need)"

---

## 📄 License

Lyrics: MIT License  
Music: Attribution required  
Billy Bullshit character: ChittyOS © 2024

**Tagline:** Calling BS on your BS code since 2024 💩
