import { createFileRoute } from "@tanstack/react-router";
import { Section, FeatureCard } from "@/components/sevware/Section";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — Sevware Client" },
      { name: "description", content: "Crystal, Combat, Misc, Donut, Render and Client modules in Sevware." },
      { property: "og:title", content: "Features — Sevware Client" },
      { property: "og:description", content: "All modules included in the Sevware PvP Client." },
    ],
  }),
  component: FeaturesPage,
});

const groups = [
  { icon: "💎", title: "Crystal", items: ["Anchor Macro", "Auto Crystal", "Auto Hit Crystal", "Auto Inv Totem", "Auto Totem", "Double Anchor", "Hover Totem"] },
  { icon: "⚔", title: "Combat", items: ["Elytra Swap", "HitBox", "Mace Swap", "Static HitBoxes", "Aim Assist", "Auto Clicker", "Criticals", "Velocity", "Kill Aura", "TriggerBot", "Fakelag"] },
  { icon: "🔧", title: "Misc", items: ["Auto Eat", "Auto Firework", "Auto Mine", "Auto Tpa", "Auto Tool", "Cord Snapper", "Elytra Glide", "Fast Place", "Freecam", "Key Pearl", "Name Protect", "Weather Notifier", "Trident Boost", "Pearl Boost", "Coord Finder", "Packet Logger", "Quick Macro"] },
  { icon: "🍩", title: "Donut", items: ["Chunk Finder", "Anti Trap", "Auction Sniper", "Auto Sell", "Auto Spawner Sell", "Bone Dropper", "Netherite Finder", "Rtp Base Finder", "RTP End Base Finder", "Shulker Dropper", "Tunnel Base Finder", "Spawner Protection"] },
  { icon: "👁", title: "Render", items: ["Animations", "FullBright", "HUD", "Kelp ESP", "NoRender", "Player ESP", "Storage ESP", "Swing Speed", "Target HUD", "Trident ESP", "Fake Stats", "Block ESP"] },
  { icon: "💻", title: "Client", items: ["Sevware Settings", "Self Destruct", "Friendname", "Search Modules"] },
];

function FeaturesPage() {
  return (
    <Section eyebrow="Modules" title="Features" subtitle="Packed with powerful modules for every playstyle">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((g) => (
          <FeatureCard key={g.title} {...g} />
        ))}
      </div>
    </Section>
  );
}