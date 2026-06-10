import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Bookmark,
  Camera,
  Check,
  CheckCircle2,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  Flame,
  Home,
  ImagePlus,
  MapPin,
  Mic,
  Pause,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldAlert,
  Sparkles,
  Tag,
  Timer,
  TrendingDown,
  TrendingUp,
  User,
  Utensils,
  Volume2,
  X,
  Zap,
} from "lucide-react-native";
import {
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
  InstrumentSans_600SemiBold,
  InstrumentSans_700Bold,
  useFonts as useSansFonts,
} from "@expo-google-fonts/instrument-sans";
import {
  InstrumentSerif_400Regular,
  InstrumentSerif_400Regular_Italic,
  useFonts as useSerifFonts,
} from "@expo-google-fonts/instrument-serif";

type Screen =
  | "onboarding"
  | "home"
  | "setup"
  | "recipe"
  | "live"
  | "feedback"
  | "savings"
  | "profile";

type Nav = (screen: Screen) => void;

type IconType = React.ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>;

type CapturedShot = {
  id: string;
  uri: string;
  label: string;
};

const colors = {
  canvas: "#fcfaf7",
  earth950: "#332b25",
  earth900: "#443a32",
  earth800: "#5e534b",
  earth600: "#8a8177",
  earth400: "#bdb7ae",
  earth200: "#e7e1d8",
  earth100: "#f4eee6",
  white: "#ffffff",
  warm: "#c66a2b",
  warmSoft: "#faeadb",
  leaf: "#3f8a63",
  leafSoft: "#e9f4ed",
};

const pantry = [
  { name: "Eggs", emoji: "🥚" },
  { name: "Pasta", emoji: "🍝" },
  { name: "Garlic", emoji: "🧄" },
  { name: "Olive oil", emoji: "🫒" },
  { name: "Onion", emoji: "🧅" },
  { name: "Butter", emoji: "🧈" },
  { name: "Tomato", emoji: "🍅" },
  { name: "Lemon", emoji: "🍋" },
  { name: "Rice", emoji: "🍚" },
  { name: "Spinach", emoji: "🥬" },
  { name: "Parmesan", emoji: "🧀" },
  { name: "Chili flakes", emoji: "🌶️" },
];

const tools = ["Skillet", "Pot", "Sheet pan", "Chef's knife", "Wood spoon"];

const labelCycle = ["Fridge", "Pantry", "Counter", "Spice rack", "Freezer"];

export default function App() {
  const [screen, setScreen] = useState<Screen>("onboarding");
  const [shots, setShots] = useState<CapturedShot[]>([]);
  const [sansLoaded] = useSansFonts({
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
    InstrumentSans_600SemiBold,
    InstrumentSans_700Bold,
  });
  const [serifLoaded] = useSerifFonts({
    InstrumentSerif_400Regular,
    InstrumentSerif_400Regular_Italic,
  });

  if (!sansLoaded || !serifLoaded) {
    return <View style={styles.loading} />;
  }

  return (
    <>
      <StatusBar style={screen === "live" ? "light" : "dark"} />
      {screen === "onboarding" && <OnboardingScreen nav={setScreen} />}
      {screen === "home" && <HomeScreen nav={setScreen} />}
      {screen === "setup" && (
        <SetupScreen nav={setScreen} shots={shots} setShots={setShots} />
      )}
      {screen === "recipe" && <RecipeScreen nav={setScreen} />}
      {screen === "live" && <LiveScreen nav={setScreen} />}
      {screen === "feedback" && <FeedbackScreen nav={setScreen} />}
      {screen === "savings" && <SavingsScreen nav={setScreen} />}
      {screen === "profile" && <ProfileScreen nav={setScreen} />}
    </>
  );
}

function Shell({
  children,
  nav,
  active,
  hideNav,
  bleed,
}: {
  children: React.ReactNode;
  nav: Nav;
  active: Screen;
  hideNav?: boolean;
  bleed?: boolean;
}) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.shell,
          bleed ? styles.shellBleed : null,
          hideNav ? styles.shellHideNav : null,
        ]}
      >
        {children}
      </ScrollView>
      {!hideNav && <BottomNav nav={nav} active={active} />}
    </SafeAreaView>
  );
}

function OnboardingScreen({ nav }: { nav: Nav }) {
  const steps = [
    {
      icon: Sparkles,
      title: "A coach for everyday skills.",
      body: "Remy helps you learn things hands-on - starting with cooking. Friendly guidance, never judgmental.",
    },
    {
      icon: Camera,
      title: "Watches with you, gently.",
      body: "Point your camera at the pan. Remy offers small nudges in the moment, then a calm recap afterwards.",
    },
    {
      icon: Timer,
      title: "Practical. Affordable. Yours.",
      body: "Get cheaper ingredient swaps, sale-aware ideas, and small wins that build real kitchen confidence.",
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.onboarding}>
        <Text style={styles.warmEyebrow}>Remy</Text>
        <Text style={[styles.serifHero, styles.mt12]}>
          A calm coach{"\n"}for the kitchen.
        </Text>
        <Text style={[styles.bodyText, styles.mt16]}>
          Real-time nudges while you cook, plus a warm recap when the plate is
          down.
        </Text>

        <View style={styles.stepList}>
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <View key={step.title} style={styles.infoCardRow}>
                <View style={styles.warmIconBox}>
                  <Icon size={20} color={colors.warm} strokeWidth={2} />
                </View>
                <View style={styles.flex1}>
                  <Text style={styles.cardTitle}>{step.title}</Text>
                  <Text style={styles.cardBody}>{step.body}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.pushBottom}>
          <PrimaryButton label="Let's cook" icon={ArrowRight} onPress={() => nav("home")} />
          <Text style={styles.smallCenter}>
            Suggestions are guidance, not gospel. You're the chef.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

function HomeScreen({ nav }: { nav: Nav }) {
  return (
    <Shell nav={nav} active="home">
      <Text style={styles.eyebrow}>Good afternoon, Alex</Text>
      <Text style={styles.serifTitle}>The kitchen{"\n"}is yours.</Text>

      <View style={[styles.softPanel, styles.mt28]}>
        <View style={styles.rowBetweenEnd}>
          <View>
            <Pill label="This week" icon={Sparkles} tone="leaf" />
            <Text style={styles.largeMetric}>4 of 10 skills</Text>
          </View>
          <Text style={styles.rightSmall}>
            Last:{"\n"}
            <Text style={styles.strong}>Knife skills</Text>
          </Text>
        </View>
        <Progress value={40} color={colors.leaf} style={styles.mt16} />
      </View>

      <SectionTitle title="Jump back in" style={styles.mt28} />
      <Pressable style={styles.sessionCard} onPress={() => nav("live")}>
        <View style={styles.foodTile}>
          <Text style={styles.emojiLarge}>🍅</Text>
        </View>
        <View style={styles.flex1}>
          <Text style={styles.cardTitle}>Slow-simmered marinara</Text>
          <View style={styles.inline}>
            <Timer size={12} color={colors.earth600} />
            <Text style={styles.tiny}>Step 3 of 8 - 12 min left</Text>
          </View>
        </View>
        <View style={styles.roundWarm}>
          <ArrowRight size={16} color={colors.white} />
        </View>
      </Pressable>

      <View style={styles.twoCol}>
        <Pressable style={styles.tileCard} onPress={() => nav("recipe")}>
          <View style={styles.smallFoodTile}>
            <Text style={styles.emojiMed}>🍳</Text>
          </View>
          <Text style={styles.tileTitle}>Saved: Crispy fried eggs</Text>
          <Text style={styles.tiny}>Beginner - 8 min</Text>
        </Pressable>
        <Pressable
          style={[styles.tileCard, styles.leafCard]}
          onPress={() => nav("savings")}
        >
          <View style={styles.smallWhiteTile}>
            <Text style={styles.emojiMed}>🥬</Text>
          </View>
          <Text style={styles.tileTitle}>Saved $14 on swaps</Text>
          <Text style={[styles.tiny, { color: colors.leaf }]}>3 new this week</Text>
        </Pressable>
      </View>

      <View style={styles.pushBottom}>
        <PrimaryButton
          label="Start a new session"
          icon={Flame}
          onPress={() => nav("setup")}
          dark
        />
        <Text style={styles.smallCenter}>
          We'll suggest a recipe based on what you have.
        </Text>
      </View>
    </Shell>
  );
}

function SetupScreen({
  nav,
  shots,
  setShots,
}: {
  nav: Nav;
  shots: CapturedShot[];
  setShots: (shots: CapturedShot[]) => void;
}) {
  const [selected, setSelected] = useState(
    new Set(["Pasta", "Garlic", "Olive oil", "Parmesan", "Chili flakes"]),
  );
  const [cameraOpen, setCameraOpen] = useState(false);

  const toggle = (name: string) => {
    const next = new Set(selected);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    setSelected(next);
  };

  return (
    <Shell nav={nav} active="setup">
      <Text style={styles.eyebrow}>Step 1 of 2</Text>
      <Text style={styles.serifTitle}>What do you{"\n"}have on hand?</Text>
      <Text style={[styles.bodyText, styles.mt8]}>
        Snap your fridge, or tap anything you've got - even loosely.
      </Text>

      <Pressable style={styles.scanCard} onPress={() => setCameraOpen(true)}>
        <View style={styles.rowTop}>
          <View style={styles.warmSolidBox}>
            <Camera size={20} color={colors.white} />
          </View>
          <View style={styles.flex1}>
            <Text style={styles.scanEyebrow}>Fastest way</Text>
            <Text style={styles.scanTitle}>Scan your fridge & pantry</Text>
            <Text style={styles.scanBody}>
              Snap a few photos - Remy figures out what you can cook.
            </Text>
          </View>
        </View>
        {shots.length > 0 && (
          <View style={styles.shotSummary}>
            <View style={styles.shotStack}>
              {shots.slice(0, 4).map((shot) => (
                <Image key={shot.id} source={{ uri: shot.uri }} style={styles.shotThumb} />
              ))}
            </View>
            <Text style={styles.scanBody}>
              <Text style={styles.whiteStrong}>
                {shots.length} photo{shots.length === 1 ? "" : "s"}
              </Text>{" "}
              attached - tap to add more
            </Text>
          </View>
        )}
      </Pressable>

      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>or build it by hand</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.searchBox}>
        <Search size={16} color={colors.earth600} />
        <TextInput
          placeholder="Search or add an ingredient"
          placeholderTextColor={colors.earth400}
          style={styles.searchInput}
        />
        <View style={styles.addButton}>
          <Plus size={16} color={colors.earth800} />
        </View>
      </View>

      {selected.size > 0 && (
        <View style={styles.mt20}>
          <SectionTitle title="In your basket" />
          <View style={styles.chipWrap}>
            {[...selected].map((name) => (
              <Pressable key={name} style={styles.darkChip} onPress={() => toggle(name)}>
                <Text style={styles.darkChipText}>{name}</Text>
                <X size={12} color={colors.canvas} />
              </Pressable>
            ))}
          </View>
        </View>
      )}

      <SectionTitle title="Common pantry" style={styles.mt24} />
      <View style={styles.pantryGrid}>
        {pantry.map((item) => {
          const active = selected.has(item.name);
          return (
            <Pressable
              key={item.name}
              style={[styles.pantryItem, active ? styles.pantryActive : null]}
              onPress={() => toggle(item.name)}
            >
              <Text style={styles.emojiMed}>{item.emoji}</Text>
              <Text style={[styles.pantryText, active ? styles.warmText : null]}>
                {item.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <SectionTitle title="Tools" style={styles.mt24} />
      <View style={styles.chipWrap}>
        {tools.map((tool) => (
          <View key={tool} style={styles.lightChip}>
            <Text style={styles.lightChipText}>{tool}</Text>
          </View>
        ))}
      </View>

      <View style={styles.pushBottom}>
        <PrimaryButton
          label="Suggest a recipe"
          icon={Sparkles}
          onPress={() => nav("recipe")}
          dark
        />
        <Text style={styles.smallCenter}>
          Remy will pick something doable with what you've shown it.
        </Text>
      </View>

      <KitchenCamera
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        shots={shots}
        setShots={setShots}
      />
    </Shell>
  );
}

function RecipeScreen({ nav }: { nav: Nav }) {
  return (
    <Shell nav={nav} active="setup" bleed>
      <View style={styles.recipeHero}>
        <LinearGradient
          colors={[colors.warmSoft, colors.earth100, colors.earth200]}
          style={StyleSheet.absoluteFill}
        />
        <Text style={styles.recipeEmoji}>🍝</Text>
        <IconButton icon={ArrowLeft} onPress={() => nav("setup")} style={styles.topLeft} />
        <View style={styles.suggested}>
          <Text style={styles.suggestedText}>Suggested</Text>
        </View>
      </View>

      <View style={styles.recipeBody}>
        <Text style={styles.serifSubTitle}>Pasta + 3 pantry items</Text>
        <Text style={[styles.bodyText, styles.mt8]}>
          A buttery, garlicky weeknight bowl. We'll focus on getting the garlic
          golden, not burnt.
        </Text>

        <View style={[styles.metaRow, styles.mt20]}>
          <Meta icon={Timer} label="Time" value="20 min" />
          <View style={styles.metaDivider} />
          <Meta icon={Flame} label="Level" value="Easy+" />
          <View style={styles.metaDivider} />
          <Meta icon={ChefHat} label="Skill" value="Saute" />
        </View>

        <SectionTitle title="The kit" style={styles.mt28} />
        <View style={styles.chipWrap}>
          {[
            "Dried rigatoni",
            "Salted butter",
            "Garlic, 3 cloves",
            "Olive oil",
            "Parmesan",
            "Chili flakes",
          ].map((item) => (
            <View key={item} style={styles.ingredientChip}>
              <Text style={styles.ingredientText}>{item}</Text>
            </View>
          ))}
        </View>

        <SectionTitle title="Tools you'll grab" style={styles.mt24} />
        <View style={styles.inline}>
          <Utensils size={16} color={colors.earth600} />
          <Text style={styles.bodyDark}>Pot - skillet - wooden spoon</Text>
        </View>

        <View style={[styles.coachNote, styles.mt24]}>
          <Text style={styles.warmEyebrow}>From your coach</Text>
          <Text style={styles.coachQuote}>
            "We'll watch the garlic together. Pull it the moment it smells nutty."
          </Text>
        </View>

        <View style={styles.mt32}>
          <PrimaryButton label="Enter live mode" onPress={() => nav("live")} warm />
          <Pressable style={styles.textButton}>
            <Text style={styles.textButtonText}>Save for later</Text>
          </Pressable>
        </View>
      </View>
    </Shell>
  );
}

function LiveScreen({ nav }: { nav: Nav }) {
  return (
    <SafeAreaView style={styles.liveSafe}>
      <View style={styles.liveViewport}>
        <FauxCamera />

        <View style={styles.liveTop}>
          <IconButton icon={ChevronLeft} dark onPress={() => nav("recipe")} />
          <View style={styles.liveCenter}>
            <View style={styles.livePill}>
              <Text style={styles.livePillText}>Step 4 of 12 - Saute the garlic</Text>
            </View>
            <View style={styles.dots}>
              {Array.from({ length: 12 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    i < 4 ? styles.dotWarm : i === 4 ? styles.dotActive : styles.dotMuted,
                  ]}
                />
              ))}
            </View>
          </View>
          <IconButton icon={X} dark onPress={() => nav("feedback")} />
        </View>

        <View style={styles.sideControls}>
          {[Mic, Volume2, Pause].map((Icon, index) => (
            <View key={index} style={styles.liveCircle}>
              <Icon size={16} color={colors.white} />
            </View>
          ))}
        </View>

        <View style={styles.liveBottom}>
          <View style={styles.coachBubble}>
            <View style={styles.pulseWrap}>
              <View style={styles.pulseDot} />
            </View>
            <View style={styles.flex1}>
              <Text style={styles.coachLabel}>Coach - live</Text>
              <Text style={styles.coachText}>
                Garlic is looking golden - ease the heat down a notch to keep it
                sweet.
              </Text>
            </View>
          </View>

          <View style={styles.guidanceCard}>
            <Text style={styles.eyebrow}>What's next</Text>
            <Text style={styles.guidanceTitle}>Add the reserved pasta water, slowly.</Text>
            <Text style={styles.cardBody}>
              Look for a thin glossy emulsion - not a soup. A few tablespoons at a
              time.
            </Text>
            <View style={styles.buttonRow}>
              <Pressable style={styles.backButton}>
                <Text style={styles.backButtonText}>Back</Text>
              </Pressable>
              <Pressable style={styles.nextButton}>
                <Text style={styles.nextButtonText}>I'm done - next</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function FeedbackScreen({ nav }: { nav: Nav }) {
  return (
    <Shell nav={nav} active="home">
      <View style={styles.center}>
        <View style={styles.leafRound}>
          <Check size={24} color={colors.leaf} strokeWidth={2.5} />
        </View>
        <Text style={styles.serifSubTitle}>Beautifully done.</Text>
        <Text style={[styles.bodyText, styles.centerText]}>
          That sauce had a real gloss to it. Your prep was faster, too - about 2
          minutes quicker than last week.
        </Text>
      </View>

      <View style={[styles.metaRowWhite, styles.mt24]}>
        <Stat label="Steps" value="12/12" />
        <View style={styles.metaDivider} />
        <Stat label="Focus" value="8m 40s" />
        <View style={styles.metaDivider} />
        <Stat label="Skill +" value="Saute" />
      </View>

      <View style={styles.twoCol}>
        <View style={[styles.feedbackCard, styles.leafCard]}>
          <Text style={styles.leafEyebrow}>Win</Text>
          <Text style={styles.cardTitle}>Heat management was steady through the sear.</Text>
        </View>
        <View style={[styles.feedbackCard, styles.warmCard]}>
          <Text style={styles.warmEyebrow}>To try</Text>
          <Text style={styles.cardTitle}>
            Slice garlic a touch thinner next time for even color.
          </Text>
        </View>
      </View>

      <View style={[styles.whitePanel, styles.mt20]}>
        <SectionTitle title="Things we noticed" />
        <Notice label="Skipped: salt the pasta water" color={colors.warm} />
        <Notice label="Uncertain: was the pan hot enough?" color={colors.earth400} />
        <Notice label="Nice touch: finished with olive oil" color={colors.leaf} />
      </View>

      <SectionTitle title="Tiny next steps" style={styles.mt20} />
      <ActionRow
        icon={Sparkles}
        title="5-min knife skills drill"
        meta="Tomorrow - builds on today"
        onPress={() => nav("setup")}
      />
      <ActionRow
        icon={TrendingUp}
        title="Track saute in your skill tree"
        meta="2 sessions to unlock 'Confident saute'"
        onPress={() => nav("profile")}
      />

      <View style={styles.pushBottom}>
        <PrimaryButton label="Back to home" onPress={() => nav("home")} dark />
      </View>
    </Shell>
  );
}

function SavingsScreen({ nav }: { nav: Nav }) {
  const swaps = [
    {
      from: "Pine nuts",
      to: "Toasted sunflower seeds",
      note: "Same nutty crunch in pesto.",
      save: "$4.80",
    },
    {
      from: "Heavy cream",
      to: "Whole milk + butter",
      note: "Works for most weeknight sauces.",
      save: "$2.10",
    },
    {
      from: "Fresh basil",
      to: "Frozen basil cubes",
      note: "Keeps for months, same flavor.",
      save: "$1.40",
    },
  ];

  return (
    <Shell nav={nav} active="savings">
      <Text style={styles.leafEyebrow}>Smart living</Text>
      <Text style={styles.serifSubTitle}>Cook well, spend less.</Text>
      <Text style={[styles.bodyText, styles.mt8]}>
        Honest swaps from your coach - no upsell, no spam.
      </Text>

      <View style={[styles.savingsSummary, styles.mt24]}>
        <View>
          <Text style={styles.leafEyebrow}>Saved this month</Text>
          <Text style={styles.moneyText}>$32.40</Text>
        </View>
        <View style={styles.whiteIconBox}>
          <TrendingDown size={24} color={colors.leaf} />
        </View>
      </View>

      <View style={[styles.rowBetweenEnd, styles.mt28]}>
        <SectionTitle title="Try these swaps" />
        <Text style={styles.warmSmall}>See all</Text>
      </View>
      {swaps.map((swap) => (
        <View key={swap.from} style={styles.swapCard}>
          <View style={styles.flex1}>
            <Text style={styles.swapLine}>
              <Text style={styles.strike}>{swap.from}</Text>{" "}
              <Text style={styles.strong}>{"->"} {swap.to}</Text>
            </Text>
            <Text style={styles.cardBody}>{swap.note}</Text>
          </View>
          <View style={styles.savePill}>
            <Text style={styles.saveText}>-{swap.save}</Text>
          </View>
        </View>
      ))}

      <SectionTitle title="On sale near you" style={styles.mt28} />
      <View style={styles.saleCard}>
        <View style={styles.inline}>
          <MapPin size={12} color={colors.warm} />
          <Text style={styles.warmEyebrow}>Market St - 2 blocks</Text>
        </View>
        <Text style={styles.saleTitle}>Organic tomatoes, $1.99/lb until Sunday.</Text>
        <Text style={styles.cardBody}>
          Perfect for the marinara you're mid-way through.
        </Text>
      </View>

      <SectionTitle title="Practical tips" style={styles.mt28} />
      {[
        {
          title: "Salt the pasta water, save the rest",
          body: "Reserved starchy water replaces extra cream or butter in most sauces.",
        },
        {
          title: "Day-old bread -> breadcrumbs",
          body: "Toast, blitz, freeze. Boxed crumbs cost 5x more per cup.",
        },
      ].map((tip) => (
        <View key={tip.title} style={styles.tipCard}>
          <View style={styles.smallEarthBox}>
            <Sparkles size={16} color={colors.earth800} />
          </View>
          <View style={styles.flex1}>
            <Text style={styles.cardTitle}>{tip.title}</Text>
            <Text style={styles.cardBody}>{tip.body}</Text>
          </View>
        </View>
      ))}
    </Shell>
  );
}

function ProfileScreen({ nav }: { nav: Nav }) {
  const skills = [
    { name: "Saute", level: 70 },
    { name: "Knife work", level: 50 },
    { name: "Roasting", level: 35 },
    { name: "Sauces", level: 20 },
  ];
  const saved = [
    { name: "Brown butter pasta", emoji: "🍝", meta: "20 min - Easy+" },
    { name: "Lemony roasted chicken", emoji: "🍗", meta: "55 min - Intermediate" },
    { name: "Tomato + bread soup", emoji: "🍅", meta: "30 min - Easy" },
  ];

  return (
    <Shell nav={nav} active="profile">
      <View style={styles.rowBetween}>
        <View style={styles.inlineWide}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
          </View>
          <View>
            <Text style={styles.eyebrow}>Home cook</Text>
            <Text style={styles.profileName}>Alex Rivera</Text>
          </View>
        </View>
        <View style={styles.circleWhite}>
          <Bell size={16} color={colors.earth800} />
        </View>
      </View>

      <View style={[styles.metaRow, styles.mt24]}>
        <Stat label="Sessions" value="14" />
        <View style={styles.metaDivider} />
        <Stat label="Streak" value="5 days" />
        <View style={styles.metaDivider} />
        <Stat label="Saved" value="$32" />
      </View>

      <View style={[styles.rowBetweenEnd, styles.mt28]}>
        <SectionTitle title="Your skill tree" />
        <View style={styles.inline}>
          <Sparkles size={12} color={colors.leaf} />
          <Text style={styles.leafSmall}>Growing</Text>
        </View>
      </View>
      <View style={styles.whitePanel}>
        {skills.map((skill) => (
          <View key={skill.name} style={styles.skillRow}>
            <View style={styles.rowBetween}>
              <Text style={styles.cardTitle}>{skill.name}</Text>
              <Text style={styles.tiny}>{skill.level}%</Text>
            </View>
            <Progress value={skill.level} color={colors.warm} style={styles.mt8} />
          </View>
        ))}
      </View>

      <View style={[styles.rowBetweenEnd, styles.mt28]}>
        <SectionTitle title="Saved recipes" />
        <Text style={styles.warmSmall}>Manage</Text>
      </View>
      {saved.map((recipe) => (
        <View key={recipe.name} style={styles.savedRow}>
          <View style={styles.savedEmoji}>
            <Text style={styles.emojiMed}>{recipe.emoji}</Text>
          </View>
          <View style={styles.flex1}>
            <Text style={styles.cardTitle}>{recipe.name}</Text>
            <Text style={styles.tiny}>{recipe.meta}</Text>
          </View>
          <Bookmark size={16} color={colors.earth600} />
        </View>
      ))}

      <SectionTitle title="Preferences" style={styles.mt28} />
      <View style={styles.prefBox}>
        <Pref label="Dietary preferences" value="No restrictions" />
        <Pref label="Kitchen confidence" value="Confident beginner" />
        <Pref label="Coach voice" value="Calm & warm" />
        <Pref label="Camera & mic" value="Always ask" />
      </View>

      <Pressable style={styles.settingsRow} onPress={() => nav("onboarding")}>
        <View style={styles.inlineWide}>
          <Settings size={16} color={colors.earth600} />
          <Text style={styles.cardTitle}>Settings & account</Text>
        </View>
        <ChevronRight size={16} color={colors.earth600} />
      </Pressable>

      <Text style={styles.smallCenter}>
        Remy learns gently. You can clear what it remembers anytime.
      </Text>
    </Shell>
  );
}

function KitchenCamera({
  open,
  onClose,
  shots,
  setShots,
}: {
  open: boolean;
  onClose: () => void;
  shots: CapturedShot[];
  setShots: (shots: CapturedShot[]) => void;
}) {
  const [error, setError] = useState<string | null>(null);

  const addAssets = (assets: ImagePicker.ImagePickerAsset[]) => {
    const next = assets.map((asset, index) => ({
      id: `${Date.now()}-${asset.assetId ?? index}`,
      uri: asset.uri,
      label: labelCycle[(shots.length + index) % labelCycle.length],
    }));
    setShots([...shots, ...next]);
  };

  const takePhoto = async () => {
    setError(null);
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setError("Camera is blocked");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.82,
      allowsEditing: false,
    });
    if (!result.canceled) addAssets(result.assets);
  };

  const uploadPhotos = async () => {
    setError(null);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError("Photo library is blocked");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.82,
    });
    if (!result.canceled) addAssets(result.assets);
  };

  return (
    <Modal visible={open} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.cameraSafe}>
        <View style={styles.cameraTop}>
          <IconButton icon={X} dark onPress={onClose} />
          <View style={styles.livePill}>
            <Text style={styles.livePillText}>Scan your kitchen</Text>
          </View>
          <View style={styles.iconButtonSpacer} />
        </View>

        <View style={styles.cameraViewport}>
          <FauxCamera />
          <View style={styles.permissionPanel}>
            <View style={styles.cameraIconLarge}>
              {error ? (
                <ShieldAlert size={28} color={colors.warm} />
              ) : (
                <Camera size={28} color={colors.warm} />
              )}
            </View>
            <Text style={styles.cameraTitle}>
              {error ? error : "Show Remy your kitchen"}
            </Text>
            <Text style={styles.cameraBody}>
              Snap a few photos - the fridge, the pantry, what's on the counter.
              Remy will piece together what you can cook.
            </Text>
            <View style={styles.cameraBullets}>
              <Bullet>Photos never leave your device until you tap Done.</Bullet>
              <Bullet>You can retake or remove any shot.</Bullet>
              <Bullet>Remy skips anything it isn't sure about.</Bullet>
            </View>
          </View>
        </View>

        {shots.length > 0 && (
          <View style={styles.cameraShots}>
            <View style={styles.rowBetween}>
              <Text style={styles.cameraShotTitle}>
                {shots.length} shot{shots.length === 1 ? "" : "s"} captured
              </Text>
              <Pressable onPress={() => setShots([])}>
                <Text style={styles.cameraClear}>Clear</Text>
              </Pressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {shots.map((shot) => (
                <View key={shot.id} style={styles.cameraThumbWrap}>
                  <Image source={{ uri: shot.uri }} style={styles.cameraThumb} />
                  <Text style={styles.cameraThumbLabel}>{shot.label}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.cameraControls}>
          <IconButton icon={ImagePlus} dark onPress={uploadPhotos} />
          <Pressable style={styles.shutter} onPress={takePhoto}>
            <View style={styles.shutterInner}>
              <Camera size={24} color={colors.earth950} />
            </View>
          </Pressable>
          <Pressable
            style={[styles.doneButton, shots.length === 0 ? styles.doneDisabled : null]}
            onPress={shots.length > 0 ? onClose : undefined}
          >
            <Text
              style={[
                styles.doneText,
                shots.length === 0 ? styles.doneTextDisabled : null,
              ]}
            >
              Done
            </Text>
            <CheckCircle2
              size={16}
              color={shots.length > 0 ? colors.white : "rgba(255,255,255,0.4)"}
            />
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function BottomNav({ nav, active }: { nav: Nav; active: Screen }) {
  const tabs = [
    { screen: "home" as const, label: "Home", icon: Home },
    { screen: "setup" as const, label: "Cook", icon: ChefHat },
    { screen: "savings" as const, label: "Savings", icon: Tag },
    { screen: "profile" as const, label: "Profile", icon: User },
  ];

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive =
          active === tab.screen ||
          (tab.screen === "setup" && (active === "recipe" || active === "live"));
        return (
          <Pressable
            key={tab.screen}
            style={styles.navItem}
            onPress={() => nav(tab.screen)}
          >
            <View style={[styles.navIcon, isActive ? styles.navIconActive : null]}>
              <Icon
                size={18}
                color={isActive ? colors.canvas : colors.earth600}
                strokeWidth={isActive ? 2.4 : 2}
              />
            </View>
            <Text style={[styles.navText, isActive ? styles.navTextActive : null]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function PrimaryButton({
  label,
  icon: Icon,
  onPress,
  dark,
  warm,
}: {
  label: string;
  icon?: IconType;
  onPress: () => void;
  dark?: boolean;
  warm?: boolean;
}) {
  const background = warm ? colors.warm : dark ? colors.earth950 : colors.earth950;
  return (
    <Pressable style={[styles.primaryButton, { backgroundColor: background }]} onPress={onPress}>
      <View style={styles.inline}>
        {Icon && <Icon size={16} color={colors.canvas} />}
        <Text style={styles.primaryText}>{label}</Text>
      </View>
    </Pressable>
  );
}

function IconButton({
  icon: Icon,
  onPress,
  dark,
  style,
}: {
  icon: IconType;
  onPress?: () => void;
  dark?: boolean;
  style?: object;
}) {
  return (
    <Pressable
      style={[dark ? styles.iconButtonDark : styles.iconButtonLight, style]}
      onPress={onPress}
    >
      <Icon size={16} color={dark ? colors.white : colors.earth950} />
    </Pressable>
  );
}

function SectionTitle({ title, style }: { title: string; style?: object }) {
  return <Text style={[styles.sectionTitle, style]}>{title}</Text>;
}

function Pill({
  label,
  icon: Icon,
  tone,
}: {
  label: string;
  icon?: IconType;
  tone: "leaf" | "warm";
}) {
  const color = tone === "leaf" ? colors.leaf : colors.warm;
  return (
    <View style={[styles.pill, { backgroundColor: tone === "leaf" ? colors.leafSoft : colors.warmSoft }]}>
      {Icon && <Icon size={12} color={color} />}
      <Text style={[styles.pillText, { color }]}>{label}</Text>
    </View>
  );
}

function Meta({ icon: Icon, label, value }: { icon: IconType; label: string; value: string }) {
  return (
    <View style={styles.metaCell}>
      <Icon size={16} color={colors.earth600} />
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaCell}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

function Notice({ label, color }: { label: string; color: string }) {
  return (
    <View style={styles.noticeRow}>
      <View style={[styles.noticeDot, { backgroundColor: color }]} />
      <Text style={styles.bodyDark}>{label}</Text>
    </View>
  );
}

function ActionRow({
  icon: Icon,
  title,
  meta,
  onPress,
}: {
  icon: IconType;
  title: string;
  meta: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.actionRow} onPress={onPress}>
      <View style={styles.smallEarthBox}>
        <Icon size={16} color={colors.earth800} />
      </View>
      <View style={styles.flex1}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.tiny}>{meta}</Text>
      </View>
      <ArrowRight size={16} color={colors.earth600} />
    </Pressable>
  );
}

function Pref({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.prefRow}>
      <Text style={styles.cardTitle}>{label}</Text>
      <View style={styles.inline}>
        <Text style={styles.tiny}>{value}</Text>
        <ChevronRight size={14} color={colors.earth600} />
      </View>
    </View>
  );
}

function Progress({
  value,
  color,
  style,
}: {
  value: number;
  color: string;
  style?: object;
}) {
  return (
    <View style={[styles.progressTrack, style]}>
      <View style={[styles.progressFill, { width: `${value}%`, backgroundColor: color }]} />
    </View>
  );
}

function FauxCamera() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={["#5a4838", "#241a12", "#0a0604"]}
        start={{ x: 0.15, y: 0.15 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Text style={styles.panEmoji}>🍳</Text>
    </View>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.bulletRow}>
      <Sparkles size={12} color={colors.warm} />
      <Text style={styles.cameraBulletText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: colors.canvas },
  safe: { flex: 1, backgroundColor: colors.canvas },
  shell: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 112,
    backgroundColor: colors.canvas,
  },
  shellBleed: { paddingHorizontal: 0, paddingTop: 0 },
  shellHideNav: { paddingBottom: 24 },
  onboarding: {
    flex: 1,
    minHeight: "100%",
    paddingHorizontal: 24,
    paddingTop: 44,
    paddingBottom: 40,
    backgroundColor: colors.canvas,
  },
  flex1: { flex: 1 },
  pushBottom: { marginTop: "auto", paddingTop: 32 },
  mt8: { marginTop: 8 },
  mt12: { marginTop: 12 },
  mt16: { marginTop: 16 },
  mt20: { marginTop: 20 },
  mt24: { marginTop: 24 },
  mt28: { marginTop: 28 },
  mt32: { marginTop: 32 },
  serifHero: {
    fontFamily: "InstrumentSerif_400Regular",
    fontSize: 44,
    lineHeight: 45,
    color: colors.earth950,
  },
  serifTitle: {
    fontFamily: "InstrumentSerif_400Regular",
    fontSize: 40,
    lineHeight: 42,
    color: colors.earth950,
  },
  serifSubTitle: {
    fontFamily: "InstrumentSerif_400Regular",
    fontSize: 32,
    lineHeight: 36,
    color: colors.earth950,
  },
  bodyText: {
    maxWidth: 310,
    fontFamily: "InstrumentSans_400Regular",
    fontSize: 14,
    lineHeight: 21,
    color: colors.earth600,
  },
  bodyDark: {
    fontFamily: "InstrumentSans_400Regular",
    fontSize: 14,
    color: colors.earth800,
  },
  cardBody: {
    marginTop: 4,
    fontFamily: "InstrumentSans_400Regular",
    fontSize: 12,
    lineHeight: 18,
    color: colors.earth600,
  },
  eyebrow: {
    fontFamily: "InstrumentSans_600SemiBold",
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: colors.earth600,
  },
  warmEyebrow: {
    fontFamily: "InstrumentSans_600SemiBold",
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: colors.warm,
  },
  leafEyebrow: {
    fontFamily: "InstrumentSans_700Bold",
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.leaf,
  },
  stepList: { marginTop: 40, gap: 16 },
  infoCardRow: {
    flexDirection: "row",
    gap: 16,
    padding: 20,
    borderRadius: 24,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  warmIconBox: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: colors.warmSoft,
  },
  warmSolidBox: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: colors.warm,
    borderWidth: 4,
    borderColor: "rgba(198,106,43,0.2)",
  },
  cardTitle: {
    fontFamily: "InstrumentSans_600SemiBold",
    fontSize: 14,
    lineHeight: 19,
    color: colors.earth950,
  },
  smallCenter: {
    marginTop: 12,
    textAlign: "center",
    fontFamily: "InstrumentSans_400Regular",
    fontSize: 11,
    color: colors.earth600,
  },
  primaryButton: {
    minHeight: 54,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    fontFamily: "InstrumentSans_600SemiBold",
    fontSize: 14,
    color: colors.canvas,
  },
  inline: { flexDirection: "row", alignItems: "center", gap: 6 },
  inlineWide: { flexDirection: "row", alignItems: "center", gap: 12 },
  rowTop: { flexDirection: "row", alignItems: "flex-start", gap: 16 },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowBetweenEnd: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  softPanel: {
    padding: 20,
    borderRadius: 24,
    backgroundColor: "rgba(244,238,230,0.7)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  pill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  pillText: {
    fontFamily: "InstrumentSans_600SemiBold",
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  largeMetric: {
    marginTop: 6,
    fontFamily: "InstrumentSans_500Medium",
    fontSize: 24,
    color: colors.earth950,
  },
  rightSmall: {
    textAlign: "right",
    fontFamily: "InstrumentSans_400Regular",
    fontSize: 12,
    color: colors.earth600,
  },
  strong: { fontFamily: "InstrumentSans_600SemiBold", color: colors.earth950 },
  progressTrack: {
    height: 6,
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: colors.earth200,
  },
  progressFill: { height: "100%", borderRadius: 999 },
  sectionTitle: {
    marginBottom: 12,
    fontFamily: "InstrumentSans_600SemiBold",
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: colors.earth600,
  },
  sessionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  foodTile: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: colors.warmSoft,
  },
  emojiLarge: { fontSize: 28 },
  emojiMed: { fontSize: 24 },
  roundWarm: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: colors.warm,
  },
  tiny: {
    fontFamily: "InstrumentSans_400Regular",
    fontSize: 11,
    color: colors.earth600,
  },
  twoCol: { flexDirection: "row", gap: 12, marginTop: 12 },
  tileCard: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  leafCard: {
    backgroundColor: colors.leafSoft,
    borderColor: "rgba(63,138,99,0.15)",
  },
  warmCard: {
    backgroundColor: colors.warmSoft,
    borderColor: "rgba(198,106,43,0.15)",
  },
  smallFoodTile: {
    width: 40,
    height: 40,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: colors.earth100,
  },
  smallWhiteTile: {
    width: 40,
    height: 40,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  tileTitle: {
    marginBottom: 4,
    fontFamily: "InstrumentSans_500Medium",
    fontSize: 14,
    lineHeight: 18,
    color: colors.earth950,
  },
  scanCard: {
    marginTop: 24,
    padding: 20,
    borderRadius: 24,
    backgroundColor: colors.earth950,
  },
  scanEyebrow: {
    fontFamily: "InstrumentSans_600SemiBold",
    fontSize: 10,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: "rgba(250,234,219,0.9)",
  },
  scanTitle: {
    marginTop: 4,
    fontFamily: "InstrumentSerif_400Regular",
    fontSize: 22,
    color: colors.canvas,
  },
  scanBody: {
    marginTop: 4,
    fontFamily: "InstrumentSans_400Regular",
    fontSize: 12,
    lineHeight: 18,
    color: "rgba(252,250,247,0.7)",
  },
  shotSummary: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  shotStack: { flexDirection: "row" },
  shotThumb: {
    width: 36,
    height: 36,
    marginRight: -8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.earth950,
  },
  whiteStrong: { fontFamily: "InstrumentSans_600SemiBold", color: colors.canvas },
  dividerRow: { marginVertical: 24, flexDirection: "row", alignItems: "center", gap: 12 },
  divider: { flex: 1, height: 1, backgroundColor: colors.earth200 },
  dividerText: {
    fontFamily: "InstrumentSans_600SemiBold",
    fontSize: 10,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: colors.earth600,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  searchInput: {
    flex: 1,
    height: 34,
    fontFamily: "InstrumentSans_400Regular",
    fontSize: 14,
    color: colors.earth950,
  },
  addButton: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: colors.earth100,
  },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  darkChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: colors.earth950,
  },
  darkChipText: {
    fontFamily: "InstrumentSans_500Medium",
    fontSize: 12,
    color: colors.canvas,
  },
  lightChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  lightChipText: {
    fontFamily: "InstrumentSans_500Medium",
    fontSize: 12,
    color: colors.earth950,
  },
  pantryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  pantryItem: {
    width: "30.7%",
    minHeight: 88,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: 12,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  pantryActive: {
    backgroundColor: colors.warmSoft,
    borderColor: "rgba(198,106,43,0.3)",
  },
  pantryText: {
    textAlign: "center",
    fontFamily: "InstrumentSans_500Medium",
    fontSize: 11,
    color: colors.earth950,
  },
  warmText: { color: colors.warm },
  recipeHero: {
    height: 300,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  recipeEmoji: { fontSize: 72, opacity: 0.82 },
  topLeft: { position: "absolute", left: 16, top: 16 },
  suggested: {
    position: "absolute",
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(252,250,247,0.9)",
  },
  suggestedText: {
    fontFamily: "InstrumentSans_600SemiBold",
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.earth800,
  },
  recipeBody: {
    marginTop: -24,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 4,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.canvas,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 20,
    backgroundColor: "rgba(244,238,230,0.7)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  metaRowWhite: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  metaCell: { flex: 1, alignItems: "center" },
  metaDivider: { width: 1, alignSelf: "stretch", backgroundColor: colors.earth200 },
  metaLabel: {
    marginTop: 4,
    fontFamily: "InstrumentSans_600SemiBold",
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.earth600,
  },
  metaValue: {
    marginTop: 2,
    fontFamily: "InstrumentSans_600SemiBold",
    fontSize: 14,
    color: colors.earth950,
  },
  ingredientChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.earth200,
  },
  ingredientText: {
    fontFamily: "InstrumentSans_400Regular",
    fontSize: 14,
    color: colors.earth950,
  },
  coachNote: {
    padding: 20,
    borderRadius: 24,
    backgroundColor: colors.warmSoft,
    borderWidth: 1,
    borderColor: "rgba(198,106,43,0.15)",
  },
  coachQuote: {
    marginTop: 4,
    fontFamily: "InstrumentSerif_400Regular_Italic",
    fontSize: 19,
    lineHeight: 24,
    color: colors.earth950,
  },
  textButton: { paddingVertical: 14, alignItems: "center" },
  textButtonText: {
    fontFamily: "InstrumentSans_500Medium",
    fontSize: 14,
    color: colors.earth800,
  },
  liveSafe: { flex: 1, backgroundColor: colors.earth950 },
  liveViewport: { flex: 1, overflow: "hidden", backgroundColor: colors.earth950 },
  panEmoji: {
    position: "absolute",
    alignSelf: "center",
    top: "42%",
    fontSize: 64,
    opacity: 0.3,
  },
  liveTop: {
    position: "absolute",
    top: 24,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  liveCenter: { alignItems: "center", gap: 8 },
  livePill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  livePillText: {
    fontFamily: "InstrumentSans_500Medium",
    fontSize: 11,
    color: colors.white,
  },
  dots: { flexDirection: "row", alignItems: "center", gap: 4 },
  dot: { height: 6, borderRadius: 999 },
  dotWarm: { width: 6, backgroundColor: colors.warm },
  dotActive: { width: 16, backgroundColor: colors.white },
  dotMuted: { width: 6, backgroundColor: "rgba(255,255,255,0.3)" },
  sideControls: {
    position: "absolute",
    right: 16,
    top: "42%",
    gap: 8,
  },
  liveCircle: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  liveBottom: { position: "absolute", left: 16, right: 16, bottom: 24, gap: 12 },
  coachBubble: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  pulseWrap: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: colors.warmSoft,
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.warm,
  },
  coachLabel: {
    fontFamily: "InstrumentSans_600SemiBold",
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.earth600,
  },
  coachText: {
    marginTop: 3,
    fontFamily: "InstrumentSans_400Regular",
    fontSize: 15,
    lineHeight: 20,
    color: colors.earth950,
  },
  guidanceCard: {
    padding: 20,
    borderRadius: 28,
    backgroundColor: colors.canvas,
  },
  guidanceTitle: {
    fontFamily: "InstrumentSerif_400Regular",
    fontSize: 23,
    lineHeight: 27,
    color: colors.earth950,
  },
  buttonRow: { flexDirection: "row", gap: 8, marginTop: 16 },
  backButton: {
    flex: 1,
    paddingVertical: 13,
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: colors.earth100,
  },
  backButtonText: {
    fontFamily: "InstrumentSans_500Medium",
    color: colors.earth950,
  },
  nextButton: {
    flex: 2,
    paddingVertical: 13,
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: colors.earth950,
  },
  nextButtonText: {
    fontFamily: "InstrumentSans_600SemiBold",
    color: colors.canvas,
  },
  iconButtonLight: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "rgba(252,250,247,0.9)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  iconButtonDark: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  center: { alignItems: "center", paddingTop: 8 },
  centerText: { marginTop: 8, textAlign: "center" },
  leafRound: {
    width: 56,
    height: 56,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 28,
    backgroundColor: colors.leafSoft,
    borderWidth: 1,
    borderColor: "rgba(63,138,99,0.15)",
  },
  feedbackCard: {
    flex: 1,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
  },
  whitePanel: {
    padding: 20,
    borderRadius: 24,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  noticeRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginTop: 12 },
  noticeDot: { width: 6, height: 6, marginTop: 7, borderRadius: 3 },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  smallEarthBox: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: colors.earth100,
  },
  savingsSummary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderRadius: 24,
    backgroundColor: colors.leafSoft,
    borderWidth: 1,
    borderColor: "rgba(63,138,99,0.15)",
  },
  whiteIconBox: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  moneyText: {
    marginTop: 4,
    fontFamily: "InstrumentSerif_400Regular",
    fontSize: 32,
    color: colors.earth950,
  },
  warmSmall: {
    fontFamily: "InstrumentSans_500Medium",
    fontSize: 11,
    color: colors.warm,
  },
  leafSmall: {
    fontFamily: "InstrumentSans_500Medium",
    fontSize: 11,
    color: colors.leaf,
  },
  swapCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 10,
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  swapLine: {
    fontFamily: "InstrumentSans_400Regular",
    fontSize: 14,
    color: colors.earth950,
  },
  strike: { color: colors.earth600, textDecorationLine: "line-through" },
  savePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: colors.leafSoft,
  },
  saveText: {
    fontFamily: "InstrumentSans_600SemiBold",
    fontSize: 11,
    color: colors.leaf,
  },
  saleCard: {
    padding: 20,
    borderRadius: 24,
    backgroundColor: colors.warmSoft,
    borderWidth: 1,
    borderColor: "rgba(198,106,43,0.15)",
  },
  saleTitle: {
    marginTop: 8,
    fontFamily: "InstrumentSerif_400Regular",
    fontSize: 22,
    lineHeight: 26,
    color: colors.earth950,
  },
  tipCard: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  avatar: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: colors.warmSoft,
  },
  avatarText: {
    fontFamily: "InstrumentSerif_400Regular",
    fontSize: 22,
    color: colors.warm,
  },
  profileName: {
    fontFamily: "InstrumentSerif_400Regular",
    fontSize: 24,
    color: colors.earth950,
  },
  circleWhite: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  skillRow: { marginBottom: 16 },
  savedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
    padding: 12,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  savedEmoji: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: colors.earth100,
  },
  prefBox: {
    overflow: "hidden",
    borderRadius: 24,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  prefRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.earth200,
  },
  settingsRow: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  cameraSafe: { flex: 1, backgroundColor: colors.earth950 },
  cameraTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  iconButtonSpacer: { width: 40, height: 40 },
  cameraViewport: { flex: 1, overflow: "hidden" },
  permissionPanel: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  cameraIconLarge: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: colors.warmSoft,
  },
  cameraTitle: {
    marginTop: 20,
    textAlign: "center",
    fontFamily: "InstrumentSerif_400Regular",
    fontSize: 28,
    color: colors.white,
  },
  cameraBody: {
    marginTop: 8,
    maxWidth: 320,
    textAlign: "center",
    fontFamily: "InstrumentSans_400Regular",
    fontSize: 13,
    lineHeight: 19,
    color: "rgba(255,255,255,0.7)",
  },
  cameraBullets: { marginTop: 20, gap: 8 },
  bulletRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  cameraBulletText: {
    fontFamily: "InstrumentSans_400Regular",
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },
  cameraShots: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  cameraShotTitle: {
    fontFamily: "InstrumentSans_600SemiBold",
    fontSize: 10,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.7)",
  },
  cameraClear: {
    fontFamily: "InstrumentSans_400Regular",
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
  },
  cameraThumbWrap: { marginTop: 8, marginRight: 8 },
  cameraThumb: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  cameraThumbLabel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
    textAlign: "center",
    fontFamily: "InstrumentSans_500Medium",
    fontSize: 8,
    color: colors.white,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  cameraControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: colors.earth950,
  },
  shutter: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 36,
    backgroundColor: colors.white,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.2)",
  },
  shutterInner: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.earth950,
  },
  doneButton: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: colors.warm,
  },
  doneDisabled: { backgroundColor: "rgba(255,255,255,0.1)" },
  doneText: {
    fontFamily: "InstrumentSans_600SemiBold",
    fontSize: 14,
    color: colors.white,
  },
  doneTextDisabled: { color: "rgba(255,255,255,0.4)" },
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 8,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: "rgba(252,250,247,0.92)",
    borderTopWidth: 1,
    borderTopColor: "rgba(231,225,216,0.7)",
  },
  navItem: { flex: 1, alignItems: "center", gap: 4 },
  navIcon: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  navIconActive: { backgroundColor: colors.earth950 },
  navText: {
    fontFamily: "InstrumentSans_500Medium",
    fontSize: 10,
    color: colors.earth600,
  },
  navTextActive: { color: colors.earth950 },
});
