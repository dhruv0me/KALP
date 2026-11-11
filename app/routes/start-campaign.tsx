import { IconArrowUpRight, IconPlant2 } from "@tabler/icons-react";
import { Link } from "react-router";
import { useSession } from "@/hooks/use-session";

export function meta() {
  return [{ title: "Start a Campaign — KALP" }];
}

export default function StartCampaignRoute() {
  const { email } = useSession();

  return (
    <main className="availability-page">
      <div className="empty-icon" aria-hidden="true">
        <IconPlant2 size={32} />
      </div>
      <div className="eyebrow">
        <span className="eyebrow-dot" />
        AUTHENTICATED CREATOR PORTAL{email ? ` · ${email}` : ""}
      </div>
      <h1>
        Campaign creation is <em>coming soon.</em>
      </h1>
      <p>
        You are signed in and ready for creator onboarding, but live campaign
        submission and blockchain milestone verification are not enabled yet.
      </p>
      <Link className="button button-dark" to="/explore">
        Explore Campaigns <IconArrowUpRight size={17} aria-hidden="true" />
      </Link>
    </main>
  );
}
